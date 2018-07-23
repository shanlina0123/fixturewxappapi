const app = getApp();
const Url = require('../../utils/config.js');
const Request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
     id:"",//工地ID
     siteInfo:'',//工地数据
     bit: [{ 'value': 1 }, { 'value': 2 }, { 'value': 3 }, { 'value': 4 }, { 'value': 5 }],//星星数据
     choice:0,//选择的个数
     contentText:300,
     num:0,
     isubmit:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if ( options.id )
    {
      //页面进入
      var id = options.id;
      that.setData({
        id: options.id
      });
    }
    that.getEvaluateInfo(id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 评价详情
   */
  getEvaluateInfo:function(id){
    var that = this;
    Request.requestGet(Url.evaluateInfo + '?id=' + id, function (res) {
     if( res.status == 1 )
     {
       that.setData({
         siteInfo:res.data
       });
     }
    });
  },
  /**
   * 选择星星
   */
  choiceBit:function(e)
  {
    var choice = e.currentTarget.dataset.value;
    this.setData({
      choice: choice
    });   
  },
  /**
   * 文本框
   */
  bindinput:function(e)
  {
    var num = e.detail.cursor;
    this.setData({
      num: num
    });
  },
  /**
   * 单选按钮
   */
  bindchange:function(e)
  {
    console.log(e);
  },
  /**
   * 提交评论
   */
  formSubmit:function(e)
  { 
    var that = this;
    var value = e.detail.value;
    var choice = that.data.choice;
    if ( that.data.isubmit === true )
    {
        return;
    }

    if ( !value.radio )
    {
      wx.showToast({ title: '请选择评论的阶段', icon: 'none'});
      return;
    }

    if (!choice) {
      wx.showToast({ title: '请选择星级', icon: 'none' });
      return;
    }

    if (!value.content) {
      wx.showToast({ title: '请填写评价内容', icon: 'none' });
      return;
    }
    var obj = {
      siteid: that.data.id,
      sitestageid:value.radio.split(',')[0],
      sitestagename: value.radio.split(',')[1],
      score: choice,
      content: value.content
    };
    that.setData({
      isubmit: true
    });
    Request.requestPost(Url.ownerEvaluate,obj,function (res) {
      if (res.status==1)
      {
        wx.showToast({
          title: res.messages,
          success: function () {
            wx.reLaunch({
              url: '/pages/projectdetail/projectdetail?id=' + that.data.id +'&tab=2'
            })
          }
        });
      }else
      {
        that.setData({
          isubmit: false
        });
      }
    })
  }
})