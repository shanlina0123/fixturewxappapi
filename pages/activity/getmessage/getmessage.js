// pages/getmessage/getmessage.js
var app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityluckyid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activityluckyid: options.activityluckyid
    });
  },
  //提交表单
  submitform: function (e) {
    var that = this;
    var uname = e.detail.value.uname;
    var uphone = e.detail.value.uphone;
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    var params = {
      'companyid': wx.getStorageSync('userInfo').companyid, 'sourcecateid':4, 'sourceid':5,
      'storeid': wx.getStorageSync('userInfo').storeid,
      'phone': uphone, 'name': uname, 'content': '抽奖',
      'activityluckyid': that.data.activityluckyid
    }
    if (uphone == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: "none"
      })
    } else if (!myreg.test(uphone)) {
      wx.showToast({
        title: '请正确填写手机号',
        icon: "none"
      })
    } else {
      Request.requestPost(Url.luckyCient, params, function (res) {
        if (res.status == 1) {
          wx.showToast({
            title: res.messages,
            success: function () {
              wx.reLaunch({
                url: '/pages/activity/prize/prize'
              })
            }
          })
        }
      })
    }
  }
})
