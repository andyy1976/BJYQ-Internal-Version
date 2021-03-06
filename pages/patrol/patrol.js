
const config = require("../../utils/config.js");
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: ["../../images/addimage.png", "../../images/addimage.png", "../../images/addimage.png"],
    address: "",
    name: "",
    classify: "",
    ztName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    var ztInfo = wx.getStorageSync("currentZT");
    that.setData({
      name: userInfo.UserName,
      classify: ztInfo.ZTCode,
      ztName: ztInfo.ZTName
    })

    console.log(that.data);
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

  scan: function (e) {
    var that = this;
    console.log(e);
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ["qrCode"],
      success: res => {
        console.log(res);
        var result = res.result;
        console.log(result);
        that.setData({address:result});
      },
      fail: res => {
        console.log(res);
        wx.showToast({
          icon: "none",
          title: '扫码失败',
        })
      }
    })
  },


  imageTaped: function (e) {
    console.log(e);
    var that = this;
    var index = parseInt(e.target.id);
    selectImage(this, "before", index);
  },

  imageLongTaped: function (e) {
    console.log(e);
    var that = this;
    var index = parseInt(e.target.id);
    previewImage(that.data.image[index]);
  },

  toPatrolHistory: function (e) {
    wx.navigateTo({
      url: '../myPatrolHistory/myPatrolHistory',
    })
  },

  /**
   * 提交表单数据
   */
  submit: function (e) {
    console.log(e);
    var that = this;
    var submitData = e.detail.value;
    console.log(submitData);
    // return;
    if(!submitData.address || !submitData.content){
      wx.showModal({
        title: '提示',
        content: '请完善需提交信息后再进行提交',
      })
      return;
    }
    submitData.classify = that.data.classify;
    submitData.ztName = that.data.ztName;
    submitData.time = getDateTime();
    console.log(submitData);

    util.setRequest(config.urls.setPatrolUrl, submitData, function (data, errCode) {
      if (errCode) {
        if (data) {
          uploadImage(that, data);
        }
        wx.showModal({
          title: '提示',
          content: '提交成功，点击确定返回上一页',
          showCancel: false,
          success: function (e) {
            if (e.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    });

    // wx.showLoading({
    //   title: '正在提交...',
    // })
    // wx.request({
    //   url: config.urls.setPatrolUrl,
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded;charset=uft-8'
    //   },
    //   data: submitData,
    //   success: res => {
    //     wx.hideLoading();
    //     console.log(res);
    //     if (res.data.status == "Success") {
    //       if (res.data.data){
    //         uploadImage(that,res.data.data);
    //       }
    //       wx.showModal({
    //         title: '提示',
    //         content: '提交成功，点击确定返回上一页',
    //         showCancel: false,
    //         success : function(e) {
    //           if (e.confirm) {
    //             wx.navigateBack({
    //               delta : 1
    //             })
    //           }
    //         }
    //       })
    //     }
    //     else {
    //       wx.showModal({
    //         title: '提示',
    //         content: '发生未知错误，请稍后重试',
    //         showCancel: false
    //       })
    //       return;
    //     }
    //   },
    //   fail: res => {
    //     console.log(res);
    //     wx.hideLoading();
    //     wx.showModal({
    //       title: '提示',
    //       content: '发生未知错误，请稍后重试',
    //       showCancel: false
    //     })
    //     return;
    //   }
    // })
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

function previewImage(imageUrl) {
  wx.previewImage({
    urls: [imageUrl],
  })
}

function selectImage(that, imageType, id) {
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      var tempFilePath = res.tempFilePaths[0];
      console.log(tempFilePath);
      if (imageType == "before") {
        var image = that.data.image;
        image[id] = tempFilePath;
        that.setData({
          image: image
        })
      }
      console.log(that.data.image);
    }
  })
}

function uploadImage(that, id) {
  console.log(id);
  var image = that.data.image;
  var userInfo = wx.getStorageSync("userInfo");
  for (var i = 0; i < image.length; i++){
    var tempFilePath = image[i];
    if (tempFilePath == "../../images/addimage.png"){
      continue;
    }
    var extra = tempFilePath.split(".");
    var imagePath = tempFilePath.split("/");
    var imageName = imagePath[imagePath.length - 1];
    var extraName = extra[extra.length - 1];
    wx.uploadFile({
      url: config.urls.setPatrolImageUrl,
      filePath: tempFilePath,
      formData: { id: id, index: i + 1, path: "jczl_bsgl"},
      name: '' + userInfo.Id + + getTimeStamp() + "." + extraName,
      // name: extra[imagePath.length - 2] + getTimeStamp()+ "." +  extraName,
      // name: "repairOrder" + "before" + userInfo.UserName + getTimeStamp() + "." + extraName,
      success: res => {
        // wx.hideLoading();
        console.log(res);
      },
      fail: res => {
        // wx.hideLoading();
        console.log(res);
      }
    })
  }
}



function getDateTime() {
  var date = new Date;
  var year = (Number(date.getFullYear()));
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var dateString = year + "-" + appendZero(month) + "-" + appendZero(day) + " " + appendZero(hour) + ":" + appendZero(minute) + ":" + appendZero(second);
  return dateString;
}

function appendZero(value) {
  if (Number(value) < 10) {
    return "0" + value;
  }
  else {
    return value;
  }
}

/**
 * 生成时间戳
 */
function getTimeStamp() {
  var date = new Date();
  var timestamp = date.getTime();
  // timestamp = parseInt(timestamp / 1000).toString();
  return timestamp;
}