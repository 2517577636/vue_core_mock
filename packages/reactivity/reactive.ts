import { isObject } from "../share";
import { warn } from "./error";
import { activeEffect } from "./effect";

const reactiveMap = new WeakMap<Target, any>();
const targetMap = new WeakMap<Target, any>();

type Dep = Map<Function, number>;
export enum ReactiveFlags {
  v_reactive = "v_reactive",
}

export interface Target {
  v_reactive: boolean;
}

export function isReactive(target: unknown): boolean {
  return !!(target as Target)[ReactiveFlags.v_reactive];
}

export function reactive<T extends object>(target: T): any;
export function reactive(target: Target) {
  if (!isObject(target)) {
    warn("target is not an object.");
    return;
  }

  let reactiveProxy = reactiveMap.get(target);

  if (!reactiveProxy) {
    reactiveProxy = new Proxy(target, {
      get(target, property, receiver) {
        if (property === ReactiveFlags.v_reactive) {
          return true;
        }

        const res = Reflect.get(target, property, receiver);

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
        Reflect.set(target, property, newValue, receiver);

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

        depsMap.delete(property);
        return true;
      },
    });

    reactiveMap.set(target, reactiveProxy);
  }

  return reactiveProxy;
}
