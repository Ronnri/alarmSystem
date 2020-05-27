// pages/contact/contact.js
var app = getApp();

Page({

  data: {
    contactList: [{
        id: 0,
        name: '公安',
        detail: '相关介绍相关介绍相关介绍相关介绍相关介绍相关介绍相关介绍相关介绍相关介绍相关介绍相关介绍相关介绍相关介绍相关介绍',
        tel: '111111'
      },
      {
        id: 0,
        name: '公安',
        detail: '相关介绍',
        tel: '111111'
      },
      {
        id: 0,
        name: '公安',
        detail: '相关介绍',
        tel: '111111'
      }
    ],
  },
  callPhone(e) {
    console.log(e.target.dataset.index)
    let index = e.target.dataset.index;
    if (index != undefined && index != null && this.data.contactList[index]) {
      console.log(this.data.contactList[index])
      let that = this;
      wx.makePhoneCall({
        phoneNumber: that.data.contactList[index].tel //仅为示例，并非真实的电话号码
      })
    }
  }

  // ,baojing: function() {
  //   wx.navigateTo({
  //     url: '../user/user?userType=0',
  //   })
  // },

  // xiaofang: function() {
  //   wx.navigateTo({
  //     url: '../user/user?userType=1',
  //   })
  // },

  // gaoji: function() {
  //   wx.navigateTo({
  //     url: '../user/user?userType=2',
  //   })
  // }

})