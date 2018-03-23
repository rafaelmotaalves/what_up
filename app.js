var express               = require('express'),
	app                   = express(),
	mongoose              = require('mongoose'),
	methodOverride        = require("method-override"),
	Post                  = require("./models/posts"),
	passport              = require("passport"),
    User                  = require("./models/users"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    flash                 = require("connect-flash"),
	bodyParser            = require('body-parser');

// requiring routes

var indexRoutes = require("./routes/index.js");
var postsRoutes = require("./routes/posts.js");
var usersRoutes = require("./routes/user.js");
var commentsRoutes = require("./routes/comment.js");

// setting body-parser

app.use(bodyParser.urlencoded({extended: true}));

// setting enviroment variables

require('dotenv').config();

// connecting to data base

mongoose.connect("mongodb://localhost/what_up");

// setting vies engine to ejs

app.set("view engine", "ejs");

// setting method override

app.use(methodOverride("_method"));

// setting the /public dir

app.use(express.static(__dirname + "/public"));

// setting moment to be used in all pages

app.locals.moment = require('moment');

// setting flash

app.use(flash());

// passport configuration

app.use(require("express-session")({
	secret: process.env.PASSPORT_SECRET,
	resave: false,
	saveUninitialized: false,
    passReqToCallback: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// setting currentUser/error/success to all ejs pages

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// setting routes

app.use("/", indexRoutes);
app.use("/posts", postsRoutes);
app.use("/users", usersRoutes);
app.use("/", commentsRoutes);

app.listen(process.env.PORT , function(){
	console.log("app running...");
});