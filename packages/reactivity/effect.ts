export let activeEffect: Function;

export function effect(fn: Function) {
  activeEffect = fn;
  fn();
}
