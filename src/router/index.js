import Vue from 'vue'
import Router from 'vue-router'
import stores from '../store'
import Main from 'components/Main'
import Login from 'components/login/login'

Vue.use(Router)

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
