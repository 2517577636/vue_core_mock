import { reactive, isReactive, toRaw, ref, toRef, effect } from "vue";

/* 
const original: any = { foo: 1 };
const original2 = { bar: 2 };
const original3 = { gg: 3 };

const observed = reactive(original);
const observed2 = reactive(original2);
observed.bar = observed2;
observed.gg = original3;

console.log("observed: ", observed);
console.log("observed2: ", observed2);
console.log("observed.gg is reactive? ", isReactive(observed.gg)); 
*/

/**
 * @description toRaw on object using reactive as prototype
 * */

/* 
const original = { foo: 1 };
const observed = reactive(original);
const inherted = Object.create(observed);
const raw = toRaw(inherted);

console.log("inherted: ", inherted);
console.log("toRaw(inherted): ", toRaw(inherted));
 */

/* ============================== effect start ============================ */
/**
 * @description should observe delete operation
 */
let dummy;
const obj = reactive<{
  prop?: string;
}>({ prop: "value" });

effect(() => (dummy = obj.prop));

console.log("before delete prop: ", dummy);
delete obj.prop;
console.log("after delete prop: ", dummy);
