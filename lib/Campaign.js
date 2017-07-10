const Ajv = require("ajv");
const Request = require("./utils/Request");
const parameters = require("../config/parameters/campaign");

const ajv = new Ajv({allErrors: true});
const validate = ajv.compile(parameters);

class Campaign {
    /**
     *
     * @param {Config} cfg
     */
    constructor (cfg) {
        this.request = new Request(cfg);
    }

    /**
     * @param {Object} payload
     * @returns {Promise.<String, Error>} get the campaign token if fulfilled
     */
    create (payload) {
        // don't send the payload if it's malformed
        const isValid = validate(payload);

        if (!isValid) {
            return Promise.reject(new Error(`payload invalid. Reason: "${ajv.errorsText(validate.errors)}"`));
        }

        return this.request.post("/campaigns/create", payload)
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
    update (token, payload) {
        if (!token || typeof token !== "string") {
            return Promise.reject(new Error("the token must be a non-empty string"));
        }

        // do not validate ATM since the doc is too vague
        // about what is a valid payload when updating

        return this.request.post(`/campaigns/update/${token}`, payload)
        .then(() => void 0);
    }

    /**
     * @param {String} token
     * @returns {Promise.<Object, Error>} get the campaign stats if fulfilled.
     * The result contains the following properties:
     * - date: Date
     * - sent: Number
     * - direct_open: Number
     * - influenced_open: Number
     * - open_rate: Number
     * - reengaged: Number
     * - errors: Number
     *
     * You can refer to the official docs to get the details:
     * @link https://batch.com/doc/dashboard/push/analytics.html
     */
    stats (token) {
        if (!token || typeof token !== "string") {
            return Promise.reject(new Error("the token must be a non-empty string"));
        }

        return this.request.get(`/campaigns/stats/${token}`)
        .then(function (response) {
            const detailKey = "detail";

            if (!response.data.hasOwnProperty(detailKey)) {
                return Promise.reject(new Error(`the response is malformed. Reason: missing "${detailKey}" key`));
            }

            const details = response.data.detail;

            if (!Array.isArray(details)) {
                return Promise.reject(new Error(`the response is malformed. Reason: the "${detailKey}" key must be ar array`));
            }

            // default result
            const result = {
                date: new Date(0),
                sent: 0,
                direct_open: 0,
                influenced_open: 0,
                open_rate: 0,
                reengaged: 0,
                errors: 0
            };

            // the stats are given only when the push campaign was effectively sent
            if (details.length > 0) {
                // fetch only the first element atm
                const detail = details[0];

                result.date = new Date(detail.date);
                result.sent = detail.sent;
                result.direct_open = detail.direct_open;
                result.influenced_open = detail.influenced_open;
                result.reengaged = detail.reengaged;
                result.errors = detail.errors;

                // set the open rate dynamically since it's not given by default
                if (detail.sent > 0) {
                    result.open_rate = (detail.direct_open + detail.influenced_open) / detail.sent;
                }
            }

            return result;
        });
    }
}

/**
 * @returns {Campaign}
 */
module.exports = Campaign;
