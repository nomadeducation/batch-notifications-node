const bunyan = require("bunyan");
const logOptions = require("../../config/log");

// override log level when it's executed in the production env.
if (process.env.NODE_ENV === "production") {
    logOptions.level = "error";
}

module.exports = bunyan.createLogger(logOptions);
