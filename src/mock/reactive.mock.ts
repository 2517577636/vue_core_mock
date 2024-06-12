import { reactive, ReactiveFlags, type Target } from "@packages/reactivity";

/**  Test: Object
 * @description only validate get operations(P.S. Don't include 'in' operations and so on.)
 */
const original = { foo: 1 };
const observed = reactive(original);

function isEqual<T extends object>(target: T, observed: T): boolean {
  let res: boolean = false;
  if (target === observed) {
    res = true;
  }

  return res;
}

function isReactive(target: Target): boolean {
  return target[ReactiveFlags.v_reactive]
    ? target[ReactiveFlags.v_reactive]
    : false;
}

const res = isEqual(original, observed);
const judge = isReactive(observed);
console.log("observed: ", observed);
console.log("original and observed isEqual? ", res);
console.log("observed is reactive? ", judge);
