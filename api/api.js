import request from "./../utils/request.js";

export function login(data) {
  return request.post("wechat-user/login",data);
}
export function getVerificationCode(data) {
  return request.post("wechat-user/getVerificationCode", data);
}
export function register(data) {
  return request.post("wechat-user/register", data);
}
export function queryAllMeetingRoom(data) {
  return request.get("wechat-user/queryAllMeetingRoom", data);
}
export function locationinfo(data) {
  return request.get("locationinfo", data);
}

export function alarminfo(data){
  return request.post("alarminfo",data)
}

export function firemaninfo(data){
  return request.get("firemaninfo",data)
}

export function getHistoryData(data){
  return request.post("wechat-user/getHistoryData",data)

}



