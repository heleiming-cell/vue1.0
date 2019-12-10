let imgs = {
  'PAU': '../../../../static/images/panel/xinfengji.jpg',
  'accressControl': '../../../../static/images/panel/menjin.jpg',
  'hotWater': '',
  'waterTank': '../../../../static/images/panel/ruanhuashuixiang.jpg',
  'AHU': '../../../../static/images/panel/kongtiao.jpg',
  'boiler': '../../../../static/images/panel/reshuiguolu.jpg',
  'bulb': '../../../../static/images/panel/zhaoming.jpg',
  'catchmentPit': '../../../../static/images/panel/jishuiken.jpg',
  'chilledPump': '',
  'coolingDN': '',
  'coolingTower': '../../../../static/images/panel/lengqueta.jpg',
  'encironmentalMonitor': '../../../../static/images/panel/huanjingjiance.jpg',
  'expansionTank': '../../../../static/images/panel/pengzhangshuixiang.jpg',
  'waterSupply': '',
  'sewagePump': '',
  'medicalGas': 'yiliaoqiti',
  'heatExchangePlate': '../../../../static/images/panel/rebanhuan.jpg',
  'fireControl': '',
  'fireAlarm': '',
  'feedWater': '',
  'waterPump': '',
  'sendingAir': '../../../../static/images/panel/songpaifeng.jpg',
  'FCU': '../../../../static/images/panel/fengjipaiguan.jpg',
  'elevator': '',
  'EM': '../../static/images/panel/screen.jpg',
  'HomeEM': '../../static/images/panel/homeem.jpg'
};

let panelConfig = {
  'PAU': [{
      n: 1,
      name: '温度设定',
      id: 'SetTemp',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 2,
      name: '送风温度',
      id: 'SupplyTemp',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 3,
      name: '送风湿度',
      id: 'SupplyHumi',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 4,
      name: '滤网报警',
      id: 'FilterAlarm',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 5,
      name: '水阀调节',
      id: 'SetWaterValue',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 6,
      name: '水阀反馈',
      id: 'WaterValueFB',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 7,
      name: '新风阀调节',
      id: 'FreAirValveAd',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 8,
      name: '新风阀反馈',
      id: 'FreAirValveFb',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 9,
      name: '手动自动',
      id: 'AutoMode',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 10,
      name: '故障报警',
      id: 'FaultAlarm',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 11,
      name: '运行状态',
      id: 'RunningState',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 12,
      name: '启停',
      id: 'RunStopSW',
      var: '',
      history: '',
      realtime: false,
    }
  ],

  'accressControl': [],
  'hotWater': [],
  'waterTank': [],
  'AHU': [{
      n: 1,
      name: '模式设定',
      id: 'SetPattern',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 2,
      name: '温度设定',
      id: 'SetTemp',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 3,
      name: '送风温度',
      id: 'SupplyTemp',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 4,
      name: '送风湿度',
      id: 'SupplyHumi',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 5,
      name: '回风温度',
      id: 'ReturnTemp',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 6,
      name: '回风湿度',
      id: 'ReturnHumi',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 7,
      name: '滤网报警',
      id: 'FilterAlarm',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 8,
      name: '水阀调节',
      id: 'WaterValue',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 9,
      name: '水阀反馈',
      id: 'WaterValueFB',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 10,
      name: '新风阀调节',
      id: 'FreAirValveAd',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 11,
      name: '新风阀反馈',
      id: 'FreAirValveFb',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 12,
      name: '回风阀调节',
      id: 'ReAirValveAd',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 13,
      name: '回风阀反馈',
      id: 'ReAirValveAd',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 14,
      name: '手动自动',
      id: 'AutoMode',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 15,
      name: '故障报警',
      id: 'FaultAlarm',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 16,
      name: '运行状态',
      id: 'RunningState',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 17,
      name: '启停',
      id: 'RunStopSW',
      var: '',
      history: '',
      realtime: false,
    }
  ],
  'boiler': [],
  'bulb': [],
  'catchmentPit': [],
  'chilledPump': [],
  'coolingDN': [],
  'coolingTower': [],
  'encironmentalMonitor': [],
  'expansionTank': [],
  'waterSupply': [],
  'sewagePump': [],
  'medicalGas': [],
  'heatExchangePlate': [],
  'fireControl': [],
  'fireAlarm': [],
  'feedWater': [],
  'waterPump': [],
  'sendingAir': [],
  'HomeEM': [{
      n: 1,
      name: 'PM2.5',
      id: 'PM',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 2,
      name: '甲醛',
      id: 'HOCO',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 3,
      name: 'co2',
      id: 'CO2',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 4,
      name: '温度',
      id: 'TEMP',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 5,
      name: '湿度',
      id: 'WED',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 6,
      name: 'VOC',
      id: 'VOC',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 7,
      name: '标题',
      id: 'Name',
      var: '',
      history: '',
      realtime: false,
    },

  ],
  'FCU': [{
      n: 1,
      name: '模式设定',
      id: 'SetMode',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 2,
      name: '室内温度',
      id: 'RoomTemp',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 3,
      name: '温度设定',
      id: 'TempSet',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 4,
      name: '风量调节',
      id: 'FanSpeed',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 5,
      name: '运行状态',
      id: 'RunningState',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 6,
      name: '启停',
      id: 'RunStopSW',
      var: '',
      history: '',
      realtime: false,
    },

  ],
  'elevator': [],
  'EM': [{
      n: 1,
      name: '室内PM2.5',
      id: 'RoomPM',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 2,
      name: '室外PM2.5',
      id: 'OutDoorPM',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 3,
      name: '室内温度',
      id: 'RoomTemp',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 4,
      name: '室外温度',
      id: 'OutDoorTemp',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 5,
      name: '室内湿度',
      id: 'RoomWet',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 6,
      name: '室外湿度',
      id: 'OutDoorWet',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 7,
      name: '室内VOC含量',
      id: 'RoomVOC',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 8,
      name: '室内二氧化碳',
      id: 'RoomCO2',
      var: '',
      history: '',
      realtime: false,
    },
    {
      n: 9,
      name: '室内甲醛',
      id: 'RoomHCHO',
      var: '',
      history: '',
      realtime: false,
    }
  ],
};

export {
  imgs,
  panelConfig
};