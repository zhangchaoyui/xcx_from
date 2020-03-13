  const api_root = 'https://qishun.400539.com' // 站点配置文件

  /**
   * get请求
   */
  function get(url, data, success, fail, complete, check_login) {
    wx.showNavigationBarLoading();
    let _this = this;
    // 构造请求参数
    data = data || {};
    
    // 构造get请求
    // let request = function () {
    data.token = wx.getStorageSync('token');
    wx.request({
      url: _this.api_root + url,
      header: {
        'content-type': 'application/json'
      },
      data: data,
      success(res) {
        if (res.statusCode !== 200 || typeof res.data !== 'object') {
          _this.showError('网络请求出错');
          return false;
        }
        if (res.data.code === 10010) {
          wx.reLaunch({
            url: '../news/index',
          })
        }
        if (res.data.code === -1) {
          // 登录态失效, 重新登录
          wx.hideNavigationBarLoading();
          _this.showError(res.data.msg, function () {
            fail && fail(res);
          });
          return false;
        } else if (res.data.code === 0) {
          _this.showError(res.data.msg, function () {
            fail && fail(res);
          });
          return false;
        } else {
          success && success(res.data);
        }
      },
      fail(res) {
        if (res.errMsg !== "request:fail interrupted") {
          _this.showError(res.errMsg, function () {
            fail && fail(res);
          });
        }
      },
      complete(res) {
        wx.hideNavigationBarLoading();
        complete && complete(res);
      },
    });
    // };
  }

  /**
   * post提交
   */
  function post_form(url, data, success, fail, complete, isShowNavBarLoading) {
    let _this = this;
    isShowNavBarLoading || true;
    data.token = wx.getStorageSync('token');
    // 在当前页面显示导航条加载动画
    if (isShowNavBarLoading == true) {
      wx.showNavigationBarLoading();
    }
    wx.request({
      url: _this.api_root + url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      data: data,
      success(res) {
        if (res.statusCode !== 200 || typeof res.data !== 'object') {
          _this.showError('网络请求出错');
          return false;
        }
        if (res.data.code === -1) {
          // 登录态失效, 重新登录
          wx.hideNavigationBarLoading();
          _this.showError(res.data.msg, function () {
            fail && fail(res);
          });
          return false;
        } else if (res.data.code === 0) {
          _this.showError(res.data.msg, function () {
            fail && fail(res);
          });
          return false;
        }
        success && success(res.data);
      },
      fail(res) {
        console.log(res);
        if (res.errMsg !== "request:fail interrupted") {
          _this.showError(res.errMsg, function () {
            fail && fail(res);
          });
        }
      },
      complete(res) {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        complete && complete(res);
      }
    });
  }

  module.exports = {
    post_form: post_form,
    get: get
  }