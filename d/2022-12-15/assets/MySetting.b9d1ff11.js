import{r as s,f as t,q as f,j as a,a as e,F as l}from"./index.d63860f7.js";const h=24,S=s.exports.memo(()=>{const[r,g]=s.exports.useState(t.statusMesg),[o,p]=s.exports.useState(t.config.takePhoto),[c,u]=s.exports.useState(t.preference.photoSize===h),[i,d]=f("");return a("div",{className:"MySetting-container",children:[e("h3",{children:"Setting"}),a("label",{children:["Camera :"," ",e("button",{type:"button",onClick:()=>{p(!o)},children:o?"on":"off"})]}),o&&a(l,{children:[" ",a("label",{children:["Low resolution:"," ",e("input",{type:"checkbox",checked:c,onChange:()=>u(n=>!n)})]}),e("hr",{})]}),e("hr",{}),!o&&a(l,{children:[a("label",{children:["Avatar:"," ",e("input",{type:"file",accept:"image/*",onChange:n=>d(n.target.files)})]}),e("hr",{})]}),a("label",{children:["Message:"," ",e("input",{type:"text",defaultValue:r,onChange:n=>{g(n.target.value)}})]}),e("hr",{}),e("button",{type:"button",onClick:()=>{r&&(t.statusMesg=r),i&&(t.config.avatar=i),t.config.takePhoto=o,t.preference.photoSize=c?h:void 0},children:"update"})]})});export{S as default};
