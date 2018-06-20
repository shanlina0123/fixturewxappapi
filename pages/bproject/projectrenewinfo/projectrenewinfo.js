// pages/Bproject/prostep/prostep.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var info = prevPage.data //取上页data里的数据也可以修改
    console.log(pages.length);
    this.setData({ tag: info.tag});
  },
  /**
   * 选择阶段
   */
  setTag:function(e){
    var item = e.currentTarget.dataset.item;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
          tagInfo: { 'id': item.id, 'name': item.name }
        }); 
        wx.navigateBack({
          delta: 1
        })
  }
})
