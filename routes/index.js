var express  = require("express"),
	router   = express.Router(),
	passport = require("passport"),
	notLoggedIn = require("../functions/notLoggedIn.js"),
	isLoggedIn  = require("../functions/isLoggedIn.js"),
	multer   = require('multer'),
	User     = require("../models/users");


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
  api_key: '386541313235145', 
  api_secret: 'rEckA3jW8UTfWgwTi7eCutGEx6k'
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
	            return res.render('register');
	        }
	        passport.authenticate("local")(req, res, function(){
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