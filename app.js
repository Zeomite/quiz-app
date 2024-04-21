const express = require('express');
const bodyParser = require('body-parser');
const quizData = require('./quizData.json');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.get('/', (req, res) => {
  res.render('quiz', { quizData });
});

app.post('/submit', (req, res, next) => {
  try {
    const answers = req.body.answer;
    let scores = 0;
    const feedbacks = [];

    for (const answer of answers) {
      const question = quizData.find(q => q.questionNo === answer.questionNo);
      if (question) {
        if (answer.selectedAnswer === question.correctAnswer) {
          scores++;
          feedbacks.push({ question: question.question, result: 'correct' });
        } else {
          feedbacks.push({ question: question.question, result: 'incorrect', correctAnswer: question.correctAnswer });
        }
      }
    }

    const result = JSON.stringify({ score: scores, feedback: feedbacks });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
