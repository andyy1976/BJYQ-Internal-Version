
const config = require("../../../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statistics: {},
    level: "",
    currentChoose: 0,
    choose: [
      { isChoose: "choose", name: "当月", num: 0 },
      { isChoose: "nonchoose", name: "近两个月", num: 1 },
      { isChoose: "nonchoose", name: "近三个月", num: 2 },
      { isChoose: "nonchoose", name: "近四个月", num: 3 },
    ],
    personalHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    getRepairStatistics(that);
  },

  chooseTaped: function (e) {
    console.log(e);
    var that = this;
    var index = parseInt(e.currentTarget.id);
    var chooses = that.data.choose;
    var currentChoose = that.data.currentChoose;
    chooses[currentChoose].isChoose = "nonchoose";
    chooses[index].isChoose = "choose";
    console.log(chooses);
    that.setData({
      currentChoose: index,
      choose: chooses
    })
    getRepairStatistics(that);
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
    var level = e.currentTarget.dataset.level;
    var thatStatistics = that.data.statistics;
    var statistics = level == "接单人" ? thatStatistics.repairStatisticsPersonal[index] :thatStatistics.repairStatisticsProject[index];
    var stringStatistics = JSON.stringify(statistics);
    wx.navigateTo({
      url: '../workOrderStatisticsDetail/workOrderStatisticsDetail?level=' + level + "&statistics=" + stringStatistics,
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


function getRepairStatistics (that) {
  var userInfo = wx.getStorageSync("userInfo");
  var level = userInfo.Level[userInfo.Level.length - 1];
  that.setData({
    level: level
  })
  var username = userInfo.UserCode;
  var before = that.data.currentChoose;
  var ztcode = wx.getStorageSync("currentZT").ZTCode;
  var submitData = {
    ztcode: ztcode,
    // ztcode: '01',
    level: level,
    // level: "一线",
    before: before,
    func: "工单统计",
    username: username,
    // username: "王建华",
    serverUrl: config.urls.getStatisticsUrl
  }
  wx.showLoading({
    title: '正在加载...',
  })
  wx.request({
    url: config.urls.cloudUrl,
    method: "POST",
    header: {'content-type': 'application/x-www-form-urlencoded;charset=uft-8'},
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
      }
      else {
        if (res.data.result == "未查询到任何数据"){
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