"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    let digits = /^[1-9]$/;

    let letterDigit = /^[A-I][1-9]$/;

    if (
      !req.body.hasOwnProperty("puzzle") ||
      !req.body.hasOwnProperty("coordinate") ||
      !req.body.hasOwnProperty("value")
    ) {
      res.send({ error: "Required field(s) missing" });
      //console.log("here" + res.body);
    } else {
      //we got our fields
      let puzzleString = req.body.puzzle;
      let coordinates = req.body.coordinate;
      let row = coordinates[0];
      let column = coordinates[1];
      let value = req.body.value;
      if (
        puzzleString.length == 0 ||
        coordinates.length == 0 ||
        value.length == 0
      ) {
        //they are empty
        res.send({ error: "Required field(s) missing" });
      }
      if (
        puzzleString == undefined ||
        coordinates == undefined ||
        value == undefined
      ) {
        //they are empty
        res.send({ error: "Required field(s) missing" });
      } else if (letterDigit.test(coordinates)) {
        if (digits.test(value)) {
          //the value is fine
          let validation = solver.validate(puzzleString);
          if (validation == "ok") {
            //the string is fine
            let response = { valid: true, conflict: [] };
            let r, c, re;
            r = solver.checkRowPlacement(
              puzzleString,
              row.toUpperCase(),
              column,
              value
            );
            c = solver.checkColPlacement(
              puzzleString,
              row.toUpperCase(),
              column,
              value
            );
            re = solver.checkRegionPlacement(
              puzzleString,
              row.toUpperCase(),
              column,
              value
            );
            if (!r) {
              response.valid = false;
              response.conflict.push("row");
            }
            if (!c) {
              response.valid = false;
              response.conflict.push("column");
            }
            if (!re) {
              response.valid = false;
              response.conflict.push("region");
            }
            if (response.conflict.length == 0) {
              delete response.conflict;
            }
            res.send(response);
          } else res.send(validation);
        } else {
          //the value is not fine
          res.send({ error: "Invalid value" });
        }
      } else {
        res.send({ error: "Invalid coordinate" });
      }
    }
  });

  app.route("/api/solve").post((req, res) => {
    if (!req.body.hasOwnProperty("puzzle")) {
      //we don't have a puzzle
      res.send({ error: "Required field missing" });
    } else {
      let puzzleString = req.body.puzzle;
      let validation = solver.validate(puzzleString);
      if (validation == "ok") {
        res.send(solver.solve(puzzleString));
      } else res.send(validation);
    }
  });
};
