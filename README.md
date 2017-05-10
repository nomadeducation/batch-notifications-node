# Batch.com SDK for Node [![Build Status](https://travis-ci.org/nomadeducation/batch-notifications-node.svg?branch=master)](https://travis-ci.org/nomadeducation/batch-notifications-node)
This project is a NodeJS client wrapper for the [Batch.com](https://batch.com/) notifications server API.

## Prerequisites
Every methods in this library in _Promise-based_ using the native object. Moreover, since we're using some of the ES2015+ operators (i.e. `const`, arrow functions, etc), you'll need the latest LTS version of `node` which is the v6 at the moment of writing.

## Installation
``` sh
$ npm install --save batch-notifications
```

## Usage
_At the moment, you can **only** handle campaigns !_

### Options
Before doing anything, you must pass your API keys created for your app in [batch](https://dashboard.batch.com/):
```js
const opts = {
    restKey: "YOUR_REST_API_KEY",
    devKey: "YOUR_DEV_API_KEY",
    liveKey: "YOUR_LIVE_API_KEY"
};
```

The client will chose the `liveKey` when `NODE_ENV=production`, otherwise it will take the `devKey`.

### Campaigns
See the [available parameters](https://batch.com/doc/api/campaigns/parameters.html) in the batch documentation.

#### Create
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

#### Update
Updating a campaign is somewhat similar as create a new one except that you'll have some [restrictions](https://batch.com/doc/api/campaigns/update.html#_post-data):
```js
const batch = require("batch-notifications")(opts);

const payload = {
    push_time: "2038-01-19T03:14:07"
};

batch.campaign.update(payload)
.then(function () {
    // campaign updated
});
```
