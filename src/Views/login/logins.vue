<template>
<div class="login" @keyup.enter="login">
    <div>2222222222222222222222</div>
    <div class="loginbody">
        <div class=" loginTitle">
            <span class="">浦公节能智慧管理平台</span>
        </div>
        <div class="username">
            <el-input placeholder="用户名" v-model="username"></el-input>
        </div>
        <div class="password">
            <el-input type="password" placeholder="密码" v-model="password"></el-input>
        </div>
        <div class="submit">
            <el-button class="logbtn" @click="login" type="primary" >登录</el-button>
        </div>
    </div>
</div>
</template>

<script>
import Cookie from 'js-cookie'

export default {
    data(){
        return{
            username:'',
            password:'',
        }
    },
    methods:{
        login() {
            this.$ajax.post(this.$URL + '/account/Login', {
                username: this.username,
                password: this.password
            }).then((result)=>{
 if (result.status === 200 && result.data.success) {
      if (result.data.result.Token)
                    {
                        Cookie.set("token", result.data.result.Token + '@@@')
                        sessionStorage.setItem("username", result.data.result.Name);
                    }
                    this.$router.push({
                        name: 'navigate'
                    });
 }
            })

          
        }
    }
}
</script>


<style lang="less"  scoped>
.login {
    height: 100%;
    width: 100%;
    background-image: url('../../static/images/login.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.loginTitle {
    font-size: 26px;
    text-align: center;
    margin: 20px;

    span {
        color: #ffffff !important;
        font-size: 26px !important;
    }
}

.username {
    font-size: 12px;
    margin-bottom: 10px;
    color: white !important;
    height: 56px;
    width: 300px;
    margin: 0 auto;
}

.password {
    font-size: 12px;
    border: 0;
    margin-bottom: 15px;
    color: white;
    height: 56px;
    width: 300px;
    margin: 0 auto;
}

.loginbody {
    width: 500px;
    height: 281px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: rgba(38, 72, 140, 0.3);

    box-sizing: border-box;

}

.submit {
    font-size: 12px;
    text-align: center;
}

.logbtn {
    width: 160px;
    height: 50px;
    border-radius: 4px;
    background: #26488C;
    margin-top: 20px;
}
</style>
