import Vue from 'vue'
import Router from 'vue-router'
import stores from '../store'
import * as types from '../store/types'
// import cookies from '../utils/cookies'


Vue.use(Router)
// Vue.use(cookies)


import Hello from 'components/hello'
import Word from 'components/word'
import Main from 'components/Main'
import Login from 'components/login/login'


const routes = [
  {
    path: '/login',
    icon: 'ios-paper',
    title: 'Login',
    name: 'login',
    meta: {
      title: '登录',
    },
    component: Login
  },
  {
    path: '/',
    icon: 'ios-paper',
    name: 'home',
    component: Main,
    redirect: '/index',
    meta: {
      title: '首页',
      requiresAuth: true
    },
    children: [
      {
        path: 'index',
        name: 'home',
        meta: {
          title: '首页',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/home/home.vue'], resolve);
        }
      },
      {
        path: 'word',
        name: 'word',
        meta: {
          title: 'word',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/word.vue'], resolve);
        }
      },
      {
        path: 'hello',
        name: 'hello',
        meta: {
          title: 'hello',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/hello.vue'], resolve);
        }
      },
      {
        path: 'news',
        name: 'news',
        meta: {
          title: '消息中心',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/home/news.vue'], resolve);
        }
      },
      {
        path: 'setUser',
        name: 'setUser',
        meta: {
          title: '账号信息修改',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/home/setUser.vue'], resolve);
        }
      }

    ]
  },
  {
    path: '/commodity',
    icon: 'commodity_icon',
    title: '商品管理',
    name: 'commodity',
    component: Main,
    redirect: '/commodity/commodityList',
    meta: {requiresAuth: true},
    children: [
      {
        path: 'commodityList',
        name: 'commodityList',
        meta: {
          title: '商品列表',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/commodity/commodityList.vue'], resolve);
        },
      },
      {
        path: 'numberList',
        name: 'numberList',
        meta: {
          title: '号码商品列表',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/commodity/numberList.vue'], resolve);
        },
      },
      {
        path: 'salesList',
        name: 'salesList',
        meta: {
          title: '销售包列表',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/commodity/salesList.vue'], resolve);
        },
        children: [{
          path: 'addPrice',
          name: 'addPrice',
          meta: {
            title: '新增价格包',
            requiresAuth: true
          },
          component: resolve => {
            require(['@/components/hello.vue'], resolve);
          }
        }]
      },
      {
        path: 'ListedList',
        name: 'ListedList',
        meta: {
          title: '成本包列表',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/commodity/ListedList.vue'], resolve);
        }
      },
      {
        path: 'costList',
        name: 'costList',
        meta: {
          title: '挂牌包列表',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/commodity/costList.vue'], resolve);
        }
      },
      {
        path: 'billing',

        name: 'billing',
        meta: {
          title: '计费周期配置',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/commodity/billing.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/supplier',
    icon: 'supplier_icon',
    name: 'supplier',
    component: Main,
    meta: {
      title: '供应商管理',
      requiresAuth: true
    },
    redirect: '/supplier/index',
    children: [
      {
        path: 'index',
        name: 'supplier',
        component: resolve => {
          require(['@/components/supplier/supplier.vue'], resolve);
        },
        meta: {
          title: '供应商列表',
          requiresAuth: true
        },
      },
      {
        path: 'deplete',
        name: 'deplete',
        component: resolve => {
          require(['@/components/supplier/supplierDeplete.vue'], resolve);
        },
        meta: {
          title: '供应商数据分析',
          requiresAuth: true
        },
      }
    ]
  },
  {
    path: '/client',
    icon: 'client_icon',
    name: 'client',
    component: Main,
    meta: {
      title: '客户管理',
      requiresAuth: true
    },
    redirect: '/client/index',
    children: [
      {
        path: 'index',

        name: 'index',
        component: resolve => {
          require(['@/components/client/client.vue'], resolve);
        },
        meta: {
          title: '客户管理',
          requiresAuth: true
        },
      },
      {
        path: 'analysis',
        name: 'analysis',
        meta: {
          title: '客户数据分析',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/client/analysis.vue'], resolve);
        }
      }

    ]
  },
  {
    path: '/merchandise',
    icon: 'merchandise_icon',
    name: 'merchandise',
    component: Main,
    meta: {
      title: '交易管理',
      requiresAuth: true
    },
    children: [{
      path: 'index',
      name: 'merchandise',
      meta: {
        title: '交易管理',
        requiresAuth: true
      },
      component: resolve => {
        require(['@/components/merchandise/merchandise.vue'], resolve);
      }
    }]
  },
  {
    path: '/settlement',
    icon: 'settlement_icon',
    name: 'settlement',
    component: Main,
    meta: {
      title: '结算中心',
      requiresAuth: true
    },
    children: [{
      path: 'businessTab',
      name: 'businessTab',
      meta: {
        title: '财务报表',
        requiresAuth: true
      },
      component: resolve => {
        require(['@/components/settlement/businessTab.vue'], resolve);
      }
    }, {
      path: 'sales',
      name: 'sales',
      meta: {
        title: '销售VP报表',
        requiresAuth: true
      },
      component: resolve => {
        require(['@/components/settlement/sales.vue'], resolve);
      }
    }, {
      path: 'commerce',
      name: 'commerce',
      meta: {
        title: '商务报表',
        requiresAuth: true
      },
      component: resolve => {
        require(['@/components/settlement/commerce.vue'], resolve);
      }
    },
      {
        path: 'commerceVP',
        name: 'commerceVP',
        meta: {
          title: '商务VP报表',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/settlement/commerceVP.vue'], resolve);
        }
      }, {
        path: 'cust',
        name: 'cust',
        meta: {
          title: '客户报表',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/settlement/cust.vue'], resolve);
        }
      }, {
        path: 'businessTabDetail',
        name: 'businessTabDetail',
        meta: {
          title: '财务详单',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/settlement/businessTabDetail.vue'], resolve);
        }
      }, {
        path: 'custDetail',
        name: 'custDetail',
        meta: {
          title: '客户报表详单',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/settlement/custDetail.vue'], resolve);
        }
      }, {
        path: 'salesDetail',
        name: 'salesDetail',
        meta: {
          requiresAuth: true,
          title: '销售VP报表详单',
        },
        component: resolve => {
          require(['@/components/settlement/salesDetail.vue'], resolve);
        }
      }, {
        path: 'commerceDetail',
        name: 'commerceDetail',
        meta: {
          title: '商务报表详单',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/settlement/commerceDetail.vue'], resolve);
        }
      },
      {
        path: 'commerceVPDetail',
        name: 'commerceVPDetail',
        meta: {
          title: '商务VP报表详单',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/settlement/commerceVPDetail.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/system',
    icon: 'system_icon',
    name: 'system',
    component: Main,
    meta: {
      title: '系统管理',
      requiresAuth: true
    },
    children: [
      {
        path: 'user',
        icon: 'user_icon',
        name: 'user',
        meta: {
          title: '用户管理',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/systemmanager/user.vue'], resolve);
        }
      },
      {
        path: 'role',
        icon: 'role_icon',
        name: 'role',
        meta: {
          title: '角色管理',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/systemmanager/role.vue'], resolve);
        }
      },
      {
        path: 'log',
        icon: 'log_icon',
        name: 'log',
        title: '系统日志',
        meta: {
          title: '系统日志',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/systemmanager/syslog.vue'], resolve);
        }
      },
      {
        path: 'number',
        icon: 'number_icon',
        name: 'number',
        title: '号段管理',
        meta: {
          title: '号段管理',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/systemmanager/number.vue'], resolve);
        }
      },
      {
        path: 'gateway',
        icon: 'gateway_icon',
        name: 'gateway',
        title: '网关地址管理',
        meta: {
          requiresAuth: true,
          title: '网关地址管理'
        },
        component: resolve => {
          require(['@/components/systemmanager/gateway.vue'], resolve);
        }
      },
      {
        path: 'international',
        icon: 'gateway_icon',
        name: 'international',
        title: '国际费率表',
        meta: {
          requiresAuth: true,
          title: '国际费率表'
        },
        component: resolve => {
          require(['@/components/systemmanager/international.vue'], resolve);
        }
      },
      {
        path: 'numbRules',
        icon: 'gateway_icon',
        name: 'numbRules',
        title: '编号规则',
        meta: {
          requiresAuth: true,
          title: '编号规则'
        },
        component: resolve => {
          require(['@/components/systemmanager/numbRules.vue'], resolve);
        }
      },
      {
        path: 'taskDispatch',
        icon: 'gateway_icon',
        name: 'taskDispatch',
        meta: {
          requiresAuth: true,
          title: '定时任务调度'
        },
        component: resolve => {
          require(['@/components/systemmanager/taskDispatch.vue'], resolve);
        }
      },
      {
        path: 'batchTask',
        icon: 'gateway_icon',
        name: 'batchTask',
        title: '批量任务信息',
        meta: {
          requiresAuth: true,
          title: '批量任务信息'
        },
        component: resolve => {
          require(['@/components/systemmanager/batchTask.vue'], resolve);
        }
      },
      {
        path: 'taskRunInfo',
        icon: 'gateway_icon',
        name: 'taskRunInfo',
        title: '任务运行信息',
        meta: {
          requiresAuth: true,
          title: '任务运行日志'
        },
        component: resolve => {
          require(['@/components/systemmanager/taskRunInfo.vue'], resolve);
        }
      },
      {
        path: 'taskRunlog',
        icon: 'gateway_icon',
        name: 'taskRunlog',
        meta: {
          requiresAuth: true,
          title: '任务运行日志'
        },
        component: resolve => {
          require(['@/components/systemmanager/taskRunlog.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/resources',
    icon: 'resources_icon',
    name: 'resources',
    component: Main,
    meta: {
      title: '资源管理',
      requiresAuth: true
    },
    children: [
      {
        path: 'number',
        icon: 'number_icon',
        name: 'number',
        title: '号段管理',
        meta: {
          title: '号段管理',
          requiresAuth: true
        },
        component: resolve => {
          require(['@/components/systemmanager/number.vue'], resolve);
        }
      },
      {
        path: 'gateway',
        icon: 'gateway_icon',
        name: 'gateway',
        title: '网关地址管理',
        meta: {
          requiresAuth: true,
          title: '网关地址管理'
        },
        component: resolve => {
          require(['@/components/systemmanager/gateway.vue'], resolve);
        }
      },
      {
        path: 'international',
        icon: 'gateway_icon',
        name: 'international',
        title: '国际费率表',
        meta: {
          requiresAuth: true,
          title: '国际费率表'
        },
        component: resolve => {
          require(['@/components/systemmanager/international.vue'], resolve);
        }
      },
      {
        path: 'numbRules',
        icon: 'gateway_icon',
        name: 'numbRules',
        title: '编号规则',
        meta: {
          requiresAuth: true,
          title: '编号规则'
        },
        component: resolve => {
          require(['@/components/systemmanager/numbRules.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/task',
    icon: 'task_icon',
    name: 'task',
    component: Main,
    meta: {
      title: '任务管理',
      requiresAuth: true
    },
    children: [
      {
        path: 'taskDispatch',
        icon: 'gateway_icon',
        name: 'taskDispatch',
        meta: {
          requiresAuth: true,
          title: '定时任务调度'
        },
        component: resolve => {
          require(['@/components/systemmanager/taskDispatch.vue'], resolve);
        }
      },
      {
        path: 'batchTask',
        icon: 'gateway_icon',
        name: 'batchTask',
        title: '批量任务信息',
        meta: {
          requiresAuth: true,
          title: '批量任务信息'
        },
        component: resolve => {
          require(['@/components/systemmanager/batchTask.vue'], resolve);
        }
      },
      {
        path: 'taskRunInfo',
        icon: 'gateway_icon',
        name: 'taskRunInfo',
        title: '任务运行信息',
        meta: {
          requiresAuth: true,
          title: '任务运行日志'
        },
        component: resolve => {
          require(['@/components/systemmanager/taskRunInfo.vue'], resolve);
        }
      },
      {
        path: 'taskRunlog',
        icon: 'gateway_icon',
        name: 'taskRunlog',
        meta: {
          requiresAuth: true,
          title: '任务运行日志'
        },
        component: resolve => {
          require(['@/components/systemmanager/taskRunlog.vue'], resolve);
        }
      }
    ]
  },
  {path: '*', redirect: '/index'}
]


if (localStorage.getItem('TOKEN')) {
  stores.dispatch('login/load', localStorage.getItem('TOKEN'));
}

const router = new Router({
  // mode: 'history',
  routes,
  scrollBehavior() {
    return {x: 0, y: 0}
  }
});


router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requiresAuth)) {
    // console.log(stores.state.perm.token)
    if (stores.state.login.token) {
      next();
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next();
  }
  stores.dispatch('main/header_title', to.meta.title);
  document.title = to.meta.title;

})

export default router
