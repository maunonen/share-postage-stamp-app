const express = require('express')

// const User = require()

const router = new express.Router()

router.get('/testpayment', (req, res) => {
    res.send('From user Payment')
})

module.exports = router 