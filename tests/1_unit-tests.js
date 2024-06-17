const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver();

suite('UnitTests', () => {
   console.log("test1");
   suite("Function sudokuSolver.validate(puzzleString)", function() {
     test("Valid String", function(done){
        let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.equal(solver.validate(puzzleString), "ok");
        
        done();
     });
    test("Invalid characters in string", function(done){
        
        let puzzleString = '1.5..2.84..6A.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let valid = solver.validate(puzzleString);
        assert.property(valid, "error");
        assert.equal(valid.error, "Invalid characters in puzzle");
        
        done();
     });
    test("Invalid string length", function(done){
        
        let puzzleString = '1.5..2.84..63.12.7..2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37...';
        let valid = solver.validate(puzzleString);
        assert.property(valid, "error");
        assert.equal(valid.error, "Expected puzzle to be 81 characters long");
        
        done();
     });
   });

   suite("Function sudokuSolver.checkRowPlacement(puzzleString, row, column, value)", function(){
       test("Invalid row placement", function(done){
        
        let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let valid = solver.checkRowPlacement(puzzleString, "A", "1", "5");
        
        assert.equal(valid, false);
        
        done();
     });
     test("Valid row placement", function(done){
        
        let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let valid = solver.checkRowPlacement(puzzleString, "A", "2", "3");
        
        assert.equal(valid, true);
        
        done();
     });
   });

   suite("Function sudokuSolver.checkColPlacement(puzzleString, row, column, value)", function(){
       test("Invalid column placement", function(done){
        
        let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let valid = solver.checkColPlacement(puzzleString, "A", "1", "6");
        
        assert.equal(valid, false);
        
        done();
     });
     test("Valid column placement", function(done){
        
        let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let valid = solver.checkColPlacement(puzzleString, "G", "7", "6");
        
        assert.equal(valid, true);
        
        done();
     });
   });
   suite("Function sudokuSolver.checkRegionPlacement(puzzleString, row, column, value)", function(){
      test("Invalid region placement", function(done){
        
        let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let valid = solver.checkRegionPlacement(puzzleString, "D", "4", "6");
        
        assert.equal(valid, false);
        
        done();
     });
     test("Valid region placement", function(done){
        
        let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let valid = solver.checkRegionPlacement(puzzleString, "F", "2", "1");
        
        assert.equal(valid, true);
        
        done();
     });
   });
  suite("Function sudokuSolver.solve(puzzleString)", function(){
      test("A valid string passes the solver", function(done){
        let puzzleString ='.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6';
        let solution = '473891265851726394926345817568913472342687951197254638734162589685479123219538746';
        let sol = solver.solve(puzzleString);
        assert.hasOwnProperty(sol, "solution");
        assert.equal(sol.solution, solution);
        done();
       })

       test("An invalid string fails the solver", function(done){
        let puzzleString ='57.892.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.';
        
        let sol = solver.solve(puzzleString);
        assert.hasOwnProperty(sol, "error");
        assert.equal(sol.error, "Puzzle cannot be solved");
        done();
       });
       test("The solver returns a solution for an incomplete puzzle", function(done){
        let puzzleString ='123..............................................................................';
        let solution = "123456789456789123789123456214365897365897214897214365531642978642978531978531642"
        let sol = solver.solve(puzzleString);
        assert.hasOwnProperty(sol, "solution");
        assert.equal(sol.solution, solution);
        done();
       })
   });
});
