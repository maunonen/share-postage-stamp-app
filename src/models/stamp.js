const mongoose = require('mongoose')
const validator = require('validator')

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
    }, 
    country : {
        type : mongoose.Schema.Types.ObjectId, 
        required : true, 
        ref : 'Country'
    }
}, {
    timestamps : true
})

// clear stamp object before return it to the client 

stampSchema.methods.toJSON = function () {

    const stamp = this
    const stampObject = stamp.toObject()
    
    delete stampObject.createdAt
    delete stampObject.updatedAt

    return stampObject
}    

const Stamp = mongoose.model('Stamp', stampSchema)
module.exports = Stamp