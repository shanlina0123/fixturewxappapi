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
        imgUrl: Url.imgUrl,
        setshow: false,
        modalFlag: true,
        sharebgimg: ''
    },
    //显示设置弹窗
    showsetting: function () {
        this.setData({
            setshow: !this.data.setshow
        })
    },
    //隐藏弹窗
    closepop: function () {
        this.setData({
            setshow: false
        })
    },
    //弹窗删除
    deletepro: function () {
        this.setData({
            setshow: false
        })
        wx.showModal({
            title: '确认删除吗？',
        })
    },
    //是否公开项目
    switch1Change: function (e) {
        if (e.detail.value) {
            wx.showToast({
                title: '项目已公开',
            })
        } else {
            wx.showToast({
                title: '项目公开已关闭',
            })
        }
        this.setData({
            setshow: false
        })
    },
    //项目完工
    overpro: function () {
        wx.showToast({
            title: '设置完工成功',
        })
        this.setData({
            setshow: false
        })
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
        this.getSiteList();
      }
      
    },
    //分享给微信好友
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
        }
        return {
            title: '当直播遇上装修，会发生什么？',
            path: '/pages/index/index?pageid=111',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
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
     * 工地列表
     */
    getSiteList:function()
    { 
      var that = this;
      var page = that.data.page;
      var switchtype = that.data.switchtype;
      Request.requestGet(Url.siteList + '?isfinish='+switchtype+'&page=' + page[switchtype], function (res) {
        if (res.status == 1) 
        {
          if (res.data.total == 0) 
          {
            var lengthnone = that.data.lengthnone;
                lengthnone[switchtype] = true;
                that.setData({ lengthnone: lengthnone});
          }else
          {
            if (switchtype == 1) {
              var complete = that.data.complete;
              that.setData({
                complete: complete.concat(res.dat.data),//完工工地
              });
            } else {
              var construction = that.data.construction;
              that.setData({
                construction: construction.concat(res.data.data),//在建工地
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
    }
})