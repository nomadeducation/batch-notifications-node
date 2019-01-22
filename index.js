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
    return {
        campaign: new Campaign(opts),
        transactional: new Transactional(opts),
        customData: new CustomData(opts)
    };
};
