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
  const userAnswers = req.body;
  let score = 0;
  console.log(userAnswers);

  questions.forEach((question, index) => {
    const userAnswer = userAnswers[`Question${index + 1}`];
    console.log("question", question.ShuffledAnswers[userAnswer].isCorrect);
    if (userAnswer != undefined) {
      if (question.ShuffledAnswers[userAnswer].isCorrect) {
        score += question.Points;
      }
    }
  });

  res.send(`Your score is: ${score}`);
});

module.exports = router;
