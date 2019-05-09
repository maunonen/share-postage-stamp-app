const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
//const uniqueValidator = require('mongoose-unique-validator')
const jwt = require('jsonwebtoken')

const Stamp = require('./stamp')

// add validation and foreign fields 

const userSchema = new mongoose.Schema({
    username : {
        type : String, 
        minlenght : 6, 
        required : true, 
        trim : true, 
        unique : true 
    }, 
    country : {
       type : String, 
       trim : true
    }, 
    phonenumber : {
        type : String, 
        required : true, 
        trim : true, 
        unique : true, 
        validate (value){
            if (!validator.isMobilePhone(value)){
                throw new Error('Phone is invalid')
            }
        }
    }, 
    email : {
        type : String, 
        required : true, 
        trim : true,
        lowercase : true, 
        unique : true, 
        validate(value) {
            if (!validator.isEmail(value)){ 
                throw new Error('Email is invalid')
            }
        }
    }, 
    password : {
        type : String, 
        required : true, 
        trim : true, 
        minlenght : 6  
    }, 
    // sender rating calculate every time when orders successfully delivered
    rating : {
        type : Number, 
        default : 0 
    }, 
    tokens : [{
        token : {
            type : String, 
            required : true 
        }
    }]  
})

/* userSchema.virtual('stamps', {
    ref : 'Stamp', 
    localField : '_id', 
    foreignField : 'owner'
}) */

userSchema.statics.findByCredential = async (email, password) => {
    const user = await User.findOne({ email})   
    if (!user ){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        throw new Error('Unable to login') 
    }
    return user     
}

// generating token with jsonwebtoken 

userSchema.methods.generateAuthToken = async function() {
    const user = this 
    try {
        // generating token with secret 
        const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET)
        // add new token to Array tokens and save to collection
        user.tokens = user.tokens.concat({ token})
        await user.save()
        return token 
    } catch (e){
        throw new Error(e)
    }
}

// clear object from significant data such as (tokens, password and )

userSchema.methods.toJSON = function () {

    const user = this 
    const userObject = user.toObject() 
    delete userObject.password
    delete userObject.tokens

    return userObject
}

// hash password before save to Collection
userSchema.pre('save', async function(next){

    const user = this 
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// 


const User = mongoose.model('User', userSchema )
module.exports = User   