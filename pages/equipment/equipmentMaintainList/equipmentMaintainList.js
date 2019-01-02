// pages/equipment/equipmentMaintain/equipmentMaintain.js
const config = require("../../../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var Number = options.Number;
    GetEquipmentMaintainInfo(that, Number);
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
    var equipment = that.data.equipments[parseInt(e.currentTarget.id)];
    if (equipment) {
      wx.navigateTo({
        url: '../equipmentDetail/equipmentDetail?equipment=' + JSON.stringify(equipment),
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '获取设备详情失败,请稍后重试',
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


function GetEquipmentMaintainInfo(that, Number) {
  wx.showLoading({
    title: '正在加载...',
  })
  wx.request({
    url: config.urls.cloudUrl,
    method: "POST",
    header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
    data: { operationNumber: Number, serverUrl: config.urls.equipmentMaintainSearchUrl },
    success: res => {
      wx.hideLoading();
      console.log(res);
      if (res.data.status == "Success") {
        that.setData({
          equipments: res.data.data,
        })
      }
      else if (res.data.status == "Fail" && res.data.result == "未查询到任何记录") {
        wx.showModal({
          title: '提示',
          content: '该设备暂无待保养记录',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })
      }
      else {
        wx.showModal({
          title: '提示',
          content: '发生未知错误，请稍后重试',
          showCancel: false
        })
      }
    },
    fail: res => {
      wx.hideLoading();
      console.log(res);
    }
  })
}