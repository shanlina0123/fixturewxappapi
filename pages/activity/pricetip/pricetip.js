// pages/index/pricetip.js
var app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      ison1:true,
      ison2:false,
      companyData:{},
      info:{},
      myLuck:{},
  },
  /**活动说明和中奖记录切换 */
  tab1:function(){
    this.setData({
        ison1:true,
        ison2:false
    })
  },
  tab2: function () {
      this.setData({
          ison1: false,
          ison2: true
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCompanyInfo();
    this.setData({
      info: JSON.parse(options.info)
    });
    this.myLuck(options.id);
  },
  getCompanyInfo: function () {
    var that = this;
    Request.requestGet(Url.companyInfo, function (res) {
      if (res.status == 1) {
        var data = res.data;
        that.setData({
          companyData: data
        })
      }
    });
  },
  myLuck:function( id ){
    var that = this;
    Request.requestGet(Url.myLuck+'?id='+id, function (res) {
      if (res.status == 1) {
        var data = res.data;
          that.setData({
            myLuck: data
          })
      }
    });
  }
})