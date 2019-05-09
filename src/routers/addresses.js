const express = require('express')

// const User = require()

const router = new express.Router()

router.get('/testadrress', (req, res) => {
    res.send('From user Address')
})

module.exports = router 