var express = require('express');
var router = express.Router();
var Report = require("../models/report");
var User = require("../models/user");
var {ensureAuthenticated} = require("../config/auth.js");
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
		dbo.collection("reports").find({ user: req.user.id}, function(err, result) {
		  if (err) throw err;
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

/**
 * Route for Contact Page
 * @author Maclan
 */
 router.get('/news-feed',ensureAuthenticated, function (req, res, next) {
	res.render('newsFeed',{
		user: req.user
	});
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

/**
 * Route for all public crime for news feed
 * @author Maclan
 */
router.post('/get-public-crime', ensureAuthenticated, function (req, res, next){
	const {
        postcode
    } = req.body;
	console.log(postcode);
	const regex = new RegExp(escapeRegex(postcode), 'gi');
	Report.find({public: true, postcode: regex}).sort('-date').exec((err, result) => {
		if (err) {
			res.send(err);
		} else {
			res.send(result);
		}
	});
});
module.exports = router;