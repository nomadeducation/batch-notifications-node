// log options must not depends on the Config store
// to avoid circular dependencies
module.exports = {
    // see https://github.com/trentm/node-bunyan#constructor-api
    // to get the complete list of bunyan options
    name: "node-batch",
    level: "info"
};
