const config = require("../../../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    charged: {},
    chargedDetailList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var charged = JSON.parse(options.charged);
    charged.serverUrl = config.urls.getChargedDetailUrl;
    that.setData({
      charged: charged
    })
    console.log(charged);
    wx.request({
      url: config.urls.cloudUrl,
      method:"POST",
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
      data: charged,
      success: res => {
        console.log(res);
        var resData = res.data.data;
        if (resData) {
          that.setData({
            chargedDetailList:resData
          })
        }
        else {
          console.log("无数据");
        }
      },
      fail: res => {
        console.log(res);
      },
      Comment: res => {
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