// pages/statistics/statistics.js
const config = require("../../../utils/config.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    processList: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var data = { userId: wx.getStorageSync("currentUserId") };//315,280
    // var data = { userId: wx.getStorageSync("userInfo").UserId };
    util.getRequest("http://localhost:33079/Process/GetProcessList", data, function (data) {
      var processList = data;
      that.setData({
        processList: processList
      })
    })
    // wx.request({
    //   url: 'http://localhost:33079/Process/GetProcessList?userId=100',
    //   method: 'GET',
    //   success: res => {
    //     console.log(res);
    //     console.log(res.data.data);
    //     var that = this;
    //     that.setData({
    //       processList: res.data.data
    //     })
    //   },
    //   fail: res => {
    //     console.log(res);
    //   }
    // })
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
    var index = parseInt(e.currentTarget.id);
    var selectedProcess = that.data.processList[index];
    wx.setStorageSync('selectedProcess', selectedProcess);
    wx.navigateTo({
      url: '../processDetail/processDetail?process=' + JSON.stringify(selectedProcess),
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
})