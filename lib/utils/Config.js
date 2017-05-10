const _ = require("lodash");
const Ajv = require("ajv");
const defaultOptions = require("../../config/default");
const userOptions = require("../../config/userOptions");
const log = require("./Logger");

class ConfigStore {
    constructor () {
        this.ajv = new Ajv({
            allErrors: true,
            useDefaults: true,
            coerceTypes: true
        });
        this.validate = this.ajv.compile(userOptions);

        // retrieve default values
        this.options = defaultOptions;
    }

    /**
     * Merge default options with the given options
     *
     * @param {Object} [userOptions={}]
     * @returns {Boolean} true if updated successfully, else false (see logs)
     */
    update (userOptions = {}) {
        const isValid = this.validate(userOptions);

        if (!isValid) {
            log.error(this.ajv.errorText(this.validate.errors));

            return false;
        }

        // deep merge values in case user would want to update sub-properties
        // e.g. changing only "bar" value to `true` in `{ foo: { bar: false, baz: false } }`
        // XXX atm, we only consider API "custom" configuration
        _.merge(this.options, {api: userOptions});

        return true;
    }
}

// instantiate only one store
let globalConfig = new ConfigStore();

module.exports = {
    /**
     * Note that this will overwrite current config entries !
     *
     * @param {Object} opts
     * @returns {Boolean} true in case of succeeded update
     */
    setUserOptions (opts) {
        return globalConfig.update(opts);
    },

    /**
     *
     * @param {String} key
     * @returns {Boolean}
     */
    has (key) {
        return _.has(globalConfig.options, key);
    },

    /**
     *
     * @param {String} key
     * @returns {String} empty if the key doesn't exist
     */
    get (key) {
        return _.get(globalConfig.options, key, "");
    }
};
