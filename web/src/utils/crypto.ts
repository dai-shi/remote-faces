import pako from "pako";

export const sha256 = async (text: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const buf = await window.crypto.subtle.digest("SHA-256", data);
  const arr = Array.from(new Uint8Array(buf));
  const hex = arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex;
};

export const secureRandomId = (len = 32) => {
  const buf = window.crypto.getRandomValues(new Uint8Array(len));
  const arr = Array.from(buf);
  const hex = arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex;
};

export const rand4 = () => {
  const rand = window.crypto.getRandomValues(new Uint16Array(1))[0];
  return 1000 + (rand % 9000);
};

export const generateCryptoKey = async () => {
  const key = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 128 },
    true,
    ["encrypt", "decrypt"]
  );
  const buf = await window.crypto.subtle.exportKey("raw", key);
  const arr = Array.from(new Uint8Array(buf));
  const hex = arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex;
};

export const importCryptoKey = async (
  key: string,
  usages: ("encrypt" | "decrypt")[]
) => {
  const size = key.length / 2;
  const buf = new Uint8Array(size);
  for (let i = 0; i < size; i += 1) {
    buf[i] = parseInt(key.slice(i * 2, i * 2 + 2), 16);
  }
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    buf,
    { name: "AES-GCM", length: 128 },
    true,
    usages
  );
  return cryptoKey;
};

// encrypt with compression
export const encrypt = async (data: string, key: string) => {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(data);
  const compressed = pako.deflate(encoded);
  const cryptoKey = await importCryptoKey(key, ["encrypt"]);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    compressed
  );
  const buf = new Uint8Array(iv.length + encrypted.byteLength);
  buf.set(iv);
  buf.set(new Uint8Array(encrypted), iv.length);
  return buf;
};

// decrypt with decompression
export const decrypt = async (buf: ArrayBuffer, key: string) => {
  const cryptoKey = await importCryptoKey(key, ["decrypt"]);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: buf.slice(0, 12) },
    cryptoKey,
    buf.slice(12)
  );
  const decompressed = pako.inflate(new Uint8Array(decrypted));
  const decoder = new TextDecoder("utf-8");
  const data = decoder.decode(decompressed);
  return data;
};
