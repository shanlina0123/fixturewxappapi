// pages/message/asklist/asklist.js
const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
const Jg = require('../../../utils/jmessage.js');
const JIM = require('../../../utils/jmessage.js').JIM;

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
  /**
   * 判断初始化
   */
  var coonnect = JIM.isConnect();
  if (coonnect == false) {
    //初始化
    Jg.getjmessageInit();

  } else {
    var isLogin = JIM.isLogin();
    if (isLogin == false) {
      var user = wx.getStorageSync('userInfo');
      var username = user.jguser;
      var password = user.jmessagePass
      Jg.jmessageLogin(username, password);
    }
  }
  var that = this;
  Request.requestGet(Url.jmessageFriendList, function (res) {
    if (res.status == 1) {
      var arr = [];
      var data = res.data;
      data.forEach(function (v) {
        var obj = v;
        var k = 'jmess' + v.username;
        var content = wx.getStorageSync(k);
        if (content) {
          content = content[content.length - 1].content;
        }
        obj.content = content;
        arr.push(obj);

      });
      that.setData({
        user: arr
      });
    }
  })

    // JIM.getConversation().onSuccess(function (data) {
    //   if (data.code == 0) {
    //     var UserList = data.conversations;
    //     var user = [];
    //     UserList.forEach(function (v) {
    //       var obj = {};
    //       obj.username = v.username;
    //       obj.nickname = v.nickName;
    //       obj.faceimg = v.extras.faceimg;
    //       user.push(obj);
    //     });
    //     that.setData({
    //       user: user
    //     });
    //   }
    // }).onFail(function (data) {
    //   //data.code 返回码
    //   //data.message 描述
    // });

  },
})