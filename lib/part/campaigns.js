/*
 * campaigns.js: Client for Batch Campaigns API
 *
 */

const Client = require('./client').Client,


let Campaigns = exports.Campaigns = function (options) {
    Client.call(this, options);
};

Campaigns.prototype.create = function (appAuthKey, payload, callback) {
    const requiredContents = [
        "name",
        "live",
        "messages"
    ];
    const hasRequiredContents = requiredContents.every(content => payload.includes(content));

    if (!hasRequiredContents) {
        return callback(new Error("Batch Error: required content parameter missing (name, live, or messages)"));
    }

    const hasValidTime =
        payload.hasOwnProperty("push_time") ^
        payload.hasOwnProperty("local_push_time");

    if (!hasValidTime) {
        const errorMessage = `
            Batch Error: invalid time parameter.
            Notification content must include one and only one of 'push_time' and local_push_time'
        `;
        return callback(new Error(errorMessage));
    }

    if (!Array.isArray(payload.messages)) {
        return callback(new Error("Batch Error: 'messages' must be an Array"));
    }

    this.request('POST', ['campaigns'], restApiKey, params, callback, function (res, result) {
        callback(null, result);
    });
};
