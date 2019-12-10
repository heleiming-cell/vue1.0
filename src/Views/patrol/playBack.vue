<template>
<el-row class="box">
    <el-container class="h100">
        <el-aside width="350px">
            <el-form>
                <el-form-item label="起止时间:">
                    <el-date-picker v-model="valueTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getTypeList">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="类型选择:">
                    <el-select v-model="Type" placeholder="请选择" clearable @change="selectTypeID">
                        <el-option v-for="item in selectType" :key="item.ID" :label="item.Name" :value="item.ID">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-row class="tackBox">
                <el-col class="task">
                    <ul>
                        <li v-for="(item,index) in taskList.list" :key="item.InspectSheetID" @click="getTaskInfor(item.detailList,index)" :class="{ checktask:index==current}">
                            <div>{{item.name}}</div>
                            <div>巡检点个数：{{item.count}}</div>
                        </li>
                    </ul>
                </el-col>
            </el-row>
        </el-aside>
        <el-main>
            <div id="lineMap">
                <div class="input-item">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>轨迹回放控制</span>
                        </div>
                        <div class="item">
                            <el-button round @click="startAnimation">开始动画</el-button>
                            <el-button round @click="pauseAnimation">暂停动画</el-button>
                            <el-button round @click="resumeAnimation">继续动画</el-button>
                        </div>
                        <div class="item">
                            <span>动画速度(km/h)：</span>
                            <el-input-number round v-model="speed" :step="100" @change="handleChange" :min="100" :max="600" label="描述文字"></el-input-number>
                        </div>
                    </el-card>
                </div>
            </div>
        </el-main>
    </el-container>
</el-row>
</template>

<script>
import icon1 from '@/static/images/point.png'
import qishi from '@/static/images/kaishi.png'
import jieshu from '@/static/images/jieshu.png'
import weixun from '@/static/images/weixun.png'
import person from '@/static/images/person.svg'
// import {
//     GetAllTask,
//     GetTaskDetails,
//     GetPointDetails,
//     GetInspectionDetails
// } from '@/api/asset'
// import {SysSheetGetPointTrail,} from '@/api/patrol'
export default {
    name: 'patrolPlayBack',
    data() {
        return {
            valueTime: '', //选择时间
            taskList: [], //巡检列表  
            current: -1, //选中的列
            map: null,
            infoWindow: null,
            InspectSheet: '',
            selectType: [{
                    Name: '巡检部门',
                    ID: 'department'
                },
                {
                    Name: '巡检任务',
                    ID: 'sheet'
                },
                {
                    Name: '巡检区域',
                    ID: 'area'
                },
                {
                    Name: '巡检人员',
                    ID: 'user'
                }
            ],
            Type: '',
            marker1: null,
            lineArr: [],
            speed: 200,
        }
    },
    mounted() {
        this.getDate()
        this.mapInstall()
    },
    methods: {
        // 获取当前日期和30天之前的日期
        getDate() {
            let myDate = new Date()
            let EndTime = myDate.toLocaleDateString() //获取当前日期
            let lw = new Date(myDate - 1000 * 60 * 60 * 24 * 30) //前30天
            let StartTime = lw.toLocaleDateString()
            this.valueTime = [StartTime, EndTime]
        },
        // 初始化加载地图
        mapInstall() {
            this.map = new AMap.Map('lineMap', {
                expandZoomRange: true,
                zoom: 17,
                zooms: [4, 20],
                center: [104.020905, 30.564474],
                buildingAnimation: true,
                defaultCursor: 'default',
            })
        },
        // 选择类型
        selectTypeID(val) {
            this.Type = val
            this.getTypeList()
        },
        // 获取时间段某种类型的列表
        getTypeList() {
            let data = {
                type: this.Type,
                start: this.valueTime[0] + ' 00:00:00',
                end: this.valueTime[1] + ' 23:59:59'
            }
            this.$ajax.get(this.$DMURL+'/SysSheet/GetPointTrail',{
                params:data
            }).then(result => {
                if (result.status === 200 && result.data.success) {
                    this.taskList = result.data.data;
                    this.map.clearMap();
                    this.current = -1
                }
            });
        },
        //点击任务获取任务详情
        getTaskInfor(detailList, index) {
            this.current = index
            let path = []
            let lineArr = []
            this.map.clearMap();
            detailList.forEach((item, i) => {
                if (item.pointLat && item.pointLng) {
                    path.push(item)
                }
            });
            if (path.length > 0) {
                var marker1
                path.forEach((item, i) => {
                    lineArr.push([item.pointLng, item.pointLat])
                    if (i == 0) {
                        this.mapAddMarker(item.pointLat, item.pointLng, qishi, item.sheetPointId)
                        let personIcon = new AMap.Icon({
                            size: new AMap.Size(40, 50),
                            image: person,
                            imageOffset: new AMap.Pixel(0, 0),
                            imageSize: new AMap.Size(30, 30),
                        })

                        marker1 = new AMap.Marker({ //添加自定义点标记
                            position: [item.pointLat, item.pointLng], //基点位置
                            offset: new AMap.Pixel(-15, -15), //相对于基点的偏移位置
                            icon: personIcon,
                            draggable: false //设置图标是否可以移动
                        });
                        marker1.setMap(this.map)
                    } else if (i == path.length - 1) {
                        this.mapAddMarker(item.pointLat, item.pointLng, jieshu, item.sheetPointId)
                    } else {
                        this.mapAddMarker(item.pointLat, item.pointLng, icon1, item.sheetPointId)
                    }
                })
                var polyline = new AMap.Polyline({
                    path: lineArr,
                    showDir: true,
                    dirColor: 'pink',
                    strokeColor: '#336688', // 线颜色
                    strokeOpacity: 0,
                    strokeWeight: 8 // 线宽
                })
                var passedPolyline = new AMap.Polyline({
                    map: this.map,
                    // path: lineArr,
                    strokeColor: "#336688", //线颜色
                    // strokeOpacity: 1,     //线透明度
                    strokeWeight: 8, //线宽
                    showDir: true,
                    // strokeStyle: "solid"  //线样式
                });
                marker1.on('moving', function (e) {
                    passedPolyline.setPath(e.passedPath);
                });
                marker1.moveAlong(lineArr, 200);

                // polyline.setMap(this.map)
                this.map.setFitView([polyline]) // 缩放地图到合适的视野级别级点位置
            }
        },
        // 地图中添加图标
        mapAddMarker(lat, long, icon, id) {
            let _this = this
            let pointIcon = new AMap.Icon({
                size: new AMap.Size(40, 50),
                image: icon,
                imageOffset: new AMap.Pixel(0, 0),
                imageSize: new AMap.Size(30, 30),
            })
            let marker = new AMap.Marker({ //添加自定义点标记
                position: new AMap.LngLat(long, lat), //基点位置
                offset: new AMap.Pixel(-15, -15), //相对于基点的偏移位置
                icon: pointIcon,
                draggable: false //设置图标是否可以移动
            });
            marker.id = id
            _this.map.add(marker)
        },
        // 地图中的弹框
        createInfoWindow(title, content) {
            var info = document.createElement("div");
            info.className = "custom-info input-card content-window-card";
            //可以通过下面的方式修改自定义窗体的宽高
            //info.style.width = "400px";
            // 定义顶部标题
            var top = document.createElement("div");
            var titleD = document.createElement("div");
            var closeX = document.createElement("span");
            top.className = "info-top";
            titleD.innerHTML = title;
            closeX.className = "el-icon-close";
            closeX.onclick = this.closeInfoWindow;

            top.appendChild(titleD);
            top.appendChild(closeX);
            info.appendChild(top);

            // 定义中部内容
            var middle = document.createElement("div");
            middle.className = "info-middle";
            middle.innerHTML = content;
            info.appendChild(middle);

            // 定义底部内容
            var bottom = document.createElement("div");
            bottom.className = "info-bottom";
            bottom.style.position = 'relative';
            bottom.style.top = '0px';
            bottom.style.margin = '0';
            var sharp = document.createElement("img");
            sharp.src = "https://webapi.amap.com/images/sharp.png";
            bottom.appendChild(sharp);
            info.appendChild(bottom);
            return info;
        },
        // 关闭地图中弹框
        closeInfoWindow() {
            this.map.clearInfoWindow();
        },
        // 开始动画
        startAnimation() {
            this.marker1.moveAlong(this.lineArr, this.speed)
        },
        // 暂停动画
        pauseAnimation() {
            this.marker1.pauseMove()
        },
        // 继续动画
        resumeAnimation() {
            this.marker1.resumeMove()
        },
        handleChange(val) {

        }

    }
}
</script>

<style lang="less">
.box {
    font-size: 12px;
    height: calc(100% - 115px);
}
.task>ul>.checktask {
    color: #3FBEC3;
}

.header {
    line-height: 35px;
    color: #1F8DA7;
    padding: 0 20px;
    font-size: 16px;
}

.check-time {
    padding: 20px 0;
}

.task {
    height: calc(100vh - 300px);
    overflow-y: scroll;
}

.task>ul {
    margin: 0;
    padding: 0;
}

.task>ul>li {
    display: flex;
    width: 80%;
    height: 35px;
    padding: 0 15px;
    justify-content: space-between;
    align-items: center;
    color: white;
    font-size: 14px;
    border-bottom: solid 1px #64768a;
    cursor: pointer;
}

#lineMap {
    width: 100%;
    height: calc(100vh - 180px);
    /* border: solid 1px #1A2D4F; */
    position: relative;

    .input-item {
        position: absolute;
        bottom: 10px;
        right: 10px;
        z-index: 100;

        .el-card__body {
            padding: 0 10px;
        }

        .item {
            margin: 10px 0;
        }
    }
}

.content-window-card {
    position: relative;
    box-shadow: none;
    bottom: 0;
    left: 0;
    width: auto;
    padding: 0;
    width: 220px;
}

.custom-info {
    border: solid 1px #1D2D56;
}

div.info-top {
    position: relative;
    background: none repeat scroll 0 0 #020C20;
    border-bottom: 1px solid #01506A;
    border-radius: 5px 5px 0 0;
}

div.info-top div {
    display: inline-block;
    color: #ffffff;
    font-size: 14px;
    font-weight: bold;
    line-height: 31px;
    padding: 0 10px;
}

div.info-top span {
    position: absolute;
    top: 10px;
    right: 10px;
    transition-duration: 0.25s;
}

div.info-top span:hover {
    cursor: pointer;
}

div.info-middle {
    font-size: 12px;
    padding: 10px 6px;
    /* line-height: 20px;  */
    background: #1D2D56;
    color: #ffffff;
}

div.info-bottom {
    height: 0px;
    width: 100%;
    clear: both;
    text-align: center;
}

div.info-bottom img {
    position: relative;
    z-index: 104;
}

span {
    margin-left: 5px;
    font-size: 11px;
}

.info-middle img {
    float: left;
    margin-right: 6px;
}

.InspectSheet {
    padding: 0;
    margin: 0;
}
</style>
