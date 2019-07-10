const express = require('express')
const router = express.Router()
const Member = require('../models/Member')

router.get('/', (req, res) => {
    Member.find({})
        .then(members => {
            res.json(members.map(member => member.toJSON()))
        })
})

router.get('/:id', (req, res) => {
    Member.findById(req.params.id)
        .then(target => {
            res.json(target.toJSON())
        })
})

router.post('/', (req, res) => {
    const info = req.body

    const member = new Member({
        name: info.name,
        email: info.email,
        number: info.number,
        office: info.office,
        image: info.image
    })

    member.save()
        .then(savedMember => {
            res.json(savedMember.toJSON())
        })
})

router.delete('/:id', (req, res) => {
    Member.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
})

module.exports = router