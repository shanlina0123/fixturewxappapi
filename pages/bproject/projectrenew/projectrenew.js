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
        issave: false,//是不是提交了
        videosrc: '',//video
        videoshow:'hide',//video是否显示
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
    uploadvideo: function () {
      var that = this;
      wx.chooseVideo({
        sizeType: ['compressed'],
        sourceType: ['camera', 'album'],
        maxDuration: 10,
        camera: 'back',
        success: function (res) {
          var tempFilePaths = res.tempFilePath;
          var i = 0; //第几个
          var length = 1; //总共个数
          var successUp = 0; //成功个数
          var failUp = 0; //失败个数
          var uptype = "video";//类型
          that.uploadImg(tempFilePaths, successUp, failUp, i, length, uptype);
        }
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
      console.log(count);
      if (count == false) {
        wx.showToast({
          title: '最多上传9张',
          duration: 1500
        })
        return false;
      }
      wx.chooseImage({
        count: count,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          var i = 0; //第几个
          var length = res.tempFilePaths.length; //总共个数
          var successUp = 0; //成功个数
          var failUp = 0; //失败个数
          var uptype="img";//类型
          that.uploadImg(tempFilePaths, successUp, failUp, i, length, uptype);
        }
      })
    },
    uploadImg: function (tempFilePaths, successUp, failUp, i, length, uptype) {
      var that = this;
      var filepath = uptype == "img" ? tempFilePaths[i] : tempFilePaths;
      wx.uploadFile({
        url: Url.imgUpload, //仅为示例，非真实的接口地址
        filePath: filepath,
        name: 'file',
        header: {
          'content-type': 'multipart/form-data',
          'Authorization': wx.getStorageSync('userInfo').Authorization
        },
        success: function (res) {
          try{
            var data = res.data;
            data = JSON.parse(data);
            console.log(data);
            if (data.status == 1) {
              var srcArr = that.data.imgUrl;
              srcArr.push(data.data.src);
              var imgname = that.data.imgname;
              imgname.push(data.data.name);
              if (uptype == "img") {
                that.setData({
                  imgUrl: srcArr,
                  imgname: imgname
                });
              } else if (uptype == "video") {
                that.setData({
                  videosrc: srcArr[i],
                  videoshow: ""
                });
              }
            } else {
              wx.showToast({
                title: data.messages,
                icon: 'none',
                duration: 2000
              })
            }
          }catch(err){
            wx.showToast({
              title: "上传文件超过最大限制",
              icon: 'none',
              duration: 2000
            })
          }
        }, fail: function (res) {
          wx.showToast({
            title: data.messages,
            icon: 'none',
            duration: 2000
          })
        }, complete: () => {
          i++;
          if (i == length) {
            return;
          } else {  //递归调用uploadDIY函数
            if (!that.data.isuploaderror) {
              this.uploadImg(tempFilePaths, successUp, failUp, i, length, uptype);
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
      if (that.data.issave == true) 
      {
        return;
      }
      var content = e.detail.value.content;
      var tagInfo = that.data.tagInfo;
      var params = { 'sitestagename': tagInfo.name, 'stagetagid': tagInfo.id, 'content': content, 'uuid': that.data.uuid, 'img': that.data.imgname.join(',')}
      if (content == '')
      {
        wx.showToast({
          title: '说点什么吧',
          icon: "none"
        })
        that.setData({ issave: false });
      } else {
        //防止点多次
        that.setData({ issave: true });
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
          }else
          {
            that.setData({ issave: false });
          }
        })
      }
    }
})
