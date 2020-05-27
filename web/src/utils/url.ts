export const copyHashFromLink = (link: string) => {
  try {
    const srcHash = new URL(link).hash.slice(1);
    const srcSearchParams = new URLSearchParams(srcHash);
    const dstHash = window.location.hash.slice(1);
    const dstSearchParams = new URLSearchParams(dstHash);
    srcSearchParams.forEach((value, key) => {
      dstSearchParams.set(key, value);
    });
    window.location.hash = dstSearchParams.toString();
  } catch (e) {
    // ignore
  }
};

export const extractRoomIdFromLink = (link: string) => {
  try {
    const hash = new URL(link).hash.slice(1);
    const searchParams = new URLSearchParams(hash);
    return searchParams.get("roomId");
  } catch (e) {
    return null;
  }
};

export const getRoomIdFromUrl = () => {
  const hash = window.location.hash.slice(1);
  const searchParams = new URLSearchParams(hash);
  return searchParams.get("roomId");
};

export const setRoomIdToUrl = (roomId: string) => {
  const hash = window.location.hash.slice(1);
  const searchParams = new URLSearchParams(hash);
  searchParams.set("roomId", roomId);
  window.location.hash = searchParams.toString();
};

export const getServerConfigFromUrl = () => {
  const hash = window.location.hash.slice(1);
  const searchParams = new URLSearchParams(hash);
  const server = searchParams.get("server");
  try {
    const url = new URL(server || "");
    const secure = url.protocol === "https:";
    const defaultPort = secure ? 443 : 80;
    return {
      host: url.host.split(":")[0],
      port: url.port ? Number(url.port) : defaultPort,
      path: url.pathname,
      secure,
    };
  } catch (e) {
    // ignore
  }
  return null;
};
