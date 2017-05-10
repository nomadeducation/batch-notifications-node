const Ajv = require("ajv");
const parameters = require("../config/parameters/campaign");

const ajv = new Ajv({allErrors: true});
const validate = ajv.compile(parameters);

let request;

class Campaign {
    /**
     * @param {Object} payload
     * @returns {Promise.<String, Error>} get the campaign token if fulfilled
     */
    static create (payload) {
        // don't send the payload if it's malformed
        const isValid = validate(payload);

        if (!isValid) {
            return Promise.reject(new Error(`payload invalid. Reason: "${ajv.errorsText(validate.errors)}"`));
        }

        return request.post("/campaigns/create", payload)
        .then(function (response) {
            const tokenKey = "campaign_token";

            if (!response.data.hasOwnProperty(tokenKey)) {
                return Promise.reject(new Error(`the response is malformed. Reason: missing "${tokenKey}" key`));
            }

            return response.data[tokenKey];
        });
    }

    /**
     * @param {String} token
     * @param {Object} payload
     * @returns {Promise.<undefined, Error>}
     */
    static update (token, payload) {
        // don't send the payload if it's malformed
        const isValid = validate(payload);

        if (!isValid) {
            return Promise.reject(new Error(`payload invalid. Reason: "${ajv.errorsText(validate.errors)}"`));
        }

        return request.post(`/campaigns/update/${token}`, payload);
    }
}

/**
 * @param {Axios} req
 * @returns {Campaign}
 */
module.exports = function (req) {
    request = req;
    return Campaign;
};
