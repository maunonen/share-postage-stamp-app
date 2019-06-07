const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Stamp = require('../../src/models/stamp')
const Address = require('../../src/models/address')
const Order = require('../../src/models/order')

const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()
const userThreeId = new mongoose.Types.ObjectId()
const userFourId = new mongoose.Types.ObjectId()
const stampOneId = new mongoose.Types.ObjectId()
const stampTwoId = new mongoose.Types.ObjectId()
const stampThreeId = new mongoose.Types.ObjectId()
const stampFourId = new mongoose.Types.ObjectId()

const userOne = {
    _id : userOneId, 
    username : "Jari", 
    phonenumber : "040454545", 
    email : "jari@gmail.com",
    password : "jari1111",
    rating : "0", 
    country : "finland", 
     tokens : [ { 
            token : jwt.sign({ _id : userOneId}, process.env.JWT_SECRET)
        } 
    ]
}

const userTwo = {
    _id : userTwoId, 
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

const userFour = {
    _id : userFourId, 
    username : "Juhani", 
    phonenumber : "04087987", 
    email : "juhani@gmail.com",
    password : "juhani1111",
    rating : "0", 
    country : "USA", 
    tokens : [ { 
            token : jwt.sign({ _id : userFourId}, process.env.JWT_SECRET)
        }
    ]
}

const userThree = {
    _id : userTwoId, 
    username : "Ja", 
    phonenumber : "04023423", 
    email : "jarigmail.com",
    password : "jari1111",
    rating : "0", 
    country : 678
    
}



const stampOneUserOne = {
    _id : stampOneId, 
    name : "stamp one", 
    price : 2.54, 
    designer  : "Alexander", 
    desisgnedAt : 1559814213, 
    edition : 2, 
    linkToImgUrl : 'https://www.rbc.ru/img1.jpg', 
    owner : userOneId
}

const stampTwoUserOne = {
    _id : stampTwoId, 
    name : "stamp two", 
    price : 1.99, 
    designer  : "Alexander", 
    desisgnedAt : 1559814213, 
    edition : 2, 
    linkToImgUrl : 'https://www.rbc.ru/img1.jpg', 
    owner : userOneId
}

const stampThreeUserTwo = {
    _id : stampThreeId, 
    name : "stamp three", 
    price : 1.99, 
    designer  : "Jenny", 
    desisgnedAt : 1559814213, 
    edition : 3, 
    linkToImgUrl : 'https://www.rbc.ru/img3.jpg', 
    owner : userTwoId
}

const  setupDatabase = async () => {
    await User.deleteMany()

}

const setupDatabaseLoginUser = async () =>{
    await User.deleteMany()
    await new User(userOne).save()
}
const setupDataBaseTestStamp = async () => {
    await User.deleteMany()
    await Stamp.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Stamp(stampOneUserOne).save()
    await new Stamp(stampTwoUserOne).save()
    await new Stamp(stampThreeUserTwo).save()
}

module.exports = {
    userOne, userThree, userTwo, userOneId, 
    userTwoId, setupDatabase, setupDatabaseLoginUser, 
    setupDataBaseTestStamp, stampOneId, stampTwoId, stampThreeId, 
    userFour, userFourId, stampFourId
}