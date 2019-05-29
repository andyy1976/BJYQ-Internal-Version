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
   
    // wx.request({
    //   url: 'http://localhost:8080/bjyqwx/Process/GetProcessList?userId=100',
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
    var that = this;
    // var data = { userId: wx.getStorageSync("currentUserId") };//315,280
    var data = { userId: wx.getStorageSync("userInfo").Id };
    util.getRequest(config.urls.getProcessListUrl, data, function (data,errCode) {
      console.log("errCode is : =====================================")
      console.log(errCode)
     if (errCode) {
       var processList = data;
       that.setData({
         processList: processList
       })
     }
    })
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