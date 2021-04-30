import { RegionData } from "../hooks/useGatherArea";

const office1: Record<string, RegionData> = {
  background: {
    type: "background",
    position: [0, 0],
    size: [1021, 676],
    zIndex: -100,
    background:
      "url(https://user-images.githubusercontent.com/17561803/111254880-55862c80-8659-11eb-88f1-3aaa42ba2b68.png) left top / contain",
    border: "",
    iframe: "",
  },
  chat: {
    type: "chat",
    position: [40, 480],
    size: [380, 190],
    zIndex: 0,
    background: "white",
    border: "skyblue solid 3px",
    iframe: "",
  },
  sofa: {
    type: "meeting",
    position: [77, 244],
    size: [273, 230],
    zIndex: 0,
    background: "",
    border: "",
    iframe: "",
  },
  garden: {
    type: "meeting",
    position: [297, 41],
    size: [135, 125],
    zIndex: 0,
    background: "",
    border: "",
    iframe: "",
  },
  couch: {
    type: "meeting",
    position: [385, 321],
    size: [113, 75],
    zIndex: 0,
    background: "",
    border: "",
    iframe: "",
  },
  share: {
    type: "media",
    position: [540, 405],
    size: [480, 270],
    zIndex: 0,
    background: "rgba(0, 240, 0, 0.3)",
    border: "",
    iframe: "",
  },
  go: {
    type: "goboard",
    position: [820, 95],
    size: [200, 120],
    zIndex: 0,
    background: "rgba(0,240,0,0.6)",
    border: "",
    iframe: "",
  },
  go2: {
    type: "goboard",
    position: [820, 220],
    size: [200, 120],
    zIndex: 0,
    background: "rgba(0,100,240,0.6)",
    border: "",
    iframe: "",
  },
};

export const roomPresets: Record<string, Record<string, RegionData>> = {
  office1,
};
