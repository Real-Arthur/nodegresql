const express = require('express');
const pool = require('../pool');
const router = express.Router();
const axios = require('axios')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const EventEmitter = require('events');
dotenv.config();
const saltRounds = 10;
const emitter = new EventEmitter();

emitter.on('userRegistered', (username, password, host) => {
    console.log('a user has been registered with id username password: ', username, password, host);
    let url = 'http://' + host + '/api/users/login';
    console.log('url', url);
    axios.post(url, {
      username: username,
      password: password
    })
    .then(res => {
      console.log('Logged in', res.data.token);
    })
    .catch(err => {
      console.log('err', err.code);
    })
  })

router.get('/', (req, res) => {
  res.sendStatus(200);
});

router.post('/register', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  // salt password
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if(err) throw err;
  // hash password
    bcrypt.hash(password, salt, (err, hash) => {
      if(err) throw err;
      const queryText = `
        INSERT INTO "user" (username, password)
        VALUES ($1, $2) RETURNING id`;
      pool
        .query(queryText, [username, hash])
        .then((result) => {
          let host = req.headers.host.split(' ');
          emitter.emit('userRegistered', username, password, host[0])
          res.sendStatus(201)
        })
        .catch(() => res.sendStatus(500));
    })
  })
});

router.post('/login', (req, res) => {
  let username = req.body.username;
  let passwordInput = req.body.password;

  pool.query('SELECT * FROM "user" WHERE "username" = $1', [username])
  .then((result) => {
    let passwordDB = result.rows[0].password;
    bcrypt.compare(passwordInput, passwordDB, (err, result) => {
      if(result) {
        const accessToken = jwt.sign({username: req.body.username}, process.env.TOKEN_SECRET)
        res.json( {token: accessToken} )
      }
      else {
        console.log('Password did not match database');
        res.sendStatus(400);
      }
    })
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
  })
});


module.exports = router;
