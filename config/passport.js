var LocalStrategy   = require('passport-local').Strategy;

var ID = require('./../models/ID');

module.exports = function(passport){
	passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        ID.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
    	usernameField: 'email',
    	passwordField: 'password',
    	passReqToCallback: true
    }, 
    function(req, email, password, done){
    	process.nextTick(function() {
    		ID.findOne({'local.email': email}, function(err, user){
    			if(err)
    				return done(err);

    			if(user) {
    				return done(null, false, req.flash('signupMessage', 'That email already exists'));

    			} else {
    				var newId = new ID();
    				newId.local.email = email;
    				newId.local.password = newId.generateHash(password);

    				newId.save(function(err){
    					if(err)
    						return done(err);
    					return done(null, newId);
    				});
    			}
    		});
    	});
    }
    ));


    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        ID.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));
}