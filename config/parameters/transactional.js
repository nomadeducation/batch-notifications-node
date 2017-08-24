module.exports = {
    "type": "object",
    "properties": {
        "group_id": {
            "type": "string"
        },
        "recipients": {
            "type": "object",
            "properties": {
                "tokens": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "custom_ids": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "install_ids": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "oneOf": [
                {"required": ["tokens"]},
                {"required": ["custom_ids"]},
                {"required": ["install_ids"]}
            ]
        },
        "message": {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string"
                },
                "body": {
                    "type": "string"
                }
            }
        }
    },
    "required": [
        "group_id",
        "recipients",
        "message"
    ]
};
