// pages/authrize/authrize.js
import {
  login
} from '../../api/api.js';
import Util from '../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNew: false,
    userTypeList: [{
        id: 0,
        name: '报警用户'
      },
      {
        id: 1,
        name: '消防用户'
      },
      {
        id: 2,
        name: '高级用户'
      }
    ],
    userType:0,
    isLogin:null,
    needPhone:false,
  },
  
  setUserInfo(userInfo, isLogin) {
    let that = this;
    wx.showLoading({
      title: '正在登录中'
    });
    if (isLogin) {
      that.getWxUserInfo(userInfo);
    } else {
      Util.getCodeLogin((res) => {
        // console.log(res)
        Util.wxgetUserInfo().then(userInfo => {
          // console.log(userInfo)
          //userInfo.code = res.code;
          //that.getWxUserInfo(userInfo);
          let data = {
            code: res.code
          };
          Util.handleLogin(data);
        }).catch(res => {
          wx.hideLoading();
        });
      });
    }
  },
  getWxUserInfo: function(userInfo) {
    var that = this;
    console.log(userInfo)
    login(userInfo).then(res => {
      // console.log(res.data.userInfo.is_new)
      //取消登录提示
      wx.hideLoading();
      if (res.data.userInfo.is_new) {
        that.setData({
          isNew: true
        })
      }
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.isLog = true;
      Util.navigateToPages(res.data.userInfo.usertype);
    }).catch((err) => {
      wx.hideLoading();

    });
  },
  hideModal(e) {
    this.setData({
      isNew: false
    })
  },
  changeUserType(e){
    console.log(e.detail)
    var that = this
    if(e.detail.value){
      that.setData({
        userType:e.detail.value || 0
      })
      if(that.data.needPhone){
        that.goToBindPhone()
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if (app.globalData.isLog) {
      console.log(1111)
      this.setData({
        isLogin: app.globalData.isLog,
        isNew: app.globalData.userInfo.is_new
      })
    }
    else{
      this.autoLogin();
    }
  },
  goToBindPhone:function(){
    wx.redirectTo({
      url: '/pages/bindPhone/bindPhone',
    })
  },
  autoLogin:function(){
    var that = this;
    Util.chekWxLogin().then((res) => {
      Util.getCodeLogin((res) => {
        console.log(res)
        wx.showLoading({
          title: '正在登录中'
        });
        Util.wxgetUserInfo().then(userInfo => {
          userInfo.code = res.code;
          let data = {
            code: res.code
          };
          that.handleLogin(data);
        }).catch(res => {

        });
      });
    }).catch(res => {
      Util.Tips({ title: '请点击授权按钮' });
    }) 
  },
  handleLogin:function(data){
    var that = this;
    console.log("post code to login",data)
    login(data).then(res => {
      console.log("login===>",res)
      
      //console.log(data)
      //取消登录提示
      wx.hideLoading();
      if(res.status == -2){
        var is_new = 1;
        var is_bindnum = 1;
        wx.navigateTo({
          url: '/pages/bindPhone/bindPhone?is_new=' + is_new + '&is_bindnum=' + is_bindnum,
        })
      }
      else if(res.status == 1){
        app.globalData.userInfo = res.data
        app.globalData.isLog = true;
        // if (res.data.userClass == 1 || res.data.userClass == 2) {
        //   app.globalData.sendLocTimer = setInterval(function () {
        //     wx.getLocation({
        //       type: 'wgs84',
        //       success(res) {
        //         console.log(new Date().toString(), res)
        //         app.globalData.loc = res
        //       }
        //     })
        //   }, app.globalData.time)
        // }
        wx.redirectTo({
          url: '/pages/user/user',
        })        
      }
      /*
      
      console.log(res.userInfo !== undefined)
      if (res.userInfo !== undefined) {
        //console.log(111)
        app.globalData.userInfo = res.userInfo;
        app.globalData.isLog = true;
        that.setData({
          isLogin:true
        })        
        //console.log(res.data.userInfo.is_new)
        let data = res;

        if (data.userInfo.is_new || data.userInfo.phoneNum == null) {
            var is_new = data.userInfo.is_new?1:0;
            var is_bindnum = data.userInfo.phoneNum == null?1:0;
            wx.navigateTo({
              url: '/pages/bindPhone/bindPhone?is_new='+is_new+'&is_bindnum='+is_bindnum,
            })
        }
        else {
          //console.log(res.data.userInfo.usertype)
          if (data.userInfo.usertype == 1 || data.userInfo.usertype == 2) {
            app.globalData.sendLocTimer = setInterval(function () {
              wx.getLocation({
                type: 'wgs84',
                success(res) {
                  console.log(new Date().toString(), res)
                  app.globalData.loc = res
                }
              })
            }, app.globalData.time)
          }
          wx.navigateTo({
            url: '/pages/user/user',
          })
        }
      }
      else {
        console.log('fail')
        Util.Tips({ title: '获取登录信息失败' });
      }
      */
    }).catch((err) => {
      wx.hideLoading();
      Util.Tips({ title: err + '' });
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  goToBindPhone:function(){
    wx.redirectTo({
      url: '/pages/bindPhone/bindPhone',
    })
  }
})