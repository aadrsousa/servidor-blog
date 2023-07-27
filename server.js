const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

const postRouter = require('./routes/posts')
app.use('/posts', postRouter)

// Arrancamos el servidor.
const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})