var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	localStratergy = require("passport-local"),
	flash = require("connect-flash"),
	User = require("./models/user"),
	Campsite = require("./models/campsite"),
	Comment = require("./models/comment"),
	methodOverride = require("method-override");
	
//requiring routes
var commentRoutes = require("./routes/comments"),
	campsiteRoutes = require("./routes/campsites"),
	indexRoutes = require("./routes/index");

//initialise app.set/use/etc.
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
mongoose.connect(process.env.DATABASEURL, {
		useNewUrlParser:true,
		useUnifiedTopology:true,
		useFindAndModify: false,
		useCreateIndex: true
});

app.locals.moment = require("moment");

// passport configration
app.use(require("express-session")({
	secret:"Some Random String",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.use("/campsites",campsiteRoutes);
app.use("/campsites/:id/comment", commentRoutes);
app.use(indexRoutes);


//=====================
//Server listener
app.listen(process.env.PORT, process.env.IP);
// app.listen(3000,function(){
// 	console.log("server online");
// })