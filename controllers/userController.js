const bcrypt = require("bcrypt");
const sqlDAL = require("../data/sqlDAL");

const Result = require("../models/result").Result;
const STATUS_CODES = require("../models/statusCodes").STATUS_CODES;

/**
 *
 * @returns an array of user models
 */
exports.getUsers = async function () {
  let results = await sqlDAL.getAllUsers();
  // console.log('getUsers');
  // console.log(results);
  return results;
};

/**
 *
 * @param {*} username
 * @param {*} email
 * @param {*} password
 * @returns a Result with status/message and the new user id as data
 */
exports.createUser = async function (username, email, password) {
  let hashedPassword = await bcrypt.hash(password, 10);

  let result = await sqlDAL.createUser(username, hashedPassword, email);

  return result;
};

/**
 *
 * @param {*} userId
 * @param {*} currentPassword
 * @param {*} newPassword
 * @param {*} confirmNewPassword
 * @returns The result of the update with status/message
 */
exports.updateUserPassword = async function (
  userId,
  currentPassword,
  newPassword,
  confirmNewPassword
) {
  // If new passwords don't match
  if (newPassword != confirmNewPassword) {
    return { status: "Failure", message: "Entered passwords do not match" };
  }

  let hashedNewPassword = await bcrypt.hash(newPassword, 10);

  let user = await sqlDAL.getUserById(userId);
  // console.log(user);

  // If we couldn't find the user
  if (!user) {
    return new Result(STATUS_CODES.failure, (message = "User not found."));
  }

  // Make sure the actual password matches the one the user gave us
  let passwordsMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordsMatch) {
    return new Result(STATUS_CODES.failure, "Current password is invalid");
  }

  return await sqlDAL.updateUserPassword(userId, hashedNewPassword);
};

/**
 *
 * @param {*} username
 * @param {*} password
 * @returns The result of the login attempt
 */
exports.login = async function (username, password) {
  // Get User by Username
  let user = await sqlDAL.getUserByUsername(username);

  if (!user) {
    return new Result(STATUS_CODES.failure, "Invalid Login.");
  }

  // Check if user is already logged in
  if (user.is_logged_in) {
    return new Result(
      STATUS_CODES.failure,
      "User is already logged in from another session."
    );
  }

  // Verify the password
  let passwordsMatch = await bcrypt.compare(password, user.password);

  if (passwordsMatch) {
    // Set the user as logged in
    await sqlDAL.updateUserLoginStatus(user.userId, true);

    return new Result(STATUS_CODES.success, "Valid Login.", user);
  } else {
    return new Result(STATUS_CODES.failure, "Invalid Login.");
  }
};

exports.updateUserLoginStatus = async function (userId, isLoggedIn) {
  return sqlDAL.updateUserLoginStatus(userId, isLoggedIn);
};

/**
 *
 * @param {*} userId
 * @returns the matching user model or null
 */
exports.getUserById = function (userId) {
  return sqlDAL.getUserById(userId);
};

/**
 *
 * @param {*} userId
 * @returns deletes the user matching the userId
 */
exports.deleteUserById = function (userId) {
  return sqlDAL.deleteUserById(userId);
};

exports.disableUser = async function (userId) {
  let result = await sqlDAL.updateUserRole(userId, 3); // 3 is the roleId for "disabled"

  if (result) {
    return new Result(STATUS_CODES.success, "User disabled successfully.");
  } else {
    return new Result(STATUS_CODES.failure, "Failed to disable user.");
  }
};

exports.enableUser = async function (userId) {
  let result = await sqlDAL.updateUserRole(userId, 1); // 1 is the roleId for "user"

  if (result) {
    return new Result(STATUS_CODES.success, "User enabled successfully.");
  } else {
    return new Result(STATUS_CODES.failure, "Failed to enable user.");
  }
};

exports.promoteUser = async function (userId) {
  let result = await sqlDAL.updateUserRole(userId, 2); // 2 is the roleId for "admin"

  if (result) {
    return new Result(
      STATUS_CODES.success,
      "User promoted to admin successfully."
    );
  } else {
    return new Result(STATUS_CODES.failure, "Failed to promote user.");
  }
};

exports.demoteUser = async function (userId) {
  let result = await sqlDAL.updateUserRole(userId, 1); // 1 is the roleId for "user"

  if (result) {
    return new Result(
      STATUS_CODES.success,
      "Admin demoted to user successfully."
    );
  } else {
    return new Result(STATUS_CODES.failure, "Failed to demote admin.");
  }
};

// exports.drop = function () {
//   return sqlDAL.drop();
// };
