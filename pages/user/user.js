import Util from '../../utils/util.js';
import request from "../../utils/request.js";
import Config from '../../config.js';
import getDate from '../../api/api.js';

const app = getApp();

Page({

  data: {
    colorTable: ["red", "orange", "yellow", "blue"],
    fireInfoRES: null,
    indexId: -1,
    accImgList: [], //获取到的
    imgList: [], //要上传的
    startDate: '2019-1-1',
    endDate: Util.formatTime2(new Date()),
    userType: '',
    fireTime: '',
    witnessPhone: '',
    accidentLevel: '',
    info: '',
    locationLongitude: '',
    locationLatitude: '',

    plateNumber: '选择',
    plateNumber_lastTime: '选择',
    jobNumber: '12345',
    firemenName: '张三',
    firemenState: '1',


    mapHeight: 500,
    alarmInforMaxLength: 200,
    alarmInforInputLength: 0,

    markers: '',

    accidentLevelBox: [{
      name: "1 级",
      value: '1',
    }, {
      name: "2 级",
      value: '2'
    }, {
      name: "3 级",
      value: '3'
    }, {
      name: "4 级",
      value: '4'
    }, ],
    index: null,

    radioboxItems: [{
        name: "假",
        value: '0',
        checked: false,
        color: "red"
      },
      {
        name: "班",
        value: '1',
        checked: false,
        color: "green"
      },
      {
        name: "忙",
        value: '2',
        checked: false,
        color: "yellow"
      },
    ],
    carNumberList: [],

    isfiremanReg: false,
    showBottomModal: false,
    illustrateModal: false,
    alarmLoading: false,
  },

  onLoad: function(option) {
    let userInfo = app.globalData.userInfo;
    //加载数据
    //选择渲染类型
    console.log("渲染类型：" + userInfo.userClass)
    let topbarName = Number(userInfo.userClass)
    if (topbarName == 0) {
      topbarName = "报警用户"
    } else if (topbarName == 1) {
      topbarName = "消防用户"
    } else {
      topbarName = "高级用户"
    }
    wx.setNavigationBarTitle({
      title: topbarName
    })
    this.setData({
      userType: userInfo.userClass || 0,
      witnessPhone: Number(userInfo.userPhone) || 0,
      firemenState: userInfo.firemenState || 0,
      firemenName: userInfo.firemenName,
      jobNumber: userInfo.jobNumber == 0 ? '' : userInfo.jobNumber
    })
  },


  onReady: function() {
    let userInfo = app.globalData.userInfo;
    let that = this;
    this.mapCtx = wx.createMapContext('myMap')
    if (userInfo.userClass == 0) {
      //报警用户,只需要加载地图
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          that.mapCtx.moveToLocation({
            longitude: Number(res.longitude),
            latitude: Number(res.latitude),
            success() {}
          })
        }
      })
    } else if (userInfo.userClass == 1) {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          that.mapCtx.moveToLocation({
            longitude: Number(res.longitude),
            latitude: Number(res.latitude),
            success() {}
          })
        }
      })
      //消防用户,判断是否注册
      if (userInfo.firemenName != "" && userInfo.jobNumber != 0) {
        //注册了的
        this.setData({
          isfiremanReg: true
        })
      } else if (userInfo.firemenName == null || userInfo.jobNumber == null) {
        //未注册
        this.setData({
          isfiremanReg: false
        })
      } else {
        //错误
        console.log("OnReady- userInfo", userInfo)

      }

    } else if (userInfo.userClass == 2) {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          that.mapCtx.moveToLocation({
            longitude: Number(res.longitude),
            latitude: Number(res.latitude),
            success() {}
          })
        }
      })
      //高级用户

      Util.getCodeLogin((res) => {
        let thisCode = {
          code: res.code,
        }
        console.log("post :wechat-user/getNewFireInfo", thisCode)
        request.post("wechat-user/getNewFireInfo", thisCode).then(res => {
          console.log(res)
          if (res.status == 0) {
            Util.Tips({
              title: res.msg
            });
          } else {
            that.setData({
              isfiremanReg: true
            })
          }
        }).catch(res => {
          console.log("err" + res)
          Util.Tips({
            title: res.msg
          });
        })
      })

    } else {
      //未知用户类型
      Util.Tips({
        title: "未知类型用户！"
      })
      return
    }
  },


  //报警用户选择地点
  reloadBtnClick: function() {
    this.data.fireTime = new Date().getTime();
    //震动
    wx.vibrateShort()
    let that = this;
    wx.chooseLocation({
      success(res) {
        let long_temp = Number(res.longitude).toFixed(7),
          lat_temp = Number(res.latitude).toFixed(7);
        let marker_temp = [{
          id: 1,
          latitude: lat_temp,
          longitude: long_temp,
          name: res.name
        }]
        that.setData({
          locationName: res.name + '(' + res.address + ')',
          addrName: res.name + '(' + res.address + ')',
          locationLongitude: long_temp,
          locationLatitude: lat_temp,
          markers: marker_temp
        })
      }
    })
  },


  //一键报警
  alarmBtnClick: function() {
    let that = this;
    if (this.data.accidentLevel == '' || this.data.accidentLevel == null) {
      Util.Tips({
        title: '请选择险情等级！'
      });
    } else if (this.data.addrName == '' || this.data.addrName == null) {
      Util.Tips({
        title: '请获取报警地址！'
      });
    } else {

      if (this.data.accidentLevel == 1) {
        wx.showModal({
          title: '注意',
          content: '一级为重大伤亡事故，请确认您的选择！',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.startAlarm()
            } else if (res.cancel) {
              console.log('用户点击取消')
              return
            }
          }
        })
      } else {
        this.startAlarm()
      }
    }
  },

  startAlarm() {
    let that = this
    console.log('开始报警')
    //loading圈圈
    that.setData({
      alarmLoading: true
    })
    console.log("that.data.imgList", that.data.imgList)
    if (that.data.imgList.length != 0) {
      Util.upLoadImgALL(that.data.imgList, that.data.indexId).then(res => {
        let imgStr = null;
        for (let i = 0; i < res.length; i++) {
          imgStr = imgStr ? imgStr + JSON.parse(res[i].data).data + ',' : JSON.parse(res[i].data).data + ','
        }
        imgStr = imgStr.substring(0, imgStr.length - 1)
        console.log("imgstr", imgStr)
        let fireInfo = {
          fireTime: that.data.fireTime,
          witnessPhone: that.data.witnessPhone,
          accidentLevel: that.data.accidentLevel,
          info: that.data.info,
          locationLongitude: that.data.locationLongitude,
          locationLatitude: that.data.locationLatitude,
          image: imgStr
        }
        console.log("post : wechat-user/sendFireInfo", fireInfo)
        request.post("wechat-user/sendFireInfo", fireInfo).then(res => {
          console.log("res" + res.msg)
          Util.Tips({
            title: res.msg
          })
          that.setData({
            alarmLoading: false,
          })

        }).catch(err => {
          console.log("err" + err)
          that.setData({
            alarmLoading: false
          })
        })
      }).catch(err => {
        console.log("err", err)
        Util.Tips({
          title: "上传图片失败！"
        })
        that.setData({
          alarmLoading: false
        })
        return
      })
    } else {
      let fireInfo = {
        fireTime: that.data.fireTime,
        witnessPhone: that.data.witnessPhone,
        accidentLevel: that.data.accidentLevel,
        info: that.data.info,
        locationLongitude: that.data.locationLongitude,
        locationLatitude: that.data.locationLatitude,
        image: ""
      }
      console.log("post : wechat-user/sendFireInfo", fireInfo)
      request.post("wechat-user/sendFireInfo", fireInfo).then(res => {
        console.log("res" + res.msg)
        Util.Tips({
          title: res.msg
        })
        that.setData({
          alarmLoading: false,
        })

      }).catch(err => {
        console.log("err" + err)
        that.setData({
          alarmLoading: false
        })
      })
    }
  },

  //消防员首次绑定
  submitInforBtnClick: function(e) {
    let userInfo = app.globalData.userInfo
    let that = this
    if (userInfo != null && (userInfo.firemenName == "" || userInfo.jobNumber == 0)) {
      that.setData({
        alarmLoading: true
      })
      Util.getCodeLogin((res) => {
        let firemen = {
          userId: res.code,
          jobNumber: Number(this.data.jobNumber),
          firemenName: this.data.firemenName,
          firemenState: this.data.firemenState
        }
        console.log("post : wechat-user/saveFiremenInfo", firemen)
        request.post("wechat-user/saveFiremenInfo", firemen).then(res => {
          that.setData({
            alarmLoading: false
          })
          console.log(res)
          if (res.status == 0) {
            Util.Tips({
              title: res.msg
            });
            that.setData({
              isfiremanReg: false,
            })
          } else {
            that.setData({
              isfiremanReg: true
            })
          }
        }).catch(res => {
          that.setData({
            alarmLoading: false
          })
          console.log("err" + res)
          Util.Tips({
            title: res.msg
          });
          that.setData({
            isfiremanReg: false,
          })
        })
      })
    }
  },

  //导航
  guideBtnClick: function() {
    wx.vibrateShort()
    let that = this;

    if (this.data.locationLatitude == '' || this.data.locationLongitude == '') {
      //请求灾情信息
      Util.Tips({
        title: "请获取灾情地址！"
      })
    } else {
      wx.openLocation({
        latitude: Number(that.data.locationLatitude),
        longitude: Number(that.data.locationLongitude)
      })
    }
  },

  //改变工作状态
  changeWorkState: function(e) {
    let firemenState_lastTime = this.data.firemenState
    let that = this
    this.setData({
      firemenState: e.detail.value
    })
    let changeState = {
      firemenState: Number(this.data.firemenState),
      jobNumber: Number(this.data.jobNumber)
    }
    wx.showLoading({
      title: '提交中'
    });
    console.log("post : wechat-user/firemenState", changeState)
    request.post("wechat-user/firemenState", changeState).then(res => {

      if (res.status == 0) {
        console.log("更改状态失败:", res)
        Util.Tips({
          title: res.msg
        })
        //选择回滚
        that.setData({
          firemenState: firemenState_lastTime
        })
      } else if (res.status == 1) {
        console.log("更改成功!", res)
      } else {
        //不明错误，选择回滚
        that.setData({
          firemenState: firemenState_lastTime
        })
      }
      wx.hideLoading()
    }).catch(err => {
      console.log("更改状态失败", err)
      wx.hideLoading()
      Util.Tips({
        title: "系统错误！"
      })
    })
  },
  //获取我的工作
  getFireInfor: function() {
    let that = this
    //loading圈圈
    wx.showLoading({
      title: '获取中',
    })
    Util.getCodeLogin((res) => {
      let thisCode = {
        code: res.code,
      }
      console.log("post :wechat-user/getNewFireInfo", thisCode)
      request.post("wechat-user/getNewFireInfo", thisCode).then(res => {
        wx.hideLoading();
        console.log(res)
        if (res.status == 0) {
          Util.Tips({
            title: res.msg
          });
        } else if (res.status == 1) {
          if (res.status == 1) {
            let marker_temp = [{
              id: 1,
              latitude: res.data.locationLatitude,
              longitude: res.data.locationLongitude,
              name: res.data.locationName
            }]
            var strs = new Array(); //定义一数组
            if (res.data.image != "") {
              strs = res.data.image.split(","); //字符分割
              for (let i = 0; i < strs.length; i++) {
                strs[i] = Config.IMAGE_API_URL + strs[i]
              }
            }
            that.setData({
              accidentLevel: res.data.accidentLevel,
              locationName: res.data.locationName,
              locationLatitude: res.data.locationLatitude,
              locationLongitude: res.data.locationLongitude,
              markers: marker_temp,
              info: res.data.info,
              firemanHasWork: true,
              accImgList: strs,
              fireIndexID: res.data.indexId,
              // fireInfoRES: res,
              textColor: that.data.colorTable[res.data.accidentLevel - 1]
            })
            console.log(that.data.accImgList)
          } else {
            Util.Tips({
              title: res.msg
            });
          }



        }
      }).catch(res => {
        wx.hideLoading();
        console.log("err" + res)
        Util.Tips({
          title: res.msg
        });
      })
    })

  },

  //选择消防车
  selectCar: function() {
    let that = this
    let status = this.data.firemenState
    if (status == 2) {
      Util.Tips({
        title: "you are on mission!"
      });
    } else if (status == 0) {
      Util.Tips({
        title: "you are on vocation!"
      });
    } else if (status == 1) {
      //获取消防车list
      wx.showLoading({
        title: '获取中'
      });
      request.get("wechat-user/showAllFireCar").then(res => {
        wx.hideLoading()
        if (res.status == 1) {
          console.log("获取到的车：", res.data)
          that.setData({
            carNumberList: res.data
          })
        } else {
          Util.Tips({
            title: res.msg
          })
        }
      }).catch(err => {
        console.log("获取消防车list错误", err)
      })
      this.setData({
        showBottomModal: true
      })
    } else {
      Util.Tips({
        title: "unknown err!"
      });
    }

  },

  carNumberHide: function() {
    this.setData({
      // plateNumber: this.data.plateNumber_lastTime,
      showBottomModal: false
    })
  },

  //提交选择的消防车
  carNumberConfirm: function() {
    let that = this
    if (this.data.plateNumber == '选择') {
      Util.Tips({
        title: "请选择一辆车!"
      })
      return
    }
    this.setData({
      showBottomModal: false
    })
    let carInfo = {
      jobNumber: this.data.jobNumber,
      plateNumber: this.data.plateNumber
    }
    // this.sendLocationStart()//测试用，后续删除！！！
    console.log("post : wechat-user/selectFireCar", carInfo)
    request.post("wechat-user/selectFireCar", carInfo).then(res => {
      if (res.status == 1) {
        Util.Tips({
          title: "成功上车!"
        })
        if (res.data == 1) {
          console.log("开始上传位置信息")
          this.sendLocationStart()
        } else if (res.data == 0) {
          console.log("无需上传位置")
        }

      } else if (res.status == 0) {
        Util.Tips({
          title: "上车失败!"
        })
      } else {
        Util.Tips({
          title: res.msg.toString()
        })
      }

    }).catch(err => {
      console.log("提交错误，", err)
    })
  },

  sendLocationStart() {
    let that = this
    app.globalData.sendLocTimer = setInterval(function() {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          let currentLocation = {
            locationLongitude: Number(res.longitude.toFixed(7)),
            locationLatitude: Number(res.latitude.toFixed(7)),
            carNumber: that.data.plateNumber,
            indexId: that.data.fireIndexID
          }
          console.log("post : wechat-user/reciveLocation", currentLocation)
          request.post("wechat-user/reciveLocation", currentLocation).then(res => {
            console.log("更新位置返回信息:", res)
            if (res.status == 0) {
              clearInterval(app.globalData.sendLocTimer)
              console.log(res)
              Util.Tips({
                title: res.msg
              })
              return
            }

            if (res.data == 1) {
              console.log("上传成功", res)
            } else if (res.data == 0) {
              console.log("上传成功", res)
              clearInterval(app.globalData.sendLocTimer)
            } else {
              console.log("上传位置失败", res)
            }
          }).catch(err => {
            console.log("上传位置错误，", err)
          })
        }
      })
    }, app.globalData.time)
  },

  carNumberChange(e) {
    console.log("carNumberChange", e)
    if (e.detail.value) {
      this.setData({
        selectIndex: e.detail.value,
        plateNumber: this.data.carNumberList[e.detail.value].plateNumber
      })
    }
  },

  // 进入rtcroom页面
  launchGroupBtnClick: function() {

    var self = this;
    // 防止两次点击操作间隔太快
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }

    let liveVideoCode = {
      userName: this.data.firemenName,
      roomNumber: Number(this.data.jobNumber),
      userNumber: Number(this.data.jobNumber)
    }
    console.log("post : wechat-user/openMeetingRoom", liveVideoCode)
    request.post("wechat-user/openMeetingRoom", liveVideoCode).then(res => {
      let userSig = res.userSig
      console.log("userSig:", res)
      var url = `../webrtc-room/room/room?roomID=${self.data.jobNumber}&template=float&sdkAppID=${Config.SDKAPPID_config}&userId=${liveVideoCode.userNumber}&userSig=${userSig}&userName=${liveVideoCode.userName}`;

      wx.navigateTo({
        url: url
      });

      wx.showToast({
        title: '进入房间',
        icon: 'success',
        duration: 1000
      })
    }).catch(err => {
      console.log("获取userSig失败", err)
    })

  },

  pickerChange: function(e) {
    this.setData({
      index: e.detail.value,
      accidentLevel: Number(e.detail.value) + 1,
      textColor: this.data.colorTable[Number(e.detail.value)]
    })
    /*
    console.log(e)
    let that = this;
    switch (e.detail.value) {
      case "0":
        {
          wx.showModal({
            title: '一级事故',
            content: '特别严重，造成道路双向交通中断6小时以上并造成车辆滞留，10人（含10人）以上死亡或50人（含50人）以上重伤',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.setData({
                  index: e.detail.value,
                  accidentLevel: Number(e.detail.value) + 1,
                  textColor: that.data.colorTable[Number(e.detail.value)]
                })

              } else if (res.cancel) {
                console.log('用户点击取消')
                return
              }
            }
          })
          break
        }
      case "1":
        {
          wx.showModal({
            title: '二级事故',
            content: '严重，造成道路双向交通中断并造成车辆滞留，3人（含3人）以上死亡或10人（含10人）以上重伤',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.setData({
                  index: e.detail.value,
                  accidentLevel: Number(e.detail.value) + 1,
                  textColor: that.data.colorTable[Number(e.detail.value)]
                })

              } else if (res.cancel) {
                console.log('用户点击取消')
                return
              }
            }
          })
          break
        }
      case "2":
        {
          wx.showModal({
            title: '三级事故',
            content: '较重，造成道路双向交通中断并造成车辆滞留或单个收费站50%以上车道工作瘫痪，1人（含1人）以上死亡或5人（含5人）以上重伤',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.setData({
                  index: e.detail.value,
                  accidentLevel: Number(e.detail.value) + 1,
                  textColor: that.data.colorTable[Number(e.detail.value)]
                })

              } else if (res.cancel) {
                console.log('用户点击取消')
                return
              }
            }
          })
          break
        }
      case "3":
        {
          wx.showModal({
            title: '四级事故',
            content: '一般，突发事件对道路交通造成一定影响，无人员伤亡',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.setData({
                  index: e.detail.value,
                  accidentLevel: Number(e.detail.value) + 1,
                  textColor: that.data.colorTable[Number(e.detail.value)]
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                return
              }
            }
          })
        }
        break
    }
    */
  },

  alarmInforInput: function(e) {
    this.setData({
      alarmInforInputLength: e.detail.cursor,
      info: e.detail.value
    })
  },

  addGroupBtnClick: () => {
    console.log(1)
    wx.navigateTo({
      url: '/pages/roomlist/roomlist',
    })
  },

  otherInforBtnClick: () => {
    wx.navigateTo({
      url: '/pages/contact/contact',
    })
  },

  Btn110Click: function() {
    wx.makePhoneCall({
      phoneNumber: '110'
    })

  },

  Btn119Click: function() {
    wx.makePhoneCall({
      phoneNumber: '119'
    })
  },

  firemanNameInput: function(e) {
    this.setData({
      firemenName: e.detail.value
    })
  },

  firemanNumInput: function(e) {
    this.setData({
      jobNumber: e.detail.value
    })
  },

  showIllustrateModal: function(e) {
    this.setData({
      alarmTextTop:10000,
      illustrateModal: true,
      modalTitle: '险情等级说明',
      modalContext: "1级事故：特别严重，造成道路双向交通中断6小时以上并造成车辆滞留，10人（含10人）以上死亡或50人（含50人）以上重伤\n\n2级事故：严重，造成道路双向交通中断并造成车辆滞留，3人（含3人）以上死亡或10人（含10人）以上重伤\n\n3级事故：较重，造成道路双向交通中断并造成车辆滞留或单个收费站50%以上车道工作瘫痪，1人（含1人）以上死亡或5人（含5人）以上重伤\n\n4级事故：一般，突发事件对道路交通造成一定影响，无人员伤亡\n"

    })
  },

  hideIllustrateModal: function(e) {
    this.setData({
      illustrateModal: false,
      alarmTextTop:0
    })
  },
  //高级用户日期组件相关
  getMessage: function() {
    console.log('send msg')
    wx.requestSubscribeMessage({
      tmplIds: ['VXOQVXQFCYX7pIuD2W7yT8KIYgQMdBTqZ6nqpQ7lMdk'],
      success(res) {
        console.log(res)
      }
    })
  },
  startDateChange(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  endDateChange(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  getformerData: function() {
    console.log(1)
    if (this.data.startDate == undefined || this.data.endDate == undefined)
      return Util.Tips({
        title: '起止时间格式错误'
      })
    var that = this;
    var stratDateTime = new Date(that.data.startDate).getTime();
    var endDateTime = new Date(that.data.endDate).getTime();
    console.log('starttime', stratDateTime)
    console.log('endtime', endDateTime)
    wx.navigateTo({
      url: '../formerData/formerData?start=' + stratDateTime + '&end=' + endDateTime,
    })
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  DelImg(e) {
    wx.showModal({
      title: '删除',
      content: '确定要删除该图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  ChooseImage() {
    let that = this
    wx.chooseImage({
      count: 3, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
        console.log("imgList", this.data.imgList)
        // Util.upLoadImgs(this.data.imgList, this.data.indexId)

      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  ViewAccImage(e) {
    wx.previewImage({
      urls: this.data.accImgList,
      current: e.currentTarget.dataset.url
    });
  },
  firemanUpLoadImg() {
    let that = this
    wx.showLoading({
      title: '图片上传中',
    })
    Util.upLoadImgALL(this.data.imgList, this.data.indexId).then(res => {
      wx.hideLoading()
      console.log("上传图片成功", res)
      Util.Tips({
        title: "上传图片成功!"
      })
      for (let i = 0; i < res.length; i++) {
        let newIMG = Config.IMAGE_API_URL + JSON.parse(res[i].data).data
        that.data.accImgList = that.data.accImgList.concat(newIMG)
      }
      // let newIMG = Config.IMAGE_API_URL + JSON.parse(res.data).data
      let imgListADD = that.data.accImgList
      that.setData({
        accImgList: imgListADD,
        imgList: []
      })
    }).catch(err => {
      wx.hideLoading()
      console.log("上传图片系统错误", err)
    })
  },

  confirmFireInfo: function(e) {
    // let res = this.data.fireInfoRES;
    let res = this
    let that = this
    wx.showModal({
      title: '确认事故地点',
      content: res.data.locationName + '\n\r' + "经度:" + res.data.locationLongitude + " 纬度: " + res.data.locationLatitude + '\n\r' + "事故等级: " + that.data.accidentLevel + "级",
      success(r) {
        if (r.confirm) {
          console.log('用户点击确定')

          let confirmInfo = {
            locationLongitude: res.data.locationLongitude,
            locationLatitude: res.data.locationLatitude,
            indexId: res.data.fireIndexID,
            accidentLevel: that.data.accidentLevel
          }
          console.log("post :wechat-user/updateLocation", confirmInfo)
          request.post("wechat-user/updateLocation", confirmInfo).then(res => {
            Util.Tips({
              title: res.msg
            });
          }).catch(err => {
            Util.Tips({
              title: err
            });
          })
        } else if (r.cancel) {
          console.log('用户点击取消')
          return
        }
      }
    })
  }
})