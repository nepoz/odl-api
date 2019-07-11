const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require ('cors')
const membersRouter = require('./controllers/members')
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI, {useNewUrlParser:true})
    .then(() => {
        console.log('Connected to database')
    })
    .catch(err => {
        console.log('Connection failed: ', err.message)
    })

app.use(cors())
//For when frontend implemented: app.use(express.static('build'))
app.use(bodyParser.json())
app.use(express.static('./build'))

app.use('/api/members', membersRouter)

module.exports = app
