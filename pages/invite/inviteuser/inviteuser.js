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
    var positionid = options.positionid;
    var companyid = wx.getStorageSync('userInfo').companyid;
    console.log(positionid);
    that.setData({
      src: Url.positionCode + '?companyid='+companyid+'&positionid=' + positionid
    });
  }
})
