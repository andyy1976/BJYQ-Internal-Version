const config = require("../../../utils/config.js");
const util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipmentList: [],//服务器获取到的设备列表
    filtrateEquipmentList: [],//根据筛选条件筛选过的设备列表
    dai: "choose",//待处理状态
    yi: "nonChoose",//已处理状态
    guo: "nonChoose",//过期状态
    // daiPage: 1,
    // yiPage: 1,
    // guoPage: 1,
    inputValue: "",//筛选框输入的值
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
      getEquipmentList(this, "0");
    }
    else if (that.data.yi == "choose") {
      getEquipmentList(this, "1");
    }
    else {
      getEquipmentList(this, "2");
    }
    
  },
  searchEquipment: function (e){
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    setFiltrateArray(that,that.data.equipmentList,inputValue);
  },

  viewTaped: function (e) {
    var that = this;
    console.log(e);
    var equipment = that.data.equipmentList[e.currentTarget.id] || {};
    console.log("equipment");
    console.log(equipment);
    if (equipment) {
      wx.navigateTo({
        url: '../equipmentDetail/equipmentDetail?equipment=' + JSON.stringify(equipment),
      })
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
          // guoPage: 1
        })
        getEquipmentList(that, "2");//获取过期未处理设备列表
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
          // daiPage: 1
        })
        getEquipmentList(that, "0");//获取待处理设备列表
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
          // yiPage: 1
        })
        getEquipmentList(that, "1");//获取已处理设备列表
        break;
      }
    }
  }
})


function getEquipmentList(that, status) {
  var ztInfo = wx.getStorageSync("currentZT") || {};
  var data = {
    classify: ztInfo ? ztInfo.ZTCode : "",
    status: status
  }
  // wx.showLoading({title: '加载中...',})
  util.getRequest(config.urls.getEquipmentListUrl, data, function success(data, errCode) {
    if (errCode){
      var equipmentList = data;
      that.setData({
        equipmentList: equipmentList,
        filtrateEquipmentList: equipmentList,
        inputValue: ""
      })
    }
    else {
      that.setData({
        equipmentList: [],
        filtrateEquipmentList: [],
        inputValue: ""
      })
    }
  })

  // wx.request({
  //   url: config.urls.getEquipmentListUrl,
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
  //           showCancel: false,
  //           success: res => {
  //             that.setData({
  //               equipmentList: [],
  //               filtrateEquipmentList: [],
  //             })
  //           }
  //         })
  //         return;
  //       }
  //       wx.showModal({
  //         title: '提示',
  //         content: '发生未知错误，请稍后重试',
  //         showCancel: false
  //       })
  //       return;
  //     }
  //     that.setData({
  //       equipmentList: res.data.data || [],
  //     })
  //     if (!that.data.inputValue) {
  //       that.setData({
  //         filtrateEquipmentList: res.data.data || [],
  //       })
  //     }
  //     else {
  //       setFiltrateArray(that,res.data.data,that.data.inputValue);
  //     }
  //     console.log("equipmentList is: ================================================")
  //     console.log(that.data.equipmentList);
  //   },
  //   fail: res => {
  //     console.log(res);
  //     wx.hideLoading();
  //     wx.showModal({
  //       title: '提示',
  //       content: '发生未知错误，请稍后重试',
  //       showCancel: false
  //     })
  //   }
  // })
}



function setFiltrateArray(that,equipmentList,inputValue){
  var inputLength = inputValue.length;
  var filtrateArray = [];
  for (var i = 0; i < equipmentList.length; i++) {
    // console.log(equipmentList[i].Number.substr(0, inputLength - 1));
    // if (equipmentList[i].Number.substr(0, inputLength).toLowerCase() == inputValue.toLowerCase()) {
    //   filtrateArray.push(equipmentList[i]);
    // }
    var equipmentNumber = equipmentList[i].Number.toUpperCase();
    if (equipmentNumber.indexOf(inputValue.toUpperCase()) >= 0){
      filtrateArray.push(equipmentList[i]);
    }
  }
  that.setData({
    inputValue: inputValue,
    filtrateEquipmentList: filtrateArray
  })
}