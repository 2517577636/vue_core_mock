import { reactive } from "@packages/reactivity";

/**
 * @description should not pollute original object with Proxies
 * */ 
const original: any = { foo: 1 }
const original2 = { bar: 2 }
const observed = reactive(original)
const observed2 = reactive(original2)
observed.bar = observed2

console.log("self observed: ", observed);
console.log("self observed2: ", observed2);