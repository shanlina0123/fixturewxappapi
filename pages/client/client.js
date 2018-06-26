const app = getApp();
const Url = require('../../utils/config.js');
const Request = require('../../utils/request.js')
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      page: 1,//分页
      client:[],//客户信息
      isLoad: true,//分页开关
      msg:'暂无数据',
      lengthnone:false
  },
  /**
   * 拨打电话
   */
  phonecall: function (e) 
  {   
    var phone = e.currentTarget.dataset.phone;
      wx.makePhoneCall({
        phoneNumber: phone,
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getClient();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,//分页
      client: [],//客户信息
      isLoad: true,//分页开关
      msg: '暂无数据',
      lengthnone: false
    });
    this.getClient();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoad) {
      var page = this.data.pages;
      this.setData({
        pages: page + 1,
      })
      this.getClient();
    }
  },
  getClient:function()
  {
    var that = this;
    var page = that.data.page;
    Request.requestGet(Url.clientList + '?page=' + page, function (res) {
      if (res.status == 1) {
        if (res.data.total == 0) {
          that.setData({
            lengthnone:true,
          });
        }else
        {  
          var client = that.data.client;
          that.setData({
            client: client.concat(res.data.data),
          });
        }
        //不加载分页了
        if (res.data.last_page <= page)
        {
          that.setData({
            isLoad: false,
            lengthnone:true,
            msg:'已经到底了'
          })
        }
      }
    });
  }
})
