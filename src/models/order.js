const mongoose = require('mongoose')

const Address = require('./address')
const Stamp = require('./stamp')
const User = require('./user')

const orderSchema = new mongoose.Schema({
    description : {
        type : String, 
        trim : true
    }, 
    // may be here should be an array of stamp 
    stamp  : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'Stamp', 
        required : true
    }, 
    client : {
        type : mongoose.Schema.Types.ObjectId,
        required : true, 
        ref : 'User'
    }, 
    sender : {
        type : mongoose.Schema.Types.ObjectId, 
        required : true, 
        ref : 'User'
    }, 
    shipment : {
        type : mongoose.Schema.Types.ObjectId
    }, 

    address : {
        type : mongoose.Schema.Types.ObjectId, 
        required : true, 
        ref : 'Address'
    }, 
    status : {
        type : String,
        required : true
    }, 
    payed : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'Payment'
    }, 
    sum : {
        type : Number, 
        default : 0
    }
}, {
    timestamps : true
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order