const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    range:[],//门店列表
    stores:[],//门店数据
    index:0,
    address:'',//设置的地址
    template:'',//设置的阶段
    issave:false//是不是提交了
  },
  /**
   * 设置选择
   */
  bindChange: function (event) {
      var that = this;
      let index = event.detail.value;
      this.setData({
          index: index
      })
  },
  submitform:function(){
      wx.navigateTo({
          url: '../projectlist/projectlist',
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getstoreList();
  },
  /**
   * 门店列表
   */
  getstoreList:function(){
    var that = this;
    Request.requestPost(Url.storeList,{},function (res) {
      if (res.status == 1) 
      {
        var range=[];
        for (var i = 0; i < res.data.length; i++) 
        {
          range.push(res.data[i].name);
        }
        that.setData({
          stores: res.data,
          range: range
        });
      }
    });
  },
  /**
   * 发布
   */
  submitform:function(e)
  {
    var that = this;
    if (that.data.issave == true)
    {
      return;
    }
    var name = e.detail.value.name;
    var addr = that.data.address;
    var stageid = that.data.template;
    var stores = that.data.stores;
    var storeid = stores[that.data.index].id;
    var isopen = e.detail.value.isopen;
    if (!storeid)
    {
      wx.showToast({
        title: '请选择门店',
        icon: "none"
      });
    }else if (addr == '') {
      wx.showToast({
        title: '请选择地址',
        icon: "none"
      })
    }else if (name == '') {
      wx.showToast({
        title: '请填写项目名称',
        icon: "none"
      })
    }else if (stageid == '') {
      wx.showToast({
        title: '请选择阶段',
        icon: "none"
      })
    }else
    {
      //防止点多次
      that.setData({ issave: true });
      var obj={
        "storeid": storeid,
        "name": name,
        "stageid": stageid.id,
        "addr": addr.address,
        "lng": addr.location.lng,
        "lat": addr.location.lat,
        "doornumber": e.detail.value.doornumber,
        "roomtypeid":'',
        "room":'',
        "office":'',
        "kitchen":'',
        "wei":'',
        "acreage":'',
        "roomstyleid":'',
        "renovationmodeid":'',
        "budget":'',
        "photo":'',
        "stagetemplateid": stageid.stagetemplateid,
        "sitestagename":stageid.name
      };
      if (isopen == true)
      {
        obj.isopen=1;
      }
      Request.requestPost(Url.siteStore, obj, function (res) {
          //console.log(res);
          if( res.status == 1 )
          {
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
          }else
          {
            //可再提交
            that.setData({ issave: false });
          }
      })
    }
      
    }

})