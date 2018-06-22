const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    template:[]
  },
  /**
   * 返回上一步
   */
  radioChange:function(e)
  {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var info = prevPage.data //取上页data里的数据也可以修改
    var templates = this.data.template;    
    var index = e.currentTarget.dataset.index;
        prevPage.setData({
          template: templates[index]
        });
        wx.navigateBack({ 
            delta: 1
        })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gettemplateList();
  },
  /**
   * 模板列表
   */
  gettemplateList:function()
  {
    var that = this;
    Request.requestPost(Url.templateList, {}, function (res) {
      if (res.status == 1) {
        //console.log(res);
        that.setData({
          template: res.data
        });
      }
    });
  },
  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    this.setData({
      template: []
    });
    this.gettemplateList();
    wx.stopPullDownRefresh();
  },
  /**
   * 设为默认
   */
  setTempate:function(e)
  {
    var that = this;
    var id = e.currentTarget.dataset.id;
    Request.requestPost(Url.templateSet, {id:id}, function (res) {
      if (res.status == 1) 
      {
        wx.showToast({
          title: res.messages,
          icon: 'success',
          duration: 2000,
          success:function(){
            setTimeout(function () {
              that.gettemplateList();
            }, 2000) //延迟时间 
          }
        })
      }
    });
  }
})
