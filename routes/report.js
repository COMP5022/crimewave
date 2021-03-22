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
    let {
        type,
        postcode,
        where,
        public_check,
        description
    } = req.body;
    let errors = [];
    if(public_check == "on"){
        public_check = true;
    }else{
        public_check = false;
    }
    const newReport = new Report({
        user: req.user.id,
        username: req.user.name,
        type: type,
        postcode: postcode,
        where: where,
        public: public_check,
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