const config = require("../../../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    report: null,
    level: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    var level = userInfo.Level[userInfo.Level.length - 1];
    if (level == '助理' || level == '项目经理') {
      wx.setNavigationBarTitle({
        title: '未按时处理设备故障',
      })
    }
    else {
      wx.setNavigationBarTitle({
        title: '各项目统计',
      })
    }

    that.setData({
      level: level
    })
    getEquipmentTroubleReport(that);
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
    var index = e.currentTarget.id;
    var ztcode = that.data.report[index].ztCode;
    wx.navigateTo({
      url: '../equipmentTroubleReport/equipmentTroubleReport?ztcode=' + ztcode,
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

function getEquipmentTroubleReport(that) {
  var userInfo = wx.getStorageSync("userInfo");
  var level = userInfo.Level[userInfo.Level.length - 1];
  that.setData({
    level: level
  })
  var username = userInfo.UserCode;
  // var before = that.data.currentChoose;
  var ztcode = wx.getStorageSync("currentZT").ZTCode;
  var submitData = {
    ztcode: ztcode,
    level: level,
    func: "设备故障上报",
    serverUrl: config.urls.getReportUrl
  }
  wx.showLoading({
    title: '正在加载...',
  })
  wx.request({
    url: config.urls.cloudUrl,
    method: "POST",
    header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
    data: submitData,
    success: res => {
      wx.hideLoading();
      console.log(res);
      if (res.data.status == "Success") {
        if (res.data.data) {
          that.setData({
            report: res.data.data,
            //  personalHidden: false
          })
        }
      }
      else {
        if (res.data.result == "未查询到任何数据") {
          that.setData({
            statistics: null,
            //  personalHidden: false
          })
          wx.showModal({
            title: '提示',
            content: '该时段内未查询到符合条件的数据',
            showCancel: false
          })
          return;
        }
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