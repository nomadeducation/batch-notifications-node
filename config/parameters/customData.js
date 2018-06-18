exports.postSpecificMinimal = {
    "type": "object",
    "properties": {
        "values": {
            "type": "object",
            "minProperties": 1
        }
    },
    "required": [
        "values"
    ]
};

exports.postBulkMinimal = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {
                "type": "string"
            },
            "update": {
                "type": "object",
                "properties": {
                    "values": {
                        "type": "object",
                        "minProperties": 1
                    }
                },
                "required": [
                    "values"
                ],
            }
        },
        "required": [
            "id",
            "update"
        ],
    }
};

exports.deleteBulkMinimal = {
    "type": "array",
    "minItems": 1,
    "items": [
        {
            "type": "string"
        }
    ]
};
