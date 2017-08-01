exports.createMinimal = {
    payload: {
        "name": "minimal notification",
        "live": false,
        "push_time": "now",
        "messages": [
            {
                "language": "fr",
                "title": "Salut le monde !",
                "body": "Comment ça va ?"
            }
        ]
    },
    token: {
        "campaign_token": "3396955c1a7fe0005d76973fca00b44a"
    },
    replyStats: {
        "campaign_token": "3396955c1a7fe0005d76973fca00b44a",
        "detail": [
            {
                "date": "2017-03-02T09:43:17",
                "sent": 754,
                "direct_open": 102,
                "influenced_open": 98,
                "reengaged": 12,
                "errors": 0
            }
        ]
    },
    stats: {
        date: new Date("2017-03-02T09:43:17"),
        sent: 754,
        direct_open: 102,
        influenced_open: 98,
        open_rate: (102 + 98) / 754,
        reengaged: 12,
        errors: 0
    },
    statusCode: 201
};

exports.get = {
    token: {
        "campaign_token": "3396955c1a7fe0005d76973fca00b44a"
    },
    reply: {
        "campaign_token": "3396955c1a7fe0005d76973fca00b44a",
        "from_api": true,
        "dev_only": true,
        "created_date": new Date("2017-03-02T09:43:17"),
        "name": "minimal notification",
        "live": false,
        "push_time": new Date("2017-03-02T09:43:17"),
        "gcm_collapse_key": "default",
        "targeting": {
            "segments": [
                "ONE_TIME",
                "DORMANT",
                "ENGAGED",
                "IMPORTED",
                "NEW"
            ]
        },
        "messages": [
            {
                "title": "Salut le monde !",
                "body": "Comment ça va ?"
            }
        ]
    },
    statusCode: 200
};

exports.list = {
    reply: [
        {
            "campaign_token": "3396955c1a7fe0005d76973fca00b44a",
            "from_api": true,
            "dev_only": true,
            "created_date": new Date("2017-03-02T09:43:17"),
            "name": "minimal notification",
            "live": false,
            "push_time": new Date("2017-03-02T09:43:17")
        }
    ],
    statusCode: 200
};
