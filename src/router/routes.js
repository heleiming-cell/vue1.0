/**
 * 路由表    title 必须  cpath 对应组件的位置
 */
// name: r.title,
// path:{name:r.name,title:r.title,path:r.path,component:r.cpath}

export default [

  {
    path: '/login',
    name: 'login',
    title: '登录',
  },
  {
    path: '/',
    name: '首页',
    component: () =>
      import('@/Views/Main.vue'),
    title: '根路径',
    children: [{
      path: 'homepage',
      title: '首页1',
      cpath: '@/Views/home',
      name: 'homepage',
    },
    {
      path: 'home2',
      title: '首页2',
      cpath: '@/Views/home/src/main2',
      name: 'home2',

    },
    {
      path: 'home3',
      title: '首页3',
      cpath: '@/Views/home/src/main3',
      name: 'home3',
    },
    {
      path: 'gis',
      title: 'gis通用界面',
      cpath: '@/Views/gis/src/gis',
      name: 'gis',
    },
    {
      path: 'bim',
      title: 'BIM通用界面',
      cpath: '@/Views/bim/src/main',
      name: 'bim',
    },
    {
      path: 'empty',
      title: '404',
      cpath: '@/Views/empty',
      name: 'empty',
    },
    {
      path: 'alarmStatistics',
      title: '报警统计',
      cpath: '@/Views/alarm/alarmStatistics',
      name: 'alarmStatistics',

    },
    {
      path: 'alarmHistory',
      title: '报警历史记录',
      cpath: '@/Views/alarm/alarmHistory',
      name: 'alarmHistory',
    },

    {
      path: 'deviceManager',
      title: '设备管理',
      cpath: '@/Views/deviceManager/deviceManager',
      name: 'deviceManager'

    },
    {
      path: 'device',
      title: '设备台账',
      cpath: '@/Views/deviceManager/device',
      name: 'device'
    },
 
    {
      path: 'overview',
      title: '工单总览',
      cpath: '@/Views/workorder/overview',
      name: 'overview',
    },
    {
      path: 'underway',
      title: '工单进行中',
      cpath: '@/Views/workorder/underway',
      name: 'underway',
     
    },
    {
      path: 'hangUp',
      title: '工单挂起',
      cpath: '@/Views/workorder/hangUp',
      name: 'hangUp',
    },
    {
      path: 'close',
      title: '工单关闭',
      cpath: '@/Views/workorder/close',
      name: 'close',
    },
    {
      path: 'accomplish',
      title: '工单完成',
      cpath: '@/Views/workorder/accomplish',
      name: 'accomplish',
    },
    {
      path: 'newOrder',
      title: '新建工单',
      cpath: '@/Views/workorder/newOrder',
      name: 'newOrder',
    },
    {
      path: 'orderDetail',
      title: '工单详情',
      cpath: '@/Views/workorder/orderDetail',
      name: 'orderDetail',
    },
    {
      path: 'projectManagement',
      title: '项目管理',
      cpath: '@/Views/workorder/projectManagement',
      name: 'projectManagement',
    },
    {
      path: 'orderTemplate',
      title: '模板管理',
      cpath: '@/Views/workorder/orderTemplate',
      name: 'orderTemplate',
    },
    {
      path: 'templateEdit',
      title: '模板编辑',
      cpath: '@/Views/workorder/templateEdit',
      name: 'templateEdit',
    },
    {
      path: 'orderDeviceType',
      title: '工单设备类型',
      cpath: '@/Views/workorder/deviceType',
      name: 'orderDeviceType',
    },
    {
      path: 'orderUser',
      title: '工单用户管理',
      cpath: '@/Views/workorder/userManagement',
      name: 'orderUser',
    },
    {
      path: 'inbound',
      title: '入库管理',
      cpath: '@/Views/workorder/inbound',
      name: 'inbound',
    },
    {
      path: 'storeRoom',
      title: '仓库管理',
      cpath: '@/Views/workorder/storeRoom',
      name: 'storeRoom',
    },
    {
      path: 'assetOverView',
      title: '资产总览',
      cpath: '@/Views/asset/overview',
      name: 'assetOverView',
    },
    {
      path: 'assetAccount',
      title: '资产台账',
      cpath: '@/Views/asset/account',
      name: 'assetAccount',
    },
    {
      path: 'assetsManage',
      title: '资产管理',
      cpath: '@/Views/asset/manage',
      name: 'assetsManage',
    },
    {
      path: 'receivRecords',
      title: '领取记录',
      cpath: '@/Views/workorder/receivRecords',
      name: 'receivRecords',
    },
    {
      path: 'outLibrary',
      title: '出库管理',
      cpath: '@/Views/workorder/outLibrary',
      name: 'outLibrary',
    },
    {
      path: 'standard',
      title: '标准库',
      cpath: '@/Views/inspection/standard',
      name: 'standard',
    },
    {
      path: 'planlist',
      title: '维保计划',
      cpath: '@/Views/maintenance/planList',
      name: 'planlist',
    },
    {
      path: 'statistics',
      title: '巡检统计',
      cpath: '@/Views/inspection/statistics',
      name: 'statistics',
    },
    {
      path: 'center',
      title: '巡检中心',
      cpath: '@/Views/inspection/center',
      name: 'center',
    },
    {
      path: 'inspectionTask',
      title: '巡检任务',
      cpath: '@/Views/inspection/task',
      name: 'inspectionTask',
    },
    {
      path: 'inspectionPoint',
      title: '巡检点',
      cpath: '@/Views/inspection/point',
      name: 'inspectionPoint'
    }, 
    {
      path: 'inspectionRecord',
      title: '巡检记录',
      cpath: '@/Views/inspection/record',
      name: 'inspectionRecord',
    },
    {
      path: 'live',
      title: '实时视频',
      cpath: '@/Views/cctv/live',
      name: 'live',

    },
    {
      path: 'record',
      title: '录像和抓拍',
      cpath: '@/Views/cctv/record',
      name: 'record'
    },
    {
      path: 'Diagram/:uuid',
      title: '组态图',
      cpath: '@/Views/Diagram',
      name: 'Diagram',

    },
    {
      path: 'panelList',
      title: '面板列表',
      cpath: '@/components/panel/panelList',
      name: 'panelList',

    },
    {
      path: 'energystatistics',
      title: '能耗首页统计',
      cpath: '@/Views/energy/energystatistics',
      name: 'energystatistics',

    },
    {
      path: 'camStatistics',
      title: '视频统计',
      cpath: '@/Views/cctv/camStatistics',
      name: 'camStatistics',
    },
    {
      path: 'acsuserinfo',
      title: '门禁用户信息',
      cpath: '@/Views/Acs/userInfo',
      name: 'acsuserinfo',
    },
    {
      path: 'doorinfo',
      title: '门禁信息',
      cpath: '@/Views/Acs/doorInfo',
      name: 'doorinfo',
    },
    {
      path: 'doorAlarm',
      title: '门禁紧急事件',
      cpath: '@/Views/Acs/doorAlarm',
      name: 'doorAlarm',
    },
    {
      path: 'iodata',
      title: '门禁进出记录',
      cpath: '@/Views/Acs/iodata',
      name: 'iodata',

    },
    {
      path: 'parkReal',
      title: '停车实时监控',
      cpath: '@/Views/park/parkReal',
      name: 'parkReal',

    },
    {
      path: 'userInfo',
      title: '停车场用户信息',
      cpath: '@/Views/park/userInfo',
      name: 'userInfo',

    },
    {
      path: 'parkIn',
      title: '场内停车记录',
      cpath: '@/Views/park/parkIn',
      name: 'parkIn',

    },
    {
      path: 'parkInError',
      title: '场内异常记录',
      cpath: '@/Views/park/parkInError',
      name: 'parkInError',

    },
    {
      path: 'openRecord',
      title: '开闸记录',
      cpath: '@/Views/park/openRecord',
      name: 'openRecord',
    },
    {
      path: 'parkRecord',
      title: '停车进出记录',
      cpath: '@/Views/park/packRecord',
      name: 'parkRecord',

    },

    {
      path: 'realdata',
      title: '实时表显',
      cpath: '@/Views/energy/realdata',
      name: 'realdata',

    },
    {
      path: 'historyData',
      title: '抄表记录',
      cpath: '@/Views/energy/historyData',
      name: 'historyData',

    },
    {
      path: 'areaEnergy',
      title: '区域能耗',
      cpath: '@/Views/energy/areaEnergy',
      name: 'areaEnergy',

    },
    {
      path: 'deptEnergy',
      title: '部门能耗',
      cpath: '@/Views/energy/deptEnergy',
      name: 'deptEnergy',

    },
    {
      path: 'categoryEnergy',
      title: '分类能耗',
      cpath: '@/Views/energy/categoryEnergy',
      name: 'categoryEnergy',

    },
    {
      path: 'Tcompare',
      title: '同比',
      cpath: '@/Views/energy/Tcompare',
      name: 'Tcompare',

    },
    {
      path: 'Hcompare',
      title: '环比',
      cpath: '@/Views/energy/Hcompare',
      name: 'Hcompare',

    },
    {
      path: 'notelist',
      title: '便签墙',
      cpath: '@/Views/note/notelist',
      name: 'notelist',

    },
    {
      path: 'informationRelease',
      title: '信息发布',
      cpath: '@/Views/ifr/informationRelease',
      name: 'informationRelease',
    },
    {
      path: 'realReportData',
      title: '实时数据',
      cpath: '@/Views/report/realData',
      name: 'realReportData'
    },
    {
      path: 'hReportData',
      title: '历史数据',
      cpath: '@/Views/report/historyData',
      name: 'hReportData'
    },
    // {
    //   path: 'patrolTask',
    //   title: '巡检任务',
    //   cpath: '@/Views/patrol/patrolTask',
    //   name: 'patrolTask'
    // },
    // {
    //   path: 'patrolRecord',
    //   title: '巡检记录',
    //   cpath: '@/Views/patrol/record',
    //   name: 'patrolRecord'
    // },
    {
      path: 'patrolPlayBack',
      title: '轨迹回放',
      cpath: '@/Views/patrol/playBack',
      name: 'patrolPlayBack'
    },
    // {
    //   path: 'patrolPoint',
    //   title: '巡检点',
    //   cpath: '@/Views/patrol/patrolPoint',
    //   name: 'patrolPoint',
    // },
    {
      path: 'repairManager',
      title: '维修管理',
      cpath: '@/Views/repair/repairManager',
      name: 'repairManager',
    },
    {
      path: 'repairRecord',
      title: '维修记录',
      cpath: '@/Views/repair/repairRecord',
      name: 'repairRecord',
    },
    {
      path: 'log',
      title: '系统日志',
      cpath: '@/Views/Log/runlog',
      name: 'log',
    },
    {
      path: 'server',
      cpath: '@/Views/server/serverManager',
      name: 'server',
      title: 'IOServer管理',
    },
    {
      path: 'setUp',
      title: '系统设置',
      cpath: '@/Views/setUp/setUp',
      name: 'setUp',

      children: [{
        path: 'gisset',
        name: 'gisset',
        cpath: '@/Views/setUp/gisset',
        title: 'GIS配置',

      },
      // {
      //   path: 'patrolPoint',
      //   cpath: '@/Views/setUp/patrol/patrolPoint',
      //   name: 'patrolPoint',
      //   title: '巡检点',
      // },

      // {
      //   path: 'patrolContent',
      //   cpath: '@/Views/setUp/patrol/patrolContent',
      //   name: 'patrolContent',
      //   title: '巡检内容',
      // },
      // {
      //   path: 'patrolStandard',
      //   title: '巡检标准',
      //   cpath: '@/Views/patrol/patrolStandard',
      //   name: 'patrolStandard'
       
      // },
      {
        path: 'patrolType',
        cpath: '@/Views/setUp/patrol/patrolType',
        name: 'patrolType',
        title: '巡检类型',
      },
      {
        path: 'filemanager',
        title: '音乐文件管理',
        cpath: '@/Views/itc/filemanager',
        name: 'filemanager',
        // component: () =>
        //   import('@/Views/itc/upload')
      },
      {
        path: 'filecontrol',
        title: '音乐播放',
        cpath: '@/Views/itc/filecontrol',
        name: 'filecontrol',
      },
      {
        path: 'itcterminal',
        title: 'ITC终端',
        cpath: '@/Views/itc/terminal',
        name: 'itcterminal',
        // component: () =>
        //   import('@/Views/itc/terminal')
      },
      {
        path: 'menuset',
        name: 'menuset',
        cpath: '@/Views/setUp/menuset',
        title: '系统菜单配置',

      },
      {
        path: 'systemArea',
        name: 'menuset',
        cpath: '@/Views/setUp/systemArea',
        title: '系统区域',
      },
      {
        path: 'areamenu',
        name: 'areamenu',
        cpath: '@/Views/setUp/areamenu',
        title: '区域菜单',
      },
      {
        path: 'functionmenu',
        cpath: '@/Views/setUp/funtionmenu',
        name: 'functionmenu',
        title: '功能菜单',
      },
      {
        path: 'userManager',
        cpath: '@/Views/setUp/userManager',
        name: 'userManager',
        title: '用户管理',
      },
      {
        path: 'roleManager',
        cpath: '@/Views/setUp/roleManager',
        name: 'roleManager',
        title: '角色管理',
      },
      {
        path: 'authorization',
        cpath: '@/Views/setUp/authorization',
        name: 'authorization',
        title: '权限控制',
      },
      {
        path: 'funs',
        cpath: '@/Views/setUp/funManager',
        name: 'funs',
        title: '功能管理',
      },
      {
        path: 'alarmSet',
        cpath: '@/Views/setUp/alarmSet',
        name: 'alarmSet',
        title: '联动配置',
      },
      {
        path: 'energyArea',
        cpath: '@/Views/setUp/energyArea',
        name: 'energyArea',
        title: '能耗区域',
      },
      {
        path: 'energyDept',
        cpath: '@/Views/setUp/energyDept',
        name: 'energyDept',
        title: '能耗部门',
      },

      {
        path: 'energyCategory',
        cpath: '@/Views/setUp/energyCategory',
        name: 'energyCategory',
        title: '能耗分类',
      },
      {
        path: 'energyDevice',
        cpath: '@/Views/setUp/energyDevice',
        name: 'energyDevice',
        title: '能源设备',
      },
      {
        path: 'devicePanel',
        cpath: '@/Views/setUp/devicePanel',
        name: 'devicePanel',
        title: '面板配置',
      },
      {
        path: 'bimUpload',
        cpath: '@/Views/setUp/bim/bimUpload',
        name: 'bimUpload',
        title: 'Bim模型上传',
      },
      {
        path: 'bimModelList',
        cpath: '@/Views/setUp/bim/bimModelList',
        name: 'bimModelList',
        title: 'Bim模型列表',
      },
      {
        path: 'bimDesign',
        cpath: '@/Views/setUp/bim/bimDesign',
        name: 'bimDesign',
        title: 'Bim模型设计',
      },
      {
        path: 'terminalSet',
        cpath: '@/Views/setUp/terminalSet',
        name: 'terminalSet',
        title: '信息终端',
      },
      {
        path: 'systemDept',
        cpath: '@/Views/setUp/systemDept',
        name: 'systemDept',
        title: '部门配置',
      },
      {
        path: 'deviceCategory',
        cpath: '@/Views/setUp/deviceCategory',
        name: 'deviceCategory',
        title: '设备分类',
      },
      {
        path: 'groupcontrol',
        cpath: '@/Views/setUp/shedule/Group',
        name: 'groupcontrol',
        title: '控制组',
      },
      {
        path: 'scene',
        cpath: '@/Views/setUp/shedule/Scene',
        name: 'scene',
        title: '场景控制',
      },
      {
        path: 'looptask',
        cpath: '@/Views/setUp/shedule/LoopTask',
        name: 'looptask',
        title: '循环任务',
      },
      {
        path: 'timetask',
        cpath: '@/Views/setUp/shedule/TimeTask',
        name: 'timetask',
        title: '定时任务',
      },
      {
        path: 'taskmanager',
        cpath: '@/Views/setUp/shedule/TaskManager',
        name: 'taskmanager',
        title: '任务管理',
      },
      {
        path: 'fatask',
        cpath: '@/Views/setUp/shedule/ITCTask',
        name: 'fatask',
        title: '广播任务',
      },
      {
        path: 'camServer',
        cpath: '@/Views/setUp/video/camServer',
        name: 'camServer',
        title: '流媒体配置',
      },
      {
        path: 'camSet',
        cpath: '@/Views/setUp/video/camSet',
        name: 'camSet',
        title: '摄像机配置',
      },
      {
        path: 'dept',
        cpath: '@/Views/setUp/dept',
        name: 'dept',
        title: '部门管理'
      },
      {
        path: 'resource',
        cpath: '@/Views/setUp/resource',
        name: 'resource',
        title: '资源授权',
      },
      {
        path: 'deviceType',
        title: '设备类型',
        cpath: '@/Views/setUp/deviceType',
        name: 'deviceType'
      },
      ]
    },
    {
      path: 'reportvoc',
      title: 'Voc报表',
      cpath: '@/Views/report/VocReport',
      name: 'reportvoc',
    },

    ]
  }
]



