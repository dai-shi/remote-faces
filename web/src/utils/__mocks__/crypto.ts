export const secureRandomId = () => {
  const arrbuf = new Uint8Array(16).map(() => Math.random() * 256);
  const arr = Array.from(arrbuf);
  const hex = arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex;
};
