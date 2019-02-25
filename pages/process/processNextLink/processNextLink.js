// pages/process/processNextLink/processNextLink.js
const config = require("../../../utils/config.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkData: null,
    leaveMessage: "",
    updateData: null,
    allowReceiveLinks: null,
    arlIndex: 0,
    allowReceiveStaffs: null,
    arsIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    var selectedCheckData = JSON.parse(options.selectedCheckData);
    var updateData = JSON.parse(options.updateData);
    var leaveMessage = options.leaveMessage;
    var selectedProcess = wx.getStorageSync("selectedProcess");
    console.log(selectedCheckData);
    that.setData({ checkData: selectedCheckData, leaveMessage: leaveMessage, updateData: updateData});
    console.log("that.data.updateData");
    console.log(that.data.updateData);
    var submitData = {
      registId: selectedProcess.registId,
      transferObjectId: selectedCheckData.transferObjectId ? selectedCheckData.transferObjectId : selectedProcess.transferObjectId,
      receiveLinkId: selectedCheckData.receiveLinkId ? selectedCheckData.receiveLinkId : selectedProcess.receiveLinkId,
      receiveLinkIds: selectedCheckData.receiveLinkIds ? selectedCheckData.receiveLinkIds : selectedProcess.receiveLinkIds,
      userId: wx.getStorageSync("currentUserId"),
      businessId: selectedProcess.businessId,
      // linkId: selectedCheckData.linkId,
      // task: selectedCheckData.task,
      // staffId: selectedCheckData.staffId,
      // operatorLimit: selectedCheckData.operationStaffLimit,
      // roleMemberId: selectedCheckData.selectedRoleMemberId,
      // handlerInfo: selectedCheckData.staffHandling,
      lastInstanceId: selectedProcess.lastInstanceId,
      department: selectedProcess.initiateDepartment,
      secondDepartment: selectedProcess.initiateSecondDepartment,
      thridDepartment: selectedProcess.initiateThirdDepartment,
      registerId: selectedProcess.registerId
    }
    util.getRequest("http://localhost:33079/Process/BussinessHandler_NextLink", submitData, function (data) {
      that.setData({ allowReceiveLinks: data.allowReceiveLinks, allowReceiveStaffs: data.allowReceiveStaffs });
    })
    // wx.request({
    //   url: 'http://localhost:33079/Process/BussinessHandler_NextLink?userId=100',
    //   method: 'GET',
    //   success: res => {
    //     console.log(res);
    //     console.log(res.data.data);
    //     // return;
    //     that.setData({ allowReceiveLinks: res.data.data.allowReceiveLinks, allowReceiveStaffs: res.data.data.allowReceiveStaffs});
    //   },
    //   fail: res => {
    //     console.log(res);
    //   }
    // })
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

  datepickerBindchange: function (e) {
    var that = this;
    console.log(e);
    var index = parseInt(e.detail.value);
    that.setData({ arlIndex: index });
    var selectedProcess = wx.getStorageSync("selectedProcess");
    var nextLink = that.data.allowReceiveLinks[index];
    var submitData = {
      registId: selectedProcess.registId,
      userId: wx.getStorageSync("currentUserId"),
      businessId: selectedProcess.businessId,
      linkId: nextLink.linkId,
      task: nextLink.task,
      staffId: nextLink.staffId,
      operatorLimit: nextLink.operationStaffLimit,
      roleMemberId: nextLink.selectedRoleMemberId,
      handlerInfo: nextLink.staffHandling,
      lastInstanceId: selectedProcess.lastInstanceId,
      department: selectedProcess.initiateDepartment,
      secondDepartment: selectedProcess.initiateSecondDepartment,
      thridDepartment: selectedProcess.initiateThirdDepartment,
      registerId: selectedProcess.registerId
    }
    util.getRequest("http://localhost:33079/Process/BussinessHandler_NextLink_ReceiveStaffs", submitData, function (data) {
      that.setData({ allowReceiveStaffs: data.allowReceiveStaffs });
    })


  },




  receiverPickerBindchange: function (e) {
    var that = this;
    console.log(e);
    var index = parseInt(e.detail.value);
    that.setData({ arsIndex: index});
  },

  submit: function (e) {
    var that = this;
    console.log(e.detail.value);
    var selectedProcess = wx.getStorageSync("selectedProcess");
    var nextLink = that.data.allowReceiveLinks[that.data.arlIndex];
    var nextStaff = that.data.allowReceiveStaffs[that.data.arsIndex];
    var checkData = that.data.checkData;
    var updateData = that.data.updateData;
    var updateDataKeys = Object.keys(updateData);
    var submitData = {
      instanceId: selectedProcess.id,
      userId: wx.getStorageSync("currentUserId"),
      leaveMessage: that.data.leaveMessage,
      docTableName: selectedProcess.docTableName,
      docTableId: selectedProcess.docTableId,
      updateData: JSON.stringify(updateData),
      updateDataKeys: JSON.stringify(updateDataKeys),
      registId: selectedProcess.registId,
      transformConditionAndExplain: nextLink.transConditionAndExplain ? nextLink.transConditionAndExplain : selectedProcess.transmitConditionAndExplain,
      checkResult: checkData.checkResult,
      businessId: selectedProcess.businessId,
      tableNumber: selectedProcess.tableNubmer,
      nextControlLinkId: nextLink.linkId,
      nextControlLink_UserId: nextStaff.userId,
      nextOutOfControlLinkIds: "",
      nextOutOfControlLink_UserIds: ""
    };
    util.setRequest("http://localhost:33079/Process/BussinessHandler_Save", submitData, function (data) {
      wx.showModal({
        title: '提示',
        content: '传递到下一步成功,点击确定返回流程列表',
        showCancel: false,
        success: res => {
          wx.reLaunch({
            url: '../process/process',
          })
        }
      })
      
      // that.setData({ allowReceiveStaffs: data.allowReceiveStaffs });
    })
    // wx.request({
    //   url: 'http://localhost:33079/Process/BussinessHandler_NextLink_ReceiveStaffs?userId=100',
    //   method: 'GET',
    //   success: res => {
    //     console.log(res);
    //     console.log(res.data.data);
    //     // return;
    //     that.setData({ allowReceiveStaffs: res.data.data.allowReceiveStaffs });
    //   },
    //   fail: res => {
    //     console.log(res);
    //   }
    // })
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