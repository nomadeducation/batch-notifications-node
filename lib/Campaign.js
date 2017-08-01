const querystring = require("querystring");
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
     * Create a new campaign using the given payload
     * @see {@link https://batch.com/doc/api/campaigns/parameters.html} to get the possible parameters
     *
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
     * the possible parameters to create a payload is on the following link:
     * @see {@link https://batch.com/doc/api/campaigns/parameters.html}
     *
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
     * Since `delete` is a reserved word, "remove" has been chosen as a synonym
     *
     * @param {String} token
     * @returns {Promise.<undefined, Error>}
     */
    remove (token) {
        if (!token || typeof token !== "string") {
            return Promise.reject(new Error("the token must be a non-empty string"));
        }

        return this.request.post(`/campaigns/delete/${token}`)
        .then(() => void 0);
    }

    /**
     * campaign infos are composed of *at least* the following properties
     *
     * @typedef {Object} CampaignInfos
     * @property {String} campaign_token
     * @property {Boolean} from_api
     * @property {Boolean} dev_only
     * @property {Date} created_date
     * @property {String} name
     * @property {Boolean} live
     * @property {Date} push_time
     *
     * to get the complete list:
     * @see {@link https://batch.com/doc/api/campaigns/parameters.html}
     */

    /**
     * Warning: You'll have to use your "live" key in order to fetch the details!
     *
     * You can refer to the official docs to get the details:
     * @see {@link https://batch.com/doc/api/campaigns/get-campaign.html}
     *
     * @param {String} token
     * @returns {Promise.<CampaignInfos, Error>}
     */
    get (token) {
        if (!token || typeof token !== "string") {
            return Promise.reject(new Error("the token must be a non-empty string"));
        }

        return this.request.get(`/campaigns/${token}`)
        .then(response => response.data);
    }

    /**
     * Warning: You'll have to use your "live" key in order to fetch the listing!
     *
     * You can refer to the official docs to get the details:
     * @see {@link https://batch.com/doc/api/campaigns/get-campaign.html}
     *
     * @param {Number} [from=0]
     * @param {Number} [limit=10] the maximum allowed value is 100
     * @param {Boolean} [live]
     * @param {Boolean} [fromAPI]
     * @returns {Promise.<Array.<CampaignInfos>, Error>}
     */
    list (from = 0, limit = 10, live, fromAPI) {
        const queryParams = {
            from,
            limit
        };

        // only add the following parameters if there're set
        if (typeof live === "boolean") queryParams.live = live;
        if (typeof fromAPI === "boolean") queryParams.from_api = fromAPI;

        const queryString = querystring.stringify(queryParams);

        return this.request.get(`/campaigns/list?${queryString}`)
        .then(response => response.data);
    }

    /**
     * Check if the token exists for the API key
     *
     * @param {String} token
     * @returns {Promise.<Boolean, Error>}
     */
    has (token) {
        return this.get(token)
        .then(() => true)
        .catch(() => false);
    }

    /**
     * Force the activation of one campaign
     *
     * @param {String} token
     * @returns {Promise.<undefined, Error>}
     */
    enable (token) {
        return this.update(token, {live: true});
    }

    /**
     * Disable one campaign
     *
     * @param {String} token
     * @returns {Promise.<undefined, Error>}
     */
    disable (token) {
        return this.update(token, {live: false});
    }

    /**
     * campaign stats are composed of the following properties
     * @typedef {Object} Stats
     * @property {Date} date
     * @property {Number} sent
     * @property {Number} direct_open
     * @property {Number} influenced_open
     * @property {Number} open_rate
     * @property {Number} reengaged
     * @property {Number} errors
     */

    /**
     * @param {String} token
     * @returns {Promise.<Stats, Error>} get the campaign stats if fulfilled.
     *
     * You can refer to the official docs to get the details:
     * @see {@link https://batch.com/doc/dashboard/push/analytics.html}
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
