let GIS = {
  LoadMaker(_this, callback) {
    _this.$ajax.get(_this.$URL + '/gis/GetAllPoints').then((result) => {
      if (result.status === 200 && result.data.success) {
        if (result.data.data && result.data.data.length > 0) {
          _this.map.clearMap();
          result.data.data.forEach((v, i) => {
            let obj = JSON.parse(v.ActionConfig);
            // if(obj.GlobleRefresh&&_this.marker)
            // {
            //   _this.marker.set(obj.AnimationVar,obj);
            // }
            this.CreateSimpleMarker(_this, obj, callback);
          });
        }
      }
    }).catch((err) => {
      _this.$message.error(err);
    });
  },
  CreateSimpleMarker(_this, markerconfig, callback) {
    return new Promise((resolve, reject) => {
      AMapUI.define("polyfill/require/require-css/css!plug/ext/font-awesome/css/font-awesome", [], function () {});
      AMapUI.loadUI(['overlay/AwesomeMarker', 'overlay/SimpleMarker'],
        function (AwesomeMarker, SimpleMarker) {
          let icon = markerconfig.iconClass.split(' ').length > 1 ? markerconfig.iconClass : '';
          // console.log(markerconfig.iconClass)
          let marker = new AwesomeMarker({
            //  awesomeIcon: icon ? icon.split(' ')[1].substring(3) : '',
            //   awesomeIcon: 'fa fa-plus',
            getClassnamesOfAwesomeIcon: function () {
              return markerconfig.iconClass
            },
            iconLabel: {
              style: {
                color: markerconfig.iconColor,
                fontSize: '14px'
              }
            },
            map: _this.map,
            position: JSON.parse(markerconfig.Lating),
            title: markerconfig.Name
          });
          marker.setExtData(markerconfig);

          AMap.event.addListener(marker, "click", function (e) {
            if (_this.$route.fullPath !== "/setUp/gisset") { //运行状态

              callback(e.target.getExtData());


              if (markerconfig.GlobleRefresh) {
                _this.marker.set(markerconfig.AnimationVar, {
                  marker: marker,
                  config: markerconfig
                }); //注意此处 一个报警关联变量对应一个marker
              }

            } else //编辑
            {
              _this.paramEdit = true;
              if (e.target.getExtData()) {
                _this.gis = e.target.getExtData();
              }
              _this.Lating = "[" + e.target.getPosition() + "]";


              marker.on('rightclick', function (e) {
                if (_this.$route.fullPath === "/setUp/gisset") {
                  _this.$ajax.get(_this.$URL + '/gis/DeleteMarkers?Lating=[' + e.target.getPosition() + "]").then((result) => {
                    if (result.status === 200 && result.data.success) {
                      _this.map.remove(marker);
                    }
                  }).catch((err) => {

                  });
                }
              });
            }

          });


          resolve();
        });

    });

  }
}

class RouteMng {
  createRouter(data, _this) {
    if (data && data.length > 0) {
      data.forEach((v, i) => {
        let temp;
        if (v.config) {
          let config = JSON.parse(v.config);
          let route = config.route;
          let tpath="";
          if(route.component)
           tpath = route.component.replace("@/components/", "");
          temp = {
            path: route.path,
            name: route.name,
            component: () =>
              import('@/components/' + tpath + '.vue'),
            title: route.title,
            cpath: tpath,
            children: [],
          }
        }
        if (v.children && v.children.length > 0) {
          v.children.forEach((val, i) => {
            if (temp && val.config) {
              let config = JSON.parse(v.config);
              let route = config.route;
              let tpath="";
              if(route.component)
               tpath = route.component.replace("@/components/", "");
              temp.children.push({
                path: route.path,
                name: route.name,
                component: () =>
                  import('@/components/' + tpath + '.vue'),
                title: route.title,
                cpath: tpath,
                children: [],
              })
            } else if (!v.config && val.config) {
              let config = JSON.parse(val.config);
              let route = config.route;
              if (route && route.component) {
                let tpath = route.component.replace("@/components/", "");
                _this.vueroute.push({
                  path: route.path,
                  name: route.name,
                  component: () =>
                    import('@/components/' + tpath + '.vue'),
                  title: route.title,
                  cpath: tpath,
                  children: [],
                })
              }
            }
          })
        }
        if (temp)
          _this.vueroute.push(temp);

      })
    }
  }
  resolveRouter(routes, _this) {
    if (routes && routes.length > 0) {
      routes.forEach((r, i) => {
        _this.routers.push({
          name: r.title,
          path: r.name,
          //path:{name:r.name,title:r.title,path:r.path,component}
        });
        if (r.children && r.children.length > 0) {
          this.resolveRouter(r.children, _this); //递归
        }
      });
    }
  }
}

function hexToRgba(str, n) {
  //十六进制颜色值的正则表达式
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  var sColor = str.toLowerCase();
  //十六进制颜色转换为RGB格式  
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      var sColorNew = "#";
      for (var i = 1; i < 4; i += 1) { //例如：#eee,#fff等
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //处理六位颜色值  
    var sColorChange = [];
    for (var i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
    }
    // return "rgba(" + sColorChange.join(",") + "," + n + ")";
    return sColorChange.join(",") + "," + n;
  } else {
    return sColor;
  }
}


class SystemSelect {
  loadSystemArea(_this, prop) {
    _this.$ajax.get(_this.$URL + '/config/GetSelectArea').then((result) => {
      if (result.status === 200 && result.data.success) {
        _this[prop] = result.data.data;
      }
    }).catch((err) => {
      console.log(err);
    });
  }
  loadSystemDept(_this, prop) {
    _this.$ajax.get(_this.$URL + '/config/GetSelectDept').then((result) => {
      if (result.status === 200 && result.data.success) {
        _this[prop] = result.data.data;
      }
    }).catch((err) => {
      console.log(err);
    });
  }
  loadDeviceCategory(_this, prop) {
    _this.$ajax.get(_this.$URL + '/config/GetSelectCategory').then((result) => {
      if (result.status === 200 && result.data.success) {
        _this[prop] = result.data.data;
      }
    }).catch((err) => {
      console.log(err);
    });
  }
}
class Tree {
  deleteNodes(nodes, _this, prop) {
    let __this = this;
    if (nodes && nodes.length > 0) {
      nodes.forEach((v, i) => {
        for (let index = _this[prop].length - 1; index >= 0; index--) {
          if (v.key === _this[prop][index].key) {
            _this[prop].splice(index, 1);
            break;
          }
          if (_this[prop][index].label === '照明系统' && _this[prop][index].children && _this[prop][index].children.length > 0) {
            __this.deleteNodes(_this[prop][index].children, _this, prop);
          }
        }
      });
    }
  }
  loadTreeNodes(_this, url, prop,base) {
    _this.$ajax.get((base||_this.$URL) + url).then((result) => {
      if (result.status === 200 && result.data.success) {
        _this[prop] = result.data.data;
      }
    }).catch((err) => {

    });
  }
  loadNodeConfig(_this, node, status, url) //此处 node menuroute icon diagramid 属性名称要统一
  {
    if (status) {
      _this["node"] = node;
      if (_this.node.menuid && _this.$refs.tree.getCheckedNodes().length === 1) {
        _this.$ajax.get(_this.$URL + url, {
          params: {
            id: _this.node.key,
            menuid: _this.node.menuid
          }
        }).then((result) => {
          if (result.status === 200 && result.data.success) {
            let config = JSON.parse(result.data.data[0].config);
            //  this.menuCategory = config.Menuid;
            _this.menuRoute = config.route
            _this.icon = config.icon,
              _this.digramID = config.digramid
          }
        }).catch((err) => {

        });
      } else {
        _this.menuRoute = '';
        _this.icon = '';
        _this.digramID = '';
      }
    } else {
      _this.node = null;
      _this.menuRoute = '';
      _this.icon = '';
      _this.digramID = '';
    }
  }
  deleteNodes(_this, url) { //''
    // let _this = this;
    let nodes = _this.$refs.tree.getCheckedNodes();
    let ids = [];
    if (nodes && nodes.length > 0) {
      nodes.forEach((v, i) => {
        if (v.key && v.menuid) //排除根节点
        {
          ids.push(v.key + "|" + v.menuid);
        }
      });
    }
    if (ids.length > 0) {
      _this.$ajax.get(_this.$URL + url, {
        params: {
          id: ids
        }
      }).then((result) => {
        if (result.status === 200 && result.data.success) {
          _this.$message({
            type: 'success',
            message: '删除成功'
          });
          _this.node = null;
          nodes.forEach((v, i) => {
            let node = _this.$refs.tree.getNode(v);
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.key === v.key);
            children.splice(index, 1);

          });
        }
      }).catch((err) => {

      });
    }
  }
  saveNodeConfig(_this, url) {
    if (!_this.node) {
      _this.$message.error("请选择要编辑的节点");
      return;
    } else if (_this.node && !_this.node.menuid) {
      _this.$message.error("该节点不能编辑");
      return;
    }
    let data = {
      //  Menuid: this.menuCategory,
      route: _this.menuRoute,
      icon: _this.icon,
      digramid: _this.digramID
    }
    if (_this.node && _this.node.menuid)
      _this.$ajax.post(_this.$URL + url, _this.$QS.stringify({
        id: _this.node.key,
        menuid: _this.node.menuid,
        config: JSON.stringify(data)
      })).then((result) => {
        if (result.status === 200 && result.data.success) {
          _this.$message({
            message: '保存成功',
            type: 'success'
          });
        }
      }).catch((err) => {});
  }
}
export {
  GIS,
  RouteMng,
  hexToRgba,
  SystemSelect,
  Tree
};
