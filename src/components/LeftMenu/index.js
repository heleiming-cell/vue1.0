import LeftMenu from './src/main';

/* istanbul ignore next */
LeftMenu.install = function(Vue) {
  Vue.component(LeftMenu.name, LeftMenu);
};

export default LeftMenu;