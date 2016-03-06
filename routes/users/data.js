var express = require('express');
var router = express.Router();

module.exports.registerRoutes = function(models){

  var pattern = /Adjective|Utensil|Unit|Ingredient|Verb/;

  router.post('/:data', function(req, res, next){
    if(!pattern.test(req.params.data)){
      next({message: 'Wrong data selected'})
    } else next();
  }, function(req, res, next){
      new models[req.params.data](req.body).save(function(err, data){
          if(err){
            next(err);
          } else if(!data){
            next({message: 'saving ' + req.params.data + ' failed!'});
          } else {
            res.status(201).send({_id: data._id, _v: data._v});
          }
      });
  });

  router.get('/:data', function(req, res, next){
    if(!pattern.test(req.params.data)){
      next({message: 'Wrong data selected'})
    } else next();
  }, function(req, res, next){
      models[req.params.data].find({}, function(err, dataArray){
          if(err){
            next(err);
          } else if(!dataArray){
            next({message: 'loading documents failed'});
          } else {
            res.status(200).send(dataArray);
          }
      });
  });

  router.get('/:data/:searchquery', function(req, res, next){
    if(!pattern.test(req.params.data)){
      next({message: 'Wrong data selected'})
    } else next();
  }, function(req, res, next){
    models[req.params.data].find({name: /req.params.searchquery/}, function(err, dataArray){
        if(err){
          next(err);
        } else if(!dataArray){
          next({message: 'loading document failed'});
        } else {
          res.status(200).send(dataArray);
        }
    });
  });


  return router;
}
