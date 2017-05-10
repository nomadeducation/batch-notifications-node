module.exports = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "live": {
            "type": "boolean"
        },
        "priority": {
            "type": "string"
        },
        "push_time": {
            "type": "string"
        },
        "local_push_time": {
            "type": "string"
        },
        "messages": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "language": {
                        "type": "string"
                    },
                    "title": {
                        "type": "string"
                    },
                    "body": {
                        "type": "string"
                    }
                },
                "required": [
                    "language",
                    "body"
                ]
            }
        },
    },
    "required": [
        "name",
        "live",
        "messages"
    ],
    "oneOf": [
        {"required": ["push_time"]},
        {"required": ["local_push_time"]}
    ]
};
