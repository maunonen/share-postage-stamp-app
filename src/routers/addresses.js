const express = require('express')

const auth = require('../middleware/auth')
const Address = require('../models/address')
const router = new express.Router()

router.get('/testadrress', (req, res) => {
    res.send('From user Address')
})

// create address 

router.post('/addresses', auth, async (req, res ) => {

    const address = new Address ( req.body ) 

    try {
        await address.save()
        res.status(201).send('Address has been added to DB')

    } catch (e) {
        res.status(400).send( { error : e.message || e })
    } 
})

// delete address by it _id ??? how to provide integrity chech all table before delete address from table 

router.delete('/addresses/:id' , auth, async (req, res) => {

    try {
        const address = await Address.findOneAndRemove( {
            _id : req.params.id
        })
        if (!address) {
            return res.status(404).send('Address not found')
        }
        res.status(200).send(address)

    } catch (e) {
        res.status(400).send({ error : e.message || e})
    }

})

// get address by id

router.get('/addresses/:id', auth , async (req, res) => {

    try {
        const address = await Address.findOne( { _id : req.params.id})
        if (!address) {
            return res.status(404).send( { error : 'Address not found'})
        }
        res.status(200).send(address)

    } catch (e) {
        res.status(404).send({ error : 'Address not found'})
    }

})

// update address 

router.patch('/addresses/:id', auth , async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = [ 'country', 'city', 'postalcode', 'address']

    const isValidUpdates = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidUpdates){
        return res.status(400).send({ error : 'Invalid updates'})
    }
    try {
        const updatedAddress = await Address.findOneAndUpdate({ _id : req.params.id }, 
                                                            req.body, 
                                                            { new: true, runValidators : true }) 
        if (!updatedAddress) {
            return res.status(404).send({ error : 'Address not found'}) 
        }
        res.status(200).send(updatedAddress)
    } catch (e){
        res.status(409).send({
            error : e.message || e
        })
    }

})

// get address by woner id  GET '/addresses?owner=24vbsdbvw78'
/* router.get('/addresses', auth , async (req, res) => {
    
    const _id = req.query.owner
    try {
        const address =  await findOne(_id)
        if (address){
            return res.status(404).send({ error : 'Not found'})
        }
        res.status(200).send(address)
    } catch (e){
        res.status(400).send( { error : e.message || e })
    }
})
 */

module.exports = router 