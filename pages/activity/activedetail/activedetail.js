var app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:'',
    imgUrl: Url.imgUrl,//图片地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    Request.requestGet(Url.activeInfo +'?id='+id, function (res) {
      if (res.status==1)
      {
        var data = res.data;
            data.bgurl = that.data.imgUrl + data.bgurl;
            data.startdate = util.formatToTime(data.startdate, 'M.D');
            data.enddate = util.formatToTime(data.enddate, 'M.D');
            data.mainurl = data.mainurl ? that.data.imgUrl + data.mainurl:'';
          that.setData({
            info:data
          });  
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