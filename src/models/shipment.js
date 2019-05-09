const mongoose = require('mongoose') 

const shipmentSchema = new mongoose.Schema({
 
    order : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'Order', 
        required : true
    }, 
    receiptUrl  : {
        type : String, 
        validate (value) {
            if (!validator.isURL(value)){
                throw new Error('Reciept URL is not valid') 
            }
        }
    }
}, {
    timestamps : true
})



const Shipment = mongoose.model('Shipment', shipmentSchema)
module.exports = Shipment