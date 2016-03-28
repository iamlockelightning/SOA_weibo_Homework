var express = require('express');
var router = express.Router();
var Weibo = require('nodeweibo');
var http = require('http');
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
      count: 100,
      max_id: 0
  };

  // Weibo.Statuses.user_timeline(para, function(timeline){
  //     // console.log(timeline);
  //     var statuses = timeline.statuses;
  //     var text_list = [];
  //     statuses.forEach(function(e){
  //       // console.log(e.text);
  //       text_list.push(e.text);
  //     });
  //     res.render('show', { title: 'iamlockelightning', data : JSON.stringify(timeline)});
  // });

  var statuses_list = [];
  var new_id;
  var count = 20;
  var finish = function(timeline) {
    // console.log(count);
    var statuses = timeline.statuses;
    statuses.forEach(function(e){
      // console.log(e.id);
      new_id = e.id;
      statuses_list.push(e);
    });
    para['max_id'] = new_id;
    count--;
    if(count > 0){
      Weibo.Statuses.user_timeline(para, finish);
    }
    if(count == 0){
      res.render('show', { title: 'iamlockelightning', data: JSON.stringify(statuses_list)});
    }
  };
  Weibo.Statuses.user_timeline(para, finish);
  // console.log(statuses_list);
  // res.render('show', { title: 'iamlockelightning', data: JSON.stringify(statuses_list)});
});

/* GET emotion page. */
router.get('/emotion/:id', function(req, res, next) {
  var id = req.params.id;
  var para = {
      access_token: user_access_token,
      uid: id,
      count: 100
  };
  var infoo = "JSON 格式的 [double, double] 类型组成的列表。每个元素分别表示请求的列表对应位置的文本的情感判断结果；第一个值为非负面概率，第二个值为负面概率，两个值相加和为 1。";
  Weibo.Statuses.user_timeline(para, function(timeline){
      // console.log("---------------");
      // console.log(timeline);
      var statuses = timeline.statuses;
      var text_list = [];
      // var word_list = [];
      var word_list = '';
      statuses.forEach(function(e){
        // console.log(e.text);
        text_list.push(e.text);
        var patt = /\[[^\]]+\]/g;
        e.text.match(patt).forEach(function(w){
          word_list += w;
        });
      });

      var opt = {
        url: 'http://api.bosonnlp.com/sentiment/analysis?weibo',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Token': 'EGO3bf5q.5590.K4UZUWYVnTIQ'
        }
      };
      // console.log(word_list);
      // text_list = JSON.stringify(text_list);
      word_list = JSON.stringify(word_list);
      console.log(word_list);

      var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://api.bosonnlp.com/sentiment/analysis?weibo", true);
      xhr.setRequestHeader("Content-type","application/json");
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("X-Token", "EGO3bf5q.5590.K4UZUWYVnTIQ");
      xhr.onreadystatechange = function(){
          var XMLHttpReq = xhr;
          if (XMLHttpReq.readyState == 4) {
              if (XMLHttpReq.status == 200) {
                  var text = XMLHttpReq.responseText;
                  console.log(text);
                  res.render('show', { title: 'iamlockelightning', info: infoo, data : JSON.stringify(text)});
              }
          }
      };
      xhr.send(word_list);
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
