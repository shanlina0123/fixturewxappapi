// pages/usercenter/usercenter.js
const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      phonenumber:'',
      companyData:{},
      user:{}
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
    this.setData({
      user:wx.getStorageSync('userInfo')
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    Request.requestGet(Url.companyInfo, function (res) {
      if (res.status == 1){
        that.setData({
          companyData: JSON.stringify(res.data),
          phonenumber: res.data.phone
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  error:function(){
    wx.reLaunch({
      url: "/pages/allowlogin/allowlogin?url='/pages/users/usercenter/usercenter'"
    })
  }
})