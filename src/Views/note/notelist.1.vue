<template>
<div class="box">
    <!-- <el-row class="box">
    <el-col :xs="24" :ms="24" :md="3" :lg="3" class="noterow">
        <div class="note">
            <div class="closeicon">
                <i class="fa fa-remove"></i>
            </div>
            <div class="notetitle">
                张三
            </div>
            <div class="notebody">
                12:00打开门禁通道
            </div>
        </div>
    </el-col>
</el-row> -->
    <div class="note">
        <div class="closeicon">
            <i class="fa fa-remove"></i>
        </div>
        <div class="notetitle">
            张三
        </div>
        <div class="notebody">
            12:00打开门禁通道
        </div>
    </div>
    <div class="note">
        <div class="closeicon">
            <i class="fa fa-remove"></i>
        </div>
        <div class="notetitle">
            张三
        </div>
        <div class="notebody">
            12:00打开门禁通道
        </div>
    </div>
    <div class="note">
        <div class="closeicon">
            <i class="fa fa-remove"></i>
        </div>
        <div class="notetitle">
            张三
        </div>
        <div class="notebody">
            12:00打开门禁通道
        </div>
    </div>
    <div class="note">
        <div class="closeicon">
            <i class="fa fa-remove"></i>
        </div>
        <div class="notetitle">
            张三
        </div>
        <div class="notebody">
            12:00打开门禁通道
        </div>
    </div>
    <div class="note">
        <div class="closeicon">
            <i class="fa fa-remove"></i>
        </div>
        <div class="notetitle">
            张三
        </div>
        <div class="notebody">
            12:00打开门禁通道
        </div>
    </div>
    <div class="note">
        <div class="closeicon">
            <i class="fa fa-remove"></i>
        </div>
        <div class="notetitle">
            张三
        </div>
        <div class="notebody">
            12:00打开门禁通道
        </div>
    </div>
    <div class="note">
        <div class="closeicon">
            <i class="fa fa-remove"></i>
        </div>
        <div class="notetitle">
            张三
        </div>
        <div class="notebody">
            12:00打开门禁通道
        </div>
    </div>
    <div class="note">
        <div class="closeicon">
            <i class="fa fa-remove"></i>
        </div>
        <div class="notetitle">
            张三
        </div>
        <div class="notebody">
            12:00打开门禁通道
        </div>
    </div>
    <div class="note1">
        <div class="closeicon">
            <i class="fa fa-remove"></i>
        </div>
        <div class="notetitle">
            张三
        </div>
        <div class="notebody">
            12:00打开门禁通道
        </div>
    </div>
    <div class="note">
        <div class="closeicon">
            <i class="fa fa-remove"></i>
        </div>
        <div class="notetitle">
            张三
        </div>
        <div class="notebody">
            12:00打开门禁通道
        </div>
    </div>
    <!-- <el-row class="box">
    <el-col :xs="24" :ms="24" :md="4" :lg="4" class="noterow">
        <div class="note">
            <div class="closeicon">
                <i class="fa fa-remove"></i>
            </div>
            <div class="notetitle">
                张三
            </div>
            <div class="notebody">
                12:00打开门禁通道
            </div>
        </div>
    </el-col>
</el-row> -->
</div>
</template>

<script>
export default {
    name: 'notelist'
}
</script>

<style lang="less" scoped>
.box {
    font-size: 12px;
    height: calc(100% - 115px);
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content:flex-start;
   
    align-content: flex-start;
}

.note {
    transform: rotate(5deg);
    transform-origin: left top;
    font-size: 12px;
    background: #0895C6;
    width: 10%;
    height: 100px;
    position: relative;
    padding: 10px;
    margin:30px 10px;
   

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
.note1 {
    transform: rotate(-5deg);
    transform-origin: left bottom;
    font-size: 12px;
    background: #0895C6;
    width: 10%;
    height: 100px;
    position: relative;
    padding: 10px;
    margin:30px 10px;

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
