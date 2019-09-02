const request = require('supertest')
const app = require('../src/app')
const Order = require('../src/models/order')
const User = require('../src/models/user')
const Stamp = require('../src/models/stamp')
const mongoose = require('mongoose')


const {setupDataBaseTestStamp, orderOneId, orderTwoId, orderThreeId, orderFourId,
       orderOne, orderTwoUserOne, orderThreeUserTwo, orderFourUserTwo, 
       setupDatabaseTestOrder, userOne, userOneId, orderOneUserOne, orderNotAllowed,
       orderInvalid, stampTwoId, userFour, shipmentOneId, shipmentTwoId, shipmentThreeId,
       userTwoId
    } = require('./fixtures/db')



describe('POST /orders/shipment/:id - adding shipment to order', () => {
    beforeEach(setupDataBaseTestStamp)
    beforeEach(setupDatabaseTestOrder)
    //const shipmentThreeId = new mongoose.Types.ObjectId()

    const shipmentValid = {
        _id : shipmentOneId, 
        receiptUrl : 'https://www.rbc.ru/imgq.jpg', 
        shipper : 'DHL', 
        trackingNumber : 'DHL-249t7249t', 
        sentDate : 1560340530
    }
    const shipmentInvalid  = {
        _id : shipmentTwoId,
        receiptUrl : 'imgq.jpg', 
        shipper : 'DHL', 
        trackingNumber : 687, 
        sentDate : 'dfbkdfbd'
    }
    const shipmentNotAllowed = {
        _id : 'bfsbsf',
        receiptUrl12 : 'https://www.rbc.ru/imgq.jpg', 
        shipper34 : 'DHL', 
        trackingNumber : 'DHL-249t7249t', 
        sentDate : 1560340530
    }

    test('User provide valid (token, order id, shipment data) STATUS 200', async() => {
        const res = await request(app)
            .post('/orders/shipment/' + orderOneId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(shipmentValid) 
            .expect(200)
        
    })

    test('User provide valid (token, order id), but invalid shipment of object fields. STATUS 400', async() => {
        await request(app)
            .post('/orders/shipment/' + orderOneId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(shipmentNotAllowed) 
            .expect(400)
    })

    test('User provide valid (token, but invalid values of shipment object STATUS 400', async() => {
        await request(app)
            .post('/orders/shipment/' + orderOneId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(shipmentInvalid) 
            .expect(400)
    })

    test('User provide valid (token, valid order Id), but invalid(broken) shipment object. STATUS 400 ', async() => {
        await request(app)
            .post('/orders/shipment/' + orderOneId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send('{"invalid"}')
            .type('json')
            .expect(400)
    })

    test('User provide invalid toke. STATUS 401', async() => {
        await request(app)
            .post('/orders/shipment/' + orderOneId)
            .set('Authorization', `Bearer ${'kjfsnbjksnf'}`)
            .expect(401)
    })

    test('User rpovide valid (token, valid shipment object) but invalid/empty/undefinded, order ID. STATUS 400', async() => {
        await request(app)
            .post('/orders/shipment/' + 'jghrkjbr')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(shipmentValid) 
            .expect(400)
        await request(app)
            .post('/orders/shipment/')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(shipmentValid) 
            .expect(404)
        await request(app)
            .post('/orders/shipment/' + undefined)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(shipmentValid) 
            .expect(400)
    })

    test('User provide valid (token, shipment object, order id), but he is not sender. STATUS 404', async() => {
         await request(app)
            .post('/orders/shipment/' + orderOneId)
            .set('Authorization', `Bearer ${userFour.tokens[0].token}`)
            .send(shipmentValid) 
            .expect(404)
    })
  
})

describe('DELETE /orders/shipment/:id?id=shipmentid', () => {
    beforeEach(setupDataBaseTestStamp)
    beforeEach(setupDatabaseTestOrder)
    
    test('Users provide valid (token, order id, shipment id, he is owner of order. STATUS 200)', async() => {      
        const resDelted = await request(app)
            .delete('/orders/shipment/' + orderOneId + '?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(200)
        const shipVal = await Order.findById( orderOneId)
        expect(shipVal.shipments.length).toEqual(2)
        
    })

    test('User provide valid (token, order id, shipment id), but he is not owner of order STATUS 404', async() => {
        await request(app)
            .delete('/orders/shipment/' + orderOneId + '?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${userFour.tokens[0].token}`)
            .expect(404)
    })
    
    test('User provide invalid token. STATUS 401', async() => {
        await request(app)
            .delete('/orders/shipment/' + orderOneId + '?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${'sfvfsvsvs'}`)
            .expect(401)
    })
    test('User provide valid (token, order id, he is owner), broken/empty/undefined/wrong (shipment id). STATUS 400', async() => {
        await request(app)
            .delete('/orders/shipment/' + orderOneId + '?id=' + 'sfjvnsfkv')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(400)
        await request(app)
            .delete('/orders/shipment/' + orderOneId + '?id=' + undefined)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(400)
        await request(app)
            .delete('/orders/shipment/' + orderOneId )
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(400)
        await request(app)
            .delete('/orders/shipment/' + orderOneId + '?id=' + shipmentThreeId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(200)
        //console.log(res.body)
    })
    test.skip('Valid (token, shipment id) user is owner, broken/empty/undefined/wrong (order ID). STATUS 404/400', async() => {
        await request(app)
            .delete('/orders/shipment/' + 'sfhvshvb' + '?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(400)
        await request(app)
            .delete('/orders/shipment/' + undefined + '?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(400)
        await request(app)
            .delete('/orders/shipment/' + '?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(400) 
        await request(app)
            .delete('/orders/shipment/')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(400) 
        await request(app)
            .delete('/orders/shipment/' + orderFourId + '?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(404)       
    })
    test('Valit token shipment id. User is not a sender' , async ()=>{
        await request(app)
            .delete('/orders/shipment/' + orderOneId +'?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${userFour.tokens[0].token}`)
            .expect(404)
        
    })
})

describe('PATCH /orders/shipment/:id - update shipments ', () => {
    beforeEach(setupDataBaseTestStamp)
    beforeEach(setupDatabaseTestOrder)
    const shipValidUpdates = {
        receiptUrl : 'https://www.rbc.ru/fedex.jpg', 
        shipper : 'Fedex'
        //trackingNumber : 'Fedex-249t7249t', 
    }
    const shipInvalidUpdates = {
        receiptUrlERD : 'https://www.rbc.ru/fedex.jpg', 
        shipper1 : 'Fedex', 
        trackingNumber1 : 'Fedex-249t7249t', 
    }
    const shipNotAllowed = {
        receiptUrl : 'httpspg', 
        shipper : 567, 
        trackingNumber : 39765, 
    } 
    test('Valid (token, updates, order id, shipment id) user owned the order. STATUS 200', async() => {
        await request(app)
                .patch('/orders/shipment/' + orderOneId + '?id=' + shipmentOneId)
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send(shipValidUpdates) 
                .expect(200)
        const shipUpdated = await Order.findById( orderOneId)
        expect(shipUpdated.shipments[0].shipper).toEqual('Fedex')
    })

    test('Invalid token. STATUS 401', async() => {
        await request(app)
            .patch('/orders/shipment/' + orderOneId + '?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${'vjbsvkjsbv'}`)
            .send(shipValidUpdates) 
            .expect(401)
    })

    test('Invalid/broken order ID. 400', async() => {
        await request(app)
            .patch('/orders/shipment/' + 'fhvbfdf' + '?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(shipValidUpdates) 
            .expect(400)
        await request(app)
            .patch('/orders/shipment/' + orderFourId + '?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(shipValidUpdates) 
            .expect(404)
    })

    test('Invalid (not exist) order ID. STATUS 400', async() => {
        await request(app)
            .patch('/orders/shipment/' + '?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(shipValidUpdates) 
            .expect(400)
        await request(app)
            .patch('/orders/shipment/' + undefined + '?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(shipValidUpdates) 
            .expect(400)
    })
    test('Invalid/broken shipment ID 400', async() => {
        await request(app)
            .patch('/orders/shipment/' + orderOneId + '?id=' )
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(shipValidUpdates) 
            .expect(400)
        await request(app)
            .patch('/orders/shipment/' + orderOneId + '?id=' + undefined)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(shipValidUpdates) 
            .expect(400)
        await request(app)
            .patch('/orders/shipment/' + orderOneId )
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(shipValidUpdates) 
            .expect(400)
    })
  
    test('Invalid(broken) updates object. STATUS 400', async() => {
        await request(app)
            .patch('/orders/shipment/' + orderOneId + '?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send('{invalid,}') 
            .type('json')
            .expect(400)
    })
    test('Invalid values of updates object. STATUS 400', async() => {
        await request(app)
            .patch('/orders/shipment/' + orderOneId + '?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(shipInvalidUpdates) 
            .expect(400)
    })
    test('Updates not allowed. STATUS 400', async() => {
        await request(app)
            .patch('/orders/shipment/' + orderOneId + '?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(shipNotAllowed) 
            .expect(400)
    })

    test('User doesnt own the order. STATUS 404', async() => {
        await request(app)
            .patch('/orders/shipment/' + orderOneId + '?id=' + shipmentOneId)
            .set('Authorization', `Bearer ${userFour.tokens[0].token}`)
            .send(shipValidUpdates) 
            .expect(404)
    })
})

describe('GET /orders/shipment - get list of order shipment due quering string', () => {
    beforeEach(setupDataBaseTestStamp)
    beforeEach(setupDatabaseTestOrder)
    test('Valid (token, client id, sender id, order _id, shipment id). Shipments is exist. STATUS 200', async() => {
        const res = await request(app)
            .get('/orders/shipment' + '?' + 
                //'_id=' + orderOneId 
                //+
                //'client=' + userTwoId 
                //+
                'sender=' + userTwoId 
                //+ 
                //'&shipment=' + shipmentOneId
            )
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(200)
        console.log(res.body)
    })

    test.skip('All parametrs are valid. Shipments doesnt exist. STATUS 404 ', async() => {
        
    })
    // should check for different 
    test.skip('Valid token. Invalid (client id, sender id, order _id, shipment id)', async() => {
        
    })

    test.skip('Valid token. Invalid/broken (client id, sender id, order _id, shipment id)', async() => {
        
    })

    test.skip('Query string is emty. STATUS 400', async() => {
        
    })

    test.skip('Invalid token. STATUS 401', async() => {
        
    })

    test.skip('Query string values are UNDEFINED. STATUS 401', async() => {
        
    })
    
   
})


describe('POST /orders', () => {
    
    beforeEach(setupDataBaseTestStamp)
    //beforeEach(setupDatabaseTestOrder)
    
    test('Valid token, all req.body parameters. STATUS 201', async() => {
        const res = await request(app)
                        .post('/orders')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send(orderOneUserOne)
                        .expect(201)                                        
    })

    test('Invalid token. STATUS 401', async() => {
        const res = await request(app)
                        .post('/orders')
                        .set('Authorization', `Bearer ${'hjfbjkfb jk'}`)
                        .send(orderOneUserOne)
                        .expect(401)                 
    })

    test('Broken/invalid req.body object. STATUS 400', async() => {
        const res = await request(app)
                        .post('/orders')
                        .set('Authorization', `Bearer ${'hjfbjkfb jk'}`)
                        .send('{"invalid"}')
                        .type('json')
                        .expect(400)                 
    })
    test('Order JSON object fields not allowed. STATUS 400', async() => {
        const res = await request(app)
                        .post('/orders')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send(orderNotAllowed)
                        .expect(400)  
                        
    })
    test('Valid fileds and object. Value of fields order not valid. STATUS 400', async() => {
        const res = await request(app)
                        .post('/orders')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send(orderInvalid)
                        .expect(400)  
    })
    test('Emty req.body object. STATUS 400', async() => {
        const res = await request(app)
                        .post('/orders')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send({})
                        .expect(400)  
    })

}) 

describe('PATCH /orders/:id - update order', () =>{
    beforeEach(setupDataBaseTestStamp)
    beforeEach(setupDatabaseTestOrder)

    const validUpdates = {
        //_id : orderFourId, 
        description : "Stamp changed order ", 
        stamps : [{ stamp : stampTwoId}], 
        //client : userOneId, 
        //sender : userTwoId, 
         fullAddress : {
            country : 'USA', 
            city : 'NJ', 
            postalcode : '01510', 
            address : 'Lautamiehentie 4 C'
        },  
        status : 'send', 
        sum : 7
    }

    const invalidUpdates = {
         description : "Stamp changed order ", 
         stamps : [{ stamp : stampTwoId}], 
          fullAddress : {
             country : 'USA', 
             city : 'NJ', 
             postalcode : '01510', 
             address : 'Lautamiehentie 4 C'
         },  
         status : 5, 
         sum : 'bsbs'
    }

    const notAllowedUpdates = {
        _id : orderFourId, 
        description : "Stamp changed order ", 
        stamps : [{ stamp : stampTwoId}], 
        //client : userOneId, 
        //sender : userTwoId, 
         fullAddress1 : {
            country : 'USA', 
            city : 'NJ', 
            postalcode : '01510', 
            address : 'Lautamiehentie 4 C'
        },  
        status1 : 'send', 
        sum1 : 7
    }

    test('Valid (token, req.body JSON object and its values, order ID). STATUS 200', async () => {
        const res = await request(app)
                        .patch('/orders/' + orderOneId)
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send(validUpdates)
                        .expect(200)
    })
    test('Invalid token. STATUS 401', async () => {
        const res = await request(app)
                        .patch('/orders/' + orderOneId)
                        .set('Authorization', `Bearer ${'vbnsfbjk '}`)
                        .send(validUpdates)
                        .expect(401)
    })
    test('Valid token. Broken req.body JSON object. STATUS 400 ', async () => {
        const res = await request(app)
                        .patch('/orders/' + orderOneId)
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send('{"invalid"}')
                        .type('json')
                        .expect(400)


    })
    test('Valid token. Updates not allowed. STATUS 400', async () => {
        const res = await request(app)
                        .patch('/orders/' + orderOneId)
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send(notAllowedUpdates)
                        .expect(400)
    })
    test('Valid token and updates object. Invalid values of updates. Status 400.', async () => {
        const res = await request(app)
                        .patch('/orders/' + orderOneId)
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send(invalidUpdates)
                        .expect(400)
    })
    test('Invalid order ID. all value valid. STATUS 400', async () => {
        const res = await request(app)
                        .patch('/orders/' + 'fsvfsvfs')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send(validUpdates)
                        .expect(400)
                        //console.log(req.body)
        const res1 = await request(app)
                        .patch('/orders/' + undefined)
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send(validUpdates)
                        .expect(400)
                        //console.log(req1.body)
    })
    test.skip('User is not owner of order. STATUS 404', async () => {
        const req = await request(app)
                        .patch('/orders/' + orderOneId)
                        .set('Authorization', `Bearer ${userFour.tokens[0].token}`)
                        .send(validUpdates)
                        .expect(404)
    })
   
})

describe('DELETE /orders/:id  - delete order', () =>{
    
    beforeEach(setupDataBaseTestStamp)
    beforeEach(setupDatabaseTestOrder)

    test('Valid (token, order ID, user owns the order. STATUS 200)', async () => {
        const res = await request(app)
                        .delete('/orders/' + orderThreeId)  
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)                          
                        .expect(200)
        expect(res.text).toBe('Order has been deleted')
    })
    test('Invalid token. STATUS 401', async () => {
        await request(app)
                .delete('/orders/' + orderThreeId)  
                .set('Authorization', `Bearer ${'adjvbadkvad'}`)                          
                .expect(401)
    })
    test('Invalid order ID. STATUS 400', async () => {
        await request(app)
                .delete('/orders/' + 'vsfvsf')  
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)                                                 
                .expect(400)
    })
    test('Valid order ID and token, but order was deleted right before. STATUS 400', async () => {
        await request(app)
                .delete('/orders/' + orderThreeId)  
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)                                                 
                .expect(200)
        await request(app)
                .delete('/orders/' + orderThreeId)  
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)                                                 
                .expect(404)
    })
    test.skip('Valid (token, order id). User is not client of the order. STATUS 404', async () => {
        await request(app)
                .delete('/orders/' + orderThreeId)  
                .set('Authorization', `Bearer ${userFour.tokens[0].token}`)                                                 
                .expect(404)
    })
})

// outbound - where he is a sender
describe('GET /orders/outbound - user get the list of own outbound orders', () =>{
    test('Valid token. Get List of order STATUS 200', async () => {
        await request(app)
                .get('/orders/outbound')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)                                                 
                .expect(200)
    })
    test('Invalid token. STATUS 401', async () => {
        await request(app)
                .get('/orders/outbound')
                .set('Authorization', `Bearer ${'sjvnsjkv'}`)                                                 
                .expect(401)
    })
    test('Valid token. But orders not exist. STATUS 404', async () => {
        await request(app)
                .get('/orders/outbound')
                .set('Authorization', `Bearer ${userFour.tokens[0].token}`)                                                 
                .expect(404)
    })
})
// inbound - where he is a client 
describe('GET /orders/inbound - get list of outbound orders', () =>{
    test('Valid token. Get List of order STATUS 200', async () => {
        await request(app)
                .get('/orders/outbound')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)                                                 
                .expect(200)
    })
    test('Invalid token. STATUS 401', async () => {
        await request(app)
                .get('/orders/outbound')
                .set('Authorization', `Bearer ${'vjsfvnjs'}`)                                                 
                .expect(401)
    })
    test('Valid token. But orders not exist. STATUS 404', async () => {
        await request(app)
                .get('/orders/outbound')
                .set('Authorization', `Bearer ${userFour.tokens[0].token}`)                                                 
                .expect(404)
    })
})

describe('GET /orders/:id - get order by ID', () =>{
    test('Valid (token, order id, user is owner of order, order exist. STAUS 200)', async() => {
        await request(app)
                .get('/orders/' + orderOneId)
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)                                                 
                .expect(200)
    })
    test('Invalid token. STATUS 401', async () => {
        await request(app)
                .get('/orders/' + orderOneId)
                .set('Authorization', `Bearer ${'fvfvsf'}`)                                                 
                .expect(401)
    })
    test('Invalid/broken order ID. Vaid(token). STATUS 400', async () => {
        await request(app)
                .get('/orders/' + 'fjkvnfejkn')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)                                                 
                .expect(400)        
    })
    test('Valid (token). order ID is empty or undefinded. STATUS 400', async () => {
        // Empty
        await request(app)
                .get('/orders/')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)                                                 
                .expect(404)
        // undefinded                
        await request(app)
                .get('/orders/' + undefined)
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)                                                 
                .expect(400)
    })
   
    test('Valid token. User is not participant (not owner or not recipient) STATUS 404', async () => {
        await request(app)
                .get('/orders/' + orderOneId)
                .set('Authorization', `Bearer ${userFour.tokens[0].token}`)                                                 
                .expect(404)
    })
})





