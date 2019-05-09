const express = require('express')

// const User = require()

const router = new express.Router()

router.get('/testshipment', (req, res) => {
    res.send('From user Shipment')
})

module.exports = router 