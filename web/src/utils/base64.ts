export const encodeBase64Sync = (data: Uint8Array) => {
  const base64 = btoa(String.fromCharCode(...data));
  return base64;
};

export const decodeBase64Sync = (base64: string) => {
  const binaryString = atob(base64);
  const data = new Uint8Array(
    [].map.call(binaryString, (c: string) =>
      c.charCodeAt(0)
    ) as unknown as ArrayBufferLike
  );
  return data;
};

export const encodeBase64Async = (data: Uint8Array) =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const offset = result.indexOf(",") + 1;
      resolve(result.slice(offset));
    };
    reader.readAsDataURL(new Blob([data]));
  });

export const decodeBase64Async = async (base64: string) => {
  const response = await fetch(
    `data:application/octet-binary;base64,${base64}`
  );
  const buf = await response.arrayBuffer();
  return new Uint8Array(buf);
};
