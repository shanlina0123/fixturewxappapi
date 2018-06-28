const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js')
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data:{
    data:[]
  },
  adduser:function(){
      this.setData({
          isadd:true 
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    Request.requestGet(Url.participantList, function (res) {
      if (res.status == 1) 
      {
        that.setData({ data: res.data});
      }
    });
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
})
