const app = getApp();
const Url = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        maxlength: 300,
        nowlength: 0,
        uuid:'',
        tag:[],
        tagInfo:{},
        imgUrl:[],//图片地址
        imgname:[],//图片名称
    },
    //跟踪输入的文字数字改变
    textareachange: function (e) {
        var value = e.detail.value,length = parseInt(value.length);
        if(length > this.data.maxlength){
            return;
        }else{
            this.setData({
                content:value,
                nowlength:length
            })
        }
    },
    //上传视频
    uploadvideo:function(){
        wx.chooseVideo({
            count:1,
            maxDuration: 10, // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) { }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var uuid = options.uuid;
      var that = this;
      this.setData({ uuid: uuid});
      Request.requestGet(Url.siteRenewInfo+'?uuid='+uuid, function (res) {
        if (res.status == 1)
        {
          that.setData({ 
            tag: res.data,
            tagInfo: { 'id': res.data[0].id, 'name': res.data[0].name}
            });
        }
      });
    },
    /**
     *上传普通照片
     */
    imgupload: function () {
      var that = this;
      var count = 9 - parseInt((that.data.imgUrl).length);
      if (count == false) {
        wx.showToast({
          title: '最多上传9张',
          duration: 1500
        })
        return false;
      }
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          var i = 0; //第几个
          var length = res.tempFilePaths.length; //总共个数
          var successUp = 0; //成功个数
          var failUp = 0; //失败个数
          that.uploadImg(tempFilePaths, successUp, failUp, i, length);
        }
      })
    },
    uploadImg: function (tempFilePaths, successUp, failUp, i, length) {
      var that = this;
      wx.uploadFile({
        url: Url.imgUpload, //仅为示例，非真实的接口地址
        filePath: tempFilePaths[i],
        name: 'file',
        header: {
          'content-type': 'multipart/form-data',
          'Authorization': wx.getStorageSync('userInfo').Authorization
        },
        success: function (res) {
          var data = res.data;
              data = JSON.parse(data);
          if (data.status==1 )
          {
            var srcArr = that.data.imgUrl;
                srcArr.push(data.data.src);
            var imgname = that.data.imgname;
                imgname.push(data.data.name);
                that.setData({
                  imgUrl: srcArr,
                  imgname: imgname
                });
          }
        }, complete: () => {
          i++;
          if (i == length) {
            return;
          } else {  //递归调用uploadDIY函数
            if (!that.data.isuploaderror) {
              this.uploadImg(tempFilePaths, successUp, failUp, i, length);
            }
          }
        }
      })
    }, remImg: function (e) {
      var that = this;
      var dataset = e.currentTarget.dataset;
      var Index = dataset.id;
      var name = dataset.name;
      //通过`index`识别要删除第几条数据，第二个数据为要删除的项目数量，通常为1
      that.data.imgUrl.splice(Index, 1);
      that.data.imgname.splice(Index, 1);
      //渲染数据
      that.setData({
        imgUrl: that.data.imgUrl,
        imgname: that.data.imgname
      });
      Request.requestGet(Url.imgDel + '/'+name,function(){});
    },
    //提交表单
    submitform: function (e) {
      var that = this;
      var content = e.detail.value.content;
      var tagInfo = that.data.tagInfo;
      var params = { 'sitestagename': tagInfo.name, 'stagetagid': tagInfo.id, 'content': content, 'uuid': that.data.uuid, 'img': that.data.imgname.join(',')}
      if (content == '')
      {
        wx.showToast({
          title: '说点什么吧',
          icon: "none"
        })
      } else {
        Request.requestPut(Url.siteRenew, params, function (res) {
          if (res.status == 1)
          {
            wx.showModal({
              title: '',
              content: res.messages,
              showCancel: false,
              success: function (res) {
                if (res.confirm) 
                {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            });
          }
        })
      }
    }
})
