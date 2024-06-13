import { reactive, isReactive } from "@packages/reactivity";

/**
 * @description setting a property with an unobserved value should wrap with reactive
 *
 */
const observed = reactive<{ foo?: object }>({});
const raw = {};
observed.foo = raw;

console.log("observed.foo isn't equal to raw: ", observed.foo !== raw); // expect the answer to be true
console.log("observed.foo is reactive: ", isReactive(observed.foo)); // expect the answer to be true

/**
 * @description should not pollute original object with Proxies
 * */

/* 
const original: any = { foo: 1 }
const original2 = { bar: 2 }
const observed = reactive(original)
const observed2 = reactive(original2)
observed.bar = observed2

console.log("self observed: ", observed);
console.log("self observed2: ", observed2); 
*/
