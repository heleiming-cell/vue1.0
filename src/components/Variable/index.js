import Variable from './src/main';

/* istanbul ignore next */
Variable.install = function(Vue) {
  Vue.component(Variable.name, Variable);
};

export default Variable;
