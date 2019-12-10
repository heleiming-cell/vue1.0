import Vue from 'vue'
import Video from './main'
let Instance;
Video.newInstance = () =>{
   // const _props = properties || {} //传参数
  
    //new 一个 vue实例
  
    const Instance = new Vue(
        {
        render(h){
          return h(Video,{})
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
export default Video