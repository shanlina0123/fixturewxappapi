const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js')
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data:{
    data:[],
    siteid:''
  },
  /**
   * 工地添加用户
   */
  adduser:function(e){
    var siteid = this.data.siteid;
   var participant = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../inviteuser/inviteuser?siteid=' + siteid + '&participant=' + participant +'&type=2',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.siteid != undefined)
    {
      var siteid = options.siteid;
      that.setData({
        siteid: siteid
      });
    }else
    {
      var siteid = '';
    }
    Request.requestGet(Url.participantList+'?siteid='+siteid, function (res) {
      if (res.status == 1) 
      {
        that.setData({ data: res.data});
      }
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
})
