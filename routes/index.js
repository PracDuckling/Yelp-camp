var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

//root route
router.get("/", function (req, res) {
    //res.render("/views/campsite/index");
    res.render("../views/landing");
});


//register routes
router.get("/register", function (req, res) {
    res.render("register", {page: "register"});
});
router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error",err.message);
            return res.redirect("back");
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success","welcome " + user.username + " to YelpCamp");
                res.redirect("/campsites");
            });
        }
    });
});

//login Routes

router.get("/login", function (req, res) {
    res.render("login", {page: "login"});
});
//flash message in unsuccessful login
router.post("/login", function (req, res) {
    passport.authenticate("local", {
        successRedirect: "/campsites",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Welcome to YelpCamp, " + req.body.username
    })(req,res);
});
//logout

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success","Logout Successful");
    res.redirect("/campsites");
});

module.exports = router;