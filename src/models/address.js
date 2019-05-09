const mongoose = require('mongoose')

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
        trim : true, 
        validate (value) {
            if (! validator.isPostalCode(value)){
                throw new Error ('Postalcode is not valid')
            }
        }
    }, 
    address : {
        type : String, 
        required : true,
        trim : true
    }
})

const Address = mongoose.model('Address', addressSchema)
module.exports = Address