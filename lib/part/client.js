const request = require("request");

const failCodes = {
    401: "AUTHENTICATION_INVALID",
    404: "ROUTE_NOT_FOUND",
    // HTTP status code 400 can match multiple errors. We are only displaying the first one so far
    // @link: https://batch.com/doc/api/campaigns/create.html#_failure
    400: "MISSING_PARAMETER",
    500: "SERVER_ERROR",
    503: "MAINTENANCE_ERROR"
};

const defaultOptions = {
    remoteUri: "https://api.batch.com/1.1"
};

const Client = exports.Client = function (options) {
    this.options = options || defaultOptions;
    if (!this.options.remoteUri) {
        this.options.remoteUri = defaultOptions.remoteUri;
    }
    this._request = request;

    if (typeof this.options.get !== "function") {
        this.options.get = function (key) {
            return this[key];
        };
    }
};

/**
 * PRIVATE function `request`
 * Makes a request to `this.remoteUri + uri` using `method` and any `body`
 * (JSON-only) if supplied. Short circuits to `callback` if the response code
 *
 * @param {String} method HTTP method to use
 * @param {Array} uri Locator for the Remote Ressource
 * @param {String} [authKey] authKey if needed
 * @param {Object} [body] JSON Request Body
 * @callback {function} callback - Continuation to call if errors occur
 * @callback {fonction} success - Continuation to call upon successful transactions
 *
 */
Client.prototype.request = function (method, uri, authKey /* variable arguments */) {
    const args = Array.prototype.slice.call(arguments);
    const success = args.pop();
    const callback = args.pop();
    const body = typeof args[args.length - 1] === "object" && ! Array.isArray(args[args.length - 1]) && args.pop();

    const options = {
        method: method || "GET",
        uri: `${this.options.get("remoteUri")}/${uri.join("/")}`,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (authKey) {
        options.headers["X-Authorization"] = authKey;
    }

    if (body) {
        options.body = JSON.stringify(body);
    } else if (method !== "GET") {
        options.body = "{}";
    }

    this._request(options, function (error, response, body) {
        // pretty format for connection refused error
        if (error && error.errno === "ECONNREFUSED") {
            error.message = `Unable to connect to ${options.uri.magenta}`;
            error.message += " (Connection Refused)".red;
            delete error.stack;
        }

        if (error) {
            return callback && callback(error); // done
        }

        let statusCode, result, err;

        try {
            statusCode = response.statusCode.toString();
            result = JSON.parse(body);
        } catch (ex) {
            // ignore errors
        }

        if (Object.keys(failCodes).indexOf(statusCode) !== -1) {
            err = new Error(`Batch Error (${statusCode}): ${failCodes[statusCode]}`);
            err.statusCode = statusCode;
            err.result = result;
            return callback && callback(err); // done
        }

        success(response, result);
    });
};
