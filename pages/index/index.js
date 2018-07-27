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
    commentData: {},//评论数据
    isLoad: true,//分页开关
    imgUrl: Url.imgUrl,//图片地址
    companyData: {},//公司信息
    userType:0,//用户身份
    userinfo:{},//用户信息
    item:'',//动态信息
    name_focus:false,//评论焦点
    lucky:[]//抽奖列表
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
          if (v.dynamic_to_statistics) 
          {
            obj.thumbsupnum = v.dynamic_to_statistics.thumbsupnum;
            obj.commentnum = v.dynamic_to_statistics.commentnum;
          } else {
            obj.thumbsupnum = 0,
              obj.commentnum = 0;
          }
          obj.images = [];
          obj.video = [];
          v.dynamic_to_images.forEach(function (v){
            if ( v.type==0 )
            {
              obj.images.push(v);
            }
            if (v.type == 1) {
              obj.video.push(v);
            }
          });
          obj.imgnumber = obj.images.length + obj.video.length;
          obj.follo = v.dynamic_to_follo;
          obj.title = v.title;
          obj.type = v.type;
          obj.sitetid = v.sitetid;
          obj.id = v.id;
          obj.sitestagename = v.sitestagename;
          obj.createuserid = v.createuserid;
          obj.give = v.dynamic_to_give;
          arr.push(obj);
        });
        that.setData({
          data: data.concat(arr),
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
    //公司信息
    that.getCompanyInfo();
    //抽奖信息
    that.getluckyDrawList();
    
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
      commentV: '',
      companyData:{},
      item:'',
      name_focus: false,
      lucky:[]
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
    var commentData = {  
                        "dynamicid": dynamicid, 
                         "siteid": siteid, 
                         "replyuserid": replyuserid,
                         "index": index, 
                         "name": name, 
                         "createuserid": createuserid 
                      };
    if (!that.data.inputisshow) 
    {
      that.setData({
        inputisshow: true,
        isshow: 'no',
        commentData: commentData,
        name_focus:true
      })
    } else {
      that.setData({
        inputisshow: false,
        name_focus:false
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
        data[index].commentnum = data[index].commentnum ? parseInt(data[index].commentnum)+1:0;
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
    that.setData({ isshow: 'no' });
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
    //类型
    var fabuloustype = e.currentTarget.dataset.fabuloustype;
    var obj = { "dynamicid": dynamicid, "siteid": sitetid, "name": name, "createuserid": createuserid, 'type': fabuloustype };
    Request.requestPost(Url.fabulous, obj, function (res) {
      if (res.status == 1) 
      {
        wx.showToast({
          title: res.messages,
          icon: 'success'
        });
        //跟新数据
        var data = that.data.data;
        data[index].thumbsupnum = fabuloustype == 1 ? parseInt(data[index].thumbsupnum) + 1 : parseInt(data[index].thumbsupnum)?parseInt(data[index].thumbsupnum)-1:0;
        data[index].give = fabuloustype == 1 ?1:0;
        that.setData({
          data: data
        });
      }
    });
  },
  /**
   * 隐藏评论弹窗
   */
  hidComment:function()
  {
    this.setData({
      inputisshow: false,
      isshow: 'no'
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
    var createuserid = e.currentTarget.dataset.createuserid;
    if (times < 350 && createuserid != wx.getStorageSync('userInfo').id) 
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
                data[pindex].commentnum = parseInt(data[pindex].commentnum) ? parseInt(data[pindex].commentnum) - 1 :0;
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
        res.data.logo = that.data.imgUrl + res.data.logo;
        that.setData({
          companyData: res.data
        })
        //设置头
        wx.setNavigationBarTitle({
          title: res.data.applicationName ? res.data.applicationName:'首页'
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
    wx.showModal({
      title: '确认要删除吗？',
      success: function (resdel) 
      {
        if (resdel.confirm)
        {
          Request.requestDelete(Url.dynamicDestroy, obj, function (res) {
            if (res.status == 1) {
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
      }
    })
  },
  /**
   * 视频详情
   */
  videoInfo:function(e){
    var item = e.currentTarget.dataset.item;
    this.setData({
      item: item
    });
    wx.navigateTo({
      url: '/pages/videos/videos'
    })
  },
  /**
   * 图片预览
   */
  getImg: function (e) {
    var that = this;
    var img = e.currentTarget.dataset.src;
    var urls = e.currentTarget.dataset.img;
    var arr = [];
    urls.forEach(function (v) {
      arr.push(that.data.imgUrl + v.ossurl);
    });
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  /**
   * 评论失去焦点
   */
  commentBlur:function()
  {
    this.setData({
      inputisshow: false,
    })
  },
  /**
   * 抽奖列表
   */
  getluckyDrawList:function(){
    var that = this;
    Request.requestGet(Url.luckyDrawList, function (res) {
      if (res.status == 1) 
      {
        that.setData({
          lucky: res.data
        })
      }
    });
  },
  /**
   * 跳转抽奖
   */
  luckyDraw:function(e)
  {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/activity/prize/prize?id='+id
    })
  },
  /**
   * 拨打电话
   */
   phonecall: function (e) {
     var phone = e.currentTarget.dataset.phone;
      wx.makePhoneCall({
        phoneNumber: phone,
      })
  },
})
