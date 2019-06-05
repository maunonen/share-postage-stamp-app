const express = require('express')
const Shipment = require('../models/shipment') 
const auth = require('../middleware/auth')
const Order = require('../models/order')



const router = new express.Router()

router.get('/testshipment', (req, res) => {
    res.send('From user Shipment')
})

// create shipment 

router.post('/shipment', auth,  async (req, res) => {

    const newShipment = new Shipment(req.body)
    try {
        await newShipment.save() 
        res.status(201).send(newShipment) 
    } catch (e){
        res.status(400).send({ error : e.message || e }) 
    }

}) 

// delete shipment 
// validation just order sender can delete the shipment information 
router.delete('/shipment/:id', auth, async (req, res) => {

    const _id = req.params.id 
    if (!_id) {
        return res.status(400).send({ error : 'Object ID not found in query string'})
    } 
    try {
        const deletedShipmet = await Shipment.findByIdAndRemove(_id)
        if (!deletedShipmet) {
            return res.status(404).send({
                error : 'Shipment not found'
            })
        }
        res.status(200).send(deletedShipmet) 
    } catch (e)     {
        res.status(400).send({ error : e.message || e})
    }
})

// update shipment 

router.patch('/shipment/:id' , auth, async (req, res) => {

    const { receiptURL = "", sendDate = "", shipper="" } = req.body

    if ((!receiptURL || !sendDate || !shipper) ) { 
        return res.status(400).send({ error : 'Updates not found'}) 
    } 
    try {
        const updatedShipment = await Shipment.findByIdAndUpdate({ 
                                            _id : req.params.id}, req.body, 
                                          { new : true , runValidators : true }) 
        if (!updatedShipment){
            return res.status(400).send({ error : 'Shipment not found'})
        }                                                   
        res.status(200).send(updatedShipment)
    } catch (e) {
        res.status(400).send({ error : e.message || e}) 
    } 
})

// get all shipments by login user ID 

 router.get('/shipments', auth, async (req, res) => {
    try {

        // lookup 
        const listOfShipment = await Shipment.aggregate([
          
            {
                $lookup : {
                    from: "Order",
                    localField : "order", 
                    foreignField : "_id",   
                    as : "order_doc"
                  }
            }
        ]).exec()
        
/*          const listOfShipment = await Shipment.find({})
                                .populate({
                                    path : 'order', 
                                    populate : { path : 'client' }
                                })
                                .populate({
                                    path : 'order', 
                                    populate : { path : 'sender', match : { _id : req.user.id }  }
                                })
                                .populate({
                                    path : 'order', 
                                    populate : { path : 'stamp' }
                                })
                                .populate({
                                    path : 'order', 
                                    populate : { path : 'address' }
                                })
                                .exec() */

                                
                                
        if (!listOfShipment || listOfShipment.length === 0){
            return res.status(404).send({ error : 'Shipment not found'})
        }     
        res.status(200).send(listOfShipment)
    } catch (e){
        res.status(400).send({ error : e.message || e })
    }
})

router.get('/shipment/:id', auth, async (req, res) => {
    
    const _id = req.params.id 
    if (!_id){
        return res.status(400).send({ error : 'ID not found. Check request'})
    }
    try {
        const shipment = await Shipment.findById(_id)
            .populate({
                path : 'order', 
                    populate:  { 
                        path : 'client', 
                        select : [ 'username', 'country' ]                                                                                           
                    }, 
                    populate : {
                        path : 'address', 
                        select : ['country', 'city',  'street']
                    }, 
                    populate : {
                        path : 'stamp', 
                        select : ['name', 'linkToUrl', 'price']
                    }
            }).exec()
            if (!shipment){
                return res.status(404).send({ error : 'Shipment not found'})
            }
            res.status(200).send(shipment)
    } catch(e) {
        res.status(400).send({ error : e.message || e })
    }
}) 

module.exports = router 