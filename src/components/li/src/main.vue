<template>
<li >
    <!-- @dblclick="changeType" -->
     <div :class="{bold: isFolder}" @click="nodeClick(model)"  class="item">
       <i v-if='isFolder' class="fa " :class="[open?'fa-folder-open':'fa-folder']" @click.stop="toggle"></i>
    {{ model.label }}
       
    </div>
    <ul v-show="open" v-if="isFolder">
        <item class="item" @nodeClick="openDiagram" v-for="(model, index) in model.children" :key="index" :model="model">
        </item>
        <!-- <li class="add" @click="addChild">+</li> -->
    </ul>
</li>
</template>

<script>
export default {
    name: 'item',
    props: {
        model: Object
    },
    data: function () {
        return {
            open: false
        }
    },
    computed: {
        isFolder: function () {
            return this.model.children &&
                this.model.children.length
        }
    },
    methods: {
        toggle: function () {
            if (this.isFolder) {
                this.open = !this.open
            }
        },
        changeType: function () {
            if (!this.isFolder) {
                Vue.set(this.model, 'children', [])
                this.addChild()
                this.open = true
            }
        },
        addChild: function () {
            this.model.children.push({
                name: 'new stuff'
            })
        },
        openDiagram(model)
        {
          
            this.$emit('nodeClick',model);
        },
        nodeClick(model)
        {
            alert(1);
            this.$emit('nodeClick',JSON.parse(model.config));
        }
    }
}
</script>
<style lang="less" scoped>
ul{
    list-style: none;
    
}
li{
    cursor: pointer;
}
.item{
    line-height: 28px;
    font-size: 14px;

}
</style>

