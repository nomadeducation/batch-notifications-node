const expect = require("chai").expect;
const nock = require("nock");
const Config = require("../lib/utils/Config");
const Campaign = require("../lib/Campaign");
const fixture = require("./fixtures/campaign");
const options = require("./fixtures/options");

describe("Campaign", function () {
    let campaign;
    let batchURL = "";
    let createdCampaignToken;

    before(function () {
        const cfg = new Config();
        cfg.setUserOptions(options);

        campaign = new Campaign(cfg);

        batchURL = `${cfg.get("api.baseURL")}/${cfg.get("api.version")}/${cfg.get("api.devKey")}`;
    });

    it("should create a campaign", function (done) {
        const payload = fixture.createMinimal.payload;
        const token = fixture.createMinimal.token;
        const status = fixture.createMinimal.statusCode;

        nock(batchURL)
        .post("/campaigns/create", payload)
        .reply(status, token);

        campaign.create(payload)
        .then(function (result) {
            expect(result).to.be.equal(token.campaign_token);
            createdCampaignToken = result;
            done();
        })
        .catch((err) => done(err));
    });

    it("should update an existing campaign", function (done) {
        const payload = fixture.createMinimal.payload;
        const status = fixture.createMinimal.statusCode;

        nock(batchURL)
        .post(`/campaigns/update/${createdCampaignToken}`, payload)
        .reply(status);

        campaign.update(createdCampaignToken, payload)
        .then(() => done())
        .catch((err) => done(err));
    });

    it("should remove an existing campaign", function (done) {
        const status = fixture.createMinimal.statusCode;

        nock(batchURL)
        .post(`/campaigns/delete/${createdCampaignToken}`)
        .reply(status);

        campaign.remove(createdCampaignToken)
        .then(() => done())
        .catch((err) => done(err));
    });

    it("should fetch stats from an existing campaign", function (done) {
        const replyStats = fixture.createMinimal.replyStats;
        const expectedStats = fixture.createMinimal.stats;
        const status = fixture.createMinimal.statusCode;

        nock(batchURL)
        .get(`/campaigns/stats/${createdCampaignToken}`)
        .reply(status, replyStats);

        campaign.stats(createdCampaignToken)
        .then(function (detail) {
            expect(detail).to.be.deep.equal(expectedStats);
            done();
        })
        .catch((err) => done(err));
    });
});
