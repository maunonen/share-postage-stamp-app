const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Stamp = require('../../src/models/stamp')
const Address = require('../../src/models/address')
const Order = require('../../src/models/order')

const userOneToId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()
const userThreeId = new mongoose.Types.ObjectId()
const userFoorId = new mongoose.Types.ObjectId()

const userOne = {
    _id : userOneToId, 
    username : "Jari", 
    phonenumber : "040454545", 
    email : "jari@gmail.com",
    password : "jari1111",
    rating : "0", 
    country : "finland", 
     tokens : [ { 
            token : jwt.sign({ _id : userOneToId}, process.env.JWT_SECRET)
        } 
    ]
}

const userTwo = {
    username : "Jenny", 
    phonenumber : "04000000", 
    email : "jenny@gmail.com",
    password : "jenny1111",
    rating : "0", 
    country : "USA", 
    tokens : [ { 
            token : jwt.sign({ _id : userTwoId}, process.env.JWT_SECRET)
        }
    ]
}

const userThree = {
    username : "Je", 
    phonenumber : "04000000", 
    email : "jennygmail.com",
    password : "jenny1111",
    rating : "0", 
    country : 678, 
    tokens : [ { 
            token : jwt.sign({ _id : userTwoId}, process.env.JWT_SECRET)
        }
    ]
}

const  setupDatabase = async () => {
    await User.deleteMany()

}

const setupDatabaseLoginUser = async () =>{
    await User.deleteMany()
    await new User(userOne).save()
}

module.exports = {
    userOne, userThree, userTwo, userOneToId, 
    userTwoId, setupDatabase, setupDatabaseLoginUser
}