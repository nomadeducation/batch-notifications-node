module.exports = {
    "type": "object",
    "properties": {
        "restKey": {
            "type": "string"
        },
        "devKey": {
            "type": "string"
        },
        "liveKey": {
            "type": "string"
        },
        "logger": {
            "type": "object"
        }
    },
    "required": ["restKey"],
    "anyOf": [
        {"required": ["devKey"]},
        {"required": ["liveKey"]}
    ]
};
