export const sha256 = async (text: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  const arr = Array.from(new Uint8Array(buf));
  const hex = arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex;
};

export const rand4 = () => 1000 + Math.floor(Math.random() * 9000);
