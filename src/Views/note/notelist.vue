<template>
<div class="box" id="notebox" @contextmenu.prevent="addNote">
    <div class="note" :style="{background:color[(i%5)]}" :class="[item.id%2===0?'right5':'left5']" v-for="(item,i) in notes" :key="i">
        <div class="closeicon" @click="deleteNote(item.id)">
            <i class="fa fa-remove"></i>
        </div>
        <div class="notetitle">
            {{item.title}}
        </div>
        <div class="notebody">
            {{item.content}}
        </div>
    </div>

    <el-dialog title="新增便签" :visible.sync="paramEditVisibale" :modal-append-to-body="false" width="400px" center class="videoDialog">
        <el-form label-width="100px">
            <el-form-item label="标题" prop="name" label-position="left">
                <el-input v-model="title"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="name">
                <el-input v-model="content" type="textarea" rows="6"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveNote">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    name: 'notelist',
    data() {
        return {
            title: '',
            content: '',
            paramEditVisibale: false,
            color: ['#0895C6', '#D48265', '#26488C', '#60B5C2', '#6977EE'],
            deg: 0,
            notes: [],
        }
    },
    mounted() {
        this.laodNotes();
    },
    methods: {
        loadTree() {
            this.$ajax.get(this.$URL + '/SysMenu/GetAreaTreeInMenu').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.data = result.data.data;
                    // this.MenuData = result.data.info;
                }
            }).catch((err) => {

            });
        },
        laodNotes() {
            this.$ajax.get(this.$URL + '/message/GetNotes').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.notes = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        addNote() {
            this.title = "";
            this.content = "";
            this.paramEditVisibale = true;
        },
        saveNote() {
            this.$ajax.post(this.$URL + '/message/AddNotes', {
                title: this.title,
                content: this.content
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        type: 'success',
                        message: '添加成功',
                    });
                    this.paramEditVisibale = false;
                    this.laodNotes();
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        deleteNote(id) {
            this.$ajax.get(this.$URL + '/message/DeleteNotes', {
                params: {
                    id
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.laodNotes();
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }
}
</script>

<style lang="less" scoped>
.box {
    font-size: 12px;
    height: calc(100% - 115px);
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    overflow-y: auto;
}

.right5 {
    transform: rotate(5deg);
    transform-origin: left top;
}

.left5 {
    transform: rotate(-5deg);
    transform-origin: right bottom;
}

.note {
    font-size: 12px;
    background: #0895C6;
    width: 20%;
    height: 200px;
    position: relative;
    padding: 10px;
    margin: 30px 10px;
    min-width: 100px;

    .closeicon {
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
    }

    .notelist {
        height: 20%;
    }

    .notebody {
        height: 80%;
        display: flex;
        align-items: center;
    }
}
</style>
