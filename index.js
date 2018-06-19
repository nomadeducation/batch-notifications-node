const Config = require("./lib/utils/Config");
const Campaign = require("./lib/Campaign");
const Transactional = require("./lib/Transactional");
const CustomData = require("./lib/CustomData.js");

/**
 * @param {Object} opts contains the user API keys
 * @returns {{
 *     campaign: Campaign,
 *     transactional: Transactional,
 *     customData: CustomData
 * }}
 */
module.exports = function BatchClient (opts) {
    const cfg = new Config();
    cfg.setUserOptions(opts);

    return {
        campaign: new Campaign(cfg),
        transactional: new Transactional(cfg),
        customData: new CustomData(cfg)
    };
};
