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
        }
    },
    "required": ["restKey"],
    "anyOf": [
        {"required": ["devKey"]},
        {"required": ["liveKey"]}
    ]
};
