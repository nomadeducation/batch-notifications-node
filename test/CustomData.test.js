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
        const token = fixture.saveMinimal.token;
        const status = fixture.saveMinimal.statusCode;

        nock(batchURL)
        .post(`/data/users/${userId}`, payload)
        .reply(status, token);

        CustomData.postSpecific(userId, payload)
        .then(function (result) {
            expect(result).to.be.equal(token.token);
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
        const token = fixture.saveBulkMinimal.token;
        const status = fixture.saveBulkMinimal.statusCode;

        nock(batchURL)
        .post("/data/users", payload)
        .reply(status, token);

        CustomData.postBulk(payload)
        .then(function (result) {
            expect(result).to.be.equal(token.token);
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
        const token = fixture.deleteMinimal.token;
        const status = fixture.deleteMinimal.statusCode;

        nock(batchURL)
        .delete(`/data/users/${userId}`)
        .reply(status, token);

        CustomData.deleteSpecific(userId)
        .then(function (result) {
            expect(result).to.be.equal(token.token);
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
        const token = fixture.deleteBulkMinimal.token;
        const status = fixture.deleteBulkMinimal.statusCode;

        nock(batchURL)
        .delete("/data/users", payload)
        .reply(status, token);

        CustomData.deleteBulk(payload)
        .then(function (result) {
            expect(result).to.be.equal(token.token);
            done();
        })
        .catch((err) => done(err));
    });
});
