const request = require('supertest')
const app = require('../src/app')
const Stamp = require('../src/models/stamp')

const { userOne, setupLoginUser, userOneId, userTwoId,  
        stampThreeId, setupDataBaseTestStamp, userTwo, userFour, userFourId, 
        stampOneId, stampTwoId, stampFourId
    } = require('../tests/fixtures/db')


describe('POST /stamps - signed user create new stamp ', () => {
    beforeEach(setupDataBaseTestStamp)
    const validStampFour =  {    
            _id : stampFourId, 
            name : "stamp Four", 
            price : 1.65, 
            designer  : "Jari", 
            desisgnedAt : 1559814213, 
            edition : 3, 
            linkToImgUrl : 'https://www.rbc.ru/img3.jpg', 
            owner : userTwoId
    }
    const  invalidValuesStamp = {
            _id : stampFourId, 
            name : "stam", 
            price : "sfsf", 
            designer  : "Jari", 
            desisgnedAt :"f fd ", 
            edition : 3, 
            linkToImgUrl : 'fvdffd'
    }

    test('User provide valid token and valid stamp data STATUS 200', async () => {
        const res = await request(app)
                            .post('/stamps')
                            .set('Content-Type', 'application/json')
                            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                            .send(validStampFour)
                            .expect(200)
    })

    test('User has not provide token STATUS 401', async () => {
        const res = await request(app)
                            .post('/stamps')
                            .set('Content-Type', 'application/json')
                            //.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                            .send(validStampFour)
                            .expect(401)
    })

    test('Provide valid token, but invalid(broken) stamp object STATUS 400', async () => {
        const res = await request(app)
                            .post('/stamps')
                            .set('Content-Type', 'application/json')
                            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                            .send('{"invalid"}')
                            .type('json')
                            .expect(400)
    })

    test('Provide valid token, valid stamp object, but invalid values of objects fields STATUS 400', async () => {
        
        const res = await request(app)
                            .post('/stamps')
                            .set('Content-Type', 'application/json')
                            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                            .send(invalidValuesStamp)
                            .expect(400)
    })
})

describe('GET /stamps/?owner=id - user get list of stamps by Owner id ', () => {
    beforeEach(setupDataBaseTestStamp)
    test('Valid token, valid owner ID, list exist -  STATUS 200', async () => {
        const res = await request(app)
                        .get('/stamps?owner=' + userOne._id)
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(200)
        expect(res.body).not.toBeNull()
        
    })
    test('Valid token, valid owner id, stamps not exist - STATUS 404 ', async () => {
        const res = await request(app)
                        .get('/stamps?owner=' + userFourId)
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(404)
        
    })

    test('Valid token, invalid owner id - STATUS 400', async () => {
        const res = await request(app)
                        .get('/stamps?owner=hvfkjvkfjv')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(400)
    })
    test('Invalid token - STATUS 401', async () => {
        const res = await request(app)
                        .get('/stamps?owner=' + userOneId)
                        .set('Authorization', `Bearer ${'ssfjsnfjk'}`)
                        .send()
                        .expect(401)
    })
    test('Valid token, but query parametres has not provide STATUS 404', async () => {
        const res = await request(app)
                        .get('/stamps?')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(404)
    })
})

describe('GET /stamps/:id - user GET stamps by stamps id', () => {
    beforeEach(setupDataBaseTestStamp)
    test('Valid token, valid stamps id - STATUS 200', async ()=>{
        const res = await request(app)
                        .get('/stamps/' + stampOneId)
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(200)
                        
    })

    test('Valid token, valid but wrong stamp id - STATUS 404', async ()=>{
        const res = await request(app)
                        .get('/stamps/5cf9085a43c5e15898ef8489')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(404)
    })

    test('Valid token, invalid stamp id - STATUS 404', async ()=>{
        const res = await request(app)
                        .get('/stamps/5a43c5e15898ef8489')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(400)
    })

    test('Invalid token - STATUS 401', async ()=>{
        const res = await request(app)
                        .get('/stamps/5a43c5e15898ef8489')
                        //.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(401)
    })
})

describe('DELETE /stamps/:id', () => {
    beforeEach(setupDataBaseTestStamp)
    test('User provide valid token, user is owner of stamp, stamp exist. User successfully delete stamp STATUS 200', async () => {
        const res = await request(app)
                        .delete('/stamps/' + stampOneId)
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(200)
    })

    test('User provide invalid token, but provide valide stamp id. STATUS 401 ', async () => {
        const res = await request(app)
                        .delete('/stamps/' + stampOneId)
                        .set('Authorization', `Bearer ${'bjfbndkfjnb'}`)
                        .send()
                        .expect(401)
    })

    test('User provide valid token and valid id, but he is not owner of stamp or stamp does not exist STATUS 404', async () => {
        const res = await request(app)
                        .delete('/stamps/' + stampOneId)
                        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
                        .send()
                        .expect(404)
    })
    
    test('User provide valid token, but invalid id (stamp has owned by other user ) STATUS 404', async () => {
        const res = await request(app)
                        .delete('/stamps/' + stampThreeId)
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(404)
    })

    test('User provide valid token, but invalid id ( invalid/broken ID ) STATUS 400', async () => {
        const res = await request(app)
                        .delete('/stamps/jfbskjbs' )
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(400)
    })
})

describe('PATCH /stamps/:id', () => {
    beforeEach(setupDataBaseTestStamp)
    const validUpdates = {
        name : "stamp 2", 
        price : 2, 
        designer : 'Jenny', 
        linkToImgUrl : 'https://www.rbc.ru/img2.jpg'

    }
    const notAllowedUpdates = {
        name1 : "stamp 2", 
        price2 : 2, 
        password : 'Jenny', 
        linkToImgUrl : 'https://www.rbc.ru/img2.jpg'
    }

    const invalidUpdates = {
        name : "sta", 
        price : "vsfv"
    }

    test('User provide valid (id(stamps exist), updates, token) and he is owner. STATUS 200', async () => {
        const res = await request(app)
                        .patch('/stamps/' + stampOneId)
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send(validUpdates)
                        .expect(200)
    })

    test('User provide invalid token. All other data is valid. STATUS 401', async () => {
        const res = await request(app)
                        .patch('/stamps/' + stampOneId)
                        .set('Authorization', `Bearer ${'bdbdbd'}`)
                        .send(validUpdates)
                        .expect(401)
    })
    test('User provide valid (token, id, updates) but he is not owner. STATUS 404', async () => {
        const res = await request(app)
                        .patch('/stamps/' + stampThreeId)
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send(validUpdates)
                        .expect(404)    
    })
    test('User provide valid token, id, he is owner, but updates are invalid fields are not allowed to update. STATUS 400', async () => {
        const res = await request(app)
                        .patch('/stamps/' + stampOneId)
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send(notAllowedUpdates)
                        .expect(400)
    })
    test('User provide valid token, id, he is owner, valid updates(fields), but value of updates not valid. STATUS 400', async () => {
        const res = await request(app)
                        .patch('/stamps/' + stampOneId)
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send(invalidUpdates)
                        .expect(400)
    })
    test('User provide valid token, id , he is owner, but req.body(broken) is invalid. STATUS 400', async () => {
        const res = await request(app)
                        .patch('/stamps/' + stampOneId)
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send('{"invalid"}')
                        .type('json')
                        .expect(400)
    })  
})



