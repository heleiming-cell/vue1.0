let signalr={
    state:{
        connection:null,
        hubproxy:null,
        scadaHub:null,
        realData:null,
        isconnection:false,
    },
    mutations:{
        updateConnection(state,obj)
        {
            state.connection=obj.connection;
            state.hubproxy=obj.hubproxy;
            state.scadaHub=obj.scadaHub;
            state.isconnection=obj.isconnection;
        },
        updateRealData(state,obj)
        {
           state.realData=obj;
        }
      
    },
    getters:{},
    actions:{

    }
}
export default signalr;