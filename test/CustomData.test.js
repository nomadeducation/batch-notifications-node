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

describe("Custom Data post specific", function () {
    it("should set custom data to a specific user", function (done) {
        const CustomData = createCustomDataHandler();
        const batchURL = getURL();

        const userId = fixture.postSpecificMinimal.userId;
        const payload = fixture.postSpecificMinimal.payload;
        const token = fixture.postSpecificMinimal.token;
        const status = fixture.postSpecificMinimal.statusCode;

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

describe("Custom Data post bulk", function () {
    it("should set custom data to an array of users", function (done) {
        const CustomData = createCustomDataHandler();
        const batchURL = getURL();

        const payload = fixture.postBulkMinimal.payload;
        const token = fixture.postBulkMinimal.token;
        const status = fixture.postBulkMinimal.statusCode;

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

describe("Custom Data delete specific", function () {
    it("should delete custom data of a specific user", function (done) {
        const CustomData = createCustomDataHandler();
        const batchURL = getURL();

        const userId = fixture.postSpecificMinimal.userId;
        const payload = fixture.postSpecificMinimal.payload;
        const token = fixture.postSpecificMinimal.token;
        const status = fixture.postSpecificMinimal.statusCode;

        nock(batchURL)
        .delete(`/data/users/${userId}`, payload)
        .reply(status, token);

        CustomData.deleteSpecific(userId, payload)
        .then(function (result) {
            expect(result).to.be.equal(token.token);
            done();
        })
        .catch((err) => done(err));
    });
});

describe("Custom Data delete bulk", function () {
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
