'use strict'

// Fake test so file can be included

test('Hello World: hello should greet the world', () => {
  let hello = 'world'
expect(hello).toEqual('world')
})

// Integration tests for the routing

/* You can get the status code alone using curl with:
curl -Li http://localhost:3000 -o /dev/null -w '%{http_code}\n' -s
*/

/* 
Integration testing for the routing would test each of the status codes 
for every possible defined route, and that a 404 is returned for all undefined routes
All data querie should return 202 (query recieved) or 201 (resurce created) for DB table creation requests
However, I could not configure the tests to work correctly, despite hours of attempts and several different 
techniques. Here I have left the main methods that I tried, and failed to get working.
*/

// var express = require('express')
// const app = express()
// var router = express.Router()

// const app = require('../index')
// const router = require('../app/routes/mainRoutes')
// const request = require('supertest')

// describe('test the root path', () => {
//   test('response should be status 200 (OK)', () => {
//     return request(router)
//     .get('/')
//     .expect(200)
//   })
// })

// describe('test the root path', () => {
//     test('response should be status 200 (OK)', () => {
//         return request(router)
//         .get("/").then(response => {
//             expect(response.statusCode).toBe(200)
//         })
//     })
// })

// An attempt with Jasmine for front end resolving on a running local instance or online:
// describe('test the root path', function() {
//   it('should route "/" to index', function() {
//     var controller = require('../app/routes/mainRoutes');
//     var orig_this = this;
//     var orig_load = require('module')._load;
//     var router = jasmine.createSpyObj('Router', ['get']);
//     var express = jasmine.createSpyObj('express', ['Router']);
//     express.Router.and.returnValues(router);
//     spyOn(require('module'), '_load').and.callFake(function() {
//       if (arguments[0] == 'express') {
//         return express;
//       } else {
//         return orig_load.apply(orig_this, arguments);
//       }
//     });
//     require('../app/routes/mainRoutes');
//     expect(router.get).toHaveBeenCalledWith('/', mainRouter);
//   });
// });

// Trying to setup a local instance (or online to the test or main server) to check responses...

// describe('loading express', function () {
//   let app, mainRouter
//   const request = require('supertest')
//   beforeEach(function () {
//     mainRouter = require('../app/routes/mainRoutes')
//     app = require('../index').listen(3000)
//   })
//   afterEach(function () {
//     app.close();
//   })
//   it('responds to /', function testSlash(done) {
//   request(mainRouter)
//     .get('/')
//     .expect(200, done);
//   })
//   it('404 everything else', function testPath(done) {
//     request(mainRouter)
//       .get('/foo/bar')
//       .expect(404, done);
//   })
// })