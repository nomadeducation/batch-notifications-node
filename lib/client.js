// each part is a Batch API: `Campaigns`, `Transactional`, `Custom data`, etc.
// for now we just implement the `Campaings` API.
const parts = ["Campaigns"];

parts.forEach(function (part) {
    exports[part] = require(`./part/${part.toLowerCase()}`)[part];
});

exports.createClient = function (options) {
    const client = {};

    parts.forEach(function (part) {
        client[part.toLowerCase()] = new exports[part](options);
    });

    return client;
};
