const config = require("../../../utils/config.js");
const util = require("../../../utils/util.js");
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
      title: business + '路线列表',
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
    getLookOverRouteList(that);
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
    var objectName = that.data.objects[e.currentTarget.id];
      wx.navigateTo({
        url: '../lookOverList/lookOverList?business=' + that.data.business + '&route=' + objectName,
      })
  },

})


function getLookOverRouteList(that) {
  var ztInfo = wx.getStorageSync("currentZT") || {};
  var data = {
    ztCode: ztInfo ? ztInfo.ZTCode : "",
    name: wx.getStorageSync("userInfo").UserCode,
    func: that.data.business,
  }


  util.getRequest(config.urls.getLookOverRouteListUrl, data, function (data, errCode) {
    if (errCode) {
      var data = data;
      that.setData({ objects: data})
    }
    else {
      that.setData({ objects: null });
      // wx.navigateBack({
      //   delta: 1
      // })
    }
  })
  // wx.showLoading({
  //   title: '加载中...',
  // })
  // wx.request({
  //   url: config.urls.getLookOverListUrl,
  //   method: 'POST',
  //   data: data,
  //   header: {
  //     'content-type': 'application/x-www-form-urlencoded;charset=uft-8'
  //   },
  //   success: res => {
  //     console.log(res);
  //     wx.hideLoading();
  //     if (res.data.status == "Fail") {
  //       if (res.data.result == "未查询到任何数据") {
  //         wx.showModal({
  //           title: '提示',
  //           content: '未查询到任何数据',
  //           showCancel: false
  //         })
  //         that.setData({ objects: null});
  //         return;
  //       }
  //       wx.showModal({
  //         title: '提示',
  //         content: '发生未知错误，请稍后重试',
  //         showCancel: false
  //       })
  //       that.setData({ objects: null });
  //       return;
  //     }
  //     else if (res.data.status == "Success"){
  //       var data = res.data.data;
  //       // that.setData({
  //       //   lookOverInfo: data,
  //       // })
  //       getObjects(that, data);
  //     // wx.setStorageSync(that.data.business, data);
  //     }
  //     else {
  //       wx.showModal({
  //         title: '提示',
  //         content: '发生未知错误，请稍后重试',
  //         showCancel: false
  //       })
  //       that.setData({ objects: null });
  //     }
  //   },
  //   fail: res => {
  //     console.log(res);
  //     wx.hideLoading();
  //     wx.showModal({
  //       title: '提示',
  //       content: '发生未知错误，请稍后重试',
  //       showCancel: false
  //     })
  //     that.setData({ objects: null });
  //   }
  // })
  // }

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