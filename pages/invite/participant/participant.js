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
    Request.requestGet(Url.participantList, function (res) {
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
  /**
   * 删除工地成员
   */
  delInvitation: function (e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '确认删除吗？',
      success: function (res) {
        if (res.confirm) {
          //用户点击确定
          var obj = {
            "siteid": item.siteid,
            "joinuserid": item.joinuserid
          };
          Request.requestDelete(Url.participantDel, obj, function (res) {
            if (res.status == 1) {
              wx.showToast({
                title: res.messages,
                icon: 'success',
                duration: 2000
              })
              //跟新数据
              var data = that.data.data;
                  data.splice(index, 1)
                  that.setData({
                    data: data
                  })
            }
          });
        }
      }
    });
  },
})
