

const app = {
  state:{
    loading_status:false,
    header_menu:null,
    fun_menu:[],
    other_menu:{functions:[]},
    // repair_man:[
    // ],//维修人员
    // equipment_type:[],//设备类型
    // equipment_area:[],//设备区域
    // equipment_dept:[],//设备部门
    Token:'',
    // gis_bim_icon:'',//gis和bim显示的图标
    // all_enums:'',//所有固定枚举类型,
    menus:[],
    funs:[],//
    firstArea:[],
    secondArea:[],
    src:"",
    // showAlarmList:false,
    // showAlarmLink:false,
    showHeader:true,
    activeFun:'',//系统菜单中激活的功能菜单
    username:'',//系统登录名
    routes:null,
    routename:'',//手机端切换
    systemid:'',//手机切换
    openAlarm:false,
  },
  mutations:{
    change_route(state,val)
    {
       state.routes=val;
    },
    change_routename(state,val)//手机端切换
    {
       state.routename=val;
    },
    change_systemid(state,val)//手机端切换
    {
       state.systemid=val;
    },
    change_activeFunc(state,val)
    {
      state.activeFun=val;
    },
    change_alarmlist(state,n)
    {
       state.showAlarmList=n;
    },
    change_alarmlink(state,n)
    {
       state.showAlarmLink=n;
    },
    change_showHeader(state,n)
    {
       state.showHeader=n;
    },
    change_funs(state,n)
    {
       state.funs=n;
    },
    change_FirstArea(state,n)
    {
       state.firstArea=n;
    },
    change_SecondArea(state,n)
    {
       state.secondArea=n;
    },
    change_src(state,n){
      state.src=n;
    },
    change_loading_status(state,n){
      state.loading_status = n
    },
    change_header_menu(state,n){
      state.header_menu = n;
    },
    chanage_fun_menu(state,n){
      state.fun_menu=n;
    },
    change_other_menu(state,n){
     // state.other_menu=[];//初始化
      state.other_menu = n
    },
    change_menu(state,n){
      // state.other_menu=[];//初始化
       state.menus = n
     },
    save_token(state,n){
      state.Token = n
    },
    change_username(state,val){
      state.username = val;
    },
    change_openAlarm(state,val){
      state.openAlarm = val;
    },
   
  }


}
export default app
