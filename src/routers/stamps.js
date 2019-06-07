const express = require('express')
const auth = require('../middleware/auth')
const Stamp = require('../models/stamp')
const router = new express.Router()

router.get('/teststamp', (req, res) => {
    res.send('From user Stamp')
})

router.post('/stamps', auth , async (req, res) => {


    const stamp = new Stamp({
        ...req.body, 
        owner : req.user._id
    })
    try {
        await stamp.save()
        res.status(200).send(stamp) 
    } catch (e) {
        res.status(400).send( { error : e.message || e })
    }
})

// patch stamps by id  - update stamps fileds 
router.patch('/stamps/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    if (! updates.length ){
        return res.status(400).send({ error : 'Nothing to update'})
    }
    const allowedUpdatesArray = ['name', 'price', 'designer', 'designedAt' , 'edition', 'linkToImgUrl']
    const isValidOperation = updates.every((update) => allowedUpdatesArray.includes(update))
    if (!isValidOperation){
        return res.status(400).send({ error : 'Invalid updates'})
    }

    try {
        const stamp = await Stamp.findOne({
            _id : req.params.id, 
            owner : req.user._id
        })
        if ( !stamp) {
            return res.status(404).send({ error : 'Nothing found'})
        }

        updates.forEach((update) => stamp[update]= req.body[update])
        await stamp.save()
        return res.status(200).send(stamp)
    } catch (e){
        res.status(400).send({
            error : e.message || e
        })
    }
})

// del stamps by id  - delete stamnps 

router.delete('/stamps/:id' ,  auth, async(req, res) => {

    try {
        const stamp = await Stamp.findOneAndDelete({
            _id : req.params.id, 
            owner : req.user._id
        })
        if (!stamp){
            return res.status(404).send()
        } 
        return res.status(200).send()
    } catch (e){
        return res.status(400).send({ error : e.message || e })
    }
})

// get stamps by stamp id /tasks?ownerid=358763589
router.get('/stamps/:id', auth, async (req, res) => {

    const _id = req.params.id
    
    try {
        const stamp = await Stamp.findOne ({ _id })
        //console.log('Result ' ,stamp)
        if (!stamp) {
            return res.status(404).send()
        }
        return res.status(200).send(stamp)
    } catch (e) {
        return res.status(400).send( { error : e.message || e})
    }
} )

// get stamps owner id GET /stamps?owner=true

router.get('/stamps', auth, async (req, res) => {

    if (!req.query.owner){
        return res.status(404).send({ error : 'Invalid search'})
    }
    try {
        const stampList = await Stamp.find({
            owner : req.query.owner
        }) 
        
        if (stampList.length === 0){
            return res.status(404).send()
        }
        return res.status(200).send(stampList)

    } catch (e){
        return res.status(400).send({ error : e.message || e})
    }
})

module.exports = router 