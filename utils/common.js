const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var handler = {
  login: function(){
    wx.login({
      success: function(res) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        wx.request({
          url: 'http://k17154485y.imwork.net/wx/WxOpen/OnLogin',
          method: "POST",
          data: {
            code: res.code
          },
          success: function (res) {
            console.log(res);
            var result = res.data;
            if (result.success) {
              wx.setStorageSync("sessionId", result.sessionId);
            }
          }
        })
      },
      fail: function(res) {},
    })
  },
  request: function(res) {

  }
}

module.exports = {
  formatTime: formatTime
}