const express = require('express')

// const User = require()

const router = new express.Router()

router.get('/teststamp', (req, res) => {
    res.send('From user Stamp')
})

module.exports = router 