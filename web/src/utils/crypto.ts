export const sha256 = async (text: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const buf = await window.crypto.subtle.digest("SHA-256", data);
  const arr = Array.from(new Uint8Array(buf));
  const hex = arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex;
};

export const secureRandomId = () => {
  const arrbuf = window.crypto.getRandomValues(new Uint8Array(16));
  const arr = Array.from(arrbuf);
  const hex = arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex;
};

export const rand4 = () => {
  const rand = window.crypto.getRandomValues(new Uint16Array(1))[0];
  return 1000 + (rand % 9000);
};
