const config = require("../../../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChargeTitle : "",
    chargedList : [],
    submitData: {}
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
    // submitData.ztCode = '01';
    submitData.serverUrl = config.urls.getChargedListUrl;
    console.log(submitData);
    // if (submitData.isCharge == "已收") {
    //   wx.setNavigationBarTitle({
    //     title: '已收列表',
    //   })
    //   that.setData ({
    //     isChargeTitle : "已收总额"
    //   })
    // }
    // else {
    //   wx.setNavigationBarTitle({
    //     title: '未收列表',
    //   })

    //   that.setData({
    //     isChargeTitle: "未收总额"
    //   })
    // }
    that.setData({
      submitData : submitData
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
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: config.urls.getChargedListUrl,
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
      data: that.data.submitData,
      success: res => {
        wx.hideLoading();
        console.log(res);
        if (res.data.status == "Fail") {
          wx.showModal({
            title: '提示',
            content: '未查询到任何记录，请更改查询条件后重试',
            showCancel: false,
            success: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
          return;
        }
        that.setData({
          chargedList: res.data.data || []
        })
      },
      fail: res => {
        wx.hideLoading();
        console.log(res);
      }
    })
  },

  /**
   * 点击子view，显示费用详情
   */
  viewTaped: function (e) {
    console.log(e);
    var that = this;
    var charge = that.data.chargedList[parseInt(e.currentTarget.id)];
    var submitData = that.data.submitData;
    charge.startMonth = submitData.startMonth;
    charge.endMonth = submitData.endMonth;
    var jsonCharged = JSON.stringify(charge);
    // if (that.data.isChargeTitle == "已收总额") {
      wx.navigateTo({
        url: '../chargedDetail/chargedDetail?charged=' + jsonCharged,
      })
    // }
    // else {
    //   wx.navigateTo({
    //     url: '../chargeDetail/chargeDetail?charged=' + jsonCharged,
    //   })
    // }
  },
})