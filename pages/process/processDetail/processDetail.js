// pages/process/processDetail/processDetail.js
const config = require("../../../utils/config.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    processInfo: null,
    processItems: null,
    checkDataDefines: null,
    checkDataDefinesIndex: 0,
    isArchiving: 0,
    isAllCanSelect: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var process = JSON.parse(options.process);
    console.log(process);
    that.setData({ processInfo: process });
    // var data = { userId: wx.getStorageSync("currentUserId") };//315,280
    var submitData = {
      // userId: wx.getStorageSync("currentUserId"),
      userId: wx.getStorageSync("userInfo").Id,
      linkId: process.linkId,
      docTableName: process.docTableName,
      docTableId: process.docTableId,
      businessId: process.businessId,
      transferObjectId: process.transferObjectId,
      objectType: process.objectType,
      transferObjectType: process.transferObjectType
    };
    util.getRequest(config.urls.getProcessDetailUrl, submitData, function (data) {
      var items = data.items[0];
      var defines = data.defines;
      // var processItem = {};
      // for (var i = 0; i < items.length; i++){
      //   processItem[items[i].title] = items[i].content;
      // }
      // console.log("processItem")
      // console.log(processItem);
      // var needShowItems = [];
      // var needHandleItems = [];
      var requiredFields = [];
      for (var i = 0; i < items.length; i++) {
        for (var j = 0; j < defines.length; j++) {
          if (items[i].title == defines[j].fieldName) {
            items[i].fieldSourceName = defines[j].fieldSourceName;
            items[i].required = defines[j].required;
            items[i].defaultValue = defines[j].defaultValue;
            items[i].allowEdit = defines[j].allowEdit;
            items[i].isFile = defines[j].isFile;
            break;
          }
        }
        if (!items[i].fieldSourceName) {
          items[i].fieldSourceName = items[i].title;
          items[i].required = false;
          items[i].defaultValue = '';
          items[i].allowEdit = false;
        }
        // if (items[i].required == true){
        //   requiredFields.push(items[i].fieldSourceName);
        // }
        // if (items[i].allowEidt){
        //   needHandleItems.push(items[i]);
        // }
        // else {
        //   needShowItems.push(items[i]);
        // }
      }
      console.log("items")
      console.log(items);
      // console.log("requiredFields:");
      // console.log(requiredFields);
      that.setData({ processItems: items, checkDataDefines: data.checkDataDefines || null });
      if (data.checkDataDefines){
        var checkDataDefines = data.checkDataDefines;
        var checkDataDefinesIndex = 0;
        var isAllCanSelect = true;
        for (var i = 0; i < checkDataDefines.length; i++) {
          if (checkDataDefines[i].isSelect) {
            checkDataDefinesIndex = i;
            isAllCanSelect = false;
            break;
          }
        }
        that.setData({
          checkDataDefinesIndex: checkDataDefinesIndex, 
          isAllCanSelect: isAllCanSelect 
        })
      }
      
      // console.log(needHandleItems);
      // console.log(needShowItems);
    })
    // wx.request({
    //   url: 'http://localhost:8080/bjyqwx/Process/BussinessHandler_TableData?userId=100',
    //   method: 'GET',
    //   success: res => {
    //     console.log(res);
    //     console.log(res.data.data);
    //     // return;
    //     var data = res.data.data;
    //     var items = data.items[0];
    //     var defines = data.defines;
    //     // var processItem = {};
    //     // for (var i = 0; i < items.length; i++){
    //     //   processItem[items[i].title] = items[i].content;
    //     // }
    //     // console.log("processItem")
    //     // console.log(processItem);
    //     // var needShowItems = [];
    //     // var needHandleItems = [];
    //     var requiredFields = [];
    //     for (var i = 0; i < items.length; i++){
    //       for (var j = 0; j < defines.length; j++){
    //         if (items[i].title == defines[j].fieldName){
    //           items[i].fieldSourceName = defines[j].fieldSourceName;
    //           items[i].required = defines[j].required;
    //           items[i].defaultValue = defines[j].defaultValue;
    //           items[i].allowEdit = defines[j].allowEdit;
    //           break;
    //         }
    //       }
    //       if (!items[i].fieldSourceName){
    //         items[i].fieldSourceName = items[i].title;
    //         items[i].required = false;
    //         items[i].defaultValue = '';
    //         items[i].allowEdit = false;
    //       }
    //       // if (items[i].required == true){
    //       //   requiredFields.push(items[i].fieldSourceName);
    //       // }
    //       // if (items[i].allowEidt){
    //       //   needHandleItems.push(items[i]);
    //       // }
    //       // else {
    //       //   needShowItems.push(items[i]);
    //       // }
    //     }
    //     console.log("items")
    //     console.log(items);
    //     // console.log("requiredFields:");
    //     // console.log(requiredFields);
    //     that.setData({ processItems: items, checkDataDefines: data.checkDataDefines});
    //     // console.log(needHandleItems);
    //     // console.log(needShowItems);
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

  radioChange: function (e) {
    console.log(e);
    var that = this;
    var chooseValue = e.detail.value;
    that.setData({isArchiving: chooseValue});
  },

  datepickerBindchange: function (e) {
    var that = this;
    console.log(e);
    var index = parseInt(e.detail.value);
    
    if (that.data.checkDataDefines[index].isSelect == false && that.data.checkDataDefines[index].checkResult != "不同意" && !that.data.isAllCanSelect){
      wx.showToast({
        title: '不能选择该项',
        icon: 'none'
      })
      return;
    }
    that.setData({ checkDataDefinesIndex: index });
  },


  lookFile: function (e) {
    var that = this; 
    console.log(e);
    var value = e.currentTarget.dataset.fileName;
    if (!value){
      wx.showToast({
        title: '文件不存在',
        icon: 'none'
      })
      return;
      }
    var docValue = value.split('-')[value.split('-').length - 1];
    var splitArr = docValue.split('|');
    var docName = splitArr[splitArr.length - 1];
    var recordId = splitArr[splitArr.length - 2];
    var fileFullName = "\\" + that.data.processInfo.docTableName + "\\" + recordId + "\\" + docName;
    var fileUrl = config.urls.getFileUrl + fileFullName;
    console.log(fileUrl);
    util.downloadAndLookFiles(fileUrl);
  },

  submit: function (e) {
    var that = this;
    console.log(e);
    var processItems = that.data.processItems;
    var value = e.detail.value;
    console.log(value);
    var keys = Object.keys(value);
    console.log("keys is: =======================");
    console.log(keys);
    // var updateString = "";
    var updateData = {};
    for (var i = 0; i < keys.length; i++) {
      var index = parseInt(keys[i]);
      if (!isNaN(index)) {
        if (processItems[index].required && !value[keys[i]]) {
          wx.showModal({
            title: '提示',
            content: '存在必填但尚未填写的项',
            showCancel: false
          })
          return;
        }
        else {
          updateData[processItems[index].fieldSourceName] = value[keys[i]];
          // updateString += processItems[index].fieldSourceName + "=" + "'" + value[keys[i]] + "'" + "*";
        }
      }
    }
    // updateString = updateString.substring(0,updateString.length - 1);
    console.log("updateData:");
    console.log(updateData);
    var index = parseInt(that.data.checkDataDefinesIndex);
    var selectedProcess = wx.getStorageSync("selectedProcess");

    //判断审核，传递到下一步
    if (e.detail.target.id == "submitDecision") {
      var selectedCheckData = that.data.checkDataDefines[index];
      delete selectedCheckData.selectCondition;
      delete selectedCheckData.hiddenCondition;
      // delete selectedCheckData.transConditionAndExplain;
      console.log(index)
      console.log("===================================")
      console.log(selectedCheckData);
      console.log("===================================")
      wx.navigateTo({
        url: '../processNextLink/processNextLink?selectedCheckData=' + JSON.stringify(selectedCheckData) + '&updateData=' + JSON.stringify(updateData) + '&leaveMessage=' + value.leaveMessage,
      })
    }
    
    //判断审核，终结业务
    if (e.detail.target.id == "submitTerminator"){
      console.log(e);
      var updateKeys = Object.keys(updateData);
      var submitData = {
        instanceId: selectedProcess.id,
        // userId: wx.getStorageSync("currentUserId"),
        userId: wx.getStorageSync("userInfo").Id,
        leaveMessage: value.leaveMessage,
        isEnd: 1,
        docTableName: selectedProcess.docTableName,
        docTableId: selectedProcess.docTableId,
        updateDataKeys: JSON.stringify(updateKeys),
        updateData: JSON.stringify(updateData),
        registId: selectedProcess.registId,
        transmitConditionAndExplain: selectedProcess.transmitConditionAndExplain
      };
      util.setRequest(config.urls.endProcessUrl, submitData, function (data) {
        wx.showModal({
          title: '提示',
          content: '流程已结束,点击确定返回流程列表',
          showCancel: false,
          success: res => {
            wx.navigateBack({
              delta: 1
            })
            // wx.reLaunch({
            //   url: '../process/process',
            // })
          }
        })
      })
    }

    //知会留言
    if (e.detail.target.id == "submitNotify") {
      console.log("notify");
      console.log(e);
      // return;
      var updateKeys = Object.keys(updateData);
      var submitData = {
        instanceId: selectedProcess.id,
        // userId: wx.getStorageSync("currentUserId"),
        userId: wx.getStorageSync("userInfo").Id,
        leaveMessage: value.leaveMessage,
        needArchiving: that.data.isArchiving,
        docTableName: selectedProcess.docTableName,
        docTableId: selectedProcess.docTableId,
        updateDataKeys: JSON.stringify(updateKeys),
        updateData: JSON.stringify(updateData),
      };
      util.setRequest(config.urls.setNotifyUrl, submitData, function (data) {
        wx.showModal({
          title: '提示',
          content: '留言成功,点击确定返回流程列表',
          showCancel: false,
          success: res => {
            wx.navigateBack({
              delta: 1
            })
            // wx.reLaunch({
            //   url: '../process/process',
            // })
          }
        })

        // that.setData({ allowReceiveStaffs: data.allowReceiveStaffs });
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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