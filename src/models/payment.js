const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    payer : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'User', 
        required : true
    }, 
    order : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'Order', 
        required : true
    }, 
    // return value from paytrail or any kind of proocessing operator 
    transactionNumber : {
        type : String, 
        required : true
    }, 
    transactionAmount : {
        type : Number, 
        required : true
    }
}, {
    timestamps : true
})

const Payment = mongoose.model('Payment', paymentSchema)
module.exports = Payment 