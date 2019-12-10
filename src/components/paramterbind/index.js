import paramterbind from './src/main';

/* istanbul ignore next */
paramterbind.install = function(Vue) {
  Vue.component(paramterbind.name, paramterbind);
};

export default paramterbind;
