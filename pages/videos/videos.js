const app = getApp();
const Url = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:'',
    imgUrl:Url.imgUrl,//地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var data = prevPage.data //取上页data里的数据也可以修改
        that.setData({
          item:data.item
        });
    wx.getNetworkType({
      success: function (res) {
        that.setData({
          network: res.networkType
        });
        if (that.data.network !== 'wifi') {
          wx.showModal({
            title: '网络提醒',
            content: '您当前正在使用移动网络，继续播放将消耗流量！',
            cancelText: '取消播放',
            confirmText: '继续播放',
            success: function (res) {
              if (res.confirm) {
                that.videoContext.play();
              } else if (res.cancel) {
                that.videoContext.pause();
              }
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('projectvideo');
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