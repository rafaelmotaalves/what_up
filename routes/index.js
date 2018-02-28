var express  = require("express"),
	router   = express.Router(),
	passport = require("passport"),
	notLoggedIn = require("../functions/notLoggedIn.js"),
	isLoggedIn  = require("../functions/isLoggedIn.js"),
	multer   = require('multer'),
	User     = require("../models/users");

require('dotenv').config();

router.get("/", function(req, res){
	res.redirect("posts");
});	

// setting multer (get files)

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter});

// setting cloudnary

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dw2nxlm3b', 
  api_key: process.env.API_KEY, 
  api_secret:process.env.API_SECRET
});

//auth routes

router.get("/register", notLoggedIn,function(req, res){
	res.render("auth/register");
});

router.post("/register", notLoggedIn ,upload.single('image'), function(req, res) {
	cloudinary.uploader.upload(req.file.path, function(result) {
  		var newUser = new User({username: req.body.username, img:result.secure_url});
	    User.register(newUser, req.body.password, function(err, user){
	        if(err){
	            console.log(err);
	            req.flash("error" , err.message);
	            return res.redirect('register');
	        }
	        passport.authenticate("local")(req, res, function(){
	        	req.flash("Helo, " + req.body.username + "! You successfully signed up to WHAT_UP!");
	           res.redirect("/posts");
	        });
	    });
	 });
});

router.get("/login",notLoggedIn,function(req, res){
	res.render("auth/login");
});

router.post("/login", notLoggedIn ,passport.authenticate('local',{
	successRedirect:"/posts",
	failureRedirect: "/login"
}));

router.get("/logout", isLoggedIn,function(req, res){
	req.logout();
	res.redirect("/");

});

module.exports = router;