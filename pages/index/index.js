const app = getApp();
const Url = require('../../utils/config.js');
const Request = require('../../utils/request.js')
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshow:false,
    inputisshow:false,
    data:[],
    page:1,
    commentData:{},
    isLoad:true,
    imgUrl: Url.imgUrl,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var page = that.data.page;
    Request.requestGet(Url.cIndex + '?page=' + page, function (res) {
     // console.log( res );
      if (res.status==1){
        var data = that.data.data;
        var arr = [];
        res.data.data.forEach(function(v){
          var obj = {};
          if (v.dynamic_to_user){
            obj.faceimg = v.dynamic_to_user.faceimg;
            obj.nickname = v.dynamic_to_user.nickname;
            if (v.dynamic_to_user.user_to_position){
              obj.uposition = v.dynamic_to_user.user_to_position.name;
            }else{
              obj.uposition = '';
            }
          }else{
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
          }else {
            obj.thumbsupnum=0,
            obj.commentnum =0;
          }
          obj.images = v.dynamic_to_images;
          obj.follo = v.dynamic_to_follo;
          obj.title = v.title;
          obj.type = v.type;
          obj.sitetid = v.sitetid;
          obj.id = v.id;
          obj.sitestagename = v.sitestagename;
          arr.push(obj);
        });
        that.setData({
          data: data.concat(arr)
        });
        //不在加载分页
        if (res.data.last_page <= page){
          that.setData({
            isLoad:false
          })
        }
      }else{
        wx.showToast({
          title: res.messages,
          icon: 'none',
        })
      }
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      isshow: false,
      inputisshow: false,
      data: [],
      page: 1,
      commentData: {},
      isLoad: true,
      commentV:''
    });
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoad){
      var page = this.data.page;
      this.setData({
        page: parseInt(page) + 1
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  /**
   * 显示点赞和评论按钮 
   */
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
  /**
   * 点击评论显示评论输入框 
   */
  showinput: function (e) {
    var that = this;
    var dynamicid = parseInt(e.currentTarget.dataset.id);
    var siteid = parseInt(e.currentTarget.dataset.sitetid);
    var index = parseInt(e.currentTarget.dataset.index);
    var replyuserid = 0;
    var commentData = { "dynamicid": dynamicid, "siteid": siteid, "replyuserid": replyuserid, "index": index };
    if (!that.data.inputisshow) {
      that.setData({
        inputisshow: true,
        isshow: false,
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
          icon: 'success',
          duration: 2000
        })
        //跟新数据
        var data = that.data.data;
        var obj = { id: wx.getStorageSync('userInfo').id, nickname: wx.getStorageSync('userInfo').nickname };
        var folloData = res.data;
            folloData.dynamic_comment_to_user = obj;
            //判断有没有回复人
            if (typeof commentData.replyuserid && commentData.replyuserid )
            {
              folloData.dynamic_comment_to_reply_user = commentData.replyuser;
            }
            data[index].follo.push(folloData);
            that.setData({
              data: data,
              commentData:{},
              commentV:''
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
  fabulous: function (e){
    var that= this;
    var dynamicid = parseInt(e.currentTarget.dataset.id);
    var sitetid = parseInt(e.currentTarget.dataset.sitetid);
    var index = parseInt(e.currentTarget.dataset.index);
    var obj = { "dynamicid": dynamicid, "siteid": sitetid };
    Request.requestPost(Url.fabulous, obj,function (res) {
      if ( res.status == 1 ){
        wx.showToast({
          title: res.messages,
          icon: 'success',
          duration: 2000
        })
        //跟新数据
        var data = that.data.data;
            data[index].thumbsupnum = parseInt(data[index].thumbsupnum)+1;
            that.setData({
              data: data
            });
      }
    });
    that.setData({
      isshow: false
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
    var times = parseInt(that.touchEndTime) - parseInt(that.touchStartTime);
    if (times < 350){
      that.setData({
        inputisshow: true
      });
      //评论
      var commentData = { "dynamicid": dynamicid, "siteid": id, "replyuserid": replyuser.id, "index": pindex, "replyuser": replyuser };
      that.setData({
        commentData: commentData
      })
    } else{
      that.setData({ inputisshow: false });
      wx.showModal({
        title: '确认删除吗？',
        success: function (res) {
          if (res.confirm) {
            //用户点击确定
            var obj = { "dynamicid": dynamicid, "id": id };
            Request.requestDelete(Url.commentDestroy, obj, function (res) {
              if (res.status == 1){
                  wx.showToast({
                    title: res.messages,
                    icon: 'success',
                    duration: 2000
                  })
                //跟新数据
                var data = that.data.data;
                data[pindex].follo.splice(index,1)
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
})
