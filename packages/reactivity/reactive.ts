import { isObject } from "../share";
import { warn } from "./error";
import { activeEffect } from "./effect";

const reactiveMap = new WeakMap<Target, any>();
const targetMap = new WeakMap<Target, any>();

type Dep = Map<Function, number>;
export enum ReactiveFlags {
  v_reactive = "v_reactive",
  v_raw = "v_raw",
}

export interface Target {
  v_reactive: boolean;
  v_raw: any;
}

export function isReactive(target: unknown): boolean {
  return !!(target as Target)[ReactiveFlags.v_reactive];
}

export function toRaw<T>(target: T): T {
  const res = target && (target as unknown as Target)[ReactiveFlags.v_raw];
  return res ? toRaw(res) : target;
}

export function reactive<T extends Object>(target: T): any;
export function reactive(target: Target) {
  if (!isObject(target)) {
    warn("target is not an object.");
    return;
  }

  if (isReactive(target)) {
    return target;
  }

  let reactiveProxy = reactiveMap.get(target);

  if (!reactiveProxy) {
    reactiveProxy = new Proxy(target, {
      get(target, property, receiver) {
        if (property === ReactiveFlags.v_reactive) {
          return true;
        } else if (property === ReactiveFlags.v_raw) {
          if (
            receiver === reactiveMap.get(target) ||
            Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)
          ) {
            return target;
          }

          return;
        }

        let res = Reflect.get(target, property, receiver);
        if (isObject(res)) {
          res = reactive(res);
        }

        let depsMap = targetMap.get(target);
        if (!depsMap) {
          depsMap = new Map();
          targetMap.set(target, depsMap);
        }

        let deps = depsMap.get(property);
        if (!deps) {
          deps = new Map() as Dep;
          depsMap.set(property, deps);
        }
        deps.set(activeEffect, 1);

        return res;
      },

      set(target, property, newValue, receiver) {
        let newVal = newValue;
        if (isReactive(newVal)) {
          newVal = toRaw(newVal);
        }

        Reflect.set(target, property, newVal, receiver);

        let depsMap = targetMap.get(target);
        if (!depsMap) {
          return true;
        }

        let deps = depsMap.get(property) as Dep;
        if (!deps) {
          return true;
        }
        for (let effect of deps.keys()) {
          effect();
        }

        return true;
      },

      deleteProperty(target, property) {
        Reflect.deleteProperty(target, property);
        const depsMap = targetMap.get(target);
        if (!depsMap) {
          return true;
        }

        const deps = depsMap.get(property) as Dep;
        if (!deps) {
          return true;
        }
        for (let effect of deps.keys()) {
          effect();
        }

        return true;
      },
    });

    reactiveMap.set(target, reactiveProxy);
  }

  return reactiveProxy;
}
