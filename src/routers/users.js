const express = require('express')

const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


// GET /tasks?country=Finland

router.get('/users/', async (req, res) => {

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
router.get('/users/:id', async (req, res) => {

    

}) 

// delete user

router.delete('/users', auth, async (req, res) => {

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
    const allowedUpdateArray = ['email','password','username', 'phonenumber', 'country']
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

        console.log(updates)
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
        res.status(400).send(e)
    }

} )

module.exports = router 