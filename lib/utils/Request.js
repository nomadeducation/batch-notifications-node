const axios = require("axios");
const Config = require("./Config");
const log = require("./Logger");

// store only one instance of Axios
let axiosInstance;

class Request {
    /**
     * @param {Object} keys
     * @returns {Axios} instance
     * @throws {Error} if the Batch API key is missing
     */
    static init (keys) {
        if (axiosInstance) {
            return axiosInstance;
        }

        Config.setUserOptions(keys);

        // use live key in production
        const isProd = (process.env.NODE_ENV === "production");
        let keyFromEnv;

        if (isProd) {
            keyFromEnv = "api.liveKey";
        } else {
            keyFromEnv = "api.devKey";
        }

        const key = Config.get(keyFromEnv);

        // check that the key is set for the right env.
        if (!key) {
            throw new Error(`missing key "${keyFromEnv}" for the env. "${process.env.NODE_ENV}"`);
        }

        const url = `${Config.get("api.baseURL")}/${Config.get("api.version")}/${key}`;

        axiosInstance = axios.create({
            baseURL: url,
            validateStatus: function (status) {
                return status >= 100 && status < 400;
            }
        });

        // Alter defaults after instance has been created
        axiosInstance.defaults.headers.common["X-Authorization"] = Config.get("api.restKey");
        axiosInstance.defaults.headers.post["Content-Type"] = "application/json";
        axiosInstance.defaults.timeout = Config.get("axios.timeout");

        const successResponse = function (response) {
            const request = response.request;
            log.debug(`${request.method} ${request.path} returns "${response.status} ${response.statusText}"`);

            return response;
        };

        const failResponse = function (error) {
            if (error.response) {
                const failureCodes = new Map([
                    ["401-10", "authentication is invalid"],
                    ["404-20", "route was not found"],
                    ["400-30", "missing parameter"],
                    ["400-31", "Malformed parameter"],
                    ["400-32", "malformed JSON body"],
                    ["500-1", "an error occured on the server"],
                    ["503-2", "maintenance error"]
                ]);

                // The request was made and the server responded with a status code
                // that falls in the range 4xx - 5xx
                const failureKey = `${error.response.status}-${error.response.data.code}`;
                const message = error.response.data.message || failureCodes.get(failureKey);

                log.error(`${error.request.method} ${error.request.path} has failed. Reason: "${message})}"`);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of http.ClientRequest
                log.error(`No response from ${error.request.method} ${error.request.path}`);
            } else {
                // Something happened in setting up the request that triggered an Error
                log.error(error.message);
            }

            return Promise.reject(error);
        };

        axiosInstance.interceptors.response.use(successResponse, failResponse);

        return axiosInstance;
    }
}

module.exports = Request;
