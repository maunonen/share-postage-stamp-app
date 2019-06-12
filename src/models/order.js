const mongoose = require('mongoose')

const Address = require('./address')
const Stamp = require('./stamp')
const User = require('./user')
const validator = require('validator')

const orderSchema = new mongoose.Schema({
    description : {
        type : String, 
        trim : true
    }, 
    stamps : [{
        stamp :  {
            type : mongoose.Schema.Types.ObjectId, 
            ref : 'Stamp', 
            required : true
        }
    }], 
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

    fullAddress : {
        country : {
            type : String, 
            required : true, 
            trim : true
        }, 
        city : {
            type : String, 
            required: true, 
            trim : true
        }, 
        postalcode : {
            type : String, 
            required : true, 
            trim : true
        }, 
        address : {
            type : String, 
            required : true,
            trim : true
        }
    }, 
 
    // sent, approved, paid, delivered

    shipments : [{
        receiptUrl  : {
            type : String, 
            validate (value) {
                if (!validator.isURL(value)){
                    throw new Error('Reciept URL is not valid') 
                }
            }
        }, 
        shipper : {
            type : String
        }, 
        trackingNumber : {
            type : String
        }, 
        sentDate : {
            type : Date
        }
    }], 
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