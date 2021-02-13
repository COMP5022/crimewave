var express = require('express');
var router = express.Router();

/**
 * Route for Index Page
 * @author Maclan
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * Route for Report Page
 * @author Maclan
 */
router.get('/report', function(req, res, next){
  res.render('report');
});

/**
 * Route for About Page
 * @author Maclan
 */
router.get('/about', function(req, res, next){
  res.render('about');
});

/**
 * Route for Contact Page
 * @author Maclan
 */
router.get('/contact', function(req, res, next){
  res.render('contact');
});

module.exports = router;
