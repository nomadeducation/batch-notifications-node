# Batch.com SDK for Node
[![Build Status](https://travis-ci.com/nomadeducation/batch-notifications-node.svg?branch=master)](https://travis-ci.com/nomadeducation/batch-notifications-node)
[![Coverage Status](https://coveralls.io/repos/github/nomadeducation/batch-notifications-node/badge.svg?branch=master)](https://coveralls.io/github/nomadeducation/batch-notifications-node?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/npm/batch-notifications/badge.svg)](https://snyk.io/test/npm/batch-notifications)

This project is a NodeJS client wrapper for the [Batch.com](https://batch.com/) notifications server API.

## Prerequisites
Every methods in this library in _Promise-based_ using the native object. Moreover, since we're using some of the ES2015+ operators (i.e. `const`, arrow functions, etc), you'll need at least `node 6`.

## Installation
``` sh
# npm
$ npm install --save batch-notifications
# yarn
$ yarn install batch-notifications
```

## Usage

### Options
Before doing anything, you must pass your API keys created for your app in [batch](https://dashboard.batch.com/):
```js
const opts = {
    restKey: "YOUR_REST_API_KEY",
    // you must pass at least one the following API key
    devKey: "YOUR_DEV_API_KEY",
    liveKey: "YOUR_LIVE_API_KEY"
};
```

The client will always favor the `liveKey` if present otherwise it will take the `devKey`.

### API
The following sections are presenting the API methods.

#### Campaigns
 See the [available parameters](https://batch.com/doc/api/campaigns/parameters.html) in the batch documentation.

##### [create](https://batch.com/doc/api/campaigns/create.html)
For example, by taking the [minimal payload example](https://batch.com/doc/api/campaigns/create.html#_post-data), we can create a new campaign like the following:
```js
// see `opts` structure above
const batch = require("batch-notifications")(opts);

const payload = {
    name: "Test Campaign",
    push_time: "now",
    live: false,
    messages: [
        {
            language: "en",
            title: "Hello!",
            body: "How's it going?"
        }
    ]
};

batch.campaign.create(payload)
.then(function (campaignToken) {
    // created campaign referenced by the `campaignToken`
});
```

##### [update](https://batch.com/doc/api/campaigns/update.html)
Updating a campaign is somewhat similar as create a new one except that you'll have some [restrictions](https://batch.com/doc/api/campaigns/update.html#_post-data):
```js
const batch = require("batch-notifications")(opts);

const payload = {
    push_time: "2038-01-19T03:14:07"
};

// token was taken from the previous `create` method
batch.campaign.update(token, payload)
.then(function () {
    // campaign updated
});
```

##### [remove](https://batch.com/doc/api/campaigns/delete.html)
Removing a campaign is done like this:
```js
const batch = require("batch-notifications")(opts);

// token was taken from the previous `create` method
batch.campaign.remove(token)
.then(function () {
    // campaign removed
});
```

##### [stats](https://batch.com/doc/api/campaigns/get.html)
Stats can **only** be fetched if the campaign token was created using the **live** key and that the campaign is already **launched**:
```js
// see `opts` structure above
const batch = require("batch-notifications")(opts);

// token was taken from the previous `create` method
batch.campaign.stats(token)
.then(function (detail) {
    // ...
});
```

The `detail` object will contain the following properties:
- `date`: Date
- `sent`: Number
- `direct_open`: Number
- `influenced_open`: Number
- `open_rate`: Number
- `reengaged`: Number
- `errors`: Number

See the [docs](https://batch.com/doc/dashboard/push/analytics.html) for more infos about those variables.

##### [get](https://batch.com/doc/api/campaigns/get-campaign.html)
Retrieve details about one campaign:
```js
// see `opts` structure above
const batch = require("batch-notifications")(opts);

// token was taken from the previous `create` method
batch.campaign.get(token)
.then(function (details) {
    // ...
});
```

The `details` object will contain *at least* the following properties:
- `campaign_token`: String
- `from_api`: Boolean
- `dev_only`: Boolean
- `created_date`: Date
- `name`: String
- `live`: Boolean
- `push_time`: Date

##### [list](https://batch.com/doc/api/campaigns/list.html)
Get a paginated list of pushed campaigns:
```js
// see `opts` structure above
const batch = require("batch-notifications")(opts);

// by default, it will fetch at most 10 campaigns
batch.campaign.list()
.then(function (detailsList) {
    // ...
});
```

The `detailsList` array is composed of objects which contain the same properties as [`get`](#get).

##### has
To verify that a token is present for a certain app:
```js
// see `opts` structure above
const batch = require("batch-notifications")(opts);

// token was taken from the previous `create` method
batch.campaign.has(token)
.then(function (hasToken) {
    // ...
});
```

`hasToken` is a boolean which is `true` only if the token is present for the specific API key.

##### enable
To ensure that a campaign is enabled:
```js
// see `opts` structure above
const batch = require("batch-notifications")(opts);

// token was taken from the previous `create` method
batch.campaign.enable(token)
.then(function () {
    // campaign is enabled
});
```

##### disable
To ensure that a campaign is disabled:
```js
// see `opts` structure above
const batch = require("batch-notifications")(opts);

// token was taken from the previous `create` method
batch.campaign.disable(token)
.then(function () {
    // campaign is disabled
});
```


#### Transactional
 See the [available parameters](https://batch.com/doc/api/transactional.html) in the batch documentation.

##### [post](https://batch.com/doc/api/transactional.html)
For example, by taking the [minimal payload example](https://batch.com/doc/api/transactional.html#_post-data), we can create a new transactional notification like the following:
```js
// see `opts` structure above
const batch = require("batch-notifications")(opts);

const payload = {
    "group_id": "welcome",
    "recipients": {
        "tokens": ["USER_PUSH_TOKEN"]
    },
    "message": {
        "title": "Hello!",
        "body": "How's it going?"
    }
};

batch.transactional.post(payload)
.then(function (token) {
    // created transactional referenced by the `token`
});
```


#### Custom Data

##### [save](https://batch.com/doc/api/custom-data-api/set-update.html#_post-data)
To set custom data to a specific user (you need their id):
```js
// see `opts` structure above
const batch = require("batch-notifications")(opts);

const payload = {
    "overwrite": false,
    "values":
    {
        "u.nickname": "The Rock",
        "u.force": 42,
        "ut.hobbies": ["Lifting", "Wrestling", "Acting"],
        "u.is_subscribed": null,
        "date(u.last_subscription)": "2016-01-10T10:00:00.000",
        "date(u.last_purchase)": 1472656161,
        "ut.locations": { "$add": ["Paris"], "$remove": ["Berlin"] }
    }
};

// userId (String) is the Id of the user to whom you want to set custom data
batch.customData.save(userId, payload)
.then(function (token) {
    // the `token` represents the transaction
});
```

##### [saveBulk](https://batch.com/doc/api/custom-data-api/set-update.html#_bulk-post-data)
To set custom data to several users:
```js
// see `opts` structure above
const batch = require("batch-notifications")(opts);

const payload = [
    {
        "id": "Vincent",
        "update":
        {
            "values":
            {
                "u.nickname": "Vincent",
                "u.age": 55
            }
        }
    },
    {
        "id": "Johnny",
        "update":
        {
            "overwrite": true,
            "values":
            {
                "u.nickname": "BeGood",
                "u.age": 30
            }
        }
    }
];

batch.customData.saveBulk(payload)
.then(function (token) {
    // the `token` represents the transaction
});
```

##### [delete](https://batch.com/doc/api/custom-data-api/delete.html#_single-delete)
To delete custom data of a specific user (you need their id):
```js
// see `opts` structure above
const batch = require("batch-notifications")(opts);

// userId (String) is the Id of the user to whom you want to delete custom data
// this method does not require a payload
batch.customData.delete(userId)
.then(function (token) {
    // the `token` represents the transaction
});
```

##### [deleteBulk](https://batch.com/doc/api/custom-data-api/delete.html#_bulk-deletes)
To delete custom data of an array of users:
```js
// see `opts` structure above
const batch = require("batch-notifications")(opts);

const payload = [
    "user1",
    "user2",
    "user3"
];

batch.customData.deleteBulk(payload)
.then(function (token) {
    // the `token` represents the transaction
});
```

## Contributing
First, install the dependencies using `yarn`:
```sh
$ yarn install --pure-lockfile
```

Verify that your project is configured correctly by launching tests:
```sh
$ yarn test
```

Before you start coding make sure that you've read our [`CONTRIBUTING`](.github/CONTRIBUTING.md) guide!
