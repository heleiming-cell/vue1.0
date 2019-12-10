import Icon from './src/main';

/* istanbul ignore next */
Icon.install = function(Vue) {
  Vue.component(Icon.name, Header);
};

export default Icon;
