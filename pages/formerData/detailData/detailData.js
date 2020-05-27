// pages/formerData/detailData/detailData.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:null,
    scale: 12,
    markers: [],
    mapHeight: 500,
    latitude:null,
    longitude:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options == undefined)
    {
      app.Tips({title:'加载异常'})
      wx.navigateBack({
        delta:1
      })
    }
    else{
      options.locationLongitude = Number(options.locationLongitude);
      options.locationLatitude = Number(options.locationLatitude);
      this.setData({
        detail:options,
        latitude: options.locationLatitude,
        longitude: options.locationLongitude
        
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    this.mapCtx = wx.createMapContext('myMap')
    this.setData({
      markers: [{
        id: "1",
        latitude: that.data.detail.locationLatitude,
        longitude: that.data.detail.locationLongitude,
        width: 20,
        height: 20,
        title: that.data.detail.locationName
      }]
    })
    console.log(this.data.detail.locationLatitude)
    console.log(this.data.detail.locationLongitude)
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