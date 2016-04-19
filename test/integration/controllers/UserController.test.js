var assert = require('chai').assert;
var request = require('supertest');
var bluebird = require('bluebird');
bluebird.promisifyAll(request);
var req = require('request');


var userIDs = []

describe('UserController', function() {

	before('post dummy users to database', function(done) {
		requestPromises = []
		for (var i = 0; i <= 1; i++) {
			requestPromises.push(req.post({url: 'http://localhost:1337/user'}))
		}

		bluebird.all(requestPromises)
		.then(function(responses) {
			console.log(responses[1]);
			done();
		})
		.catch(function(err) {
			console.log(err);
		});
	})

	describe('#create()', function() {
		it('should return a new user', function(done) {
			request(sails.hooks.http.app)
				.post("/user")
				.send()
				.expect(function(res) {
					assert.equal(typeof res.body.userID, 'string', "response has field userID")
					assert.equal(res.body.userID.length, 10, "userID is of correct length");
					userID = res.body.userID;
				})
				.end(done);
		});
		it("should save the user's username and password");

  	});

  	/*describe('#addChild', function() {
  		it('should return a child', function(done) {
  			request(sails.hooks.http.app)
				.post("/user/" + userID + "/add")
				.send({
					childID: "lol"
				})
				.expect(function(res) {

				})
  		});
  	})*/
});