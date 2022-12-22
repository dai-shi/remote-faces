import { RegionData } from "../hooks/useGatherArea";

const createMeeting = (
  i: number,
  x: number,
  y: number,
  w: number,
  h: number
) => ({
  [`meeting${i}`]: {
    type: "meeting",
    position: [x, y],
    size: [w, h],
    zIndex: 0,
  },
  [`meeting${i}_screen`]: {
    type: "screen",
    meetingRegionId: `meeting${i}`,
    position: [x, y + h + 5],
    size: [w, 70],
    zIndex: 0,
    background: "rgba(140, 140, 140, 0.2)",
  },
});

const createGoBoard = (i: number, x: number, y: number) => ({
  [`gomeeting${i}`]: {
    type: "meeting",
    position: [x, y],
    size: [250, 150],
    zIndex: 0,
  },
  [`gobard${i}`]: {
    type: "goboard",
    position: [x, y],
    size: [250, 150],
    zIndex: 0,
    background: "rgba(140, 140, 140, 0.2)",
  },
});

const intro: Record<string, RegionData> = {
  background: {
    type: "default",
    position: [36, 36],
    size: [819, 507],
    zIndex: -100,
    background:
      "url(https://user-images.githubusercontent.com/490574/208681874-3f7051ab-7f3f-4c8a-ad1c-83d2e1c4b1c2.png) left top / contain no-repeat",
  },
  chat: {
    type: "chat",
    position: [394, 323],
    size: [205, 205],
    zIndex: 0,
    background: "rgba(135, 206, 235, 0.2)",
  },
  ...createMeeting(1, 400, 80, 190, 45),
  ...createMeeting(2, 637, 80, 190, 45),
  share: {
    type: "media",
    position: [650, 317],
    size: [185, 210],
    zIndex: 0,
    background: "rgba(0, 240, 0, 0.2)",
  },
};

const phone: Record<string, RegionData> = {
  ...createMeeting(0, 45, 200, 280, 70),
  share1: {
    type: "media",
    position: [350, 5],
    size: [250, 295],
    zIndex: 0,
    background: "rgba(0, 240, 0, 0.2)",
  },
  share2: {
    type: "media",
    position: [350, 310],
    size: [250, 295],
    zIndex: 0,
    background: "rgba(0, 240, 0, 0.2)",
  },
  share3: {
    type: "media",
    position: [610, 5],
    size: [900, 600],
    zIndex: 0,
    background: "rgba(0, 240, 0, 0.2)",
  },
};

const igo: Record<string, RegionData> = {
  chat: {
    type: "chat",
    position: [45, 170],
    size: [290, 170],
    zIndex: 0,
    background: "rgba(135, 206, 235, 0.2)",
  },
  ...createGoBoard(1, 360, 40),
  ...createGoBoard(2, 360, 200),
  ...createGoBoard(3, 360, 360),
  ...createGoBoard(4, 620, 40),
  ...createGoBoard(5, 620, 200),
  ...createGoBoard(6, 620, 360),
  ...createGoBoard(7, 880, 40),
  ...createGoBoard(8, 880, 200),
  ...createGoBoard(9, 880, 360),
};

const office1: Record<string, RegionData> = {
  background: {
    type: "default",
    position: [0, 0],
    size: [1021, 676],
    zIndex: -100,
    background:
      "url(https://user-images.githubusercontent.com/17561803/111254880-55862c80-8659-11eb-88f1-3aaa42ba2b68.png) left top / contain no-repeat",
  },
  chat: {
    type: "chat",
    position: [40, 480],
    size: [380, 190],
    zIndex: 0,
    background: "white",
    border: "skyblue solid 3px",
  },
  ...createMeeting(1, 77, 244, 273, 160),
  ...createMeeting(2, 297, 40, 135, 100),
  ...createMeeting(3, 385, 321, 113, 75),
  share: {
    type: "media",
    position: [540, 405],
    size: [480, 270],
    zIndex: 0,
    background: "rgba(0, 240, 0, 0.3)",
  },
  go: {
    type: "goboard",
    position: [820, 95],
    size: [200, 120],
    zIndex: 0,
    background: "rgba(0,240,0,0.6)",
  },
  go2: {
    type: "goboard",
    position: [820, 220],
    size: [200, 120],
    zIndex: 0,
    background: "rgba(0,100,240,0.6)",
  },
};

const office2: Record<string, RegionData> = {
  background: {
    type: "default",
    position: [0, 0],
    size: [1120, 740],
    zIndex: -100,
    background:
      "url(https://user-images.githubusercontent.com/17561803/118205142-ab7d2200-b49a-11eb-863a-3a9a5560d7df.png) left top / contain no-repeat",
  },
  chat: {
    type: "chat",
    position: [85, 530],
    size: [375, 200],
    zIndex: 0,
    background: "rgba(206,206,206,0.9)",
    border: "#2C2F33 solid 2px",
  },
  ...createMeeting(1, 220, 180, 240, 160),
  ...createMeeting(2, 863, 230, 250, 170),
  ...createMeeting(3, 650, 47, 160, 160),
  share: {
    type: "media",
    position: [600, 480],
    size: [510, 250],
    zIndex: 0,
    background: "rgba(0,0,0,0.2)",
    border: "limegreen solid 2px",
  },
  ...createGoBoard(10, 865, 5),
};

const office3: Record<string, RegionData> = {
  background: {
    type: "default",
    position: [0, 0],
    size: [1120, 740],
    zIndex: -100,
    background:
      "url(https://user-images.githubusercontent.com/17561803/120201967-fc459680-c260-11eb-8b1f-6bb108476f2f.png) left top / contain no-repeat",
  },
  chat: {
    type: "chat",
    position: [56, 340],
    size: [250, 394],
    zIndex: 0,
    background: "rgba(167,194,211,0.9)",
    border: "#2C2F33 solid 3px",
  },
  ...createMeeting(1, 575, 295, 200, 130),
  ...createMeeting(2, 516, 555, 200, 100),
  ...createMeeting(3, 391, 373, 150, 100),
  share: {
    type: "media",
    position: [763, 643],
    size: [350, 90],
    zIndex: 0,
    background: "rgba(167,194,211,0.6)",
    border: "#2C2F33 solid 3px",
  },
  go: {
    type: "goboard",
    position: [320, 594],
    size: [180, 140],
    zIndex: 0,
    background: "rgba(167,194,211,0.6)",
    border: "#2C2F33 solid 3px",
  },
  movable: {
    type: "default",
    position: [244, 109],
    size: [36, 36],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/17561803/120613305-12d23480-c491-11eb-91ba-d338c3ba631e.png) center center / contain no-repeat",
    movable: true,
  },
};

const office4: Record<string, RegionData> = {
  background: {
    type: "default",
    position: [0, 0],
    size: [1120, 740],
    zIndex: -100,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919537-78c7d05e-26f4-43f6-9fdd-4db8e7fbc098.jpg) left top / contain no-repeat",
  },
  chat: {
    type: "chat",
    position: [660, 560],
    size: [150, 170],
    zIndex: 0,
    background: "rgba(255,255,255,0.3)",
    border: "#deca54 solid 1px",
  },
  ...createMeeting(1, 400, 540, 250, 120),
  ...createMeeting(2, 160, 290, 250, 140),
  ...createMeeting(3, 880, 190, 140, 70),
  movie: {
    type: "default",
    position: [763, 289],
    size: [109, 63],
    zIndex: 0,
    iframe: "https://www.youtube.com/embed/ofrC1WFeoLw",
  },
  share: {
    type: "media",
    position: [820, 590],
    size: [290, 140],
    zIndex: 0,
    background: "rgba(255,255,255,0.3)",
    border: "#deca54 solid 1px",
  },
  go: {
    type: "goboard",
    position: [150, 510],
    size: [160, 140],
    zIndex: 0,
    background: "rgba(255,255,255,0.3)",
    border: "#deca54 solid 1px",
  },
  BeachChair: {
    type: "default",
    position: [959, 422],
    size: [35, 63],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919528-eac984b0-ce64-4ab1-8973-c429e9a10052.png) center center / contain no-repeat",
    movable: true,
  },
  BeachChair2: {
    type: "default",
    position: [1068, 423],
    size: [35, 63],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919528-eac984b0-ce64-4ab1-8973-c429e9a10052.png) center center / contain no-repeat",
    movable: true,
  },
  ChairA: {
    type: "default",
    position: [367, 317],
    size: [35, 48],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919531-82d14682-c684-4da7-bc83-8ae17861150e.png) center center / contain no-repeat",
    movable: true,
  },
  ChairB: {
    type: "default",
    position: [174, 330],
    size: [35, 48],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919533-6a09f353-16c2-465d-b09f-ff64b0357418.png) center center / contain no-repeat",
    movable: true,
  },
  ChairC: {
    type: "default",
    position: [345, 374],
    size: [35, 48],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919534-d4a669f9-c228-4a55-9b2a-df04bd2dd0d1.png) center center / contain no-repeat",
    movable: true,
  },
  Digda: {
    type: "default",
    position: [119, 409],
    size: [26, 22],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919535-97212807-b151-4937-8e08-b4fdd1f497e7.png) center center / contain no-repeat",
    movable: true,
  },
  Kintone: {
    type: "default",
    position: [907, 110],
    size: [46, 28],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919536-99b58589-238f-44e9-b2a2-f20a615e730c.png) center center / contain no-repeat",
    movable: true,
  },
  BlockA: {
    type: "default",
    position: [430, 500],
    size: [22, 19],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126926610-244ca224-89b8-4418-b457-5d23ca34d69e.png) center center / contain no-repeat",
    movable: true,
  },
  BlockB: {
    type: "default",
    position: [460, 500],
    size: [22, 19],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126926292-dd184ddb-2a78-4720-8b69-2daa6e911f08.png) center center / contain no-repeat",
    movable: true,
  },
  BlockC: {
    type: "default",
    position: [490, 500],
    size: [22, 19],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919530-aeff42a1-a033-4eb1-a395-bc3700b9a54d.png) center center / contain no-repeat",
    movable: true,
  },
  BlockD: {
    type: "default",
    position: [520, 500],
    size: [22, 19],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919529-b82d5f24-71ae-482b-987d-55d68829a490.png) center center / contain no-repeat",
    movable: true,
  },
};

const office5: Record<string, RegionData> = {
  background: {
    type: "default",
    position: [0, 0],
    size: [260, 2560],
    zIndex: -100,
    background:
      "url(https://user-images.githubusercontent.com/17561803/208803666-0107e07b-0e38-491d-9f75-53a81f2856c1.png) left top / contain no-repeat",
  },
  ...createMeeting(1, 480, 10, 200, 100),
  ...createMeeting(2, 690, 10, 200, 100),
  ...createMeeting(3, 900, 10, 200, 100),
  ...createMeeting(4, 270, 200, 200, 100),
  ...createMeeting(5, 480, 200, 200, 100),
  ...createMeeting(6, 690, 200, 200, 100),
  ...createMeeting(7, 900, 200, 200, 100),
  chat: {
    type: "chat",
    position: [270, 10],
    size: [200, 180],
    zIndex: 0,
    background: "rgba(135, 206, 235, 0.2)",
  },
  talky1: {
    type: "talky",
    position: [270, 390],
    size: [200, 100],
    zIndex: 0,
    background: "rgba(0, 240, 0, 0.2)",
  },
  talky2: {
    type: "talky",
    position: [480, 390],
    size: [200, 100],
    zIndex: 0,
    background: "rgba(0, 240, 0, 0.2)",
  },
  talky3: {
    type: "talky",
    position: [690, 390],
    size: [200, 100],
    zIndex: 0,
    background: "rgba(0, 240, 0, 0.2)",
  },
  talky4: {
    type: "talky",
    position: [900, 390],
    size: [200, 100],
    zIndex: 0,
    background: "rgba(0, 240, 0, 0.2)",
  },
  hiroba: {
    type: "meeting",
    position: [0, 170],
    size: [220, 230],
  },
  kaigi01: {
    type: "meeting",
    position: [0, 1945],
    size: [260, 190],
  },
  kaigi02: {
    type: "meeting",
    position: [0, 2220],
    size: [260, 260],
  },
  koshitsu01: {
    type: "meeting",
    position: [0, 1010],
    size: [100, 64],
  },
  koshitsu02: {
    type: "meeting",
    position: [0, 1080],
    size: [100, 64],
  },
  koshitsu03: {
    type: "meeting",
    position: [0, 1150],
    size: [100, 64],
  },
  koshitsu04: {
    type: "meeting",
    position: [0, 1270],
    size: [100, 64],
  },
  koshitsu05: {
    type: "meeting",
    position: [0, 1340],
    size: [100, 64],
  },
  koshitsu06: {
    type: "meeting",
    position: [0, 1410],
    size: [100, 64],
  },
  koshitsu07: {
    type: "meeting",
    position: [160, 1270],
    size: [100, 64],
  },
  koshitsu08: {
    type: "meeting",
    position: [160, 1150],
    size: [100, 64],
  },
  koshitsu09: {
    type: "meeting",
    position: [160, 1080],
    size: [100, 64],
  },
  koshitsu10: {
    type: "meeting",
    position: [160, 1010],
    size: [100, 64],
  },
  koshitsu11: {
    type: "meeting",
    position: [160, 1340],
    size: [100, 70],
  },
};

export const roomPresets: Record<string, Record<string, RegionData>> = {
  intro,
  phone,
  igo,
  office1,
  office2,
  office3,
  office4,
  office5,
};
