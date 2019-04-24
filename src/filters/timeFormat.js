export const normalTime = (time) => {
  if (time) {
    var oDate = new Date();
    oDate.setTime(time);

    var y = oDate.getFullYear();
    var m = oDate.getMonth() + 1;
    var d = oDate.getDate();

    var h = oDate.getHours();
    var m = oDate.getMinutes();
    var s = oDate.getSeconds();

    return y + '-' + m + '-' + d + ' ' + h + ':' + m + ':' + s;
  }
}

export const formatMoney = (value) => {
  return Number(value).toFixed(2)
}

export const timeStr = (time) => {
  return time.substring(0, 10)
}



