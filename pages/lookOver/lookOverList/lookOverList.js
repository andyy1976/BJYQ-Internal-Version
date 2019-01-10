const config = require("../../../utils/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lookOverInfo: null,
    business: "",
    objects: null,
    day: "choose",
    week: "nonChoose",
    period: "day"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var business = options.business;
    that.setData({
      business: business
    })
    wx.setNavigationBarTitle({
      title: business + '列表',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // var lookOverInfo = wx.getStorageSync(that.data.business);
    // if (lookOverInfo){
    //   that.setData({
    //     lookOverInfo: lookOverInfo
    //   })
    // }
    // else {
      getLookOverList(that);
    // }
  },

  switchViewTaped: function (e) {
    var that = this;
    switch (e.currentTarget.id) {
      case "day": {
        if (that.data.day == "choose") {
          return;
        }
        that.setData({
          day: "choose",
          week: "nonChoose",
          period: "day",
        })
        getLookOverList(that);
        break;
      }
      case "week": {
        if (that.data.dai == "week") {
          return;
        }
        that.setData({
          day: "nonChoose",
          week: "choose",
          period: "week",
        })
        getLookOverList(that);
        break;
      }
    }
  },



  viewTaped: function (e) {
    var that = this;
    console.log(e);
    var viewCanTouch = e.currentTarget.dataset.canTouch;
    if (!viewCanTouch){
      wx.showModal({
        title: '提示',
        content: '该对象已完成巡检',
        showCancel: false
      })
      return;
    }
   
    var objectName = that.data.objects[e.currentTarget.id].name;
    var lookInfo = that.data.lookOverInfo;
    var items = [];
    for (var i = 0; i < lookInfo.length; i ++){
      if (lookInfo[i].objectName == objectName){
        items.push(lookInfo[i]);
      }
    }
    console.log("objectName");
    console.log(objectName);
    if (objectName) {
      wx.navigateTo({
        url: '../lookOverDetail/lookOverDetail?objectName=' + objectName + '&business=' + that.data.business + '&items=' + JSON.stringify(items),
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '获取巡检详情失败,请稍后重试',
        showCancel: false
      })
    }
  },

})


function getLookOverList(that) {
  var ztInfo = wx.getStorageSync("currentZT") || {};
  var data = {
    ztCode: ztInfo ? ztInfo.ZTCode : "",
    // ztCode: "21",
    func: that.data.business,
    period: that.data.period,
    serverURL: config.urls.getLookOverListUrl
  }
  wx.showLoading({
    title: '加载中...',
  })
  wx.request({
    url: config.urls.getLookOverListUrl,
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
          that.setData({ objects: null});
          return;
        }
        wx.showModal({
          title: '提示',
          content: '发生未知错误，请稍后重试',
          showCancel: false
        })
        that.setData({ objects: null });
        return;
      }
      else if (res.data.status == "Success"){
        var data = res.data.data;
        // that.setData({
        //   lookOverInfo: data,
        // })
        getObjects(that, data);
      // wx.setStorageSync(that.data.business, data);
      }
      else {
        wx.showModal({
          title: '提示',
          content: '发生未知错误，请稍后重试',
          showCancel: false
        })
        that.setData({ objects: null });
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
      that.setData({ objects: null });
    }
  })
}


function getObjects(that,data){
  var objectName = data[0].objectName;
  var objects = [];
  objects.push({ name: data[0].objectName, isLook: data[0].isLook});
  for (var i = 0; i < data.length; i++){
    data[i].isNormal = true;
    if (data[i].objectName != objectName){
      objects.push({ name: data[i].objectName, isLook: data[i].isLook });
      objectName = data[i].objectName;
    }
  }

  // for(var i = 0; i < objects.length; i++){
  //   var isLook = true;
  //   for(var j = 0; j < data.length; j++){
  //     if (data[j].objectName == objects[i].name && data[j].isLook == false){
  //       isLook = false;
  //     }
  //   }
  //   if (isLook == true) {
  //     objects[i].isLook = true;
  //   }
  // }
  that.setData({ objects: objects, lookOverInfo: data });
}