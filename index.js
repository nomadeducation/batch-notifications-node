const Config = require("./lib/utils/Config");
const Campaign = require("./lib/Campaign");

/**
 * @param {Object} opts contains the user API keys
 * @returns {{
 *     campaign: Campaign
 * }}
 */
module.exports = function BatchClient (opts) {
    const cfg = new Config();
    cfg.setUserOptions(opts);

    return {
        campaign: new Campaign(cfg)
    };
};
