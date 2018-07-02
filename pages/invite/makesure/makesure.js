const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js')
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    isadd:'on',
    positionid:''//职位id
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    Request.requestGet(Url.positionList, function (res) {
      if (res.status == 1) {
        that.setData({ data: res.data });
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
   * 添加样式
   */
  addClass:function(e){
    var index = e.currentTarget.dataset.index;
    var positionid = e.currentTarget.dataset.id;
    this.setData({
      isadd: index,
      positionid:positionid
    });
  },
  /**
   * 生成二维码
   */
  codeUrl:function()
  {
    var positionid = this.data.positionid;
    if ( positionid == '' )
    {
      wx.showToast({
        title: '请选择职位',
        icon: "none"
        });
    }
    wx.navigateTo({
      url: '../inviteuser/inviteuser?positionid='+positionid,
    })
  },

  /**
   * 添加职位 
   */
  submitform:function(e)
  {
    var that = this;
    var uname = e.detail.value.name;
    var positionid = that.data.positionid;
    var params = {
      'name': uname,
      'positionid': positionid,
    }
    if (uname == '') {
      wx.showToast({
        title: '请输入姓名',
        icon: "none"
      })
    } else if (positionid=='') {
      wx.showToast({
        title: '请选择职位',
        icon: "none"
      })
    } else {
      Request.requestPost(Url.participantSave, params, function (res) {
        if (res.status == 1) {
          wx.showModal({
            title: '提示',
            content: res.messages,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];  //上一个页面
                    prevPage.onLoad({"siteid":''});
                    wx.navigateBack({
                      delta: 1
                    })
              }
            }
          });
        }
      })
    }
  }
})
