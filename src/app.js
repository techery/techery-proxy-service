let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');

let all = require('./routes/all');
// let services = require('./routes/services');
// let stubs = require('./routes/stubs');

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', all);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status( 500);
  res.json('Error: ' + err.message);
});

module.exports = app;
