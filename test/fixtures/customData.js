exports.postSpecificMinimal = {
    userId: "2b0d1z5d8f1f3a1d0a7a0124",
    payload: {
        "values":
        {
            "u.nickname": "Nick"
        }
    },
    token: {
        "token": "d92b578e-c22e-99f5-a506-ae7433c78311"
    },
    statusCode: 200
};

exports.postBulkMinimal = {
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
    token: {
        "token": "f12b578z-c12e-99e5-a506-ae7433c78311"
    },
    statusCode: 200
};

exports.deleteSpecificMinimal = {
    userId: "2b0d1z5d8f1f3a1d0a7a0124",
    token: {
        "token": "d92b571e-c22e-99e5-a506-ae7433c78311"
    },
    statusCode: 200
};

exports.deleteBulkMinimal = {
    payload: [
        "2b0d1c5d8f1f3a1d0a8a0124"
    ],
    token: {
        "token": "f94b578e-c22e-99e5-a506-ae7433c78311"
    },
    statusCode: 200
};
