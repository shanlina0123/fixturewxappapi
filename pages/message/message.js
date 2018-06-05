// pages/message/message.js
const app = getApp();
const Url = require('../../utils/config.js');
const Request = require('../../utils/request.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isread:false,
    msgList:[],
    lengthnone: false,
    msg: '暂无相关数据',
    pages: 1,
    isLoad: true
  },
  isread:function(){
      var that = this;
      if (that.data.isread == false) {
        Request.requestPost(Url.readNotice,{}, function (res) {
          if (res.status == 1) {
            that.setData({
              isread: true
            })
          }
        });
      } 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.msgList();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      msgList: [],
      lengthnone: false,
      msg: '暂无相关数据',
      pages: 1,
      isLoad: true
    });
    this.msgList();
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
      this.msgList();
    }
  },
  msgList: function () {
    var that = this;
    Request.requestGet(Url.logNotice + "?page=" + that.data.pages, function (res) {
      var msgList = that.data.msgList;
      if (res.status == 1) {
        if (res.data.total == 0) {
          that.setData({
            lengthnone: true
          });
        } else {
   
          var data = [];
          res.data.data.forEach(function (v) {
            var obj = {};
            obj.faceimg = v.faceimg;
            obj.content = v.content;
            obj.created_at = util.timeChangeover(v.created_at);
            obj.isread = v.isread;
            obj.id = v.id;
            data.push(obj);
          });
          that.setData({
            msgList: msgList.concat(data)
          })
          if (res.data.last_page <= that.data.pages) {
            that.setData({
              lengthnone: true,
              isLoad: false,
              msg: '没有最新数据了'
            });
          }
        }
      } else {
        wx.showToast({
          title: res.message,
        })
      }
    })
  }, error:function(e){
    var index = e.currentTarget.dataset.index;
    var msgList = this.data.msgList; 
        msgList[index].faceimg ='../../images/uhead.png';
        this.setData({
          msgList: msgList
        })
  }
})