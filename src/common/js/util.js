/**
 *
 * [ucpaas-app]
 * @Author   Jace 钟强
 * @Email    jxqg@qq.com
 * @DateTiem 2017/11/20 下午6:57
 *
 */
//
// export const isWx = function isWx() {
//   var bool = false;
//   var us = window.navigator.userAgent.toLowerCase();
//   if (us.match(/MicroMessenger/i) == 'micromessenger') { //判断是否是微信
//     bool = true;
//   } else {
//     bool = false;
//   }
//   return bool
// }
//
//
// export  const isCardNumb = function (sId) {
//   var aCity = {
//     11: "北京",
//     12: "天津",
//     13: "河北",
//     14: "山西",
//     15: "内蒙古",
//     21: "辽宁",
//     22: "吉林",
//     23: "黑龙江",
//     31: "上海",
//     32: "江苏",
//     33: "浙江",
//     34: "安徽",
//     35: "福建",
//     36: "江西",
//     37: "山东",
//     41: "河南",
//     42: "湖北",
//     43: "湖南",
//     44: "广东",
//     45: "广西",
//     46: "海南",
//     50: "重庆",
//     51: "四川",
//     52: "贵州",
//     53: "云南",
//     54: "西藏",
//     61: "陕西",
//     62: "甘肃",
//     63: "青海",
//     64: "宁夏",
//     65: "新疆",
//     71: "台湾",
//     81: "香港",
//     82: "澳门",
//     91: "国外"
//   };
//   var boo = true;
//   var iSum = 0;
//   if (!/^\d{17}(\d|x)$/i.test(sId)) return false;
//   sId = sId.replace(/x$/i, "a");
//   if (aCity[parseInt(sId.substr(0, 2))] == null) {
//     boo = false;
//   }
//   var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
//   var d = new Date(sBirthday.replace(/-/g, "/"));
//   if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
//     boo = false;
//   }
//   for (var i = 17; i >= 0; i--) {
//     iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
//   }
//   if (iSum % 11 != 1) {
//     boo = false;
//   }
//   return boo;
// }

//判断手机号
export const isPhone = function (phone) {
  // var pattern = /(^1[3|4|5|7|8]\d{9}$)|(^0\d{2,3}\d{8}$)/;
  let pattern = /^((13[0-9])|(145)|(147)|(15[0-3])|(15[5-9])|(17[0-9])|(18[0-9])|(199))\d{8}$/;

  var isright = pattern.test(phone);
  return isright;
}

//密码验证 长度大于6小于16，必须是数字加字母
export const checkPassWord = function (pwd) {
  let str = pwd;
  if (str == null || str.length < 6 || str.length > 16) {
    return false;
  }
  let reg1 = /^[0-9A-Za-z]+$/;

  if (!reg1.test(str)) {
    return false;
  }else{
    return true
  }
}

//字符串长度2~10
export const strLen = function (str) {
  let bool = false;

  if (str.length >= 2 && str.length <= 10) {
    bool = true
  }
  return bool
}

//区号
export const isAreCode = function (str) {
  return /^010$|^02[0-5]$|^02[7-9]$|^0[3-9]\d{2}$/.test(str);
}

export const isPhoneSection = function (str) {
  return /^\d{7}$/.test(str);
}

export const isNumb = function (num) {
  return /^[0-9]*$/.test(num)
}


//当前日期
export const currDate = function () {
  let today = new Date();
  var todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  return todayDate;
}

//获取任何一个天数 0 为当前日期; AddDayCount为正数时,为往后日期; 为负数时,为往前日期;
export const getDateStr = function (AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
  var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
  var dataStr = y + "-" + m + "-" + d;
  return dataStr;
}

//ip 地址校验
export const isValidIP = function (ip) {
  // var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  var reg = /^(?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9]))$/
  return reg.test(ip);
}
//检查邮箱
export const isEmail = function (num) {
  var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  return reg.test(num)
}
//检查是否为固话
export const isMobile = function (num) {
  var reg = /[0-9-()（）]{7,18}/
  return reg.test(num)
}

// 计算两个时间的时间差，精度为天
export const datedifference = function (end, start) {    //end和start是2006-12-18格式
  var dateSpan,
    tempDate,
    iDays;
  end = Date.parse(end);
  start = Date.parse(start);
  dateSpan = end - start;
  // dateSpan = Math.abs(dateSpan);
  iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
  return iDays;
}

//正整数
export const isInt = function (num) {
  let reg = /^[1-9]\d*$/;
  return reg.test(num);
}
//密码校验，具体规则：
//必须包含字母、数字、符号中至少2种，字母区分大小写
export const passwordRule = function (str) {
  let reg = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/;
  return reg.test(str);
}

//用英文; 分割的电话号码
export const numbers = function (str) {
  let reg = /^[;0-9]+$/;
  return reg.test(str);
}

//中文、英文、数字包括下划线_和中划线-
export const isName = function (str) {
  let reg = /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/;
  return reg.test(str);
}

export const settlementInput = function (str) {
  if ((/^[0-9]*$/.test(str)) && (str.length < 5) && str.length != 0) {
    return false;
  }
  return true;
}

export const pageOpt = [30, 50, 100];

export const pageSize = 30;

export const isMoneyLen = function (num) {
  let reg = /^[1-9]{1}\d*(.\d{1,6})?$|^0.\d{1,6}$/;
  return reg.test(num)
}

export const isSunday = function (dayStr) {
  var dateStr = dayStr.slice(0, 10);
  var myDate = new Date(Date.parse(dateStr.replace(/-/g, "/")));
  if (myDate.getDay() != 0) {
    return false;
  }

  return true;
}

export const afterSevenDay = function (dayStr) {
  var date1 = new Date(dayStr);
  var date2 = new Date(date1);
  date2.setDate(date1.getDate() + 7);
  var times = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
  return times;
}

export const isLowerToday = function (dayStr) {
  var today = new Date();
  var myToday = new Date(dayStr);
  if (today > myToday) {
    return true;
  } else {
    return false;
  }
}

export const diffDays = function (startDate, endDate) {
  var aDate, oDate1, oDate2, iDays
  aDate = startDate.split("-")
  oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2002格式
  aDate = endDate.split("-")
  oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数
  return iDays
}
