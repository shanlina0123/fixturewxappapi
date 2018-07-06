const app = getApp();
var JMessage = require('jmessage-wxapplet-sdk-1.4.0.min.js');
var Url = require('config.js');
var JIM = new JMessage({ debug: true });

/**
 * 监听链接
 */
JIM.onDisconnect(function () {
  getjmessageInit();
});
/**
 * 判断初始化
 */
var coonnect = JIM.isConnect();
if( coonnect == false )
{
  //初始化
  getjmessageInit();

}else
{
  var isLogin = JIM.isLogin();
  if (isLogin == false) {
    var user = wx.getStorageSync('userInfo');
    if (user) {
      var username = user.jguser;
      var password = user.jmessagePass
      jmessageLogin(username, password);
    }
  }
}

/**
  * 极光初始化
  */
function getjmessageInit()
{
  var that = this;
  wx.request({
    url: Url.jmessageInit,
    method: 'POST',
    success: function (res) {
      var res = res.data;
      if (res.status == 1) 
      {
        var data = res.data;
        JIM.init({
          "appkey": data.appkey,
          "random_str": data.random_str,
          "signature": data.signature,
          "timestamp": data.timestamp
        }).onSuccess(function (data) {
          //登陆
          var isLogin = JIM.isLogin();
          if (isLogin == false) 
          {
            var user = wx.getStorageSync('userInfo');
            if (user) 
            {
              var username = user.jguser;
              var password = user.jmessagePass
              jmessageLogin(username, password);
            }
          }
        }).onFail(function (data) {
           console.log('fail:' + JSON.stringify(data));
        });
      }
    }
  });
}

/**
  * 添加极光用户
  */
function jmessageRegister()
{
  var Authorization = wx.getStorageSync('userInfo').Authorization;
  var that = this;
  wx.request({
    url: Url.jmessageRegister,
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'Authorization': Authorization
    },
    data:{},
    success: function (res) {
      var res = res.data;
      if (res.status == 1) 
      {
        jmessageLogin(res.data.username, res.data.pass);
      }
    }
  });
}
/**
 * 极光登陆
 */
function jmessageLogin(username, password) 
{
  var that = this;
  var isLogin = JIM.isLogin();
  if ( isLogin == true) {
   //退出极光
    JIM.loginOut();
  }
  JIM.login({
    'username': username,
    'password': password
  }).onSuccess(function (data) {
    //console.log(data);
  }).onFail(function (data) {
    //同上
  });
  
}
/**
 * 提示
 */
function showToast(title)
{
  wx.showToast({ title:title, icon: 'loading', })
}

module.exports = {
  getjmessageInit: getjmessageInit,
  jmessageRegister: jmessageRegister,
  jmessageLogin: jmessageLogin,
  showToast:showToast,
  JIM: JIM
};