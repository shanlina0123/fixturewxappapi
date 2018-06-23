const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
      info:{},//详情
      renovationMode: [],//装修方式
      renovationModeInfo: { "id": 0, "name": '' },//装修方式数据
      roomStyle: [],//装修风格
      roomStyleInfo: { "id": 0, "name": '' },//装修数据
      roomType: [],//所有户型
      roomTypeInfo: { "id":0,"name":''},//户型数据
      tagInfo:'',//阶段数据
      tag:[],//阶段数据为了和更新工地的时候用一个阶段页面
      address:'',//为了和添加工地公用一个地图
      roomshap:'',//房型数据
      issave: false//是不是提交了
    },
    //上传封面图
    uploadimg: function () {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) { }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var id = 1;//options.id;
      var obj = {id:id};
      var that = this;
      Request.requestPost(Url.siteEdit,obj, function (res) {
       // console.log(res);
        if (res.status == 1)
        {
          var data = res.data;
          //装修方式
          var renovationMode = [];
          data.renovationMode.forEach(function (v) {
            renovationMode.push(v.name);
            if (data.renovationmodeid == v.id) {
              that.setData({
                renovationModeInfo: { "id": v.id, "name": v.name }
              });
            }
          });
          //装修风格
          var roomStyle = [];
           data.roomStyle.forEach(function(v){
             roomStyle.push(v.name);
             if (data.roomstyleid == v.id) {
               that.setData({
                 roomStyleInfo: { "id": v.id, "name": v.name }
               });
             }
           });
          //户型
          var roomType = [];
          data.roomType.forEach(function (v) {
             roomType.push(v.name);
             if (data.roomtypeid == v.id )
             {
               that.setData({
                 roomTypeInfo: { "id":v.id,"name":v.name }
               });
             }
          });
          that.setData({
            info: res.data,
            renovationMode: renovationMode,
            roomStyle: roomStyle,
            roomType: roomType,
            tagInfo: { "id": data.stageid, "name": data.tagName},
            tag:data.tag,
            roomshap: data.roomshapnumber ? data.roomshapnumber.split(','):''
          });
        }
      }); 
    },
    /**
     * 设置地址数据
     */
    setAddress:function()
    {
      wx.navigateTo({
        url: '../projectmap/projectmap'
      })
    },
    /**
     * 选择户型
     */
    changeRoomType:function(e)
    {
      var index = e.detail.value;
      var that = this;
      var RoomType = that.data.info.roomType;
      that.setData({
        roomTypeInfo: { "id": RoomType[index].id, "name": RoomType[index].name }
      });
    },
    /**
     * 装修风格选择
     */
    changeRoomStyle: function (e){
      var index = e.detail.value;
      var that = this;
      var roomStyle = that.data.info.roomStyle;
      that.setData({
        roomStyleInfo: { "id": roomStyle[index].id, "name": roomStyle[index].name }
      });
    },
    /**
     * 装修方式选择
     */
    changeRenovationMode: function (e) {
      var index = e.detail.value;
      var that = this;
      var renovationMode = that.data.info.renovationMode;
      that.setData({
        renovationModeInfo: { "id": renovationMode[index].id, "name": renovationMode[index].name }
      });
    },
    /**
 * 发布
 */
    submitform: function (e) {
      var that = this;
      if (that.data.issave == true) {
        return;
      }
      var name = e.detail.value.name;
      var addr = e.detail.value.addr;
      var tagInfo = that.data.tagInfo;
      var info = that.data.info;
      if (addr == '') {
        wx.showToast({
          title: '请选择地址',
          icon: "none"
        })
      } else if (name == '') {
        wx.showToast({
          title: '请填写项目名称',
          icon: "none"
        })
      } else if (tagInfo == '') {
        wx.showToast({
          title: '请选择阶段',
          icon: "none"
        })
      } else {
        //防止点多次
        that.setData({ issave: true });
        var obj = {
          "uuid": info.uuid,
          "name": name,
          "stageid": tagInfo.id,
          "addr": that.data.address ? that.data.address.address : info.addr,
          "lng": that.data.addres ? that.data.address.location.lng : info.lng,
          "lat": that.data.addres ? that.data.address.location.lat : info.lat,
          "doornumber": e.detail.value.doornumber,
          "roomtypeid": that.data.roomTypeInfo.id,
          "room": e.detail.value.room,
          "office": e.detail.value.office,
          "kitchen": e.detail.value.kitchen,
          "wei": e.detail.value.wei,
          "acreage": e.detail.value.acreage,
          "roomstyleid": that.data.roomStyleInfo.id,
          "renovationmodeid": that.data.renovationModeInfo.id,
          "budget":e.detail.value.budget,
          "photo": '',
          "isopen": info.isopen
        };
        Request.requestPut(Url.siteUpdate, obj, function (res) {
          //console.log(res);
          if (res.status == 1) {
            wx.showModal({
              title: '',
              content: res.messages,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '/pages/bproject/projectlist/projectlist'
                  })
                }
              }
            });
          } else {
            //可再提交
            that.setData({ issave: false });
          }
        })
      }
    }
})
