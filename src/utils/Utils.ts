/* eslint-disable no-eval */
export default function parseFunction<T>(func: string, fallback: T): T {
  console.log(func);
  try {
    if (func.includes("function(data)")) {
      return eval(func.replace("function(data)", "data => "));
    }
    if (func.includes("(data) => ")) {
      return eval(func.replace("(data) =>", "data =>"));
    }
    if (func.includes("data => ")) {
      return eval(func);
    }

    const finalFunc: T = eval(`data => ${func}`);
    return finalFunc;
  } catch (err) {
    return fallback;
  }
}
