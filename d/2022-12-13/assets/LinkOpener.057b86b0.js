import{t as c,v as o,r as i,j as s,a as e}from"./index.9f79e8fd.js";const l=async t=>{const r=t.slice(0,20),a=await c(t.slice(o)),n=(await window.crypto.subtle.exportKey("jwk",a)).k;return`https://excalidraw.com/#room=${r},${n}`},d=i.exports.memo(({roomId:t})=>{const[r,a]=i.exports.useState();i.exports.useEffect(()=>{(async()=>a(await l(t)))()},[t]);const n=`remote-faces://${window.location.href.replace(/^https:\/\//,"")}`;return s("div",{className:"LinkOpener-container",children:[s("div",{children:[e("span",{title:"Share this link with your colleagues",children:"Room Link: "}),e("input",{value:window.location.href,readOnly:!0})]}),e("div",{children:e("a",{href:n,title:"Open this link in the desktop app",children:"Open App"})}),e("div",{children:e("a",{href:r,target:"_blank",rel:"noreferrer",children:"Open Excalidraw"})})]})});export{d as default};
