const express = require('express')
const Order =  require('../models/order')
const auth = require('../middleware/auth')
const User = require('../models/user')
const mongoose = require('mongoose')

const router = new express.Router()

// const User = require()

// add shipment to existing order 

router.post('/orders/shipment/:id', auth , async (req, res) => {

    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { _id : req.params.id, 
                sender :req.user.id
            } , 
            { "$push" : {
               "shipments"  : req.body}, 
            }, 
            { new : true, runValidators : true }
    )
    if ( !updatedOrder){
        return res.status(404).send({ error : 'Not found '})       
    }
    res.status(200).send(updatedOrder)

    } catch (e){
        res.status(400).send({ error : e.message || e})
    }

})

// delete shipment by shipment 
//Done

router.delete('/orders/shipment/:id', auth ,  async (req, res) => {
    try {
        const deleteFromOrder = await Order.findOneAndUpdate(
            { _id :req.params.id }, 
            { "$pull" : {
                "shipments" : {  "_id" :  req.query.id} }}
            //{ new : true }
        )
        if (!deleteFromOrder){
            return res.status(404).send({ error : "Order not found or can't be updadte"})
        }
        res.status(200).send("shipments has been deleted")
    } catch (e){
        res.status(400).send({
             error : e.message || e1
        })
    }

})

// update shipment by order ID and shipmens id 
// functions to check valid updates and return the array of updates 
// get req.body and list of valid updates, return true and 

router.patch('/orders/shipment/:id', auth , async (req, res) => {
    try { 
        // createe array to updates
        const arrayUpdates = {}    
        const updates = Object.keys(req.body)
        const allowedUpdates = [
            'shipper', 'trackingNumber', 'sentDate', 'receiptUrl'
        ] 
        // check valid updates and create the array of updates 
        const isUpdatesValid = updates.every((update) =>  { 
                
                    arrayUpdates["shipments.$." + update] = req.body[update]
                
                return allowedUpdates.includes(update)
            }   
        )

        if (!isUpdatesValid) {
            return res.status(400).send({ error : 'Invalid updates (shipper, trackingNumber, sentDate, receiptUrl)'})
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { _id : req.params.id, "shipments._id" : req.query.id }, 
            { "$set" : arrayUpdates }, 
            { new : true, runValidators : true }
        )
        if (!updatedOrder){
            return res.status(404).send({ error : "Shipment not found"})
        } 
        res.status(200).send(updatedOrder)

    } catch(e) {
        res.status(400).send({ error : e.message || e })
    }
})




// get list of shipment by order ID, by shipment ID, by clinet, by sender


router.get('/orders/shipment/' , auth, async (req, res) => {
    
/* 
    const arrayOfShipment = {}
    Object.assign(arrayOfShipment, shipments)
    arrayOfShipment = {...shipments}    */
    // if where is shipment ID or order ID, sender ID, or clinet ID, 

    // creating match object for  framework 
    const match = {}
    if (req.query._id){
        match._id =  new mongoose.Types.ObjectId(req.query._id)
    }
    if (req.query.client){
        match.client = new mongoose.Types.ObjectId(req.query.client)
    }
    if (req.query.sender){
        match.sender = new mongoose.Types.ObjectId(req.query.sender)
    }
    if (req.query.shipment){
        match["shipments._id"] = new mongoose.Types.ObjectId(req.query.shipment)
    }

    // checking for empty query object 
    if (Object.keys(match).length === 0 && match.constructor === Object ){
        return res.status(400).send({ error : "Please spicify query parametrs"})
    }
    // return just users own orders (where he is a client or sender)
    const  userRestriction = { $or:[
        { client : new mongoose.Types.ObjectId(req.user.id)}, 
        { sender : new mongoose.Types.ObjectId(req.user.id)}
    ]}

    // return just existing shipments
    const shipmentsExist = {
        shipments : { $exists : true }
    }

    try {
        // getting array of shipments
        const shipments = await Order.aggregate([
            { "$match" : { $and : [ userRestriction, match, shipmentsExist ] }},  
            { "$project" : 
                { shipments : true, _id : 0}, 
            } ,  
        ]).exec()
        
        if (shipments.length === 0 ){
            return res.status(404).send({ error : "Nothing found"})
        }
        res.status(200).send(shipments)
    } catch (e){
        res.status(400).send({ error : e.message || e})

    }
})


// create new order

router.post('/orders', auth, async (req, res) => {
    
    const order = new Order( req.body)
    
    // thinkinn about validation 

    try {
        await order.save()
        res.status(201).send(order)
    } catch (e)  {
        res.status(400).send( { error : e.message || e })
    }

})

// update order 

router.patch('/orders/:id' , auth, async (req, res) => {

const updates = Object.keys(req.body)

//console.log(updates)

const allowedUpdates = [
    'description', 'stamps', 'client', 'sender', 'shipment', 
    'status', 'payed', 'sum', 'country', 'city', 'postalcode', 
    'fullAddress'
    
] 

const isUpdatesValid = updates.every((update) =>  allowedUpdates.includes(update))

if (!isUpdatesValid) {
    return res.status(400).send({ error : 'Invalid updates'})
}

try {

    //  client can update desciption, stamp, sender, shipment, address
    // if order status  
    // to upgrade client can't update shipment, client can't update, 
    // switch () case depend's of order status and user 

    const updatedOrder = await Order.findOneAndUpdate({ _id : req.params.id}, 
                                                req.body, 
                                                { new : true, runValidators : true })
    if (!updatedOrder){
        return res.status(404).send({ error : 'Order not found'})
    }
    res.status(200).send(updatedOrder)

} catch (e){
    res.status(400).send({ error : e.message || e })
}
})

// delete order 
// improve checking for depenedences 

router.delete('/orders/:id', auth, async (req, res) => {
    
    // validation:  Just order creater (client) can delete order 
    // if status is sent, not get if status
    
    try {
        const deletedOrder = await Order.findOneAndDelete({
            _id : req.params.id, 
            //client : req.user.id
        })
        if (!deletedOrder) {
            return res.status(404).send({ error : 'Order not found or you have not permision'})
        }
        res.status(200).send('Order has been deleted')

    } catch (e) {
        res.status(400).send({ error : e.message || e})
    }
})

// For dashboard get all order by client, by sender, status, payed
// GET /orders?client=alex
// GET /orders?sender=clientName

router.get('/orders/outbound', auth, async (req, res) => {
    // validation just owner and sender can get list of orders 
    // fields to populate: 
    /*      description (Order), 
            name, linkToImgUrl(Stamp), 
            username (User for Client), username (User for Sender)     
    */

    try {
        // list of orders to Send
        const ordersOtbound = await Order.find({ sender : req.user.id})
                            .populate({
                                path : 'client' , 
                                select : ['username', 'country']
                            } )
                            .populate({
                                path : 'sender', 
                                select : 'username'
                            })
                            .populate({ 
                                path : 'stamp', 
                                select : ['name', 'linkToImgUrl', 'price']
                            })
                            .populate({
                                path : 'shipment', 
                                select : 'sentDate'      
                            })
                            .populate({
                                path : 'address'
                            }) 
                            .exec()
            
        if (!ordersOtbound || ordersOtbound.length === 0) {
            return res.status(404).send({ error : 'Orders not found'}) 
        }   
        res.status(200).send(ordersOtbound)
    } catch (e) {
        res.status(400).send({ error : e.message || e})
    } 

    })

    // list of inbound orders 
router.get('/orders/inbound', auth, async (req, res) => {
    try {
        const ordersInbound = await Order.find({ client : req.user.id })
        .populate({
            path : 'client' , 
            select : ['username', 'country']
        } )
        .populate({
            path : 'sender', 
            select : 'username'
        })
        .populate({ 
            path : 'stamp', 
            select : ['name', 'linkToImgUrl', 'price']
        })
        .populate({
            path : 'shipment', 
            select : 'sentDate'      
        })
        .populate({
            path : 'address'
        })
        .exec()
        if (!ordersInbound){
            return res.status(404).send({ error : 'Orders not found'})
        }
        res.status(200).send(ordersInbound)
    }catch (e){
        res.status(400).send({ error : e.message || e })
    }

            
})

// get order by id 
// use populate to get full information from nested documents 

router.get('/orders/:id' , auth, async (req, res) => {

    const id = req.params.id
    if (!id){
        return res.status(400).send({ error : 'Id field not found'})
    }
    try {
        const order = await Order.find({ _id : id , $or:[{'client':req.user.id}, {'sender':req.user.id}]})
        .populate({
            path : 'client' , 
            select : ['username', 'country']
        } )
        .populate({
            path : 'sender', 
            select : 'username'
        })
        .populate({ 
            path : 'stamp', 
            select : ['name', 'linkToImgUrl', 'price']
        })
        .populate({
            path : 'shipment', 
            select : 'sentDate'      
        })
        .populate({
            path : 'address'
        })
        .exec()
        if (!order || order.length === 0){
            return res.status(404).send({ error : 'Orders not found or you have no permission'})
        }
        res.status(200).send(order)
    }catch (e){
        res.status(400).send({ error : e.message || e })
    }
})

module.exports = router 