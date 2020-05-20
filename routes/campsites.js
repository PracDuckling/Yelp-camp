var express = require("express");
var router = express.Router();
var Campsite = require("../models/campsite");
var Comment = require("../models/comment");
var middleware = require("../middleware");



//index route
router.get("/", function (req, res) {

    Campsite.find({}, function (err, allCamps) {
        if (err) {
            console.warn(err);
        } else {
            res.render("campsite/index", {
            camps: allCamps,
            page: "campsites"
            });
        }
    });
});

//new route
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campsite/new");
});

//create route
router.post("/", middleware.isLoggedIn, function (req, res) {

    var newcampsite = {
        name: req.body.newCampsite,
        price: req.body.price,
        image: req.body.imagesrc,
        description: req.body.description,
        author: {
            id: req.user._id,
            username:req.user.username
        }
    };
    //if empty then do not allow
    if(newcampsite.name ==="" || newcampsite.image==="" || newcampsite.description===""){
        req.flash("error", "please fill all the fields");
        return res.redirect("back");
    }
    //duplicate name check, to be added in v3
        Campsite.create(newcampsite, function (err, camp) {
            if (err) {
                
                console.log(err);
                res.redirect("back");
            } else {
                res.redirect("/campsites");
            }
        });
    
});


//show route
router.get("/:id", function (req, res) {
    Campsite.findById(req.params.id).populate("comments").exec(function (err, selectedCampsite) {
        if (err || !selectedCampsite) {
            req.flash("error", "Campsite not found");
            res.redirect("/campsites");
        } else {
            res.render("campsite/show", {
                camp: selectedCampsite
            });
        }
    });

});
//edit route
router.get("/:id/edit", middleware.isOwnerCampsite, function (req, res) {
    Campsite.findById(req.params.id, function(err,camp){
        
        res.render("campsite/edit", {camp: camp});
       
    });
   
});
//update route
router.put("/:id", middleware.isOwnerCampsite, function (req, res) {
    Campsite.findByIdAndUpdate(req.params.id, req.body.camp, function(err,updatedCamp){
        if (err){
            console.log(err);
            res.redirect("back");
        }else{
            res.redirect("/campsites/"+req.params.id);
        }
    });
});
//destroy campsite
router.delete("/:id", middleware.isOwnerCampsite, function (req, res) {
    Campsite.findByIdAndDelete(req.params.id, function(err,foundCamp){
        if (err){
            
            console.log(err);
            res.redirect("back");
        }else{
            var comments = foundCamp.comments;
            comments.forEach(function(comment){
                Comment.findByIdAndDelete(comment._id,function(err,data){
                    if(err){
                        
                        console.log(err);
                        res.redirect("back");
                    }else;
                    
                });
            });
            res.redirect("/campsites");
        }
    });
});

module.exports = router;

