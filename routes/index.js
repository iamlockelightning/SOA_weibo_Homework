var express = require('express');
var router = express.Router();

// var Weibo = require('nodeweibo');
// var setting = require('./setting.json');
// 首次调用接口前需初始化Weibo类，传入配置信息 (appKey, appSecret, redirect_url, etc. )
// Weibo.init(setting);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
