const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {
    userOne, userTwo, userThree, user, setupDatabase, 
    setupDatabaseLoginUser } = require('../tests/fixtures/db')





describe('Create new user POST /users', () =>{
    beforeEach(setupDatabase)
    test('Should create new user and return 201, token, and user objects', async () => {
        await request(app)
                .post('/users')
                .send(userOne)
                .expect(201)
    })
    
    test('Should return validation error status 400. With invalid fields vallue', async () => {
        const res = await request (app)
                    .post('/users')
                    .send(userThree)
                    .expect(400)
        expect(res.body.error).not.toBeNull()
    
    })
    
    test('Should return error when send empty object ', async () => {
        const res = await request (app)
                    .post('/users')
                    .send({})
                    .expect(400)
        expect(res.body.error).not.toBeNull()
    })
    
    test('Should return error if req.body object is invalid', async () => {
        const res = await request (app)
                    .post('/users')
                    .send('{"invalid"}')
                    .type('json')
                    .expect(400)
    
        expect(res.body).toMatchObject({
            error : "Invalid JSON Object"
        }) 
    })
})

// GET/users/ by country 

describe('GET /users by country',  ()=> {
    
    beforeEach(setupDatabaseLoginUser)

    test('User successfully got list of users by country with correct TOKEN in header STATUS 200', async () => {
        const res = await request(app)
                            .get('/users/?country=finland')
                            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                            .send()
                            .expect(200)
    })
    test('User has not provide valid country name got empty list of users STATUS 204' , async () => {
        const res = request(app)
                            .get('/users/?country=france')
                            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                            .send()
                            .expect(204)

    })

    test('User has not got list of user due invalid TOKEN in headers STATUS 401', async () => {
        const res = await request(app)
                            .get('/users/?country=finland')
                            .set('Authorization', `Bearer ${'sfnbjdgnbjdnbljd'}`)
                            .send()
                            .expect(401)
    })
})


// GET/users/profile 
describe('GET /users/profile - current', ()=> {
    beforeEach(setupDatabaseLoginUser)    
    test('user successfully get own profile with vaild token in header STATUS 200', async () => {

        const res = await request(app)
                            .get('/users/profile')
                            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                            .send()
                            .expect(200)
                            

    })
    test('User has not received profile due to invalid token in HEADER STATUS 401', async () => {
        const res = await request(app)
                            .get('/users/profile')
                            .set('Authorization', `Bearer ${'sbvjhsbkvsfj'}`)
                            .send()
                            .expect(401)
    })
})

// GET/users/:id NOT READY 
describe('GET /users/:id', ()=> {
    test.skip('Logged user successfully get profile of another user STATUS 200 and user object', async () => {

    })
    test.skip('User has not provide valid token in header STATUS 401', async() => {

    })
    test.skip('User provide valid token, but not proive valid user id STATUS 400', async () => {

    }
    )
})

// DELETE/users - delete profile users 

describe('DELETE /users/me - delete own profile', ()=> {
    beforeEach(setupDatabaseLoginUser)
    test('User provide valid token and successfully delete your account STATUS 200', async () => {
        res = await request(app)
                        .delete('/users/me')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(200)
        const deletedUsers = await User.findById({ _id : userOne._id})
        expect(deletedUsers).toBeNull()
    })

    test('User has not provide valid token STATUS 401', async () => {
        res = await request(app)
                        .delete('/users/me')
                        .set('Authorization', `Bearer ${'JKVNKJSNVJ'}`)
                        .send()
                        .expect(401)
        const deletedUsers = await User.findById({ _id : userOne._id})
        expect(deletedUsers).not.toBeNull()
    })
    test('User provide valid token, but has been deleted yet STATUS 401', async () => {
        res = await request(app)
                        .delete('/users/me')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(200)
        res = await request(app)
                        .delete('/users/me')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(401)
    })
})

// DELETE/users/:id

describe('DELETE /users/:id - current users', ()=> {
 
    // ??????
    
})

// PATCH/users - update current loged users fields 

describe('PATCH /users',  () => {
    beforeEach(setupDatabaseLoginUser)
    test('User provide valid token and valid updates and successfully update own profile STATUS 200', async () => {
        res = await request(app)
                        .patch('/users')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send({ 
                            username : "alex", 
                            email : "alex@gmail.com", 
                            country : "france"
                        })
                        .expect(200)
    })
    test('User has not provide valid token STATUS 401', async () => {
        res = await request(app)
                        .patch('/users')
                        .set('Authorization', `Bearer ${'sfjvnkjfskn'}`)
                        .send({ 
                            username : "alex", 
                            email : "alex@gmail.com", 
                            country : "france"
                        })
                        .expect(401)
    })
    test('User provide valid token , but has not provide valid updates STATUS 400', async () => {
        res = await request(app)
                        .patch('/users')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send({ 
                            username1 : "alex", 
                            email1 : "alex@gmail.com", 
                            country : "france"
                        })
                        .expect(400)
    })
    test('User provide valid token and updates but data in updates is not valid status 400', async () => {
        res = await request(app)
                        .patch('/users')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send({ 
                            username : "al", 
                            email : "alexgmail.com", 
                            country : 788
                        })
                        .expect(400)
    })
    test('User provide valid token but JSON body not valid status 400', async () => {
        res = await request(app)
                        .patch('/users')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send({ 
                            username : "alexaxnder", 
                            email : "alexgmail.com", 
                        })
                        .type("json")
                        .expect(400)
    })

})

// POST/users/login  - users login in 

describe('POST/users/login - user login',  () =>{

    // create userOne before test starts 
    beforeEach(setupDatabaseLoginUser)
    test('User should succesfully login in STATUS 200, should create valid token, user object', async () =>{
        const res = await request(app)
                            .post('/users/login')
                            .send({ 
                                email : userOne.email, 
                                password : userOne.password
                            })
                            .expect(200)       
        // check for valid token 
        
        const testUser = await User.findById(res.body.user._id) 
        expect(res.body.token).toBe(testUser.tokens[1].token)

    })
    test('Invalid pass or username STATUS 400', async ()=> {
        const res = await request(app)
                            .post('/users/login')
                            .send({ 
                                email : "sfjbnvjksnv", 
                                password : "fsjvbnjvns"
                            })
                            .expect(400)
    })
    test('Invalid JSON object STATUS 400', async () => {
        const res = await request(app)
                            .post('/users/login')
                            .send('{"invalid"}')
                            .type('json')
                            .expect(400)
        expect(res.body).toMatchObject({
                error : "Invalid JSON Object"
        }) 
    })
    test('Empty req.body object STATUS 400', async () => {
        const res  =  await request(app)
                            .post('/users/login')
                            .send()
                            .expect(400)
    })
})

// POST/users/logout - 
describe('POST/users/logout - user logout',  () => {

    test('User was successfully logout with valid token STATUS 200', async () =>{
        const res = await request(app)
                            .post('/users/logout')
                            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                            .send()
                            .expect(200)            
    })
    test('User was not successfully logout with invalid token STATUS 401', async () => {
        const res = request(app)
                            .post('/users/logout')
                            .set('Authorization', `Bearer ${'sflkbnfjbn'}`)
                            .send()
                            .expect(401)
    })

    test('Users not provide token STATUS 401', async ()=> {
        const res = request(app)
                            .post('/users/logout')
                            .send()
                            .expect(401)
    })

    test('Users provide bad HEADER TYPE 401', async () => {
        const res = request(app)
                            .post('/users/logout')
                            .send()
                            .set('Authorization', `Barer ${'sflkbnfjbn'}`)
                            .expect(401)
    })
})

// 

 