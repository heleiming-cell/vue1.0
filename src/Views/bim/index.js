import Bim from './src/main';

/* istanbul ignore next */
Bim.install = function(Vue) {
  Vue.component(Bim.name, Bim);
};

export default Bim;
