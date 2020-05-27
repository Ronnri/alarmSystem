import {
  HTTP_REQUEST_URL
} from './config.js';
import Util from './utils/util.js';
import {
  login
} from './api/api.js';
//app.js
App({
  onLaunch: function(option) {
    if (HTTP_REQUEST_URL == '') {
      console.error("请配置根目录下的config.js文件中的 'HTTP_REQUEST_URL'");
      return false;
    }
    var that = this;
    // 登录
    /*Util.chekWxLogin().then((res) => {
      Util.getCodeLogin((res) => {
        console.log(res)
        wx.showLoading({
          title: '正在登录中'
        });
        Util.wxgetUserInfo().then(userInfo => {
          userInfo.code = res.code;
          login(userInfo).then(res => {
            //console.log(res.data.userInfo.is_new)
            //取消登录提示
            wx.hideLoading();
            if (res.data.userInfo.is_new) {
              that.globalData.userInfo = res.data.userInfo;
              that.globalData.isLog = true;
<<<<<<< HEAD
              //console.log(getCurrentPages())
            }
            else{
              Util.navigateToPages(res.data.userInfo.usertype);
=======
              wx.navigateTo({
                url: '/pages/authrize/authrize',
                complete: function() {

                }
              })
>>>>>>> 626883cdb45b576f2ce00f95325689782957f6cb
            }
          }).catch((err) => {
            wx.hideLoading();

          });
        }).catch(res => {

        });
      });
    }).catch(res => {
      console.log('refuse')
      wx.navigateTo({
        url: '/pages/authrize/authrize',
<<<<<<< HEAD
        complete:function(){
                  
=======
        complete: function() {
          that.Tips({
            title: '请点击按钮授权'
          });
>>>>>>> 626883cdb45b576f2ce00f95325689782957f6cb
        }
      })
    })*/
    if (option.query.hasOwnProperty('scene')) {
      switch (option.scene) {
        //扫描小程序码
        case 1047:
          that.globalData.code = option.query.scene;
          break;
          //长按图片识别小程序码
        case 1048:
          that.globalData.code = option.query.scene;
          break;
          //手机相册选取小程序码
        case 1049:
          that.globalData.code = option.query.scene;
          break;
          //直接进入小程序
        case 1001:
          that.globalData.spid = option.query.scene;
          break;
      }
    }
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调

    })
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });
    updateManager.onUpdateFailed(function() {
      return that.Tips({
        title: '新版本下载失败'
      });
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow(options) {
    // Do something when show.
  },
  onHide() {
    //  clearInterval(this.sendLocTimer)
  },
  onError(msg) {
    //clearInterval(this.sendLocTimer)
  },
  Tips: function(opt, to_url) {
    return Util.Tips(opt, to_url);
  },
  globalData: {

    userInfo: {},
    url: HTTP_REQUEST_URL,
    token: '',
    isLog: false,
    userCode: '',

    sendLocTimer: null,

    //时间间隔
    time: 3000
  }
})