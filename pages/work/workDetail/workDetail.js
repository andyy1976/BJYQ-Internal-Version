const config = require("../../../utils/config.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    repairOrder: {},
    toDay: '',
    beforeImage: [],
    afterImage: [],
    // reasonHidden: true,
    // chargeHidden: true,
    caution: "",
    status: ""
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    var repairOrder = JSON.parse(options.repairOrder);
    repairOrder.isLate = repairOrder.status == "维修延期" ? true : false;
    that.setData({
      status: options.status,
      reasonHidden: !repairOrder.isLate,
      chargeHidden: !(repairOrder.ChargeType == '收费')
    })
    var beforeImages = [];
    var afterImages = [];
    for (var i = 0; i < 3; i++) {
      beforeImages.push(repairOrder.BeforeImage[i] ? config.urls.getImageUrl + repairOrder.BeforeImage[i] : "");
      afterImages.push(repairOrder.AfterImage[i] ? config.urls.getImageUrl + repairOrder.AfterImage[i] : "../../../images/addimage.png");
    }
    that.setData({//设置占位图片
      beforeImage: beforeImages,
      afterImage: afterImages
    })
    that.setData({
      repairOrder: repairOrder || {},
      toDay: util.getDateTime()
    })
    

  },

/**
 * 是否延期
 */
  isLateChange: function(e) {
    console.log(e);
    var that = this;
    if (e.detail.value == "是"){
      that.setData({
        // reasonHidden: false,
        "repairOrder.isLate": e.detail.value,
        "repairOrder.status": "维修延期"
      })
    }
    else{
      that.setData({
        // reasonHidden: true,
        "repairOrder.isLate": e.detail.value,
        "repairOrder.status": "维修中",
        "repairOrder.LateReason": "",
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

  checkIdentity: function(e) {
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

  chargeTypeChange: function(e){
    var that = this;
    console.log(e);
    that.setData({"repairOrder.ChargeType": e.detail.value});
  },

  isPaidChange:function(e) {

  },

  phoneCall: function (e) {
    console.log(e);
    util.call(e.target.dataset.phoneNumber);
    // wx.makePhoneCall({
    //   phoneNumber: e.target.dataset.phoneNumber,
    //   fail: res => {
    //     wx.showModal({
    //       title: '提示',
    //       content: '拨号功能暂不可用',
    //       showCancel: false
    //     })
    //   }
    // })
  },

  datepickerBindchange: function (e) {
    var that = this;
    console.log(e);
    var repairOrder = that.data.repairOrder;
    switch (parseInt(e.target.id)) {
      case 100: {
        var arriveTime = util.getDate() + " " + e.detail.value + ":00";
        if (arriveTime <= repairOrder.RepairTime){
          util.showSign("到场时间不能早于派工时间，请核实后填写");
          return;
        }
        repairOrder.ArriveTime = arriveTime;
        that.setData({
          "repairOrder.ArriveTime": repairOrder.ArriveTime,
          "repairOrder.status": "已现场确认",
        })
        console.log(that.data.repairOrder);
        break;
      }
      case 200: {
        var completeTime = util.getDate() + " " + e.detail.value + ":00";
        if (!repairOrder.ArriveTime){
          util.showSign("到场时间未填写，请核实后填写");
          return;
        }
        if (completeTime <= repairOrder.ArriveTime) {
          util.showSign("完成时间不能早于到场时间，请核实后填写");
          return;
        }
        repairOrder.CompleteTime = completeTime;
        that.setData({
          "repairOrder.CompleteTime": repairOrder.CompleteTime,
          "repairOrder.status": "已完成"
        })
        break;
      }
      case 300: {
        repairOrder.LateTime = e.detail.value;
        that.setData({
          "repairOrder.LateTime": repairOrder.LateTime,
        })
        break;
      }
    }
  },

  submit: function (e) {
    var that = this;
    var repairOrder = that.data.repairOrder;
    var submitData = e.detail.value;
    submitData.sessionId = wx.getStorageSync("sessionId");
    submitData.arriveTime = submitData.arriveTime.replace(/-/g, "/");
    submitData.completeTime = submitData.completeTime.replace(/-/g, "/");
    submitData.id = that.data.repairOrder.Id;
    submitData.status = repairOrder.isLate == "是" ? "维修延期" : repairOrder.status;
    // submitData.lateReason = repairOrder.lateReason;
    submitData.serverUrl = config.urls.setWorkOrderUrl;
    console.log(submitData);
    if (!checkSubmitData(submitData)){return;}
    util.setRequest(config.urls.cloudUrl,submitData,function(status,data){
      if (status == "success"){util.showTip("提交成功");}
    });
  },

  beforeImageTaped: function (e) {
    console.log(e);
    var that = this;
    var index = parseInt(e.target.id);
    console.log("beforeImage");
    console.log(that.data.repairOrder.BeforeImage[index]);
    if (!that.data.repairOrder.BeforeImage[index]){return;}
    util.previewImage(config.urls.getImageUrl + that.data.repairOrder.BeforeImage[index]);
  },

  afterImageTaped: function (e) {
    var that = this;
    var index = parseInt(e.target.id);
    selectAndUploadImage(this, "after", index);
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




function selectAndUploadImage(that, imageType, id) {
  var userInfo = wx.getStorageSync("userInfo");
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      console.log(res);
      // return;
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      var tempFilePath = res.tempFilePaths[0];
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
      var formData = { func: imageType, index: id + 1, id: that.data.repairOrder.Id, serverUrl: config.urls.setRepairImageUrl };
      util.uploadImage(config.urls.cloudImageUrl,tempFilePath,formData);
      // wx.showLoading({
      //   title: '正在上传...',
      // })
      // wx.uploadFile({
      //   url: config.urls.cloudImageUrl,
      //   filePath: tempFilePath,
      //   formData: { func: imageType, index: id + 1, id: that.data.repairOrder.Id, serverUrl: config.urls.setRepairImageUrl },
      //   name: imageName,
      //   success: res => {
      //     wx.hideLoading();
      //     console.log(res);
      //   },
      //   fail: res => {
      //     wx.hideLoading();
      //     wx.showModal({
      //       title: '提示',
      //       content: '上传失败，请稍后重试',
      //       showCancel: false
      //     })
      //     console.log(res);
      //   }
      // })
    }
  })
}


function checkSubmitData(value) {
  if (value.chargeType == '收费' && value.isPaid == '否'){
    wx.showModal({
      title: '提示',
      content: '当前收费类别为收费，但尚未完成后续交费，请联系客服专员操作。',
      showCancel: false,
    })
    return false;
  }
  else {
    return true;
  }
}

