// 横的柱状图

let myColor = ['#8042ff','#06ffb6','#adf500','#fff118','#ffbf05','#ec8b00','#ec3800','#00b4ff','#4e8aff','#4eaaff','#ff4ed7'];
export default {
  backgroundColor: "#f4f9fd",
  title: {
    // text: '订单消耗',
    text: '',
    textStyle: {
      fontWeight: 'normal',
      fontSize: 16
    }
  },
  noDataLoadingOption: {
    text: '暂无数据',
    effect: 'bubble',
    effectOption: {
      effect: {
        n: 0
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: []
    // data: ['订单消耗']
  },
  grid: {
    left: 0,
    right: 30,
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01],
    axisLine: {
      lineStyle: {
        color: '#90979c'
      }
    },
  },
  yAxis: {
    type: 'category',
    // data: ['DID', '强显', '卡线', '95资源', '400资源','回拨','显号','国际白线','隐号资源','语音通知','语音验证码'],
    data: [],
    axisLine: {
      lineStyle: {
        color: '#90979c'
      }
    },
  },
  series: [
    {
      name: '',
      // name: '累计',
      type: 'bar',
      barWidth : 20,
      itemStyle: {
        normal: {
          // barBorderRadius: 4,
          // callback,设定每一bar颜色,配置项color顶axis一组bars颜色
          color: function(params) {
            var num=myColor.length;
            return myColor[params.dataIndex%num]
          },
          label: {
            show: true,
            position: "right",
            formatter: function (p) {
              return p.value > 0 ? (p.value) : '';
            }
          }
        }
      },
      // data: [18203, 23489, 29034, 104970, 131744, 130230,630230,830230,30230,430230,30230]
      data: []
    }
  ]
}
