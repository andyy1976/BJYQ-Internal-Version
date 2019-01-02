const config = require("../../../utils/config.js");
const MD5 = require('../../../utils/md5.js')
// var MD5 = require
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalCharge: 0,
    chooseImage: "../../../images/xuanze.png",
    noChooseImage: "../../../images/weixuanze.png",
    isAllChoosed: true,
    userInfo: {},
    chargeList: [],
    prepayId: "",
    submitData: {},
    chargeIds: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    that.setData({
      submitData : JSON.parse(options.charged)
    })
    console.log(that.data.submitData);
    

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
    getChargeList(that);
  },

  // viewTaped: function (e) {
  //   console.log(e);
  //   var that = this;
  //   var jsonCharged = JSON.stringify(that.data.chargedList[parseInt(e.currentTarget.id)]);
  //   wx.navigateTo({
  //     url: '../chargedDetail/chargedDetail?charged=' + jsonCharged,
  //   })
  // },

  chargeViewTaped: function (e) {
    var that = this;
    var chargeList = that.data.chargeList;
    var indexs = e.currentTarget.id.split("-");
    console.log(indexs);
    console.log(e);
    chargeList[parseInt(indexs[0])].ChargeDetails[parseInt(indexs[1])].isChoosed = !chargeList[parseInt(indexs[0])].ChargeDetails[parseInt(indexs[1])].isChoosed;
    var count = 0;
    var isChoosed = true;
    for (var i = 0; i < chargeList[parseInt(indexs[0])].ChargeDetails.length; i++) {
      if (!chargeList[parseInt(indexs[0])].ChargeDetails[i].isChoosed) {
        chargeList[parseInt(indexs[0])].isAllChoosed = false;
        isChoosed = false;
        break;
      }
    }
    if (isChoosed) {
      chargeList[parseInt(indexs[0])].isAllChoosed = true;
    }
    var isAllChoosed = true;
    for (var i = 0; i < chargeList.length; i++) {
      if (!chargeList[i].isAllChoosed) {
        isAllChoosed = false;
        break;
      }
    }
    that.setData({
      chargeList: chargeList,
      isAllChoosed: isAllChoosed
    })
    computeCharge(that);
  },

  titleViewTaped: function (e) {
    console.log(e);
    var that = this;
    var chargeList = that.data.chargeList;
    var index = parseInt(e.currentTarget.id) / 10 - 1;
    chargeList[index].isAllChoosed = !chargeList[index].isAllChoosed;
    if (chargeList[index].isAllChoosed) {
      for (var i = 0; i < chargeList[index].ChargeDetails.length; i++) {
        chargeList[index].ChargeDetails[i].isChoosed = true;
      }
    }
    else {
      for (var i = 0; i < chargeList[index].ChargeDetails.length; i++) {
        chargeList[index].ChargeDetails[i].isChoosed = false;
      }
    }
    var isAllChoosed = true;
    for (var i = 0; i < chargeList.length; i++) {
      if (!chargeList[i].isAllChoosed) {
        isAllChoosed = false;
        break;
      }
    }

    that.setData({
      chargeList: chargeList,
      isAllChoosed: isAllChoosed
    })
    computeCharge(that);

  },

  allChooseViewTaped: function (e) {
    console.log(e);
    var that = this;
    var chargeList = that.data.chargeList;
    var isAllChoosed = !that.data.isAllChoosed;
    for (var i = 0; i < chargeList.length; i++) {
      chargeList[i].isAllChoosed = isAllChoosed;
      for (var j = 0; j < chargeList[i].ChargeDetails.length; j++) {
        chargeList[i].ChargeDetails[j].isChoosed = isAllChoosed;
      }
    }
    that.setData({
      chargeList: chargeList,
      isAllChoosed: isAllChoosed
    })
    computeCharge(that);
  },

  /**
   * 去支付按钮被点击
   */
  buttonTaped: function (e) {

    var that = this;
    console.log(that.data.chargeList);
    var paymentMethods = ['现金', '微信支付', '银行转账', '支票', 'POS机'];
    wx.showActionSheet({
      itemList: paymentMethods,
      success: function (res) {
        var paymentMethod = paymentMethods[res.tapIndex]
        console.log(paymentMethods[res.tapIndex]);
        if (paymentMethod == "微信支付") {
          wx.navigateTo({
            url: '../toMiniApp/toMiniApp',
          })
          return;
        }
        wx.showModal({
          title: '提示',
          content: '请确认已收到费用后点击确定',
          success: res => {
            if (res.confirm) {
              setCharges(that, paymentMethod);
            }
            else {
              return;
            }
          }
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })



    // var that = this;
    // var chargeList = that.data.chargeList;
    // var charges = [];
    // for (var i = 0; i < chargeList.length; i++) {
    //   for (var j = 0; j < chargeList[i].ChargeDetails.length; j++) {
    //     if (chargeList[i].ChargeDetails[j].isChoosed) {
    //       charges.push(chargeList[i].ChargeDetails[j]);
    //     }
    //   }
    // }
    // var data = JSON.stringify(charges);
    // // console.log(data);
    // wx.navigateTo({
    //   url: '../payment/payment?charges=' + data,
    // })
    // // WXPayment(that);

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

})


/**
  * 微信支付
  */
// function WXPayment(that) {
//   var sessionId = wx.getStorageSync("sessionId");
//   var unifiedOrderResult = {};
//   var timestamp = getTimeStamp();
//   wx.request({
//     url: "http://192.168.0.111/wxuser/Charge/OnUnifiedOrder",
//     method: "POST",
//     header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
//     data: { sessionId: sessionId, totalCharge: 0.1, ids: getIds(that) },
//     success: res => {
//       console.log(res);
//       var result = res.data;
//       if (result.status == "Success") {
//         unifiedOrderResult = JSON.parse(result.data);
//         if (unifiedOrderResult.return_code && unifiedOrderResult.result_code) {
//           var paySign = getPaySign(timestamp, "5K8264ILTKCH16CQ2502SI8ZNMTM67VS", unifiedOrderResult.prepay_id, "MD5");
//           wx.requestPayment({
//             timeStamp: getTimeStamp(),
//             nonceStr: '5K8264ILTKCH16CQ2502SI8ZNMTM67VS',
//             package: 'prepay_id=' + unifiedOrderResult.prepay_id,
//             signType: 'MD5',
//             paySign: paySign,
//             success: res => {
//               console.log("requestpayment");
//               console.log(res);
//             },
//             fail: res => {
//               console.log("dkdkdkdkdk");
//               console.log(res);
//             }
//           })
//         }
//       }
//       else {
//         wx.showModal({
//           title: '提示',
//           content: '您已退出登陆，点击确定重新登陆',
//           showCancel: false,
//           success: function () {
//             wx.reLaunch({
//               url: '../welcome/welcome',
//             })
//           }
//         })
//       }
//     },
//     fail: res => {
//       console.log(res);
//     }
//   })

  // if (prepayId){
  //   return prepayId;
  // }
// }



/**
 * 生成微信支付需要的paysign签名
 */
// function getPaySign(timeStamp, nonceStr, ipackage, signType) {
//   var paySign = "";
//   paySign += "appId=" + "wx3bfed4fd2abe0355" + "&";
//   paySign += "nonceStr=" + nonceStr + "&";
//   paySign += "package=prepay_id=" + ipackage + "&";
//   paySign += "signType=" + signType + "&";
//   paySign += "timeStamp=" + timeStamp + "&";
//   paySign += "key=" + "guangzhouhexiruanjiangongsigzhxw";
//   paySign = MD5.md5(paySign);
//   paySign = paySign.toUpperCase();
//   return paySign;
// }

/**
 * 获取应收列表
 */
function getChargeList(that) {
  // var userInfo = wx.getStorageSync("userInfo") || {};
  // that.setData({
  //   userInfo: userInfo
  // })
  // var currentZT = wx.getStorageSync("currentZT");
  var submitData = that.data.submitData;
  submitData.serverUrl = config.urls.getChargeDetailUrl
  wx.showLoading({
    title: '正在加载...',
  })
  wx.request({
    url: config.urls.cloudUrl,
    method: "POST",
    header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
    data: submitData,
    success: res => {
      console.log(res);
      wx.hideLoading();
      if (res.data.status == "Fail") {
        wx.showModal({
          title: '提示',
          content: '未查询到任何未交费记录',
          showCancel: false,
          success: function () {
            wx.navigateBack({
              delta: 1
            })
          }
        })
        return;
      }
      var chargeList = getCharges(that, res.data.data)
      var ids = [];
      if(chargeList){
        for (var i = 0; i < chargeList.length; i++) {
          for(var j = 0; j < chargeList[i].ChargeDetails.length; j++){
            ids.push(chargeList[i].ChargeDetails[j].Id);
          }
        }
      }
      console.log(ids);
      // return;
      that.setData({
        chargeList: chargeList || [],
        chargeIds: ids || [],
      })
      computeCharge(that);
    },
    fail: res => {
      console.log(res);
    }
  })
}

/**
 * 支付成功后，设置本地应收款记录
 */
function setCharges(that, paymentMethod) {
  var chargeList = that.data.chargeList;
  var userInfo = wx.getStorageSync("userInfo");
  wx.request({
    url: config.urls.cloudUrl,
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=uft-8'
    },
    data: {
      datetime: getDateTime(),
      name: userInfo.UserName,
      chargeIds: that.data.chargeIds,
      serverUrl: config.urls.setChargesUrl,
      paymentMethod: paymentMethod
    },
    success: res => {
      console.log(res);
      if (res.data.status == "Success") {
        wx.showModal({
          title: '提示',
          content: '收费成功，点击确定返回上一页',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
      else {
        wx.showModal({
          title: '提示',
          content: '收费失败，发生未知错误，请稍后重试',
          showCancel: false
        })
        return;
      }
    },
    fail: res => {
      console.log(res);
      wx.showModal({
        title: '提示',
        content: '收费失败，发生未知错误，请稍后重试',
        showCancel: false
      })
      return;
    },
    complete: res => {
      // getChargeList(that);
    }
  })

  // console.log("charges is:")
  // console.log(charges);
}


function getIds(that) {
  var chargeList = that.data.chargeList;
  var ids = [];
  for (var charge in chargeList) {
    if (charge.isChoosed) {
      ids.push(parseInt(charge.Id));
    }
  }
  console.log("ids:")
  console.log(ids);
  return ids;
}

/**
 * 
 */
function getCharges(that, data) {
  var chargeData = data;
  //  chargeData.isAllChoosed = true;
  for (var i = 0; i < chargeData.length; i++) {
    chargeData[i].isAllChoosed = true;
    for (var j = 0; j < chargeData[i].ChargeDetails.length; j++) {
      chargeData[i].ChargeDetails[j].isChoosed = true;
    }
  }
  console.log("chargeList is: ");
  console.log(chargeData);
  return chargeData;
}

/**
 * 计算应收总合计
 */
function computeCharge(that) {
  var chargeData = that.data.chargeList;
  var totalCharge = 0;
  for (var i = 0; i < chargeData.length; i++) {
    for (var j = 0; j < chargeData[i].ChargeDetails.length; j++) {
      if (chargeData[i].ChargeDetails[j].isChoosed) {
        totalCharge += chargeData[i].ChargeDetails[j].Charge;
      }
    }
  }
  that.setData({
    totalCharge: totalCharge
  })
}

/**
 * 生成时间戳
 */
function getTimeStamp() {
  var date = new Date();
  var timestamp = Date.parse(date).toString();
  timestamp = parseInt(timestamp / 1000).toString();
  return timestamp;
}

/**
 * 生成日期字符串
 */
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

/**
 * 生成日期时间字符串
 */
function getDateTimeNumber() {
  var date = new Date;
  var year = (Number(date.getFullYear()));
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var dateString = year + appendZero(month) + appendZero(day) + appendZero(hour) + appendZero(minute) + appendZero(second);
  return dateString;
}



function appendZero(value) {
  if (Number(value) < 10) {
    return "0" + value;
  }
  else {
    return value;
  }
}







/**
 * 生成统一下单订单号
 */
// function getOutTradeNumber() {
//   var randomNumber = Math.round(Math.random() * 10000);
//   return "" + getDateTimeNumber() + "" + randomNumber;
// }

// function appendZero(value) {
//   if (Number(value) < 10) {
//     return "0" + value;
//   }
//   else {
//     return value;
//   }
// }












function temp() {
  // var userInfo = wx.getStorageSync("userInfo") || {};
  // that.setData({
  //   userInfo: userInfo
  // })
  // wx.showLoading({
  //   title: '正在加载...',
  // })
  // wx.request({
  //   url: "http://192.168.0.111/wxuser/Charge/OnGetCharges",
  //   method: "POST",
  //   data: { ztCode: userInfo.ZTCode, roomId: userInfo.RoomId, proprietorId: userInfo.Id },
  //   success: res => {
  //     console.log(res);
  //     wx.hideLoading();
  //     if (res.data.length == 0) {
  //       wx.showModal({
  //         title: '提示',
  //         content: '未查询到任何未交费记录',
  //         showCancel: false,
  //         success: function () {
  //           wx.navigateBack({
  //             delta: 1
  //           })
  //         }
  //       })
  //       return;
  //     }
  //     var chargeList = getChargeList(that, res.data)
  //     that.setData({
  //       chargeList: chargeList || []
  //     })
  //     computeCharge(that);
  //   },
  //   fail: res => {
  //     console.log(res);
  //   }
  // })
}


// buttonTaped: function(e){
  //   var that = this;
  //   var chargeList = that.data.chargeList;
  //   var charges = [];
  //   for (var i = 0; i < chargeList.length; i++){
  //     for (var j = 0; j < chargeList[i].ChargeDetails.length; j++){
  //       if (chargeList[i].ChargeDetails[j].isChoosed) {
  //         charges.push(chargeList[i].ChargeDetails[j].Id);
  //       }
  //     }
  //   }
  //   var userInfo = wx.getStorageSync("userInfo");
  //   wx.request({
  //     url: "http://192.168.0.111/wxuser/Charge/OnSetCharges",
  //     method: "POST",
  //     data: { datetime: getDateTime(), 
  //             totalCharge: parseFloat(that.data.totalCharge), 
  //             roomName: userInfo.RoomNumber,
  //             proprietorName: userInfo.Name,
  //             chargeIds: charges},
  //     success: res => {
  //       console.log(res);
  //     },
  //     fail: res => {
  //       console.log(res);
  //     },
  //     complete: res => {
  //       getChargeList(that);
  //     }
  //   })

  //   console.log("charges is:")
  //   console.log(charges);
  // },
