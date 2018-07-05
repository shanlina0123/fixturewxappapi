const app = getApp();
const Url = require('../../../utils/config.js');
const Jg = require('../../../utils/jmessage.js');
const JIM = require('../../../utils/jmessage.js').JIM;
const Request = require('../../../utils/request.js');
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
    var obj = {
      'vclass': 'othermsg',
      'imgclass': 'fl',
      'misvclass': 'othertext',
      'content': messages[i].content.msg_body.text,
      'textclass': "othertragle",
      'faceimg': messages[i].content.msg_body.extras.faceimg,
    };
    if( infoSt )
    {
      infoSt.push(obj);
    }else
    {
      infoSt=[];
      infoSt.push(obj);
    }
    
    wx.setStorageSync(k,infoSt);
    //设置当前页面信息
    if (username == prevPage.data.username)
    {
      //设置当前页数据
      info.push(obj);
      prevPage.setData({
        data: info
      });
    }
  }
});
//离线消息
JIM.onSyncConversation(function (data) {
  console.log(data);
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
            'content': v.content.msg_body.text,
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
        title: options.nickname
      })
    that.setData({ 
      username: username,
      youHead: options.faceimg,
      nickname: options.nickname
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
      Request.requestPost(Url.jmessageFriendAdd, { 'username':username},function(){});
    }

  },
  /**
   * 发送消息
   */
  SingleMsg:function(e)
  {
    var that = this;
    var content = e.detail.value.content;
    if (content == false)
    {
      return;
    }
    var username = this.data.username;
    var obj = {'username': username, 'content': content};
        that.sendSingleMsg(obj);
        var k = 'jmess' + username;
        var msgData = wx.getStorageSync(k);
        var objData = { 
            'vclass': 'minemsg',
            'imgclass':'fr',
            'misvclass':'minetext',
            'content': content, 
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
    var isLogin = JIM.isLogin();
    JIM.sendSingleMsg({
      'target_username': obj.username,
      'content': obj.content,
      'extras':{'faceimg': wx.getStorageSync('userInfo').faceimg}
    }).onSuccess(function (data, msg) {
      if (data.code != 0) 
      {
        Jg.showToast('发送失败');
      }
    }).onFail(function (data) {
       Jg.showToast('发送失败');
    });
  }
})

