var express = require('express');
var mv = require('mv');
var router = express.Router();


module.exports.registerRoutes = function(models, multiparty, utils) {

  //get list (under category with search) DONE
  //put like Recipe DONE
  //get recipe by id DONE
  //get my recipes DONE
  //delete recipe by id DONE
  //put recipe DONE
  //post recipe DONE
  //upload image to recipe DONE
  //comment on recipe DONE
  //get count recipes under user/author DONE
  //get count likes under user/author DONE





  router.put('/:id/comment/', function(req, res, next){
      var date = Date.now();

      models.Recipe.findById(req.params.id, function(err, recipe){
        if(err){
          next(err);
          return;
        }

        if(!recipe){
          next({message: 'recipe doesnt exist'});
          return;
        }
        req.body.at = date;
        req.body.by = req.body.user_id;
        recipe.comments.push(req.body);

        recipe.save(function(err){
          if(err){
            next(err);
            return;
          }

          res.status(200).send({code: 1});
        });
      });
  });

  router.put('/:id/toggle-like/', function(req, res, next){
    var liked = false;
    models.Recipe.findOne({_id: req.params.id}, function(err, recipe){
      if(err){
        next(err);
        return;
      }

      if(!recipe){
        next({message: 'recipe doesnt exist'});
        return;
      }

      if(utils.contains(recipe.likes, req.body.user_id)){
        utils.remove(recipe.likes, req.body.user_id);
        liked = false;
      } else {
        recipe.likes.push(req.body.user_id);
        liked = true;
      }



      recipe.save(function(err){
        if(err){
          next(err);
          return;
        }

        res.status(201).send({code: 1, liked: liked});
      });
    });

  });


  router.get('/:id/author/:author_id', function(req, res, next){
    models.Recipe.find({_id: req.params.id, author: req.params.author_id}, function(err, recipes){
      if(err){
        next(err);
        return;
      }

      if(!recipes){
        next({message: 'cant find documents'});
        return;
      }

      res.status(200).send(recipes);

    });

  });

  router.get('/:id/author/:author_id/count-likes', function(req, res, next){
    models.Recipe.find({_id: req.params.id, author: req.params.author_id}, function(err, recipes){
      if(err){
        next(err);
        return;
      }

      if(!recipes){
        next({message: 'cant find documents'});
        return;
      }

      var count = 0;

      for(var i in recipes){
        count += recipe[i].likes.length;
      }

      res.status(200).send({code: 1, count: count});


    });

  });


  router.get('/:id/author/:author_id/count', function(req, res, next){
    models.Recipe.count({_id: req.params.id, author: req.params.author_id}, function(err, recipes){
      if(err){
        next(err);
        return;
      }

      if(!recipes){
        next({message: 'cant find documents'});
        return;
      }

      res.status(200).send({code: 1, count: recipes.length});

    });
  });

  router.get('/:id', function(req, res, next){
      models.Recipe.findById(req.params.id, function(err, recipe){
        if(err){
          next(err);
          return;
        }

        if(!recipe){
          next({message: 'cant find document'});
          return;
        }

        res.status(200).send(recipe);

      });

  });

  router.delete('/:id', function(req, res, next){
    models.Recipe.findById(req.params.id, function(err, recipe){
      if(err){
        next(err);
        return;
      }

      if(!recipe){
        next({message: 'cant find document'});
        return;
      }

      models.Recipe.remove({_id: recipe._id}, function(err){
        if(err){
          next(err);
          return;
        }

        res.status(200).send({code: 1, message: 'removed'});
      });

    });
  });


  router.post('/', function(req, res, next){
      models.Recipe.validateObject(req, models, next);
  }, function(req, res, next){

      var date = Date.now();
      req.body.createdAt = date;
      req.body.modifiedAt = date;

      new models.Recipe(req.body).save(function(err, recipe){
        if(err){
          next(err);
          return;
        }



        res.status(200).send({code: 1, id: recipe._id});
      });
  });

  router.put('/:id', function(req, res, next){
      models.Recipe.validateObject(req, models, next);
  },function(req, res, next){


      models.Recipe.findById(req.params.id, function(err, recipe){
        if(err){
          next(err);
          return;
        }

        if(!recipe){
          next({message: 'cant load document'});
          return;
        }

        var date = Date.now();
        recipe.modifiedAt = date;

        recipe.ingredients = req.body.ingredients;
        recipe.directions = req.body.directions;

        recipe.save(function(err, recipe){
          if(err){
            next(err);
            return;
          }

          res.status(200).send(recipe);
        });
      });

  });

  router.get('/:category_id/searchquery/:searchquery', function(req, res, next){
      models.Recipe.find({category: req.params.category_id, name: /req.params.searchquery/}, function(err, recipes){
        if(err){
          next(err);
          return;
        }

        res.status(200).send(recipes);
      });
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


  return router;
}
