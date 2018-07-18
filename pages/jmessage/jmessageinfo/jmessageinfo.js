const app = getApp();
const Url = require('../../../utils/config.js');
const Jg = require('../../../utils/jmessage.js');
const Request = require('../../../utils/request.js');
const JIM = app.globalData.JIM;

//时时消息
JIM.onMsgReceive(function (res) {
  var pages = getCurrentPages();
  var prevPage = pages[pages.length-1]; 
  var info = prevPage.data.data;
  //循环消息
  var messages = res.messages;
  for (var i = 0; i < messages.length;i++)
  {
    var username = messages[i].from_username
    var k = 'jmess' + username;
    var infoSt = wx.getStorageSync(k);
    if (!infoSt)
    {
      infoSt = [];
    }
    //判断读取
    var read = username == prevPage.data.username?false:true;  
    //组合数据
    var obj = {
      'vclass': 'othermsg',
      'imgclass': 'fl',
      'misvclass': 'othertext',
      'content': { 'text': messages[i].content.msg_body.text, 'read': read},
      'textclass': "othertragle",
      'faceimg': messages[i].content.msg_body.extras.faceimg,
    };
    //写数据
    infoSt.push(obj);
    //设置缓存
    wx.setStorageSync(k,infoSt);
    //设置当前页面信息
    if ( username == prevPage.data.username)
    {
      //设置当前页数据
      info.push(obj);
      prevPage.setData({
        data: info
      });
    }
  }
  //设置会话列表数据
  if (prevPage.route == 'pages/jmessage/jmessagelist/jmessagelist') {
    //说明停留在了列表页
    var msg = messages[messages.length - 1];
    //会话的缓存K
    var listk = 'jmess' + msg.from_username;
    //列表数据
    var Listinfo = prevPage.data.user;
    var username = msg.from_username;
    var obj = {
      'username': username,
      'nickname': msg.content.from_name,
      'faceimg': msg.content.msg_body.extras.faceimg,
      'content': { 'text': msg.content.msg_body.text, 'read': true },
    };
    
    //会话列表有这个人了
    if (wx.getStorageSync(listk)) {
      //改变列表数据
      var arr = [];
      Listinfo.forEach(function (v) {
        if (v.username == username) {
          arr.push(obj);
        } else {
          arr.push(v);
        }
      });
      //设置数据
      prevPage.setData({
        user: arr
      });
    } else {
      //添加列表数据
      Listinfo.push(obj);
      prevPage.setData({
        user: Listinfo
      });
    }
  }
  //显示红点
  wx.showTabBarRedDot({
    index:1
  });
});
//离线消息
JIM.onSyncConversation(function (data) {
  data.forEach(function(v){
    var username = v.from_username
    var k = 'jmess' + username;
    var infoSt = wx.getStorageSync(k);
    var messages = v.msgs;
        messages.forEach(function (v) {
          var obj = {
            'vclass': 'othermsg',
            'imgclass': 'fl',
            'misvclass': 'othertext',
            'content': { 'text': v.content.msg_body.text, 'read':true},
            'textclass': "othertragle",
            'faceimg':v.content.msg_body.extras.faceimg,
          };
          if (infoSt) 
          {
            infoSt.push(obj);
          } else 
          {
            infoSt = [];
            infoSt.push(obj);
          }
        });
        wx.setStorageSync(k, infoSt);
  });
  //显示红点
  wx.showTabBarRedDot({
    index: 1
  });
});

Page({
  /**
   * 页面的初始数据
   */
  data:
  {
    data:[],//聊天记录
    username:'',//用户名称
    content:'',//发送内容
    myHead:'',//我的用户头像
    youHead:'',//ta的头像
    title:'',//聊天对象
    createuserid:''//创建工地的用户
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this;
    var username = options.username;
        that.setData({
          myHead: wx.getStorageSync('userInfo').faceimg
        });
      wx.setNavigationBarTitle({
        title: String(options.nickname)
      })
    that.setData({ 
      username: username,
      youHead: options.faceimg,
      nickname: options.nickname,
      createuserid: options.createuserid ? options.createuserid:''
    });
    var k = 'jmess'+username;
    var data = wx.getStorageSync(k);
    if( data )
    {
      that.setData({
        data: data
      });
    }else
    {
      //添加为好友
      Request.requestPost(Url.jmessageFriendAdd, { 'username':username},function(res){});
    }
  },
  /**
   * 发送消息
   */
  SingleMsg:function(e)
  {
    var that = this;
        that.pageScrollToBottom();
    var content = e.detail.value.content;
    if (content == false)
    {
      return;
    }
    var username = that.data.username;
    var obj = {'username': username, 'content': content};
        that.sendSingleMsg(obj);
        var k = 'jmess' + username;
        var msgData = wx.getStorageSync(k);
        var objData = { 
            'vclass': 'minemsg',
            'imgclass':'fr',
            'misvclass':'minetext',
            'content': {'text':content,'read':false}, 
            'textclass':"minetragle", 
            'faceimg': that.data.myHead
            };
        if (msgData)
          {
          msgData.push(objData);
        } else 
        {
          msgData = [];
          msgData.push(objData);
        }
        wx.setStorageSync(k, msgData);
        that.setData({
          data: msgData,
          content:''
        });
  },
  /**
    * 发文本消息
   */
  sendSingleMsg:function (obj)
  {
    var that = this;
    //判断链接
    var coonnect = JIM.isConnect();
    if (coonnect)
    {  
      //判断登陆
      var isLogin = JIM.isLogin();
      console.log(obj);
      if ( isLogin ){
        JIM.sendSingleMsg({
          'target_username': obj.username,
          'content': obj.content,
          'extras': { 'faceimg': wx.getStorageSync('userInfo').faceimg }
        }).onSuccess(function (data, msg) {
          if (data.code != 0) 
          {
            Jg.showToast('发送失败');
          }else
          {
            var uid = that.data.createuserid;
            if (uid )
            {
              //如果对方不在线就发微信消息 从工地点滴进来的
              var post = { 'username': obj.username, 'createuserid': uid, 'content': obj.content };
              wx.request({
                url: Url.jmessageFriendTesting,
                method: "POST",
                data: post,
                header: {
                  'content-type': 'application/json',
                  'Authorization': wx.getStorageSync('userInfo').Authorization
                }});
            }
          }
        }).onFail(function (data) {
          Jg.showToast('发送失败');
        });
      }else{
        //登陆
        var user = wx.getStorageSync('userInfo');
        var username = user.jguser;
        var password = user.jmessagePass
        //console.log(username, password);
        JIM.login({
          'username': username,
          'password': password
        }).onSuccess(function (data) {
            app.globalData.JIM = JIM;
            that.sendSingleMsg(obj);
        });
      }
    }else{
      Jg.getjmessageInit();
      Jg.showToast('发送失败');
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onShow: function () {
  },
  /**
  * 生命周期函数--监听页面卸载
  */
  onUnload: function () {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    //设置会话列表数据
    if (prevPage.route == 'pages/jmessage/jmessagelist/jmessagelist') {
      prevPage.onLoad();
    }
  },
  //获取容器高度，使页面滚动到容器底部
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },
  onReady: function () {
    this.pageScrollToBottom();
  },


})

