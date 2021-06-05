const express = require('express');
const app = express();
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();
const expressSession = require('express-session')({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
})

// Route import
const titleRouter = require('./routes/title.router');
const homeRouter = require('./routes/home.router');
const userRouter = require('./routes/user.router');
// Middleware
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded());
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());
/// Routes ///
app.use('/', homeRouter);
app.use('/api/title', titleRouter);
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`NodegresQL app is running on port ${PORT}.`);
});

module.exports = app;