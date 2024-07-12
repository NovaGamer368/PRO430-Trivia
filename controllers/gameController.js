const bcrypt = require("bcrypt");
const sqlDAL = require("../data/sqlDAL");

const Result = require("../models/result").Result;
const STATUS_CODES = require("../models/statusCodes").STATUS_CODES;

exports.getTriviaQuestions = async function () {
  let results = await sqlDAL.getAllTriviaQuestions();
  //   console.log("Controller questions: ", results);
  return results;
};
