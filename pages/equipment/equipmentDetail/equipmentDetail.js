
//前后宽限天数，完成时间，设备资料查询

const util = require("../../../utils/util.js");
const config = require("../../../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipment: {},
    today: "",
    isScan: false,
    beforeImage: "",
    middleImage: "",
    afterImage: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var equipment = JSON.parse(options.equipment) || {};
    var isDone = equipment.IsDone;
    if (isDone == 1) {
      that.setData({
        beforeImage: equipment.BeforeImage ? config.urls.getEquipmentImageUrl + equipment.BeforeImage : "",
        middleImage: equipment.MiddleImage ? config.urls.getEquipmentImageUrl + equipment.MiddleImage : "",
        afterImage: equipment.AfterImage ? config.urls.getEquipmentImageUrl + equipment.AfterImage : ""
      })
    }
    else {
      that.setData({
        beforeImage: equipment.BeforeImage ? config.urls.getEquipmentImageUrl + equipment.BeforeImage : "../../../images/addimage.png",
        middleImage: equipment.MiddleImage ? config.urls.getEquipmentImageUrl + equipment.MiddleImage : "../../../images/addimage.png",
        afterImage: equipment.AfterImage ? config.urls.getEquipmentImageUrl + equipment.AfterImage : "../../../images/addimage.png"
      })
    }
    that.setData({
      equipment: equipment,
      toDay: getDateTime()
    })
  },

  pickerChange: function (e) {
    console.log(e);
    var that = this;
    var date = e.detail.value;
    that.setData({
      today: date + getTime(),
      "equipment.InputDate": date + getTime(),
    })
  },

  scanCode: function (e) {
    var that = this;
    var equipment = that.data.equipment;
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: res => {
        console.log(res);
        if (res.result.indexOf(equipment.Number) < 0){
          wx.showModal({
            title: '提示',
            content: '所扫二维码码与当前设备不符，请查证后重试',
            showCancel: false,
          })
          return;
        }
        else {
          that.setData({isScan: true})
        }
      },
      fail: res => {
        console.log(res);
      }
    })
  },


  submit: function (e) {
    console.log(e);
    // return;
    var that = this;
    // if (that.data.isScan == false) {
    //   util.showSign("尚未扫码，无法提交");
    //    return;
    // }
    var userInfo = wx.getStorageSync("userInfo");
    var submitData = e.detail.value;
    submitData.id = that.data.equipment.ID;
    submitData.inputMan = userInfo.UserName;
    submitData.inputDate = that.data.today;
    submitData.serverUrl = config.urls.setEquipmentUrl;
    console.log(submitData);
    // return;

    util.setRequest(config.urls.setEquipmentUrl, submitData, function success(data, errCode) {
      if (errCode) {
        wx.showModal({
          title: '提示',
          content: '提交成功，点击确定返回设备列表',
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

  beforeImageTaped: function () {
    var that = this;
    if (that.data.equipment.IsDone == "1") {
      previewImage(that.data.beforeImage);
    }
    else {
      selectAndUploadImage(this, "before");
    }
  },
  middleImageTaped: function () {
    var that = this;
    if (that.data.equipment.IsDone == "1") {
      previewImage(that.data.middleImage);
    }
    else {
      selectAndUploadImage(this, "middle");
    }
  },

  afterImageTaped: function () {
    var that = this;
    if (that.data.equipment.IsDone == "1") {
      previewImage(that.data.afterImage);
    }
    else {
      selectAndUploadImage(this, "after");
    }
  }
})


function previewImage(imageUrl) {
  wx.previewImage({
    urls: [imageUrl],
  })
}

function selectAndUploadImage(that, imageType) {
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
        that.setData({
          beforeImage: tempFilePath
        })
      }
      else if (imageType == "after") {
        that.setData({
          afterImage: tempFilePath
        })
      }
      else {
        that.setData({
          middleImage: tempFilePath
        })
      }

      wx.showLoading({
        title: '正在上传...',
      })
      wx.uploadFile({
        url: config.urls.setEquipmentImageUrl,
        filePath: tempFilePath,
        formData: { func: imageType, id: that.data.equipment.ID, path: "bywj" },
        name: userInfo.Id + getTimeStamp() + "." + extraName,
        success: res => {
          wx.hideLoading();
          console.log(res);
        },
        fail: res => {
          wx.hideLoading();
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

function getTime() {
  var date = new Date;
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var dateString = " " + appendZero(hour) + ":" + appendZero(minute) + ":" + appendZero(second);
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