<template>
<div class="Container">
    <div class="process">
        <el-steps :active="active" simple>
            <el-step title="模板名称"></el-step>
            <el-step title="模板设计"></el-step>
        </el-steps>
    </div>
    <div class="item" v-show="active==0">
        <div class="content">
            <span>模板名称：</span>
            <el-input v-model="name_input" placeholder="请输入" class="modal-name"></el-input>
        </div>
        <div class="click-btn">
            <el-button type="primary" @click="next">下一步</el-button>
        </div>
    </div>
    <div v-show="active==1" class="item making-form">
        <fm-making-form ref="MakingForm" preview generate-code generate-json></fm-making-form>
        <div class="click-btn">
            <el-button type="primary" @click="pre">上一步</el-button>
            <el-button type="primary" @click="submitTemplate">保存</el-button>
        </div>
    </div>
</div>
</template>

<script>
import {Templet_AddOrUpdate} from '@/api/Templet'
export default {
    data() {
        return {
            active: 0,
            name_input: '',
            TempleteForm:[],
            templateEdit:''
        }
    },
    mounted(){
        this.templateEdit = this.$route.query.data;
        if(this.templateEdit){
            this.name_input = this.templateEdit.Name;
            this.$refs.MakingForm.setJSON(JSON.parse(this.templateEdit.TempletForm));
        }
    },
    methods: {
        next() {
            switch (this.active) {
                case 0:
                    if (this.name_input == '') {
                        this.$message.warning('模板名称不能为空！')
                        return
                    }
                    break
            }
            if (this.active++ > 1) this.active = 1
        },
        pre() {
            this.active--;
        },
        submitTemplate(){
            this.TempleteForm = this.$refs.MakingForm.getJSON()
            if (this.TempleteForm.list.length == 0) {
                this.$message.warning('模板流程不能为空！')
                return
            }else{
                let data = {
                    Description:'',
                    Id:this.templateEdit!=null?this.templateEdit.Id:'',
                    Name:this.name_input,
                    TempletForm:JSON.stringify(this.TempleteForm)
                }
                Templet_AddOrUpdate(data).then(result =>{
                    this.$message.success("编辑成功");
                    this.$router.push({path:"/orderTemplate"});
                })
            }
        }
       
    }

}
</script>

<style lang="scss">
.process .el-steps--simple {
    background: #051737 !important;
}

.el-step__title.is-process {
    color: #fff;
}

.el-step__head.is-process {
    border-color: #fff;
}
.Container{
    font-size: 12px;
    position: relative;
    text-align: center;
}
.Container .item {
    color: #fff;

    .content {
        margin: 30px;
    }

    .el-input {
        width: 280px;
    }
}

.components-list .form-edit-widget-label {
    border: none;
    color: #ffffff;
}

.components-list .form-edit-widget-label>a {
    background: #0c355e;
    border: solid 1px #00A0E9;
}

.fm2-container {
    height: calc(100vh - 340px);
}

.fm2-container,
.fm2-container>.el-container {
    background: #061A30;
}

.center-container .el-main {
    background: #061A30;
}

.fm2-container footer {
    display: none;
}

.marking-form,
.click-btn {
    margin-top: 10px;
}

.widget-form-container .widget-form-list {
    background: #061A30;
}

.approval-process,
.supervision-process {
    margin-bottom: 30px;
}
.process-content{
    margin-top: 20px;
}
.steps-user{
    margin: 15px 0;
}
</style>
