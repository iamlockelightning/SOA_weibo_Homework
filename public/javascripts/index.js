
Weibo = {};
    // must initialize before using Weibo Object
    Weibo.init = function(setting) {
      Weibo.appKey = {
        "appKey":setting.appKey,
        "appSecret":setting.appSecret,
        "redirectUrl":setting.redirectUrl
      };
    };

  Weibo.getGetURL = function(paras){
    var arr = [];
    for(var key in paras){
      arr.push(key + '=' + paras[key]);
    }
    var path = '?client_id=' + Weibo.appKey.appKey + '&redirect_uri=' + Weibo.appKey.redirectUrl
               + '&client_secret=' + Weibo.appKey.appSecret;
    if(arr)
      return path + '&' + arr.join('&');
    return path + arr.join('&');
  };

  Weibo.getPostURL = function(paras){
    if(!paras)
      paras = {};
    paras.client_id = Weibo.appKey.appKey;
    paras.redirect_uri = Weibo.appKey.redirectUrl;
    paras.client_secret = Weibo.appKey.appSecret;
    return paras;
  };

    Weibo.authorize = function(){
        var path = 'https://api.weibo.com/oauth2/authorize' + Weibo.getGetURL();
        return path;
    };

console.log(setting)
Weibo.init(setting);
$('#signin').click(function(){
  window.open(Weibo.authorize());
});

// var jsonParas = {
// 	code:"the value of your browser's parameter code",
// 	grant_type:"authorization_code"
// };
// Weibo.OAuth2.access_token(jsonParas,function(data){
// 	console.log(data);
// });

// // set parameters
// var para = {
//     "source": Weibo.appKey.appKey,
//     "access_token": 'your access_token here'
// };

// // get public timeline
// Weibo.Statuses.public_timeline(para, function(data){
//     console.log(data);
// });
