const app = getApp()
const GenerateTestUserSig = require("../debug/GenerateTestUserSig.js");

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    roomNo: '',
    userID: '',
		tapTime: '',
		template: 'float'
	},

	// 绑定输房间号入框
	bindRoomNo: function (e) {
		var self = this;
		self.setData({
			roomNo: e.detail.value
		});
	},
  /*
	radioChange: function (e) {
		this.setData({
			template: e.detail.value
		})
		console.log('this.data.template', this.data.template)
	},
*/

	// 进入rtcroom页面
	joinRoom: function () {

		var self = this;
		// 防止两次点击操作间隔太快
		var nowTime = new Date();
		if (nowTime - this.data.tapTime < 1000) {
			return;
		}

		if (!self.data.roomNo) {
			wx.showToast({
				title: '请输入房间号',
				icon: 'none',
				duration: 2000
			})
			return
		}

		if (/^\d\d+$/.test(self.data.roomNo) === false) {
			wx.showToast({
				title: '只能为数字',
				icon: 'none',
				duration: 2000
			})
			return
		}

    self.data.userID = new Date().getTime().toString(16);
    var userSig = GenerateTestUserSig.genTestUserSig(self.data.userID);

    var url = `../room/room?roomID=${self.data.roomNo}&template=${self.data.template}&sdkAppID=${userSig.sdkAppID}&userId=${self.data.userID}&userSig=${userSig.userSig}`;

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
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    if (app.globalData.roomNum){
      this.setData({
        roomNo: app.globalData.roomNum
      })
      this.joinRoom()
    }
	}
})