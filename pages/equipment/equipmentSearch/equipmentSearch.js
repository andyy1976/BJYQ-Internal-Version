// pages/equipmentSearch/equipmentSearch.js
const config = require("../../../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipment: {},
    pageHidden: true,
    Number: ""
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
    // var that = this;
    // wx.scanCode({
    //   onlyFromCamera: true,
    //   success: (res) => {
    //     console.log(res)
    //     var equipmentInfo = getEquipmentInfo(that, res.result)
    //   }
    // })
  },

  /**
   * 查看当前设备的保养信息
   */
  checkMaintainRecord: function() {
    var that = this;
    var Number = that.data.equipment.Number;
    console.log(Number);
    wx.navigateTo({
      url: '../equipmentMaintainList/equipmentMaintainList?Number=' + Number,
    })
    // GetEquipmentMaintainInfo(that,operationNumber);
  },


  scan: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        var result = JSON.parse(res.result);
        if(result.type != "equipment"){
          wx.showModal({
            title: '提示',
            content: '您扫描的二维码非设备二维码，请查证后重试',
            showCancel:false,
          })
          return;
        }
        else {
          getEquipmentInfo(that, result.equipmentNumber);
          that.setData({
            Number: result.equipmentNumber
          })
        }
        
      }
    })
  },

  buttonTaped: function(e) {
    var that = this;
    var Number = that.data.Number;
    if (!Number){
      wx.showModal({
        title: '提示',
        content: '请输入设备运行编号后再点击查询',
        showCancel: false,
      })
      return;
    }
    getEquipmentInfo(that, Number);
  },

  input: function(e){
    var that = this;
    console.log(e);
    var value = e.detail.value;
    that.setData({
      Number: value
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


function getEquipmentInfo(that, Number) {
  wx.showLoading({
    title: '正在加载...',
  })
  wx.request({
    url: config.urls.cloudUrl,
    method: "POST",
    header: {'content-type': 'application/x-www-form-urlencoded;charset=uft-8'},
    data: { operationNumber: Number, serverUrl: config.urls.equipmentSearchUrl },
    success: res => {
      wx.hideLoading();
      console.log(res);
      if (res.data.status == "Success") {
        that.setData({
          equipment: res.data.data,
          pageHidden: false
        })
      }
      else if (res.data.status == "Fail" && res.data.result == "未查询到任何记录") {
        wx.showModal({
          title: '提示',
          content: '未查询到任何信息，请检查输入设备运行编号或所扫描二维码是否正确',
          showCancel: false
        })
      }
      else {
        wx.showModal({
          title: '提示',
          content: '发生未知错误，请稍后重试',
          showCancel: false
        })
      }
    },
    fail: res => {
      wx.hideLoading();
      console.log(res);
    }
  })
}









