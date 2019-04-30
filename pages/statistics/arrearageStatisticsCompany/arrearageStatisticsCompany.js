const config = require("../../../utils/config.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statistics: {},
    date: getDate(),
    level: "",
    xyz: "choose",
    kfs: "nonChoose",
    type: "小业主",
    projects: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    getStatistics(that);
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

  switchViewTaped: function (e) {
    console.log("clicked")
    var that = this;
    switch (e.currentTarget.id) {
      case "小业主": {
        if (that.data.xyz == "choose") {
          return;
        }
        that.setData({
          xyz: "choose",
          kfs: "nonChoose",
          type: "小业主"
        })
        getStatistics(that);
        break;
      }
      case "开发商": {
        if (that.data.kfs == "choose") {
          return;
        }
        that.setData({
          xyz: "nonChoose",
          kfs: "choose",
          type: "开发商"
        })
        getStatistics(that);
        break;
      }
    }
  },

  viewTaped: function (e) {
    var that = this;
    console.log(e);
    // var index = e.currentTarget.id;
    // var level = that.data.level;
    // var thatStatistics = that.data.statistics;
    // var statistics = thatStatistics.csProjects[index];
    // var stringStatistics = JSON.stringify(statistics);
    wx.navigateTo({
      url: '../arrearageStatisticsProject/arrearageStatisticsProject?projects=' + JSON.stringify(that.data.projects) 
    })
  },

  bindDateChange: function (e) {
    var that = this;
    console.log(e);
    var date = e.detail.value;
    // var dateArr = e.detail.value.split('-');
    // var date = "" + dateArr[0] + "-" + dateArr[1];
    that.setData({
      date: date
    })
    getStatistics(that);
  },

})


function getStatistics(that) {
  var userInfo = wx.getStorageSync("userInfo");
  var level = userInfo.Level[userInfo.Level.length - 1];
  var type = that.data.type;
  that.setData({
    level: level
  })
  // var username = userInfo.UserCode;
  // var startMonth = "201709";
  var dateTemp = that.data.date;
  var dateArr = dateTemp.split('-');
  var date = "" + dateArr[0] + dateArr[1];
  var month = date;
  // var type = ;
  var ztcode = wx.getStorageSync("currentZT").ZTCode;
  var submitData = {
    ztcode: ztcode,
    level: level,
    month: month,
    type: type
  }
  wx.showLoading({
    title: '正在加载...',
  })
  wx.request({
    url: config.urls.getArrearageStatisticsUrl,
    method: "POST",
    header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
    data: submitData,
    success: res => {
      wx.hideLoading();
      console.log(res);
      if (res.data.status == "Success") {
        if (res.data.data) {
          that.setData({
            statistics: res.data.data,
            projects: res.data.data.projects,
          })
        } 
        else {
          wx.showToast({
            title: "未发现任何数据",
            icon: "none"
          })
          that.setData({
            statistics: null,
            projects: null,
          })
        }
      }
      else {
        wx.showToast({
          title: res.data.result,
          icon: "none"
        })
        that.setData({
          statistics: null,
          projects: null,
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
        statistics: null,
        projects: null,
      })
    }
  })
}



function getDate() {
  var date = new Date;
  var year = (Number(date.getFullYear()));
  var month = date.getMonth() + 1;
  var day
  var dateString = "" + year + "-" + appendZero(month);
  return dateString;
}

function appendZero(value) {
  if (Number(value) < 10) {
    return "0" + value;
  }
  else {
    return value;
  }
}