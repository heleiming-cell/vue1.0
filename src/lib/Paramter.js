class Paramter{
    constructor()
    {
        this.Name="";
        this.systemCategory=0;
        this.Lating="";
       
        this.ActionType="";

        //是否启用
        this.EnableAlarmColor=false;//是否启用报警变色
        this.EnableVisble=false;//是否启用联动可见
        this.EnableActionEvent=false;//启用鼠标事件
        this.EnableAnimation=false;//是否启用动画

        this.GlobleRefresh=false;//是否全局刷新

        //启用播放
        this.server='';//云服务器
        this.cam='';//摄像机


        this.LinkUrl="";//超链接地址
        this.DiagramID="";//组态图ID

        this.VisbleVar="";//联动可见绑定的变量
        this.VisbleValue=""//联动可见的值

        this.AlarmValue="";//触发报警的变量值
        this.AlarmVar="";//报警管理的变量
        this.AlarmDefaultColor="";//默认的报警颜色
        this.AlarmColor="#F8130C";//报警的颜色
        this.AnimationVar="";//动画变量
        this.SwitchVar="";//开关控制绑定的变量
        this.SwitchName='';
        this.WriteVar="";//变量写值绑定的变量
        this.WriteValue="";//变量写值得值
        this.WriteName="";
        this.WatchParams=[];//监控面板值数组

        //图标配置
        this.iconClass="el-icon-search";
        this.iconColor='#B5910C';
        this.iconBackColor='#B5910C';
    }
}


export default {Paramter};