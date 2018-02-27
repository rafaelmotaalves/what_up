var mongoose              = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
	username : String,
	password: String,
	img: String,
	totalScore: { type: Number , default: 0 }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);