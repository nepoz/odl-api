const express = require('express')
const router = express.Router()
const Member = require('../models/Member')
const { getStaffInfo }  = require('../utils/getStaffInfo')

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

router.delete('/', (req, res) => {
    Member.remove({})
        .then(() => {
            console.log('all clear!')
            res.status(204).end()
        })
})

router.put('/', (req, res) => {
    getStaffInfo()
        .then(members => Member.insertMany(members)
            .then(updatedMembers => res.json(updatedMembers.map(member => member.toJSON()))))
})

router.get('/call/:id', (req, res) => {
    Member
        .findById(req.params.id)
        .then (member => {
            const number = member.number.split('.').join('');
            res.redirect(302, `tel:+1${number}`);
        })  
})

router.get('/email/:id', (req, res) => {
    Member
        .findById(req.params.id)
        .then(member => {
            const email = member.email;
            res.redirect(302, `mailto:${member.email}`);
        })
})

module.exports = router