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
                that.setData({
                    activeList: activeList.concat(res.data.data)
                })
                if (res.data.data.length < 1) {
                    that.setData({
                        lengthnone: true,
                        isLoad: false,
                        msg: '没有最新数据了'
                    });
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
        this.update();
    }
})