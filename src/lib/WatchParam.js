class WatchParamter{
    constructor()
    {
      this.WatchName="";//名称
      this.WatchVar="";//变量
      this.WathUnit="";//单位
      this.WathType="0";//显示类型  0显示值，1设定值 2状态值 3开关值
      this.WatchValue=0;
    }
}
class DrawLine{//引线参数数组
  constructor()
  {
    this.DrawLineName="";//名称
    this.DrawLineVar="";//变量
    this.DrawLineUnit="";//单位
    //this.WathType="0";//显示类型  0显示值，1设定值 2状态值 3开关值
    this.DrawLineValue=0;
  }
}
class WatchColorParam{
  constructor()
  {
    this.WatchColorValue="";
    this.WatchColor="";
  }
}
class DrawLineConfig{//添加标签列表时，弹出的dialog配置
  constructor(){
    this.DrawLineName="";//名称
    this.DrawLineVar="";//变量
    this.DrawLineUnit="";//单位
    //this.WathType="0";//显示类型  0显示值，1设定值 2状态值 3开关值
    this.DrawLineValue=0;
    this.showType="1";
    this.iconType="1";
    this.statusIcons=[];
    this.animationType="1";
    this.statusColors=[];
    this.Icon='';
    this.TriggerValue='';
  }
}
export {WatchParamter,WatchColorParam,DrawLine,DrawLineConfig} ;