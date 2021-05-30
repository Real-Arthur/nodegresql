const express = require('express');
const app = express();
// const bodyParser = require('body-parser');
const expressSession = require('express-session')({
  secret: 'carrar',
  resave: false,
  saveUninitialized: false
})
const passport = require('passport');
// Route import
const titleRouter = require('./routes/title.router');
const homeRouter = require('./routes/home.router');
const userRouter = require('./routes/user.router');

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded());
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


/// Routes ///
app.use('/', homeRouter);
app.use('/api/title', titleRouter);
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`NodegresQL app is running on port ${PORT}.`);
});

module.exports = app;