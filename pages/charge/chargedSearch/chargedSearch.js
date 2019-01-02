// pages/chargedSearch/chargedSearch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  // datepickerBindchange: function (e) {
  //   var that = this;
  //   console.log(e);
  //   var repairOrder = that.data.repairOrder
  //   switch (parseInt(e.target.id)) {
  //     case 1: {
  //       repairOrder.ArriveTime = getDate() + " " + e.detail.value + ":00";
  //       break;
  //     }
  //     case 2: {
  //       repairOrder.CompleteTime = getDate() + " " + e.detail.value + ":00";
  //       break;
  //     }
  //   }
  //   that.setData({
  //     repairOrder: repairOrder
  //   })
  // },

  submit: function (e) {
    console.log(e);
    var submitData = e.detail.value;
    if (!submitData.homeNumber && !submitData.name) {
      wx.showModal({
        title: '提示',
        content: '请至少输入一项查询条件',
        showCancel: false
      })
      return;
    }
    // if (!submitData.startMonth){
    //   wx.showModal({
    //     title: '提示',
    //     content: '开始月份为必填项',
    //     showCancel: false
    //   })
    //   return;
    // }
    // if (!submitData.endMonth) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '结束月份为必填项',
    //     showCancel: false
    //   })
    //   return;
    // }

    // if (parseInt(submitData.endMonth) - parseInt(submitData.startMonth) > 3){
    //   wx.showModal({
    //     title: '提示',
    //     content: '结束月份和开始月份最多相差三个月',
    //     showCancel: false
    //   })
    //   return;
    // }
    wx.navigateTo({
      url: '../chargedList/chargedList?queryInfo=' + JSON.stringify(e.detail.value),
    })
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


function getDate() {
  var date = new Date;
  var year = (Number(date.getFullYear()));
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var dateString = year + "-" + appendZero(month);
  return dateString;
}

function getDateTime() {
  var date = new Date;
  var year = (Number(date.getFullYear()));
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var dateString = year + "-" + appendZero(month) + "-" + appendZero(day) + " " + appendZero(hour) + ":" + appendZero(minute) + ":" + appendZero(second);
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