// sqlDAL is responsible to for all interactions with mysql for Membership
require("dotenv").config();
const User = require("../models/user").User;
const Result = require("../models/result").Result;
const STATUS_CODES = require("../models/statusCodes").STATUS_CODES;

const mysql = require("mysql2/promise");
const sqlConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: `${process.env.MYSQL_PASSWORD}`,
  database: process.env.MYSQL_DATABASE,
};
/////////////////////Start of the Users CRUD
/**
 * @returns and array of user models
 */
exports.getAllUsers = async function () {
  users = [];

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `
      SELECT u.*
      FROM Users u
      JOIN UserRoles ur ON u.userId = ur.userId
      JOIN Roles r ON ur.roleId = r.roleId
      WHERE u.userId != 4 -- Replace ? with the logged-in user's ID;`;

    const [userResults] = await con.query(sql);

    // console.log('getAllUsers: user results');
    // console.log(userResults);

    for (key in userResults) {
      let u = userResults[key];

      let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
      // console.log(sql);
      const [roleResults] = await con.query(sql);

      // console.log('getAllUsers: role results');
      // console.log(roleResults);

      let roles = [];
      for (key in roleResults) {
        let role = roleResults[key];
        roles.push(role.Role);
      }
      users.push(new User(u.UserId, u.Username, u.Email, u.Password, roles));
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.end();
  }

  return users;
};

/**
 * @returns and array of user models
 */
exports.getUsersByRole = async function (role) {
  users = [];

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `select * from Users u join UserRoles ur on u.userid = ur.userId join Roles r on ur.roleId = r.roleId where r.role = '${role}'`;

    const [userResults] = await con.query(sql);

    // console.log('getAllUsers: user results');
    // console.log(userResults);

    for (key in userResults) {
      let u = userResults[key];

      let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
      console.log(sql);
      const [roleResults] = await con.query(sql);

      // console.log('getAllUsers: role results');
      // console.log(roleResults);

      let roles = [];
      for (key in roleResults) {
        let role = roleResults[key];
        roles.push(role.Role);
      }
      users.push(new User(u.UserId, u.Username, u.Email, u.Password, roles));
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.end();
  }

  return users;
};

/**
 * @param {*} userId the userId of the user to find
 * @returns a User model or null if not found
 */
exports.getUserById = async function (userId) {
  let user = null;

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `select * from Users where UserId = ${userId}`;

    const [userResults] = await con.query(sql);

    for (key in userResults) {
      let u = userResults[key];

      let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
      console.log(sql);
      const [roleResults] = await con.query(sql);

      let roles = [];
      for (key in roleResults) {
        let role = roleResults[key];
        roles.push(role.Role);
      }
      user = new User(u.UserId, u.Username, u.Email, u.Password, roles);
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.end();
  }

  return user;
};

/**
 *
 * @param {*} userId
 * @param {*} hashedPassword
 * @returns a result object with status/message
 */
exports.deleteUserById = async function (userId) {
  let result = new Result();

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `delete from UserRoles where UserId = ${userId}`;
    let result = await con.query(sql);
    // console.log(result);

    sql = `delete from Users where UserId = ${userId}`;
    result = await con.query(sql);
    // console.log(result);

    result.status = STATUS_CODES.success;
    result.message = `User ${userId} delted!`;
  } catch (err) {
    console.log(err);
    result.status = STATUS_CODES.failure;
    result.message = err.message;
  } finally {
    con.end();
  }

  return result;
};

/**
 * @param {*} username the username of the user to find
 * @returns a User model or null if not found
 */
exports.getUserByUsername = async function (username) {
  let user = null;

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `select * from Users where Username = '${username}'`;
    console.log(sql);

    const [userResults] = await con.query(sql);

    for (key in userResults) {
      let u = userResults[key];

      let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
      console.log(sql);
      const [roleResults] = await con.query(sql);

      let roles = [];
      for (key in roleResults) {
        let role = roleResults[key];
        roles.push(role.Role);
      }
      user = new User(u.UserId, u.Username, u.Email, u.Password, roles);
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.end();
  }

  return user;
};

/**
 * @param {*} userId the userId of the user to find roles for
 * @returns an array of role names
 */
exports.getRolesByUserId = async function (userId) {
  results = [];

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where UserId = ${userId}`;

    const [results] = await con.query(sql);

    for (key in results) {
      let role = results[key];
      results.push(role.Role);
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.end();
  }

  return results;
};

/**
 * @param {*} username
 * @param {*} hashedPassword
 * @param {*} email
 * @returns a result object with status/message
 */
exports.createUser = async function (username, hashedPassword, email) {
  let result = new Result();

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `insert into Users (Username, Email, Password) values ('${username}', '${email}', '${hashedPassword}')`;
    const userResult = await con.query(sql);

    let newUserId = userResult[0].insertId;

    sql = `insert into UserRoles (UserId, RoleId) values (${newUserId}, 1)`;
    await con.query(sql);

    result.status = STATUS_CODES.success;
    result.message = "Account Created with User Id: " + newUserId;
    result.data = newUserId;
    return result;
  } catch (err) {
    console.log(err);

    result.status = STATUS_CODES.failure;
    result.message = err.message;
    return result;
  } finally {
    con.end();
  }
};

/**
 *
 * @param {*} userId
 * @param {*} hashedPassword
 * @returns a result object with status/message
 */
exports.updateUserPassword = async function (userId, hashedPassword) {
  let result = new Result();

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `update Users set password = '${hashedPassword}' where userId = '${userId}'`;
    const userResult = await con.query(sql);

    // console.log(r);
    result.status = STATUS_CODES.success;
    result.message = "Account updated";
    return result;
  } catch (err) {
    console.log(err);

    result.status = STATUS_CODES.failure;
    result.message = err.message;
    return result;
  }
};

exports.updateUserRole = async function (userId, newRoleId) {
  let result = new Result();

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `UPDATE UserRoles SET roleId = ${newRoleId} WHERE userId = ${userId}`;
    const userResult = await con.query(sql);

    result.status = STATUS_CODES.success;
    result.message = "User Role Updated";
    return result;
  } catch (err) {
    console.log(err);
    result.status = STATUS_CODES.failure;
    result.message = err.message;
    return result;
  }
};

/////////////////////////////End of the Users CRUD
/////////////////////////////Start of the Trivia Questions CRUD
/**
 * @returns and array of user models
 */
exports.getAllTriviaQuestions = async function () {
  questions = [];

  //Connection
  const con = await mysql.createConnection(sqlConfig);
  try {
    let sql = `select * from TriviaQuestions WHERE isSuggested = 0;`;

    const [questionResults] = await con.query(sql);
    for (key in questionResults) {
      let q = questionResults[key];
      let sql = `select * from TriviaQuestions where TriviaId = ${q.TriviaId}`;
      const [singleQuestion] = await con.query(sql);
      // console.log(singleQuestion);
      questions.push(singleQuestion[0]);
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.end();
  }

  return questions;
};
exports.createTriviaQuestion = async function (
  Question,
  WrongAnswer1,
  WrongAnswer2,
  WrongAnswer3,
  CorrectAnswer,
  points
) {
  let result = new Result();

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `insert into TriviaQuestions (Question, WrongAnswer1, WrongAnswer2, WrongAnswer3, CorrectAnswer,points, isSuggested) values ('${Question}', '${WrongAnswer1}','${WrongAnswer2}','${WrongAnswer3}','${CorrectAnswer}',${points},true)`;
    const questionResults = await con.query(sql);

    let newQuestion = questionResults[0].TriviaId;

    result.status = STATUS_CODES.success;
    result.message = "Question Suggested with Trivia Id: " + newQuestion;
    result.data = newQuestion;
    return result;
  } catch (err) {
    console.log(err);

    result.status = STATUS_CODES.failure;
    result.message = err.message;
    return result;
  } finally {
    con.end();
  }
};

exports.createLeaderboardEntry = async function (username, score) {
  let result = new Result();

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `insert into Leaderboard (Username, Score, DateCompleted) values ('${username}', '${score}', '${new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")}')`;
    const entryResult = await con.query(sql);

    let newEntry = entryResult[0].EntryId;

    result.status = STATUS_CODES.success;
    result.message = "Account Created with User Id: " + newEntry;
    result.data = newEntry;
    return result;
  } catch (err) {
    console.log(err);

    result.status = STATUS_CODES.failure;
    result.message = err.message;
    return result;
  } finally {
    con.end();
  }
};
exports.updateLeaderboardEntry = async function (id, score) {
  let result = new Result();

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `UPDATE Leaderboard 
    SET Score = ${score}, 
        DateCompleted = '${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}' 
    WHERE EntryId = '${id}'`;

    const entryResult = await con.query(sql);

    result.message = "Leaderboard Updated";
    return result;
  } catch (err) {
    console.log(err);

    result.status = STATUS_CODES.failure;
    result.message = err.message;
    return result;
  } finally {
    con.end();
  }
};

exports.getAllLeaderEntries = async function () {
  entry = [];
  //Connection
  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `select * from Leaderboard;`;

    const [entryResults] = await con.query(sql);
    for (key in entryResults) {
      let e = entryResults[key];
      let sql = `select * from Leaderboard where EntryId = ${e.EntryId}`;
      const [singleEntry] = await con.query(sql);
      // console.log(singleEntry);
      entry.push(singleEntry[0]);
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.end();
  }

  return entry;
};

/**
 *
 * @returns a result object with status/message
 */
// exports.drop = async function () {
//   let result = new Result();

//   const con = await mysql.createConnection(sqlConfig);

//   try {
//     let sql = `drop database Time4Trivia`;
//     let result = await con.query(sql);
//     console.log("drop results:", result);

//     result.status = STATUS_CODES.success;
//     result.message = `Database dropped!`;
//   } catch (err) {
//     console.log(err);
//     result.status = STATUS_CODES.failure;
//     result.message = err.message;
//   } finally {
//     con.end();
//   }

//   return result;
// };
