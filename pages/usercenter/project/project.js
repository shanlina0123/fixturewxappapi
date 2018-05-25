const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js')
Page({
    data: {
        prolists: [],
        lengthnone: false,
        msg:'暂无相关数据',
        imgUrl: Url.imgUrl,
        pages: 1,
        isLoad:true
    },
    getproList: function () {
        var that = this;
        Request.requestGet(Url.project + "?page=" + that.data.pages, function (res) {
            var prolists = that.data.prolists;
            if (res.status == 1) {
                that.setData({
                    prolists: prolists.concat(res.data.data)
                })
                if (res.data.data.length < 1) {
                    that.setData({
                        lengthnone: true,
                        isLoad:false,
                        msg:'没有最新数据了'                        
                    });
                }
            } else {
                wx.showToast({
                    title: res.message,
                })
            }
        })
    },
    onLoad: function () {
        this.getproList();
    },
    //页面上拉触底事件
    onReachBottom: function () {
        if (this.data.isLoad)
        {
            var page = this.data.pages;
            this.setData({
                pages: page + 1,
            })
            this.getproList();
        }
    },
    //页面下拉更新事件
    onPullDownRefresh: function () {
        this.update();
    }
})