import{r as l,a as e,u as d,j as a,N as p,f as N}from"./index.ddbdddf8.js";import{g as b,u as I,F as o}from"./SingleRoom.e4202879.js";const k=l.exports.memo(()=>e("div",{className:"Loading-container",children:e("div",{className:"loader",children:e("div",{children:"Loading..."})})})),O=l.exports.memo(()=>{const{roomId:i,userId:m,statusMesg:r,config:{avatar:g,nickname:t,takePhoto:u,videoDeviceId:f},preference:{photoSize:h}}=d(N),L=b(i,m),{userIdList:v}=d(L),{myImage:M,roomImages:n}=I(i,m,g,t,r,!u,!1,!1,!1,f,h);return a("div",{className:"MemberList-container",children:[a("div",{className:"MemberList-item",children:[e("div",{className:"MemberList-face",children:e(o,{image:M,nickname:"",statusMesg:"",muted:!0,micOn:!1,speakerOn:!1})}),e("div",{className:"MemberList-name",children:t}),e("div",{className:"MemberList-mesg",children:r})]}),n.map(s=>a("div",{className:"MemberList-item",children:[e("div",{className:"MemberList-face",children:e(o,{image:v.some(c=>c.userId===s.userId&&c.peerIndex!=="closed")?s.image:p,nickname:"",statusMesg:"",updated:s.updated,muted:!0,micOn:!1,speakerOn:!1})}),e("div",{className:"MemberList-name",children:s.info.nickname}),e("div",{className:"MemberList-mesg",children:s.info.message})]},s.userId)),!n.length&&e("div",{className:"MemberList-item",children:e(k,{})})]})});export{O as default};
