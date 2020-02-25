const config = require("../../../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectTotal: null,
    startDate: null,
    endDate: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var projectTotal = JSON.parse(options.projectTotal);
    that.setData({
      projectTotal: projectTotal,
      startDate: options.startDate,
      endDate: options.endDate
    })
  },

  viewTaped: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.id);
    var ztCode = that.data.projectTotal[index].ztCode;
    wx.navigateTo({
      url: '../monthChargeStatistics/monthChargeStatistics?ztCode=' + ztCode + "&startDate=" + that.data.startDate + "&endDate=" + that.data.endDate,
    })
  },


})

