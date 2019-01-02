// pages/statistics/statistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // pageHidden: false,
    // coverViewShow: true,
    // password: "",
    icons: [{
      imgSrc: "../../../images/shoufei.png",
      bindtap: "imageTouched",
      showValue: "收费统计",
      navPage: "../chargeStatisticsCompany/chargeStatisticsCompany",//工单统计
    },
    {
      imgSrc: "../../../images/gongdan.png",
      bindtap: "imageTouched",
      showValue: "工单统计",
      navPage: "../workOrderStatistics/workOrderStatistics",//工单统计
    },
    {
      imgSrc: "../../../images/shebei.png",
      bindtap: "imageTouched",
      showValue: "设备统计",
      navPage: "../equipmentStatistics/equipmentStatistics",//设备统计
    },
      {
        imgSrc: "../../../images/guzhang.png",
        bindtap: "imageTouched",
        showValue: "设备故障统计",
        navPage: "../equipmentTroubleStatistics/equipmentTroubleStatistics",//设备统计
      },
    {
      imgSrc: "../../../images/tousu.png",
      bindtap: "imageTouched",
      showValue: "投诉统计",
      navPage: "../complainStatistics/complainStatistics",//投诉统计
    },
    ],
    navPages: [
      
      
      
    ],
    // userInfo: {},
    // currentZT: { "ZTCode": "100000", "ZTName": "燕侨苏州" }
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
   * 点击界面中间图标，进入相应功能界面
   */
  imageTouched: function (e) {
    var that = this;
    console.log(e);
    if (!wx.getStorageSync("userInfo")) {
      wx.showModal({
        title: '提示',
        content: '未能查询到您的账号信息，请点击确定进行登录',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login',
            })
          }
        }
      })
    }
    var userInfo = wx.getStorageSync("userInfo");
    console.log(e.target.id);
    var func = e.currentTarget.dataset.func;
    var level = userInfo.Level[userInfo.Level.length - 1];
    var username = userInfo.UserCode;
    var ztcode = wx.getStorageSync("currentZT").ZTCode;
    if (func == "设备统计" && level == "一线") {
      wx.showModal({
        title: '提示',
        content: '没有此权限',
        showCancel: false,
      })
      return;
    }
    // if (func == "设备故障统计" && level == "一线") {
    //   wx.showModal({
    //     title: '提示',
    //     content: '没有此权限',
    //     showCancel: false,
    //   })
    //   return;
    // }
    if (func == "收费统计"){
      if (level == "公司"){
        wx.navigateTo({
          url: '../chargeStatisticsCompany/chargeStatisticsCompany',
        })
      }
      else if (level == "一线"){
        wx.navigateTo({
          url: '../chargeStatisticsGroup/chargeStatisticsGroup',
        })
      }
      else {
        wx.navigateTo({
          url: '../chargeStatisticsProject/chargeStatisticsProject',
        })
      }
      return;
    }

    wx.navigateTo({
      url: that.data.icons[e.target.id].navPage,
    })


    // if (!userInfo.Jurisdiction) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '还没有为您配置任何权限，请联系管理处',
    //     showCancel: false
    //   })
    //   return;
    // }
    // for (var i = 0; i < userInfo.Jurisdiction.length; i++) {
    //   if (func == userInfo.Jurisdiction[i]) {
    //     wx.navigateTo({
    //       url: that.data.navPages[e.target.id - 1],
    //     })
    //     return;
    //   }
    // }
    // wx.showModal({
    //   title: '提示',
    //   content: '没有此权限',
    //   showCancel: false,
    // })
    // return;
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