var express = require('express');
var router = express.Router();
const Report = require("../models/report");
const {ensureAuthenticated} = require("../config/auth.js");
const passport = require('../config/passport');

/**
 * Route for Report Page
 * @author Maclan
 */
router.get('/', ensureAuthenticated,function (req, res, next) {
	res.render('report',{
		user: req.user
	});
});


/**
 * Route for Posting a Report
 * @author Maclan
 */
router.post('/',(req,res)=>{
    const {
        type,
        postcode,
        where,
        description
    } = req.body;
    let errors = [];

    const newReport = new Report({
        user: req.user.id,
        type: type,
        postcode: postcode,
        where: where,
        description: description
    });

    newReport.save().then((value) => {
        console.log(value)
        req.flash('success_msg', 'You have reported a crime');
        res.redirect('/report');
    })
    .catch(value => console.log(value));
    
});

module.exports = router;