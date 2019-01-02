
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startMonth: getDate(),
    endMonth: getDate(),
    startMonthHidden: false,
    endMonthHidden:false
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

  },

  /**
   * 已收未收状态发生变化
   */
  chargeChange: function (e) {
    var that = this;
    console.log(e);
    if (e.detail.value == "未收"){
      that.setData({
        startMonthHidden:true,
        endMonthHidden:true,
      })
    }
    else{
      that.setData({
        startMonthHidden: false,
        endMonthHidden: false,
      })
    }
  },

  dateChange: function (e) {
    var that = this;
    console.log(e);
    var id = e.currentTarget.id;
    var chooseMonth = e.detail.value;
    // var tempArr = temp.split("-");
    // var chooseMonth = tempArr[0] + tempArr[1];
    console.log(chooseMonth)
    if (id == "startMonth"){
      that.setData({
        startMonth: chooseMonth
      })
    }
    else{
      that.setData({
        endMonth: chooseMonth
      })
    }
    
  },

  /**
   * 点击查询按钮触发
   */
  submit: function (e) {
    console.log(e);
    var submitData = e.detail.value;
    if (!submitData.homeNumber && !submitData.name && !submitData.buildingNumber) {
      wx.showModal({
        title: '提示',
        content: '请至少输入一项查询条件',
        showCancel: false
      })
      return;
    }
    var startArr = submitData.startMonth.split("-");
    submitData.startMonth = startArr[0] + startArr[1];
    var endArr = submitData.endMonth.split("-");
    submitData.endMonth = endArr[0] + endArr[1];
    // if (parseInt(submitData.endMonth) - parseInt(submitData.startMonth) > 3){
    //   wx.showModal({
    //     title: '提示',
    //     content: '结束月份和开始月份最多相差三个月',
    //     showCancel: false
    //   })
    //   return;
    // }
    if (submitData.isCharge == "已收"){
      wx.navigateTo({
        url: '../chargedList/chargedList?queryInfo=' + JSON.stringify(submitData),
      })
    }
    else{
      wx.navigateTo({
        url: '../chargeList/chargeList?queryInfo=' + JSON.stringify(submitData),
      })
    }
      
  },
})


function getDate() {
  var date = new Date;
  var year = (Number(date.getFullYear()));
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var dateString = year + "-" + appendZero(month);
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