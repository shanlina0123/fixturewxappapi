const app = getApp();
const Authorization = wx.getStorageSync('userInfo').Authorization;
/**
 * post请求
 */
function requestPost( url, obj, cb ) {
  var that=this;
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    duration: 2000
  })
  wx.request({
    url:url,
    method: "POST",
    data:obj,
    header: {
      'content-type': 'application/json',
      'Authorization': Authorization
    },
    success: function (res) {
      var res_data = res.data;
      var status = parseInt(res_data.status);
      switch ( status )
      {
        case 1:
          typeof cb == "function" && cb(res_data.data, "");
          break;
        case 0:
          wx.showToast({ title: res_data.messages, icon: 'none'});
          break;
        case 21://token过期
          wx.clearStorageSync();
          app.getAppid();
          that.requestPost( url, obj, cb );
      }
     
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
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    duration: 2000
  })
  wx.request({
    url: url,
    method: "GET",
    header: {
      'content-type': 'application/json',
      'Authorization': Authorization
    },
    success: function (res) {
      var res_data = res.data;
      var status = parseInt(res_data.status);
      switch (status) {
        case 1:
          typeof cb == "function" && cb(res_data.data, "");
          break;
        case 0:
          wx.showToast({ title: res_data.messages, icon: 'none' });
          break;
        case 21://token过期
          wx.clearStorageSync();
          app.getAppid();
          that.requestPost(url, obj, cb);
      }

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
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    duration: 2000
  })
  wx.request({
    url: url,
    method: "PUT",
    data: obj,
    header: {
      'content-type': 'application/json',
      'Authorization': Authorization
    },
    success: function (res) {
      var res_data = res.data;
      var status = parseInt(res_data.status);
      switch (status) {
        case 1:
          typeof cb == "function" && cb(res_data.data, "");
          break;
        case 0:
          wx.showToast({ title: res_data.messages, icon: 'none' });
          break;
        case 21://token过期
          wx.clearStorageSync();
          app.getAppid();
          that.requestPost(url, obj, cb);
      }

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
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    duration: 2000
  })
  wx.request({
    url: url,
    method: "DELETE",
    data:obj,
    header: {
      'content-type': 'application/json',
      'Authorization': Authorization
    },
    success: function (res) {
      var res_data = res.data;
      var status = parseInt(res_data.status);
      switch (status) {
        case 1:
          typeof cb == "function" && cb(res_data.data, "");
          break;
        case 0:
          wx.showToast({ title: res_data.messages, icon: 'none' });
          break;
        case 21://token过期
          wx.clearStorageSync();
          app.getAppid();
          that.requestPost(url, obj, cb);
      }

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