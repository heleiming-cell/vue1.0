let RequstData = {
  BatchDefinitionId: "",
  ClientId: "",
  GetHistory: "",
  LifeSpan: "",
  realTime: false,
  RequestItems: [],
}
let CMD = {
  write(_this, variable, val) {
    _this.$ajax.get(_this.$URL + '/ioServer/Write', {
      params: {
        v: variable,
        value: val,
      }
    }).then((result) => {
      if (result.status === 200 && result.data.success) {}
    }).catch((err) => {
      console.log(err);
    });
  },
  Read(_this, config) {
    _this.$ajax.post(_this.$URL + '/ioServer/ParameterRead', _this.$QS.stringify({
      vars: JSON.stringify(config).toString()
    })).then((result) => {
      if (result.status === 200 && result.data.success) {
        if (result.data.data) {
          _this.panelParamter = result.data.data;
          Object.assign(_this.panelParamter, result.data.data);
        }
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  signalrVarSubscribe(_this, varable, hub, ClientId, batchid) {
    if (ClientId)
      RequstData.ClientId = ClientId;
    if (batchid)
      RequstData.BatchDefinitionId = batchid;

    RequstData.RequestItems = [];
    if (varable.length > 0) {
      varable.forEach((v, i) => {
        let data = v.split(':');
        RequstData.RequestItems.push({
          ID: v,
          IOSvrKey: data[0],
          ChlKey: data[1],
          CtrlKey: data[2],
          VarKey: data[3]
        });
      });
      if (_this.$store.state.signalr.connection) {
        // let scadaHub = _this.connection.createHubProxy('scadahub');

        _this.$store.state.signalr.scadaHub.invoke('Subscribe', JSON.stringify(RequstData));
      }

    }
  },
  signalrVarSubscribeBIM(_this, varable, hub, ClientId, batchid) {
    if (ClientId)
      RequstData.ClientId = ClientId;
    if (batchid)
      RequstData.BatchDefinitionId = batchid;

    RequstData.RequestItems = [];
    if (varable.length > 0) {
      varable.forEach((v, i) => {
        if (Object.keys(v).length > 0) {
          let data = v[Object.keys(v)[0]].split(':');
          RequstData.RequestItems.push({
            ID: Object.keys(v)[0],
            IOSvrKey: data[0],
            ChlKey: data[1],
            CtrlKey: data[2],
            VarKey: data[3]
          });
        }

      });
      if (_this.$store.state.signalr.connection) {
        // let scadaHub = _this.connection.createHubProxy('scadahub');

        _this.$store.state.signalr.scadaHub.invoke('Subscribe', JSON.stringify(RequstData));
      }
    }
  },
  signalrVarSubscribePanel(_this, varable, ClientId, batchid) {
    if (ClientId)
      RequstData.ClientId = ClientId;
    if (batchid)
      RequstData.BatchDefinitionId = batchid;

    RequstData.RequestItems = [];
    if(varable)
    {
      Object.keys(varable).forEach((v,i)=>{
        let data=varable[v].split(':');
        RequstData.RequestItems.push({
          ID: v,
          IOSvrKey: data[0],
          ChlKey: data[1],
          CtrlKey: data[2],
          VarKey: data[3]
        });
      });
    }
    if (RequstData.RequestItems.length > 0) {
      
      if (_this.$store.state.signalr.connection) {
        // let scadaHub = _this.connection.createHubProxy('scadahub');

        _this.$store.state.signalr.scadaHub.invoke('Subscribe', JSON.stringify(RequstData));
      }
    }
  },
  unSubscribe(_this, ClientId, batchid) {
      if (_this.$store.state.signalr.connection) {
        // let scadaHub = _this.connection.createHubProxy('scadahub');
        _this.$store.state.signalr.scadaHub.invoke('UnSubscribeBatch',ClientId,batchid);
      }
    },
  signalrWrite(_this, varable, val) {
    // RequstData.RequestItems = [];
    let data = varable.split(':');
    // RequstData.RequestItems.push({
    //   ID: varable,
    //   IOSvrKey: data[0],
    //   ChlKey: data[1],
    //   CtrlKey: data[2],
    //   VarKey: data[3],
    //   Value: val,
    //   Level: 0,
    //   Area: ''
    // });
    let params = {
      IOSvrKey: data[0],
      ChlKey: data[1],
      CtrlKey: data[2],
      VarKey: data[3],
      Value: val,
      Level: 0,
      Area: ''
    }
    if (_this.$store.state.signalr.connection) {
      _this.$store.state.signalr.scadaHub.invoke('WriteVarValue', data[0], JSON.stringify(params));
    }
    // if(hub&&hub.invoke)
    // hub.invoke('WriteVarValue',data[0],JSON.stringify(RequstData));
  }
}
export default CMD;
