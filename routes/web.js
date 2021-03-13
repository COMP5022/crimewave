var express = require('express');
var router = express.Router();
const Report = require("../models/report");
const {ensureAuthenticated} = require("../config/auth.js")
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

/**
 * Route for Landing Page
 * @author Maclan
 */
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Express',
		user: req.user
	});
});

/**
 * Route for home Page
 * @author Maclan
 */
router.get('/home', function (req, res, next) {
	res.render('home', {
		title: 'Express',
		user: req.user
	});
});

/**
 * Route for Reported Page
 * @author Maclan
 */
router.get('/reported', ensureAuthenticated, function (req, res, next) {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("CrimeWave");
		dbo.collection("reports").findOne({ user: req.user.id}, function(err, result) {
		  if (err) throw err;
		  console.log(result.user);
		  console.log(result);
		  db.close();
		  res.render('reported',{
			user: req.user,
			data: result
		});
		});
	  });
	
});


/**
 * Route for About Page
 * @author Maclan
 */
router.get('/about', function (req, res, next) {
	res.render('about',{
		user: req.user
	});
});

/**
 * Route for Contact Page
 * @author Maclan
 */
router.get('/contact', function (req, res, next) {
	res.render('contact',{
		user: req.user
	});
});

module.exports = router;