const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
   suite("POST to /api/check", function() {
    test("All fields filled", function(done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", coordinate: "A1", value: "7" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          done();
        })
    })
    test("Single placement conflict", function(done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", coordinate: "A1", value: "6" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.equal(res.body.valid, false);
          assert.property(res.body, "conflict");
          assert.equal(res.body.conflict.length, 1);
          assert.equal(res.body.conflict[0], "column");
          done();
        })
    })
    test("All placement conflict", function(done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", coordinate: "E5", value: "9" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.equal(res.body.valid, false);
          assert.property(res.body, "conflict");
          assert.equal(res.body.conflict.length, 2);
          assert.equal(res.body.conflict[0], "row");
          
          assert.equal(res.body.conflict[1], "region");
          done();
        })
    })
    test("All placement conflict", function(done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", coordinate: "E5", value: "6" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.equal(res.body.valid, false);
          assert.property(res.body, "conflict");
          assert.equal(res.body.conflict.length, 3);
          assert.equal(res.body.conflict[0], "row");
          assert.equal(res.body.conflict[1], "column");
          assert.equal(res.body.conflict[2], "region");
          done();
        })
    })
    test("Missing Required Fields", function(done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", value: "6" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Required field(s) missing");
          
          done();
        })
    })

    test("Invalid character in puzzle", function(done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: "..9..5.1.85.4....2N32......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",coordinate: "E5", value: "6" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          
          done();
        })
    })
    test("Invalid puzzle length", function(done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.....",coordinate: "E5", value: "6" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
          
          done();
        })
    })
    test("Invalid placement coordinates", function(done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", coordinate: "U10", value: "6" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid coordinate");
          
          done();
        })
    })
    test("Invalid placement value", function(done) {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", coordinate: "E5", value: "o" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid value");
          
          done();
        })
    })

  })
  suite("POST to /api/solve", function() {
    test("Solve a valid puzzle", function(done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          let solution = '827549163531672894649831527496157382218396475753284916962415738185763249374928651';
          assert.property(res.body, "solution");
          assert.equal(res.body.solution, solution);
          
          done();
        })
    })
    test("Solve a puzzle with missing puzzle string", function(done) {
      chai
        .request(server)
        .post("/api/solve")
        .send()
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Required field missing");
          
          done();
        })
    });
    test("Solve a puzzle with invalid characters", function(done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({puzzle: "..839.7.575.....964..1.......16.2W846.9.3p2.7..754.....62..5.78.8...3.2...492...1"})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          
          done();
        })
    })

    test("Solve a puzzle with incorrect length", function(done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({puzzle: "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...4"})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
          
          done();
        })
    })
    test("Solve a puzzle that cannot be solved", function(done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....923914.67."})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Puzzle cannot be solved");
          
          done();
        })
    })
  })
});
after(function() { chai.request(server) .get('/') }); 
