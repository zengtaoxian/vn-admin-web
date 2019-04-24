// 折线图
export default {
  backgroundColor: "#f4f9fd",
  title: {
    text: '',
    textStyle: {
      fontWeight: 'normal',
      fontSize: 16
    }
  },
  color: ['#00b4ff', '#ff4c4c'],
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    // data: ['邮件营销', '联盟广告']
    data:[]
  },
  grid: {
    left: 10,
    right: 30,
    bottom: 50,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    "axisLine": {
      lineStyle: {
        color: '#90979c'
      }
    },
    // axisLabel: {
    //   interval: 0,
    //   rotate: 0,
    //   show: true,
    //   splitNumber: 15,
    //   textStyle: {
    //     fontFamily: "微软雅黑",
    //     fontSize: 12
    //   }
    // },
  },
  yAxis: {
    type: 'value',
    show:false
  },
  series: [
    {
      name: '',
      // name: '邮件营销',
      type: 'line',
      // data: [120, 132, 101, 134, 90, 230, 210]
      data: []
    },
    {
      name: '',
      // name: '联盟广告',
      type: 'line',
      // data: [220, 182, 191, 234, 290, 330, 310]
      data: []
    }
  ]
}

