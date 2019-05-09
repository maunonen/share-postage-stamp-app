const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res , next ) => {
    try {
        // get Authorization token from header and clear from Bearer word 
        const token = req.header('Authorization').replace('Bearer ', '')
        //virify users token by secret word
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        // find user by token in database 
        // find user 
        const user = await User.findOne({ _id : decoded._id, 'tokens.token' : token})
        
        if(!user) {
            throw new  Error('Please authenticate')
        }
        req.token = token 
        req.user = user
        next()

    } catch (error) {
        res.status(401).send({
            error : error.message || error
        })
    }
}

module.exports = auth