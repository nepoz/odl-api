const mongoose = require('mongoose')

const urlRegExp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
const officeRegExp = /[A-Z]{3} (\d{3}[A-Z]|\d{3}|\d{4})/
const phoneRegExp = /((\(\d{3}\)?)|(\d{3}))([\s-./]?)(\d{3})([\s-./]?)(\d{4})/
const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const memberSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        match: emailRegExp,
        required: true
    },
    number: {
        type: String,
        match: phoneRegExp,
        required: true
    },
    office: {
        type: String,
        match: officeRegExp,
        required: true,
    },
    image: {
        type: String,
        match: urlRegExp,
    }
})

memberSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Member =  mongoose.model('Member', memberSchema)

module.exports = Member