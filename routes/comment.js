var express    = require('express'),
	router     = express.Router(),
	Comment    = require('../models/comments.js'),
	Post       = require('../models/posts.js'),
	isLoggedIn = require("../functions/isLoggedIn.js"),
	mongoose   = require('mongoose');


router.post("/posts/:id", isLoggedIn,function(req, res){
	req.body.comment.author = {
		id : req.user._id,
		username :  req.user.username
	};

	if(req.body.comment.text === ""){ 
		req.flash("error","You need to write something in your comment");
		res.redirect("/posts/" + req.params.id);
		return;
	}


	Comment.create(req.body.comment, function(err, comment){
		if(err){
			console.log(err);
		}else{
			Post.findById(req.params.id, function(err, post){
				if(err){
					console.log(err);
				}else{
					post.comments.unshift(comment._id);
					post.save();
				}
			});
		}
	});
	res.redirect("back");

});

router.delete("/posts/:id/:comment_id", function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id , function(err){
		if(err){
			console.log(err);
		}else{
			Post.findById(req.params.id, function(err, foundPost){
				if(err){
					console.log(err);
				}else{
					foundPost.comments.splice(foundPost.comments.indexOf(req.params.comment_id), 1);
					foundPost.save();
					res.redirect("/posts/" + req.params.id);
				}
				
			});


		}
	});
});

router.get("/posts/:id/:comment_id/edit", function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err);
		}else{
			Post.findById(req.params.id, function(err, foundPost){
				if(err){
					console.log(err);
				}else{
					res.render("comments/edit", {comment:foundComment, post:foundPost});
				}
				
			})
		}
	});	
});	


router.put("/posts/:id/:comment_id", function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment ,function(err, comment){
		if(err){
			console.log(err);
		}else{
			res.redirect("/posts/" + req.params.id);
		}
	});
});

module.exports = router;

