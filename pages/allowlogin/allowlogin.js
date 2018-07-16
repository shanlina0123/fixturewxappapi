const app = getApp();
const Url = require('../../utils/config.js');
const Request = require('../../utils/request.js');
const Jg = require('../../utils/jmessage.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    appid:'',//小程序appid
    scene:'',//扫码的参数uid=2&positionid=25&type=1
    msg:'确认登录'
  },
  onLoad: function (options) {
    this.getAppid();
    if (options.url != undefined)
    {
      if (options.options != undefined)
      {
        var url = '/' + JSON.parse(options.url) + '?' + decodeURIComponent(options.options);
      }else
      {
        var url = '/' + JSON.parse(options.url);
      }
      if (url == '/pages/allowlogin/allowlogin')
      {
        var url = '/pages/index/index';
      }
    }else{
      var url ='/pages/index/index';
    }
    //是不是扫码过来的
    //options.scene = 'u=1&c=1&t=2';
    if (options.scene) 
    {
      var scene = decodeURIComponent(options.scene);
      this.setData({
        scene: scene,
        msg:'确认授权'
      });
    }
    this.setData({
      url: url
    });
  },
  /**
   * 按钮获取的用户信息
   */
  onGotUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo != undefined)
    {  
      //用户登陆或者修改信息
      if (wx.getStorageSync('userInfo') && that.data.scene == false) {
        //修改用户信息
        that.setUserInfo(e);
      } else {
        //登陆
        that.getUserLogin(e.detail.userInfo);
      }
    }
  },
  getAppid: function () {
    var that = this;
    if( that.data.appid )
    {
      that.getUserOpenId(that.data.appid);
    }else
    {
      if (wx.getExtConfig){
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
            }
          })
        }
      })
    } 
  },
  /**
   * 用户登陆
   */
  getUserLogin: function ( data ) {
    var that = this;
    if (!wx.getStorageSync('openid') || !wx.getStorageSync('companyid') )
    {
      that.getAppid();
      wx.showToast({ title: '登陆失败', icon: 'loading' });
      return;
    }
    wx.showLoading({ title: '登陆中' });
    wx.request({
      url: Url.loginUrl,
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid'),
        companyid: wx.getStorageSync('companyid'),
        nickname: data.nickName,
        faceimg: data.avatarUrl,
        scene:that.data.scene//绑定或者邀请参数
      },
      success: function (res) {
        var data = res.data;
        if (data.status==1) 
        {
          wx.setStorageSync('userInfo', data.data);
          //登陆成功去检测极光账号
          if (data.data.jguser) 
          {
            //登陆极光
            Jg.jmessageLogin(data.data.jguser, data.data.jmessagePass);
          }

          if (!data.data.jguser)
          {
            //注册极光
            Jg.jmessageRegister();
          }
          wx.reLaunch({
            url: that.data.url
          });
        } else {
      
          wx.showModal({
            title: '提示',
            content: data.messages,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                var user=wx.getStorageSync('userInfo');
                if (user)
                {
                  wx.reLaunch({
                    url: '/pages/index/index'
                  })
                }
              }
            }
          });
        }
      },
      fail: function (res) {
        wx.showToast({ title: '请求失败', icon: 'loading' });
      }, complete: function () {
        wx.hideLoading();
      }
    })
  },
  /**
   * 修改用户头像
   */
  setUserInfo:function(e)
  {
    var that = this;
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
  },
 
})
