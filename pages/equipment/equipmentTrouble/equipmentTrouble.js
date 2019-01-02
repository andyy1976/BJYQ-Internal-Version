const config = require("../../../utils/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipmentTroubleList: [],
    filtrateEquipmentTroubleList: [],
    dai: "choose",
    yi: "nonChoose",
    guo: "nonChoose",
    daiPage: 1,
    yiPage: 1,
    guoPage: 1,
    inputValue: "",
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (that.data.dai == "choose") {
      getEquipmentTroubleList(this, "0");
    }
    else {
      getEquipmentTroubleList(this, "1");
    }
    

  },
  searchEquipment: function (e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    setFiltrateArray(that, that.data.equipmentTroubleList, inputValue);
  },

  viewTaped: function (e) {
    var that = this;
    console.log(e);
    var equipment = that.data.equipmentTroubleList[e.currentTarget.id] || {};
    
    console.log("equipment");
    console.log(equipment);
    if (equipment) {
      if (that.data.dai == "choose"){
        wx.navigateTo({
          url: '../equipmentTroubleDetail/equipmentTroubleDetail?equipment=' + JSON.stringify(equipment),
        })
      }
      else {
        wx.navigateTo({
          url: '../equipmentTroubleDoneDetail/equipmentTroubleDoneDetail?equipment=' + JSON.stringify(equipment),
        })
      }
    }
    else {
      wx.showModal({
        title: '提示',
        content: '获取设备详情失败,请稍后重试',
        showCancel: false
      })
    }
  },

  switchViewTaped: function (e) {
    var that = this;
    switch (e.currentTarget.id) {
      case "guo": {
        if (that.data.guo == "choose") {
          return;
        }
        that.setData({
          guo: "choose",
          dai: "nonChoose",
          yi: "nonChoose",
          guoPage: 1
        })
        getEquipmentTroubleList(that, "2");
        break;
      }
      case "dai": {
        if (that.data.dai == "choose") {
          return;
        }
        that.setData({
          guo: "nonChoose",
          dai: "choose",
          yi: "nonChoose",
          daiPage: 1
        })
        getEquipmentTroubleList(that, "0");
        break;
      }
      case "yi": {
        if (that.data.yi == "choose") {
          return;
        }
        that.setData({
          guo: "nonChoose",
          yi: "choose",
          dai: "nonChoose",
          yiPage: 1
        })
        getEquipmentTroubleList(that, "1");
        break;
      }

    }
  },

  scrolltoupper: function () {
    var that = this;
    that.data.dai == "choose" ? getEquipmentTroubleList(that, "0") : getEquipmentTroubleList(that, "1");
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


function getEquipmentTroubleList(that, isDone) {
  // return;
  var app = getApp();
  var ztInfo = wx.getStorageSync("currentZT") || {};
  var data = {
    classify: ztInfo ? ztInfo.ZTCode : "",
    isDone: isDone,
    serverURL: config.urls.getEquipmentTroubleListUrl
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
      console.log(res);
      wx.hideLoading();
      if (res.data.status == "Fail") {
        if (res.data.result == "未查询到任何数据") {
          wx.showModal({
            title: '提示',
            content: '未查询到任何数据',
            showCancel: false,
            success: res => {
              that.setData({
                equipmentTroubleList: [],
                filtrateEquipmentTroubleList: [],
              })
            }
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
      that.setData({
        equipmentTroubleList: res.data.data || [],
      })
      if (!that.data.inputValue) {
        that.setData({
          filtrateEquipmentTroubleList: res.data.data || [],
        })
      }
      else {
        setFiltrateArray(that, res.data.data, that.data.inputValue);
      }
      console.log("equipmentTroubleList is: ================================================")
      console.log(that.data.equipmentTroubleList);
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



function setFiltrateArray(that, equipmentTroubleList, inputValue) {
  var inputLength = inputValue.length;
  var filtrateArray = [];
  for (var i = 0; i < equipmentTroubleList.length; i++) {
    console.log(equipmentTroubleList[i].Number.substr(0, inputLength - 1));
    if (equipmentTroubleList[i].Number.substr(0, inputLength) == inputValue) {
      filtrateArray.push(equipmentTroubleList[i]);
    }
  }
  that.setData({
    inputValue: inputValue,
    filtrateEquipmentTroubleList: filtrateArray
  })
}