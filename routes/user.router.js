const express = require('express');
const pool = require('../pool');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../authenticatToken');
const dotenv = require('dotenv');
const saltRounds = 10;
dotenv.config();

// Handles Ajax request for user information if user is authenticated
router.get('/', (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.sendStatus(200);
});

router.post('/register', async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if(err) {
      return 'error in salting'
    }
  // hash password
    bcrypt.hash(password, salt, (err, hash) => {
      if(err) {
      return 'error in hashing'
      }
      const queryText = `
        INSERT INTO "user" (username, password)
        VALUES ($1, $2) RETURNING id`;
      pool
        .query(queryText, [username, hash])
        .then(() => res.sendStatus(201))
        .catch(() => res.sendStatus(500));
    })
  })
});

  router.post('/login', (req, res) => {
    let username = req.body.username;
    let passwordInput = req.body.password;
    pool.query('SELECT * FROM "user" WHERE "username" = $1', [username])
    .then((result) => {
      let passwordDB = result.rows[0].password
      bcrypt.compare(passwordInput, passwordDB, (err, result) => {
        if(result) {
          const accessToken = jwt.sign({username: req.body.username}, process.env.TOKEN_SECRET)
          res.json({token: accessToken})
        }
        else {
          console.log('no good');
          res.sendStatus(400);
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    })
});

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if(token === null) return res.sendStatus(401)

//   jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
//     if(err) return res.sendStatus(403)
//     req.user = user 
//     next()
//   })
// }

module.exports = router;
