"use strict";(self.webpackChunkremote_faces_web=self.webpackChunkremote_faces_web||[]).push([[378],{10378:(e,t,a)=>{a.r(t),a.d(t,{MomentaryChat:()=>N,default:()=>v});var n=a(56167),r=a(60854),s=a.n(r),i=a(14726),c=a(65954),o=a(50634),l=a(23463);const d=e=>Array.isArray(e)&&2===e.length&&"string"===typeof e[0]&&"number"===typeof e[1],m=e=>(0,o.Kn)(e)&&"string"===typeof e.nickname&&"string"===typeof e.messageId&&"number"===typeof e.createdAt&&"string"===typeof e.text&&(e=>Array.isArray(e)&&e.every(d))(e.replies),u=(e,t)=>{const a=t[1]-e[1];return 0===a?e[0].length-t[0].length:a};var h=a(4497),p=a(11913),y=a(19375),g=a.n(y),C=a(37878);const f={toolbar:["specialCharacters","|","bold","italic","link","blockQuote","|","imageUpload","insertTable","mediaEmbed","|","undo","redo"],balloonToolbar:["heading","|","bulletedList","numberedList","indent","outdent"],link:{addTargetToExternalLinks:!0}},b=(0,n.memo)((e=>{let{registerClear:t,onChange:a,onMetaEnter:n}=e;return(0,C.jsx)(p.CKEditor,{editor:g(),config:f,onReady:e=>{e.sourceElement.addEventListener("keydown",(e=>{e.metaKey&&"Enter"===e.code&&n()})),t((()=>{e.setData("")})),(e=>{e.plugins.get("SpecialCharacters").addItems("Emoji",[{title:"smiley face",character:"\ud83d\ude0a"},{title:"rocket",character:"\ud83d\ude80"},{title:"wind blowing face",character:"\ud83c\udf2c\ufe0f"},{title:"floppy disk",character:"\ud83d\udcbe"},{title:"heart",character:"\u2764\ufe0f"}])})(e)},onChange:(e,t)=>{const n=t.getData();a(n)}})})),x=1048576,k=e=>new Date(e.createdAt).toLocaleString().split(" ")[1].slice(0,-3),j=(0,n.memo)((e=>{let{item:t,replyChat:a}=e;const[r,i]=(0,n.useState)(!1),c=e=>a(e,t.messageId);return(0,C.jsxs)("li",{className:"MomentaryChat-listPart",children:[r&&(0,C.jsx)(h.h5,{onSelect:e=>{c(e.native),i(!1)},style:{width:"100%"}}),(0,C.jsxs)("div",{className:"MomentaryChat-listPart-header",children:[(0,C.jsx)("div",{className:"MomentaryChat-iconButton-container",children:(0,C.jsx)("div",{className:"MomentaryChat-iconButton",children:(0,C.jsx)("button",{type:"button",onClick:()=>{i(!r)},children:"+"})})}),(0,C.jsx)("span",{className:"MomentaryChat-nickname",children:t.nickname||"No Name"}),(0,C.jsx)("span",{className:"MomentaryChat-time",children:k(t)})]}),(0,C.jsx)("div",{className:"MomentaryChat-text ck-content",dangerouslySetInnerHTML:(o=t.text,{__html:s().sanitize(o,{ADD_ATTR:["target"]})})}),(t.replies||[]).map((e=>{let[t,a]=e;return(0,C.jsxs)("button",{className:"MomentaryChat-icon",type:"button",onClick:()=>c(t),children:[t," ",a]},t)}))]},t.messageId);var o})),M=(0,n.memo)((e=>{var t;let{chatList:a,replyChat:r}=e;const s=(0,n.useRef)(null),i=null===(t=a[0])||void 0===t?void 0:t.messageId;return(0,n.useEffect)((()=>{s.current&&i&&(s.current.scrollTop=s.current.scrollHeight)}),[i]),(0,C.jsx)("ul",{className:"MomentaryChat-list",ref:s,children:a.map((e=>(0,C.jsx)(j,{item:e,replyChat:r},e.messageId)))})})),N=(0,n.memo)((e=>{let{roomId:t,userId:a,nickname:r,uniqueId:s}=e;const o=(0,n.useRef)(null),{chatList:d,sendChat:h,replyChat:p}=((e,t,a,r)=>{const s=(0,l.V)(e,t),o=`${r||"momentray"}Chat`;s.extraDataListMap[o]||(s.extraDataListMap[o]=[]);const d=s.extraDataListMap[o];return{chatList:(0,i.RK)(d).filter(m),sendChat:(0,n.useCallback)((e=>{const t={nickname:a,messageId:(0,c.Ze)(),createdAt:Date.now(),text:e,replies:[]};d.unshift(t),d.length>100&&d.pop()}),[d,a]),replyChat:(0,n.useCallback)(((e,t)=>{d.forEach((a=>{if(m(a)&&a.messageId===t){const t=new Map(a.replies);t.set(e,(t.get(e)||0)+1);const n=[...t.entries()];n.sort(u),a.replies=n}}))}),[d])}})(t,a,r,s),y=(0,n.useRef)(),[g,f]=(0,n.useState)(!1),k=(0,n.useRef)(""),j=(0,n.useCallback)((e=>{k.current=e,f(!!e&&e.length<=x)}),[]),N=(0,n.useCallback)((()=>{k.current&&k.current.length<=x&&(h(k.current),j(""),y.current&&y.current())}),[h,j]),v=(()=>{const e=(0,n.useRef)(),t=(0,n.useCallback)((t=>{"granted"===Notification.permission&&(e.current&&e.current.close(),e.current=new Notification(t))}),[]);return(0,n.useEffect)((()=>{"granted"!==Notification.permission&&Notification.requestPermission()}),[]),t})(),w=d[0];return(0,n.useEffect)((()=>{w&&w.createdAt>Date.now()-1e4&&new RegExp(`@${r}\\b`).test(w.text)&&v("You got a new message!")}),[r,w,v]),(0,C.jsxs)("div",{className:"MomentaryChat-container",ref:o,children:[(0,C.jsx)(M,{chatList:d,replyChat:p}),(0,C.jsx)("div",{className:"MomentaryChat-editor",children:(0,C.jsx)(b,{registerClear:e=>{y.current=e},onChange:j,onMetaEnter:N})}),(0,C.jsx)("div",{className:"MomentaryChat-button",children:(0,C.jsx)("button",{type:"button",onClick:N,disabled:!g,children:"Send"})})]})})),v=N}}]);
//# sourceMappingURL=378.cfe6d562.chunk.js.map