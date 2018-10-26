const expect = require("chai").expect;
const mock = require("./requestMock");
const querystring = require("querystring");
const Config = require("../lib/utils/Config");
const Campaign = require("../lib/Campaign");
const fixture = require("./fixtures/campaign");
const options = require("./fixtures/options");

/**
 * @returns {Campaign}
 */
function createCampaignHandler () {
    const cfg = new Config();
    cfg.setUserOptions(options);
    return new Campaign(cfg);
}

/**
 * @returns {String}
 */
function getURL () {
    const cfg = new Config();
    cfg.setUserOptions(options);
    return `${cfg.get("api.baseURL")}/${cfg.get("api.version")}/${cfg.get("api.devKey")}`;
}

/*
 * We've separated the campaign creation & deletion
 * because those functions will be later used throughout the rest of the tests
 */

describe("Campaign creation", function () {
    it("should create a campaign", function (done) {
        const campaign = createCampaignHandler();
        const batchURL = getURL();

        const payload = fixture.createMinimal.payload;
        const token = fixture.createMinimal.token;
        const status = fixture.createMinimal.statusCode;

        mock.onPost(`${batchURL}/campaigns/create`, payload)
        .reply(status, token);

        campaign.create(payload)
        .then(function (result) {
            expect(result).to.be.equal(token.campaign_token);
            done();
        })
        .catch((err) => done(err));
    });
});

describe("Campaign deletion", function () {
    const campaign = createCampaignHandler();
    const batchURL = getURL();
    let createdCampaignToken;

    before(function (done) {
        const payload = fixture.createMinimal.payload;
        const token = fixture.createMinimal.token;
        const status = fixture.createMinimal.statusCode;

        mock.onPost(`${batchURL}/campaigns/create`, payload)
        .reply(status, token);

        campaign.create(payload)
        .then(function (result) {
            createdCampaignToken = result;
            done();
        })
        .catch(err => done(err));
    });

    it("should remove an existing campaign", function (done) {
        const status = fixture.createMinimal.statusCode;

        mock.onPost(`${batchURL}/campaigns/delete/${createdCampaignToken}`)
        .reply(status);

        campaign.remove(createdCampaignToken)
        .then(() => done())
        .catch((err) => done(err));
    });
});

describe("Campaign", function () {
    const campaign = createCampaignHandler();
    const batchURL = getURL();
    let createdCampaignToken;

    beforeEach(function (done) {
        const payload = fixture.createMinimal.payload;
        const token = fixture.createMinimal.token;
        const status = fixture.createMinimal.statusCode;

        mock.onPost(`${batchURL}/campaigns/create`, payload)
        .reply(status, token);

        campaign.create(payload)
        .then(function (result) {
            createdCampaignToken = result;
            done();
        })
        .catch(err => done(err));
    });

    afterEach(function (done) {
        const status = fixture.createMinimal.statusCode;

        mock.onPost(`${batchURL}/campaigns/delete/${createdCampaignToken}`)
        .reply(status);

        campaign.remove(createdCampaignToken)
        .then(() => done())
        .catch(err => done(err));
    });

    it("should get infos from an existing campaign", function (done) {
        const reply = fixture.get.reply;
        const status = fixture.get.statusCode;

        mock.onGet(`${batchURL}/campaigns/${createdCampaignToken}`)
        .reply(status, reply);

        campaign.get(createdCampaignToken)
        .then(function (result) {
            expect(result).to.deep.equal(reply);
            done();
        })
        .catch(err => done(err));
    });

    it("should list the existing campaigns", function (done) {
        const reply = fixture.list.reply;
        const status = fixture.list.statusCode;

        const queryString = querystring.stringify({
            from: 0,
            limit: 10
        });
        mock.onGet(`${batchURL}/campaigns/list?${queryString}`)
        .reply(status, reply);

        campaign.list()
        .then(function (result) {
            expect(result).to.deep.equal(reply);
            done();
        })
        .catch(err => done(err));
    });

    it("should check that the existing campaign exists", function (done) {
        const reply = fixture.get.reply;
        const status = fixture.get.statusCode;

        mock.onGet(`${batchURL}/campaigns/${createdCampaignToken}`)
        .reply(status, reply);

        campaign.has(createdCampaignToken)
        .then(function (isCreated) {
            expect(isCreated).to.be.true;
            done();
        })
        .catch(err => done(err));
    });

    it("should update an existing campaign", function (done) {
        const payload = fixture.createMinimal.payload;
        const status = fixture.createMinimal.statusCode;
        const reply = fixture.get.reply;

        mock.onPost(`${batchURL}/campaigns/update/${createdCampaignToken}`, payload)
        .reply(status);

        mock.onGet(`${batchURL}/campaigns/${createdCampaignToken}`)
        .reply(status, reply);

        campaign.update(createdCampaignToken, payload)
        .then(() => campaign.get(createdCampaignToken))
        .then(function (result) {
            expect(result).to.deep.equal(reply);
            done();
        })
        .catch(err => done(err));
    });

    it("should force-enable an existing campaign", function (done) {
        const reply = fixture.get.reply;
        const status = fixture.createMinimal.statusCode;

        mock.onPost(`${batchURL}/campaigns/update/${createdCampaignToken}`, {live: true})
        .reply(status);

        mock.onGet(`${batchURL}/campaigns/${createdCampaignToken}`)
        .reply(status, reply);

        campaign.enable(createdCampaignToken)
        .then(() => campaign.get(createdCampaignToken))
        .then(function (result) {
            expect(result).to.deep.equal(reply);
            done();
        })
        .catch(err => done(err));
    });

    it("should force-disable an existing campaign", function (done) {
        const reply = fixture.get.reply;
        const status = fixture.createMinimal.statusCode;

        mock.onPost(`${batchURL}/campaigns/update/${createdCampaignToken}`, {live: false})
        .reply(status);

        mock.onGet(`${batchURL}/campaigns/${createdCampaignToken}`)
        .reply(status, reply);

        campaign.disable(createdCampaignToken)
        .then(() => campaign.get(createdCampaignToken))
        .then(function (result) {
            expect(result).to.deep.equal(reply);
            done();
        })
        .catch(err => done(err));
    });

    // XXX stats cannot be fetched right after the campaign creation
    // so this will only work when mocking HTTP requests
    it("should fetch stats from an existing campaign", function (done) {
        const replyStats = fixture.createMinimal.replyStats;
        const expectedStats = fixture.createMinimal.stats;
        const status = fixture.createMinimal.statusCode;

        mock.onGet(`${batchURL}/campaigns/stats/${createdCampaignToken}`)
        .reply(status, replyStats);

        campaign.stats(createdCampaignToken)
        .then(function (detail) {
            expect(detail).to.be.deep.equal(expectedStats);
            done();
        })
        .catch(err => done(err));
    });
});
