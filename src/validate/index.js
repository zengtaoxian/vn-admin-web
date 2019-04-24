import Vue from 'vue'
import zh_CN from 'vee-validate/dist/locale/zh_CN'
import VeeValidate, {Validator} from 'vee-validate'
import dictionary from './dictionary'

Validator.addLocale(zh_CN);
Vue.use(VeeValidate, {
  locale: 'zh_CN',
})

// 修改系统自带的消息提示
Validator.updateDictionary(dictionary);

// 自定义验证用户名，可以是手机号或者是邮箱
Validator.extend('userName', {
  messages: {
    zh_CN: field => '请输入正确的手机号或邮箱',
  },
  validate: value => {
    return (value.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)) || /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(value)
  }
});


Validator.extend('passwordVal', {
  messages: {
    zh_CN: field => '密码必须大于8位小于16位',
  },
  validate: value => {
    return value.length >= 8 && value.length < 16
  }
});

// 身份证号的验证
Validator.extend('cardNumb', {
  messages: {
    zh_CN: field => '身份证号码错误',
  },
  validate: value => {

    const fn = function (sId) {
      var aCity = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
      };
      var boo = true;
      var iSum = 0;
      if (!/^\d{17}(\d|x)$/i.test(sId)) return false;
      sId = sId.replace(/x$/i, "a");
      if (aCity[parseInt(sId.substr(0, 2))] == null) {
        boo = false;
      }
      var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
      var d = new Date(sBirthday.replace(/-/g, "/"));
      if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
        boo = false;
      }
      for (var i = 17; i >= 0; i--) {
        iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
      }
      if (iSum % 11 != 1) {
        boo = false;
      }
      return boo;
    }

    return fn(value)
  }
});


export default VeeValidate
