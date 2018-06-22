const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
      info:{}
    },
    //上传封面图
    uploadimg: function () {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) { }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var id = options.id;
      var obj = {id:id};
      var that = this;
      Request.requestPost(Url.siteEdit,obj, function (res) {
        console.log(res);
        if (res.status == 1)
        {
          that.setData({
            info: res.data
          });
        }
      }); 
    },
})
