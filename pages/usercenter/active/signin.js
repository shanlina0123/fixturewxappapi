const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
Page({
    //提交表单
    submitform:function(e){
        var uname = e.detail.value.uname;
        var uphone = e.detail.value.uphone;
        var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        var params = {
            'companyid': wx.getStorageSync('userInfo').companyid, 'sourcecateid': 2, 'sourceid': 3,
            'phone': uphone, 'name': uname, 'content': '活动名称'
        }
        if(uphone == ''){
            wx.showToast({
                title: '请输入手机号',
                icon:'none'
            })
        } else if (!myreg.test(uphone)){
            wx.showToast({
                title: '请正确输入手机号',
                icon:'none'
            })
        }else{
            Request.requestPost(Url.free, params, function (res) {
                if (res.status == 1) {
                    wx.showToast({
                        title: res.messages,
                        success: function () {
                            wx.reLaunch({
                                url: '../activedetail'
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: res.messages
                    })
                }
            })
        }
    }
})