//app.js
// 工具类
import util from './utils/util.js';
App({
  /**
   * 全局变量
   */
  globalData: {
    user_id: null,
    url: "",
  },

  // 网络
  getwangluo() {
    let _this = this;
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          _this.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000,
            complete: function () {
              // _this.goStartIndexPage()
              wx.redirectTo({
                url: '/pages/disnet/disnet?title=当前无网络'
              });
              console.log('当前无网络');
            }
          })
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        _this.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000,
          complete: function () {
            // _this.goStartIndexPage()
            wx.redirectTo({
              url: '/pages/disnet/disnet?title=网络已断开'
            });
            console.log('网络已断开');
          }
        })
      } else {
        _this.globalData.isConnected = true
        wx.hideToast()
      }
    });
  },

  onLaunch: function (e) {
    let _this = this;
    _this.onStartupScene(e.query);
    // 小程序主动更新
    _this.updateManager();
    _this.getwangluo();
  },

  /**
   * 小程序启动场景
   */
  onStartupScene(query) {
    // 获取场景值
    let scene = this.getSceneData(query);
    // 记录推荐人id
    let refereeId = query.referee_id ? query.referee_id : scene.uid;
    refereeId > 0 && (this.saveRefereeId(refereeId));
  },
  /**
   * 记录推荐人id
   */
  saveRefereeId(refereeId) {
    if (!wx.getStorageSync('referee_id'))
      wx.setStorageSync('referee_id', refereeId);
  },

  /**
   * 获取场景值(scene)
   */
  getSceneData(query) {
    return query.scene ? util.scene_decode(query.scene) : {};
  },

  /**
   * 显示失败提示框
   */
  showError(msg, callback) {
    wx.showModal({
      title: '友情提示',
      content: msg,
      showCancel: false,
      success(res) {
        callback && (setTimeout(function() {
          callback();
        }, 1500));
        callback && callback();
      }
    });
  },

  /**
   * 小程序主动更新
   */
  updateManager() {
    if (!wx.canIUse('getUpdateManager')) {
      return false;
    }
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    });
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，即将重启应用',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      });
    });
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
        showCancel: false
      })
    });
  },

  /**
   * 生成转发的url参数
   */
  getShareUrlParams(params) {
    let _this = this;
    return util.urlEncode(Object.assign({
      referee_id: _this.getUserId()
    }, params));
  },

  // 提示框
  hintComifg(tle) {
    wx.showToast({
      title: tle,
      icon: 'none',
      duration: 1000
    });
  },
  
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  /** 
   * 时间戳转化为年 月 日 时 分 秒 
   * number: 传入时间戳 
   * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
   */
  formatTimeTwo(number, format) {
    var formateArr = ['Y', 'M', 'D', 'H', 'M', 'S'];
    // var formateArr = ['Y','M', 'D','h', 'm'];
    var returnArr = [];
    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(this.formatNumber(date.getMonth() + 1));
    returnArr.push(this.formatNumber(date.getDate()));
    returnArr.push(this.formatNumber(date.getHours()));
    returnArr.push(this.formatNumber(date.getMinutes()));
    // returnArr.push(this.formatNumber(date.getSeconds()));
    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
  }
})