const axios = require("axios");
const log = require("./Logger");

class Request {
    /**
     * @param {Config} cfg
     * @returns {Axios} instance
     * @throws {Error} if the Batch API key is missing
     */
    constructor (cfg) {

        // use live key in production
        const isProd = (process.env.NODE_ENV === "production");
        let keyFromEnv;

        if (isProd) {
            keyFromEnv = "api.liveKey";
        } else {
            keyFromEnv = "api.devKey";
        }

        const key = cfg.get(keyFromEnv);

        // check that the key is set for the right env.
        if (!key) {
            throw new Error(`missing key "${keyFromEnv}" for the env. "${process.env.NODE_ENV}"`);
        }

        const url = `${cfg.get("api.baseURL")}/${cfg.get("api.version")}/${key}`;

        this.axiosInstance = axios.create({
            baseURL: url,
            validateStatus: function (status) {
                return status >= 100 && status < 400;
            }
        });

        // Alter defaults after instance has been created
        this.axiosInstance.defaults.headers.common["X-Authorization"] = cfg.get("api.restKey");
        this.axiosInstance.defaults.headers.post["Content-Type"] = "application/json";
        this.axiosInstance.defaults.timeout = cfg.get("axios.timeout");

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

        this.axiosInstance.interceptors.response.use(successResponse, failResponse);

        return this.axiosInstance;
    }
}

module.exports = Request;
