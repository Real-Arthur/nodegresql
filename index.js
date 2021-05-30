const express = require('express');
const app = express();
// Route import
const titleRouter = require('./routes/title.router');
const homeRouter = require('./routes/home.router');

app.use(express.json());
app.use(express.urlencoded());

/// Routes ///
app.use('/', homeRouter);
app.use('/api/title', titleRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`NodegresQL app is running on port ${PORT}.`);
});

module.exports = app;