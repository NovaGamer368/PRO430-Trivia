const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const STATUS_CODES = require("../models/statusCodes").STATUS_CODES;

router.get("/register", function (req, res, next) {
  res.render("register", { title: "Time 4 Trivia", error: "" });
});

router.post("/register", async function (req, res, next) {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  let result = await userController.createUser(username, email, password);

  if (result?.status == STATUS_CODES.success) {
    res.redirect("/u/login");
  } else {
    res.render("register", {
      title: "Time 4 Trivia",
      error: "Register Failed",
    });
  }
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Time 4 Trivia", error: "" });
});

router.post("/login", async function (req, res, next) {
  try {
    let username = req.body.username;
    let password = req.body.password;

    let result = await userController.login(username, password);

    let isAdmin = result.data?.roles.includes("admin");

    if (result?.status == STATUS_CODES.success) {
      req.session.user = {
        userId: result.data.userId,
        username: result.data.username,
        isAdmin: isAdmin,
      };
      res.redirect("/");
    } else {
      res.render("login", {
        title: "Time 4 Trivia",
        error: result.message || "Invalid Login. Please try again.",
      });
    }
  } catch (err) {
    console.error(err);
    res.render("login", {
      title: "Time 4 Trivia",
      error: "An error occurred. Please try again.",
    });
  }
});

router.get("/logout", async function (req, res, next) {
  try {
    if (req.session.user) {
      await userController.updateUserLoginStatus(
        req.session.user.userId,
        false
      );
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).send("Could not log out.");
        } else {
          res.redirect("/u/login");
        }
      });
    } else {
      res.redirect("/u/login");
    }
  } catch (err) {
    console.error(err);
    res.redirect("/u/login");
  }
});

router.get("/profile", function (req, res, next) {
  try {
    if (req.session.user !== undefined) {
      res.render("profile", {
        title: "Time 4 Trivia",
        user: req.session.user,
        isAdmin: req.session.user.isAdmin,
        error: "",
      });
    } else {
      throw new Error("User not logged in");
    }
  } catch (err) {
    // Handle errors
    console.error(err);
    res.render("index", {
      title: "Time 4 Trivia",
      error: err.message,
    });
    // res.status(500).render("error", {
    //   message: err.message,
    //   error: err,
    // });
  }
});

router.post("/profile", async function (req, res, next) {
  let current = req.body.currentPassword;
  let newPassword = req.body.newPassword;
  let confirmationPassword = req.body.confirmPassword;

  if (newPassword != confirmationPassword) {
    res.render("profile", {
      title: "Time 4 Trivia",
      user: req.session.user,
      isAdmin: req.session.user.isAdmin,
      error: "Password do not match",
    });
  } else {
    // console.log(`Changing passwor for userId ${req.session.user?.userId}`);
    let result = await userController.updateUserPassword(
      req.session.user.userId,
      current,
      newPassword,
      confirmationPassword
    );

    if (result.status == STATUS_CODES.success) {
      res.redirect("/u/login");
    } else {
      res.render("profile", {
        title: "Time 4 Trivia",
        user: req.session.user,
        isAdmin: req.session.user.isAdmin,
        error: "Password update failed",
      });
    }
  }
});

module.exports = router;
