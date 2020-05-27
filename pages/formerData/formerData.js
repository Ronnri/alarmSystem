// pages/formerData/formerData.js
import { getHistoryData } from '../../api/api.js';
import Util from '../../utils/util.js';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [
    ], 
    start:null,
    end:null
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options.start || !options.end){
      Util.Tips({title:'页面加载异常'})
      wx.navigateBack({
        delta:1
      })
    }
    else{
      this.setData({
        start:options.start,
        end:options.end
      })
    }
    this.getDataList()
    //let that =this;

    /*request.get("menu/history-data").then(res=>{
      console.log(res)
      that.setData({
        dataList : res
      })
    }).catch(err=>{

    })*/
    
  },
  getDataList:function(){
    var that = this
    let data = {
      beginTime:that.data.start,
      endTime:that.data.end
    }
    getHistoryData(data).then(res=>{
      console.log(res)
      if (res.status === 1 && res.data.length > 0){
        let data = res.data;
        //console.log(data)
        for(let i = 0;i<data.length;i++){
          data[i].time_text = Util.formatTime(new Date(data[i].fireTime));
        }
        that.setData({
          dataList: data
        })
      }
      else{
        Util.Tips({ title: res.msg })
      }

    }).catch(err=>{
      console.log(err)
      Util.Tips({title:'数据加载异常'})
    })
  },
  goToDataDetail:function(e){
    console.log(e)
    if (e.currentTarget.dataset.index!==undefined && this.data.dataList.length == 0)
      return;
    var index = e.currentTarget.dataset.index;
    var url = '/pages/formerData/detailData/detailData?';
    var data = this.data.dataList[index]
    Object.keys(data).forEach(function (key) {
      url = url + '&' + key + '=' + data[key];

    });
    wx.navigateTo({
      url: url,
    })
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
    //this.getDataList()
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