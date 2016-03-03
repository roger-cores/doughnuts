var express = require('express');
var router = express.Router();


module.exports.registerRoutes = function(passport) {
	router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    router.post('/signup', function(req, res, next){
    	passport.authenticate('local-signup', function(err, user, info){
    		if(err) {next(); return;}
    		if(!user){next(); return;};
    		req.logIn(user, function(err){
    			if(err) {next(); return;}
    			res.json(user);
    		});
    	})(req, res, next);
    }, function(req, res, next){
    	res.status(500).send({errmsg: 'Internal Server Error'});
    });

    router.post('/login', function(req, res, next){
    	passport.authenticate('local-login', function(err, user, info){
    		if(err) {next(); return;}
    		if(!user) {next(); return;};
    		res.json({code: 1, id: user._id});
    	})(req, res, next);
    }, function(req,  res, next){
    	res.status(500).send({errmsg: 'Authentication Failed'});
    });



	return router;
}

module.exports.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated())
		return next();
	res.redirect('/');
}
