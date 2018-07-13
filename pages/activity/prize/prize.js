var app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
const util = require('../../../utils/util.js');
Page({
    data: {
        windowHeight: 654,//倒计时开始
        bgurl:'',//背景图片
        info:'',//活动信息
        jsoninfo: {},//活动信息转换
        luck_user:[],//参与的用户
        luck_num:{},
        loseurl:'',//未中将图片
        makeurl:'',//抽奖按钮
        maxtime: "",
        isHiddenLoading: true,
        isHiddenToast: true,
        dataList: {},
        countDownDay: 0,
        countDownHour: 0,
        countDownMinute: 0,
        countDownSecond: 0,
        circleList: [],//圆点数组，抽奖活动开始  
        awardList: [],//奖品数组  
        colorCircleFirst: '#FFDF2F',//圆点颜色1  
        colorCircleSecond: '#FE4D32',//圆点颜色2  
        colorAwardDefault: '#F5F0FC',//奖品默认颜色  
        colorAwardSelect: '#ffe400',//奖品选中颜色  
        indexSelect:0,//被选中的奖品id
        isRunning: false,//是否正在抽奖  
        hadprize:false,//是都显示抽奖
        unprize:false,//未中奖提示
        imageAward: [],//奖品图片数组
        imgUrl: Url.imgUrl,
        luckId:[],//奖品id
        id:'',//活动id
        lackData:{},//中将信息
        backimg: Url.imgUrl + 'default/wx/blackbg.png',//中将背景图片
    },
    //事件处理函数  
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function (options) {
        var _this = this;
        if (options.scene!=undefined) {
          var scene = decodeURIComponent(options.scene);
          _this.setData({
            id: scene
          });
         
          _this.getActivity(scene);
        } else
         {
          _this.setData({
            id: options.id
          });
          _this.getActivity(options.id);
        }  
       
    },
    startStyle:function(){
      var _this = this;
      _this.setData({
        windowHeight: wx.getStorageSync('windowHeight')
      });
      //圆点设置  
      var leftCircle = 7.5;
      var topCircle = 7.5;
      var circleList = [];
      for (var i = 0; i < 24; i++) {
        if (i == 0) {
          topCircle = 15;
          leftCircle = 15;
        } else if (i < 6) {
          topCircle = 7.5;
          leftCircle = leftCircle + 102.5;
        } else if (i == 6) {
          topCircle = 15
          leftCircle = 620;
        } else if (i < 12) {
          topCircle = topCircle + 94;
          leftCircle = 620;
        } else if (i == 12) {
          topCircle = 565;
          leftCircle = 620;
        } else if (i < 18) {
          topCircle = 570;
          leftCircle = leftCircle - 102.5;
        } else if (i == 18) {
          topCircle = 565;
          leftCircle = 15;
        } else if (i < 24) {
          topCircle = topCircle - 94;
          leftCircle = 7.5;
        } else {
          return
        }
        circleList.push({ topCircle: topCircle, leftCircle: leftCircle });
      }
      this.setData({
        circleList: circleList
      })
      //圆点闪烁  
      setInterval(function () {
        if (_this.data.colorCircleFirst == '#FFDF2F') {
          _this.setData({
            colorCircleFirst: '#FE4D32',
            colorCircleSecond: '#FFDF2F',
          })
        } else {
          _this.setData({
            colorCircleFirst: '#FFDF2F',
            colorCircleSecond: '#FE4D32',
          })
        }
      }, 500)//设置圆点闪烁的效果
      //奖品item设置  
      var awardList = [];
      //间距,怎么顺眼怎么设置吧.  
      var topAward = 25;
      var leftAward = 25;
      for (var j = 0; j < 8; j++) {
        if (j == 0) {
          topAward = 25;
          leftAward = 25;
        } else if (j < 3) {
          topAward = topAward;
          //166.6666是宽.15是间距.下同  
          leftAward = leftAward + 166.6666 + 15;
        } else if (j < 5) {
          leftAward = leftAward;
          //150是高,15是间距,下同  
          topAward = topAward + 150 + 15;
        } else if (j < 7) {
          leftAward = leftAward - 166.6666 - 15;
          topAward = topAward;
        } else if (j < 8) {
          leftAward = leftAward;
          topAward = topAward - 150 - 15;
        }
        var imageAward = this.data.imageAward[j];
        var id = this.data.luckId[j];
        awardList.push({ topAward: topAward, leftAward: leftAward, imageAward: imageAward, id: id });
      }
      this.setData({
        awardList: awardList
      })
    },
    //开始抽奖  
    startGame: function () {
      var _this = this;
      //if (_this.data.isRunning) return
      _this.setData({
        isRunning: true
      })
      
      //请求抽奖
      Request.requestGet(Url.luckyDraw + '?id=' + _this.data.id, function (res) {
        //console.log(res);
        if (res.status==1)
        {
          var lackData = res.data;
              lackData.picture = _this.data.imgUrl + lackData.picture
              _this.setData({
                lackData: lackData
              });
              _this.Effect(res.data);
        }else
        {
          wx.showToast({ title: res.messages, icon: 'none', duration: 10000 });
        }
      });
      
     
      
    },
    //抽奖效果
    Effect: function ( indexid ){
      var _this=this;
      var indexSelect = 0
      var i = 0;
      var timer = setInterval(function () {
        indexSelect++;
        //这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度  
        i += 30;
        if (i > 1000) {
          //去除循环  
          clearInterval(timer)
          //这里显示抽奖成功
          _this.setData({
            hadprize: indexid.iswin?true:false,
            unprize: indexid.iswin ? false : true,
            indexSelect: indexid.id
          })
        }
        indexSelect = indexSelect % 8;
        var id = _this.data.luckId[indexSelect];
        if (i > 1000){
          var id = indexid.id;
        }
        _this.setData({
          indexSelect: id
        })
      }, (200 + i));
    },
    //关闭中奖弹窗
    closeprize:function(){
        var that = this;
        this.setData({
            hadprize: false
        })
        //判断输入电话了么
        var luck_num = this.data.luck_num;
        if (!luck_num || luck_num.clientid == false)
        {
          wx.reLaunch({
            url: '/pages/activity/getmessage/getmessage?activityluckyid=' + that.data.info.id
          })
        }
    },
    //关闭未中奖弹窗
    closenoprize:function(){
        this.setData({
            unprize: false
        })
    },
    // 页面渲染完成后 调用  
    setTiem: function () {
        var that = this;
        var now = new Date().getTime();
        var dateTimeStamp = Date.parse(that.data.info.startdate);
        var endTime = Date.parse(that.data.info.enddate);
        var diffValue = now - dateTimeStamp;
        if ( diffValue < 0 ) 
        {
           wx.showToast({ title: '活动还未开始', icon: 'none', duration: 10000 });
           return;
        }
        if (endTime - now < 0 ){
          wx.showToast({ title: '活动已过期', icon: 'none', duration: 10000 });
          return;
        }

        var totalSecond = endTime/1000 - Date.parse(new Date()) / 1000;
        var interval = setInterval(function () {
            // 秒数  
            var second = totalSecond;
            // 天数位  
            var day = Math.floor(second / 3600 / 24);
            var dayStr = day.toString();
            if (dayStr.length == 1) dayStr = '0' + dayStr;
            // 小时位  
            var hr = Math.floor((second - day * 3600 * 24) / 3600);
            var hrStr = hr.toString();
            if (hrStr.length == 1) hrStr = '0' + hrStr;

            // 分钟位  
            var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
            var minStr = min.toString();
            if (minStr.length == 1) minStr = '0' + minStr;

            // 秒位  
            var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
            var secStr = sec.toString();
            if (secStr.length == 1) secStr = '0' + secStr;

            this.setData({
                countDownDay: dayStr,
                countDownHour: hrStr,
                countDownMinute: minStr,
                countDownSecond: secStr,
            });
            totalSecond--;
            if (totalSecond < 0) {
                clearInterval(interval);
                wx.showToast({
                    title: '活动已结束',
                });
                this.setData({
                    countDownDay: '00',
                    countDownHour: '00',
                    countDownMinute: '00',
                    countDownSecond: '00',
                });
            }
        }.bind(this), 1000);
    },
    //cell事件处理函数  
    bindCellViewTap: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../babyDetail/babyDetail?id=' + id
        });
    },
    //活动信息
    getActivity:function(id){
      var that = this;
      Request.requestGet(Url.luckyInfo + '?id=' + id, function (res) {
        if(res.status==1)
        {
          var arr=[];
          var luckId=[];
          res.data.luck_prize.forEach(function (v) {
            luckId.push(v.id);
            arr.push(that.data.imgUrl + v.picture);
          });
          that.setData({
            imageAward:arr,
            luckId:luckId,
            bgurl: that.data.imgUrl + res.data.info.bgurl,
            loseurl: that.data.imgUrl + res.data.info.loseurl,
            info: res.data.info,
            jsoninfo: JSON.stringify(res.data.info),
            luck_user: res.data.luck_user,
            luck_num: res.data.luck_num,
            makeurl: that.data.imgUrl + res.data.info.makeurl
          });
          //渲染样式
          that.startStyle();
          that.setTiem();
          //判断是不是在抽奖前提交用户信息
          if (!res.data.luck_num && res.data.info.ishasconnectinfo==1)
          {
            wx.navigateTo({
              url: '/pages/activity/getmessage/getmessage?activityluckyid=' + res.data.info.id
            })
          }
          //console.log(res); 
        }
      });
    },
    //分享给微信好友
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
      }
      var info = this.data.info;
      if (info.sharetitle){
        return {
          title: info.sharetitle
        }
      }
    },
    closeactive: function () {
      wx.switchTab({
        url: '../../index/index',
      })
    },
})  