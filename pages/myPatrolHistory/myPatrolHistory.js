// pages/myPatrolHistory/myPatrolHistory.js
const config = require("../../utils/config.js");
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

  viewTaped: function (e) {
    var that = this;
    console.log(e);
    var repairOrder = that.data.patrolList[e.currentTarget.id] || {};
    console.log("repairOrder");
    console.log(repairOrder);
    if (repairOrder) {
      // if (repairOrder.IsRead == 0) {
      //   wx.request({
      //     url: config.urls.cloudUrl,
      //     method: "POST",
      //     header: {
      //       'content-type': 'application/x-www-form-urlencoded;charset=uft-8'
      //     },
      //     data: { id: repairOrder.Id, serverUrl: config.urls.setWorkOrderIsReadUrl },
      //     success: res => {
      //       console.log(res);
      //     },
      //     fail: res => {
      //       console.log(res);
      //     }
      //   })
      // }
      wx.navigateTo({
        url: '../work/doneWorkDetail/doneWorkDetail?repairOrder=' + JSON.stringify(repairOrder),
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
  wx.showLoading({
    title: '加载中...',
  })
  wx.request({
    url: config.urls.cloudUrl,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=uft-8'
    },
    success: res => {
      console.log(res);
      wx.hideLoading();
      if (res.data.status == "Fail") {
        if (res.data.result == "未查询到任何数据") {
          wx.showModal({
            title: '提示',
            content: '未查询到任何数据',
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
      var patrolList = res.data.data || [];
      // if (repairList) {
      //   filtrateRepairOrder(repairList, that.data.filtrateList[that.data.filtrateIndex], that);
      // }
      that.setData({
        patrolList: patrolList
      })
      console.log("repairList is: ================================================")
      console.log(that.data.repairList);
    },
    fail: res => {
      console.log(res);
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '发生未知错误，请稍后重试',
        showCancel: false
      })
    }
  })
}