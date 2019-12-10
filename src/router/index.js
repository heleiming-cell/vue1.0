import Vue from 'vue'
import Router from 'vue-router'
import Cookie from 'js-cookie'
Vue.use(Router)
let route = new Router({
  routes: [{
      path: '/login',
      // redirect: '/login',
      name: 'login',
      component: () =>
        import('@/Views/login/login')
    },
    {
      path: '/navigate',
      // redirect: '/login',
      name: 'navigate',
      component: () =>
        import('@/Views/navigate/navigate')
    },
    {
      path: '/homepage',
      title: '首页1',
      cpath: '@/Views/home',
      name: 'homepage',
      component: () =>
        import('@/Views/home')
    },
    {
      path: '/home2',
      title: '首页2',
      cpath: '@/Views/home/src/main2',
      name: 'home2',
      component: () =>
        import('@/Views/home/src/main2')
    },
    {
      path: '/home3',
      title: '首页3',
      cpath: '@/Views/home/src/main3',
      name: 'home3',
      component: () =>
        import('@/Views/home/src/main3')
    },
    {
      path: '/',
      name: '首页',
      component: () =>
        import('@/Views/Main.vue'),
      title: '首页',
      children: [
        {
          path: 'parkReal',
          title: '停车实时监控',
          cpath: '@/Views/park/parkReal',
          name: 'parkReal',
          component: () =>
            import('@/Views/park/parkReal')
        },
        {
          path: 'userInfo',
          title: '停车场用户信息',
          cpath: '@/Views/park/userInfo',
          name: 'userInfo',
          component: () =>
            import('@/Views/park/userInfo')
        },
        {
          path: 'parkIn',
          title: '场内停车记录',
          cpath: '@/Views/park/parkIn',
          name: 'parkIn',
          component: () =>
            import('@/Views/park/parkIn')
        },
        {
          path: 'parkInError',
          title: '场内异常记录',
          cpath: '@/Views/park/parkInError',
          name: 'parkInError',
          component: () =>
            import('@/Views/park/parkInError')
        },
        {
          path: 'openRecord',
          title: '开闸记录',
          cpath: '@/Views/park/openRecord',
          name: 'openRecord',
          component: () =>
            import('@/Views/park/openRecord')
        },
        {
          path: 'parkRecord',
          title: '停车进出记录',
          cpath: '@/Views/park/packRecord',
          name: 'parkRecord',
          component: () =>
            import('@/Views/park/packRecord')
        },
        // {
        //   path: 'gis',
        //   title: 'GIS',
        //   cpath: '@/Views/gis',
        //   name: 'gis',
        //   component: () =>
        //     import('@/Views/gis')
        // },
        {
          path: 'bim',
          title: 'bim',
          cpath: '@/Views/bim',
          name: 'bim',
          component: () =>
            import('@/Views/bim')
        },
        {
          path: 'empty',
          title: '404',
          cpath: '@/Views/empty',
          name: 'empty',
          component: () =>
            import('@/Views/empty')
        },
        {
          path: 'alarmStatistics',
          title: '报警统计',
          cpath: '@/Views/alarm/alarmStatistics',
          name: 'alarmStatistics',
          component: () =>
            import('@/Views/alarm/alarmStatistics')
        },
        {
          path: 'alarmHistory',
          title: '报警历史记录',
          cpath: '@/Views/alarm/alarmHistory',
          name: 'alarmHistory',
          component: () =>
            import('@/Views/alarm/alarmHistory')
        },
        {
          path: 'deviceManager',
          title: '设备管理',
          cpath: '@/Views/deviceManager/deviceManager',
          name: 'deviceManager',
          component: () =>
            import('@/Views/deviceManager/deviceManager')
        },
        {
          path: 'device',
          title: '设备台账',
          cpath: '@/Views/deviceManager/device',
          name: 'device',
          component: () =>
            import('@/Views/deviceManager/device')
        },

        {
          path: 'overview',
          title: '工单总览',
          cpath: '@/Views/workorder/overview',
          name: 'overview',
          component: () =>
            import('@/Views/workorder/overview')
        },
        {
          path: 'hangUp',
          title: '工单挂起',
          cpath: '@/Views/workorder/hangUp',
          name: 'hangUp',
          component: () =>
            import('@/Views/workorder/hangUp')
        },
        {
          path: 'close',
          title: '工单关闭',
          cpath: '@/Views/workorder/close',
          name: 'close',
          component: () =>
            import('@/Views/workorder/close')
        },
        {
          path: 'accomplish',
          title: '工单完成',
          cpath: '@/Views/workorder/accomplish',
          name: 'accomplish',
          component: () =>
            import('@/Views/workorder/accomplish')
        },
        {
          path: 'newOrder',
          title: '新建工单',
          cpath: '@/Views/workorder/newOrder',
          name: 'newOrder',
          component: () =>
            import('@/Views/workorder/newOrder')
        },
        {
          path: 'orderDetail',
          title: '工单详情',
          cpath: '@/Views/workorder/orderDetail',
          name: 'orderDetail',
          component: () =>
            import('@/Views/workorder/orderDetail')
        },
        {
          path: 'projectManagement',
          title: '项目管理',
          cpath: '@/Views/workorder/projectManagement',
          name: 'projectManagement',
          component: () =>
            import('@/Views/workorder/projectManagement')
        },
        {
          path: 'orderTemplate',
          title: '模板管理',
          cpath: '@/Views/workorder/orderTemplate',
          name: 'orderTemplate',
          component: () =>
            import('@/Views/workorder/orderTemplate')
        },
        {
          path: 'templateEdit',
          title: '模板编辑',
          cpath: '@/Views/workorder/templateEdit',
          name: 'templateEdit',
          component: () =>
            import('@/Views/workorder/templateEdit')
        },
        {
          path: 'orderDeviceType',
          title: '工单设备类型',
          cpath: '@/Views/workorder/deviceType',
          name: 'orderDeviceType',
          component: () =>
            import('@/Views/workorder/deviceType')
        },
        {
          path: 'orderUser',
          title: '工单用户管理',
          cpath: '@/Views/workorder/userManagement',
          name: 'orderUser',
          component: () =>
            import('@/Views/workorder/userManagement')
        },
        {
          path: 'inbound',
          title: '入库管理',
          cpath: '@/Views/workorder/inbound',
          name: 'inbound',
          component: () =>
            import('@/Views/workorder/inbound')
        },
        {
          path: 'outLibrary',
          title: '出库管理',
          cpath: '@/Views/workorder/outLibrary',
          name: 'outLibrary',
          component: () =>
            import('@/Views/workorder/outLibrary')
        },
        {
          path: 'receivRecords',
          title: '领取记录',
          cpath: '@/Views/workorder/receivRecords',
          name: 'receivRecords',
          component: () =>
            import('@/Views/workorder/receivRecords')
        },
        
        {
          path: 'storeRoom',
          title: '仓库管理',
          cpath: '@/Views/workorder/storeRoom',
          name: 'storeRoom',
          component: () =>
            import('@/Views/workorder/storeRoom')
        },
        {
          path: 'repositoryDetail/:id',
          title: '仓库详情',
          cpath: '@/Views/workorder/reponsitoryDetail',
          name: 'reponsitoryDetail',
          component: () =>
            import('@/Views/workorder/reponsitoryDetail')
        },
        {
          path: 'underway',
          title: '工单进行中',
          cpath: '@/Views/workorder/underway',
          name: 'underway',
          component: () =>
            import('@/Views/workorder/underway')
        },
        {
          path: 'assetOverView',
          title: '资产总览',
          cpath: '@/Views/asset/overview',
          name: 'assetOverView',
          component: () =>
            import('@/Views/asset/overview')
        },
        {
          path: 'assetAccount',
          title: '资产台账',
          cpath: '@/Views/asset/account',
          name: 'assetAccount',
          component: () =>
            import('@/Views/asset/account')
        },
        {
          path: 'assetsManage',
          title: '资产管理',
          cpath: '@/Views/asset/manage',
          name: 'assetsManage',
          component: () =>
            import('@/Views/asset/manage')
        },
        {
          path: 'standard',
          title: '标准库',
          cpath: '@/Views/inspection/standard',
          name: 'standard',
          component: () =>
            import('@/Views/inspection/standard')
        },
        {
          path: 'planlist',
          title: '维保计划',
          cpath: '@/Views/maintenance/planList',
          name: 'planlist',
          component: () =>
            import('@/Views/maintenance/planList')
        },
        {
          path: 'statistics',
          title: '巡检统计',
          cpath: '@/Views/inspection/statistics',
          name: 'statistics',
          component: () =>
            import('@/Views/inspection/statistics')
        },
        {
          path: 'center',
          title: '巡检中心',
          cpath: '@/Views/inspection/center',
          name: 'center',
          component: () =>
            import('@/Views/inspection/center')
        },
        {
          path: 'inspectionTask',
          title: '巡检任务',
          cpath: '@/Views/inspection/task',
          name: 'inspectionTask',
          component: () =>
            import('@/Views/inspection/task')
        },
        {
          path: 'inspectionPoint',
          title: '巡检点',
          cpath: '@/Views/inspection/point',
          name: 'inspectionPoint',
          component: () =>
            import('@/Views/inspection/point')
        },
        {
          path: 'inspectionRecord',
          title: '巡检记录',
          cpath: '@/Views/inspection/record',
          name: 'inspectionRecord',
          component: () =>
            import('@/Views/inspection/record')
        },
        {
          path: 'live',
          title: '实时视频',
          cpath: '@/Views/cctv/live',
          name: 'live',
          component: () =>
            import('@/Views/cctv/live')
        },
        {
          path: 'record',
          title: '录像和抓拍',
          cpath: '@/Views/cctv/record',
          name: 'record',
          component: () =>
            import('@/Views/cctv/record')
        },
        {
          path: 'Diagram/:uuid',
          title: '组态图',
          cpath: '@/Views/Diagram',
          name: 'Diagram',
          component: () =>
            import('@/Views/Diagram')
        },
        {
          path: 'panelList',
          title: '面板列表',
          cpath: '@/@/components/panel/panelList',
          name: 'panelList',
          component: () =>
            import('@/components/panel/panelList')
        },
        {
          path: 'energystatistics',
          title: '能源',
          cpath: '@/Views/energy/energystatistics',
          name: 'energystatistics',
          component: () =>
            import('@/Views/energy/energystatistics')
        },
        {
          path: 'camStatistics',
          title: '视频统计',
          cpath: '@/Views/cctv/camStatistics',
          name: 'camStatistics',
          component: () =>
            import('@/Views/cctv/camStatistics')
        },
        {
          path: 'acsuserinfo',
          title: '门禁用户信息',
          cpath: '@/Views/Acs/userInfo',
          name: 'acsuserinfo',
          component: () =>
            import('@/Views/Acs/userInfo')
        },
        {
          path: 'doorinfo',
          title: '门禁信息',
          cpath: '@/Views/Acs/doorInfo',
          name: 'doorinfo',
          component: () =>
            import('@/Views/Acs/doorInfo')
        },
        {
          path: 'doorAlarm',
          title: '门禁紧急事件',
          cpath: '@/Views/Acs/doorAlarm',
          name: 'doorAlarm',
          component: () =>
            import('@/Views/Acs/doorAlarm')
        },
        {
          path: 'iodata',
          title: '门禁进出记录',
          cpath: '@/Views/Acs/iodata',
          name: 'iodata',
          component: () =>
            import('@/Views/Acs/iodata')
        },
        {
          path: 'realdata',
          title: '实时表显',
          cpath: '@/Views/energy/realdata',
          name: 'realdata',
          component: () =>
            import('@/Views/energy/realdata')
        },
        {
          path: 'historyData',
          title: '抄表记录',
          cpath: '@/Views/energy/historyData',
          name: 'historyData',
          component: () =>
            import('@/Views/energy/historyData')
        },
        {
          path: 'areaEnergy',
          title: '区域能耗',
          cpath: '@/Views/energy/areaEnergy',
          name: 'areaEnergy',
          component: () =>
            import('@/Views/energy/areaEnergy')
        },
        {
          path: 'deptEnergy',
          title: '部门能耗',
          cpath: '@/Views/energy/deptEnergy',
          name: 'deptEnergy',
          component: () =>
            import('@/Views/energy/deptEnergy')
        },
        {
          path: 'categoryEnergy',
          title: '分类能耗',
          cpath: '@/Views/energy/categoryEnergy',
          name: 'categoryEnergy',
          component: () =>
            import('@/Views/energy/categoryEnergy')
        },
        {
          path: 'Tcompare',
          title: '同比',
          cpath: '@/Views/energy/Tcompare',
          name: 'Tcompare',
          component: () =>
            import('@/Views/energy/Tcompare')
        },
        {
          path: 'Hcompare',
          title: '环比',
          cpath: '@/Views/energy/Hcompare',
          name: 'Hcompare',
          component: () =>
            import('@/Views/energy/Hcompare')
        },
        {
          path: 'notelist',
          title: '便签墙',
          cpath: '@/Views/note/notelist',
          name: 'notelist',
          component: () =>
            import('@/Views/note/notelist')
        },
        {
          path: 'informationRelease',
          title: '信息发布',
          cpath: '@/Views/ifr/informationRelease',
          name: 'informationRelease',
          component: () =>
            import('@/Views/ifr/informationRelease')
        },
        {
          path: 'realReportData',
          title: '实时数据',
          cpath: '@/Views/report/realData',
          name: 'realReportData',
          component: () =>
            import('@/Views/report/realData')
        },
        {
          path: 'hReportData',
          title: '历史数据',
          cpath: '@/Views/report/historyData',
          name: 'hReportData',
          component: () =>
            import('@/Views/report/historyData')
        },
        // {
        //   path: 'patrolTask',
        //   title: '巡检任务',
        //   cpath: '@/Views/patrol/patrolTask',
        //   name: 'patrolTask',
        //   component: () =>
        //     import('@/Views/patrol/patrolTask')
        // },
        {
          path: 'patrolRecord',
          title: '巡检记录',
          cpath: '@/Views/patrol/record',
          name: 'patrolRecord',
          component: () =>
            import('@/Views/patrol/record')
        },
        {
          path: 'patrolStandard',
          title: '巡检标准',
          cpath: '@/Views/patrol/patrolStandard',
          name: 'patrolStandard',
          component: () =>
            import('@/Views/patrol/patrolStandard')
        },
        // {
        //   path: 'patrolPoint',
        //   title: '巡检点',
        //   cpath: '@/Views/patrol/patrolPoint',
        //   name: 'patrolPoint',
        //   component: () =>
        //     import('@/Views/patrol/patrolPoint')
        // },
        {
          path: 'repairManager',
          title: '维修管理',
          cpath: '@/Views/repair/repairManager',
          name: 'repairManager',
          component: () =>
            import('@/Views/repair/repairManager')
        },
        {
          path: 'repairRecord',
          title: '维修记录',
          cpath: '@/Views/repair/repairRecord',
          name: 'repairRecord',
          component: () =>
            import('@/Views/repair/repairRecord')
        },
        {
          path: 'log',
          title: '系统日志',
          cpath: '@/Views/Log/runlog',
          name: 'log',
          component: () =>
            import('@/Views/Log/runlog')
        },
        {
          path: 'server',
          cpath: '@/Views/server/serverManager',
          name: 'server',
          title: 'IOServer管理',
          component: () =>
            import('@/Views/server/serverManager')
        },
        {
          path: 'filemanager',
          title: '音乐文件管理',
          cpath: '@/Views/itc/filemanager',
          name: 'filemanager',
          component: () =>
            import('@/Views/itc/filemanager')
        },
        {
          path: 'filecontrol',
          title: '音乐播放',
          cpath: '@/Views/itc/filecontrol',
          name: 'filecontrol',
          component: () =>
          import('@/Views/itc/filecontrol')
        },
        {
          path: 'itcterminal',
          title: 'ITC终端',
          cpath: '@/Views/itc/terminal',
          name: 'itcterminal',
          component: () =>
            import('@/Views/itc/terminal')
        },
        {
          path: 'setUp',
          title: '系统设置',
          cpath: '@/Views/setUp/setUp',
          name: 'setUp',
          component: () =>
            import('@/Views/setUp/setUp'),
          children: [
            {
              path: 'gisset',
              name: 'gisset',
              cpath: '@/Views/setUp/gisset',
              title: 'GIS配置',
              component: () =>
                import('@/Views/setUp/gisset')
            },
            {
              path: 'menuset',
              name: 'menuset',
              cpath: '@/Views/setUp/menuset',
              title: '系统菜单配置',
              component: () =>
                import('@/Views/setUp/menuset')
            },
            {
              path: 'systemArea',
              name: 'menuset',
              cpath: '@/Views/setUp/systemArea',
              title: '系统区域',
              component: () =>
                import('@/Views/setUp/systemArea')
            },
            {
              path: 'areamenu',
              name: 'areamenu',
              cpath: '@/Views/setUp/areamenu',
              title: '区域菜单',
              component: () =>
                import('@/Views/setUp/areamenu')
            },
            {
              path: 'functionmenu',
              cpath: '@/Views/setUp/funtionmenu',
              name: 'functionmenu',
              title: '功能菜单',
              component: () =>
                import('@/Views/setUp/funtionmenu')
            },
            {
              path: 'userManager',
              cpath: '@/Views/setUp/userManager',
              name: 'userManager',
              title: '用户管理',
              component: () =>
                import('@/Views/setUp/userManager')
            },
            {
              path: 'roleManager',
              cpath: '@/Views/setUp/roleManager',
              name: 'roleManager',
              title: '角色管理',
              component: () =>
                import('@/Views/setUp/roleManager')
            },
            {
              path: 'authorization',
              cpath: '@/Views/setUp/authorization',
              name: 'authorization',
              title: '权限控制',
              component: () =>
                import('@/Views/setUp/authorization')
            },
            {
              path: 'funs',
              cpath: '@/Views/setUp/funManager',
              name: 'funs',
              title: '功能管理',
              component: () =>
                import('@/Views/setUp/funManager')
            },
            {
              path: 'alarmSet',
              cpath: '@/Views/setUp/alarmSet',
              name: 'alarmSet',
              title: '联动配置',
              component: () =>
                import('@/Views/setUp/alarmSet')
            },
            {
              path: 'energyArea',
              cpath: '@/Views/setUp/energyArea',
              name: 'energyArea',
              title: '能耗区域',
              component: () =>
                import('@/Views/setUp/energyArea')
            },
            {
              path: 'energyDept',
              cpath: '@/Views/setUp/energyDept',
              name: 'energyDept',
              title: '能耗部门',
              component: () =>
                import('@/Views/setUp/energyDept')
            },

            {
              path: 'energyCategory',
              cpath: '@/Views/setUp/energyCategory',
              name: 'energyCategory',
              title: '能耗分类',
              component: () =>
                import('@/Views/setUp/energyCategory')
            },
            {
              path: 'energyDevice',
              cpath: '@/Views/setUp/energyDevice',
              name: 'energyDevice',
              title: '能源设备',
              component: () =>
                import('@/Views/setUp/energyDevice')
            },
            {
              path: 'devicePanel',
              cpath: '@/Views/setUp/devicePanel',
              name: 'devicePanel',
              title: '面板配置',
              component: () =>
                import('@/Views/setUp/devicePanel')
            },
            {
              path: 'bimUpload',
              cpath: '@/Views/setUp/bim/bimUpload',
              name: 'bimUpload',
              title: 'Bim模型上传',
              component: () =>
                import('@/Views/setUp/bim/bimUpload')
            },
            {
              path: 'bimModelList',
              cpath: '@/Views/setUp/bim/bimModelList',
              name: 'bimModelList',
              title: 'Bim模型列表',
              component: () =>
                import('@/Views/setUp/bim/bimModelList')
            },
            {
              path: 'bimDesign',
              cpath: '@/Views/setUp/bim/bimDesign',
              name: 'bimDesign',
              title: 'Bim模型设计',
              component: () =>
                import('@/Views/setUp/bim/bimDesign')
            },
            {
              path: 'terminalSet',
              cpath: '@/Views/setUp/terminalSet',
              name: 'terminalSet',
              title: '信息终端',
              component: () =>
                import('@/Views/setUp/terminalSet')
            },
            {
              path: 'systemDept',
              cpath: '@/Views/setUp/systemDept',
              name: 'systemDept',
              title: '部门配置',
              component: () =>
                import('@/Views/setUp/systemDept')
            },
            {
              path: 'deviceCategory',
              cpath: '@/Views/setUp/deviceCategory',
              name: 'deviceCategory',
              title: '设备分类',
              component: () =>
                import('@/Views/setUp/deviceCategory')
            },
            // {
            //   path: 'patrolPoint',
            //   cpath: '@/Views/setUp/patrol/patrolPoint',
            //   name: 'patrolPoint',
            //   title: '巡检点',
            //   component: () =>
            //     import('@/Views/setUp/patrol/patrolPoint')
            // },
            // {
            //   path: 'patrolTask',
            //   cpath: '@/Views/setUp/patrol/patrolTask',
            //   name: 'patrolLine',
            //   title: '巡检任务',
            //   component: () =>
            //     import('@/Views/setUp/patrol/patrolTask')
            // },
            {
              path: 'patrolContent',
              cpath: '@/Views/setUp/patrol/patrolContent',
              name: 'patrolContent',
              title: '巡检内容',
              component: () =>
                import('@/Views/setUp/patrol/patrolContent')
            },
            {
              path: 'patrolType',
              cpath: '@/Views/setUp/patrol/patrolType',
              name: 'patrolType',
              title: '巡检类型',
              component: () =>
                import('@/Views/setUp/patrol/patrolType')
            },
            {
              path: 'groupcontrol',
              cpath: '@/Views/setUp/shedule/Group',
              name: 'groupcontrol',
              title: '控制组',
              component: () =>
                import('@/Views/setUp/shedule/Group')
            },
            {
              path: 'scene',
              cpath: '@/Views/setUp/shedule/Scene',
              name: 'scene',
              title: '场景控制',
              component: () =>
                import('@/Views/setUp/shedule/Scene')
            },
            {
              path: 'looptask',
              cpath: '@/Views/setUp/shedule/LoopTask',
              name: 'looptask',
              title: '循环任务',
              component: () =>
                import('@/Views/setUp/shedule/LoopTask')
            },
            {
              path: 'timetask',
              cpath: '@/Views/setUp/shedule/TimeTask',
              name: 'timetask',
              title: '定时任务',
              component: () =>
                import('@/Views/setUp/shedule/TimeTask')
            },
            {
              path: 'taskmanager',
              cpath: '@/Views/setUp/shedule/TaskManager',
              name: 'taskmanager',
              title: '任务管理',
              component: () =>
                import('@/Views/setUp/shedule/TaskManager')
            },
            {
              path: 'fatask',
              cpath: '@/Views/setUp/shedule/ITCTask',
              name: 'fatask',
              title: '广播任务',
              component: () =>
                import('@/Views/setUp/shedule/ITCTask')
            },
            {
              path: 'camServer',
              cpath: '@/Views/setUp/video/camServer',
              name: 'camServer',
              title: '流媒体配置',
              component: () =>
                import('@/Views/setUp/video/camServer')
            },
            {
              path: 'camSet',
              cpath: '@/Views/setUp/video/camSet',
              name: 'camSet',
              title: '摄像机配置',
              component: () =>
                import('@/Views/setUp/video/camSet')
            },
            {
              path: 'dept',
              cpath: '@/Views/setUp/dept',
              name: 'dept',
              title: '部门管理',
              component: () =>
                import('@/Views/setUp/dept')
            },
            {
              path: 'resource',
              cpath: '@/Views/setUp/resource',
              name: 'resource',
              title: '资源授权',
              component: () =>
                import('@/Views/setUp/resource')
            },
            {
              path: 'deviceType',
              title: '设备类型',
              cpath: '@/Views/setUp/deviceType',
              name: 'deviceType',
              component: () =>
                import('@/Views/setUp/deviceType')
            },
          ]
        },
        {
          path: 'reportvoc',
          title: 'Voc报表',
          cpath: '@/Views/report/VocReport',
          name: 'reportvoc',
          component: () =>
            import('@/Views/report/VocReport')
        },

      ]
    }
  ]
})

// route.beforeEach((to, from, next) => {
//   if (sessionStorage.route) {
//     let r = JSON.parse(sessionStorage.route);
//     r.component=()=>import("@/Main.vue");
//     if (r.children && r.children.length > 0) {
//       let temp=[];
//       r.children.forEach((v, i) => {
//         temp.push({
//           path: v.path,
//           name: v.name,
//           component: () =>
//               import('@/' + v.cpath + '.vue'),
//           title: v.title,
//           cpath: v.cpath,
//           children: [],
//         });
//       })
//       r.children=temp;
//     }

//   }
//   next()
// });

route.beforeEach((to, from, next) => {
  const nextRoute = ['/login'] // 需要登录的页面
  let isLogin = Cookie.get("token") // 判断是否登录，本地存储有用户数据则视为已经登录

  if (isLogin && isLogin != undefined && isLogin != null) { // 如果未登录（本地存储无用户数据），并且要跳到登录页面
    if (to.path === '/login') {
      next('/home')
    } else {
      next()
    }
  } else {
    if (nextRoute.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})
export default route;
