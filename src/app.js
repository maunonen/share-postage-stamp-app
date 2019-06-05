const express = require('express')
const app = express()

// connecting to mongoDB via Mongoose 
require('./db/mongoose')

// declaring routers for User, Stamp, address, payment, shipment, orders 

const userRouter = require('./routers/users')
const stampRouter = require('./routers/stamps')
const addressRouter = require('./routers/addresses')
const orderRouter = require('./routers/orders')
const paymentRoute = require('./routers/payments')
const shipmentRoute = require('./routers/shipments')

app.use(express.json())

app.use ( (err, req, res, next) => {
    
    if (err instanceof SyntaxError &&
        err.status >= 400 && err.status < 500 &&
        err.message.indexOf('JSON')){
        res.status(400).send({ error : "Invalid JSON Object"} )
    }else{
        next ();
    }
});
app.use(userRouter)
app.use(stampRouter)
app.use(addressRouter)
app.use(orderRouter)
app.use(paymentRoute)
app.use(shipmentRoute)

module.exports = app
