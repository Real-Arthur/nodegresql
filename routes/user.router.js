const express = require('express');
const pool = require('../pool');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Handles Ajax request for user information if user is authenticated
router.get('/', (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  // salt password
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

  router.post('/login', (req, res) => {
    let username = req.body.username;
    let passwordInput = req.body.password;
    pool.query('SELECT * FROM "user" WHERE "username" = $1', [username])
    .then((result) => {
      let passwordDB = result.rows[0].password
      bcrypt.compare(passwordInput, passwordDB, (err, result) => {
        if(result) {
          console.log('horray');
          res.send(result.rows[0].username);
          res.sendStatus(200);
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

  })




});

module.exports = router;
