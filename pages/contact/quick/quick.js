const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
Page({
  data: {
    imgUrl: Url.imgUrl,
    region: ['陕西省', '西安市'],
    customItem: ''
  },
//提交表单
    submitform: function(e){
        var that = this;
        var uname = e.detail.value.uname;
        var uphone = e.detail.value.uphone;
        var uarea = e.detail.value.uarea;
        var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        var params = { 
                      'companyid': wx.getStorageSync('userInfo').companyid, 
                      'sourcecateid': 1, 'sourceid': 4,
                      'phone': uphone, 
                      'name': uname, 
                      'uarea': uarea,
                      'content': '装修报价', 
                      'formId': e.detail.formId,
                      'clientcity': that.data.region.join(' ')}
        if (uphone == ''){
            wx.showToast({
                title: '手机号不能为空',
                icon: "none"
            })
        } else if (!myreg.test(uphone)){
            wx.showToast({
                title: '请正确填写手机号',
                icon: "none"
            })
        } else if (uarea == ''){
            wx.showToast({
                title: '请输入您的住房面积',
                icon: "none"
            })
        }else{
            Request.requestPost(Url.free, params, function (res) {
                if (res.status == 1) {
                    wx.showModal({
                      title: '',
                      content: res.messages,
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          wx.reLaunch({
                            url: '/pages/index/index'
                          })
                        }
                      }
                    });
                }
            })
        }
    },
    bindRegionChange: function (e) {
      this.setData({
        region: e.detail.value
      })
    }
})