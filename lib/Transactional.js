const Ajv = require("ajv");
const Request = require("./utils/Request");
const parameters = require("../config/parameters/transactional");

const ajv = new Ajv({allErrors: true});
const validate = ajv.compile(parameters);


class Transactional {
    /**
     *
     * @param {Config} cfg
     */
    constructor (cfg) {
        this.request = new Request(cfg);
    }

    /**
     * Post a new transactional notification using the given payload
     * @see {@link https://batch.com/doc/api/transactional.html} to get the possible parameters
     *
     * @param {Object} payload
     * @returns {Promise.<String, Error>} get the transactional token if fulfilled
     */
    post (payload) {
        // don't send the payload if it's malformed
        const isValid = validate(payload);

        if (!isValid) {
            return Promise.reject(new Error(`payload invalid. Reason: "${ajv.errorsText(validate.errors)}"`));
        }

        return this.request.post("/transactional/send", payload)
        .then(function (response) {
            const tokenKey = "token";

            if (!response.data.hasOwnProperty(tokenKey)) {
                return Promise.reject(new Error(`the response is malformed. Reason: missing "${tokenKey}" key`));
            }

            return response.data[tokenKey];
        });
    }
}

/**
 * @returns {Transactional}
 */
module.exports = Transactional;
