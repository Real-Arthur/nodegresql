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
const homeRouter = require('./routes/home.router');
const titlesRouter = require('./routes/titles.router');
const usersRouter = require('./routes/users.router');
// Middleware
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded());
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());
/// Routes ///
app.use((req, res, next) => {
  console.log('host', req.hostname);
  console.log('path', req.path);
  console.log('method', req.method);
  next()
})
app.use('/', homeRouter);
app.use('/api/titles', titlesRouter);
app.use('/api/users', usersRouter);
//
app.use((req , res, done) => {
  console.log('page not found')
  res.status(404)
  done()
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`NodegresQL app is running on port ${PORT}.`);
});

module.exports = app;