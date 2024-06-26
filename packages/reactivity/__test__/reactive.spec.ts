/**
 * Notify:
 * unkown --> don't know
 * skip --> Suspend verification
 */

import { reactive, isReactive, toRaw } from "../index";

describe("reactivity/reactive", () => {
  /**
   * @description only validate get operations(P.S. Don't include 'in' operations and so on.)
   * */
  test("Object", () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
  });

  /**
   * @description unknow
   * */
  test("proto", () => {
    const obj = {};
    const reactiveObj = reactive(obj);
    expect(isReactive(reactiveObj)).toBe(true);
    // read prop of reactiveObject will cause reactiveObj[prop] to be reactive
    // @ts-expect-error
    const prototype = reactiveObj["__proto__"];
    const otherObj = { data: ["a"] };
    expect(isReactive(otherObj)).toBe(false);
    const reactiveOther = reactive(otherObj);
    expect(isReactive(reactiveOther)).toBe(true);
    expect(reactiveOther.data[0]).toBe("a");
  });

  /**
   * @description only validate the type of object(P.S. Don't include other. e.g. array & map & set.)
   * */
  test("nested reactives", () => {
    const original = {
      nested: {
        foo: 1,
      },
      // array: [{ bar: 2 }],
    };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);

    // expect(isReactive(observed.array)).toBe(true)
    // expect(isReactive(observed.array[0])).toBe(true)
  });

  /**
   * @description skip
   * - observing subtypes of IterableCollections(Map, Set)
   * - observing subtypes of WeakCollections(WeakMap, WeakSet)
   * */

  test("observed value should proxy mutations to original (Object)", () => {
    const original: any = { foo: 1 };
    const observed = reactive(original);
    // set
    observed.bar = 1;
    expect(observed.bar).toBe(1);
    expect(original.bar).toBe(1);
    // delete
    delete observed.foo;
    expect("foo" in observed).toBe(false);
    expect("foo" in original).toBe(false);
  });

  test("original value change should reflect in observed value (Object)", () => {
    const original: any = { foo: 1 };
    const observed = reactive(original);
    // set
    original.bar = 1;
    expect(original.bar).toBe(1);
    expect(observed.bar).toBe(1);

    // delete
    delete original.foo;
    expect("foo" in original).toBe(false);
    expect("foo" in observed).toBe(false);
  });

  test("setting a property with an unobserved value should wrap with reactive", () => {
    const observed = reactive<{ foo?: object }>({});
    const raw = {};
    observed.foo = raw;
    expect(observed.foo).not.toBe(raw);
    expect(isReactive(observed.foo)).toBe(true);
  });

  test("observing already observed value should return same Proxy", () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    const observed2 = reactive(observed);
    expect(observed2).toBe(observed);
  });

  test("observing the same value multiple times should return same Proxy", () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    const observed2 = reactive(original);
    expect(observed2).toBe(observed);
  });

  test("should not pollute original object with Proxies", () => {
    const original: any = { foo: 1 };
    const original2 = { bar: 2 };
    const observed = reactive(original);
    const observed2 = reactive(original2);
    observed.bar = observed2;
    expect(observed.bar).toBe(observed2);
    expect(original.bar).toBe(original2);
  });

  /**
   * @description skip
   * - mutation on objects using reactive as prototype should not trigger
   *  */

  test("toRaw", () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(toRaw(observed)).toBe(original);
    expect(toRaw(original)).toBe(original);
  });

  test("toRaw on object using reactive as prototype", () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    const inherted = Object.create(observed);
    expect(toRaw(inherted)).toBe(inherted);
  });

  test("toRaw on user Proxy wrapping reactive", () => {
    const original = {};
    const re = reactive(original);
    const obj = new Proxy(re, {});
    const raw = toRaw(obj);
    expect(raw).toBe(original);
  });

  /**
   * @description skip
   * */
  /* 
  test("should not unwrap Ref<T>", () => {
    const observedNumberRef = reactive(ref(1));
    const observedObjectRef = reactive(ref({ foo: 1 }));

    expect(isRef(observedNumberRef)).toBe(true);
    expect(isRef(observedObjectRef)).toBe(true);
  }); 
  */
});
