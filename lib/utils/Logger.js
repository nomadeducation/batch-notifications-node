const bunyan = require("bunyan");
const logOptions = require("../../config/log");

// override log level when it's executed in the production env.
if (process.env.NODE_ENV === "production") {
    logOptions.level = "error";
// silence the logger during tests
} else if (process.env.NODE_ENV === "test") {
    logOptions.level = bunyan.FATAL + 1;
}

module.exports = bunyan.createLogger(logOptions);
