const config = require("../../../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proprietorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var submitData = JSON.parse(options.queryInfo);
    var currentZT = wx.getStorageSync("currentZT"); 
    submitData.ztCode = currentZT.ZTCode;
    submitData.serverUrl = config.urls.getProprietorListUrl;
    console.log(submitData);
    wx.request({
      url: config.urls.getProprietorListUrl,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=uft-8'
      },
      data: submitData,
      success: res => {
        console.log(res);
        if (res.data.length == 0) {
          wx.showModal({
            title: '提示',
            content: '未查询到任何记录，请更改查询条件后重试',
            showCancel: false,
            success: function (){
              wx.navigateBack({
                delta: 1
              })
            }
          })
          return;
        }
        that.setData({
          proprietorList : res.data || []
        })
      },
      fail: res => {
        console.log(res);
      }
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

  viewTaped: function (e) {
    console.log(e);
    var that = this;
    var jsonProprietor = JSON.stringify(that.data.proprietorList[parseInt(e.currentTarget.id)]);
    wx.navigateTo({
      url: '../spotDetail/spotDetail?proprietor=' + jsonProprietor,
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