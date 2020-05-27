import {
  login
} from '../api/api.js';
import Config from '../config.js';
const formatTime = date => {

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatTime2 = date => {

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const checkLogin = function() {
  let res = getApp().globalData.token ? true : false;
  let res1 = getApp().globalData.isLog;
  let res2 = res && res1;
  if (res2) {
    let newTime = Math.round(new Date() / 1000);
    if (getApp().globalData.expiresTime < newTime) return false;
  }
  return res2;
}
const chekWxLogin = function() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.userInfo']) {
          return reject({
            authSetting: false
          });
        } else {
          if (checkLogin()) {
            return resolve({
              userinfo: getApp().globalData.userInfo,
              isLogin: true
            });
          } else {
            wxgetUserInfo().then(userInfo => {
              return resolve({
                userInfo: userInfo,
                isLogin: false
              });
            }).catch(res => {
              return reject(res);
            })
          }
        }
      },
      fail(res) {
        return reject(res);
      }
    })
  })
}
const Tips = function(opt, to_url) {
  if (typeof opt == 'string') {
    to_url = opt;
    opt = {};
  }
  var title = opt.title || '',
    icon = opt.icon || 'none',
    endtime = opt.endtime || 2000;
  if (title) wx.showToast({
    title: title,
    icon: icon,
    duration: endtime
  })
  if (to_url != undefined) {
    if (typeof to_url == 'object') {
      var tab = to_url.tab || 1,
        url = to_url.url || '';
      switch (tab) {
        case 1:
          //一定时间后跳转至 table
          setTimeout(function() {
            wx.switchTab({
              url: url
            })
          }, endtime);
          break;
        case 2:
          //跳转至非table页面
          setTimeout(function() {
            wx.navigateTo({
              url: url,
            })
          }, endtime);
          break;
        case 3:
          //返回上页面
          setTimeout(function() {
            wx.navigateBack({
              delta: parseInt(url),
            })
          }, endtime);
          break;
        case 4:
          //关闭当前所有页面跳转至非table页面
          setTimeout(function() {
            wx.reLaunch({
              url: url,
            })
          }, endtime);
          break;
        case 5:
          //关闭当前页面跳转至非table页面
          setTimeout(function() {
            wx.redirectTo({
              url: url,
            })
          }, endtime);
          break;
      }

    } else if (typeof to_url == 'function') {
      setTimeout(function() {
        to_url && to_url();
      }, endtime);
    } else {
      //没有提示时跳转不延迟
      setTimeout(function() {
        wx.navigateTo({
          url: to_url,
        })
      }, title ? endtime : 0);
    }
  }
}
const wxgetUserInfo = function() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      lang: 'zh_CN',
      success(res) {
        resolve(res);
      },
      fail(res) {
        reject(res);
      }
    })
  });
}
const getCodeLogin = function(successFn) {
  wx.login({
    success(res) {
      successFn(res);
    }
  })
}
const isUndefined = function(v) {
  return v === undefined || v === null
}
const navigateToPages = function(usertype) {
  console.log(isUndefined(usertype))
  if (isUndefined(usertype))
    return;
  switch (usertype) {
    case 0:
      wx.redirectTo({
        url: '/pages/alarmUser/alarmUser',
      })
      break;
    case 1:
      wx.redirectTo({
        url: '/pages/fireMan/fireMan',
      })
      break;
    case 2:
      wx.redirectTo({
        url: '/pages/seniorUser/seniorUser',
      })
      break;
  }
}
const handleLogin = function(data, cb) {
  var that = this;
  login(data).then(res => {
    console.log(res)

    //console.log(data)
    //取消登录提示
    wx.hideLoading();
    if (res.status == -2) {
      var is_new = 1;
      var is_bindnum = 1;
      wx.navigateTo({
        url: '/pages/bindPhone/bindPhone?is_new=' + is_new + '&is_bindnum=' + is_bindnum,
      })
    } else if (res.status == 1) {
      getApp().globalData.userInfo = res.data
      getApp().globalData.isLog = true;

      wx.navigateTo({
        url: '/pages/user/user',
      })
    }
    typeof cb === 'function' && cb()
  }).catch((err) => {
    wx.hideLoading();
    Tips({
      title: err + ''
    });
  });
}
const sendMsg = function(data) {

}

const uploadIMG_one = (imgName, indexID) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: Config.HTTP_REQUEST_URL + 'wechat-user/uploadFiremenImages',
      filePath: imgName, //要上传文件资源的路径 String类型 
      name: 'multipartFiles',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        indexId: indexID
      },
      success(res) {
        resolve(res)
      },
      fail(res) {
        reject(res)
      }
    })
  })
}

const upLoadImgALL = function(upLoadFiles, indexID) {
  let p = []
  for (let i = 0; i < upLoadFiles.length; i++) {
    p.push(uploadIMG_one(upLoadFiles[i], indexID))
  }
  return new Promise((resolve, reject) => {
    Promise.all(p).then(res => {
      console.log("promise all success", res)
      resolve(res)
    }).catch(err=>{
      console.log("promise all err", err)
      reject(err)
    })
  })
}

const upLoadImgs = function(upLoadFiles, indexID) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < upLoadFiles.length; i++) {
      wx.uploadFile({
        url: Config.HTTP_REQUEST_URL + 'wechat-user/ uploadFiremenImages',
        // url: 'https://www.quanjiaoxiaofang.cn:8080/wechat-user/ uploadFiremenImages',
        filePath: upLoadFiles[i], //要上传文件资源的路径 String类型 
        name: 'multipartFiles',
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: {
          indexId: indexID
        },
        success(res) {
          resolve(res)
        },
        fail(res) {
          reject(res)
        }
      })
    }
  })
}


//防抖函数
function throttle(fn, interval) {
  var enterTime = 0; //触发的时间
  var gapTime = interval || 300; //间隔时间，如果interval不传，则默认300ms
  return function() {
    var context = this;
    var backTime = new Date(); //第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}
module.exports = {
  formatTime: formatTime,
  chekWxLogin: chekWxLogin,
  Tips: Tips,
  wxgetUserInfo: wxgetUserInfo,
  getCodeLogin: getCodeLogin,
  navigateToPages: navigateToPages,
  isUndefined: isUndefined,
  handleLogin: handleLogin,
  upLoadImgs: upLoadImgs,
  formatTime2: formatTime2,
  throttle: throttle,
  upLoadImgALL: upLoadImgALL
}