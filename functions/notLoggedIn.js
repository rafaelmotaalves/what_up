
// (middleware) checks if a user is logged in before executing requests 
function notLoggedIn(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	req.flash("You are already logged in");
	res.redirect("/");
}

module.exports = notLoggedIn;