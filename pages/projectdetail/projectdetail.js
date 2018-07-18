// pages/usercenter/project/projectdetail.js
const app = getApp();
const Url = require('../../utils/config.js');
const Request = require('../../utils/request.js')
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focustext:"关注",
    selected1: true,
    selected2: false,
    selected3: false,
    on: "check",
    hide: 'hide',
    siteInfo:{},
    imgUrl: Url.imgUrl,
    data:[],
    inputisshow: false,
    commentData: {},
    companyData:{},
    company:{},
    isview:true,//页面内容显示
    userType: 0,//用户身份
    handelshow:false,//编辑显示状态
    deleteitem:{},//删除动态
    item: '',//动态信息
    name_focus: false//评论焦点
  },
  /**关注项目按钮 */
  changeName:function(e){
      var that = this;
      var storeid = e.currentTarget.dataset.storeid;
      var siteid = e.currentTarget.dataset.siteid;
      var cityid = e.currentTarget.dataset.cityid;
      var obj = { "storeid": storeid, "siteid": siteid, "cityid": cityid};
      Request.requestPost(Url.recordSite,obj, function (res) {
        if (res.status==1){
          var siteInfo = that.data.siteInfo;
              siteInfo.siteToFolloWrecord = 1;
          that.setData({
            siteInfo: siteInfo
          });
          wx.showToast({ title: '关注成功'});
        }
      });
  },
  /**切换效果 */
  tab1: function (e) {
      var that = this;
      that.setData({
          selected1: true,
          selected2: false,
          selected3: false,
      })
  },
  tab2: function (e) {
      var that = this;
      that.setData({
          selected1: false,
          selected2: true,
          selected3: false,
      })
  },
  tab3: function (e) {
      var that = this;
      that.setData({
          selected1: false,
          selected2: false,
          selected3: true,
      })
  },
  /**显示点赞和评论按钮 */
  showimage: function (e) {
      var that = this;
      if (!that.data.isshow) {
          that.setData({
              isshow: true
          })
      } else {
          that.setData({
              isshow: false
          })
      }
  },
  
  /**关闭输入框 */
  closeinput: function () {
      this.setData({
          inputisshow: false
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options)
  {
    var that = this;
    var userinfo = wx.getStorageSync('userInfo');
    if (userinfo) {
      //判断用户状态B端还是C端
      that.setData({
        userType: userinfo.type,
      });
    }
    if ( options.scene )
    {
      var scene = decodeURIComponent(options.scene);
      var id = scene;
    }else
    {
      var id = options.id;
    }  
    this.getSiteInfo(id);
    this.getDynamic(id);
    //this.getCompanyInfo();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  //详情
  getSiteInfo:function(id)
  {
    var that = this;
    Request.requestGet(Url.siteInfo+'?id='+id, function (res) {
      if (res.status == 1) {
        var data = res.data;
        if ( data.explodedossurl ){
          data.explodedossurl = that.data.imgUrl + data.explodedossurl;
        }else{
          data.explodedossurl = that.data.imgUrl + 'default/wx/default.jpg';
        }
        that.setData({
          siteInfo: data
        });
      } else {
        wx.showToast({
          title: res.messages,
        })
        that.setData({
          isview:false
        });
      }
    });
  },
  //动态
  getDynamic: function (id){
    var that = this;
    Request.requestGet(Url.siteDynamic + '?id=' + id, function (res) {
      if (res.status == 1)
       {
        var arr = [];
        res.data.forEach(function (v) {
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
          obj.images = [];
          obj.video = [];
          v.dynamic_to_images.forEach(function (v) {
            if (v.type == 0) {
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
          data: arr
        });
      } else {
        wx.showToast({
          title: res.message,
        })
      }
    });
  },
  /**
   * 显示点赞和评论按钮 
   */
  showimage: function (e) {
    var that = this;
    if (that.data.isshow == e.currentTarget.dataset.id){
      that.setData({
        isshow: 'no'
      });
    }else{
      that.setData({
        isshow: e.currentTarget.dataset.id
      });
    }
  },
  /**
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
    if (!that.data.inputisshow) {
      that.setData({
        inputisshow: true,
        isshow: 'no',
        commentData: commentData,
        name_focus: true
      })
    } else {
      that.setData({
        inputisshow: false,
        name_focus: false
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
    //console.log(commentData);
    Request.requestPost(Url.commentAdd, commentData, function (res) {
      if (res.status == 1) {
        wx.showToast({
          title: res.messages,
          icon: 'success',
          duration: 2000
        })
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
        data[index].commentnum = data[index].commentnum ? parseInt(data[index].commentnum) + 1 : 0;
        that.setData({
          data: data,
          commentData: {},
          commentV: ''
        })
      }
    });
  },
  /**
   * 点赞
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
      if (res.status == 1) {
        wx.showToast({
          title: res.messages,
          icon: 'success'
        });
        //跟新数据
        var data = that.data.data;
        data[index].thumbsupnum = fabuloustype == 1 ? parseInt(data[index].thumbsupnum) + 1 : parseInt(data[index].thumbsupnum) ? parseInt(data[index].thumbsupnum) - 1 : 0;
        data[index].give = fabuloustype == 1 ? 1 : 0;
        that.setData({
          data: data
        });
      }
    });
  },
  //触摸开始时间
  touchStartTime: 0,
  // 触摸结束时间
  touchEndTime: 0,
  /// 按钮触摸开始触发的事件
  mytouchstart: function (e) {
    this.touchStartTime = e.timeStamp
  },
  // 按钮触摸结束触发的事件
  mytouchend: function (e) {
    this.touchEndTime = e.timeStamp
  },
  /**
   * 删除和评论
   */
  backtext: function (e) {
    var that = this;
    var dynamicid = e.currentTarget.dataset.dynamicid;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var pindex = e.currentTarget.dataset.pindex;
    var replyuser = e.currentTarget.dataset.user;
    var name = e.currentTarget.dataset.name;
    var times = parseInt(that.touchEndTime) - parseInt(that.touchStartTime);
    var createuserid = e.currentTarget.dataset.createuserid;
    if (times < 350 && createuserid != wx.getStorageSync('userInfo').id) {
      that.setData({
        inputisshow: true
      });
      //评论
      var commentData = { 
                          "dynamicid": dynamicid, 
                          "siteid": id, 
                          "replyuserid": replyuser.id, 
                          "index": pindex, 
                          "replyuser": replyuser, 
                          "name": name };
      that.setData({
        commentData: commentData
      })
    } else {
      if (createuserid != wx.getStorageSync('userInfo').id){
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
                  icon: 'success',
                  duration: 2000
                })
                //跟新数据
                var data = that.data.data;
                    data[pindex].follo.splice(index, 1)
                    that.setData({data: data})
              }
            });
          }
        }
      })
    }
  },
  getCompanyInfo: function () {
    var that = this;
    Request.requestGet(Url.companyInfo, function (res) {
      if (res.status == 1) {
        var data = res.data;
            data.logo = that.data.imgUrl + data.logo;
            that.setData({
              companyData: data,
              company: JSON.stringify(res.data)
            })
      }
    });
  }, 
  /**
   * 图片预览
   */
  getImg:function(e)
  {
    var that = this;
    var img = e.currentTarget.dataset.src;
    var urls = e.currentTarget.dataset.img;
    var arr = [];
    urls.forEach(function (v) {
      arr.push(that.data.imgUrl+v.ossurl);
    });
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  /**
   * 编辑动态项目显示
   */
  handelmsg: function (e) {
    var id = e.currentTarget.dataset.id
    var pindex = e.currentTarget.dataset.pindex;
    var dtype = e.currentTarget.dataset.dtype;
    this.setData({
      handelshow: !this.data.handelshow,
      deleteitem: { "id": id, "index": pindex, "dtype": dtype}
    })
  },
  /**
   * 编辑动态项目显示取消
   */
  cancelmsg:function()
  {
    this.setData({
      handelshow:false
    })
  },
  /**
   * 删除动态
   */
  deleteDynamic: function () {
    var that = this;
    var deleteitem = that.data.deleteitem;
    var pindex = deleteitem.pindex;
    var obj = { id: deleteitem.id };
    Request.requestDelete(Url.dynamicDestroy, obj, function (res) {
      if (res.status == 1) {
        wx.showToast({
          title: res.messages,
          icon: 'success'
        });
        var data = that.data.data;
        data.splice(pindex, 1);
        that.setData({
          data: data,
          handelshow: false
        })
      }
    });
  },
  /**
   * 关闭底部
   */
  colFoot:function()
  {
    this.setData({
      handelshow: false
    })
  },
  /**
   * 删除工地成员
   */
  delInvitation:function(e)
  {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '确认删除吗？',
      success: function (res) {
        if (res.confirm) {
          //用户点击确定
          var obj = { "siteid": item.siteid, "joinuserid": item.joinuserid };
          Request.requestDelete(Url.participantDel, obj, function (res) {
            if (res.status == 1) {
              wx.showToast({
                title: res.messages,
                icon: 'success',
                duration: 2000
              })
              //跟新数据
              var data = that.data.siteInfo;
              data.siteInvitation.splice(index, 1)
              that.setData({ siteInfo: data })
            }
          });
        }
      }
    });
  },
  /**
   * 跳到消息页面
   */
  message:function()
  {
    var user = this.data.siteInfo.site_to_user;
    var username = user.jguser;
    var nickname = user.nickname ? user.nickname : user.jguser;
    var youHead = user.faceimg ? user.faceimg :'../../../images/uhead.png';
    var urlP = "username="+username+'&nickname='+nickname+'&faceimg='+youHead+'&createuserid='+user.id;
    wx.navigateTo({
      url: "/pages/jmessage/jmessageinfo/jmessageinfo?" + urlP
    })
  },
  /**
   * 视频详情
   */
  videoInfo: function (e) {
    var item = e.currentTarget.dataset.item;
    this.setData({
      item: item
    });
    wx.navigateTo({
      url: '/pages/videos/videos'
    })
  },
  /**
  * 评论失去焦点
  */
  commentBlur: function () {
    this.setData({
      inputisshow: false,
    })
  }
})