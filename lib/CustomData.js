const Ajv = require("ajv");
const Request = require("./utils/Request");
const parameters = require("../config/parameters/customData");

const ajv = new Ajv({allErrors: true});

class CustomData {
    /**
     *
     * @param {Config} cfg
     */
    constructor (cfg) {
        // the Custom Data API only works on v1.0
        cfg.options.api.version = "1.0";
        this.request = new Request(cfg);
    }

    /**
     * Set user data using the given payload on the specified user
     * @see {@link https://batch.com/doc/api/custom-data-api/set-update.html} to get the possible parameters
     *
     * @param {String} userId
     * @param {Object} payload
     * @returns {Promise.<String, Error>} get the custom data token if fulfilled
     */
    postSpecific (userId, payload) {
        // don't send the payload if it's malformed
        const validate = ajv.compile(parameters.saveMinimal);
        const isValid = validate(payload);

        if (!isValid) {
            return Promise.reject(new Error(`payload invalid. Reason: "${ajv.errorsText(validate.errors)}"`));
        }

        return this.request.post(`/data/users/${userId}`, payload)
        .then(function (response) {
            const tokenKey = "token";

            if (!response.data.hasOwnProperty(tokenKey)) {
                return Promise.reject(new Error(`the response is malformed. Reason: missing "${tokenKey}" key`));
            }

            return response.data[tokenKey];
        });
    }

    /**
     * Set user data in bulk of users using the given payload
     * @see {@link https://batch.com/doc/api/custom-data-api/set-update.html} to get the possible parameters
     *
     * @param {Object} payload
     * @returns {Promise.<String, Error>} get the custom data token if fulfilled
     */
    postBulk (payload) {
        // don't send the payload if it's malformed
        const validate = ajv.compile(parameters.saveBulkMinimal);
        const isValid = validate(payload);

        if (!isValid) {
            return Promise.reject(new Error(`payload invalid. Reason: "${ajv.errorsText(validate.errors)}"`));
        }

        return this.request.post("/data/users", payload)
        .then(function (response) {
            const tokenKey = "token";

            if (!response.data.hasOwnProperty(tokenKey)) {
                return Promise.reject(new Error(`the response is malformed. Reason: missing "${tokenKey}" key`));
            }

            return response.data[tokenKey];
        });
    }

    /**
     * Delete the user data of a specified user
     * @see {@link https://batch.com/doc/api/custom-data-api/delete.html}
     *
     * @param {String} userId
     * @returns {Promise.<String, Error>} get the custom data token if fulfilled
     */
    deleteSpecific (userId) {
        return this.request.delete(`/data/users/${userId}`)
        .then(function (response) {
            const tokenKey = "token";

            if (!response.data.hasOwnProperty(tokenKey)) {
                return Promise.reject(new Error(`the response is malformed. Reason: missing "${tokenKey}" key`));
            }

            return response.data[tokenKey];
        });
    }

    /**
     * Delete the user data in bulk of the users defined in the payload
     * @see {@link https://batch.com/doc/api/custom-data-api/set-update.html} to get the possible parameters
     *
     * @param {Object} payload
     * @returns {Promise.<String, Error>} get the custom data token if fulfilled
     */
    deleteBulk (payload) {
        // don't send the payload if it's malformed
        const validate = ajv.compile(parameters.deleteBulkMinimal);
        const isValid = validate(payload);

        if (!isValid) {
            return Promise.reject(new Error(`payload invalid. Reason: "${ajv.errorsText(validate.errors)}"`));
        }

        return this.request.delete("/data/users", {data: payload})
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
 * @returns {CustomData}
 */
module.exports = CustomData;
