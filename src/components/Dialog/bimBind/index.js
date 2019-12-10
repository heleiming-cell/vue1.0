import bimBind from './src/main';

/* istanbul ignore next */
bimBind.install = function(Vue) {
  Vue.component(bimBind.name, bimBind);
};

export default bimBind;