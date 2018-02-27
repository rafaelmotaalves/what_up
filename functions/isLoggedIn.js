
// (middleware) checks if a user is logged in before executing requests 
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
	res.send("You need to be logged in to do that");
}

module.exports = isLoggedIn;