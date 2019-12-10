<template>
<div id="map">
    <!-- <el-dropdown class="icondropdown" trigger="click" @command="iconSelect">
        <el-button type="primary">
            <i class="el-icon-menu"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="0"> <i class="el-icon-location"></i></el-dropdown-item>
            <el-dropdown-item command="1"> <i class="el-icon-menu"></i></el-dropdown-item>
            <el-dropdown-item command="2"> <i class="el-icon-menu"></i></el-dropdown-item>
            <el-dropdown-item command="3"> <i class="el-icon-menu"></i></el-dropdown-item>
            <el-dropdown-item command="4"> <i class="el-icon-menu"></i></el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
    <paramter :gis="gis" :paramEditVisibale="paramEdit" @paramter="diaglogCose" @close="paramEdit=false"></paramter> -->
</div>
</template>

<script>
import loadjs from '@/lib/loadMap'
import paramter from '@/components/paramterbind'
import {GIS} from '@/lib/Common'
import GISConfig from '@/lib/Paramter'
export default {
    name: 'gisset',
    data() {
        return {
            map: null,
            iconType: -1,
            paramEdit: false,
            servers: [], //视频服务器 select,
            Lating: '',
            marker: null,
            gis: new GISConfig(),

        }
    },
   
    components: {
        'paramter': paramter
    },
    methods: {
        mapClick(e) {
            let _this = this;
            if (this.iconType === "0") {
                let marker = new AMap.Marker({
                    position: e.lnglat, // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    title: '北京',
                    draggable: true
                });
                AMap.event.addListener(marker, "click", function (e) {
                    _this.paramEdit = true;
                    _this.marker = marker; //点击设置全局marker,
                    _this.gis = new GISConfig(); //初始化配置
                    _this.gis.Lating = "[" + e.target.getPosition() + "]";
                    //_this.Lating = 

                });
                this.map.add(marker);
            }
        },
        iconSelect(index) {
            let _this = this;
            GIS.LoadMaker(this);
            // this.$ajax.get(this.$URL + '/gis/GetAllPoints').then((result) => {
            //     if (result.status === 200 && result.data.success) {
            //         if (result.data.data && result.data.data.length > 0) {
            //             result.data.data.forEach((v, i) => {
            //                 let obj = JSON.parse(v.ActionConfig);
            //                 AMapUI.loadUI(['overlay/AwesomeMarker', 'overlay/SimpleMarker'],
            //                     function (AwesomeMarker, SimpleMarker) {

            //                         let color = v.iconClass.split('').length > 0 ? v.iconClass : '';
            //                         let marker=new AwesomeMarker({
            //                             awesomeIcon: color.split(' ')[1].substring(3),
            //                             iconLabel: {
            //                                 style: {
            //                                     color: obj.iconColor,
            //                                     fontSize: '14px'
            //                                 }
            //                             },
            //                             map: _this.map,
            //                             position: JSON.parse(v.Lating),
            //                             title: v.Name

            //                         });
            //                     marker.extData=obj;
            //                     AMap.event.addListener(marker, "click", function (e) {
            //                     _this.paramEdit = true;
            //                     _this.Lating = "[" + e.target.getPosition() + "]";
            //                 });
            //                  marker.on('dblclick',function(e){
            //                         _this.$ajax.get(_this.$URL+'/gis/DeleteMarkers').then((result) => {
            //                             if(result.status===200&&result.data.success)
            //                             {

            //                             }
            //                         }).catch((err) => {

            //                         });
            //                     })

            //           });

            //             });

            //         }
            //     }
            // }).catch((err) => {
            //    this.$message.error(err);
            // });
            this.iconType = index;
        },
        //保存gis配置
        diaglogCose(value, gis) {
            if (gis) {
                this.$ajax.post(this.$URL + '/gis/SaveGisConfig', this.$QS.stringify(gis)).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.paramEdit = false;
                        this.map.remove(this.marker);
                        this.marker = null;
                        GIS.CreateSimpleMarker(this, gis);
                    }
                }).catch((err) => {
                    this.$message.error(err);
                });
            }
        }
    },
    mounted() {
     
        // this.map = new AMap.Map('map', {
        //     resizeEnable: true,
        //     zoom: 11,
        //     doubleClickZoom: true,
        //     // center: [116.397428, 39.90923],
        //     center: [121.349415, 31.231605],
        //     mapStyle: 'amap://styles/darkblue',
        //     viewMode: '3D',
        //     // features: ['bg', 'road', 'building','text']
        // });
        // document.oncontextmenu = function (e) {
        //     return false;
        // };
        // this.map.on('click', this.mapClick);
        // this.map.on('rightclick', this.mapRightClick);
   
    }
}
</script>

<style lang="less" scoped>
#map {
    height: 100%;
    position: relative;
}

.icondropdown {
    z-index: 1;
    position: absolute;
    right: 20px;
    top: 10px;
}

ul {
    background-color: #030d21 !important;

    >li {
        color: white;

        &:hover {
            background-color: rgb(1, 3, 8) !important;
        }
    }
}
</style>
