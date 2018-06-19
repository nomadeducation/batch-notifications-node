const expect = require("chai").expect;
const nock = require("nock");
const Config = require("../lib/utils/Config");
const CustomData = require("../lib/CustomData");
const fixture = require("./fixtures/customData");
const options = require("./fixtures/options");

/**
 * @returns {CustomData}
 */
function createCustomDataHandler () {
    const cfg = new Config();
    cfg.setUserOptions(options);
    return new CustomData(cfg);
}

/**
 * @returns {String}
 */
function getURL () {
    const cfg = new Config();
    cfg.setUserOptions(options);
    return `${cfg.get("api.baseURL")}/${cfg.get("api.version")}/${cfg.get("api.devKey")}`;
}

describe("Custom Data save", function () {
    it("should set custom data to a specific user", function (done) {
        const CustomData = createCustomDataHandler();
        const batchURL = getURL();

        const userId = fixture.saveMinimal.userId;
        const payload = fixture.saveMinimal.payload;
        const reply = fixture.saveMinimal.reply;
        const status = fixture.saveMinimal.statusCode;

        nock(batchURL)
        .post(`/data/users/${userId}`, payload)
        .reply(status, reply);

        CustomData.save(userId, payload)
        .then(function (result) {
            expect(result).to.be.equal(reply.token);
            done();
        })
        .catch((err) => done(err));
    });
});

describe("Custom Data bulk save", function () {
    it("should set custom data to an array of users", function (done) {
        const CustomData = createCustomDataHandler();
        const batchURL = getURL();

        const payload = fixture.saveBulkMinimal.payload;
        const reply = fixture.saveBulkMinimal.reply;
        const status = fixture.saveBulkMinimal.statusCode;

        nock(batchURL)
        .post("/data/users", payload)
        .reply(status, reply);

        CustomData.saveBulk(payload)
        .then(function (result) {
            expect(result).to.be.equal(reply.token);
            done();
        })
        .catch((err) => done(err));
    });
});

describe("Custom Data delete", function () {
    it("should delete custom data of a specific user", function (done) {
        const CustomData = createCustomDataHandler();
        const batchURL = getURL();

        const userId = fixture.deleteMinimal.userId;
        const reply = fixture.deleteMinimal.reply;
        const status = fixture.deleteMinimal.statusCode;

        nock(batchURL)
        .delete(`/data/users/${userId}`)
        .reply(status, reply);

        CustomData.delete(userId)
        .then(function (result) {
            expect(result).to.be.equal(reply.token);
            done();
        })
        .catch((err) => done(err));
    });
});

describe("Custom Data bulk delete", function () {
    it("should delete custom data from an array of users", function (done) {
        const CustomData = createCustomDataHandler();
        const batchURL = getURL();

        const payload = fixture.deleteBulkMinimal.payload;
        const reply = fixture.deleteBulkMinimal.reply;
        const status = fixture.deleteBulkMinimal.statusCode;

        nock(batchURL)
        .delete("/data/users", payload)
        .reply(status, reply);

        CustomData.deleteBulk(payload)
        .then(function (result) {
            expect(result).to.be.equal(reply.token);
            done();
        })
        .catch((err) => done(err));
    });
});
