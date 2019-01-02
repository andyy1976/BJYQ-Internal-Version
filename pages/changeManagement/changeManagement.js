// pages/changeManagement/changeManagement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Management: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user = wx.getStorageSync("userInfo");
    that.setData({
      Management: user.ZTInfo || []
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

  viewTap: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.id);
    var management = that.data.Management;
    wx.setStorageSync("currentZT", management[index]);
    wx.navigateBack({
      delta: 1
    })
    console.log(e);
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