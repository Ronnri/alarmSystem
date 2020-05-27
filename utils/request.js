import util from './util.js';
import { HEADER } from './../config.js';
/**
 * 发送请求
 */
export default function request(api, method, data, { noAuth = false, noVerify = false }) {
  //console.log('request' + api)
  let Url = getApp().globalData.url, header = HEADER;

  // if (!noAuth) {
  //   //登录过期自动登录
  //   if (!util.checkLogin()) return authLogin().then(res => { return request(api, method, data, { noAuth, noVerify }); });
  // }
  if (getApp().globalData.token) 
  header['Authori-zation'] = 'Bearer ' + getApp().globalData.token;
    //  console.log("data",data)
  return new Promise((reslove, reject) => {

    wx.request({
      url: Url  + api,
      method: method || 'GET',
      header: header,
      data: data || {},
      success: (res) => {
        //if (noVerify) //false
        //  reslove(res.data, res);
         if (res.statusCode == 200)
          reslove(res.data, res);
        else if (('' + res.data.status).includes(40000)) {
          //util.logout()
          //util.checkLogin()
        } else {
          console.log(res)
          reject(res.data.msg || '系统错误');
        }
      },
      fail: (msg) => {
        //console.log(msg)
        reject('请求失败');
      }
    })
  });
}

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
  request[method] = (api, data, opt) => request(api, method, data, opt || {})
});

