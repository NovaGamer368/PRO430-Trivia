const bcrypt = require("bcrypt");
const sqlDAL = require("../data/sqlDAL");

const Result = require("../models/result").Result;
const STATUS_CODES = require("../models/statusCodes").STATUS_CODES;

exports.getTriviaQuestions = async function () {
  let results = await sqlDAL.getAllTriviaQuestions();
  //   console.log("Controller questions: ", results);
  return results;
};
exports.createTriviaQuestion = async function (
  Question,
  WrongAnswer1,
  WrongAnswer2,
  WrongAnswer3,
  CorrectAnswer,
  points
) {
  //If there is no user in the current leaderboard with the logged in user than create a new player
  let results = await sqlDAL.createTriviaQuestion(
    Question,
    WrongAnswer1,
    WrongAnswer2,
    WrongAnswer3,
    CorrectAnswer,
    points
  );
  console.log("CreateTriviaQuestion : ", results);
};
exports.createLeaderboardEntry = async function (username, score) {
  //If there is no user in the current leaderboard with the logged in user than create a new player
  let results = await sqlDAL.createLeaderboardEntry(username, score);
  // console.log("CreateLeaderboardEntry : ", results);
};
exports.updateLeaderboardEntry = async function (username, score) {
  let results = await sqlDAL.updateLeaderboardEntry(username, score);
  console.log("UpdateLeaderboardEntry : ", results);
};
exports.getAllLeaderboardEntries = async function () {
  //Get all the leaderboard Entries
  let results = await sqlDAL.getAllLeaderEntries();
  // console.log("controller results: ", results);
  return results;
};
