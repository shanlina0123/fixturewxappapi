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
    company:{}
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
          var siteInfo = that.data.siteInfo
              siteInfo.siteToFolloWrecord = 1;
          that.setData({
            siteInfo: siteInfo
          });
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
  /**点击评论显示评论输入框 */
  showinput: function () {
      var that = this;
      if (!that.data.inputisshow) {
          that.setData({
              inputisshow: true,
              isshow: false
          })
      } else {
          that.setData({
              inputisshow: false
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
  onLoad: function (options) {
    var id = options.id;
    this.getSiteInfo(id);
    this.getDynamic(id);
    this.getCompanyInfo();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
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
        console.log(res);
      } else {
        wx.showToast({
          title: res.message,
        })
      }
    });
  },
  //动态
  getDynamic: function (id){
    var that = this;
    Request.requestGet(Url.siteDynamic + '?id=' + id, function (res) {
      if (res.status == 1) {
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
    var dynamicid = parseInt(e.currentTarget.dataset.id);
    var siteid = parseInt(e.currentTarget.dataset.sitetid);
    var index = parseInt(e.currentTarget.dataset.index);
    var name = e.currentTarget.dataset.name;
    var createuserid = parseInt(e.currentTarget.dataset.createuserid);
    var replyuserid = 0;
    var commentData = { "dynamicid": dynamicid, "siteid": siteid, "replyuserid": replyuserid, "index": index, "name": name, "createuserid": createuserid };
    //console.log(commentData);
    if (!that.data.inputisshow) {
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
    console.log(commentData);
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
        that.setData({
          data: data,
          commentData: {},
          commentV: ''
        })
      } else {
        wx.showToast({
          title: res.messages,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  /**
   * 点赞
   */
  fabulous: function (e) {
    var that = this;
    var dynamicid = parseInt(e.currentTarget.dataset.id);
    var sitetid = parseInt(e.currentTarget.dataset.sitetid);
    var index = parseInt(e.currentTarget.dataset.index);
    var name = e.currentTarget.dataset.name;
    var createuserid = parseInt(e.currentTarget.dataset.createuserid);
    var obj = { "dynamicid": dynamicid, "siteid": sitetid, "name": name, "createuserid": createuserid };
    Request.requestPost(Url.fabulous, obj, function (res) {
      if (res.status == 1) {
        wx.showToast({
          title: res.messages,
          icon: 'success',
          duration: 2000
        })
        //跟新数据
        var data = that.data.data;
        data[index].thumbsupnum = parseInt(data[index].thumbsupnum) + 1;
        that.setData({
          data: data
        });
      }
    });
    that.setData({
      isshow: 'no'
    })
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
    if (times < 350) {
      that.setData({
        inputisshow: true
      });
      //评论
      var commentData = { "dynamicid": dynamicid, "siteid": id, "replyuserid": replyuser.id, "index": pindex, "replyuser": replyuser, "name": name };
      that.setData({
        commentData: commentData
      })
    } else {
      var createuserid = e.currentTarget.dataset.createuserid;
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
                that.setData({
                  data: data
                })
              } else {
                wx.showToast({
                  title: res.messages,
                  icon: 'none',
                  duration: 2000
                })
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
  }
})