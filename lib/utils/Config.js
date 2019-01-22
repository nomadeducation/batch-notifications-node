const _ = require("lodash");
const Ajv = require("ajv");
const defaultOptions = require("../../config/default");
const userOptions = require("../../config/userOptions");
const log = require("./Logger");

// compile the schema validator once
const ajv = new Ajv({
    allErrors: true,
    useDefaults: true,
    coerceTypes: true
});
const validate = ajv.compile(userOptions);

class Config {
    constructor () {
        // retrieve default values
        this.options = _.cloneDeep(defaultOptions);
    }

    /**
     * Merge default options with the given options
     * Note that this will overwrite current config entries !
     *
     * @param {Object} [userOpts={}]
     * @returns {Boolean} true if updated successfully, else false (see logs)
     */
    setUserOptions (userOpts = {}) {
        const isValid = validate(userOpts);

        if (!isValid) {
            log.error(ajv.errorsText(validate.errors));

            return false;
        }

        const apiKeys = _.pick(userOpts, ["restKey", "devKey", "liveKey"]);
        _.merge(this.options.api, apiKeys);

        this.options.logger = _.get(userOpts, "logger", log);

        return true;
    }

    /**
     *
     * @param {String} key
     * @returns {Boolean}
     */
    has (key) {
        return _.has(this.options, key);
    }

    /**
     *
     * @param {String} key
     * @returns {String} empty if the key doesn't exist
     */
    get (key) {
        return _.get(this.options, key, "");
    }
}

module.exports = Config;
