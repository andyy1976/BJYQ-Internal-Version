const config = require("../../../utils/config.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lookOverInfo: null,
    business: "",
    route: "",
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
    var route = options.route;
    that.setData({
      business: business,
      route: route,
    })
    wx.setNavigationBarTitle({
      title: business + '列表（' + route + '）',
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
    if (!viewCanTouch) {
      util.showSign("该对象已完成巡检");
      return;
    }
    if (e.currentTarget.id > 0) {
      if (!that.data.objects[e.currentTarget.id - 1].isLook) {
        util.showSign("上一位置还未完成巡检，请完成后重试");
        return;
      }
    }
    var objectName = that.data.objects[e.currentTarget.id].name;
    var lookInfo = that.data.lookOverInfo;
    var items = [];
    for (var i = 0; i < lookInfo.length; i++) {
      if (lookInfo[i].objectName == objectName) {
        items.push(lookInfo[i]);
      }
    }
    console.log("objectName");
    console.log(objectName);
    if (objectName) {
      wx.navigateTo({
        url: '../lookOverDetail/lookOverDetail?objectName=' + objectName + '&route=' + that.data.route + '&business=' + that.data.business + '&items=' + JSON.stringify(items),
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
    name: "徐丽丽",
    // name: wx.getStorageSync("userInfo").UserCode,
    func: that.data.business,
    route: that.data.route,
    serverURL: config.urls.getLookOverListUrl
  }


  util.getRequest(config.urls.getLookOverListUrl, data, function (data, errCode) {
    if (errCode) {
      var data = data;
      getObjects(that, data);
    }
    else {
      that.setData({ objects: null });
    }
  })
}

function getObjects(that, data) {
      var objectName = data[0].objectName;
      var objects = [];
      objects.push({ name: data[0].objectName, isLook: data[0].isLook });
      for (var i = 0; i < data.length; i++) {
        data[i].isNormal = true;
        if (data[i].objectName != objectName) {
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