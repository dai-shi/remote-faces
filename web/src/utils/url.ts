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
