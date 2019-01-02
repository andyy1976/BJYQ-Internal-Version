
//前后宽限天数，完成时间，设备资料查询

const config = require("../../../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipment: {},
    today: "",
    beforeImage: "../../../images/addimage.png",
    middleImage: "../../../images/addimage.png",
    afterImage: "../../../images/addimage.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var equipment = JSON.parse(options.equipment) || {};
    if (equipment.BeforeImage){
      that.setData({
        beforeImage: config.urls.getImageUrl + equipment.BeforeImage
      })
      console.log("beforeImage:");
      console.log(that.data.beforeImage);
    }
    if (equipment.MiddleImage) {
      that.setData({
        middleImage: config.urls.getImageUrl + equipment.MiddleImage
      })
    }
    if (equipment.AfterImage){
      that.setData({
        afterImage: config.urls.getImageUrl + equipment.AfterImage
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

  submit: function (e) {
    console.log(e);
    // return;
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    var submitData = e.detail.value;
    submitData.id = that.data.equipment.ID;
    submitData.inputMan = userInfo.UserName;
    submitData.inputDate = that.data.today;
    submitData.serverUrl = config.urls.setEquipmentUrl;
    console.log(submitData);
    // return;
    wx.showLoading({
      title: '正在提交...',
    })
    wx.request({
      url: config.urls.cloudUrl,
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
            content: '提交成功，点击确定返回设备列表',
            showCancel: false,
            success: res => {
              wx.reLaunch({
                url: '../equipment/equipment',
              })
            }
          })
        }
        else {
          wx.showModal({
            title: '提示',
            content: '发生未知错误，请稍后重试',
            showCancel: false
          })
        }
      },
      fail: res => {
        console.log(res);
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '发生未知错误，请稍后重试',
          showCancel: false
        })
      }
    })
  },

  beforeImageTaped: function () {
    var that = this;
    if (that.data.equipment.IsDone == "1"){
      previewImage(config.urls.getImageUrl + that.data.equipment.BeforeImage);
    }
    else {
      selectAndUploadImage(this, "before");
    }
  },
  middleImageTaped: function () {
    var that = this;
    if (that.data.equipment.IsDone == "1") {
      previewImage(config.urls.getImageUrl + that.data.equipment.MiddleImage);
    }
    else {
      selectAndUploadImage(this, "middle");
    }
  },

  afterImageTaped: function () {
    var that = this;
    if (that.data.equipment.IsDone == "1") {
      previewImage(config.urls.getImageUrl + that.data.equipment.AfterImage);
    }
    else {
      selectAndUploadImage(this, "after");
    }
    
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


function previewImage (imageUrl) {
  wx.previewImage({
    urls: [imageUrl],
  })
}

function selectAndUploadImage (that,imageType) {
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
      if (imageType == "before"){
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
        url: config.urls.cloudImageUrl,
        filePath: tempFilePath,
        formData: { func: imageType, id: that.data.equipment.ID, serverUrl: config.urls.setEquipmentImageUrl },
        name: userInfo.Id + getTimeStamp() + "." + extraName,
        // name: "equipment" + imageType + userInfo.UserName + getTimeStamp() + "." + extraName,
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