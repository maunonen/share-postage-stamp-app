const express = require('express')
const auth = require('../middleware/auth')
const Stamp = require('../models/stamp')
const router = new express.Router()
const User = require('../models/user')
const Country = require('../models/country')
const mongoose = require('../db/mongoose')



router.post('/ordertransaction', auth, async (req, res) => {
    const session = await mongoose.startSession()      
    session.startTransaction()
    try {
        const stamp = new Stamp({
            ...req.body, 
            owner : req.user._id
        })
        await stamp.save()
        await session.commitTransaction()
        session.endSession()
        res.status(200).send(stamp) 
    } catch (e) {
        console.log(e.message)
        res.status(400).send( e.message  )
    }
})

router.post('/stamps', auth , async (req, res) => {
    const stamp = new Stamp({
        ...req.body, 
        owner : req.user._id
    })
    try {
        await stamp.save()
        res.status(200).send(stamp) 
    } catch (e) {
        console.log(e.message)
        res.status(400).send( e.message  )
    }
})

// patch stamps by id  - update stamps fileds 
router.patch('/stamps/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    if (! updates.length ){
        return res.status(400).send({ error : 'Nothing to update'})
    }
    const allowedUpdatesArray = ['name', 'price', 'designer', 'designedAt' , 'edition', 'linkToImgUrl', 'country']
    const isValidOperation = updates.every((update) => allowedUpdatesArray.includes(update))
    if (!isValidOperation){
        return res.status(400).send({ error : 'Invalid updates'})
    }

    try {
        const stamp = await Stamp.findOne({
            _id : req.params.id, 
            owner : req.user._id
        })
        if ( !stamp) {
            return res.status(404).send({ error : 'Nothing found'})
        }

        updates.forEach((update) => stamp[update]= req.body[update])
        await stamp.save()
        return res.status(200).send(stamp)
    } catch (e){
        res.status(400).send({
            error : e.message || e
        })
    }
})

// del stamps by id  - delete stamnps 

router.delete('/stamps/:id' ,  auth, async(req, res) => {

    try {
        const stamp = await Stamp.findOneAndDelete({
            _id : req.params.id, 
            owner : req.user._id
        })
        if (!stamp){
            return res.status(404).send()
        } 
        return res.status(200).send()
    } catch (e){
        return res.status(400).send({ error : e.message || e })
    }
})

// get stamps by stamp id 
router.get('/stamps/:id', auth, async (req, res) => {

    const _id = req.params.id
    
    try {
        const stamp = await Stamp.findOne ({ _id })
        if (!stamp) {
            return res.status(404).send()
        }
        return res.status(200).send(stamp)
    } catch (e) {
        return res.status(400).send( { error : e.message || e})
    }
} )

// get stamps owner id GET /stamps?owner=dbvjcbsvjhbj

router.get('/stamps', auth, async (req, res) => {

    if (!req.query.owner){
        return res.status(404).send({ error : 'Invalid search'})
    }
    try {
        const stampList = await Stamp.find({
            owner : req.query.owner
        }) 
         
        if (stampList.length === 0){
            return res.status(404).send()
        } 
        return res.status(200).send(stampList)

    } catch (e){
        return res.status(400).send({ error : e.message || e})
    }
})


// return list of stamps by country 
router.get('/stampbycountry/:id', auth, async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).send('Please specify country')
        }
        const stampsList = await Stamp.aggregate([
            { $lookup : {
                from : "countries", 
                localField : "country", 
                foreignField :  "_id", 
                as : "countryList"
            }} ,
            { $unwind : "$countryList" } , 
            {
               $match : { 
                   "countryList.shortName" : req.params.id
               } 
            },
             { $project : {
                _id : 1, 
                price: 1,
                name: 1,
                //designer: 1,
                //designedAt: 0,
                //edition: 0,
                linkToImgUrl: 1,
                owner: 1,
                //createdAt: 0,
                //updatedAt: 0,
                //__v: 0,
                //country: 0 
                
            }} 
            
            
            /* { $project : 
                { 
                    _id : 0 , 
                 
                    //country : "$countryList.shortName", 
            }
            } */
        ])

        if (!stampsList){
            return res.status(404).send('NOthing found')
        }
        res.status(200).send(stampsList)
    } catch ( e) {
        res.status(404).send( e.message || e)
    }
} ) 

// return the list of countries from stamp Collection 

router.get('/stampscountry', auth, async (req, res) => {
    try {   
        const countryList = await Stamp.aggregate([
            { $lookup : {
                from : "countries", 
                localField : "country", 
                foreignField :  "_id", 
                as : "countryList"
            }} , 
            { $unwind : "$countryList" } , 
             { $project : 
                { 
                    _id : 0 , 
                    country : "$countryList.shortName", 
            }
            },  
            { $group : {
                _id : null,
                countries : { 
                    $addToSet : "$country"
                }}
            }, 
            { 
                $project : {
                    _id : 0
                }
            } 
            
        ])
        if ( !countryList ) {
            return res.status(404).send('Nothing found')
        } 
        res.status(200).send(countryList)
    } catch (error) {
        return res.status(400).send( e.message || e) 
    } 
})

// return collection of all countries  
/* router.get('/stampscountries', auth , async (req, res) => {
    try {   
        const countriesList = await Stamp.aggregate([
            { $lookup : {
                from : "users", 
                localField : "owner", 
                foreignField : "_id", 
                as : "stampToUser"
            }}, 
            { $unwind : "$stampToUser" } , 
            { $project : 
                { 
                    _id : 1 , 
                    country : "$stampToUser.country", 
            }
            }, 
            {
                 $group : {
                     _id : "$country"
                 }
            }, 
             { $group : {
                _id : null,
                countries : { 
                    $push : "$_id"
                } 
                } 
            } , 
        ])
        if (countriesList.length === 0) {
            return res.status(404).send()
        }
        return res.status(200).send(countriesList)
    } catch (e) {
        console.log(e)
        return res.status(400).send( { error : e.message || e })
    }
} ) */

module.exports = router 