<template>
<div id="app" element-loading-text="拼命加载中" element-loading-background="rgba(0, 0, 0, 0.8)">
    <router-view />
    <transition name="el-zoom-in-center">
        <el-alarmlist v-show="showAlarmList"></el-alarmlist>
    </transition>
    <transition name="el-zoom-in-center">
        <el-alarmLink v-show="showAlarmLink"></el-alarmLink>
    </transition>
</div>
</template>

<script>
import alarmlist from '@/Views/alarm/alarmlist'
import alarmLink from '@/Views/alarm/alarmLink'
import Cookie from 'js-cookie'
export default {
    data() {
        return {
            vueroute: [],
        };
    },
    components: {
        'el-alarmlist': alarmlist,
        'el-alarmLink': alarmLink,
    },
    created() {
        var token=Cookie.get("token");
        if (token && token.slice(token.length - 3) === "@@@") //登录过,刷新时，或者第一次访问
        {
            this.$ajax.get(this.$URL + '/account/GetUserMenus', {}).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$store.commit('change_menu', result.data.menus);
                }
            }).catch((err) => {
                console.log(err);
            });
        } else {
            if (location.href.indexOf("navigate")>0) {
                this.$router.push({
                    name: 'navigate'
                });
                return;
            }
            this.$router.push({
                name: 'login'
            });
        }
    },
    computed: {
        showAlarmList() {
            return this.$store.state.alarm.showAlarmList
        },
        showAlarmLink() {
            return this.$store.state.alarm.showAlarmLink
        },
        loading() {
            return this.$store.state.alarm.loading_status
        }
    },

}
</script>

<style>
#app {
    width: 100%;
    height: 100%;
}
</style>
