const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
      data:[],
      userID:''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var that = this;
      Request.requestGet(Url.storeInvitation, function (res) {
        if (res.status == 1) 
        {
          that.setData({
            data: res.data,
            userID: wx.getStorageSync('userInfo').id
          });
        }
      })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    /**
     * 切换门店 
     */
    setStore:function(e)
    {
      var id = e.currentTarget.dataset.id;
      Request.requestPut(Url.storeInvitationstoreup, {'storeid':id}, function (res) {
        if (res.status == 1) 
        {
          var user = wx.getStorageSync('userInfo');
              user.storeid = id;
              wx.setStorageSync('userInfo',user);
          wx.reLaunch({
            url: "/pages/index/index"
          })
        }else
        {
          wx.showToast({
            title: '切换失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
})
