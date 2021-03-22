const createError = require('http-errors');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const logger = require('morgan');
const express = require('express');
const port = 80;
var app = express();

//passport config:
require('./config/passport')(passport)
//mongoose
mongoose.connect('mongodb://localhost:27017/CrimeWave', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('connected,,'))
  .catch((err) => console.log(err));

//EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//BodyParser
app.use(express.urlencoded({
  extended: false
}));
//express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Routes
app.use('/', require('./routes/web'));
app.use('/users', require('./routes/users'));
app.use('/report', require('./routes/report'));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;