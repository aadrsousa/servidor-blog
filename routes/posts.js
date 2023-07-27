const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const Comment = require('../models/Comment')

// Rutas
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        extract: req.body.extract,
        authorName: req.body.authorName,
        authorEmail: req.body.authorEmail,
    })

    try {
        const newPost = await post.save()
        res.status(201).json(newPost)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const post = await Post.findById(id)
        if(!post) {
            return res.status(404).json({ message: 'Post not found' })
        }
        
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const post = await Post.findByIdAndDelete(id)
        if(!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Comments
router.get('/:id/comments', async (req, res)=> {
    let post
    try {
        post = await Post.findById(req.params.id).populate('comments')
        if(!post) {
            return res.status(404).json({ message: 'Post not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

    res.json(post.comments)
})

router.post('/:id/comments', async (req, res) => {
    let post
    try {
        post = await Post.findById(req.params.id)
        if(!post) {
            return res.status(404).json({ message: 'Post not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

    const comment = new Comment({
        authorName: req.body.authorName,
        authorEmail: req.body.authorEmail,
        content: req.body.content,
    })

    try {
        const newComment = await comment.save()
        post.comments.push(newComment._id)
        await post.save()
        res.status(201).json(newComment)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/:id/comments/:commentId', async (req, res) => {
    let post
    try {
        post = await Post.findById(req.params.id)
        if(!post) {
            return res.status(404).json({ message: 'Post not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

    let comment
    try {
        const commentId = req.params.commentId
        comment = await Comment.findByIdAndDelete(commentId)
        if(!comment) {
            return res.status(404).json({ message: 'Comment not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

    try {
        post.comments = post.comments.filter(commentId => commentId.toString() !== req.params.commentId)
        await post.save()
        res.status(200).json({ message: 'Comment deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router