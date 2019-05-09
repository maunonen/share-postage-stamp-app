const express = require('express')

// const User = require()

const router = new express.Router()

router.get('/testorder', (req, res) => {
    res.send('From user Orders')
})

module.exports = router 