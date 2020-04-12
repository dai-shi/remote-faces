type StringItemName = "nickname" | "TODO1";

type JsonItemName = "TODO2" | "TODO3";

export const setStringItem = (name: StringItemName, value: string) => {
  window.localStorage.setItem(name, value);
};

export const getStringItem = (name: StringItemName) => {
  return window.localStorage.getItem(name) || "";
};

export const setJsonItem = (name: JsonItemName, value: unknown) => {
  window.localStorage.setItem(name, JSON.stringify(value));
};

export const getJsonItem = (name: JsonItemName): unknown | null => {
  try {
    return JSON.parse(window.localStorage.getItem(name) || "");
  } catch (e) {
    // ignore
    return null;
  }
};

export const removeItem = (name: StringItemName | JsonItemName) => {
  window.localStorage.removeItem(name);
};
