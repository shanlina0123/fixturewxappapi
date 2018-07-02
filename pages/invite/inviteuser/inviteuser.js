const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js')
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var participant = options.participant;
    var siteid = options.siteid;
    var id = wx.getStorageSync('userInfo').id;
    var companyid = wx.getStorageSync('userInfo').companyid;
    that.setData({
      src: Url.positionCode + '?uid=' + id + '&participant=' + participant + '&siteid=' + siteid + "&companyid=" + companyid
    });
  }
})
