// pages/myPatrolHistory/myPatrolHistory.js
const config = require("../../utils/config.js");
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    patrolList: []
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
    getPatrolList(that);
  },


  toPatrol: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },

  viewTaped: function (e) {
    var that = this;
    console.log(e);
    var patrol = that.data.patrolList[e.currentTarget.id] || {};
    console.log("patrol");
    console.log(patrol);
    if (patrol) {
      wx.navigateTo({
        url: '../patrolHistoryDetail/patrolHistoryDetail?patrol=' + JSON.stringify(patrol),
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


function getPatrolList(that) {
  var app = getApp();
  var ztInfo = wx.getStorageSync("currentZT") || {};
  var data = {
    name: wx.getStorageSync("userInfo").UserCode,
    classify: ztInfo ? ztInfo.ZTCode : "",
    serverURL: config.urls.getPatrolUrl
  }
  
  util.getRequest(config.urls.getPatrolUrl, data, function (data, errCode) {
    if (errCode) {
      var patrolList = data || [];
      that.setData({
        patrolList: patrolList
      })
    }
    else {
      that.setData({ patrolList: null });
    }
  })
 
}