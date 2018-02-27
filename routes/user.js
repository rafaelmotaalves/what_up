var express               = require("express"),
	router                = express.Router(),
	Post                  = require("../models/posts"),
	comparePostsRelevance = require("../functions/comparePostsRelevance.js"),
	User                  = require("../models/users");



router.get("/", function(req, res){
	User.find({} , function(err, foundUsers){
		if(err){
			console.log(err);
		}else{
			foundUsers.sort(function(a,b){
				if(a.totalScore > b.totalScore)
					return -1;
				if(a.totalScore < b.totalScore)
					return 1;
				return 0
			});
			res.render("users/users", {users : foundUsers});
		}
	});
});

router.get("/:user", function(req, res){
	User.findById(req.params.user, function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			Post.find({"author.id" : req.params.user}, function(err, foundPosts) {
				if(err){
					console.log(err);
				}else{
					foundPosts.sort(comparePostsRelevance);
					res.render("users/show", {user: foundUser , posts : foundPosts});
					
				}	
			});
		}
	});
});


module.exports = router;