//饼图参数配置
export default {
  title: {
    text: '最近3个月销售额TOP10',
    x: 'left',
    left: 20,
    top: 20,
    show: true,
    textStyle: {
      fontWeight: 'normal',
      fontSize: 16
    },
    subtext: '注：不包含本月',
  },
  color:['#8042ff','#06ffb6','#adf500','#fff118','#ffbf05','#ec8b00','#ec3800','#00b4ff','#4e8aff','#4eaaff','#ff4ed7'],
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    // data: ['1', '2', '3', '4', '5','6', '7', '8', '9', '10'],
    data: [],
    show: false
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [
        // {value: 335, name: '1'}
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}


