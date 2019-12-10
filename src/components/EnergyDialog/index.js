//组态图选择
import Diagram from './src/main';

/* istanbul ignore next */
Diagram.install = function(Vue) {
  Vue.component(Diagram.name, Diagram);
};

export default Diagram;