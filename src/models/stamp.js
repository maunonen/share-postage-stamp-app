const mongoose = require('mongoose')

const stampSchema = new mongoose.Schema({
    name : {
        type : String, 
        minlength : 6, 
        trim : true,
        required : true
    }, 
    price : {
        type : Number, 
        default : 0
    }, 
    designer : {
        type : String, 
        trim : true
    }, 
    designedAt : {
        type  : Date
    }, 
    edition : {
        type : Number
    }, 
    linkToImgUrl : {
        type : String, 
        validate (value) {
            if (!validator.isURL(value)) {
                throw new Error ('Link to stapm is not valid')
            }
        }
    }, 
    owner : {
        type : mongoose.Schema.Types.ObjectId, 
        required : true, 
        ref : 'User'
    }
}, {
    timestamps : true
})

const Stamp = mongoose.model('Stamp', stampSchema)
module.exports = Stamp