import Vue from 'vue'
import Diagram from './main'
let Instance;
Diagram.newInstance = () =>{
  
    const Instance = new Vue(
        {
        render(h){
          return h(Diagram,{})
        }
    }
)

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