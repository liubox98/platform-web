import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'el-icon-house' }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/commit',
    hidden: true,
    children: [{
      path: 'commit',
      name: 'Commit',
      component: () => import('@/views/commit/index'),
      meta: { title: 'commit', icon: 'dashboard' }
    }]
  }
]
export const asyncRoutes = [
  {
    path: '/function',
    component: Layout,
    redirect: '/function',
    name: 'testCase',
    meta: { title: '测试用例', icon: 'el-icon-edit-outline' },
    children: [
      {
        path: 'task',
        name: 'task',
        component: () => import('@/views/function/task/index'),
        meta: { title: '任务管理', icon: 'form', roles: ['admin', 'qa'] }
      },
      {
        path: 'caseList',
        name: 'caseList',
        component: () => import('@/views/function/case/index'),
        meta: { title: '执行用例', icon: 'el-icon-s-promotion', roles: ['admin', 'qa'] }
      },
      {
        path: 'question',
        name: 'question',
        component: () => import('@/views/function/question/index'),
        meta: { title: '问题用例', icon: 'el-icon-info', roles: ['admin', 'qa'] }
      },
      {
        path: 'operation',
        name: 'operation',
        component: () => import('@/views/function/operation/index'),
        meta: { title: '用例总览', icon: 'el-icon-document', roles: ['admin', 'qa'] }
      },

      {
        path: 'assign/:id(\\d+)',
        name: 'assign',
        component: () => import('@/views/function/assign/index'),
        meta: { title: '分配用例', roles: ['admin', 'qa'] },
        hidden: true
      },
      {
        path: 'taskDetails/:id(\\d+)',
        name: 'taskDetails',
        component: () => import('@/views/function/details/index'),
        meta: { title: '任务详情', roles: ['admin', 'qa'] },
        hidden: true
      }
    ]
  },
  {
    path: '/automation',
    component: Layout,
    redirect: '/automation',
    name: 'automationTest',
    meta: { title: '自动化测试', icon: 'el-icon-monitor' },
    children: [
      {
        path: 'template',
        name: 'template',
        component: () => import('@/views/automation/template/index'),
        meta: { title: '模块管理', icon: 'el-icon-menu', roles: ['admin', 'qa'] }
      },
      {
        path: 'module',
        name: 'module',
        component: () => import('@/views/automation/module/index'),
        meta: { title: '管理任务', icon: 'el-icon-discover', roles: ['admin', 'qa'] }
      },
      {
        path: 'script',
        name: 'script',
        component: () => import('@/views/automation/script/index'),
        meta: { title: '执行脚本', icon: 'el-icon-setting', roles: ['admin', 'qa'] }
      },
      {
        path: 'overview',
        name: 'overview',
        component: () => import('@/views/automation/overview/index'),
        meta: { title: '执行总览', icon: 'el-icon-files', roles: ['admin', 'qa'] }
      },
      {
        path: 'assign/:id(\\d+)',
        name: 'assign',
        component: () => import('@/views/automation/assign/index'),
        meta: { title: '任务分配', roles: ['admin', 'qa'] },
        hidden: true
      },
      {
        path: 'details/:id(\\d+)',
        name: 'details',
        component: () => import('@/views/automation/details/index'),
        meta: { title: '详情页面', roles: ['admin', 'qa'] },
        hidden: true
      }
    ]
  },
  {
    path: '/performance',
    component: Layout,
    redirect: '/performance/index',
    meta: { title: '性能测试', icon: 'el-icon-cpu', roles: ['admin', 'qa'] },
    children: [
      {
        path: 'index',
        name: 'performance',
        component: () => import('@/views/special/performance/index'),
        meta: { title: '性能测试', icon: 'el-icon-cpu', roles: ['admin', 'qa'] }
      }
    ]
  },
  {
    path: '/leveldiff',
    component: Layout,
    redirect: '/leveldiff/index',
    meta: { title: '关卡Diff', icon: 'el-icon-copy-document', roles: ['admin', 'qa'] },
    children: [
      {
        path: 'index',
        name: 'leveldiff',
        component: () => import('@/views/special/leveldiff/index'),
        meta: { title: '关卡Diff', icon: 'el-icon-copy-document', roles: ['admin', 'qa'] }
      }
    ]
  },
  {
    path: '/users',
    component: Layout,
    redirect: '/users',
    name: '我的',
    meta: { title: '我的', icon: 'el-icon-user', roles: ['admin', 'qa'] },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/user/index'),
        meta: { title: '人员管理', icon: 'tree', roles: ['admin'] }
      },
      {
        path: 'update',
        name: 'update',
        component: () => import('@/views/password/index'),
        meta: { title: '修改密码', icon: 'el-icon-s-opportunity', roles: ['admin', 'qa'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
