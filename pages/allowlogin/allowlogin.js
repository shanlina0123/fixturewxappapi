const app = getApp();
const Url = require('../../utils/config.js');
const Request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:''
  },
  onLoad: function (options) {
    if (options.url != undefined){
      var url = options.url;
    }else{
      var url ='/pages/index/index';
    }
    this.setData({
      url: url
    });
  },
  onGotUserInfo: function (e) {
    console.log(e.detail.userInfo);
    var that = this;
    if (e.detail.userInfo != undefined){
      var obj = { "nickname": e.detail.userInfo.nickName, "faceimg": e.detail.userInfo.avatarUrl};
      Request.requestPost(Url.setUserInfo, obj, function (res) {
        if (res.status == 1) 
        {
          var user = wx.getStorageSync('userInfo');
              user.faceimg = obj.faceimg;
              user.nickname = obj.nickname;
              wx.setStorageSync('userInfo',user);
              wx.reLaunch({
                url: that.data.url
              })
        }else{
          wx.showToast({
            title: res.messages,
            icon: 'none',
          })
        }
      });
    }
  },
})
