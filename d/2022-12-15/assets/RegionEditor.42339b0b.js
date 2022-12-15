import{r as n,j as a,a as t,F as h}from"./index.d63860f7.js";import{g as D}from"./SingleRoom.d949dbd7.js";const j=n.exports.memo(({roomId:p,userId:b})=>{const r=D(p,b),[i,v]=n.exports.useState(""),[s,m]=n.exports.useState("meeting"),[u,R]=n.exports.useState(100),[c,x]=n.exports.useState(100),[g,y]=n.exports.useState(100),[d,C]=n.exports.useState(100),f=()=>{const e={type:s,position:[u,c],size:[g,d]};r.gatherRegionMap[i]=e},[o,l]=n.exports.useState(null),S=()=>{l(JSON.stringify(r.gatherRegionMap,null,2))};return a("div",{className:"RegionEditor-container",children:[a("label",{children:["Region ID:"," ",t("input",{value:i,onChange:e=>v(e.target.value)})]}),a("label",{children:["Type:"," ",a("select",{value:s,onChange:e=>m(e.target.value),children:[t("option",{value:"meeting",children:"Meeting"}),t("option",{value:"chat",children:"Chat"}),t("option",{value:"media",children:"Media"}),t("option",{value:"goboard",children:"Go Board"})]})]}),t("br",{}),a("label",{children:["Left:"," ",t("input",{type:"number",value:u,onChange:e=>R(Number(e.target.value))})]}),a("label",{children:["Top:"," ",t("input",{type:"number",value:c,onChange:e=>x(Number(e.target.value))})]}),a("label",{children:["Width:"," ",t("input",{type:"number",value:g,onChange:e=>y(Number(e.target.value))})]}),a("label",{children:["Height:"," ",t("input",{type:"number",value:d,onChange:e=>C(Number(e.target.value))})]}),t("br",{}),t("button",{type:"button",onClick:f,disabled:!i,children:"Add Region (Or overwrite)"}),t("hr",{}),a("button",{type:"button",className:"RegionEditor-toggle",onClick:()=>{o?l(null):S()},children:["Import/Export ",o?t(h,{children:"\u25BC"}):t(h,{children:"\u25B6"})]}),!!o&&a("div",{children:[t("label",{children:t("textarea",{value:o,onChange:e=>l(e.target.value)})}),t("br",{}),t("button",{type:"button",onClick:()=>{try{Object.entries(JSON.parse(o||"")).forEach(([e,N])=>{r.gatherRegionMap[e]=N}),l(null)}catch(e){console.log("failed to save all region data",e)}},children:"Replace (Be careful)"})]})]})});export{j as default};
