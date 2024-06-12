import { reactive, isReactive } from "vue";

const original: any = { foo: 1 }
const original2 = { bar: 2 }
const original3 = { gg: 3 }

const observed = reactive(original)
const observed2 = reactive(original2)
observed.bar = observed2
observed.gg = original3

console.log("observed: ", observed);
console.log("observed2: ", observed2);
console.log("observed.gg is reactive? ", isReactive(observed.gg));



