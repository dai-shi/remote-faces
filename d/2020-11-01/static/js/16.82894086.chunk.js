(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[16],{1232:function(e,t,a){},1255:function(e,t,a){"use strict";a.r(t),a.d(t,"SpatialArea",(function(){return A}));var n=a(112),r=a(114),c=a(1),i=a.n(c),o=a(2),u=a(5),s=a(0),l=a.n(s),p=a(332),f=a(1246),v=a(1244),m=(a(1232),a(108)),b=a(125),d=function(e){try{var t=e;return"number"===typeof t.position[0]&&"number"===typeof t.position[1]&&"number"===typeof t.position[2]}catch(a){return!1}},O=function(e){return Object(m.c)(e)&&function(e){return Object(m.c)(e)&&Object.values(e).every(d)}(e.avatarMap)&&"number"===typeof e.updatedAt},j=function(e,t){var a=Object(s.useState)({}),n=Object(u.a)(a,2),c=n[0],i=n[1],o=Object(s.useRef)(),l=Object(s.useRef)(),p=Object(b.a)(e,t);return Object(s.useEffect)((function(){o.current={avatarMap:c,updatedAt:Date.now()};var e={spatialArea:"sync",areaData:o.current};l.current&&clearTimeout(l.current),l.current=setTimeout((function(){p(e)}),100)}),[p,c]),Object(b.b)(e,t,Object(s.useCallback)((function(e){var t;if(t=e,Object(m.c)(t)&&("init"===t.spatialArea||"sync"===t.spatialArea&&O(t.areaData)))if("init"!==e.spatialArea){var a=e.areaData;o.current&&o.current.updatedAt>a.updatedAt||i((function(e){var t=Object.keys(e),n=Object.keys(a.avatarMap);return t.length===n.length&&t.every((function(t){return n=e[t],r=a.avatarMap[t],n.position[0]===r.position[0]&&n.position[1]===r.position[1]&&n.position[2]===r.position[2];var n,r}))?e:Object(r.a)(Object(r.a)({},e),a.avatarMap)}))}else o.current&&p({spatialArea:"sync",areaData:o.current})}),[p])),Object(s.useEffect)((function(){p({spatialArea:"init"})}),[p]),{avatarMap:c,setAvatarMap:i}},E=a(333),k=a(523),M=a(206),S=l.a.memo((function(e){var t=e.nickname,a=e.faceStream,n=e.position,r=e.setPosition,c=Object(f.b)(),m=c.size,b=c.viewport,d=m.width/b.width,O=Object(v.a)((function(e){var t=Object(u.a)(e.delta,2),a=t[0],n=t[1];return r((function(e){return[e[0]+a/d,e[1]-n/d,0]}))}),{eventOptions:{pointer:!0}}),j=Object(s.useState)(),E=Object(u.a)(j,2),k=E[0],M=E[1];return Object(s.useEffect)((function(){var e=null===a||void 0===a?void 0:a.getVideoTracks()[0];if(e){var n=document.createElement("canvas"),r=new p.CanvasTexture(n);M(r);var c=new ImageCapture(e),u=n.getContext("2d"),s=setInterval(Object(o.a)(i.a.mark((function e(){var a;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,c.grabFrame();case 3:a=e.sent,n.width=a.width,n.height=a.height,u.drawImage(a,0,0),u.font="18px selif",u.textBaseline="top",u.fillStyle="blue",u.fillText(t,2,2),r.needsUpdate=!0,e.next=16;break;case 14:e.prev=14,e.t0=e.catch(0);case 16:case"end":return e.stop()}}),e,null,[[0,14]])}))),1e3/7.5);return function(){clearInterval(s)}}}),[t,a]),k?l.a.createElement("sprite",Object.assign({},O(),{position:n}),l.a.createElement("spriteMaterial",{map:k})):null})),h=function(e){return[parseInt(e.slice(0,2),16)/128-1,parseInt(e.slice(2,4),16)/128-1,0]},y=l.a.memo((function(e){var t=e.userId,a=e.nickname,c=e.faceStream,i=e.nicknameMap,o=e.faceStreamMap,u=e.avatarMap,p=e.setAvatarMap,v=function(e){var t;return(null===(t=u[e])||void 0===t?void 0:t.position)||h(e)},m=function(e){return function(t){p((function(a){var c;return Object(r.a)(Object(r.a)({},a),{},Object(n.a)({},e,Object(r.a)(Object(r.a)({},a[e]),{},{position:"function"===typeof t?t((null===(c=a[e])||void 0===c?void 0:c.position)||h(e)):t})))}))}};return l.a.createElement(f.a,null,l.a.createElement(s.Suspense,{fallback:null},l.a.createElement("ambientLight",null),Object.keys(o).map((function(e){return l.a.createElement(S,{key:e,nickname:i[e]||"",faceStream:o[e]||null,position:v(e),setPosition:m(e)})})),l.a.createElement(S,{nickname:a,faceStream:c,position:v(t),setPosition:m(t)})))})),A=l.a.memo((function(e){var t=e.roomId,a=e.userId,n=e.nickname,r=Object(E.b)(),c=Object(s.useState)(""),i=Object(u.a)(c,2),o=i[0],p=i[1],f=Object(E.a)(),v=Object(s.useState)(""),m=Object(u.a)(v,2),b=m[0],d=m[1],O=Object(k.a)(t,a,!!o,!!b,!!b,o,b,"spatialArea"),S=O.faceStream,h=O.faceStreamMap,A=Object(M.a)(t,a),g=j(t,a),w=g.avatarMap,I=g.setAvatarMap;return l.a.createElement("div",{className:"SpatialArea-container"},l.a.createElement("div",null,"Select Camera:"," ",l.a.createElement("select",{value:o,onChange:function(e){return p(e.target.value)}},l.a.createElement("option",{value:""},"None"),r.map((function(e){return l.a.createElement("option",{key:e.deviceId,value:e.deviceId},e.label)})))),l.a.createElement("div",null,"Select Mic:"," ",l.a.createElement("select",{value:b,onChange:function(e){d(e.target.value)}},l.a.createElement("option",{value:""},"None"),f.map((function(e){return l.a.createElement("option",{key:e.deviceId,value:e.deviceId},e.label)})))),l.a.createElement("div",{className:"SpatialArea-body"},l.a.createElement(y,{userId:a,nickname:n,faceStream:S,nicknameMap:A,faceStreamMap:h,avatarMap:w,setAvatarMap:I})))}));t.default=A}}]);
//# sourceMappingURL=16.82894086.chunk.js.map