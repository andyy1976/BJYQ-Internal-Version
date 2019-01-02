//app.js
const config = require("utils/config.js");
App({
  globalData: {
    userInfo: null,
    cloudUrl: "http://192.168.0.111/wxics/SendData/OnSendData"
  },

  


  onLaunch: function () {
    var that = this;
  
    // if (!wx.getStorageSync("sessionId")){
      // that.checkSession();
    // }
    // wx.checkSession({
    //   success: res => {
    //     console.log(res);
    //   }
    // })    
    
    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // login();
    // return;
    // 登录
    // wx.checkSession({
    //   success: res => {
    //     console.log(res);
    //     // login();
    //   },
    //   fail: res => {
    //     console.log(res);
    //     login();
    //   }
    // })
    
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },

  

  checkSession: function() {
    var that = this;
    wx.checkSession({
      success: res => {
        console.log(res);
        var sessionId = wx.getStorageSync("sessionId");
        if (sessionId) {
          that.getUserInfo();
        }
        else {
          that.login();
        }
      },
      fail: res => {
        console.log(res);
        that.login();
      }
    })
  },

  /**
 * 自定义函数，跳转到登陆界面
 */
  toLogin: function() {
    wx.navigateTo({
      url: '../login/login',
    })
  },

/**
 * 自定义函数，获取用户信息
 */
  getUserInfo: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: config.urls.cloudUrl,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=uft-8'
      },
      data: {
        sessionId: wx.getStorageSync("sessionId"),
        serverUrl: config.urls.getUserInfoUrl
      },
      success: function (res) {
        console.log("getUserInfo");
        console.log(res);
        if (res.statusCode != 200 || (res.statusCode == 200 && !res.data.data)) {
          console.log("网络错误");
          // wx.showModal({
          //   title: '提示',
          //   content: '网络错误，无法获取个人信息，点击确认重试',
          // })
          // wx.navigateTo({
          //   url: '../userinfo/userinfo',
          // })
        }
        wx.hideLoading();
        if (res.data.status == "Fail") {
          if (res.data.result == "无此用户") {
            that.toLogin();
          }
          else {
            that.login();
          }
        }
        else {
          wx.hideLoading();
          var userInfo = res.data.data;
          // that.setData({
            // that.globalData.userInfo = userInfo
          // })
          wx.setStorageSync("userInfo", userInfo);
          // that.setData({
          // that.globalData.pageHidden = false
          // })
          console.log("user is:");
          console.log(userInfo);
          if (!wx.getStorageSync("currentZT")) {
            wx.setStorageSync("currentZT", userInfo.ZTInfo[0]);
            // that.setData({
            // that.globalData.currentZT = userInfo.ZTInfo[0]
            // })
          }
        }
      },
      fail: res => {
        console.log("网络错误");
      }
    })
  },

  login: function() {
    var that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        wx.request({
          url: config.urls.cloudUrl,
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=uft-8'
          },
          data: {
            code: res.code,
            serverUrl: config.urls.loginUrl
          },
          success: function (res) {
            console.log(res);
            var result = res.data;
            if (result.success) {
              wx.setStorageSync("sessionId", result.sessionId);
              that.getUserInfo();
            }
          },
          fail: function (res) {
            console.log("wx.login发生错误");
            console.log(res);
          }
        })
      }
    })
  }
})

