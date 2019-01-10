const config = require("../../../utils/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    decorationList: [],
    repairsTime: true,//报修时间排序
    bookTime: false,//预约服务时间排序
    dispatchTime: false,//派工时间排序
    currentSortType: "报修时间",//当前排序方式
    filtrateList: ["全部", "已派单", "已现场确认", "维修中", "维修延期"],//状态筛选
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

  toDoneWorkOrder: function () {
    wx.navigateTo({
      url: '../doneWorkOrder/doneWorkOrder',
    })
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
        filtrateRepairOrder(repairList, "已派单", that);
        break;
      case "2":
        filtrateRepairOrder(repairList, "已现场确认", that);
        break;
      case "3":
        filtrateRepairOrder(repairList, "维修中", that);
        break;
      case "4":
        filtrateRepairOrder(repairList, "维修延期", that);
        break;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    getDecorationList(that);
  },

  sortTextTaped: function (e) {
    console.log(e);
    var that = this;
    switch (e.target.id) {
      case "repairs":
        that.setData({
          repairsTime: true,
          bookTime: false,
          dispatchTime: false,
          currentSortType: "报修时间"
        })
        getRepairList(that, "报修时间");
        break;
      case "book":
        that.setData({
          repairsTime: false,
          bookTime: true,
          dispatchTime: false,
          currentSortType: "预约服务时间"
        })
        getRepairList(that, "预约服务时间");
        break;
      case "dispatch":
        that.setData({
          repairsTime: false,
          bookTime: false,
          dispatchTime: true,
          currentSortType: "派工时间"
        })
        getRepairList(that, "派工时间");
        break;
    }
  },

  viewTaped: function (e) {
    var that = this;
    console.log(e);
    var decoration = that.data.decorationList[e.currentTarget.id] || {};
    console.log("decoration");
    console.log(decoration);
    if (decoration) {
      // if (decoration.IsRead == 0) {
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
        url: '../decorationDetail/decorationDetail?decoration=' + JSON.stringify(decoration),
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '获取装修详情失败,请稍后重试',
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
    getRepairList(that, that.data.currentSortType);
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


function getDecorationList(that) {
  var app = getApp();
  var ztInfo = wx.getStorageSync("currentZT") || {};
  var data = {
    // userCode: wx.getStorageSync("userInfo").UserCode,
    classify: ztInfo ? ztInfo.ZTCode : "",
    isDone: 0,
    // orderType: orderType,
    serverURL: config.urls.getDecorationListUrl
  }
  wx.showLoading({
    title: '加载中...',
  })
  wx.request({
    url: config.urls.getDecorationListUrl,
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
          that.setData({
            filtrateDecorationOrder: [],
          })
          return;
        }
        wx.showModal({
          title: '提示',
          content: '发生未知错误，请稍后重试',
          showCancel: false
        })
        that.setData({
          filtrateDecorationOrder: [],
        })
        return;
      }
      var decorationList = res.data.data || [];
      // if (decorationList) {
      //   filtrateRepairOrder(repairList, that.data.filtrateList[that.data.filtrateIndex], that);
      // }
      that.setData({
        decorationList: decorationList
      })
      console.log("decorationList is: ================================================")
      console.log(that.data.decorationList);
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

// function filtrateRepairOrder(repairList, status, that) {
//   var filtrateRepairOrder = [];
//   if (status == "全部") {
//     filtrateRepairOrder = repairList;
//   }
//   else {
//     for (var i = 0; i < repairList.length; i++) {
//       if (repairList[i].status == status) {
//         filtrateRepairOrder.push(repairList[i]);
//       }
//     }
//   }
//   that.setData({
//     filtrateRepairOrder: filtrateRepairOrder
//   })
// }