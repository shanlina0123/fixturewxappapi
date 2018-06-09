const openIdUrl = require('./utils/config').openIdUrl;
const loginUrl = require('./utils/config').loginUrl;
App({
  onLaunch: function () {
    //this.getAppid();
  },
  onShow: function () {
  },
  onHide: function () {
  },
  getAppid:function()
  {
    var that=this;
    if(wx.getExtConfig){
      wx.getExtConfig({
        success: function (res) {
          var appid = res.extConfig.appid;
              that.getUserOpenId( appid );
        }
      })
    }else{
      wx.showToast({
        title: '微信版本太低无法使用',
        icon: 'none'
      })
    }
  },
  //获取openid
  getUserOpenId: function ( appid ){
    var that = this
    var openid = wx.getStorageSync('openid');
    if (!openid) 
    {
      wx.login({
        success: function (data) {
          wx.request({
            url: openIdUrl,
            method:'POST',
            data: {
              code: data.code,
              appid: appid
            },
            success: function (res) {
              var data = res.data;
              if ( data.status )
              {
                wx.setStorageSync('openid', data.data.openid);
                wx.setStorageSync('companyid', data.data.companyid);
                that.getUserLogin(data.data.openid);
              } 
            },
            fail: function (res) {
              console.log(11);
              wx.showToast({ title: '请求失败', icon: 'noneloading'});
            }
          })
        },
        fail: function (err) {
          console.log(22);
          wx.showToast({ title: '请求失败', icon: 'noneloading' });
        }
      })
    }else
    {
      that.getUserLogin(openid);
    }  
  },
  //用户登陆
  getUserLogin:function( openid )
  {
    var userInfo = wx.getStorageSync('userInfo');
    if (!userInfo )
    {
      wx.request({
        url: loginUrl,
        method: 'POST',
        data: {
          openid: wx.getStorageSync('openid'),
          companyid: wx.getStorageSync('companyid'),
        },
        success: function (res) {
          var data = res.data;
          if (data.status) {
            wx.setStorageSync('userInfo', data.data);
          }else
          {
            wx.showToast({ title: data.messages, icon: 'loading' });
          }
        },
        fail: function (res) {
          wx.showToast({ title: '请求失败', icon: 'loading' });
        },complete: function () {
          wx.hideLoading();
        }
      })
    }
  }
})