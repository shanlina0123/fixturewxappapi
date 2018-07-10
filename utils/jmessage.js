const app = getApp();
var Url = require('config.js');
const JIM = app.globalData.JIM;

/**
 * 链接
 */
var coonnect = JIM.isConnect();
if (coonnect) 
{
  //初始化
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
  if ( isLogin == true) 
  {
   //退出极光
    JIM.loginOut();
  }
  JIM.login({
    'username': username,
    'password': password
  }).onSuccess(function (data) {
    //console.log(data);
    app.globalData.JIM = JIM;
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
  jmessageRegister: jmessageRegister,
  jmessageLogin: jmessageLogin,
  showToast:showToast,
};