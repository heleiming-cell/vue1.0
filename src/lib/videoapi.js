let VAPI = {
  PtzAction(_this, token, action,host,session) {
    let ptzcmd = "token=" + token + "&action=" + action + "&speed=0.5";
    console.log("ptzcmd", ptzcmd);
    _this.$ajax.get(host+"/api/v1/Ptz?" + ptzcmd + "session=" + session).then((result) => {
      console.log(result);
    }).catch((err) => {
      console.log(err);
    });
  },

}
export default VAPI;