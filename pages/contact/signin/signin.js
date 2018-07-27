const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
Page({
    data: {
      imgUrl: Url.imgUrl,
      id:'',
      region: ['陕西省', '西安市'],
    },
    onLoad: function (options) {
      var id = options.id;
      this.setData({
        id:id
      });
    },
    //提交表单
    submitform:function(e){
        var that = this;
        var uname = e.detail.value.uname;
        var uphone = e.detail.value.uphone;
        var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        var params = {
            'companyid': wx.getStorageSync('userInfo').companyid, 
            'sourcecateid': 1, 
            'sourceid': 3,
            'phone': uphone, 
            'name': uname, 
            'content':'活动报名', 
            'formId': e.detail.formId,
            'activityid':that.data.id,
            'clientcity': that.data.region.join(' ')
        }
        if(uphone == ''){
            wx.showToast({
                title: '请输入手机号',
                icon:'none'
            })
        } else if (!myreg.test(uphone)){
            wx.showToast({
                title: '请正确输入手机号',
                icon: 'none'
            })
        }else{
            Request.requestPost(Url.free, params, function (res) {
                if (res.status == 1) 
                {
                  wx.showModal({
                    title: '报名提示',
                    content: res.messages,
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm)
                       {
                        wx.navigateBack({
                          delta: 1
                        });
                       }
                    }
                  });
                }
            });
        }
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  }
})