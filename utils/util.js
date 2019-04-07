
/**
 * post请求，封装wx.request方法，获取数据
 */
function getRequest(url, postData, doSuccess, doFail = null, doComplete = null) {
  wx.showLoading({title: '加载中...',});
  console.log(postData);
  wx.request({
    url: url,
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
    data: postData,
    success: function (res) {
      wx.hideLoading();
      console.log("request successed!");
      console.log(res);
      if (res.statusCode == 500) {
        showSign("服务器内部错误，请稍后重试");
        return;
      } 
      if (res.data[0] == "<") {
        showSign("网络错误，请稍后重试");
        return;
      } 
      if (res.data.status == "Fail") {
        showSign(res.data.result);
      }
      if (!res.data){
        showSign("网络错误，请稍后重试");
        return;
      }
      
      // if (res.data.status == "Fail" && res.data.result != "云服务器发生错误：目标url未指定")  {
      //   showSign(res.data.result);
      //   return;
      // }
      if (typeof doSuccess == "function") {
        console.log("response data is:");
        console.log(res.data.data);
        doSuccess(res.data.data);
      }
    },
    fail: function (res) {
      wx.hideLoading();
      console.log("request failed!");
      console.log(res);
      showSign("网络错误，请稍后重试");
    },
    complete: function () {
      wx.hideLoading();
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  });
}

/**
 * post请求，封装wx.request方法，上传数据
 */
function setRequest(url, postData, doSuccess, doFail = null, doComplete = null) {
  wx.showLoading({ title: '正在提交...', });
  console.log(postData);
  wx.request({
    url: url,
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
    data: postData,
    success: function (res) {
      wx.hideLoading();
      console.log("request successed!");
      console.log(res);
      if (res.data[0] == "<") {
        showSign("网络错误，请稍后重试");
        return;
      }
      // if (!res.data) {
      //   showSign("网络错误，请稍后重试");
      //   return;
      // }
      if (res.data.status == "Fail") {
        showSign(res.data.result);
        return;
      }
      // if (res.data.status == "Fail" && res.data.result != "云服务器发生错误：目标url未指定") {
      //   showSign(res.data.result);
      //   return;
      // }
      // if (res.data.status == "Success"){
      //   showTip("提交成功");
      // }
      if (typeof doSuccess == "function") {
        console.log("response data is:");
        console.log(res.data.data);
        doSuccess("success",res.data.data);
      }
    },
    fail: function (res) {
      wx.hideLoading();
      console.log("request failed!");
      console.log(res);
      showSign("网络错误，请稍后重试");
    },
    complete: function () {
      wx.hideLoading();
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  });
}

function uploadImage(url,filePath,formData){
  var userInfo = wx.getStorageSync("userInfo");
  var imageName = "" + userInfo.Id + getTimeStamp() + "." + getImageType(filePath);
  wx.showLoading({
    title: '正在上传...',
  })
  wx.uploadFile({
    url: url,
    filePath: filePath,
    formData: formData,
    name: imageName,
    success: res => {
      wx.hideLoading();
      console.log(res);
    },
    fail: res => {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '上传失败，请稍后重试',
        showCancel: false
      })
      console.log(res);
    }
  })
}

/**
 * 预览照片
 */
function previewImage(imageUrl) {
  wx.previewImage({
    urls: [imageUrl],
  })
}


function getImageType(filePath) {
  var extra = filePath.split(".");
  var extraName = extra[extra.length - 1];
  return extraName;
}

/**
 * 拨打电话
 */
function call(phoneNumber){
  wx.makePhoneCall({
    phoneNumber: phoneNumber,
    success: function (res) { },
    fail: function (res) {
      showSign("拨号功能暂不可用，请稍后重试");
     },
    complete: function (res) { },
  })
}

/**
 * 简单提示
 */
function showSign(content) {
  // wx.showModal({
  //   title: '提示',
  //   content: content,
  //   showCancel: false,
  // })
  wx.showToast({
    title: content,
    icon: "none",
    duration: 3000,
  })
}

function showTip(content){
  wx.showToast({
    title: '提交成功',
    duration:3000,
  })
}

/**
 * 获取日期
 */
function getDate() {
  var date = new Date;
  var year = (Number(date.getFullYear()));
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var dateString = year + "-" + appendZero(month) + "-" + appendZero(day);
  return dateString;
}

/**
 * 获取时间
 */
function getTime() {
  var date = new Date;
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var timeString = appendZero(hour) + ":" + appendZero(minute) + ":" + appendZero(second);
  return timeString;
}

/**
 * 获取日期时间
 */
function getDateTime() {
  var datetimeString = getDate() + " " + getTime();
  return datetimeString;
}

/**
 * 生成时间戳
 */
function getTimeStamp() {
  var date = new Date();
  var timestamp = date.getTime();
  return timestamp;
}

function appendZero(value) {
  if (Number(value) < 10) {
    return "0" + value;
  }
  else {
    return value;
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


module.exports = {
  getDate:getDate,
  getTime: getTime,
  getDateTime: getDateTime,
  getTimeStamp: getTimeStamp,
  call: call,
  getRequest: getRequest,
  setRequest: setRequest,
  showSign: showSign,
  showTip: showTip,
  previewImage: previewImage,
  uploadImage: uploadImage,
  getImageType: getImageType
}


























// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }


