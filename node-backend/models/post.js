const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    name: {type: String, require: true},
    description: {type: String},
    content: {type: String, require: true},
    imagePath: {type: String},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", require}
})

module.exports = mongoose.model("Post", postSchema);