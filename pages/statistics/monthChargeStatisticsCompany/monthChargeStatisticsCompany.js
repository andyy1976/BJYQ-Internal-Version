const config = require("../../../utils/config.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allTotal : {
      allFooting: 0,
      cashFooting: 0,
      checkFooting: 0,
      otherFooting: 0,
      overdueFineFooting: 0,
      reduceDepositFooting: 0,
    },
    statistics: {},
    startDate: util.getYearMonth() + "-01",
    endDate: util.getDate(),
    level: "",
    projectTotal: null,
    // personalHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    getMonthChargeStatistics(that);
  },

  // viewTaped: function (e) {
  //   var that = this;
  //   console.log(e);
  //   var index = e.currentTarget.id;
  //   var level = that.data.level;
  //   var thatStatistics = that.data.statistics;
  //   var statistics = thatStatistics.csProjects[index];
  //   var stringStatistics = JSON.stringify(statistics);
  //   wx.navigateTo({
  //     url: '../chargeStatisticsProject/chargeStatisticsProject?level=' + level + "&statistics=" + stringStatistics,
  //   })
  // },

  toProjects: function(e) {
    var that = this;
    var projectTotal = that.data.projectTotal;
    wx.navigateTo({
      url: '../monthChargeProjectList/monthChargeProjectList?projectTotal=' + JSON.stringify(projectTotal) + "&startDate=" + that.data.startDate + "&endDate=" + that.data.endDate,
    })
  },

  bindStartDateChange: function (e) {
    var that = this;
    console.log(e);
    var date = e.detail.value;
    that.setData({
      startDate: date
    })
    getMonthChargeStatistics(that);
  },

  bindEndDateChange: function (e) {
    var that = this;
    console.log(e);
    var date = e.detail.value;
    that.setData({
      endDate: date
    })
    getMonthChargeStatistics(that);
  },

})


function getMonthChargeStatistics(that) {
  // var userInfo = wx.getStorageSync("userInfo");
  // var level = userInfo.Level[userInfo.Level.length - 1];
  that.setData({
    level: '公司'
  })
  // var username = userInfo.UserCode;
  // var startMonth = "201709";
  // var dateTemp = that.data.date;
  // var dateArr = dateTemp.split('-');
  // var date = "" + dateArr[0] + dateArr[1];
  var startTime = that.data.startDate;
  var endTime = that.data.endDate;
  var ztcode = wx.getStorageSync("currentZT").ZTCode;
  var submitData = {
    ztcode: ztcode,
    level: '公司',
    startTime: startTime,
    endTime: endTime,
    // serverUrl: config.urls.getStatisticsUrl
  }
  wx.showLoading({
    title: '正在加载...',
  })
  wx.request({
    url: config.urls.getMonthChargeStatisticsUrl,
    method: "POST",
    header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
    data: submitData,
    success: res => {
      wx.hideLoading();
      console.log(res);
      if (res.data.status == "Success") {
        if (res.data.data) {
          var allTotal = {
            allFooting: 0,
            cashFooting: 0,
            checkFooting: 0,
            otherFooting: 0,
            overdueFineFooting: 0,
            reduceDepositFooting: 0,
          };
          for (let i = 0; i < res.data.data.company.length; i++) {
            allTotal.allFooting = Number((allTotal.allFooting + res.data.data.company[i].allFooting).toFixed(2));
            allTotal.cashFooting = Number((allTotal.cashFooting + res.data.data.company[i].cashFooting).toFixed(2));
            allTotal.checkFooting = Number((allTotal.checkFooting + res.data.data.company[i].checkFooting).toFixed(2));
            allTotal.otherFooting = Number((allTotal.otherFooting + res.data.data.company[i].otherFooting).toFixed(2));
            allTotal.overdueFineFooting = Number((allTotal.overdueFineFooting + res.data.data.company[i].overdueFineFooting).toFixed(2));
            allTotal.reduceDepositFooting = Number((allTotal.reduceDepositFooting + res.data.data.company[i].reduceDepositFooting).toFixed(2));
          }
          that.setData({
            statistics: res.data.data.company,
            projectTotal: res.data.data.projects,
            allTotal: allTotal
          })
        }
        else {
          wx.showToast({
            title: "未发现任何数据",
            icon: "none"
          })
          that.setData({
            statistics: null
          })
        }
      }
      else {
        wx.showToast({
          title: res.data.result,
          icon: "none"
        })
        that.setData({
          statistics: null
        })
      }
    },
    fail: res => {
      console.log(res);
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '发生未知错误，请稍后重试',
        showCancel: false
      })
      that.setData({
        statisticsProject: null
      })
    }
  })
}

