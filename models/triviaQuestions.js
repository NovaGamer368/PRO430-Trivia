class TriviaQuestions {
  constructor(
    triviaId,
    question,
    wrongAnswer1,
    wrongAnswer2,
    wrongAnswer3,
    correctAnswer,
    points
  ) {
    this.triviaId = triviaId;
    this.question = question;
    this.wrongAnswer1 = wrongAnswer1;
    this.wrongAnswer2 = wrongAnswer2;
    this.wrongAnswer3 = wrongAnswer3;
    this.correctAnswer = correctAnswer;
    this.points = points;
  }
}

exports.TriviaQuestions = TriviaQuestions;
