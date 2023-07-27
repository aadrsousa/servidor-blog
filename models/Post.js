const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: { type: String, requried: true },
    content: { type: String, requried: true },
    extract: { type: String, requried: true },
    authorName: { type: String, requried: true },
    authorEmail: { type: String, requried: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
})

module.exports = mongoose.model('Post', PostSchema)