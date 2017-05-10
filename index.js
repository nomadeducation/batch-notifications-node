const Request = require("./lib/utils/Request");
const Campaign = require("./lib/Campaign");

/**
 * @param {Object} opts contains the user API keys
 * @returns {{
 *     campaign: Campaign
 * }}
 */
module.exports = function BatchClient (opts) {
    const req = Request.init(opts);

    return {
        campaign: Campaign(req)
    };
};
