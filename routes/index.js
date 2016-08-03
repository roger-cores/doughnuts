var express = require('express');
var router = express.Router();

router.get('/security', function(req, res, next){
  res.render('security');
});

router.get('/change-pass/:email/:code', function(req, res, next){
  res.render('change-pass', {email: req.params.email, code: req.params.code});
});

module.exports = router;
