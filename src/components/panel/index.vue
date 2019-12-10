<template>
  <div class="index">
    <!--<newTrend></newTrend>-->
    <button @click="Monitor">$Monitor</button>
  </div>
</template>

<script>
  import newTrend from './modal/newTrend/index.vue'

  export default {
    name: 'index',
    components: {
      newTrend
    },
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted(){
    },
    methods: {
      Monitor(){
        this.$Modal(
          {
            type: 'boiler',
            data_id: '1212'
          }
        )
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .index {
    width: 100%;
    height: 100%;
  }
</style>
