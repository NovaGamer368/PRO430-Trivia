const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Time 4 Trivia",
    user: req.session.user,
    isAdmin: req.session.user ? req.session.user.isAdmin : false,
  });
});

router.get("/leaderboard", async function (req, res, next) {
  try {
    // TODO: Get actual leader data from the database!
    let leaders = await gameController.getAllLeaderboardEntries();
    leaders.sort((a, b) => b.Score - a.Score);

    await res.render("leaderboard", {
      title: "Time 4 Trivia",
      user: req.session.user,
      isAdmin: req.session.user ? req.session.user.isAdmin : false,
      leaders: leaders,
    });
  } catch (err) {
    // Handle errors
    console.error(err);
    await res.render("leaderboard", {
      title: "Time 4 Trivia",
      error: err,
    });
  }
});

module.exports = router;
