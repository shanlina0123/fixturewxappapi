const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js')
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:'',
    msg:'邀请成员二维码'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var siteid = options.siteid;
    var companyid = wx.getStorageSync('userInfo').companyid;
    if (options.type==1)
    {
      //邀请业主
      var url = Url.evaluateCode + '?siteid=' + siteid+"&companyid=" + companyid;
      that.setData({
        msg:'邀请业主评论'
      });
    }else
    {
      var participant = options.participant;
      var id = wx.getStorageSync('userInfo').id;
    
      var url = Url.positionCode + '?uid=' + id + '&participant=' + participant + '&siteid=' + siteid + "&companyid=" + companyid;
    }
    that.setData({
      src: url 
    });
  }
})
