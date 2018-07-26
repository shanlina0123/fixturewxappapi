var app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     data:[],
     page:1,
     isLoad:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
    this.setData({
      data: [],
      page: 1,
      isLoad: false
    });
    this.getActiveList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoad) {
      var page = this.data.page;
      this.setData({
        page: parseInt(page)+1
      });
      this.getActiveList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 活动列表
   */
  getActiveList:function()
  {
    var that = this;
    Request.requestGet(Url.activeList, function (res) {
      if (res.status == 1)
      { 
        if (res.data.total == 0) {
          that.setData({
            isLoad: false
          });
        }else 
        {
          that.setData({
            data: that.data.data.concat(res.data.data),
            isLoad: true
          })
          //没有更多了 
          if (res.data.last_page <= that.data.page) {
            that.setData({
              isLoad: false
            });
          }
        }
      }
    });
  }
})