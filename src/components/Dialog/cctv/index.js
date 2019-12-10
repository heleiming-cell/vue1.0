import CCTV from './src/main';

/* istanbul ignore next */
CCTV.install = function(Vue) {
  Vue.component(CCTV.name, CCTV);
};

export default CCTV;
