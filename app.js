var JMessage = require('utils/jmessage-wxapplet-sdk-1.4.0.min.js');
var JIM = new JMessage({ debug: false });
var Url = require('utils/config.js');

/**
 * 监听链接
 */
JIM.onDisconnect(function () {
  //getjmessageInit();
});

/**
 * 链接
 */
var coonnect = JIM.isConnect();
if (coonnect == false) 
{
  //初始化
  getjmessageInit();
}

/**
  * 极光初始化
  */
function getjmessageInit() {
  var that = this;
  wx.request({
    url: Url.jmessageInit,
    method: 'POST',
    success: function (res) {
      var res = res.data;
      if (res.status == 1) {
        var data = res.data;
        JIM.init({
          "appkey": data.appkey,
          "random_str": data.random_str,
          "signature": data.signature,
          "timestamp": data.timestamp
        }).onSuccess(function (data) {
          console.log('fail:' + JSON.stringify(data));
        }).onFail(function (data) {
          console.log('fail:' + JSON.stringify(data));
        });
      }
    }
  });
}

App({
  globalData:{
    JIM: JIM
  },
  onLaunch: function () {
  },
  onShow: function () {
    var that = this;
  },
  onHide: function () {
  },
  
})