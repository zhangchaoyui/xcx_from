// pages/timeToScreen/timeToScreen.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: "选择时间",
    endTime: "选择时间",
    calendarStartShow: false,
    calendarEndShow: false
  },

  // 开始时间
  timeLeft() {
    this.setData({
      calendarStartShow: !this.data.calendarStartShow
    });
    if (this.data.calendarEndShow) {
      this.setData({
        calendarEndShow: false
      });
    }
  },

  // 结束时间
  timeRight() {
    this.setData({
      calendarEndShow: !this.data.calendarEndShow
    });
    if (this.data.calendarStartShow) {
      this.setData({
        calendarStartShow: false
      });
    }
  },

  // 显示开始时间
  getAddInfoStart(e) {
    this.setData({
      startTime: e.detail
    })
  },

  // 显示结束时间
  getAddInfoEnd(e) {
    this.setData({
      endTime: e.detail
    })
  },

  // 完成按钮
  finishClick() {
    console.log(this.data.startTime, this.data.endTime);
    var startTime = this.data.startTime,
      endTime = this.data.endTime;
    if (startTime == "选择时间" || endTime == "选择时间") {
      wx.showToast({
        title: '请选择预计到达时间',
        icon: 'none',
        duration: 1000
      });
    } else {
      wx.setStorageSync("startTime", Date.parse(startTime.replace(/-/g, '/'))/1000);
      wx.setStorageSync("endTime", Date.parse(endTime.replace(/-/g, '/'))/1000+86399);
      wx.navigateBack({
        delta: 1
      })

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 清除上次选择时间
    wx.clearStorageSync("startTime");
    wx.clearStorageSync("endTime");
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