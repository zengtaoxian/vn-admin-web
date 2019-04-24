//圆环图
// export default {
//   title: {
//     text: '最近3个月销售额TOP10',
//     x: 'left',
//     left: 20,
//     top: 20,
//     show: true,
//     textStyle: {
//       fontWeight: 'normal',
//       fontSize: 20
//     }
//   },
//   color:['#8042ff','#06ffb6','#adf500','#fff118','#ffbf05','#ec8b00','#ec3800','#00b4ff','#4e8aff','#4eaaff','#ff4ed7'],
//   tooltip: {
//     trigger: 'item',
//     formatter: '{a} <br/>{b} : {c} ({d}%)'
//   },
//   legend: {
//     orient: 'vertical',
//     left: 'right',
//     data: ['DID', '强显', '卡线', '95资源', '400资源','回拨','显号','国际白线','隐号资源','语音通知','语音验证码'],
//     show: true
//   },
//   series: [
//     {
//       name: '最近3个月销售额TOP10',
//       type: 'pie',
//       radius: ['50%', '70%'],
//       avoidLabelOverlap: false,
//       label: {
//         normal: {
//           show: false,
//           position: 'center'
//         },
//         emphasis: {
//           show: true,
//           textStyle: {
//             fontSize: '16',
//             fontWeight: 'bold'
//           }
//         }
//       },
//       labelLine: {
//         normal: {
//           show: false
//         }
//       },
//       data: [
//         {value: 335, name: 'DID'},
//         {value: 310, name: '强显'},
//         {value: 234, name: '卡线'},
//         {value: 135, name: '95资源'},
//         {value: 1548, name: '400资源'},
//         {value: 1548, name: '回拨'},
//         {value: 1548, name: '显号'},
//         {value: 1548, name: '国际白线'},
//         {value: 1548, name: '隐号资源'},
//         {value: 1548, name: '语音通知'},
//         {value: 1548, name: '语音验证码'}
//       ]
//     }
//   ]
// }

export default {
  backgroundColor: '#fff',
  title: {
    text: '',
    textAlign: 'center',
    subtext: '',
    x: 150,
    y: 130,
    textStyle: {
      fontWeight: 'normal',
      fontSize: 20
    }
  },
  tooltip: {
    show: true,
    trigger: 'item',
    formatter: "{b}: {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    right: 200,
    textStyle:{
      color:'#7b7b7b'
    },
    // data: ['DID', '强显', '卡线', '95资源', '400资源','回拨','显号','国际白线','隐号资源','语音通知','语音验证码'],
    data:[]
  },
  series: [{
    type: 'pie',
    radius: ['30%', '50%'],
    center:['25%','40%'],
    label:{
      normal: {
        show: false,
        position: 'inside', //标签的位置
        formatter: "{d}%",
        textStyle: {
          color: '#fff',
        }
      },
    },
    color:['#8042ff','#06ffb6','#adf500','#fff118','#ffbf05','#ec8b00','#ec3800','#00b4ff','#4e8aff','#4eaaff','#ff4ed7'],
    data: [
        // {value: 335, name: 'DID'},
    ]
  }]
}


