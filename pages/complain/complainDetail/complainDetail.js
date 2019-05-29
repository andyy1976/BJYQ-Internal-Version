const config = require("../../../utils/config.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    complainOrder: {},
    toDay: '',
    beforeImage: [],
    afterImage: [],
    reasonHidden: true,
    chargeHidden: true,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    var complainOrder = JSON.parse(options.complainOrder);
    var beforeImages = [];
    var afterImages = [];
    for (var i = 0; i < 3; i++) {
      beforeImages.push(complainOrder.BeforeImage[i] ? config.urls.getComplainImageUrl + complainOrder.BeforeImage[i] : "");
      afterImages.push(complainOrder.AfterImage[i] ? config.urls.getComplainImageUrl + complainOrder.AfterImage[i] : "../../../images/addimage.png");
    }
    that.setData({//设置占位图片
      beforeImage: beforeImages,
      afterImage: afterImages
    })
    that.setData({
      complainOrder: complainOrder || {},
      toDay: getDateTime()
    })


  },


  phoneCall: function (e) {
    console.log(e);
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phoneNumber,
      fail: res => {
        wx.showModal({
          title: '提示',
          content: '拨号功能暂不可用',
          showCancel: false
        })
      }
    })
  },

  datepickerBindchange: function (e) {
    var that = this;
    console.log(e);
    var complainOrder = that.data.complainOrder;
    switch (parseInt(e.target.id)) {
      case 100: {
        complainOrder.FinishDate = getDate() + " " + e.detail.value + ":00";
        that.setData({
          "complainOrder.FinishDate": complainOrder.FinishDate,
          "complainOrder.status": "已完成"
        })
        break;
      }
      case 300: {
        repairOrder.LateTime = e.detail.value;
        that.setData({
          "repairOrder.LateTime": repairOrder.LateTime,
          // "repairOrder.status": "已完成"
        })
        break;
      }
    }
  },

  submit: function (e) {
    console.log(e);
    var that = this;
    var complainOrder = that.data.complainOrder;
    var submitData = e.detail.value;
    submitData.id = that.data.complainOrder.Id;
    // submitData.serverUrl = config.urls.setComplainUrl;
    // submitData.sessionId = wx.getStorageSync("sessionId");
    // submitData.finishDate = submitData.arriveTime.replace(/-/g, "/");
    // submitData.completeTime = submitData.completeTime.replace(/-/g, "/");
    // submitData.status = complainOrder.isLate == "是" ? "维修延期" : complainOrder.status;
    // submitData.lateReason = repairOrder.lateReason;
    console.log(submitData);
    // return;


    util.setRequest(config.urls.setComplainUrl, submitData, function success(data, errCode) {
      if (errCode) {
        wx.showModal({
          title: '提示',
          content: '提交成功，点击确定返回投诉列表',
          showCancel: false,
          success: res => {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  },

  beforeImageTaped: function (e) {
    console.log(e);
    var that = this;
    var index = parseInt(e.target.id);
    console.log("beforeImage");
    console.log(that.data.beforeImage[index]);
    // if (that.data.repairOrder.Status == "已完成") {
    if (!that.data.beforeImage[index]) {
      return;
    }
    previewImage(that.data.beforeImage[index]);
    // }
    // else {
    //   selectAndUploadImage(this, "before",index);
    // }
  },

  afterImageTaped: function (e) {
    var that = this;
    var index = parseInt(e.target.id);
    if (that.data.complainOrder.Status == "已完成") {
      previewImage(that.data.afterImage[index]);
    }
    else {
      selectAndUploadImage(this, "after", index);
    }
  },

  // beforeImageLongTaped: function (e) {
  //   console.log(e);
  //   var that = this;
  //   var index = parseInt(e.target.id);
  //   previewImage("https://yqwy-hd.com/wxics/wximages/" + that.data.repairOrder.BeforeImage[index]);
  // },

  afterImageLongTaped: function (e) {
    console.log(e);
    var that = this;
    var index = parseInt(e.target.id);
    previewImage(that.data.afterImage[index]);
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


function previewImage(imageUrl) {
  wx.previewImage({
    urls: [imageUrl],
  })
}

function selectAndUploadImage(that, imageType, id) {
  var userInfo = wx.getStorageSync("userInfo");
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      var tempFilePath = res.tempFilePaths[0];
      var extra = tempFilePath.split(".");
      var imagePath = tempFilePath.split("/");
      var imageName = imagePath[imagePath.length - 1];
      var extraName = extra[extra.length - 1];
      console.log(tempFilePath);
      if (imageType == "before") {
        var beforeImage = that.data.beforeImage;
        beforeImage[id] = tempFilePath;
        that.setData({
          beforeImage: beforeImage
        })
      }
      else {
        var afterImage = that.data.afterImage;
        afterImage[id] = tempFilePath;
        that.setData({
          afterImage: afterImage
        })
      }

      wx.showLoading({
        title: '正在上传...',
      })
      wx.uploadFile({
        url: config.urls.setComplainImageUrl,
        filePath: tempFilePath,
        formData: { func: imageType, index: id + 1, id: that.data.complainOrder.Id, path: "gktscl" },
        name: "" + userInfo.Id + getTimeStamp() + "." + extraName,
        // name: extra[imagePath.length - 2] + getTimeStamp() + "." + extraName,
        // name: "repairOrder" + imageType + userInfo.UserName + getTimeStamp() + "." + extraName,
        success: res => {
          wx.hideLoading();
          console.log(res);
        },
        fail: res => {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '上传失败，请稍后重试',
            showCancel: false
          })
          console.log(res);
        }
      })
    }
  })
}

function getDate() {
  var date = new Date;
  var year = (Number(date.getFullYear()));
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var dateString = year + "-" + appendZero(month) + "-" + appendZero(day);
  return dateString;
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