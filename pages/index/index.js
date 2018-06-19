const app = getApp();
const Url = require('../../utils/config.js');
const Request = require('../../utils/request.js')
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshow: 'no', //评论按钮
    inputisshow: false,//评论框
    data: [],//动态数据
    page: 1,//分页
    commentData:{},//公司信息
    isLoad: true,//分页开关
    imgUrl: Url.imgUrl,//图片地址
    companyData: {},//评论数据
    userType:0,//用户身份
    userinfo:{},//用户信息
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userinfo = wx.getStorageSync('userInfo');
    if (userinfo) 
    {  
      //判断用户状态B端还是C端
      that.setData({
        userType: userinfo.type,
        userinfo: userinfo
      });
    }
    var page = that.data.page;
    Request.requestGet(Url.Index + '?page=' + page, function (res) {
      if (res.status == 1) {
        var data = that.data.data;
        var arr = [];
        res.data.data.forEach(function (v) {
          var obj = {};
          if (v.dynamic_to_user) {
            obj.faceimg = v.dynamic_to_user.faceimg;
            obj.nickname = v.dynamic_to_user.nickname;
            if (v.dynamic_to_user.user_to_position) {
              obj.uposition = v.dynamic_to_user.user_to_position.name;
            } else {
              obj.uposition = '';
            }
          } else {
            obj.faceimg = '';
            obj.nickname = '';
            obj.uposition = '';
          }
          obj.uuid = v.uuid;
          obj.content = v.content;
          obj.created_at = util.timeChangeover(v.created_at);
          if (v.dynamic_to_statistics) {
            obj.thumbsupnum = v.dynamic_to_statistics.thumbsupnum;
            obj.commentnum = v.dynamic_to_statistics.commentnum;
          } else {
            obj.thumbsupnum = 0,
              obj.commentnum = 0;
          }
          obj.images = v.dynamic_to_images;
          obj.follo = v.dynamic_to_follo;
          obj.title = v.title;
          obj.type = v.type;
          obj.sitetid = v.sitetid;
          obj.id = v.id;
          obj.sitestagename = v.sitestagename;
          obj.createuserid = v.createuserid;
          arr.push(obj);
        });
        that.setData({
          data: data.concat(arr)
        });
        //不加载分页
        if (res.data.last_page <= page) {
          that.setData({
            isLoad: false
          })
        }
      } else 
      {
        //获取数据错误
        wx.showToast({
          title: res.messages,
          icon: 'loading',
        })
      }
    });
    that.getCompanyInfo();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      isshow: "no",
      inputisshow: false,
      data: [],
      page: 1,
      commentData: {},
      isLoad: true,
      commentV: ''
    });
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoad) {
      var page = this.data.page;
      this.setData({
        page: parseInt(page) + 1
      });
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage:function(){},
  /**
   * 显示点赞和评论按钮 
   */
  showimage: function (e) {
    var that = this;
    if (that.data.isshow == e.currentTarget.dataset.id) {
      that.setData({
        isshow: 'no'
      });
    } else {
      that.setData({
        isshow: e.currentTarget.dataset.id
      });
    }
  },
  /**
   * B端C端通用
   * 点击评论显示评论输入框 
   */
  showinput: function (e) {
    var that = this;
    //数据
    var item = e.currentTarget.dataset.item;
    //动态id
    var dynamicid = parseInt(item.id);
    //工地id
    var siteid = parseInt(item.sitetid);
    //当前index位置
    var index = parseInt(e.currentTarget.dataset.index);
    //工地名称
    var name = item.title;
    //工地创建者id
    var createuserid = parseInt(item.createuserid);
    var replyuserid = 0;
    var commentData = { "dynamicid": dynamicid, "siteid": siteid, "replyuserid": replyuserid, "index": index, "name": name, "createuserid": createuserid };
    if (!that.data.inputisshow) 
    {
      that.setData({
        inputisshow: true,
        isshow: 'no',
        commentData: commentData
      })
    } else {
      that.setData({
        inputisshow: false
      })
    }
  },
  /**
   * 设置评论内容
   */
  setContent: function (e) {
    var commentData = e.currentTarget.dataset.content;
    commentData.content = e.detail.value;
    this.setData({
      commentData: commentData
    });
  },
  /**
   * 评论
   */
  addComment: function (e) {
    var commentData = e.currentTarget.dataset.content;
    var that = this;
    this.setData({
      inputisshow: false
    });
    var index = commentData.index;
    Request.requestPost(Url.commentAdd, commentData, function (res) {
      if (res.status == 1) {
        wx.showToast({
          title: res.messages,
          icon: 'success'
        });
        //跟新数据
        var data = that.data.data;
        var obj = { id: wx.getStorageSync('userInfo').id, nickname: wx.getStorageSync('userInfo').nickname };
        var folloData = res.data;
        folloData.dynamic_comment_to_user = obj;
        //判断有没有回复人
        if (typeof commentData.replyuserid && commentData.replyuserid) {
          folloData.dynamic_comment_to_reply_user = commentData.replyuser;
        }
        data[index].follo.push(folloData);
        that.setData({
          data: data,
          commentData: {},
          commentV: ''
        })
      }
    });
  },
  /**
   * 点赞 B端C端公用
   */
  fabulous: function (e) {
    var that = this;
    //数据
    var item = e.currentTarget.dataset.item;
    //动态id
    var dynamicid = parseInt(item.id);
    //工地id
    var sitetid = parseInt(item.sitetid);
    //当前index位置
    var index = parseInt(e.currentTarget.dataset.index);
    //工地名称
    var name = item.title;
    //工地创建者id
    var createuserid = parseInt(item.createuserid);
    var obj = { "dynamicid": dynamicid, "siteid": sitetid, "name": name, "createuserid": createuserid };
    Request.requestPost(Url.fabulous, obj, function (res) {
      that.setData({ isshow: 'no' });
      if (res.status == 1) 
      {
        wx.showToast({
          title: res.messages,
          icon: 'success'
        });
        //跟新数据
        var data = that.data.data;
        data[index].thumbsupnum = parseInt(data[index].thumbsupnum) + 1;
        that.setData({
          data: data
        });
      }
    });
  },

  /**
   * 判断是点了还是长按了
   */
  touchStartTime: 0,//触摸开始时间
  touchEndTime: 0,  // 触摸结束时间
  /**
   *  按钮触摸开始触发的事件
   */
  mytouchstart: function (e) {
    this.touchStartTime = e.timeStamp
  },
  /**
   * 按钮触摸结束触发的事件
   */
  mytouchend: function (e) {
    this.touchEndTime = e.timeStamp
  },
  /**
   * 删除和评论
   */
  backtext: function (e) {
    var that = this;
    //动态id
    var dynamicid = e.currentTarget.dataset.dynamicid;
    //评论id
    var id = e.currentTarget.dataset.id;
    //评论的index位置
    var index = e.currentTarget.dataset.index;
    //父的index位置
    var pindex = e.currentTarget.dataset.pindex;
    //评论的用户信息
    var replyuser = e.currentTarget.dataset.user;
    //工地标题
    var name = e.currentTarget.dataset.name;
    //判断点的时间
    var times = parseInt(that.touchEndTime) - parseInt(that.touchStartTime);
    if (times < 350) 
    {
      //调用评论框
      that.setData({
        inputisshow: true
      });
      //评论
      var commentData = { "dynamicid": dynamicid, "siteid": id, "replyuserid": replyuser.id, "index": pindex, "replyuser": replyuser, "name": name };
      that.setData({
        commentData: commentData
      })
    }else 
    {
      //删除
      var createuserid = e.currentTarget.dataset.createuserid;
      if (createuserid != wx.getStorageSync('userInfo').id) {
        return false;
      }
      that.setData({ inputisshow: false });
      wx.showModal({
        title: '确认删除吗？',
        success: function (res) {
          if (res.confirm) {
            //用户点击确定
            var obj = { "dynamicid": dynamicid, "id": id };
            Request.requestDelete(Url.commentDestroy, obj, function (res) {
              if (res.status == 1) {
                wx.showToast({
                  title: res.messages,
                  icon: 'success'
                });
                //跟新数据
                var data = that.data.data;
                data[pindex].follo.splice(index, 1)
                that.setData({
                  data: data
                })
              }
            });
          }
        }
      })
    }
  },
  /**
   * 公司信息
   */
  getCompanyInfo: function () {
    var that = this;
    Request.requestGet(Url.companyInfo, function (res) {
      if (res.status == 1) {
        that.setData({
          companyData: res.data
        })
      }
    });
  },
  /**
   * 删除动态
   */
  deleteDynamic:function(e)
  {
    var that = this;
    var id = e.currentTarget.dataset.id
    var pindex = e.currentTarget.dataset.pindex;
    var obj = {id:id};
    Request.requestDelete(Url.dynamicDestroy,obj,function (res) {
      if (res.status == 1) 
      {
        wx.showToast({
          title: res.messages,
          icon: 'success'
        });
        var data = that.data.data;
            data.splice(pindex, 1);
            that.setData({
              data: data
            })
      }
    });
  }
})
