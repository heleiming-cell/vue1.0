<template>
<!-- <div>123</div> -->
<el-dialog title="视图绑定" :visible.sync="diglogVisible" :modal-append-to-body="true"  width="750px;">
    <div style="display:flex;">
        <div style="height:400px;width:20%;">
            <el-tree @node-click="nodeClick" :data="data" :props="defaultProps" accordion style="height:100%;background-color:#fff0;border-right:1px solid;">
            </el-tree>
        </div>
        <div style="height:400px;width:75%;">
            <div style="display:flex; flex-wrap:wrap;">
                <div v-for="(item,i) in diagrams" :key='i' style="width:25%;text-align:center">
                    <img :src="item.FileName" style="height:120px;" @click="clickDiagram(item.ID)">
                    <div style="color:white;">
                        {{item.Title}}
                    </div>
                </div>

            </div>
            <el-pagination v-on:current-change="pageChange" :page-size="8" background layout="prev, pager, next" :total="count">
            </el-pagination>
        </div>
    </div>
</el-dialog>
</template>

<script>
export default {
    name: 'diagramDialog',
    props: ['paramEditVisibale'],
    data() {
        return {
            servers: [], //视频服务器
            cams: [],
            diglogVisible: true,
            data: null,
            defaultProps: {
                children: 'children',
                label: 'label',
                isLeaf: 'isLeaf'
            },
            count: 0,
            diagrams: [],
            page: 1,
            nodeid: 0,
            callback: null,
        }
    },

    methods: {
        open(callback) {
            this.callback = callback;
            this.diglogVisible = true;
               this.loadDiagram(8, 1, 0);
            this.$ajax.get(this.$URL + '/diagram/LoadCategory').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.data = result.data.data;
                }
            }).catch((err) => {});

        },
        mounted() {
         
        },
        pageChange(page) {
            let _this = this;
            this.page = page;
            this.loadDiagram(8, _this.page, _this.nodeid);
        },
        nodeClick(obj, node, _tree) {
            let _this = this;
            this.nodeid = obj.key;
            this.loadDiagram(8, _this.page, obj.key);
        },
        clickDiagram(id) {
            this.callback(id);
            this.diglogVisible = false;
            // this.$emit('close', id);
        },
        loadDiagram(len, page, category) {
            this.$ajax.get(this.$URL + '/diagram/GetAllDiagram?len=' + len + '&page=' + page + '&category=' + category).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.count = result.data.count;
                    console.log(result.data.data)
                    this.diagrams = result.data.data;
                }
            }).catch((err) => {

            });
        },
    }
}
</script>

<style lang="less" scoped>
img{
    cursor: pointer;
}
</style>
