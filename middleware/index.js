var Campsite = require("../models/campsite");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

middlewareObj.isOwnerCampsite = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campsite.findById(req.params.id, function (err, foundCampsite) {
            if (err || !foundCampsite) {
                req.flash("error","campsite not found"); 
                res.redirect("/campsites");
            } else {
                // does user own the campground?
                if (foundCampsite.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                    // res.redirect("/campsites/" + req.params.id);
                }
            }
        });
    } else {
        req.flash("error", "You need to be Logged in to do that");
        res.redirect("/login");
    }
};

middlewareObj.isOwnerComment = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
                req.flash("error", "Comment not found");
                res.redirect("/campsites");
            } else {
                // does user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error","you don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;