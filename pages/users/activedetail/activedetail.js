// pages/usercenter/active/activedetail.js
const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uuid = options.uuid
    Request.requestGet(Url.activeInfo + uuid, function (res) {
      if (res.status == 1) {
        that.setData({
          activeInfo: res.data
        })
      } else {
        wx.showToast({
          title: res.message,
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})