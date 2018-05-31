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
      canIUse: wx.canIUse('button.open-type.getUserInfo')
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
    wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
    // 查看是否授权
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           console(res.userInfo)
    //         }
    //       })
    //     }
    //   }
    // })
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
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
  
  }
})