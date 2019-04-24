// // 折线图柱状图混合模式
// // export default {
// //   title: {
// //     text: '订单统计',
// //     x: 'left',
// //     left: 20,
// //     show: true,
// //     textStyle: {
// //       fontWeight: 'normal',
// //       fontSize: 16
// //     },
// //   },
// //   color:['#00b4ff','#20bcc3', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
// //   tooltip: {
// //     trigger: 'axis',
// //     axisPointer: {
// //       type: 'cross',
// //       crossStyle: {
// //         color: '#999'
// //       }
// //     }
// //   },
// //
// //   legend: {
// //     data: ['新增订单', '进行中订单']
// //   },
// //   xAxis: [
// //     {
// //       type: 'category',
// //       data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
// //       axisPointer: {
// //         type: 'shadow'
// //       }
// //     }
// //   ],
// //   yAxis: [
// //     {
// //       type: 'value',
// //       min: 0,
// //       interval: 50,
// //       axisLabel: {
// //         formatter: '{value}'
// //       }
// //     },
// //     {
// //       type: 'value',
// //       min: 0,
// //       interval: 50,
// //       axisLabel: {
// //         formatter: '{value}'
// //       }
// //     }
// //   ],
// //   series: [
// //     {
// //       name: '新增订单',
// //       type: 'bar',
// //       data: [2.0, 40.9, 7.0, 23.2, 25.6, 76.7, 135.6, 362.2, 302.6, 250.0, 6.4, 3.3]
// //     },
// //     {
// //       name: '进行中订单',
// //       type: 'line',
// //       yAxisIndex: 1,
// //       // itemStyle:{
// //       //   normal : {
// //       //     lineStyle:{
// //       //       color:"#0066cc"
// //       //     }
// //       //   }
// //       // },
// //       data: [223.0, 4.9, 7.0, 123.2, 25.6, 76.7, 135.6, 162.2, 32.6, 200.0, 6.4, 3.3]
// //     }
// //   ]
// // }
//
// export default {
//   backgroundColor: "#f4f9fd",
//   title: {
//     text: "本年商场顾客男女人数统计",
//     x: "4%",
//     textStyle: {
//       color: '#fff',
//       fontSize: '22'
//     },
//   },
//   tooltip: {
//     trigger: "axis",
//     axisPointer: {
//       type: "shadow",
//       textStyle: {
//         color: "#fff"
//       }
//
//     },
//   },
//   grid: {
//     borderWidth: 0,
//     top: 120,
//     bottom: 50,
//     left:0,
//     right:0,
//     textStyle: {
//       color: "#fff"
//     }
//   },
//   legend: {
//     x: '4%',
//     top: '11%',
//     textStyle: {
//       color: '#90979c',
//     },
//     data: ['男']
//   },
//   xAxis: [{
//     axisLine: {
//       lineStyle: {
//         color: '#90979c'
//       }
//     },
//     boundaryGap:['1%','1%'],
//     splitArea: {
//       show: false
//     },
//     data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
//   }],
//   yAxis: [{
//     show:false,
//     type: "value",
//     splitLine: {
//       "show": false
//     },
//     axisLine: {
//       lineStyle: {
//         color: '#90979c'
//       }
//     }
//   }],
//   series: [
//
//     {
//       name: "男",
//       type: "bar",
//       stack: "总量",
//       itemStyle: {
//         normal: {
//           color: "#00b4ff",
//           barBorderRadius: 0,
//           label: {
//             show: true,
//             position: "top",
//             formatter: function (p) {
//               return p.value > 0 ? (p.value) : '';
//             }
//           }
//         }
//       },
//       data: [
//         327,
//         1776,
//         507,
//         1200,
//         800,
//         482,
//         204,
//         1390,
//         1001,
//         951,
//         381,
//         220
//       ]
//     }, {
//       name: "总数",
//       type: "line",
//       stack: "总量",
//       symbolSize: 10,
//       symbol: 'circle',
//       itemStyle: {
//         normal: {
//           color: "#16b9c0",
//           barBorderRadius: 0,
//           label: {
//             show: true,
//             position: "top",
//             formatter: function (p) {
//               return p.value > 0 ? (p.value) : '';
//             }
//           }
//         }
//       },
//       data: [
//         1036,
//         3693,
//         2962,
//         3810,
//         2519,
//         1915,
//         1748,
//         4675,
//         6209,
//         4323,
//         2865,
//         4298
//       ]
//     },
//   ]
// }
//

// var category = ["2018-1-6", "2018-1-7", "2018-1-8", "2018-1-9", "2018-1-10", "2018-1-11", "2018-1-12", "2018-1-13", "2018-1-14", "2018-1-15"];
// var dottedBase = +new Date();
// var lineData = [291, 108, 71, 318, 242, 247, 310, 362, 239, 138];
// var barData = [199, 63, 46, 186, 177, 119, 197, 177, 189, 27];

var category = ["2018-1-6", "2018-1-7", "2018-1-8", "2018-1-9", "2018-1-10", "2018-1-11", "2018-1-12", "2018-1-13", "2018-1-14", "2018-1-15", "2018-1-16", "2018-1-17"];
var dottedBase = +new Date();
var lineData = [274, 233, 275, 193, 273, 258, 256, 127, 385, 296, 221, 237];
var barData = [98, 65, 147, 93, 87, 186, 129, 38, 197, 119, 123, 82];

// for (var i = 0; i < 12; i++) {
//   var date = new Date(dottedBase += 1000 * 3600 * 24);
//   category.push([
//     date.getFullYear(),
//     date.getMonth() + 1,
//     date.getDate()
//   ].join('-'));
//   var b = parseInt(Math.random() * 200);
//   var d = parseInt(Math.random() * 200);
//   barData.push(b)
//   lineData.push(d + b);
// }

export default {
  title: {
    text: '',
    textStyle: {
      fontWeight: 'normal',
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      label: {
        show: true,
        backgroundColor: '#333'
      }
    }
  },
  legend: {
    // data: ['line', 'bar'],
    data: [],
    textStyle: {
      color: '#90979c'
    }
  },
    grid: {
    top: 60,
    bottom: 50,
    left:20,
    right:20,
  },
  xAxis: {
    data: [],
    axisLine: {
      lineStyle: {
        color: '#90979c'
      }
    },
    axisLabel: {
      interval: 0,
      rotate: 30,
      show: true,
      splitNumber: 15,
      textStyle: {
        fontFamily: "微软雅黑",
        fontSize: 12
      }
    },
  },
  yAxis: {
    show:false,
    splitLine: {show: false},
    axisLine: {
      lineStyle: {
        color: '#506470'
      }
    }
  },
  series: [{
    name: 'line',
    type: 'line',
    smooth: true,
    showAllSymbol: true,
    symbol: 'emptyCircle',
    symbolSize: 15,
    itemStyle: {
      normal: {
        barBorderRadius: 5,
        color: '#16b9c0',
        label: {
            show: true,
            position: "top",
            formatter: function (p) {
              return p.value > 0 ? (p.value) : '';
            }
          }
      }
    },
    data: []
  }, {
    name: 'bar',
    type: 'bar',
    barWidth: 20,
    itemStyle: {
      normal: {
        barBorderRadius: 5,
        color: '#00b4ff',
        label: {
            show: true,
            position: "top",
            formatter: function (p) {
              return p.value > 0 ? (p.value) : '';
            }
          }
      }
    },
//    itemStyle: {
//         normal: {
//           color: "#00b4ff",
//           barBorderRadius: 0,
//           label: {
//             show: true,
//             position: "top",
//             formatter: function (p) {
//               return p.value > 0 ? (p.value) : '';
//             }
//           }
//         }
    data: []
  }]
}
