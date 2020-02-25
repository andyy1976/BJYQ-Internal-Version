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
      showValue: "财务_月收费统计",
      navPage: "../monthChargeStatistics/monthChargeStatistics",//财务_月收费统计
    },
    {
      imgSrc: "../../../images/shoufei.png",
      bindtap: "imageTouched",
      showValue: "财务_未收_欠款情况汇总",
      // navPage: "../workOrderStatistics/workOrderStatistics",//财务_未收_欠款情况汇总
    },
    {
      imgSrc: "../../../images/shoufei.png",
      bindtap: "imageTouched",
      showValue: "物业费收费情况统计",
      // navPage: "../equipmentStatistics/equipmentStatistics",//设备统计
    },
    {
      imgSrc: "../../../images/shoufei.png",
      bindtap: "imageTouched",
      showValue: "收入支出情况表",
      // navPage: "../IncomeAndExpenseStatistics/IncomeAndExpenseStatistics",//设备统计
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
    if (func == "财务_未收_欠款情况汇总") {
      if (level == "公司") {
        wx.navigateTo({
          url: '../arrearageStatisticsCompany/arrearageStatisticsCompany',
        })
      }
      else {
        wx.navigateTo({
          url: '../arrearageStatisticsProject/arrearageStatisticsProject',
        })
      }
      return;
    }


    if (func == "财务_月收费统计") {
      if (level == "公司") {
        wx.navigateTo({
          url: '../monthChargeStatisticsCompany/monthChargeStatisticsCompany',
        })
      }
      else if (level == "项目经理") {
        wx.navigateTo({
          url: '../monthChargeStatistics/monthChargeStatistics',
        })
      }
      else {
        wx.showToast({
          title: '没有此权限',
          icon: "none"
        })
      }
      return;
    }

    if (func == "物业费收费情况统计") {
      if (level == "公司") {
        wx.navigateTo({
          url: '../chargeStatisticsCompany/chargeStatisticsCompany',
        })
      }
      else if (level == "项目经理") {
        wx.navigateTo({
          url: '../chargeStatisticsProject/chargeStatisticsProject',
        })
      }
      else {
        wx.showToast({
          title: '没有此权限',
          icon: "none"
        })
      }
      return;
    }

    if (func == "收入支出情况表") {
      if (level == "公司") {
        wx.navigateTo({
          url: '../IncomeAndExpenseStatistics/IncomeAndExpenseStatistics',
        })
      }
      else {
       wx.showModal({
         title: '提示',
         content: '没有此权限',
         showCancel: false
       })
      }
      return;
    }

    wx.navigateTo({
      url: that.data.icons[e.currentTarget.id].navPage,
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