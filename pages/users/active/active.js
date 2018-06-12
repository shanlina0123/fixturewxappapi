const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js')
Page({
    data: {
        lengthnone: false,
        pages:1,
        activeList:[],
        msg: '暂无相关数据',
        imgUrl: Url.imgUrl,
        isLoad: true
    },
    //获得活动列表
    getactiveList: function () {
        var that = this;
        Request.requestGet(Url.active + "?page=" + that.data.pages, function (res) {
            var activeList = that.data.activeList;
            if (res.status == 1) {
              if (res.data.total == 0) {
                that.setData({
                  lengthnone: true
                });
              } else {
                that.setData({
                    activeList: activeList.concat(res.data.data)
                })
                //不在加载分页
                if (res.data.last_page <= that.data.pages) {
                    that.setData({
                        lengthnone: true,
                        isLoad: false,
                        msg: '已经到底了'
                    });
                }
              }
            } else {
                wx.showToast({
                    title: res.message,
                })
            }
        })
    },
    //页面加载
    onLoad: function (options) {
        this.getactiveList();
    },
    //页面上拉刷新
    onReachBottom: function () {
        if (this.data.isLoad) {
            var page = this.data.pages;
            this.setData({
                pages: page + 1,
            })
            this.getactiveList();
        }
    },
    //页面下拉加载
    onPullDownRefresh: function () {
        this.setData({
          lengthnone: false,
          pages: 1,
          activeList: [],
          msg: '暂无相关数据',
          imgUrl: Url.imgUrl,
          isLoad: true
        });
        this.getactiveList();
        wx.stopPullDownRefresh();
    }
})