// pages/roomlist/roomlist.js
import {
  queryAllMeetingRoom
} from '../../api/api.js';
import request from "../../utils/request.js";
import Util from '../../utils/util.js';
import Config from '../../config.js';
const GenerateTestUserSig = require("../webrtc-room/debug/GenerateTestUserSig.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomlist: [{
        id: 0,
        roomNumber: 123456,
        userName: '张三',
        userNumber: '直播房间',
        curnum: 2,
        time: '2小时'
      },
      {
        id: 1,
        roomNumber: 123456,
        userName: '张三',
        userNumber: '直播房间',
        curnum: 2,
        time: '2小时'
      }
    ],
    userID: '',
    tapTime: ''
  },
  notice: function() {
    wx.requestSubscribeMessage({
      tmplIds: ['模板消息id1', '模板消息id2'],
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  goToLiveRoom: function(e) {
    console.log(e)
    if (!e.currentTarget.dataset.roomid)
      return;
    var roomid = e.currentTarget.dataset.roomid;
    var roomName = '';
    for (let index in this.data.roomlist) {
      if (this.data.roomlist[index].roomNumber == roomid) {
        roomName = this.data.roomlist[index].userName
        console.log("roomName===>", roomName)
      }
    }



    var self = this;
    // 防止两次点击操作间隔太快
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    // self.data.userID = new Date().getTime().toString(16);
    // var userSig = GenerateTestUserSig.genTestUserSig(self.data.userID);
    
    let userInfo = {
      userNumber: app.globalData.userInfo.userClass == 2 ? Number(app.globalData.userInfo.userPhone): Number(app.globalData.userInfo.jobNumber)
    }
    console.log("post : wechat-user/ getUserSig", userInfo)
    // let url = "wechat-user/getUserSig?userNumber=" + Number(app.globalData.userInfo.jobNumber);
    request.post("wechat-user/getUserSig", userInfo).then(res => {
      console.log("获取到的userSig",res)
      let userSig = res.userSig
      
      var url = `/pages/webrtc-room/room/room?roomID=${roomid}&template=float&sdkAppID=${Config.SDKAPPID_config}&userId=${userInfo.userNumber}&userSig=${userSig}&userName=${roomName}`;
      wx.navigateTo({
        url: url
      });
      wx.showToast({
        title: '进入房间',
        icon: 'success',
        duration: 1000
      })

      self.setData({
        'tapTime': nowTime
      });
    }).catch(err => {
      Util.Tips({title:"获取userSig失败！"})
    })




  },
  notice: function() {
    wx.requestSubscribeMessage({
      tmplIds: ['模板消息id1', '模板消息id2'],
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.log(err)
      }
    })
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
    var that = this
    queryAllMeetingRoom().then(res => {
      console.log(res)
      if (res) {
        that.setData({
          roomlist: res
        })
        console.log("roomlist===>", that.data.roomlist)
      }
    }).catch(err => {
      Util.Tips({
        title: '获取房间信息失败'
      })
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})