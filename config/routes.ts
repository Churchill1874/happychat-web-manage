// 目标路径: config/routes.ts
// 完整文件，可直接整份覆盖替换你项目里的 config/routes.ts
// （只在 /news 模块后面新增了一个 /telegram 顶级菜单块，其余一字未改）

import path from "node:path";

/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './user/login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'register-result',
        icon: 'smile',
        path: '/user/register-result',
        component: './user/register-result',
      },
      {
        name: 'register',
        icon: 'smile',
        path: '/user/register',
        component: './user/register',
      },
      {
        component: '404',
        path: '/user/*',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    routes: [
      {
        path: '/dashboard',
        redirect: '/dashboard/analysis',
      },
      {
        name: 'analysis',
        icon: 'smile',
        path: '/dashboard/analysis',
        component: './dashboard/analysis',
      },
    ],
  },
  {
    path: '/loginfo',
    icon: 'fileSearchOutlined',
    name: 'loginfo',
    routes: [
      {
        path: '/loginfo',
        redirect: '/loginfo/list',
      },
      {
        name: 'list',
        icon: 'fileSearchOutlined',
        path: '/loginfo/list',
        component: './loginfo/list',
      },
    ],
  },
  {
    path: '/member',
    icon: 'userOutlined',
    name: 'member',
    routes: [
      {
        path: '/member',
        redirect: '/member/list',
      },
      {
        name: 'info',
        icon: 'userOutlined',
        path: '/member/list',
        component: './member/list'
      },
      {
        path: '/member/add',// ✅ 新增页
        component: './member/add'
      },
      {
        path: '/member/detail/:id',//详情页
        component: './member/detail',
        hideInMenu: true,
      },
    ]
  },
  {
    path: '/news',
    icon: 'globalOutlined',
    name: 'news',
    routes: [
      {
        path: '/news',
        redirect: '/news/southeast-asia/list',
      },
      {
        name: 'southeast-asia',
        icon: 'globalOutlined',
        path: '/news/southeast-asia/list',
        component: './news/southeast-asia/list'
      },
      {
        path: '/news/southeast-asia/add',// ✅ 新增页
        component: './news/southeast-asia/add'
      },
      {
        path: '/news/southeast-asia/detail/:id',//详情页
        component: './news/southeast-asia/detail',
        hideInMenu: true,
      },

      //话题
      {
        name: 'topic',
        icon: 'notificationOutlined',
        path: '/news/topic/list',
        component: './news/topic/list'
      },
      {
        path: '/news/topic/add',// ✅ 新增页
        component: './news/topic/add'
      },
      {
        path: '/news/topic/detail/:id',//详情页
        component: './news/topic/detail',
        hideInMenu: true,
      },

      //曝光
      {
        name: 'exposure',
        icon: 'notificationOutlined',
        path: '/news/exposure/list',
        component: './news/exposure/list'
      },
      {
        path: '/news/exposure/add',// ✅ 新增页
        component: './news/exposure/add'
      },
      {
        path: '/news/exposure/detail/:id',//详情页
        component: './news/exposure/detail',
        hideInMenu: true,
      },


      //社会
      {
        name: 'society',
        icon: 'notificationOutlined',
        path: '/news/society/list',
        component: './news/society/list'
      },
      {
        path: '/news/society/add',// ✅ 新增页
        component: './news/society/add'
      },
      {
        path: '/news/society/detail/:id',//详情页
        component: './news/society/detail',
        hideInMenu: true,
      },

      //政治
      {
        name: 'politics',
        icon: 'notificationOutlined',
        path: '/news/politics/list',
        component: './news/politics/list'
      },
      {
        path: '/news/politics/add',// ✅ 新增页
        component: './news/politics/add'
      },
      {
        path: '/news/politics/detail/:id',//详情页
        component: './news/politics/detail',
        hideInMenu: true,
      },
      //国内新闻
      {
        name: 'china-mainland',
        icon: 'notificationOutlined',
        path: '/news/news/list',
        component: './news/news/list'
      },
      {
        path: '/news/news/add',// ✅ 新增页
        component: './news/news/add'
      },
      {
        path: '/news/news/detail/:id',//详情页
        component: './news/news/detail',
        hideInMenu: true,
      },
      //公司新闻
      {
        name: 'company',
        icon: 'notificationOutlined',
        path: '/news/company/list',
        component: './news/company/list'
      },
      {
        path: '/news/company/add',// ✅ 新增页
        component: './news/company/add'
      },
      {
        path: '/news/company/detail/:id',//详情页
        component: './news/company/detail',
        hideInMenu: true,
      },

    ]
  },

  // 电报频道/群组管理（新增模块）
  {
    path: '/telegram',
    icon: 'sendOutlined',
    name: 'telegram',
    routes: [
      {
        path: '/telegram',
        redirect: '/telegram/list',
      },
      {
        name: 'list',
        icon: 'sendOutlined',
        path: '/telegram/list',
        component: './telegram/list'
      },
      {
        path: '/telegram/add',// ✅ 新增页
        component: './telegram/add'
      },
    ]
  },

  {
    path: '/comment',
    icon: 'messageOutlined',
    name: 'comment',
    routes: [
      {
        path: '/comment',
        redirect: '/comment/list',
      },
      {
        name: 'info',
        icon: 'messageOutlined',
        path: '/comment/list',
        component: './comment/list'
      },
    ]
  },

  {
    path: '/views',
    icon: 'eyeOutlined',
    name: 'views',
    routes: [
      {
        path: '/views',
        redirect: '/views/list',
      },
      {
        name: 'info',
        icon: 'eyeOutlined',
        path: '/views/list',
        component: './viewsrecord/list',
      },
    ]
  },
  {
    path: '/likes',
    icon: 'likeOutlined',
    name: 'likes',
    routes: [
      {
        path: '/likes',
        redirect: '/likes/list',
      },
      {
        name: 'info',
        icon: 'likeOutlined',
        path: '/likes/list',
        component: './likesrecord/list',
      },
    ]
  },
  {
    path: '/privatechat',
    icon: 'commentOutlined',
    name: 'privatechat',
    routes: [
      {
        path: '/privatechat',
        redirect: '/privatechat/list',
      },
      {
        name: 'info',
        icon: 'commentOutlined',
        path: '/privatechat/list',
        component: './privatechat/list',
      },
    ]
  },
  {
    path: '/system-message',
    icon: 'notificationOutlined',
    name: 'system-message',
    routes: [
      {
        path: '/system-message',
        redirect: '/system-message/list',
      },
      {
        name: 'info',
        icon: 'notificationOutlined',
        path: '/system-message/list',
        component: './system-message/list',
      },
      {
        path: '/system-message/add',
        component: './system-message/add',
      },
      {
        path: '/system-message/delete',
        component: './system-message/delete',
      },
    ]
  },

  {
    path: '/blacklist',
    icon: 'blockOutlined',
    name: 'blacklist',
    routes: [
      {
        path: '/blacklist',
        redirect: '/blacklist/list',
      },
      {
        name: 'record',
        icon: 'blockOutlined',
        path: '/blacklist/list',
        component: './blacklist/list',
      },
      {
        path: '/blacklist/add',
        component: './blacklist/add'
      },
    ]
  },
  {
    path: '/',
    redirect: '/dashboard/analysis',
  },
  {
    component: '404',
    path: '/*',
  },
];
