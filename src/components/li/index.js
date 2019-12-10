import item from './src/main';

/* istanbul ignore next */
item.install = function(Vue) {
  Vue.component(item.name, item);
};

export default item;