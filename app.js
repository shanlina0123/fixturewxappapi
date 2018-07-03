var JMessage = require('utils/jmessage-wxapplet-sdk-1.4.0.min.js');
var Url = require('utils/config.js');
App({
  globalData:{
    JIM:new JMessage({ debug: true })
  },
  onLaunch: function () {
    this.getjmessageInit();
  },
  onShow: function () {
    var JIM = this.globalData.JIM;
    JIM.onDisconnect(function () {
      this.getjmessageInit();
    });
  },
  onHide: function () {
  },
  /**
   * 极光初始化
   */
  getjmessageInit: function () {
    var that = this;
    wx.request({
      url: Url.jmessageInit,
      method: 'GET',
      success: function (res) {
        var res = res.data;
        if ( res.status == 1 ) 
        {
          var data = res.data;
          var JIM = that.globalData.JIM;
          JIM.init({
            "appkey": data.appkey,
            "random_str": data.random_str,
            "signature": data.signature,
            "timestamp": data.timestamp
          }).onSuccess(function (data) {
            console.log('success:' + JSON.stringify(data));
          }).onFail(function (data) {
            console.log('fail:' + JSON.stringify(data));
          });
        }
      }
    });
  }
})