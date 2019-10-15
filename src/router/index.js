import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {Message} from 'element-ui'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/base/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index/'), hidden: true},
  {path: '/404', component: () => import('@/views/404/'), hidden: true},

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index/'),
        meta: {title: '首页', icon: 'home'}
      }
    ]
  },

  {
    path: '/client',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'client',
        component: () => import('@/views/client/index/'),
        meta: {title: '客户管理', icon: 'user'}
      }
    ]
  },

  {
    path: '/number',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'number',
        component: () => import('@/views/number/index/'),
        meta: {title: '号码管理', icon: 'phone'}
      }
    ]
  },

  {
    path: '/ring',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'ring',
        component: () => import('@/views/ring/index/'),
        meta: {title: '铃音管理', icon: 'customer-service'}
      }
    ]
  },

  {
    path: '/rate',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'rate',
        component: () => import('@/views/rate/index/'),
        meta: {title: '费率管理', icon: 'yuan'}
      }
    ]
  },

  {
    path: '/finance',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'finance',
        component: () => import('@/views/finance/index/'),
        meta: {title: '财务管理', icon: 'account-book'}
      }
    ]
  },

  {
    path: '/report',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'report',
        component: () => import('@/views/report/index/'),
        meta: {title: '报表管理', icon: 'yuan'}
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    name: 'system',
    meta: {title: '系统管理', icon: 'setting'},
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/system/user/'),
        meta: {title: '用户管理', icon: 'setting'}
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/system/user/'),
        meta: {title: '角色管理', icon: 'setting'}
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/system/user/'),
        meta: {title: '菜单管理', icon: 'setting'}
      },
      {
        path: 'service_type',
        name: 'service_type',
        component: () => import('@/views/system/service_type/'),
        meta: {title: '类型管理', icon: 'setting'}
      },
    ]
  },

  {path: '*', redirect: '/404', hidden: true}
]

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

NProgress.configure({showSpinner: false})// NProgress configuration

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.state.login.token) {
    if (to.path === '/login') {
      next({path: '/'})
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

export default router
