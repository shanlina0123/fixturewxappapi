const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
Page({
//提交表单
    submitform:function(e){
        console.log(e);
        var uname = e.detail.value.uname;
        var uphone = e.detail.value.uphone;
        var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        var params = { 'companyid': wx.getStorageSync('userInfo').companyid, 'sourcecateid': 1, 'sourceid': 1, 'phone': uphone, 
        'name': uname, 'content': '预约参观' }
        if (uphone == ''){
            wx.showToast({
                title: '请输入手机号',
                icon:'none'
            })
        } else if (!myreg.test(uphone)){
            wx.showToast({
                title: '请输正确输入手机号',
                icon: 'none'
            })
        }else{
            Request.requestPost(Url.free, params, function (res) {
                if (res.status == 1) {
                    wx.showToast({
                        title: res.messages,
                        success: function () {
                            wx.reLaunch({
                                url: '../projectdetail'
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