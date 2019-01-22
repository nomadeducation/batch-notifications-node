const expect = require("chai").expect;
const mock = require("./requestMock");
const Config = require("../lib/utils/Config");
const Transactional = require("../lib/Transactional");
const fixture = require("./fixtures/transactional");
const options = require("./fixtures/options");

/**
 * @returns {Transactional}
 */
function createTransactionalHandler () {
    return new Transactional(options);
}

/**
 * @returns {String}
 */
function getURL () {
    const cfg = new Config();
    cfg.setUserOptions(options);
    return `${cfg.get("api.baseURL")}/${cfg.get("api.version")}/${cfg.get("api.devKey")}`;
}

describe("Transactional post", function () {
    it("should create a Transactional", function (done) {
        const Transactional = createTransactionalHandler();
        const batchURL = getURL();

        const payload = fixture.postMinimal.payload;
        const reply = fixture.postMinimal.reply;
        const status = fixture.postMinimal.statusCode;

        mock.onPost(`${batchURL}/transactional/send`, payload)
        .reply(status, reply);

        Transactional.post(payload)
        .then(function (result) {
            expect(result).to.be.equal(reply.token);
            done();
        })
        .catch((err) => done(err));
    });
});
