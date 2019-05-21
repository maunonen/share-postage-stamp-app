const express = require('express')
const Order =  require('../models/order')
const auth = require('../middleware/auth')
const User = require('../models/user')


// const User = require()

const router = new express.Router()

// create new order

router.post('/orders', auth, async (req, res) => {
    
    const order = new Order( req.body)
    
    // think about validation 

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
const allowedUpdates = ['description', 'stamp', 'client', 'sender', 'shipment', 'address', 'status', 'payed', 'sum' ] 

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
            _id : req.params.id 
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