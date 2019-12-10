import Vue from 'vue'
import panels from '@/data/panelComponent'
let openModal=function(data,_this)
{
    if(data&&data.data_id&&data.type)
    {
       const panelVue= panels[data.type];
       if(panelVue)
       {
        data.el_card_style =data.el_card_style|| 'position:fixed;top:100px;left:calc(50% - 214px);z-index:3000'
        let component = Vue.extend(require('@/components/panel/modal/'+panelVue+'.vue').default);
        let vm= new component({data:data,store:_this.$store}).$mount();
        document.body.appendChild(vm.$el);
        vm.visible=true;
        return vm;
       }
    }
    return null;
}
export {openModal,panels} ;