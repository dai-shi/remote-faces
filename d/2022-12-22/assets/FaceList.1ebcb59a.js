import{r as m,a as e,u as r,j as F,N as v,f as l}from"./index.e76b1b44.js";import{g as N,u as k,F as d}from"./SingleRoom.85e7e989.js";const S=m.exports.memo(()=>e("div",{className:"Loading-container",children:e("div",{className:"loader",children:e("div",{children:"Loading..."})})})),x=a=>{l.statusMesg=a},j=m.exports.memo(()=>{const{roomId:a,userId:t,statusMesg:i,config:{avatar:u,nickname:o,takePhoto:g,videoDeviceId:f},preference:{photoSize:p}}=r(l),L=N(a,t),{userIdList:I}=r(L),{myImage:h,roomImages:c}=k(a,t,u,o,i,!g,!1,!1,!1,f,p);return F("div",{className:"FaceList-list",children:[e("div",{className:"FaceList-item",children:e(d,{image:h,nickname:o,statusMesg:i,setStatusMesg:x,inFaceList:!0,muted:!0,micOn:!1,speakerOn:!1})}),c.map(s=>e("div",{className:"FaceList-item",children:e(d,{image:I.some(n=>n.userId===s.userId&&n.peerIndex!=="closed")?s.image:v,nickname:s.info.nickname,statusMesg:s.info.message,updated:s.updated,inFaceList:!0,muted:!0,micOn:!1,speakerOn:!1})},s.userId)),!c.length&&e("div",{className:"FaceList-item",children:e(S,{})})]})});export{j as default};
