const config = require("../../../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestPayment: null,
    toDay: '',
   
    reasonHidden: true,
    chargeHidden: true,
    approvalResult: ['同意','不同意'],
    deputyApprovalResult: ["同意（运营费<5000）","同意，送郑总审批（运营费>=5000）","不同意"],
    arIndex:0,
    darIndex: 0,
    userName: null
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    var requestPayment = JSON.parse(options.requestPayment);
    var userInfo = wx.getStorageSync("userInfo");
    that.setData({
      requestPayment: requestPayment || {},
      userName: userInfo.UserCode
    })


  },

  /**
   * 是否延期
   */
  // isLateChange: function (e) {
  //   console.log(e);
  //   var that = this;
  //   if (e.detail.value == "是") {
  //     that.setData({
  //       reasonHidden: false,
  //       "repairOrder.isLate": e.detail.value,
  //       "repairOrder.status": "维修延期"
  //     })
  //   }
  //   else {
  //     that.setData({
  //       reasonHidden: true,
  //       "repairOrder.isLate": e.detail.value,
  //       "repairOrder.status": "维修中",
  //       "repairOrder.LateReason": "",
  //       "repairOrder.LateReason": ""
  //     })
  //   }

    // if (e.detail.value == "是"){
    //   that.setData({
    //     "repairOrder.isLate": "维修延期",
    //   })
    // }
    // else{
    //   that.setData
    // }
  // },

  // checkIdentity: function (e) {
  //   var that = this;
  //   if (that.data.repairOrder.Identity == "维修工") {
  //     wx.showModal({
  //       title: '提示',
  //       content: '无操作权限，请联系客服专员进行操作',
  //       showCancel: false,
  //     })
  //     return;
  //   }
  // },

  // chargeTypeChange: function (e) {

  //   console.log(e);
  //   that.setData({
  //     chargeHidden: e.detail.value == "免费",
  //     // "repairOrder.ChargeType": e.detail.value,
  //     // "repairOrder.ChargeType": e.detail.value,
  //   })
  // },

  // isPaidChange: function (e) {

  // },

  // phoneCall: function (e) {
  //   console.log(e);
  //   wx.makePhoneCall({
  //     phoneNumber: e.target.dataset.phoneNumber,
  //     fail: res => {
  //       wx.showModal({
  //         title: '提示',
  //         content: '拨号功能暂不可用',
  //         showCancel: false
  //       })
  //     }
  //   })
  // },

  datepickerBindchange: function (e) {

    var that = this;
    console.log(e);
    if (e.target.id == "100"){
      that.setData({
        darIndex: e.detail.value
      })
    }
    else {
      that.setData({
        arIndex: e.detail.value
      })
    }
  },

  submit: function (e) {
    console.log(e);
    // return;
    var that = this;
    var data = e.detail.value;
    var userName = that.data.userName;
    // userName = '李军';
    var rp = that.data.requestPayment;
    var submitData = null;
    if (userName == "李军"){
      submitData = {
        userName: '李军',
        result: data.deputyApprovalResult,
        leaveWord: data.deputyLeaveWord,
        opinion: data.deputyOpinion,
        id: rp.id,
        registerId: rp.registerId,
        // businessId: rp.businessId,
        linkId: rp.linkId,
        documentId: rp.documentId,
        documentNumber: rp.documentNumber,
        
        // userId: rp.userId,
        // lastId: rp.lastId,
        serverUrl: config.urls.setRequestPaymentFlowUrl
      }
    }
    else {
      submitData = {
        userName: '郑永军',
        result: data.approvalResult,
        leaveWord: data.leaveWord,
        opinion: data.opinion,
        id: rp.id,
        registerId: rp.registerId,
        // businessId: rp.businessId,
        linkId: rp.linkId,
        documentId: rp.documentId,
        documentNumber: rp.documentNumber,

        // userId: rp.userId,
        // lastId: rp.lastId,
        serverUrl: config.urls.setRequestPaymentFlowUrl
      }
    }
    console.log(submitData);
    // return;
    wx.showLoading({
      title: '正在提交...',
    })
    wx.request({
      url: config.urls.setRequestPaymentFlowUrl,
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