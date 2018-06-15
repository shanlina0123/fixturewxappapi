// pages/usercenter/usercenter.js
const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      phonenumber:'', //电话
      companyData:{},//公司数据
      user:{},//用户信息
      imgUrl: Url.imgUrl,//图片地址
      userType:0,//''//用户类型
  },
  phonecall:function(){
      wx.makePhoneCall({
          phoneNumber: this.data.phonenumber,
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      user:wx.getStorageSync('userInfo'),
      //userType: wx.getStorageSync('userInfo').type
    });
    Request.requestGet(Url.companyInfo, function (res) {
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
  error:function(){
    wx.reLaunch({
      url: "/pages/allowlogin/allowlogin?url='/pages/users/usercenter/usercenter'"
    })
  }
})