const express = require('express');
const pool = require('../pool');
const router = express.Router();
const { authenticateToken } = require('../authenticatToken');

/** GET ALL TRACKS **/
router.get('/', authenticateToken, (req, res) => {
  // GET route code here
  let queryString = `
  SELECT "track" FROM "songs";
  `;
  pool.query(queryString)
  .then(results => {
    res.send(results.rows);
  })
  .catch(error => {
    res.send(error)
  })
});

/** GET TRACK INFO BY ID **/
router.get('/:id', authenticateToken, (req, res) => {
  let id = req.params.id;
  let queryString = `
  SELECT * FROM "songs"
  WHERE "id" = $1;
  `;
  pool.query(queryString, [id])
  .then(results => {
    res.send(results.rows);
  })
  .catch(error => {
    res.send(error)
  })
})

/**
 * POST route template
 */
router.post('/', (req, res) => {
  // POST route code here
});

module.exports = router;