var express = require('express');
var router = express.Router();
var Weibo = require('nodeweibo');
var setting = require('./setting.json');
var JSON = require('JSON');
Weibo.init(setting);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'iamlockelightning' });
});

router.get('/authorize', function(req, res, next){
  req.send(Weibo.authorize());
});

/* GET show page. */
router.get('/show', function(req, res, next) {
  ret_code = req.query.code;
  console.log(ret_code);
  console.log(Weibo.appKey);
  var jsonParas = {
    client_id:Weibo.appKey.appKey,
    client_secret:Weibo.appKey.appSecret,
    grant_type:"authorization_code",
    code: ret_code,//"the value of your browser's parameter code",
    redirect_uri:Weibo.appKey.redirectUrl
  };
  Weibo.OAuth2.access_token(jsonParas,function(data){
    console.log(data);

    res.render('show', { title: 'iamlockelightning', data : JSON.stringify(data)});
  });
});

module.exports = router;
