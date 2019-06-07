const request = require('supertest')
const app = require('../src/app')
const Order = require('../src/models/order')
const User = require('../src/models/user')
const Stamp = require('../src/models/stamp')

const {setupDataBaseTestStamp} = require('./fixtures/db')

describe('POST /orders/shipment/:id - adding shipment to order', () => {
    test.skip('User provide valid (token, order id, shipment data) STATUS 200', async() => {

    })

    test.skip('User provide valid (token, shipment id), but invalid shipment values of object fields. STATUS 200', async() => {
        
    })

    test.skip('User provide valid (token, but invalid values of shipment object STATUS 400', async() => {
        
    })

    test.skip('User provide valid (token, valid order Id), but invalid(broken) shipment object. STATUS 400 ', async() => {

    })

    test.skip('User provide invalid toke. STATUS 401', async() => {

    })

    test.skip('User rpovide valid (token, valid shipment object) but invalid, order ID. STATUS 400', async() => {

    })

    test.skip('User provide valid (token, shipment object, order id), but he is not owner. STATUS 404', async() => {

    })
  
})

describe('DELETE /orders/shipment/:id', () => {
    test.skip('Uers provid valid (token, order id, shipment id, he is owner of order. STATUS 200)', async() => {

    })

    test.skip('User provide valid (token, order id, shipment id), but he is now owner of order STATUS 404', async() => {
        
    })
    test.skip('User provide invalid token. STATUS 401', async() => {
        
    })
    test.skip('User provide valid (token, order id, he is owner), invalid (shipment id). STATUS 404', async() => {
        
    })
    test.skip('Valid (token, shipment id) user is owner, invalid (order ID). STATUS 404', async() => {
        
    })
    test.skip('Valid (token, shipment id) he is owner, and query parametr has not provide. STATUS 400  ', async() => {
        
    })
    test.skip('Valid (token, shipment id) he is woner, but req.params has not provide. STATUS 400', async() => {
        
    })
    test.skip('Invalid(broken) order ID. STATUS 400', async() => {
        
    })
    test.skip('Invalid(broken) shipment ID 400', async() => {
        
    })


})

describe('PATCH /orders/shipment/:id - update shipments ', () => {
    test.skip('Valid (token, updates, order id, shipment id) user owned the order. STATUS 200', async() => {

    })

    test.skip('Invalid token. STATUS 401', async() => {
        
    })

    test.skip('Invalid/broken order ID. 400', async() => {
        
    })

    test.skip('Invalid (not exist) order ID. STATUS 400', async() => {
        
    })
    test.skip('Invalid/broken shipment ID 400', async() => {
        
    })
    test.skip('Invalid (not exist) shipment id 404', async() => {
        
    })
    test.skip('Invalid(broken) updates object. STATUS 400', async() => {
        
    })
    test.skip('Invalid values of updates object. STATUS 400', async() => {
        
    })
    test.skip('Updates not allowed. STATUS 400', async() => {
        
    })

    test.skip('User doesnt own the order. STATUS 404', async() => {
        
    })
    test.skip('Shipment ID has not provided. STATUS 400', async() => {
        
    })
    test.skip('Order ID has not provided. STATUS 400', async() => {
        
    })
})

/* describe('sflvslfv', () => {
    test.skip('', async() => {

    })

    test.skip('', async() => {
        
    })

    test.skip('', async() => {
        
    })
})

describe('wirgjrwois', () => {
    test.skip('', async() => {

    })

    test.skip('', async() => {
        
    })

    test.skip('', async() => {
        
    })
}) */