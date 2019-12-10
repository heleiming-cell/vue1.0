<template>
<el-row class="box" :gutter="10">
    <el-col :xs="24" :sm="24" :md="4" class="h100">
        <div class="menuheader">
            <div style="float:left"><span>任务列表</span></div>
            <div style="float:right">
                <span @click="addTask" class="pointer"><i class="iconfont icon-jia"></i></span>
                <!-- <span class="pointer" @click="deleteCategory" style="margin:0 5px"><i class="iconfont icon-shanchu"></i></span> -->
                <!-- <span @click="editCategory" class="pointer"><i class="iconfont icon-bianji"></i></span> -->
            </div>
        </div>
        <div class="taskList">
            <div class="task" :class="[selectTask&&item.js_task_name==selectTask.js_task_name?'active':'']" @click="selectedTask(item)" v-for="(item,i) in taskList" :key="i">{{item.js_task_name}}</div>
        </div>
    </el-col>
    <el-col :xs="24" :sm="24" :md="20" class="h100">
        <div class="menuheader">
            <div style="float:left"><span>设备终端</span></div>
        </div>
        <el-row class="device" :gutter="10">
            <el-col :xs="24" :sm="24" :md="6" style="height:100px" v-for="(item,i) in terminals" :key="i">
                <div class="deviceitem h100" @click="checkDevice(item)">
                    <div>{{item.js_endpoint_name}}</div>
                    <div style="margin-top:10px"><i class="iconfont icon-guangbo1"></i></div>
                    <div class="check">
                        <el-checkbox v-model="item.check" @change="devicechangebox($event,item)"></el-checkbox>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div class="music">
            <div class="menuheader">
                <div style="float:left"><span>音乐文件</span></div>
                <div style="float:right">
                    <span @click="addMusic" class="pointer"><i class="iconfont icon-jia"></i></span>
                    <span class="pointer" @click="deleteCategory" style="margin:0 5px"><i class="iconfont icon-shanchu"></i></span>

                </div>
            </div>
            <el-table :data="tableData" style="width: 100%" height="calc(100% - 36px)" @select-all="select" @select="select">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="ID" label="编号">
                </el-table-column>
                <el-table-column prop="Name" label="文件名称">
                </el-table-column>
                <el-table-column prop="Size" label="文件大小">
                    <template slot-scope="scope">
                        {{scope.row.Size}}M
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="UpDateTime" label="上传时间">
                </el-table-column> -->
                <!-- <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="downFile(scope.row)">下载</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <!-- <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination> -->
            <!-- <el-pagination :background="true" @current-change="handleCurrentChange" :page-size="size" layout="total, prev, pager, next" :total="total">
            </el-pagination> -->
        </div>
        <div class="play  center">
            <!-- <div class="center"> -->
            <!-- <el-tooltip content="播放模式" placement="top"> -->
            <el-button type="primary" @click="changeMode" circle><i class="iconfont" :class="icons[index]"></i></el-button>
            <!-- </el-tooltip> -->
            <el-button type="success" circle><i class="iconfont icon-bofang1" @click="play"></i></el-button>
            <el-button type="danger" circle><i class="iconfont icon-tingzhi1" @click="stop" ></i></el-button>
            <el-slider v-model="volumn" @change="changeVolum"></el-slider>
            <!-- </div> -->
        </div>
    </el-col>

    <el-dialog title="音乐选择" :visible.sync="categoryDialog" :modal-append-to-body="false" width="400px">
        <el-form label-width="100px" label-position="left" ref="panel">
            <el-form-item label="音乐目录">
                <el-select clearable style="width:100%" v-model="category" @change="changeCategory">
                    <el-option v-for="(item,i) in categorys" :label="item.CategoryName" :value="item.CategoryID" :key="i"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="音乐文件">
                <el-select clearable style="width:100%" filterable multiple v-model="music">
                    <el-option v-for="(item,i) in musics" :label="item.Name" :value="item.FullPath" :key="i"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" @click="selectMusic">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="任务编辑" :visible.sync="taskDialog" :modal-append-to-body="false" width="400px">
        <el-form label-width="100px" label-position="left" ref="panel">
            <el-form-item label="任务名称">
                <el-input v-model="taskName"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" @click="saveTask">确 定</el-button>
        </span>
    </el-dialog>

</el-row>
</template>

<script>
// import pagination from '../../common/pagination'
import {
    Tree
} from '@/lib/Common'
export default {
    name: "userManager",
    data() {
        return {
            tableData: [],
            taskName: '',
            categoryDialog: false,
            taskDialog: false,
            deleteItems: [],
            // ids: [],
            icons: ['icon-xunhuan1', 'icon-xunhuanbofang', 'icon-suijibofang'],
            index: 0,
            categorys: [],
            category: '',
            musics: [],
            music: [],
            terminals: [],
            taskList: [],
            selectTask: null,
            volumn: 0,
            devices: new Set(),
            ticks: null,
            update: false,
        }
    },
    mounted() {
        let _this = this;
        this.loadTerminals();
        this.loadMusicCategory();
        this.loadTasks();

    },
    methods: {
        addMusic() {
            this.category = "";
            this.musics = [];
            this.music = [];
            this.categoryDialog = true;
        },
        addTask() {
            this.taskName = "";
            this.taskDialog = true;
            this.update = false;
        },
        deleteCategory() {
            let _this = this;
            if (this.deleteItems.length === 0) {
                this.$message.error("请选择要删除的音乐文件");
                return;
            }
            this.deleteItems.forEach((v, i) => {
                _this.tableData.splice(_this.tableData.findIndex(item => item.FullPath === v.FullPath), 1)
            });

        },

        select(items) {
            this.deleteItems = items;

        },
        changeMode() {
            this.index++;
            if (this.index >= 3) {
                this.index = 0;
            }
        },
        loadMusicCategory() {
            this.$ajax.get(this.$URL + '/itc/GetSelectCategory').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.categorys = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        loadFiles(id) {
            this.$ajax.get(this.$URL + '/itc/GetFiles', {
                params: {
                    nodeid: JSON.stringify([id]),
                    page: 0,
                    size: 0,
                    keyword: '',
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.musics = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        changeCategory(id) {
            if (id) {
                this.loadFiles(id);
            } else {
                this.musics = [];
            }
        },
        selectMusic() {
            let _this = this;
            this.music.forEach((v, i) => {
                _this.musics.forEach((m, n) => {
                    if (v === m.FullPath) {
                        _this.tableData.push(m);
                        return;
                    }
                })
            });
            this.categoryDialog = false;
        },
        loadTerminals() {
            let _this = this;
            this.$ajax.get(this.$URL + '/itc/GetTerminals').then((result) => {
                if (result.status === 200) {
                    result.data.PARA.forEach((v, i) => {
                        Object.assign(v, {
                            check: false
                        });
                        _this.terminals.push(v);
                    });
                  
                }
            }).catch((err) => {
                console.log(err);
            });
        },

        checkDevice(item) {
            item.check = !item.check;
            if (item.check) {
                this.devices.add(item);
            } else {
                if (this.devices.has(item)) {
                    this.devices.delete(item);
                }
            }
        },
        saveTask() {
            let _this = this;
            let exist = false;
            if (!this.taskName) {
                this.$message.error("任务名称不能为空");
                return;
            }
            this.taskList.forEach((v, i) => {
                if (v.js_task_name == this.taskName) {
                    _this.$message.error("任务名称已存在");
                    exist = true;
                    return;
                }
            });
            if (!exist) {

                this.taskList.push({
                    js_task_name: this.taskName,
                    id: '',
                    js_task_hashkey: ''
                });
                this.taskDialog = false;
            }
        },
        play() {
            if (!this.selectTask) {
                this.$message.error("请选择要播放的任务");
                return;
            }
            if (this.devices.size === 0) {
                this.$message.error("请选择要播放的设备");
                return;
            }
            if (this.tableData.length === 0) {
                this.$message.error("请添加音乐文件");
                return;
            }
            if (this.selectTask.js_task_hashkey) {
                this.$message.error("任务不能重复播放");
                return;
            }
            let musics = [];
            this.tableData.forEach((v, i) => {
                musics.push("http://192.168.103.115:6003/mp3/" + v.FullPath);
            });
            let devices = [];
            this.devices.forEach((v, i) => {
                devices.push(v.js_endpoint_address);
            });
            this.$ajax.get(this.$URL + '/itc/Play', {
                params: {
                    taskName: this.selectTask.js_task_name,
                    mode: this.index,
                    musiclist: JSON.stringify(musics),
                    devicelist: JSON.stringify(devices),
                }
            }).then((result) => {
                if (result.status === 200) {
                    if (result.data.Result === 200) {
                        this.$message({
                            type: 'success',
                            message: '播放成功'
                        });
                    } else {
                        this.$message.error("播放失败");
                    }
                    this.update=true;
                    this.loadTasks();
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        stop() {
            if (!this.selectTask) {
                this.$message.error("请选择要停止的任务");
                return;
            }
            if (!this.selectTask.js_task_hashkey) {
                this.$message.error("改任务不支持停止");
                return;
            }
            this.$ajax.get(this.$URL + '/itc/Stop',{
                params:{
                    hash:this.selectTask.js_task_hashkey
                }
            }).then((result) => {
                if (result.status === 200) {
                    if (result.data.Result === 200) {
                        this.$message({
                            type: 'success',
                            message: '播放任务停止成功'
                        });
                    } else {
                        this.$message.error("播放任务停止失败");
                    }
                    this.loadTasks();
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        selectedTask(item) {
            if (this.selectTask && this.selectTask.js_task_name === item.js_task_name) {
                this.selectTask = null;
                return;
            }
            this.selectTask = item;
        },
        changeVolum(val) {
            if (!this.selectTask) {
                this.$message.error("请选择要操作的任务");
                return;
            }
            if (!this.selectTask.js_task_hashkey) {
                this.$message.error("改任务不支持调节音量");
                return;
            }
            this.$ajax.get(this.$URL + '/itc/SetTaskVolumn', {
                params: {
                    vol: this.volumn,
                    taskhash: this.selectTask.js_task_hashkey
                }
            }).then((result) => {
                if (result.status === 200) {
                    if (result.data.Result == 200) {
                        this.$message({
                            type: 'success',
                            message: '音量调节成功'
                        });
                    } else {
                        this.$message.error("音量调节失败");
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        devicechangebox(status, item) {
            if (status) {
                this.devices.add(item);
            } else {
                if (this.devices.has(item)) {
                    this.devices.delete(item);
                }
            }
        },
        loadTasks() {
            let _this = this;
            this.$ajax.get(this.$URL + '/itc/GetTasks').then((result) => {
                if (result.status === 200) {
                    if (result.data && result.data.PARA)
                        this.taskList = result.data.PARA;
                        if(this.selectTask&&this.selectTask.js_task_name)
                        {
                            this.taskList.forEach((v,i)=>{
                                if(v.js_task_name==this.selectTask.js_task_name)
                                {
                                    this.selectTask=v;
                                    return;
                                }
                            });
                        }
                    if (this.ticks) {
                        clearTimeout(this.ticks);
                    }
                    if (this.update) {
                        this.ticks = setTimeout(() => {
                            _this.loadTasks();
                        }, 3000);
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        }

    },
    beforeRouteLeave(to, from, next) {
        if (this.ticks) {
            clearTimeout(this.ticks);
        }
        next();
    }
}
</script>

<style lang="less" scoped>
.box {
    font-size: 12px;
    height: calc(100% - 115px);
    overflow-x: hidden;
    padding: 10px 0;
    margin: 0 !important;

    & /deep/ .el-tree.tree {
        height: calc(100% - 36px);
        overflow-y: auto;
        border-right: 1px solid #051b47
    }

    & /deep/ .el-pagination.is-background {
        text-align: center;
    }

    & /deep/ .el-table__header th {
        background: #030d21;
    }

    & /deep/ .el-slider {
        width: 200px;
        margin-left: 100px;
    }

}

.play {
    height: 100px;

}

.device {
    height: calc((100% - 136px) * 0.3);
    overflow-x: hidden;
    overflow-y: auto;

    .deviceitem {
        position: relative;
        width: 100%;
        background: #161C2C;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        cursor: pointer;

        i {
            font-size: 30px;
        }

        .check {
            position: absolute;
            top: 10px;
            left: 10px;
        }
    }
}

.music {
    height: calc((100% - 136px) * 0.7);
}

.menuheader {
    line-height: 36px;
    height: 36px;
    vertical-align: middle;
    padding: 0 10px;
    overflow: hidden;
    background: #051b47;

    i {
        cursor: pointer;
    }
}

.taskList {
    height: calc(100% - 36px);
    border-right: 1px solid #051b47;
    overflow-y: auto;
    padding: 10px 5px;

    .task {
        line-height: 36px;
        text-align: center;
        border-bottom: 1px solid #051b47;
        cursor: pointer;
    }
}

.active {
    background: #051b47
}
</style>
