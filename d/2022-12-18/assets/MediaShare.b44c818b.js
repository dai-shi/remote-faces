import{r,j as n,a as t,o as j,F as V}from"./index.05abbbf2.js";import{u as E,a as D}from"./useNicknameMap.f9e63cf9.js";import"./SingleRoom.977df56a.js";const x=r.exports.memo(({nickname:c,stream:a})=>{const l=r.exports.useRef(null);return r.exports.useEffect(()=>{a&&l.current&&(l.current.srcObject=a)},[a]),n("div",{className:"MediaShare-card",children:[t("video",{className:"MediaShare-video",ref:l,autoPlay:!0,muted:!0}),t("div",{className:"MediaShare-nickname",children:c})]})}),I=r.exports.memo(({roomId:c,userId:a,nickname:l,uniqueId:g})=>{const[k,o,C]=j(""),[i,u]=r.exports.useState(null),v=r.exports.useCallback(()=>{u(null)},[]),{videoStream:d,videoStreamMap:h}=E(c,a,i,v,g),F=D(c,a),[f,N]=r.exports.useState("grid"),p=(d?1:0)+Object.values(h).filter(e=>e).length,S=Math.ceil(Math.sqrt(p)),y=Math.ceil(p/S),R=f==="grid"?{gridTemplateColumns:`repeat(${S}, 1fr)`,gridTemplateRows:`repeat(${y}, ${100/y}%)`}:{gridTemplateRows:Array(p).fill("100%").join(" ")},s=r.exports.useRef(null),[M,m]=r.exports.useState(!1);return n("div",{className:"MediaShare-container",ref:s,children:[n("div",{className:"MediaShare-toolbar",children:[!M&&t("button",{type:"button",onClick:async()=>{if(s.current)try{await s.current.requestFullscreen(),m(!0),s.current.onfullscreenchange=()=>{m(document.fullscreenElement===s.current)}}catch{}},children:"Enter Fullscreen"}),M&&t("button",{type:"button",onClick:async()=>{try{document.exitFullscreen(),m(!1)}catch{}},children:"Exit Fullscreen"}),n("select",{value:f,onChange:e=>N(e.target.value),children:[t("option",{value:"grid",children:"Display in Grid"}),t("option",{value:"vertical",children:"Display Vertically"})]}),i!==null&&t("button",{type:"button",onClick:v,children:"Stop sharing"}),i===null&&t("button",{type:"button",onClick:()=>u("SCREEN"),children:"Start Screen Share"}),i===null&&n(V,{children:[n("select",{value:o,onChange:e=>C(e.target.value),children:[t("option",{value:"",disabled:!0,children:"Select Camera to Share"}),k.map(e=>t("option",{value:e.deviceId,children:e.label},e.deviceId))]}),o&&t("button",{type:"button",onClick:()=>u({video:o}),children:"Start Video Share"})]})]}),n("div",{className:"MediaShare-body",style:R,children:[d&&t(x,{nickname:l,stream:d}),Object.keys(h).map(e=>{const b=h[e];return b?t(x,{nickname:F[e]||"No Name",stream:b},e):null})]})]})});export{I as MediaShare,I as default};
