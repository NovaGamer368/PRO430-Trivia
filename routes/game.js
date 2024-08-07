const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
router.get("/play", async function (req, res, next) {
  try {
    let questions = await gameController.getTriviaQuestions();

    //Shuffles the questions
    questions.forEach((question) => {
      const answers = [
        { text: question.CorrectAnswer, isCorrect: true },
        { text: question.WrongAnswer1, isCorrect: false },
        { text: question.WrongAnswer2, isCorrect: false },
        { text: question.WrongAnswer3, isCorrect: false },
      ];

      //Creates the new answers as another object in each question
      question.ShuffledAnswers = shuffle(answers);
    });

    // Checking if user is logged in
    if (req.session.user !== undefined) {
      res.render("play", {
        user: req.session.user,
        isAdmin: req.session.user.isAdmin,
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
  try {
    const userAnswers = req.body;
    let score = 0;
    let answered = 0;
    let userFound = false;

    questions.forEach((question, index) => {
      const userAnswer = userAnswers[`Question${index + 1}`];
      if (userAnswer != undefined) {
        if (question.ShuffledAnswers[userAnswer].isCorrect) {
          score += question.Points;
        }
        answered += question.Points;
      }
    });

    const leaderboardEntries = await gameController.getAllLeaderboardEntries();
    console.log("Leaderboard entries: ", leaderboardEntries);
    leaderboardEntries.forEach(async (entry) => {
      if (entry.Username === req.session.user.username) {
        // console.log("USER FOUND: ", entry);
        userFound = true;
        if (score >= entry.Score) {
          // console.log("NEW HIGH SCORE!!!");
          await gameController.updateLeaderboardEntry(entry.EntryId, score);
        }
      }
    });

    //Do the SQL statement to store the new score on the leaderboard
    if (!userFound) {
      await gameController.createLeaderboardEntry(
        req.session.user.username,
        score
      );
    }
    res.render("result", {
      user: req.session.user,
      isAdmin: req.session.user.isAdmin,
      resultString: `Your score is ${score} / ${answered}!`,
    });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).render("error", {
      message: err.message,
      error: err,
    });
  }
});

router.get("/newQuestion", async function (req, res, next) {
  try {
    // Checking if user is logged in
    if (req.session.user !== undefined) {
      res.render("newQuestion", {
        user: req.session.user,
        isAdmin: req.session.user.isAdmin,
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
router.post("/newQuestion", async function (req, res, next) {
  try {
    const userAnswers = req.body;

    await gameController.createTriviaQuestion(
      userAnswers.question,
      userAnswers.wrongAnswer1,
      userAnswers.wrongAnswer2,
      userAnswers.wrongAnswer3,
      userAnswers.correctAnswer,
      100
    );

    res.render("newQuestionResponse", {
      user: req.session.user,
      isAdmin: req.session.user.isAdmin,
    });
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
