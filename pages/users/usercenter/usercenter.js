const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phonenumber: '', //电话
    companyData: {}, //公司数据
    user: {}, //用户信息
    imgUrl: Url.imgUrl, //图片地址
    userType: 0, //用户类型
    editshow: true,
    nickname:'',
  },
  phonecall: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.phonenumber,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      user: wx.getStorageSync('userInfo'),
      userType: wx.getStorageSync('userInfo').type
    });
    Request.requestGet(Url.companyInfo, function(res) {
      if (res.status == 1) {
        var data = res.data;
        data.logo = that.data.imgUrl + data.logo;
        that.setData({
          companyData: JSON.stringify(data),
          phonenumber: res.data.phone
        })
      }
    });
  },
  error: function() {
    wx.reLaunch({
      url: "/pages/allowlogin/allowlogin?url='/pages/users/usercenter/usercenter'"
    })
  },
  /**
   * 修改昵称
   */
  showedit: function() {
    this.setData({
      editshow: false
    })
  },
  /**
   * 确定按钮 
   */
  confirmbtn: function(e) {
    var that = this;
    if (!that.data.nickname)
    {
       wx.showToast({
         title: '昵称不能为空',
         icon:'none'
       })
       return;
    }
    this.setData({
      editshow: true
    });
    var obj = { "nickname": that.data.nickname};
    Request.requestPost(Url.setUserInfo, obj, function (res) {
      if (res.status == 1) {
        var user = wx.getStorageSync('userInfo');
            user.nickname = obj.nickname;
            wx.setStorageSync('userInfo', user);
        var userInfo = that.data.user;
            userInfo.nickname = obj.nickname;
        that.setData({
          user: userInfo
        });
        wx.showToast({
          title: res.messages,
        })
      } else {
        wx.showToast({
          title: res.messages,
          icon: 'none',
        })
      }
    });
  },
  /**
   * 取消按钮
   */
  closepop: function() {
    this.setData({
      editshow: true
    })
  },
  bindinput:function(e)
  {
    this.setData({
      nickname: e.detail.value
    });
  }
})