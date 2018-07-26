const app = getApp();
const Url = require('../../utils/config.js');
const Request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popshow: false,
    contentnumber: 0,
    cityname: "",
    roomtypename:'',
    roomstylename:'',
    budget:'',
    SiteScreeningConditions:'',//筛选条件
    site:[],//工地
    parameter: {'cityid': '', 'roomtypeid': '', 'roomstyleid': '','budget':'','page':1},
    imgUrl: Url.imgUrl,//图片地址
    isLoad:false
  },
  /**
   * 显示遮罩 
   */
  showpop: function(e) {
    var contentnumber = e.currentTarget.dataset.contentnumber
    this.setData({
      popshow: true,
      contentnumber: contentnumber
    })
  },
  /**
   * 关闭遮罩
   */
  closepop: function(e) {
    this.setData({
      popshow: false
    })
  },
  /**选中筛选条件 */
  makesure: function() {
    this.setData({
      popshow: false
    })
  },
  thistext: function(e) {
    var that = this;
    var text = e.currentTarget.dataset.text;
    var value = e.currentTarget.dataset.value;
    var contentnumber = that.data.contentnumber;
    var parameter = that.data.parameter;
    switch (parseInt(contentnumber))
    {
      case 1:
        parameter.cityid = value;
        parameter.page = 1;
        that.setData({
          popshow: false,
          cityname: value ? text : '',
          contentnumber: value ? contentnumber:0,
          parameter: parameter,
          site: []
        });
        break;
      case 2:
        parameter.roomtypeid = value;
        parameter.page = 1;
        that.setData({
          popshow: false,
          roomtypename: value ? text : '',
          contentnumber: value ? contentnumber : 0,
          parameter: parameter,
          site: []
        });
        break;
      case 3:
        parameter.roomstyleid = value;
        parameter.page = 1;
        that.setData({
          popshow: false,
          roomstylename: value ? text : '',
          contentnumber: value ? contentnumber : 0,
          parameter: parameter,
          site: []
        });
        break;
      case 4:
        parameter.budget = value;
        parameter.page = 1;
        that.setData({
          popshow: false,
          budget: value ? text : '',
          contentnumber: value ? contentnumber : 0,
          parameter: parameter,
          site:[]
        });
        break;
    }
    that.getSiteList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSiteScreeningConditions();
    this.getSiteList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      popshow: false,
      contentnumber: 0,
      cityname: "",
      roomtypename: '',
      roomstylename: '',
      budget: '',
      site: [],//工地
      parameter: { 'cityid': '', 'roomtypeid': '', 'roomstyleid': '', 'budget': '', 'page': 1 },
      isLoad:true
    });
    this.getSiteList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.isLoad) 
    {
      var parameter = this.data.parameter;
          parameter.page = parseInt(parameter.page)+1;
      this.setData({
        parameter: parameter
      });
      this.getSiteList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 筛选条件
   */
  getSiteScreeningConditions:function(){
    var that = this;
    Request.requestGet(Url.siteScreeningConditions, function (res) {
      if (res.status == 1) {
          that.setData({
            SiteScreeningConditions: res.data
          });
      }
    });
  },
  /**
   * 工地列表
   */
  getSiteList:function(){
    var that = this;
    var parameter = that.data.parameter;
    var str = 'cityid=' + parameter.cityid + '&roomtypeid=' + parameter.roomtypeid + '&roomstyleid=' + parameter.roomstyleid + '&budget=' + parameter.budget + '&page=' + parameter.page;
    Request.requestGet(Url.siteScreening+'?'+str, function (res) {
      if (res.status == 1) 
      {
        if (res.data.total == 0 ) 
        {
          that.setData({
            isLoad: false
          });
        }else
        {
          that.setData({
            site: that.data.site.concat(res.data.data),
            isLoad: true
          });
          //没有更多了 
          if ( res.data.last_page <= that.data.parameter.page )
          {
            that.setData({
              isLoad: false
            });
          }
        }
      }
    });
  }
})