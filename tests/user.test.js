const request = require('supertest')
const app = require('../src/app')

// add models 
//const User = require('../src/')

test('Should get mesasge for "testuser with code 200" ', async () => {
    await request(app)
            .get('/testuser')
            .send()
            .expect(200)
})