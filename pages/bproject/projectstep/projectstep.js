const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    template:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTep();
  },
  getTep:function(){
    var that = this;
    Request.requestPost(Url.defaultTemplate, {}, function (res) {
      if (res.status == 1) {
        console.log(res);
        that.setData({
          template: res.data
        });
      }
    });
  },
  setTemplate:function(e)
  {
    var that = this;
    var template = that.data.template;
    var item = e.currentTarget.dataset.item;
        item.stagetemplateid = template.id;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var info = prevPage.data //取上页data里的数据也可以修改
        console.log(pages.length);
        prevPage.setData({
          template: item
        });
        wx.navigateBack({
          delta: 1
        })
  }
})
