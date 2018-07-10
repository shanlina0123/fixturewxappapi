const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     user:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) 
  {
  
    var that = this;
    Request.requestGet(Url.jmessageFriendList, function (res) {
      if (res.status == 1) {
        var arr = [];
        var data = res.data;
        data.forEach(function (v) {
          var obj = v;
          var k = 'jmess' + v.username;
          var content = wx.getStorageSync(k);
          if (content)
           {
            content = content[content.length - 1].content;
            obj.content = { 'text': content.text, 'read': content.read };
          }else
          {
            obj.content = { 'text':'', 'read':false };
          }
          arr.push(obj);
        });
        that.setData({
          user: arr
        });
      }
    })
  },
  /**
   * 修改读取数据状态
   */
  upReadStaus:function(e)
  {
    var index = e.currentTarget.dataset.index;
    var k = 'jmess'+e.currentTarget.dataset.username;
    var contentstorage = wx.getStorageSync(k);
    var data = this.data.user;
    if (lastContent)
    {
      if (data[index].content)
      {  
        var oneData = data[index].content;
            oneData.read = false;
            data[index] = oneData;
        this.setData({
          user: data
        });
        var lastContent= contentstorage[contentstorage.length - 1].content;
            lastContent.read = false
            contentstorage[contentstorage.length - 1] = lastContent;
            wx.setStorageSync(k, contentstorage);
        }
      } 
    }
})