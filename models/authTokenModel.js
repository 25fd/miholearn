const mongoose = require("mongoose");

const authTokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true,
    },

    refreshtoken: {
        type: String,
        required: true,
    },
    deviceId: {
        type: String,
        required: true,
    },

})

module.exports = mongoose.model("authtokens", authTokenSchema);