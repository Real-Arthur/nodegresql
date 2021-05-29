const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 5000;
// Route import
const titleRouter = require('./routes/title.router');
const home = require('./routes/home.router');

app.use(express.json());

/// Routes ///
app.use('/', home);
app.use('/api/title', titleRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`NodegresQL app is running on port ${PORT}.`);
});

module.exports = app;