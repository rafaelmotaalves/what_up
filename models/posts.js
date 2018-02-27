var mongoose = require('mongoose');


var postSchema = mongoose.Schema({
	text: String,
	author:{
         id: {
         	type: mongoose.Schema.Types.ObjectId,
         	ref: "User"
         },
         userName: String,
         userImage: String
    },
    upvotes: [ {type: mongoose.Schema.Types.ObjectId, ref:"User"}],
    downvotes: [ {type: mongoose.Schema.Types.ObjectId, ref:"User"}],
	createdAt: {type: Date, default: Date.now},
    comments: [ {type: mongoose.Schema.Types.ObjectId, ref:"Comment"} ]
});



module.exports = mongoose.model("Post", postSchema);