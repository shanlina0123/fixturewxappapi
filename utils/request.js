const app = getApp();

function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

/**
 * 检测token
 */
function checkToken()
{
  var pages = getCurrentPages();
  var Page = pages[pages.length - 1];//当前页
  var url = Page.route; //当前页面url
  var options = Page.options;
  var str = '';
  for (let k in options) {
    str += k+'='+options[k]+'&'
  } 
  str = str ? encodeURIComponent(str.substr(0, str.length - 1)) : '';
  var userinfo = wx.getStorageSync('userInfo');
  if (!userinfo)
  { 
    wx.reLaunch({
      url: '/pages/allowlogin/allowlogin?url=' + JSON.stringify(url) + '&options=' + str
    });
    return;
  }
};
/**
 * post请求
 */
function requestPost( url, obj, cb ) {
  var userinfo = wx.getStorageSync('userInfo');
  if (!userinfo) {
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1];//当前页
    var url = Page.route; //当前页面url
    var options = Page.options;
    wx.reLaunch({
      url: '/pages/allowlogin/allowlogin?url=' + JSON.stringify(url) + '&options=' + JSON.stringify(options)
    });
  }else
  {
    var that = this;
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: url,
      method: "POST",
      data: obj,
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('userInfo').Authorization
      },
      success: function (res) {
        wx.hideLoading();
        var res_data = res.data;
        var status = parseInt(res_data.status);
        switch (status) {
          case 21://token过期
          case 7:
            wx.clearStorageSync();
            checkToken();
            return;
            break;
          case 1:
            break;
          default:
            wx.showToast({
              title: res_data.messages,
              icon: 'none'
            });
            break;
        }
        typeof cb == "function" && cb(res_data);
      }, fail: function () {
        wx.hideLoading();
        wx.showToast({ title: '加载失败', icon: 'loading', duration: 10000 });
      }
    });
  }
};

/**
 *  get 
 */
function requestGet(url, cb) {
  var userinfo = wx.getStorageSync('userInfo');
  if (!userinfo) {
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1];//当前页
    var url = Page.route; //当前页面url
    var options = Page.options;
    wx.reLaunch({
      url: '/pages/allowlogin/allowlogin?url=' + JSON.stringify(url) + '&options=' + JSON.stringify(options)
    });
  } else 
  {
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
        wx.hideLoading();
        var res_data = res.data;
        var status = parseInt(res_data.status);
        switch (status) {
          case 21://token过期
          case 7:
            wx.clearStorageSync();
            checkToken();
            return;
            break;
        }
        typeof cb == "function" && cb(res_data);
      }, fail: function () {
        wx.showToast({ title: '加载失败', icon: 'loading', duration: 10000 });
      }
    });
  }
};

/**
 *  put 
 */
function requestPut(url, obj, cb) {
  var userinfo = wx.getStorageSync('userInfo');
  if (!userinfo) {
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1];//当前页
    var url = Page.route; //当前页面url
    var options = Page.options;
    wx.reLaunch({
      url: '/pages/allowlogin/allowlogin?url=' + JSON.stringify(url) + '&options=' + JSON.stringify(options)
    });
  } else {
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
        wx.hideLoading();
        var res_data = res.data;
        var status = parseInt(res_data.status);
        switch (status) {
          case 21://token过期
          case 7:
            wx.clearStorageSync();
            checkToken();
            return;
            break;
          case 1:
            break;
          default:
            wx.showToast({
              title: res_data.messages,
              icon: 'none'
            });
            break;
        }
        typeof cb == "function" && cb(res_data);
      }, fail: function () {
        wx.showToast({ title: '加载失败', icon: 'loading', duration: 10000 });
      }
    });
  }
};

/**
 * delete 
 */
function requestDelete(url,obj, cb) {
  var userinfo = wx.getStorageSync('userInfo');
  if (!userinfo) {
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1];//当前页
    var url = Page.route; //当前页面url
    var options = Page.options;
    wx.reLaunch({
      url: '/pages/allowlogin/allowlogin?url=' + JSON.stringify(url) + '&options=' + JSON.stringify(options)
    });
  } else {
    var that = this;
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: url,
      method: "DELETE",
      data: obj,
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('userInfo').Authorization
      },
      success: function (res) {
        wx.hideLoading();
        var res_data = res.data;
        var status = parseInt(res_data.status);
        switch (status) {
          case 21://token过期
          case 7:
            wx.clearStorageSync();
            checkToken();
            return;
            break;
          case 1:
            break;
          default:
            wx.showToast({
              title: res_data.messages,
              icon: 'none'
            });
            break;
        }
        typeof cb == "function" && cb(res_data);
      }, fail: function () {
        wx.showToast({ title: '加载失败', icon: 'loading', duration: 10000 });
      }
    });
  }
};
module.exports = {
  requestPost: requestPost,
  requestGet: requestGet,
  requestDelete: requestDelete,
  requestPut: requestPut,
  checkToken: checkToken
};