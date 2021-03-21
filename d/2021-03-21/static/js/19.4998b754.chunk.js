(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[19],{1266:function(e,t,n){},1280:function(e,t,n){"use strict";n.r(t),n.d(t,"VideoShare",(function(){return p}));var c=n(4),a=n(0),r=n(1),i=n.n(r),u=(n(1266),n(2)),o=n.n(u),s=n(3),d=n(16),f=n(95),b=n(14),j=n(336),O=n(107),l="cameraVideo",v=n(19),m=n(202),h=i.a.memo((function(e){var t=e.nickname,n=e.stream,c=Object(r.useRef)(null);return Object(r.useEffect)((function(){n&&c.current&&(c.current.srcObject=n)}),[n]),Object(a.jsxs)("div",{children:[Object(a.jsx)("div",{className:"VideoShare-nickname",children:t}),Object(a.jsx)("video",{className:"VideoShare-video",ref:c,autoPlay:!0,muted:!0})]})})),p=i.a.memo((function(e){var t=e.roomId,n=e.userId,i=e.nickname,u=Object(v.b)(),p=Object(r.useState)(),k=Object(c.a)(p,2),S=k[0],x=k[1],E=Object(r.useState)(!1),y=Object(c.a)(E,2),g=y[0],M=y[1],w=function(e,t,n,a,i){var u=Object(r.useState)(null),v=Object(c.a)(u,2),m=v[0],h=v[1],p=Object(r.useState)({}),k=Object(c.a)(p,2),S=k[0],x=k[1],E=Object(r.useRef)([]);Object(r.useEffect)((function(){return function(){E.current.forEach((function(e){return e()}))}}),[]);var y=Object(b.e)(Object(O.a)(e,t).trackMap);return Object.entries(y[l]||{}).forEach((function(e){var t,n=Object(c.a)(e,2),a=n[0],r=n[1];if("ended"!==r.readyState&&!(null===(t=S[a])||void 0===t?void 0:t.getTracks().includes(r))){x((function(e){return Object(f.a)(Object(f.a)({},e),{},Object(d.a)({},a,new MediaStream([r])))}));var i=function(){x((function(e){return Object(f.a)(Object(f.a)({},e),{},Object(d.a)({},a,null))}))};r.addEventListener("ended",i),E.current.push((function(){r.removeEventListener("ended",i)}))}})),Object(r.useEffect)((function(){var n=Object(O.a)(e,t);return n.addMediaType(l),function(){n.removeMediaType(l)}}),[e,t]),Object(r.useEffect)((function(){var r=Object(O.a)(e,t),u=null;return n&&Object(s.a)(o.a.mark((function e(){var t,n,s,d,f;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(j.b)(i);case 2:t=e.sent,n=t.stream.getVideoTracks(),s=Object(c.a)(n,1),d=s[0],r.addTrack(l,d),h(t.stream),d.addEventListener("ended",(function(){u&&u(),u=null})),f=function(){r.removeTrack(l),t.dispose(),h(null),a(!1)},!1===u?f():u=f;case 9:case"end":return e.stop()}}),e)})))(),function(){u&&u(),u=!1}}),[e,t,i,n,a]),{videoStream:m,videoStreamMap:S}}(t,n,g,M,S),T=w.videoStream,V=w.videoStreamMap,N=Object(m.a)(t,n),I=(T?1:0)+Object.values(V).filter((function(e){return e})).length;return Object(a.jsxs)("div",{className:"VideoShare-container",children:[Object(a.jsxs)("div",{children:["Select Camera:"," ",Object(a.jsx)("select",{value:S,onChange:function(e){return x(e.target.value)},children:u.map((function(e){return Object(a.jsx)("option",{value:e.deviceId,children:e.label},e.deviceId)}))})]}),Object(a.jsx)("button",{type:"button",onClick:function(){return M(!g)},children:g?"Stop video share":"Start video share"}),Object(a.jsxs)("div",{className:"VideoShare-body",style:{gridTemplateColumns:"repeat(".concat(Math.ceil(Math.sqrt(I)),", 1fr)")},children:[T&&Object(a.jsx)(h,{nickname:i,stream:T}),Object.keys(V).map((function(e){var t=V[e];return t?Object(a.jsx)(h,{nickname:N[e]||"No Name",stream:t},e):null}))]})]})}));t.default=p},202:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var c=n(95),a=n(4),r=n(1),i=n(106),u=n(107),o=function(e,t){var n=Object(r.useState)({}),o=Object(a.a)(n,2),s=o[0],d=o[1];return Object(r.useEffect)((function(){var n=Object(u.a)(e,t).ydoc.getMap("faceImages"),a=function(){d((function(e){var a=Object(c.a)({},e),r=!1;return n.forEach((function(e,n){var c;n!==t&&(c=e,Object(i.c)(c)&&Object(i.c)(c.info)&&"string"===typeof c.info.nickname&&(a[n]?e.info.nickname!==a[n]&&(a[n]=e.info.nickname,r=!0):(a[n]=e.info.nickname,r=!0)))})),r?a:e}))};return n.observe(a),a(),function(){n.unobserve(a)}}),[e,t]),s}}}]);
//# sourceMappingURL=19.4998b754.chunk.js.map