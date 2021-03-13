const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');

/* These Currently do nothing */
router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register')
})
/* These Currently do nothing */

// User Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/home',
        failureFlash: true
    })(req, res, next)
})
// Register post handle
router.post('/register', (req, res) => {
    const {
        name,
        email,
        password,
        password2
    } = req.body;
    let errors = [];
    console.log(' Name ' + name + ' email :' + email + ' pass:' + password);
    if (!name || !email || !password || !password2) {
        errors.push({
            msg: "Please fill in all fields"
        })
    }
    // Check if passwords match
    if (password !== password2) {
        errors.push({
            msg: "passwords dont match"
        });
    }

    // Check if passwords is more than 6 characters
    if (password.length < 6) {
        errors.push({
            msg: 'password atleast 6 characters'
        })
    }
    if (errors.length > 0) {
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            password: password,
            password2: password2
        })
    } else {
        // validation passed
        User.findOne({
            email: email
        }).exec((err, user) => {
            console.log(user);
            if (user) {
                errors.push({
                    msg: 'email already registered'
                });
                res.render('home', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password
                });

                // Hash password
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt,
                        (err, hash) => {
                            if (err) throw err;
                            //save pass to hash
                            newUser.password = hash; // Users password is set as hashed password
                            //save user
                            newUser.save() // Saves User to Database
                                .then((value) => {
                                    console.log(value)
                                    req.flash('success_msg', 'You have now registered!');
                                    res.redirect('/home');
                                })
                                .catch(value => console.log(value));

                        }));
            }
        })
    }
})
//logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Now logged out');
    res.redirect('/home');
})
module.exports = router;