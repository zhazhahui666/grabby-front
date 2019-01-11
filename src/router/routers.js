import Main from '@/view/main'
import parentView from '@/components/parent-view'

export default [{
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: 'index',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
    },
    children: [{
      path: '/home',
      name: 'home',
      meta: {
        hideInMenu: true,
        notCache: true
      },
      component: () => import('@/view/single-page/home')
    }]
  },

  {
    path: '/sys-manage',
    name: 'sys-manage',
    component: Main,
    meta: {
      icon: '_qq',
      title: '系统管理'
    },
    children: [{
        path: 'user-manage',
        name: 'user-manage',
        meta: {
          icon: '_qq',
          title: '用户管理'
        },
        component: () => import('@/view/user-manage/user-manage.vue')
      },
      {
        path: 'permission-manage',
        name: 'permission-manage',
        meta: {
          icon: '_qq',
          title: '权限管理'
        },
        component: () => import('@/view/permission-manage/permission-manage.vue')
      },
      {
        path: 'role-manage',
        name: 'role-manage',
        meta: {
          icon: '_qq',
          title: '角色管理'
        },
        component: () => import('@/view/role-manage/role-manage.vue')
      },
      {
        path: 'department-manage',
        name: 'department-manage',
        meta: {
          icon: '_qq',
          title: '组织管理'
        },
        component: () => import('@/view/department-manage/department-manage.vue')
      }
    ]

  },
  {
    path: '/activiti',
    name: 'activiti',
    meta: {
      icon: '_qq',
      title: '工作流'
    },
    component: Main,
    children: [{
        path: 'process-list',
        name: 'process-list',
        meta: {
          icon: '_qq',
          title: '新建流程'
        },
        component: () => import('@/view/activiti/process-list.vue')
      },
      {
        path: 'todo-list',
        name: 'todo-list',
        meta: {
          icon: '_qq',
          title: '待办任务'
        },
        component: () => import('@/view/activiti/todo-list.vue')
      },
      {
        path: 'done-list',
        name: 'done-list',
        meta: {
          icon: '_qq',
          title: '已办任务'
        },
        component: () => import('@/view/activiti/done-list.vue')
      },
      {
        path: 'apply-list',
        name: 'apply-list',
        meta: {
          icon: '_qq',
          title: '我的申请'
        },
        component: () => import('@/view/activiti/apply-list.vue')
      },
      {
        path: 'process-manage',
        name: 'process-manage',
        meta: {
          icon: '_qq',
          title: '流程管理'
        },
        component: () => import('@/view/activiti/process-manage.vue')
      },
      {
        path: 'model-manage',
        name: 'model-manage',
        meta: {
          icon: '_qq',
          title: '模型管理(弃用)'
        },
        component: () => import('@/view/activiti/model-manage.vue')
      }
    ]
  },


  {
    path: '/study',
    name: 'study',
    meta: {
      icon: '_qq',
      title: 'study'
    },
    component: Main,
    children: [{
        path: 'vue',
        name: 'vue',
        meta: {
          icon: '_qq',
          title: '学习和测试'
        },
        component: () => import('@/view/study.vue')
      },
      {
        path: 'tree',
        name: 'tree',
        meta: {
          icon: '_qq',
          title: '树学习'
        },
        component: () => import('@/view/tree-study.vue')
      }
    ]
  },

  

  {
    path: '/user',
    name: 'user',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [{
      path: 'user-detail',
      name: 'user-detail',
      meta: {
        icon: '_qq',
        title: '个人中心'
      },
      component: () => import('@/view/user-manage/user-detail.vue')
    }]
  },

  {
    path: '/401',
    name: 'error_401',
    meta: {
      icon: '_qq',
      title: '401页面'
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      icon: '_qq',
      title: '500页面'
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      icon: '_qq',
      title: '404页面'
    },
    component: () => import('@/view/error-page/404.vue')
  }
]