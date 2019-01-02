// pages/spotDetail/spotDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proprietor: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var proprietor = JSON.parse(options.proprietor);
    that.setData({
      proprietor: proprietor
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

  phoneCall: function (e) {
    var phoneNumber = e.currentTarget.dataset.phone;
    phoneNumber = phoneNumber.substring(0, 11);
    console.log(phoneNumber);
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
    })
  },
  emergencyPhoneCall: function (e) {
    var phoneNumber = e.currentTarget.dataset.phone;
    phoneNumber = phoneNumber.substring(0, 11);
    console.log(phoneNumber);
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
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