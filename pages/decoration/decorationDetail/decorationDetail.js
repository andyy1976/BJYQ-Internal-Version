const config = require("../../../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    decoration: {},
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
    var decoration = JSON.parse(options.decoration);
    // repairOrder.isLate = repairOrder.status == "维修延期" ? true : false;
    // that.setData({
    //   reasonHidden: !repairOrder.isLate,
    //   chargeHidden: !(repairOrder.ChargeType == '收费')
    // })
    // var beforeImages = [];
    // var afterImages = [];
    // for (var i = 0; i < 3; i++) {
    //   beforeImages.push(repairOrder.BeforeImage[i] ? config.urls.getImageUrl + repairOrder.BeforeImage[i] : "");
    //   afterImages.push(repairOrder.AfterImage[i] ? config.urls.getImageUrl + repairOrder.AfterImage[i] : "../../../images/addimage.png");
    // }
    // that.setData({//设置占位图片
    //   beforeImage: beforeImages,
    //   afterImage: afterImages
    // })
    that.setData({
      decoration: decoration || {},
      toDay: getDateTime()
    })


  },

  /**
   * 是否延期
   */
  isLateChange: function (e) {
    console.log(e);
    var that = this;
    if (e.detail.value == "是") {
      that.setData({
        reasonHidden: false,
        "repairOrder.isLate": e.detail.value,
        "repairOrder.status": "维修延期"
      })
    }
    else {
      that.setData({
        reasonHidden: true,
        "repairOrder.isLate": e.detail.value,
        "repairOrder.status": "维修中",
        "repairOrder.LateReason": "",
        "repairOrder.LateReason": ""
      })
    }

    // if (e.detail.value == "是"){
    //   that.setData({
    //     "repairOrder.isLate": "维修延期",
    //   })
    // }
    // else{
    //   that.setData
    // }
  },

  checkIdentity: function (e) {
    var that = this;
    if (that.data.repairOrder.Identity == "维修工") {
      wx.showModal({
        title: '提示',
        content: '无操作权限，请联系客服专员进行操作',
        showCancel: false,
      })
      return;
    }
  },

  // result1Change: function (e) {
  //   var that = this;
  //   console.log(e);
  //   that.setData({
  //     chargeHidden: e.detail.value == "免费",
  //   })
  // },

  // result2Change: function (e) {
  //   var that = this;
  //   console.log(e);
  //   that.setData({
  //     chargeHidden: e.detail.value == "免费",
  //     // "repairOrder.ChargeType": e.detail.value,
  //     // "repairOrder.ChargeType": e.detail.value,
  //   })
  // },

  isPaidChange: function (e) {

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
    var decoration = that.data.decoration;
    switch (parseInt(e.target.id)) {
      case 100: {
        var time = e.detail.value + " " + getTime();
        that.setData({
          "decoration.checkEngineerSignDate": time,
        })
        console.log(that.data.decoration);
        break;
      }
      case 200: {
        var time = e.detail.value + " " + getTime();
        that.setData({
          "decoration.accessControllerSignDate": time,
        })
        console.log(that.data.decoration);
        break;
      }
      case 300: {
        var time = e.detail.value + " " + getTime();
        that.setData({
          "decoration.engineeringCheckAccessManSignDate": time,
        })
        console.log(that.data.decoration);
        break;
      }
      case 400: {
        var time = e.detail.value + " " + getTime();
        that.setData({
          "decoration.engineeringPatrolManSignDate": time,
        })
        console.log(that.data.decoration);
        break;
      }
      case 500: {
        var time = e.detail.value + " " + getTime();
        that.setData({
          "decoration.engineeringCheckManSignDate": time,
        })
        console.log(that.data.decoration);
        break;
      }
      case 600: {
        var time = e.detail.value + " " + getTime();
        that.setData({
          "decoration.engineeringManagerSignDate": time,
        })
        console.log(that.data.decoration);
        break;
      }
      case 700: {
        var time = e.detail.value + " " + getTime();
        that.setData({
          "decoration.checkTime1": time,
        })
        console.log(that.data.decoration);
        break;
      }
      case 800: {
        var time = e.detail.value + " " + getTime();
        that.setData({
          "decoration.checkTime2": time,
        })
        console.log(that.data.decoration);
        break;
      }
    }
  },

  submit: function (e) {
    // console.log(e);
    // return;
    var that = this;
    var decoration = that.data.decoration;
    var submitData = e.detail.value;
    submitData.id = decoration.id;
    submitData.serverUrl = config.urls.setDecorationResultUrl;
    console.log(submitData);
    // return;
    wx.showLoading({
      title: '正在提交...',
    })
    wx.request({
      url: config.urls.setDecorationResultUrl,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=uft-8'
      },
      data: submitData,
      success: res => {
        console.log(res);
        wx.hideLoading();
        if (res.data.status == "Success") {
          wx.showModal({
            title: '提示',
            content: "提交成功",
            // content: '提交成功，点击确定返回工单列表',
            showCancel: false,
            // success: res => {
            //   wx.reLaunch({
            //     url: '../workOrder/workOrder',
            //   })
            // }
          })
        }
        else {
          wx.showModal({
            title: '提示',
            content: '提交失败，请稍后重试',
            showCancel: false
          })
          return;
        }
      },
      fail: res => {
        wx.showModal({
          title: '提示',
          content: '提交失败，请稍后重试',
          showCancel: false
        })
        return;
      }
    })
  },

  beforeImageTaped: function (e) {
    console.log(e);
    var that = this;
    var index = parseInt(e.target.id);
    console.log("beforeImage");
    console.log(that.data.repairOrder.BeforeImage[index]);
    // if (that.data.repairOrder.Status == "已完成") {
    if (!that.data.repairOrder.BeforeImage[index]) {
      return;
    }
    previewImage(config.urls.getImageUrl + that.data.repairOrder.BeforeImage[index]);
    // }
    // else {
    //   selectAndUploadImage(this, "before",index);
    // }
  },

  afterImageTaped: function (e) {
    var that = this;
    var index = parseInt(e.target.id);
    if (that.data.repairOrder.Status == "已完成") {
      previewImage(config.urls.getImageUrl + that.data.repairOrder.AfterImage[index]);
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
    previewImage(config.urls.getImageUrl + that.data.repairOrder.AfterImage[index]);
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
        url: config.urls.cloudImageUrl,
        filePath: tempFilePath,
        formData: { func: imageType, index: id + 1, id: that.data.repairOrder.Id, serverUrl: config.urls.setRepairImageUrl },
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

function getTime() {
  var date = new Date;
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var timeString = appendZero(hour) + ":" + appendZero(minute) + ":" + appendZero(second);
  return timeString;
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