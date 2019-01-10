// pages/lookOver/houseLookOverDetail/houseLookOverDetail.js
const config = require("../../../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    business: null,
    objectName: null,
    objectIndex: null,
    lookOverItem: null,
    unnormalItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    var lookOverItems = getLookOverItems(JSON.parse(options.items));
    // var lookOverItems = JSON.parse(options.items);
    console.log(lookOverItems);
    that.setData({
      business: options.business,
      objectName: options.objectName,
      // objectIndex: options.objectIndex,
      lookOverItem: lookOverItems
    })
    wx.setNavigationBarTitle({
      title: options.business + '详情',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 自定义函数--监听项目右侧小图片点击，判断是否不合格
   */
  imageTaped: function (e) {
    var that = this;
    var items = that.data.lookOverItem;
    // var unnormalItems = that.data.unnormalItems;
    var index = parseInt(e.target.id);
    items[index].isNormal = !items[index].isNormal;
    if (items[index].isNormal) {
      items[index].explain = null;
      items[index].images = ["../../../images/addimage.png", "../../../images/addimage.png", "../../../images/addimage.png"];
    }
    that.setData({
      lookOverItem: items
    })
  },

  /**
   * 自定义函数--监听textarea输入数据
   */
  textInput: function (e) {
    console.log(e);
    var that = this;
    var items = that.data.lookOverItem;
    var index = e.target.id;
    var value = e.detail.value;
    items[index].explain = value;
    that.setData({
      lookOverItem: items
    });
    console.log(that.data.lookOverItem);
  },

  /**
   * 自定义函数--监听添加图片点击，添加图片
   */
  addImageTaped: function (e) {
    console.log(e);
    var that = this;
    var index = parseInt(e.target.id);
    var itemIndex = parseInt(e.target.dataset.itemIndex);
    selectImage(this, itemIndex, index);
  },

  /**
   * 自定义函数--监听添加图片长按，预览图片
   */
  addImageLongTaped: function (e) {
    console.log(e);
    var that = this;
    var index = parseInt(e.target.id);
    var itemIndex = parseInt(e.target.dataset.itemIndex);
    previewImage(that.data.lookOverItem[itemIndex].images[index]);
  },

  /**
   * 自定义函数--监听按钮点击
   */
  submit: function (e) {
    var that = this;
    console.log(e);
    var userName = wx.getStorageSync("userInfo").UserCode;
    var ztCode = wx.getStorageSync("currentZT").ZTCode;
    var submitData = e.detail.value;
    var lookOverItem = that.data.lookOverItem;
    var submitItems = [];
    for(var i = 0; i < lookOverItem.length; i++){
        submitItems.push({
          id: lookOverItem[i].id,
          isNormal: lookOverItem[i].isNormal,
          explain: lookOverItem[i].explain,
         });
    }
    // var unnormalItems = [];
    //将不合格项保存到数组中
    // for (var i = 0; i < lookOverItem.length; i++) {
    //   if (!lookOverItem[i].isNormal) {
    //     //如果没有添加图片，将其置为空
    //     for (var j = 0; j < lookOverItem[i].images.length; j++) {
    //       if (lookOverItem[i].images[j] == "../../../images/addimage.png") {
    //         lookOverItem[i].images[j] = "";
    //       }
    //     }
    //     var unnormalItem = {
    //       num: lookOverItem[i].number,
    //       explain: lookOverItem[i].explain,
    //       images: lookOverItem[i].images
    //     }
    //     unnormalItems.push(unnormalItem);
    //   }

    // }
    // console.log(unnormalItems);
    // that.setData({
    //   unnormalItems: unnormalItems
    // });
    //设置需要上传的数据
    // submitData.business = that.data.business;
    // submitData.objectName = that.data.objectName;
    // submitData.unnormalItems = unnormalItems;
    // submitData.unnormalItems = JSON.stringify(unnormalItems);
    submitData.items = JSON.stringify(submitItems);
    // submitData.isNormal = unnormalItems.length == 0 ? "是" : "否";
    submitData.userName = userName;
    // submitData.ztCode = ztCode;
    submitData.serverUrl = config.urls.setLookOverResultUrl;
    console.log(submitData);
    //开始上传
    wx.showLoading({
      title: '正在上传...',
    })
    wx.request({
      url: config.urls.setLookOverResultUrl,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=uft-8'
      },
      data: submitData,
      success: res => {
        wx.hideLoading();
        console.log(res);
        if (res.data.status == "Success") {
          // var businessInfo = wx.getStorageSync(that.data.business);
          // businessInfo.objects[parseInt(that.data.objectIndex)].isLook = true;
          // wx.setStorageSync(that.data.business, businessInfo);
          // if (res.data.data) {
            uploadImage(that);
          // }
          wx.showModal({
            title: '提示',
            content: '提交成功，点击确定返回上一页',
            showCancel: false,
            success: function (e) {
              if (e.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '发生未知错误，请稍后重试',
            showCancel: false
          })
          return;
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
        return;
      }
    })
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


function getLookOverItems(items) {
  // var info = wx.getStorageSync(business);
  // var items = info.items;
  for (var i = 0; i < items.length; i++) {
    items[i].isNormal = true;
    items[i].explain = null;
    items[i].images = ["../../../images/addimage.png", "../../../images/addimage.png", "../../../images/addimage.png"]
  }
  return items;
}

function previewImage(imageUrl) {
  wx.previewImage({
    urls: [imageUrl],
  })
}

function selectImage(that, itemIndex, id) {
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      var tempFilePath = res.tempFilePaths[0];
      console.log(tempFilePath);
      var items = that.data.lookOverItem;
      // var image = that.data.image;
      items[itemIndex].images[id] = tempFilePath;
      that.setData({
        lookOverItem: items
      })
      console.log(that.data.lookOverItem);
    }
  })
}

function uploadImage(that) {
  // var image = that.data.image;
  var items = that.data.lookOverItem;
  var userInfo = wx.getStorageSync("userInfo");
  // for (var j = 0; j < ids.length; j++) {
  for (var k = 0; k < items.length; k++) {
    var images = items[k].images;
    for (var i = 0; i < images.length; i++) {
      var tempFilePath = images[i];
      if (tempFilePath == "../../../images/addimage.png") {
        continue;
      }
      console.log("tempFilePath");
      console.log(tempFilePath);
      var extra = tempFilePath.split(".");
      var imagePath = tempFilePath.split("/");
      var imageName = imagePath[imagePath.length - 1];
      var extraName = extra[extra.length - 1];
      wx.uploadFile({
        url: config.urls.cloudImageUrl,
        filePath: tempFilePath,
        formData: {
          // func: "before",
          id: items[k].id,
          index: i + 1,
          serverUrl: config.urls.setLookOverImageUrl
        },
        name: '' + userInfo.Id + +getTimeStamp() + "." + extraName,
        // name: extra[imagePath.length - 2] + getTimeStamp()+ "." +  extraName,
        // name: "repairOrder" + "before" + userInfo.UserName + getTimeStamp() + "." + extraName,
        success: res => {
          // wx.hideLoading();
          console.log(res);
        },
        fail: res => {
          // wx.hideLoading();
          console.log(res);
        }
      })
    }
  }

  // }

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
  } else {
    return value;
  }
}

/**
 * 生成时间戳
 */
function getTimeStamp() {
  var date = new Date();
  var timestamp = date.getTime();
  // timestamp = parseInt(timestamp / 1000).toString();
  return timestamp;
}