const config = require("../../../utils/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    repairList: [],
    doneTime: true,
    repairTime: false,
    currentSortType:"完成时间",
    filtrateList: ["全部", "已完成", "业主已确认", "已回访"],//状态筛选
    filtrateIndex: 0,
    filtrateRepairOrder: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
 * 筛选工单状态
 */
  filtrateStatus: function (e) {
    var that = this;
    var repairList = that.data.repairList;
    console.log(e);
    var index = e.detail.value;
    that.setData({
      filtrateIndex: parseInt(index)
    })
    switch (index) {
      case "0":
        filtrateRepairOrder(repairList, "全部", that);
        break;
      case "1":
        filtrateRepairOrder(repairList, "已完成", that);
        break;
      case "2":
        filtrateRepairOrder(repairList, "业主已确认", that);
        break;
      case "3":
        filtrateRepairOrder(repairList, "已回访", that);
        break;
    }
  },

  toDoneWorkOrder: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    getRepairList(that);
  },

  viewTaped: function (e) {
    var that = this;
    console.log(e);
    var repairOrder = that.data.repairList[e.currentTarget.id] || {};
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
        url: '../workDetail/workDetail?status=done&repairOrder=' + JSON.stringify(repairOrder),
        // url: '../doneWorkDetail/doneWorkDetail?repairOrder=' + JSON.stringify(repairOrder),
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

  // switchViewTaped: function (e) {
  //   var that = this;
  //   switch (e.currentTarget.id) {
  //     case "dai": {
  //       if (that.data.dai == "choose") {
  //         return;
  //       }
  //       that.setData({
  //         dai: "choose",
  //         yi: "nonChoose",
  //         daiPage: 1
  //       })
  //       getRepairList(that, "已受理");
  //       break;
  //     }
  //     case "yi": {
  //       if (that.data.yi == "choose") {
  //         return;
  //       }
  //       that.setData({
  //         yi: "choose",
  //         dai: "nonChoose",
  //         yiPage: 1
  //       })
  //       getRepairList(that, "已完成");
  //       break;
  //     }

  //   }
  // },

  scrolltoupper: function () {
    var that = this;
    getRepairList(that);
  },

  sortTextTaped: function (e){
    var that = this;
    console.log(e);
    if (e.target.id == "done"){
      that.setData({
        currentSortType: "完成时间",
        doneTime: true,
        repairTime: false,
      })
    }
    else {
      that.setData({
        currentSortType: "报修时间",
        doneTime: false,
        repairTime: true,
      })
    }

    getRepairList(that);
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


function getRepairList(that) {
  var app = getApp();
  var ztInfo = wx.getStorageSync("currentZT") || {};
  var data = {
    userCode: wx.getStorageSync("userInfo").UserCode,
    ztcode: ztInfo ? ztInfo.ZTCode : "",
    status: "已完成",
    orderType: that.data.currentSortType,
    serverURL: config.urls.getWorkOrderUrl
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
      wx.hideLoading();
      console.log(res);
      if (res.data.status == "Fail") {
        if (res.data.result == "未查询到任何数据"){
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
      var repairList = res.data.data || [];
      if (repairList) {
        filtrateRepairOrder(repairList, that.data.filtrateList[that.data.filtrateIndex], that);
      }
      that.setData({
        repairList: repairList
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

function filtrateRepairOrder(repairList, status, that) {
  var filtrateRepairOrder = [];
  if (status == "全部") {
    filtrateRepairOrder = repairList;
  }
  else {
    for (var i = 0; i < repairList.length; i++) {
      if (repairList[i].status == status) {
        filtrateRepairOrder.push(repairList[i]);
      }
    }
  }
  that.setData({
    filtrateRepairOrder: filtrateRepairOrder
  })
}