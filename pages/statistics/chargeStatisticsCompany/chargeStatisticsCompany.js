
const config = require("../../../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statisticsCompany: null,
    statisticsProject: [],
    date: getDate(),
    level: "",
    personalHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    getChargeStatistics(that);
  },

  bindDateChange: function (e) {
    var that = this;
    console.log(e);
    var date = e.detail.value;
    that.setData({
      date: date
    })
    getChargeStatistics(that);
  }

})


function getChargeStatistics(that) {
  var userInfo = wx.getStorageSync("userInfo");
  var level = userInfo.Level[userInfo.Level.length - 1];
  that.setData({
    level: level
  })
  var dateTemp = that.data.date;
  var dateArr = dateTemp.split('-');
  var date = "" + dateArr[0] + dateArr[1];
  var ztcode = wx.getStorageSync("currentZT").ZTCode;
  var submitData = {
    ztcode: ztcode,
    level: level,
    month: date,
  }
  wx.showLoading({
    title: '正在加载...',
  })
  wx.request({
    url: config.urls.getChargeStatisticsUrl,
    method: "POST",
    header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
    data: submitData,
    success: res => {
      wx.hideLoading();
      console.log(res);
      if (res.data.status == "Success") {
        if (res.data.data) {
          that.setData({
            statisticsCompany: res.data.data.company,
            statisticsProject: res.data.data.project
          })
        }
        else {
          wx.showToast({
            title: "未发现任何数据",
            icon: "none"
          })
          that.setData({
            statisticsCompany: null,
            statisticsProject: null
          })
        }
      }
      else {
        wx.showToast({
          title: res.data.result,
          icon: "none"
        })
        that.setData({
          statisticsCompany: null,
          statisticsProject: null
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
        statisticsCompany: null,
        statisticsProject: null
      })
    }
  })
}



function getDate() {
  var date = new Date;
  var year = (Number(date.getFullYear()));
  var month = date.getMonth() + 1;
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