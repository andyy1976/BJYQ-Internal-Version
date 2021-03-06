
const config = require("../../../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statistics: {},
    level: "",
    personalHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    if (options.statistics) {
      var level = options.level;
      var statistics = JSON.parse(options.statistics);
      console.log(statistics);
      that.setData({
        level: level,
        statistics: statistics,
      })
      console.log(that.data.level);
    }
    else {
      getChargeStatistics(that);
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

  viewTaped: function (e) {
    var that = this;
    console.log(e);
    var index = e.currentTarget.id;
    var level = that.data.level;
    var thatStatistics = that.data.statistics;
    var statistics = thatStatistics.csUnits[index];
    var stringStatistics = JSON.stringify(statistics);
    wx.navigateTo({
      url: '../chargeStatisticsUnit/chargeStatisticsUnit?level=' + level + "&statistics=" + stringStatistics,
    })
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


function getChargeStatistics(that) {
  var userInfo = wx.getStorageSync("userInfo");
  var level = userInfo.Level[userInfo.Level.length - 1];
  that.setData({
    level: level
  })
  var username = userInfo.UserCode;
  // var startMonth = "201709";
  var ztcode = wx.getStorageSync("currentZT").ZTCode;
  var submitData = {
    ztcode: ztcode,
    level: level,
    username: username,
    func: "收费统计",
    month: '201810',
    serverUrl: config.urls.getStatisticsUrl
  }
  wx.showLoading({
    title: '正在加载...',
  })
  wx.request({
    url: config.urls.getStatisticsUrl,
    method: "POST",
    header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
    data: submitData,
    success: res => {
      wx.hideLoading();
      console.log(res);
      if (res.data.status == "Success") {
        if (res.data.data) {
          that.setData({
            statistics: res.data.data,
            //  personalHidden: false
          })
        }
        return;
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
      else {
        wx.showModal({
          title: '提示',
          content: '发生未知错误，请稍后重试',
          showCancel: false
        })
        return;
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
      return;
    }
  })
}