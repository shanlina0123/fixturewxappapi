const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userLocation:false,
    longitude:0,
    latitude:0,
    address:[],
    map: true, 
    listheight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //如果授权了就展示 部授权就部展示地图
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setData({
          longitude:longitude,
          latitude:latitude
        });
        that.getMapAddress(latitude, longitude);
      },fail:function(){
        that.setData({
          userLocation:true
        });
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        var windowheight = res.windowHeight;
        that.setData({
          listheight: (windowheight - 18 - 210) * 1.6
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;   
    var userLocation = that.data.userLocation;
    if (userLocation == true)
    {
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          var latitude = res.latitude;
          var longitude = res.longitude;
          that.setData({
            longitude: longitude,
            latitude: latitude,
            userLocation: false
          });
          that.getMapAddress(latitude, longitude);
        }
      })
    }
  },
  /**
   * 默认地址
   */
  getMapAddress: function (latitude, longitude ){
    var that = this;
    Request.requestPost(Url.mapAddress, { "latitude": latitude, "longitude": longitude}, function (res) {
      //console.log(res);
      if (res.status == 1) {
        that.setData({
          address: res.data
        });
      }
    });
  },
  /**
   * 设置地址
   */
  setAddress:function(e)
  {
     var that = this;
     var item = e.currentTarget.dataset.item;
     var pages = getCurrentPages();
     var prevPage = pages[pages.length - 2];  //上一个页面
     var info = prevPage.data //取上页data里的数据也可以修改
        // console.log(pages.length);
        prevPage.setData({
          address:item
        }); 
        wx.navigateBack({
          delta: 1
        })
  }, 
  /**
   * 搜索地址
   */
  seachAddress: function (e)
  {
    var that = this;
    var k = e.detail.value;
    if (k)
    {
      Request.requestPost(Url.mapSeachAddress, { "keyword": k}, function (res) {
        console.log(res);
        if (res.status == 1) {
          that.setData({
            address: res.data
          });
        }
      });
    }
  },
  bindfocus:function()
  {
    this.setData({
      map:false,
      address:[]
    });
  }
})
