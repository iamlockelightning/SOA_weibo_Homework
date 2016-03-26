var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'iamlockelightning' });
});

/* GET show page. */
router.get('/show', function(req, res, next) {
  res.render('show', { title: 'iamlockelightning' });
});

module.exports = router;
