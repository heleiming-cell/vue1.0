// import {
//   threadId
// } from "worker_threads";

class Device {
  constructor() {
    this.ID = '';
    this.GUID = "";
    this.EquipmentName = "";
    this.Model = "";
    this.State = "正常";
    this.DeptName = "";
    this.DeptID = '';
    this.AreaName = "";
    this.Address = "";
    this.CategoryName = "";
    this.CategoryID = '';
    this.AreaID = '';
    this.Producer = "";
    this.ProduceDate = "";
    this.InstallDate = "";
    // this.PurchaseDate = "";
    this.Period = '';
    // this.QualityDate = "";
    // this.OverdueDays = '';
    this.Description = "";
    this.PanelID = ''
  }
}
class alarm {
  constructor() {
    this.AlarmHHEnable = false; //超高报警
    this.AlarmHH = 0; //超高报警值
    this.AlarmLevelHH = '1'; //超高报警级别
    this.AlarmHEnable = false; //高限报警
    this.AlarmH = 0; //高限值
    this.AlarmLevelH = '1'; //高限报警级别

    this.AlarmLL = 0; //超低报警值
    this.AlarmLLEnable = false; //超低报警
    this.AlarmLevelLL = '1'; //超低报警
    this.AlarmLEnable = false; //底限报警
    this.AlarmL = 0; //底限值
    this.AlarmLevelL = '1'; //底限报警级别

    this.AlarmLevelST = '1'; //状态报警级别
    this.AlarmST0 = false;
    this.AlarmST1 = false;
    this.AlarmST2 = false;
    this.AlarmST3 = false;

    this.AssociateVideo = "";
    this.AssociateVideo2 = "";
    this.AssociateForm = "";
    this.AssociateForm2 = "";
    this.EnableRecord = false; //录像
    this.EnableSnap = false; //抓拍
    this.Action1 = ""; //动作1
    this.Action2 = ""; //动作2
    this.Phone = ""; //手机号
  }

}
class bimParamter {
  constructor() {
    this.EnableDrawLine = false;
    this.EnableActionBind = false; //鼠标事件
    this.EnableAnimationBind = false; //是否启用动画事件
    this.videoServer = ""; //视频流媒体
    this.videoCam = ""; //摄像机
    //动作的事件类型，0：打开超链接，1、弹出网页 2：播放视频，3，开关切换，4，变量写值 5，打开监控窗口
    this.BindEventType = "0"; //动作事件类型编号
    // this.MouseEventType = "click";
    this.HyperLinks = "http://www.ib-cloud.cn";

    // this.VarColour = "未绑定变量";
    // this.EnableChangeColour = false;
    // this.VarAction = "未绑定变量";

    //写值动作
    this.SetVarValue = "0";
    this.setVar = ""; //写值变量
    this.setName = ""; //写值描述

    //开关控制
    this.switchName = "";
    this.switchVar = "";



    this.AnimationVar = ""; //动画变量
    //状态变色
    this.EaableAlarmColor = false;
    // this.AlarmColor="";
    // this.AlarmValue="";

    //报警可见
    this.EaableVisiable = false;
    //  this.VisableVar="";
    this.VisableValue = "";


    this.Objid = ""; //模型构件id
    // this.defaultColor = 0xff313131; //black
    // this.warningColor = 0xffffee2b; //yellow
    // this.warningValue = -1;
    this.watchParameters = []; // array of threeDModelWatchParameter Object.
    this.watchColorParameters = [];
    this.drawlines = []; //标注引线
    // this.chartType = '';
    // this.watchChartParameters = [];
    this.isRealTime = 0;
    this.system = ""; //是那个操作系统
    this.description = ""; //描述
    // this.EnableAreaLink=false;
    // this.AeraLinkVar="";
    // this.alarmPhone="";
    this.icon = ''; //图标
    this.iconColor = "#FAD400";
    this.DiagramID = "";

    this.devicePanel = ""; //设备面板

    this.labelType = "1"; //1是普通标签 2是引线标签

    this.floor = "";
  }
}
class bimCamera {
  constructor() {
    // this.EnableDrawLine = false;
    // this.EnableActionBind = false; //鼠标事件
    // this.EnableAnimationBind = false; //是否启用动画事件
    this.videoServer = ""; //视频流媒体
    this.videoCam = ""; //摄像机
    //动作的事件类型，0：打开超链接，1、弹出网页 2：播放视频，3，开关切换，4，变量写值 5，打开监控窗口
    // this.BindEventType = "0"; //动作事件类型编号
    // this.MouseEventType = "click";
    // this.HyperLinks = "http://www.ib-cloud.cn";

    // this.VarColour = "未绑定变量";
    // this.EnableChangeColour = false;
    // this.VarAction = "未绑定变量";

    //写值动作
    // this.SetVarValue = "0";
    // this.setVar = ""; //写值变量
    // this.setName = ""; //写值描述

    //开关控制
    // this.switchName = "";
    // this.switchVar = "";



    // this.AnimationVar = ""; //动画变量
    //状态变色
    // this.EaableAlarmColor = false;
    // this.AlarmColor="";
    // this.AlarmValue="";

    //报警可见
    // this.EaableVisiable = false;
    //  this.VisableVar="";
    // this.VisableValue = "";
    this.pointid = '';

    this.Objid = ""; //模型构件id
    // this.defaultColor = 0xff313131; //black
    // this.warningColor = 0xffffee2b; //yellow
    // this.warningValue = -1;
    this.watchParameters = []; // array of threeDModelWatchParameter Object.
    // this.watchColorParameters = [];
    // this.drawlines = []; //标注引线
    // this.chartType = '';
    // this.watchChartParameters = [];
    // this.isRealTime = 0;
    // this.system = ""; //是那个操作系统
    this.description = ""; //描述
    // this.EnableAreaLink=false;
    // this.AeraLinkVar="";
    // this.alarmPhone="";
    // this.icon = ''; //图标
    // this.iconColor = "#FAD400";
    // this.DiagramID = "";

    // this.devicePanel = ""; //设备面板

    // this.labelType="1";//1是普通标签 2是引线标签

    this.floor = "";
  }
}
class energyData {
  constructor() {
    this.Energy = [{
      name: '',
      value: 0
    }, {
      name: '',
      value: 0
    }, {
      name: '',
      value: 0
    }, {
      name: '',
      value: 0
    }, {
      name: '',
      value: 0
    }, {
      name: '',
      value: 0
    }]; //本期数据
    // this.Energy1 = [{
    //   name: '',
    //   value: ''
    // }, {
    //   name: '',
    //   value: ''
    // }, {
    //   name: '',
    //   value: ''
    // }, {
    //   name: '',
    //   value: ''
    // }]; //环比数据
    // this.Energy2 = [{
    //   name: '',
    //   value: ''
    // }, {
    //   name: '',
    //   value: ''
    // }, {
    //   name: '',
    //   value: ''
    // }, {
    //   name: '',
    //   value: ''
    // }]; //同比数据
  }
}
class bimCameraStatus {
  constructor() {
    this.one = {
      "name": "persp",
      "position": {
        "x": -12093.730455383635,
        "y": -30101.085429880597,
        "z": 48666.7082378729
      },
      "target": {
        "x": -11715.62977867292,
        "y": 9729.955709661943,
        "z": -40158.92989290021
      },
      "up": {
        "x": 0,
        "y": -0.0000036732048671598713,
        "z": 0.9999999999932537
      },
      "version": 1
    };
    this.kongtiao = {
      "name": "persp",
      "position": {
        "x": -22350.61467389183,
        "y": -19832.021704803097,
        "z": 58675.86596896503
      },
      "target": {
        "x": -4895.650013924147,
        "y": 228.58103572910173,
        "z": -34969.985061789695
      },
      "up": {
        "x": 0,
        "y": -0.0000036732048671598713,
        "z": 0.9999999999932537
      },
      "version": 1
    };
    this.xinfeng = {
      "name": "persp",
      "position": {
        "x": -32080.88839038983,
        "y": -7792.9662837561455,
        "z": 22481.81614291598
      },
      "target": {
        "x": 27060.780607961202,
        "y": 39046.75540482283,
        "z": -39040.152699074744
      },
      "up": {
        "x": 0,
        "y": -0.0000036732048671598713,
        "z": 0.9999999999932537
      },
      "version": 1
    };
    this.chuanganqi = {
      "name": "persp",
      "position": {
        "x": -10954.468641417021,
        "y": -32774.47062374538,
        "z": 43366.85107994739
      },
      "target": {
        "x": 4870.3266599317285,
        "y": 29928.246857106114,
        "z": -29397.108830877998
      },
      "up": {
        "x": 0,
        "y": -0.0000036732048671598713,
        "z": 0.9999999999932537
      },
      "version": 1
    }
    this.main = {
      "name": "persp",
      "position": {
        "x": -81144.50958808108,
        "y": 30270.3441777586,
        "z": 13050.779870320233
      },
      "target": {
        "x": 2923.247159929271,
        "y": -16266.67919164007,
        "z": 8125.2915512258005
      },
      "up": {
        "x": 0,
        "y": -0.0000036732048671598713,
        "z": 0.9999999999932537
      },
      "version": 1
    }
    this.two = {
      "name": "persp",
      "position": {
        "x": -15101.889886070074,
        "y": -25702.94069884572,
        "z": 50684.224347517455
      },
      "target": {
        "x": -14238.811032726777,
        "y": 12313.086114137235,
        "z": -37697.784592373486
      },
      "up": {
        "x": 0,
        "y": -0.0000036732048671598713,
        "z": 0.9999999999932537
      },
      "version": 1
    }
    this.shebei = {
      "name": "persp",
      "position": {
        "x": -13947.12712297066,
        "y": -30553.432396377517,
        "z": 56022.07984218837
      },
      "target": {
        "x": -13462.914064649287,
        "y": 20455.2457406103,
        "z": -25557.470269557154
      },
      "up": {
        "x": 0,
        "y": -0.0000036732048671598713,
        "z": 0.9999999999932537
      },
      "version": 1
    }
    this.three = {
      "name": "persp",
      "position": {
        "x": -15121.980247012187,
        "y": -26006.98027685341,
        "z": 55600.76558190543
      },
      "target": {
        "x": -14748.274685537932,
        "y": 13360.478815079268,
        "z": -32191.06896323773
      },
      "up": {
        "x": 0,
        "y": -0.0000036732048671598713,
        "z": 0.9999999999932537
      },
      "version": 1
    }
    this.four = {
      "name": "persp",
      "position": {
        "x": -14409.418024948385,
        "y": -32396.991013503273,
        "z": 54866.626848270076
      },
      "target": {
        "x": -13925.204966627014,
        "y": 18611.687123484546,
        "z": -26712.923263475415
      },
      "up": {
        "x": 0,
        "y": -0.0000036732048671598713,
        "z": 0.9999999999932537
      },
      "version": 1
    }


  }
}

class User {
  constructor() {
    this.UserIdent = '';
    this.UserName = '';
    this.PassWord = '123456';
    this.BeginTime = '';
    this.EndTime = '';
    this.Status = '1';
    this.WriteLevel = '';
    this.ReadLevel = '';
    this.PasswordSalt = '';
    this.PasswordHash = '';
    this.PhoneNumber = '';
    this.Name = '';
    this.Email = '';
    this.DeptId="";
    this.WeiXin="";
  }
}
class TaskJob{
  constructor(){
    this.JOB_NAME='';
    this.JOB_GROUP="";
    this.DESCRIPTION="";
    this.RunCount=0;
    this.Job_Status=-1;
    this.Cron='';
    this.StartTime='';
    this.EndTime='';
    this.PreTime='';
    this.NextTime="";
    this.Job_Trigger="";
    this.Job_Class="";
  }
}

export {
  Device,
  alarm,
  bimParamter,
  energyData,
  User,
  bimCamera,
  bimCameraStatus,
  TaskJob
}
