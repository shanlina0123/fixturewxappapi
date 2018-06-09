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
    this.getAppid();
    if (options.url != undefined){
      var url = '/'+JSON.parse(options.url);
    }else{
      var url ='/pages/index/index';
    }
    this.setData({
      url: url
    });
  },
  onGotUserInfo: function (e) {
    //console.log(e.detail.userInfo);
    var that = this;
    if (e.detail.userInfo != undefined)
    {  
      if (wx.getStorageSync('userInfo'))
      {
        //修改用户信息
        that.setUserInfo(e);
      }else
      {
        //登陆
        that.getUserLogin(e.detail.userInfo);
      }
    }
  },
  getAppid: function () {
    var that = this;
    if (wx.getExtConfig) {
      wx.getExtConfig({
        success: function (res) {
          var appid = res.extConfig.appid;
          that.getUserOpenId(appid);
        }
      })
    } else {
      wx.showToast({
        title: '微信版本太低无法使用',
        icon: 'none'
      })
    }
  },
  //获取openid
  getUserOpenId: function (appid) {
    var that = this
    var openid = wx.getStorageSync('openid');
    if (!openid) {
      wx.login({
        success: function (data) {
          wx.request({
            url: Url.openIdUrl,
            method: 'POST',
            data: {
              code: data.code,
              appid: appid
            },
            success: function (res) {
              var data = res.data;
              if (data.status) {
                wx.setStorageSync('openid', data.data.openid);
                wx.setStorageSync('companyid', data.data.companyid);
              }
            },
            fail: function (res) {
              wx.showToast({ title: '请求失败', icon: 'noneloading' });
            }
          })
        },
        fail: function (err) {
          wx.showToast({ title: '请求失败', icon: 'noneloading' });
        }
      })
    } 
  },
  //用户登陆
  getUserLogin: function ( data ) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.request({
        url: Url.loginUrl,
        method: 'POST',
        data: {
          openid:wx.getStorageSync('openid'),
          companyid:wx.getStorageSync('companyid'),
          nickname:data.nickname,
          faceimg: data.faceimg
        },
        success: function (res) {
          var data = res.data;
          if (data.status)
          {
            wx.setStorageSync('userInfo', data.data);
            wx.reLaunch({
              url: that.data.url
            })
          } else {
            wx.showToast({ title: data.messages, icon: 'loading' });
          }
        },
        fail: function (res) {
          wx.showToast({ title: '请求失败', icon: 'loading' });
        }, complete: function () {
          wx.hideLoading();
        }
      })
    }
  },
  setUserInfo:function(e)
  {
    var obj = { "nickname": e.detail.userInfo.nickName, "faceimg": e.detail.userInfo.avatarUrl };
    Request.requestPost(Url.setUserInfo, obj, function (res) {
      if (res.status == 1) {
        var user = wx.getStorageSync('userInfo');
        user.faceimg = obj.faceimg;
        user.nickname = obj.nickname;
        wx.setStorageSync('userInfo', user);
        wx.reLaunch({
          url: that.data.url
        })
      } else {
        wx.showToast({
          title: res.messages,
          icon: 'none',
        })
      }
    });
  }
})
