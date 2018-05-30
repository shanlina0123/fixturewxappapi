// pages/usercenter/question.js
const app = getApp();
const Url = require('../../utils/config.js');
const Request = require('../../utils/request.js')
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  formSubmit: function (e) {
    var obj = {};
    if ( e.detail.value.phone ){
      var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      var phone = e.detail.value.phone;
      if (!myreg.test(phone)) {
          wx.showToast({
            title: '请正确填写手机号',
            icon: "none"
          })
          return false;
        }
      obj.phone = phone;
    }
    if ( !e.detail.value.content) {
      wx.showToast({
        title: '请填写',
        icon: "none"
      })
    }
    obj.content = e.detail.value.content;
    Request.requestPost(Url.qaFeedback, obj, function (res) {
      if (res.status == 1){
        wx.showToast({
          title: res.messages,
          success: function () {
            wx.reLaunch({
              url: '/pages/users/usercenter/usercenter'
            })
          }
        })
      }else {
        wx.showToast({
          title: res.message,
        })
      }
    });
  }
})