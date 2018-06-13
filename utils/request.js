const app = getApp();

/**
 * 检测token
 */
function checkToken()
{
  var pages = getCurrentPages();
  var Page = pages[pages.length - 1];//当前页
  var url = Page.route; //当前页面url
  var options = Page.options;
  var userinfo = wx.getStorageSync('userInfo');
  if (!userinfo)
  { 
    wx.reLaunch({
      url: '/pages/allowlogin/allowlogin?url=' + JSON.stringify(url) + '&options=' +JSON.stringify(options)
    });
  }
};
/**
 * post请求
 */
function requestPost( url, obj, cb ) {
  var that=this;
  wx.showLoading({ title: '加载中' });
  wx.request({
    url:url,
    method: "POST",
    data:obj,
    header: {
      'content-type': 'application/json',
      'Authorization': wx.getStorageSync('userInfo').Authorization
    },
    success: function (res) {
      var res_data = res.data;
      var status = parseInt(res_data.status);
      switch (status) {
        case 21://token过期
        case 7:
          wx.clearStorageSync();
          checkToken();
      }
      typeof cb == "function" && cb(res_data);
     
    },fail:function()
    {
      wx.showToast({ title: '数据调用失败', icon: 'loading', duration: 10000 });
    }, complete: function () {
      wx.hideLoading();
    }
  });
};

/**
 *  get 
 */
function requestGet(url, cb) {
  var that = this;
  wx.showLoading({title: '加载中'});
  wx.request({
    url: url,
    method: "GET",
    header: {
      'content-type': 'application/json',
      'Authorization': wx.getStorageSync('userInfo').Authorization
    },
    success: function (res) {
      var res_data = res.data;
      var status = parseInt(res_data.status);
      switch (status) {
        case 21://token过期
        case 7:
          wx.clearStorageSync();
          checkToken();
      }
      typeof cb == "function" && cb(res_data);
    }, fail: function () {
      wx.showToast({ title: '数据调用失败', icon: 'loading', duration: 10000 });
    }, complete: function () {
      wx.hideLoading();
    }
  });
};

/**
 *  put 
 */
function requestPut(url, obj, cb) {
  var that = this;
  wx.showLoading({ title: '加载中' });
  wx.request({
    url: url,
    method: "PUT",
    data: obj,
    header: {
      'content-type': 'application/json',
      'Authorization': wx.getStorageSync('userInfo').Authorization
    },
    success: function (res) {
      var res_data = res.data;
      var status = parseInt(res_data.status);
      switch (status) {
        case 21://token过期
        case 7:
          wx.clearStorageSync();
          checkToken();
      }
      typeof cb == "function" && cb(res_data);
    }, fail: function () {
      wx.showToast({ title: '数据调用失败', icon: 'loading', duration: 10000 });
    },complete:function(){
      wx.hideLoading();
    }
  });


  
};

/**
 * delete 
 */
function requestDelete(url,obj, cb) {
  var that = this;
  wx.showLoading({ title: '加载中' });
  wx.request({
    url: url,
    method: "DELETE",
    data:obj,
    header: {
      'content-type': 'application/json',
      'Authorization': wx.getStorageSync('userInfo').Authorization
    },
    success: function (res) {
      var res_data = res.data;
      var status = parseInt(res_data.status);
      switch (status) {
        case 21://token过期
        case 7:
          wx.clearStorageSync();
          that.checkToken();
      }
      typeof cb == "function" && cb(res_data);
    }, fail: function () {
      wx.showToast({ title: '数据调用失败', icon: 'loading', duration: 10000 });
    }, complete: function () {
      wx.hideLoading();
    }
  });
};
module.exports = {
  requestPost: requestPost,
  requestGet: requestGet,
  requestDelete: requestDelete,
  requestPut: requestPut
};