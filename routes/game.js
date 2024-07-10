const express = require("express");
const router = express.Router();

router.get("/play", function (req, res, next) {
  // TODO: Implement Game
  try {
    console.log("user: ", req.session);

    // Checking if user is logged in
    if (req.session.user !== undefined) {
      res.render("play", {
        user: req.session.user,
        isAdmin: req.cookies.isAdmin,
      });
    } else {
      // If user is not logged in, throw an error
      throw new Error("User not logged in");
    }
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).render("error", {
      message: err.message,
      error: err,
    });
  }
});

module.exports = router;
