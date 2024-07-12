const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");

router.get("/play", async function (req, res, next) {
  // TODO: Implement Game
  try {
    console.log("user: ", req.session);
    let questions = await gameController.getTriviaQuestions();
    console.log("Router Questions:", await questions);

    // Checking if user is logged in
    if (req.session.user !== undefined) {
      res.render("play", {
        user: req.session.user,
        isAdmin: req.cookies.isAdmin,
        questions: questions,
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
router.post("/play", async function (req, res, next) {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
