

const alarm = {
  state:{
    showAlarmList:false,
    showAlarmLink:false,
    linksrc:'',
    linkvideo1:'',
    linkvideo2:'',
    linkinfo:null,
    alarmHData:[],
    alarmRData:[],
    alarmTotal:0,
  },
  mutations:{
    change_linkinfo(state,val)
    {
      state.linkinfo=val;
    },
    change_alarmlist(state,n)
    {
       state.showAlarmList=n;
    },
    change_alarmlink(state,n)
    {
       state.showAlarmLink=n;
    },
    change_linksrc(state,val)
    {
      state.linksrc=val;
    },
    change_linkvideo1(state,val)
    {
      state.linkvideo1=val;
    },
    change_linkvideo2(state,val)
    {
      state.linkvideo2=val;
    },
   
    updateAlarmData(state,data)
        {
            if(Object.keys(data).length==2)//历史
            {
                state.alarmHData=data.data;
                state.alarmTotal=data.data.length;
            }
            else{
                state.alarmTotal=state.alarmTotal+data.length;
                state.alarmRData= data;
                state.alarmHData=state.alarmHData.concat(data);
            }
        }
   
  }


}
export default alarm
