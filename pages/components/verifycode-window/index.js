// pages/components/verifycode-window/index.js
import Util from '../../../utils/util.js';
import { VERIFY_CODE } from '../../../config.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    verifycode: {
      type: Object,
      value: {
        verifycode: true
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    inputValue:null
  },
  attached: function () {
    console.log(this.data.verifycode)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    closeWindow:function(){
      this.triggerEvent('closeWindow');
    },
    bindKeyInput:function(e){
      let code = e.detail.value
      if(code.length !== 4)
        return;
      if(code == VERIFY_CODE){
        Util.Tips({title:'校验成功'})
        this.setData({
          inputValue:null
        })
        this.triggerEvent('changeStatus',{status:1});
        this.triggerEvent('closeWindow');
      }
      else{
        Util.Tips({ title: '校验失败' })
        this.triggerEvent('changeStatus', { status: 2 });
        this.triggerEvent('closeWindow');
      }
    }
  }
})
