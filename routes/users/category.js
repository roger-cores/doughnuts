var express = require('express');
var router = express.Router();

module.exports.registerRoutes = function(models){


  router.get('/', function(req, res, next){
    models.Category.find({}).exec(function(err, categories){
      if(err) {
        next();
        return;
      }
      res.status(200).send(categories);
    });
  }, function(req, res, next){
    res.status(500).send({errmsg: 'Internal Server Error'});
  });

  return router;
}
