const express = require('express');
const pool = require('../pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', (req, res) => {
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

/**
 * POST route template
 */
router.post('/', (req, res) => {
  // POST route code here
});

module.exports = router;