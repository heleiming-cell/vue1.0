import Vue from 'vue'
import Diagram from './main'
let Instance;
Diagram.newInstance = () =>{
   // const _props = properties || {} //传参数
  
    //new 一个 vue实例
  
    const Instance = new Vue(
        {
        render(h){
          return h(Diagram,{})
        }
    }
)
// const Instance =new Diagram();
    //手动挂载实例
    const component = Instance.$mount()
  
    //添加dom节点
    document.getElementById("app").appendChild(component.$el)
  
    const diagram = component.$children[0]
  
    //返回一个add方法
    return{
        diagram
    }
  }
export default Diagram