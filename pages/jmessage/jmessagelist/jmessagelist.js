const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
const Jg = require('../../../utils/jmessage.js');
const JIM = require('../../../utils/jmessage.js').JIM;
/**
   * 判断初始化
   */
var coonnect = JIM.isConnect();
if (coonnect == false) {
  //初始化
  Jg.getjmessageInit();
}else
{
  var isLogin = JIM.isLogin();
  if (isLogin == false) {
    var user = wx.getStorageSync('userInfo');
    var username = user.jguser;
    var password = user.jmessagePass
    Jg.jmessageLogin(username, password);
  }
}

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
    var k = 'jmess' + e.currentTarget.dataset.username;
    var data = this.data.user;
    if (data[index].content)
    {
      data[index].content.read = false;
      this.setData({
        user: data
      });
      var content = wx.getStorageSync(k);
          content[content.length - 1].content.read = false;
          wx.setStorageSync(k,content);
    }    
  }
})