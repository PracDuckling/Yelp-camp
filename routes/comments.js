var express = require("express");
var router = express.Router({mergeParams:true});
var Campsite = require("../models/campsite");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//comments new
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Campsite.findById(req.params.id, function (err, data) {
        if (err || !data) {
            req.flash("error", "Campsite not found");
            res.redirect("/campsites");
        } else {
            res.render("comments/new", { // ./comments/new
                camps: data
            });
        }
    });
});
//comment post
router.post("/", middleware.isLoggedIn, function (req, res) {
    Campsite.findById(req.params.id, function (err, camp) {
        if (err) {
            
            res.redirect("back");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    
                    res.redirect("back");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save(); 
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect("/campsites/" + req.params.id);
                }
            });
        }
    });
});
//editing a comment
router.get("/:comment_id/edit", middleware.isOwnerComment, function (req, res) {
  Campsite.findById(req.params.id, function(err,foundCamp){
    if(err || !foundCamp){             
        req.flash("error", "Campsite not found");
        res.redirect("/campsites");
    }else{
        Comment.findById(req.params.comment_id,function(err,comment){
            if(err){
               
                res.redirect("back");
            }else{
                res.render("comments/edit", {camp: foundCamp, comment:comment});
            }
        });
    }
  });
});
//update comment PUT req(/:comment_id)
router.put("/:comment_id", middleware.isOwnerComment, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err){
        if(err){
            
            res.redirect("back");
        }else{
            res.redirect("/campsites/"+req.params.id);
        }
    });
});
//comment delete route("/:comment_id")
router.delete("/:comment_id", middleware.isOwnerComment, function (req, res) {
    Comment.findByIdAndDelete(req.params.comment_id,function(err){
        if(err){
            
            res.redirect("back");
        }else{
            req.flash("success","Comment Deleted");
            res.redirect("/campsites/" + req.params.id);
        }
    });
});


module.exports = router;