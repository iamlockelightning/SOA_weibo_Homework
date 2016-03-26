var express = require('express');
var router = express.Router();
var Weibo = require('nodeweibo');
var setting = require('./setting.json');
var JSON = require('JSON');
Weibo.init(setting);

var user_access_token;
var user_uid;
/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log(req.params.id);
  res.render('index', { title: 'iamlockelightning' });
});

router.get('/authorize', function(req, res, next){
  req.send(Weibo.authorize());
});

/* GET show page. */
router.get('/show', function(req, res, next) {
  // console.log(ret_code);
  // console.log(Weibo.appKey);
  var jsonParas = {
    client_id: Weibo.appKey.appKey,
    client_secret: Weibo.appKey.appSecret,
    grant_type: "authorization_code",
    code: req.query.code,//"the value of your browser's parameter code",
    redirect_uri: Weibo.appKey.redirectUrl
  };
  Weibo.OAuth2.access_token(jsonParas,function(data){
    user_access_token = data.access_token;
    user_uid = data.uid;
    // console.log(user_uid);
    res.render('show', { title: 'iamlockelightning', data : JSON.stringify(data)});
  });
});

/* GET post page. */
router.get('/posts/:id', function(req, res, next) {
  var id = req.params.id;
  var para = {
      access_token: user_access_token,
      uid: id,
      count: 100
  };
  Weibo.Statuses.user_timeline(para, function(timeline){
      // console.log(timeline);
      res.render('show', { title: 'iamlockelightning', data : JSON.stringify(timeline)});
  });
});

/* GET emotion page. */
router.get('/emotion/:id', function(req, res, next) {
  var id = req.params.id;
  var para = {
      access_token: user_access_token,
      uid: id,
      count: 100
  };
  Weibo.Statuses.user_timeline(para, function(timeline){
      // console.log("---------------");
      // console.log(timeline);
      var statuses = timeline.statuses;
      var text_list = [];
      statuses.forEach(function(e){
        // console.log(e.text);
        text_list.push(e.text);
      });
      res.render('show', { title: 'iamlockelightning', data : JSON.stringify(text_list)});
  });
});

/* GET users page. */
router.get('/users', function(req, res, next) {
  var para = {
      access_token: user_access_token,
      uid: user_uid
  };
  Weibo.Users.show(para, function(info){
    res.render('show', { title: 'iamlockelightning', data : JSON.stringify(info)});
  })
});

module.exports = router;
