exports.saveMinimal = {
    userId: "2b0d1z5d8f1f3a1d0a7a0124",
    payload: {
        "values":
        {
            "u.nickname": "Nick"
        }
    },
    reply: {
        "token": "d92b578e-c22e-99f5-a506-ae7433c78311"
    },
    statusCode: 200
};

exports.saveBulkMinimal = {
    payload: [
        {
            "id": "2b0d1z5d8f1f3a1d0a7a0124",
            "update":
            {
                "values":
                {
                    "u.nickname": "Nick"
                }
            }
        }
    ],
    reply: {
        "token": "f12b578z-c12e-99e5-a506-ae7433c78311"
    },
    statusCode: 200
};

exports.deleteMinimal = {
    userId: "2b0d1z5d8f1f3a1d0a7a0124",
    reply: {
        "token": "d92b571e-c22e-99e5-a506-ae7433c78311"
    },
    statusCode: 200
};

exports.deleteBulkMinimal = {
    payload: [
        "2b0d1c5d8f1f3a1d0a8a0124"
    ],
    reply: {
        "token": "f94b578e-c22e-99e5-a506-ae7433c78311"
    },
    statusCode: 200
};
