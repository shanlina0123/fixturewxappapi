const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        switchtype:0,//0在建工地1完工工地 默认0
        construction:[],//在建工地
        complete: [],//完工工地
        page:[1,1],//分页
        lengthnone:[false,false],//显示加载完了数据
        msg: ['暂无数据','暂无数据'],//显示加载完了数据提示语
        isLoad:[true,true],//分页加载
        isRes: [false, false],//请求结果
        imgUrl: Url.imgUrl,
        setshow: false,//设置弹窗
        modalFlag: false,//分享
        modalFlagData: '', //分享数据
        siteData: '',//显示设置弹窗数据
        seachName:'',
        isserach:[false, false]//false代表正常加载 true为搜索
    },
    /**
     * 显示设置弹窗
     */
    showsetting: function (e) {
        var uuid = e.currentTarget.dataset.uuid;
        var id = e.currentTarget.dataset.id;
        var index = e.currentTarget.dataset.index;
        var isopen = e.currentTarget.dataset.isopen;
        this.setData({
          setshow: !this.data.setshow,
          modalFlag:false,
          siteData: { "uuid": uuid, "id": id, "index": index, "isopen": isopen}
        })
    },
    /**
     * 更新按钮
     */
    upSite:function(){
      this.setData({
        modalFlag: false,
        setshow:false
      })
    },
    /**
     * 分享按钮
     */
    modalFlag:function(e){
      var id = e.currentTarget.dataset.id;
      var title = e.currentTarget.dataset.title;
      var img = e.currentTarget.dataset.src;
      var data = { id:id, title:title,img:img};
      this.setData({
        modalFlag: !this.data.modalFlag,
        setshow:false,
        modalFlagData: data
      })
    },
    /**
     * 完善工地
     */
    closepop: function () {
        this.setData({
            setshow: false
        })
    },
    /**
     * 删除工地
     */
    deletepro: function () {
        this.setData({ setshow: false })
        var that = this;
        var siteData = that.data.siteData;
        wx.showModal({
            title: '提示',
            content: '确认删除后数据将无法恢复',
            success: function (res) {
              if (res.confirm) 
              {
                var obj = { uuid: siteData.uuid};
                Request.requestDelete(Url.siteDestroy,obj,function (res) {
                    if( res.status == 1 )
                    {
                      wx.showToast({
                        title: res.messages,
                      });
                      //更新数据
                      if (that.data.switchtype==1)
                      {
                        //完工数据
                        var complete = that.data.complete;
                            complete.splice(siteData.index, 1);
                            that.setData({
                              complete: complete
                            });
                      }else
                      {
                        //在建工地
                        var construction = that.data.construction;
                            construction.splice(siteData.index, 1);
                            that.setData({
                              construction: construction
                            });
                      }
                    }
                });
              }
            }
        })
    },
    /**
     * 删除完工工地
     */
    delcompleteItem:function(e)
    {
      var that = this;
      var uuid = e.currentTarget.dataset.uuid;
      var index = e.currentTarget.dataset.index;
      wx.showModal({
        title: '提示',
        content: '确认删除后数据将无法恢复',
        success: function (res) {
          if (res.confirm) {
            var obj = { uuid: uuid };
            Request.requestDelete(Url.siteDestroy, obj, function (res) {
              if (res.status == 1) {
                wx.showToast({
                  title: res.messages,
                });
                //完工数据
                var complete = that.data.complete;
                    complete.splice(index, 1);
                    that.setData({
                      complete: complete
                    });
              }
            });
          }
        }
      });
    },
    /**
     * 是否公开项目
     */
    switch1Change: function (e)
    {
      this.setData({ setshow: false });
      var that = this;
      var siteData = that.data.siteData;
      var isOpen = e.detail.value;
      if (isOpen == true )
      {
          isOpen = 1;
      }else
      {
          isOpen = 0;
      }
      var obj = { id: siteData.id, "isopen": isOpen };
      Request.requestPut(Url.siteIsOpen,obj, function (res) {
        if (res.status == 1) {
          wx.showToast({
            title: res.messages,
          });
          //更新数据
          if (that.data.switchtype == 1) {
            //完工数据
            var complete = that.data.complete;
                complete[siteData.index].isopen = isOpen;
                that.setData({
                  complete: complete
                });
          } else {
            //在建工地
            var construction = that.data.construction;
                construction[siteData.index].isopen = isOpen;
                that.setData({
                  construction: construction
                });
          }

        }
      });
    },
    /**
     * 设置完工
     */
    overpro: function () {
      this.setData({ setshow: false })
      var that = this;
      var siteData = that.data.siteData;
      var obj = { id: siteData.id };
      wx.showModal({
        title: '提示',
        content: '确认完工后项目无法继续进行更新编辑，您确认设置完工吗？',
        success: function (res) {
          if (res.confirm) {
            Request.requestPut(Url.siteIsFinish, obj, function (res) {
              if (res.status == 1) {
                wx.showToast({
                  title: res.messages,
                });
                //更新数据
                if (that.data.switchtype == 1) {
                  //完工数据
                  var complete = that.data.complete;
                  complete.splice(siteData.index, 1);
                  that.setData({
                    complete: complete
                  });
                } else {
                  //在建工地
                  var construction = that.data.construction;
                  construction.splice(siteData.index, 1);
                  that.setData({
                    construction: construction
                  });
                }
              }
            });
          }
        }
      });
    },
    /**
     * 切换列表状态
     */
    shownow: function (e) {
      var switchtype = e.currentTarget.dataset.isfinish;
      var dataSwitch = this.data.switchtype;
      if ( dataSwitch != switchtype )
      {
        this.setData({
          switchtype: switchtype,
        });
        if (this.data.isRes[switchtype] == false)
        {
          this.getSiteList();
        }
      }
      
    },
    //分享给微信好友
    onShareAppMessage: function (res) {
      var that = this;
      var data = that.data.modalFlagData;
        if (res.from === 'button') {
            // 来自页面内转发按钮
        }
        return {
            title: data.title,
            path: "/pages/projectdetail/projectdetail?id=" + data.id,
            imageUrl: data.img
        }
    },
    //显示永久二维码
    showerweima: function () {
        this.setData({
            modalFlag: false
        })
    },
    //隐藏永久二维弹窗
    modalOk: function () {
        this.setData({
            modalFlag: true
        })
    },
    //点击获取生成图片
    comtoimg: function () {

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) 
    {
      this.getSiteList();
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      var switchtype = this.data.switchtype;
      var page = this.data.page;
          page[switchtype] = 1;
      var lengthnone = this.data.lengthnone;
          lengthnone[switchtype] = false; 
      var msg = this.data.msg;
          msg[switchtype] ='暂无数据'
      var isLoad = this.data.isLoad;   
          isLoad[switchtype] = true;
      var isRes = this.data.isRes; 
          isRes[switchtype] = false;
      var isserach = this.data.isserach;
          isserach[switchtype] = false;
          //重新设计
          if (switchtype==1)
          {
            var complete = [];
            var construction = this.data.construction;
          }else
          {
            var complete = this.data.complete;
            var construction = [];
          }
          this.setData({
            complete: complete,//完工工地
            construction: construction,
            page: page,//分页
            lengthnone: lengthnone,//显示加载完了数据
            msg: msg,//显示加载完了数据提示语
            isLoad: isLoad,//分页加载
            isRes: isRes,//请求结果
            isserach: isserach,//检索数据
            seachName: '',//检索的文字
          });
          this.getSiteList();
          wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      var switchtype = this.data.switchtype;
      var isLoad = this.data.isLoad[switchtype];
      if ( isLoad == true) 
      {
        var page = this.data.page;
            page[switchtype] = page[switchtype]+1;
        this.setData({
          page: page
        })
        this.getSiteList();
      }
    },
    /**
     * 工地列表
     */
    getSiteList:function()
    { 
      var that = this;
      var page = that.data.page;
      var switchtype = that.data.switchtype;
      //工地列表地址
      if (that.data.isserach[switchtype] == true )
      {
        var url = Url.searchSiteList + '?isfinish=' + switchtype + '&name=' + that.data.seachName+'&page=' + page[switchtype];
      }else
      {
        var url = Url.siteList + '?isfinish=' + switchtype + '&page=' + page[switchtype];
      }
      Request.requestGet(url, function (res) {
        if (res.status == 1) 
        {
          if (res.data.total == 0) 
          {
            var lengthnone = that.data.lengthnone;
                lengthnone[switchtype] = true;
            var isRes = that.data.isRes
                isRes[switchtype] = true;
                that.setData({ 
                  lengthnone: lengthnone,
                  isRes: isRes
                  });
          }else
          {
            var isRes = that.data.isRes
                isRes[switchtype] = true;
            if (switchtype == 1) {
              var complete = that.data.complete;
              that.setData({
                complete: complete.concat(res.data.data),//完工工地
                isRes: isRes
              });
            } else {
              var construction = that.data.construction;
              that.setData({
                construction: construction.concat(res.data.data),//在建工地
                isRes: isRes
              });
            }
          }
          //不加载分页了
          if (res.data.last_page <= page[switchtype]) 
          {
            var isLoad = that.data.isLoad;
                isLoad[switchtype] = false;
                that.setData({
                  isLoad: isLoad
                })
          }
        }
      }); 
    },
    /**
     * 搜索列表
     */
    seachSite:function()
    {
      var switchtype = this.data.switchtype;
      var page = this.data.page;
          page[switchtype] = 1;
      var lengthnone = this.data.lengthnone;
          lengthnone[switchtype] = false;
      var msg = this.data.msg;
          msg[switchtype] = '暂无数据'
      var isLoad = this.data.isLoad;
          isLoad[switchtype] = true;
      var isRes = this.data.isRes;
          isRes[switchtype] = false;
      var isserach = this.data.isserach;
          isserach[switchtype] = true;
      //重新设计
      if (switchtype == 1) 
      {
        var complete = [];
        var construction = this.data.construction;
      } else {
        var complete = this.data.complete;
        var construction = [];
      }
      this.setData({
        complete: complete,//完工工地
        construction: construction,
        page: page,//分页
        lengthnone: lengthnone,//显示加载完了数据
        msg: msg,//显示加载完了数据提示语
        isLoad: isLoad,//分页加载
        isRes: isRes,//请求结果
        isserach: isserach
      });
      this.getSiteList();
    },
    /**
     * 搜索名称
     */
    bindKeyInput: function (e) {
      this.setData({
        seachName: e.detail.value
      })
    },
    closemask: function () {
      this.setData({
        setshow: false
      })
    },
})