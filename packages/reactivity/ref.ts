import { reactive } from "./reactive";

export function ref<T extends unknown>(val: T): T {
  const wrap = {
    value: val,
  };

  Object.defineProperty(wrap, "v_isRef", {
    value: true,
  });

  return reactive(wrap);
}
