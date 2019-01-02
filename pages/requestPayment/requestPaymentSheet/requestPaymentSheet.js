const config = require("../../../utils/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestPaymentList: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    getRequestList(that);
  },

 

  viewTaped: function (e) {
    var that = this;
    console.log(e);
    var requestPayment = that.data.requestPaymentList[e.currentTarget.id] || {};
    console.log("requestPayment");
    console.log(requestPayment);
    if (requestPayment) {
      wx.navigateTo({
        url: '../requestPaymentDetail/requestPaymentDetail?requestPayment=' + JSON.stringify(requestPayment),
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '获取工单详情失败,请稍后重试',
        showCancel: false
      })
    }
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


function getRequestList(that) {
  var app = getApp();
  var data = {
    // userId: wx.getStorageSync("userInfo").Id,
    userId: 418,
    // userId: 354,
    serverURL: config.urls.getRequestPaymentSheetUrl
  }
  wx.showLoading({
    title: '加载中...',
  })
  wx.request({
    url: config.urls.cloudUrl,
    method: 'POST',
    data: data,
    header: {'content-type': 'application/x-www-form-urlencoded;charset=uft-8'},
    success: res => {
      console.log(res);
      wx.hideLoading();
      if (res.data.status == "Fail") {
        if (res.data.result == "未查询到任何数据") {
          wx.showModal({
            title: '提示',
            content: '当前不存在请款信息',
            showCancel: false
          })
          that.setData({
            requestPaymentList: [],
          })
          return;
        }
        wx.showModal({
          title: '提示',
          content: '发生未知错误，请稍后重试',
          showCancel: false
        })
        that.setData({
          requestPaymentList: [],
        })
        return;
      }
      // var repairList = res.data.data || [];
      // if (repairList) {
      //   filtrateRepairOrder(repairList, that.data.filtrateList[that.data.filtrateIndex], that);
      // }
      that.setData({
        requestPaymentList: res.data.data
      })
      computeSum(that);

      console.log("repairList is: ================================================")
      // console.log(that.data.repairList);
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
}

function filtrateRepairOrder(repairList, status, that) {
  var filtrateRepairOrder = [];
  if (status == "全部") {
    filtrateRepairOrder = repairList;
  }
  else {
    for (var i = 0; i < repairList.length; i++) {
      if (repairList[i].status == status) {
        filtrateRepairOrder.push(repairList[i]);
      }
    }
  }
  that.setData({
    filtrateRepairOrder: filtrateRepairOrder
  })
}


function computeSum(that) {
  var requestPaymentList = that.data.requestPaymentList;
  for (var j = 0; j < requestPaymentList.length; j++) {
    var itemOfExpenditures = requestPaymentList[j].itemOfExpenditures;
    var budgeNumber = "";
    var budgeRemainingSum = 0;
    var budgeUsableSum = 0;
    var itemName = "";
    var monthBudgeSum = 0;
    var paySum = 0;
    var requestSum = 0;
    var yearBudgeSum = 0;
    var yearRemainingSum = 0;
    for (var i = 0; i < itemOfExpenditures.length; i++) {
      budgeNumber += " " + itemOfExpenditures[i].budgeNumber;
      budgeRemainingSum += itemOfExpenditures[i].budgeRemainingSum;
      budgeUsableSum += itemOfExpenditures[i].budgeUsableSum;
      itemName += " " + itemOfExpenditures[i].itemName;
      monthBudgeSum += itemOfExpenditures[i].monthBudgeSum;
      paySum += itemOfExpenditures[i].paySum;
      requestSum += itemOfExpenditures[i].requestSum;
      yearBudgeSum += itemOfExpenditures[i].yearBudgeSum;
      yearRemainingSum += itemOfExpenditures[i].yearRemainingSum;
    }
    requestPaymentList[j].budgeNumber = budgeNumber;
    requestPaymentList[j].budgeRemainingSum = budgeRemainingSum;
    requestPaymentList[j].budgeUsableSum = budgeUsableSum;
    requestPaymentList[j].itemName = itemName;
    requestPaymentList[j].monthBudgeSum = monthBudgeSum;
    requestPaymentList[j].paySum = paySum;
    requestPaymentList[j].requestSum = requestSum;
    requestPaymentList[j].yearBudgeSum = yearBudgeSum;
    requestPaymentList[j].yearRemainingSum = yearRemainingSum;
  }
  that.setData({
    requestPaymentList: requestPaymentList
  })
}