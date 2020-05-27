// pages/bindPhone/bindPhone.js
import Util from '../../utils/util.js';
import { getVerificationCode, register, login} from '../../api/api.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: null,
    userTypeList: ['报警用户','消防用户','高级用户'],
    form:{
      is_new:true,
      is_bindnum:true
    },
    formValue:{
      usertype:null,
      phoneNum:null,
      verifyCode:null
    },
    //获取验证码时间
    getCodeTime:null,
    //填写校验码组件
    verifycode:{verifycode:false},
    //0:未校验,1:校验成功,2:校验失败
    verifycodeStatus:0,
    disabled:false,
    timer:null,
    leftTime:null
  },
  changeStatus:function(e){
    console.log(e)
    if(e.detail.status){
      this.setData({
        verifycodeStatus:e.detail.status,
        index:e.detail.status == 2?0:this.data.index
      })
    }
  },
  getPhoneNumber(e){
    if(!app.globalData.isLog){
      Util.Tips({title:'尚未登陆'})
      wx.navigateTo({
        url: 'pages/authrize/authrize',
      })
    }
  },
  PickerChange(e) {
    console.log(e);
    let index = e.detail.value
    if(this.data.verifycodeStatus === 0){
      this.setData({
        index: index,
        'verifycode.verifycode': index != 0 ? true : false,
        verifycodeStatus:index == 0?1:this.data.verifycodeStatus
      })
    }
    else if(this.data.verifycodeStatus === 1){
      this.setData({
        index: index,
        'verifycode.verifycode': index != 0 ? true : false,
        verifycodeStatus:0
      })
    }
    else if(this.data.verifycodeStatus === 2 && index != 0){
      Util.Tips({title:'校验失败只能选择报警用户'})
    }else if(this.data.verifycodeStatus === 2 && index == 0){
      this.setData({
        index: index,
        verifycodeStatus: 1
      })      
    }

    
  },
  closeWindow:function(e){
    this.setData({
      'verifycode.verifycode':false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    if(options.is_new == undefined || options.is_bindnum == undefined ){
      wx.navigateBack({
        delta:1
      })
    }
    else{
      this.setData({
        'form.is_new':options.is_new,
        'form.is_bindnum': options.is_bindnum
      })
      //console.log(this.data.form)
    }
  },
  inputPhoneNumber:function(e){
    //console.log(e.detail.value)
    if(e.detail.value){
      this.setData({
        'formValue.phoneNum':e.detail.value
      })
    }
  },
  inputVerifyCode:function(e){
    if (e.detail.value) {
      this.setData({
        'formValue.verifyCode': e.detail.value
      })
    }
  },
  setTimer(){
    var that = this;
    return setTimeout(function(){
     
      var leftTime = parseInt(that.data.leftTime);
      console.log(leftTime)
      if (leftTime > 0){
        leftTime--;
        that.setData({
          leftTime: leftTime
        })        
      }
      else{
        clearTimeout(that.data.timer);
        that.setData({
          timer:null,
          leftTime:null
        })
      }
    },1000)
  },
  getCode: Util.throttle(function(e){
    console.log(e)
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.formValue.phoneNum))) {
      return Util.Tips({title:'请输入正确格式的手机号码'})
    } 
    var nowTime = new Date();
    let data = {
      userPhone:this.data.formValue.phoneNum,
      sendTime: nowTime
    }
    this.setData({
      disabled:true,
      leftTime:60,
    })
    var that = this;
    var timer = setInterval(function () {
      var leftTime = that.data.leftTime;
      leftTime--;
      if (leftTime <= 0) {
        clearInterval(timer);
        that.setData({
          leftTime: null,
          disabled: false
        })
      } else {
        that.setData({
          leftTime: leftTime,
          disabled: true
        })
      }
    }, 1000);
    var that = this
    getVerificationCode(data).then(res=>{
      console.log(res)
      if(res.status === 1){
        Util.Tips({title:res.msg})
        this.setData({
          getCodeTime: nowTime
        })
      }
      else{
        Util.Tips({ title: res.msg })
      }
    }).catch(err=>{
      Util.Tips({ title: err.msg + '' })
    })
    console.log(data)
  },2000),
  register:function(){
    if (this.data.verifycodeStatus !== 1) {
      return Util.Tips({ title: '校验未通过' })
    }
    if (this.data.verifycodeStatus == 2 && (this.data.index == 1 || this.data.index == 2)) {
      return Util.Tips({ title: '校验失败只能选择报警用户' })
    }
    if (this.data.verifycodeStatus === 0 && this.data.index != 0) {
      return Util.Tips({ title: '未完成校验' })
    }
    if(this.data.form.is_new == 1 && this.data.index === null)
      return Util.Tips({title:'请选择用户类型'})
    if (this.data.form.is_bindnum == 1 && this.data.formValue.phoneNum === null)
      return Util.Tips({ title: '请输入手机号码' })
    if (this.data.form.is_bindnum == 1 && this.data.formValue.verifyCode === null)
      return Util.Tips({ title: '请输入验证码' })
    if (this.data.form.is_bindnum == 1 ){
      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.formValue.phoneNum))) {
        return Util.Tips({ title: '请输入正确格式的手机号码' })
      } 
    }
    let data = {
      userClass:this.data.index || app.globalData.userInfo.usertype,
      userPhone: this.data.formValue.phoneNum,
      verifyCode: this.data.formValue.verifyCode,
    }
    Util.chekWxLogin().then((res) => {
      Util.getCodeLogin((res) => {
        data.code = res.code;
        register(data).then(res=>{
          console.log(res)
          if (res.status === 1){
            Util.Tips({title:'保存成功'})
            Util.chekWxLogin().then((res) => {
              Util.getCodeLogin((res) => {
                let data = {
                  code: res.code
                };
                Util.handleLogin(data,function(){
                  wx.requestSubscribeMessage({
                    tmplIds: [''],
                    success(res) { }
                  })
                });
              }).catch(err=>{
                Util.Tips({title:'获取code失败'})
                wx.navigateTo({
                  url: '/pages/authrize/authrize',
                })
              })
            }).catch(err => {
              Util.Tips({ title: '微信授权失败' })
              wx.navigateTo({
                url: '/pages/authrize/authrize',
              })
            })
          }
          else {
            Util.Tips({ title: res.msg+'' })
          }
        })
      });
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