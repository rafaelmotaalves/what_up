var express               = require("express"),
	router                = express.Router(),
	User                  = require("../models/users.js"),
	comparePostsRelevance = require("../functions/comparePostsRelevance.js"),
	isLoggedIn            = require("../functions/isLoggedIn.js"),
	Comment               = require("../models/comments.js"),
	Post                  = require("../models/posts.js");


router.get("/", function(req, res){
	Post.find({} , function(err, posts) {
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			posts.sort(comparePostsRelevance);	
			res.render("posts/posts", {posts:posts});
		}
		
	});
});

router.post("/", isLoggedIn ,function(req, res){

	req.body.post.author = {
		userName: req.user.username,
		id: req.user._id,
		userImage: req.user.img
	};

	Post.create(req.body.post, function(err, post){
		if(err){
			res.redirect("back");
			console.log(err);
		}else{
			res.redirect("/posts");
		}	
	});
});

router.get("/:id", function(req, res){
	Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
		if(err){
			console.log(err);
		}else{
			res.render("posts/show", {post: foundPost});
		}
	});
});	

router.put("/:id/vote/:in",isLoggedIn, function(req, res){
	// find the post that was voted in
	Post.findById(req.params.id , function(err, post){
		if(err){
			console.log(err);
		}else{
			// find the post author
			User.findById(post.author.id , function(err, user){
				if(err){
					console.log(err);
				}else{
					console.log(user);
					// checking if is a upvote or a downvote
					if(req.params.in == "up"){
						// checking if the current logged in user already upvoted in this post
						if(post.upvotes.indexOf(req.user._id) === -1){
							upvote("add",post, user, req, res);
							// checking if the current logged in user already downvoted in this post
							if(post.downvotes.indexOf(req.user._id) !== -1)
								downvote("delete",post, user, req, res);
						}else{
							upvote("delete",post, user, req, res);
						}
					}else if(req.params.in == "down"){
						// checkinh if the current logged in user already downvoted this post
						if(post.downvotes.indexOf(req.user._id) === -1){
							downvote("add",post, user, req, res);
							// checking if the current logged in user already upvoted this post
							if(post.upvotes.indexOf(req.user._id) !== -1)
								upvote("delete",post, user, req, res);
						}else{
							downvote("delete",post, user, req, res);
						}
					}
					post.save();
					user.save();
				}

			});
			res.redirect("back");
		}
	});
});

function upvote(op, post, user, req, res){
	if(op === "add"){
		// adding user id to the upvotes array and increasing the author total score
		post.upvotes.push(req.user._id);
		user.totalScore = user.totalScore + 1;
	}else if(op === "delete"){
		// finding and removing the user of the upvotes array and decreasing the author total score
		var index = post.upvotes.indexOf(req.user._id);
		post.upvotes.splice(index, index+1);
		user.totalScore = user.totalScore - 1;
	}
}

function downvote(op, post, user, req, res){
	if(op === "add"){
		post.downvotes.push(req.user._id);
		user.totalScore = user.totalScore - 1;
	}else if(op === "delete"){
		var index = post.downvotes.indexOf(req.user._id);
		post.downvotes.splice(index, index+1);
		user.totalScore = user.totalScore + 1;
	}
}

module.exports = router;