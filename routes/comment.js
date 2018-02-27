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






module.exports = router;

