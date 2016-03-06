var express = require('express');
var mv = require('mv');
var recipeRoute = require('./users/recipe');
var dataRoute = require('./users/data');
var categoryRoute = require('./users/category');
var login = require('connect-ensure-login');
var router = express.Router();
var crypto = require('crypto');


module.exports.registerRoutes = function(models, passport, multiparty, utils, oauth) {

		//change password DONE
		//upload image DONE
		//follow/unfollow DONE
		//get count following/followers DONE

    var preAuthenticate = function(req, res, next){
      if(req.session.access_token)
      var tokenHash = crypto.createHash('sha1').update(req.session.access_token).digest('hex');
      else next({message: 'Unauthorized'});
      models.Token.findOne({name: tokenHash}, function(err, token){
          if(err) next(err);
          else if(!token){next({message: 'Unauthorized'})}

          else if(token.expirationDate < Date.now()) next({message: 'Unauthorized'});
          else {

              req.body.access_token = req.session.access_token;

              models.ID.findOne({'local.email': token.userId}, function(err, user){
                  if(err) next(err);
                  else if(!user) next({message: 'Unauthorized'});
                  else {
                    req.body.user_id = user._id;
                    next();
                  }
              });
          };
      });
    }

    router.post('/validate-token', function(req, res, next){

        var tokenHash = crypto.createHash('sha1').update(req.body.access_token).digest('hex');

        models.Token.findOne({name: tokenHash}, function(err, token){
            if(err) next(err);
            else if(!token){next({message: 'Unauthorized'})}

            else if(token.expirationDate < Date.now()) next({message: 'Unauthorized'});
            else {
              req.session.access_token = req.body.access_token;
              res.status(200).send({code: 1})

            };
        });
    });

    router.post('/oauth/token', oauth.token);


    router.use('/recipe',
      preAuthenticate,
      passport.authenticate('accessToken', {session: false}),
      recipeRoute.registerRoutes(models, multiparty, utils)
    );

    router.use('/data',
      preAuthenticate,
      passport.authenticate('accessToken', {session: false}),
      dataRoute.registerRoutes(models)
    );

    router.use('/category',
      preAuthenticate,
      passport.authenticate('accessToken', {session: false}),
      categoryRoute.registerRoutes(models)
    );

    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    router.post('/signup', function(req, res, next){
    	passport.authenticate('local-signup', function(err, user, info){
    		if(err) {next(err); return;}
    		if(!user){next({code: 0, message: 'signup failed'}); return;};

    		req.logIn(user, function(err){
    			if(err) {next(err); return;}
    			res.json(user);
    		});
    	})(req, res, next);
    });

    router.post('/login', function(req, res, next){
    	passport.authenticate('local-login', function(err, user, info){
    		if(err) {next(err); return;}
    		if(!user) {next({code: 0, message: 'authentication failed'}); return;};

        req.logIn(user, function(err){
    			if(err) {next(err); return;}
    			res.json({code: 1, id: user._id});
    		});


    	})(req, res, next);
    });

    router.get('/info',login.ensureLoggedIn(), function(req, res, next){
        res.status(200).send({message: 'yo'});
    });


		router.put('/change-pass', function(req, res, next){
			passport.authenticate('local-login', function(err, user, info){
				if(err) {next(err); return;}
				if(!user) {next({code: 0, message: 'authentication failed'}); return;};
				if(req.body.newpassword)
				user.local.password = user.generateHash(req.body.newpassword);
				user.save(function(err){
					if(err) next(err);
					else res.status(201).send({code: 1, id: user._id});
				});
			})(req, res, next);
		});

		router.post('/img/:id', function(req, res, next){
				var form = new multiparty.Form();

				form.parse(req, function(err, fields, files){
					if(err){
						next(err);
						return;
					}

					console.log(fields);
					console.log(files);
					mv(files.avatar[0].path,'./public/images/' + req.params.id, function(err){
						if(err){
							next(err);
							return;
						}

						res.status(201).send({code: 1});
					});
				});
		});

		router.put('/:id/toggle-follow/:other_id', function(req, res, next){
				var followers = false;
				models.ID.findOne({_id: req.params.other_id}, function(err, user){
					if(err){
						next(err);
						return;
					}

					if(!user){
						next();
						return;
					}
					console.log(utils.contains(user.followers, req.params.id));
					if(utils.contains(user.followers, req.params.id)){
						utils.remove(user.followers, req.params.id);
						followers = false;
					} else {
						user.followers.push(req.params.id);
						followers = true;
					}



					user.save(function(err){
						if(err){
							next(err);
							return;
						}

						res.status(201).send({code: 1, followers: followers});
					});
				});
		});

		router.get('/:id/count-following', function(req, res, next){
				models.ID.count({followers: req.params.id}, function(err, count){
						if(err) {
							next(err);
							return;
						}

						res.status(200).send({code: 1, following: count});
				});
		});

		router.get('/:id/count-followers', function(req, res, next){
			models.ID.findOne({_id: req.params.id}, function(err, user){
				if(err){
					next(err);
					return;
				}

				res.status(200).send({code: 1, followers: user.followers.length})
			});
		});




	return router;
}

module.exports.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated())
		return next();
	res.redirect('/');
}
