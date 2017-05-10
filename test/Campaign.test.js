const expect = require("chai").expect;
const nock = require("nock");
const Config = require("../lib/utils/Config");
const Request = require("../lib/utils/Request");
const Campaign = require("../lib/Campaign");
const fixture = require("./fixtures/campaign");
const options = require("./fixtures/options");

describe("Campaign", function () {
    let campaign;
    let batchURL = "";
    let createdCampaignToken;

    before(function () {
        const request = Request.init(options);
        campaign = Campaign(request);

        batchURL = `${Config.get("api.baseURL")}/${Config.get("api.version")}/${Config.get("api.devKey")}`;
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
        .catch(() => done());
    });

    it("should update an existing campaign", function (done) {
        const payload = fixture.createMinimal.payload;
        const status = fixture.createMinimal.statusCode;

        nock(batchURL)
        .post(`/campaigns/update/${createdCampaignToken}`, payload)
        .reply(status);

        campaign.update(createdCampaignToken, payload)
        .then(() => done())
        .catch(() => done());
    });
});
