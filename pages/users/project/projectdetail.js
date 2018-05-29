// pages/usercenter/project/projectdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focustext:"关注",
    selected1: true,
    selected2: false,
    selected3: false,
    on: "check",
    hide: 'hide'
  },
  /**关注项目按钮 */
  changeName:function(e){
      var that = this;

      if (that.data.focustext == '关注')
      {
          that.setData({
            focustext : '已关注'
          })
      }else{
          that.setData({
              focustext: '关注'
          })
      }
  },
  /**切换效果 */
  tab1: function (e) {
      var that = this;
      that.setData({
          selected1: true,
          selected2: false,
          selected3: false,
      })
  },
  tab2: function (e) {
      var that = this;
      that.setData({
          selected1: false,
          selected2: true,
          selected3: false,
      })
  },
  tab3: function (e) {
      var that = this;
      that.setData({
          selected1: false,
          selected2: false,
          selected3: true,
      })
  },
  /**显示点赞和评论按钮 */
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
  /**点击评论显示评论输入框 */
  showinput: function () {
      var that = this;
      if (!that.data.inputisshow) {
          that.setData({
              inputisshow: true,
              isshow: false
          })
      } else {
          that.setData({
              inputisshow: false
          })
      }
  },
  /**关闭输入框 */
  closeinput: function () {
      this.setData({
          inputisshow: false
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})