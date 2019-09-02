const express = require('express')

const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const mongoose = require('mongoose')

// GET /tasks?country=Finland


router.get('/users/', auth, async (req, res) => {

    // get country from query parametr 
    const country = req.query.country
    if (!country){
        return res.status(400).send({ error : 'Please choose a counrty'})
    }
    try {
        const senderList = await User.find({ country })
        if (senderList.length === 0){
            return res.status(204).send()
        }
        return res.status(200).send(senderList)
    } catch (e){
        return res.status(400).send({ error : e.message || e })
    }
})

// get user profile
router.get('/users/profile', auth, async (req, res) => {
    
    // all user profile data saved to req. in auth function
    res.status(200).send(req.user)
}) 

// get use by id 
/* router.get('/users/:id', async (req, res) => {

    // ???? 

})  */

// delete user

router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove()
        res.status(200).send(req.user)
    } catch (error) {
        res.status(500).send()
    }   
    
}) 

// update user 
router.patch('/users', auth, async (req, res) => {

    // get title of fields from req.body 
    const updates = Object.keys(req.body)
    // define allowed updates 
    const allowedUpdateArray = ['email','password','username', 'phonenumber', 'country', 'location']
    // validate updates due  allowedupdates 
    const isValidOperation = updates.every((update) => allowedUpdateArray.includes(update))

    if (!isValidOperation){
        return res.status(400).send({ error : 'Invalid updates'})
    }
    try {
        // Loop through all updates in re.body and assigned it req.user  
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        } )
        await req.user.save()
        res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send({ error : error.message || error })
    }
}) 

// login user 
router.post('/users/login', async (req, res) => {

    try{
        // login user 
        const user = await User.findByCredential(req.body.email, req.body.password)
        // generate token to user 
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error){
        res.status(400).send( { error :  error.message || error})
    }
}) 



// logout user 
router.post('/users/logout', auth, async (req, res) => {
    
    try {
        req.user.tokens = req.user.tokens.filter( (token) => {
            return token.token !== req.token
        }) 
        await req.user.save()
        res.status(200).send('Logout successfully')
    } catch (e) {
        res.status(500).send()
    }
}) 

// read users 
router.get('/users/all', async (req, res) => {
    
}) 

// create user 

router.post('/users', async (req, res) => {
    
    const user = User (req.body)
    try {
        await user.save() 
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})

    } catch (e) {
        res.status(400).send({ error : e.message || e})
    }

} )

// routes to handle user shopping cart 

// add stamp to cart 
router.post('/users/cart/:id',  auth, async (req, res) => {
    try { 
        //console.log(req.params.id)
        const userCart = await User.findOneAndUpdate(
            { _id : req.user.id }, 
            { "$push" : {
                "cart" : {
                    _id : new mongoose.Types.ObjectId(req.params.id)
                }
            }}, 
            { new : true, runValidators  :true }
        ) 
        if ( !userCart) {
            return res.status(404).send('Not found')
        }
            res.status(200).send(userCart)
        
    } catch (e) {
        //console.log(e.message || e)
        res.status(400).send( e.message || e )
    }
} ) 

// remove stamp from cart 
// din't throw an error with emty cart and not excisting sytamp in the array 

router.delete('/users/cart/:id', auth, async (req, res ) => {
    try {
        if (!req.params.id ){
            return res.status(400).send('Please specify stamp ID')
        }
        const deletedStamp = await User.findOneAndUpdate(
            { _id : req.user.id }, 
            { "$pull" : {
                "cart" : { 'stamp' : new mongoose.Types.ObjectId(req.params.id) }
            }}, 
            { new : true}, 
             (err, doc) => {
                if (err){
                    return res.status(404).send('Not found')
                }
                return res.status(200).send('Success')
            } 
        )
    }catch (e) {
        res.status(400).send( e.message || e )
    }
})

// clean cart from stamp 

router.delete('/users/cartall', auth , async (req, res) => {
    try {
        const cleanCart = await User.findOneAndUpdate(
            { _id : req.user.id }, 
            { $set :  {
                cart  : []
            }}, 
            { new : true} 
        )
        if (!cleanCart) {
            return res.status(404).send('not found')
        }
        res.status(200).send('Success')
    }catch (e) {
        console.log(e.message || e)
        res.status(400).send( e.message || e )
    }
}) 

// get list of stamp in the cart 
router.get('/users/cart', auth, async (req, res) => {
    try { 
        const cartArr = await User.findOne(
            { _id : req.user.id}, 
            { cart : true, _id : 0}
        )
        if (!cartArr){
            return res.status(404).send('Not found')
        }
        res.status(200).json(cartArr)
    } catch (e) {
        return res.status(400).send( e.message || e)
    }   
}
)

module.exports = router 