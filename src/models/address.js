const mongoose = require('mongoose')
const validator = require('validator')

const addressSchema = new mongoose.Schema({
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
})

const Address = mongoose.model('Address', addressSchema)
module.exports = Address