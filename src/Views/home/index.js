import Gis from './src/main';

/* istanbul ignore next */
Gis.install = function(Vue) {
  Vue.component(Gis.name, Gis);
};

export default Gis;
