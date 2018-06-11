// pages/usercenter/prize.js
const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luckyRecord:[],
    pages: 1,
    msg: '暂无相关数据',
    isLoad: true,
    isShow:false,
    imgUrl: Url.imgUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var luckyRecord = that.data.luckyRecord;
    that.setData({
      bannerimg: that.data.imgUrl +'default/wx/zhongjiang.jpg'
    });
    Request.requestGet(Url.luckyRecord, function (res) {
      if (res.status == 1) {
        if (res.data.total==0){
            that.setData({
              isShow:true
            });
        }else{
          that.setData({
            luckyRecord: luckyRecord.concat(res.data.data)
          })
          //不在加载分页
          if (res.data.last_page <= that.data.pages){
            that.setData({
              isLoad: false,
              msg: '没有最新数据了'
            });
          }
        }
      }
    });
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoad) {
      var page = this.data.pages;
      this.setData({
        pages: page + 1,
      })
      this.onLoad();
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      luckyRecord: [],
      pages: 1,
      msg: '暂无相关数据',
      isLoad: true,
      isShow: false
    });
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})