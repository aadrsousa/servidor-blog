const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    authorName: { type: String, requried: true },
    authorEmail: { type: String, requried: true },
    content: { type: String, requried: true },
})

module.exports = mongoose.model('Comment', CommentSchema)