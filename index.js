const Config = require("./lib/utils/Config");
const Campaign = require("./lib/Campaign");
const Transactional = require("./lib/Transactional");

/**
 * @param {Object} opts contains the user API keys
 * @returns {{
 *     campaign: Campaign,
 *     transactional: Transactional
 * }}
 */
module.exports = function BatchClient (opts) {
    const cfg = new Config();
    cfg.setUserOptions(opts);

    return {
        campaign: new Campaign(cfg),
        transactional: new Transactional(cfg)
    };
};
