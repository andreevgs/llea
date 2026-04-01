export const areObjectsValuesEqual = (obj: any, subObj: any): boolean => {
  for (const key in subObj) {
    if (typeof subObj[key] === "object" && typeof obj[key] === "object") {
      if (!areObjectsValuesEqual(obj[key], subObj[key])) {
        return false;
      }
    } else {
      if (obj[key] !== subObj[key]) {
        return false;
      }
    }
  }
  return true;
};

export const getValueByDotNotationPath = (obj: any, path: string): any => {
  const keys = path.split(".");
  let value = obj;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }

  return value;
};
