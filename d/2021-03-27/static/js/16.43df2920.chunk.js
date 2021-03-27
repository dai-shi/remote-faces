(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[16],{1257:function(e,t,n){},1282:function(e,t,n){"use strict";n.r(t),n.d(t,"SpatialArea",(function(){return M}));var a=n(96),r=n(2),c=n.n(r),i=n(3),o=n(4),u=n(0),s=n(1),d=n.n(s),f=n(202),v=n(533),b=n(1265),l=n(1272),p=(n(1257),n(6)),j=n(108),m=n(20),O=n(331),h=n(203),g=n(134),x=d.a.memo((function(e){var t=e.nickname,n=e.faceStream,r=e.statusMesg,d=e.position,p=e.setPosition,j=e.distance,m=e.muted,O=!!p,h=Object(v.b)(),x=h.size,k=h.viewport,M=x.width/k.width,w=Object(s.useRef)(),y=Object(b.a)((function(e){var t=e.first,n=Object(o.a)(e.initial,2),a=n[0],r=n[1],c=Object(o.a)(e.xy,2),i=c[0],u=c[1];t&&(w.current=d);var s=w.current,f=Object(o.a)(s,2),v=f[0],b=f[1];p&&p([v+(i-a)/M,b-(u-r)/M,0])})),S=function(e){var t=Object(s.useState)(),n=Object(o.a)(t,2),a=n[0],r=n[1];Object(s.useEffect)((function(){if(e){var t=e,n=function(){r(t.getVideoTracks()[0])};return e.addEventListener("addtrack",n),n(),function(){return e.removeEventListener("addtrack",n)}}}),[e]),Object(s.useEffect)((function(){a&&a.addEventListener("ended",(function(){r(void 0)}))}),[a]);var c=Object(s.useState)(),i=Object(o.a)(c,2),u=i[0],d=i[1];return Object(s.useEffect)((function(){if(a){var e=document.createElement("video");e.autoplay=!0,e.srcObject=new MediaStream([a]);var t=new f.VideoTexture(e);d(t)}}),[a]),u}(n),E=function(e,t){var n=Object(s.useState)(),a=Object(o.a)(n,2),r=a[0],u=a[1];Object(s.useEffect)((function(){if(e){var t=e,n=function(){u(t.getAudioTracks()[0])};return e.addEventListener("addtrack",n),n(),function(){return e.removeEventListener("addtrack",n)}}}),[e]),Object(s.useEffect)((function(){r&&r.addEventListener("ended",(function(){u(void 0)}))}),[r]);var d=Object(s.useRef)(null),f=Object(s.useRef)(.5),v=Object(s.useState)(null),b=Object(o.a)(v,2),l=b[0],p=b[1],j=Object(s.useCallback)((function(e){d.current?(p(e),d.current(e)):(p(null),f.current=e)}),[]);return Object(s.useEffect)((function(){if(!t&&r){var e=new AudioContext,n=e.createMediaStreamDestination(),a=e.createMediaStreamSource(new MediaStream([r])),o=e.createGain();o.gain.value=f.current,p(f.current),d.current=function(t){o.gain.setValueAtTime(t,e.currentTime)},a.connect(o),o.connect(n);var u=n.stream.getAudioTracks()[0],s=document.createElement("video");return s.autoplay=!0,s.setAttribute("playsinline",""),s.style.display="block",s.style.width="1px",s.style.height="1px",s.style.position="absolute",s.style.bottom="0px",document.body.appendChild(s),Object(i.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=MediaStream,e.next=3,Object(g.b)(u);case 3:e.t1=e.sent,e.t2=[e.t1],s.srcObject=new e.t0(e.t2);case 6:case"end":return e.stop()}}),e)})))(),function(){d.current=null,p(null),e.close(),u.dispatchEvent(new Event("ended")),document.body.removeChild(s)}}}),[t,r]),[l,j]}(n,O),I=Object(o.a)(E,2),A=I[0],C=I[1];return Object(s.useEffect)((function(){if(void 0===j||m)C(0);else{var e=Math.max(0,j-.2);C(Math.min(1,Math.max(0,1/(e*e)-.1)))}}),[m,j,C]),S?Object(u.jsxs)(u.Fragment,{children:[Object(u.jsx)("sprite",Object(a.a)(Object(a.a)({},O&&y()),{},{position:d,children:Object(u.jsx)("spriteMaterial",{map:S})})),Object(u.jsx)(l.a,{color:"blue",fontSize:.3,anchorX:"left",anchorY:"top",position:[d[0]-.5,d[1]+.5,d[2]],children:t}),Object(u.jsx)(l.a,{color:"darkgreen",fontSize:.3,anchorX:"left",anchorY:"middle",font:"https://fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Bold.woff",position:[d[0]-.5,d[1],d[2]],children:r}),null!==A&&Object(u.jsx)(l.a,{color:"red",fontSize:.3,anchorX:"left",anchorY:"bottom",position:[d[0]-.5,d[1]-.5,d[2]],children:A.toFixed(2)})]}):null})),k=d.a.memo((function(e){var t=e.userId,n=e.nickname,r=e.statusMesg,c=e.faceStream,i=e.nicknameMap,o=e.faceStreamMap,d=e.avatarMap,f=e.myAvatar,b=e.setMyAvatar,l=function(e){var t;return(null===(t=d[e])||void 0===t?void 0:t.statusMesg)||""},p=function(e){var t;return(null===(t=d[e])||void 0===t?void 0:t.position)||[0,0,0]},j=(null===f||void 0===f?void 0:f.position)||[0,0,0];return Object(u.jsx)(v.a,{children:Object(u.jsxs)(s.Suspense,{fallback:null,children:[Object(u.jsx)("ambientLight",{}),Object.keys(o).map((function(e){if(e===t)return null;var n=p(e),a=Math.hypot(n[0]-j[0],n[1]-j[1],n[2]-j[2]);return Object(u.jsx)(x,{nickname:i[e]||"",faceStream:o[e]||null,statusMesg:l(e),position:p(e),distance:a},e)})),Object(u.jsx)(x,{nickname:n,faceStream:c,statusMesg:r,position:j,setPosition:function(e){b((function(t){return Object(a.a)(Object(a.a)({},t),{},{position:e})}))},muted:!0})]})})})),M=d.a.memo((function(e){var t=e.roomId,n=e.userId,r=e.nickname,c=e.statusMesg,i=Object(m.b)(),d=Object(s.useState)(""),f=Object(o.a)(d,2),v=f[0],b=f[1],l=Object(m.a)(),g=Object(s.useState)(""),x=Object(o.a)(g,2),M=x[0],w=x[1],y=Object(O.a)(t,n,!!v,!!M,!!M,v,M,"spatialArea"),S=y.faceStream,E=y.faceStreamMap,I=Object(h.a)(t,n),A=function(e,t,n){var r,c=Object(s.useState)({}),i=Object(o.a)(c,2),u=i[0],d=i[1],f=Object(s.useState)({statusMesg:n,position:(r=t,[parseInt(r.slice(0,2),16)/128-1,parseInt(r.slice(2,4),16)/128-1,0])}),v=Object(o.a)(f,2),b=v[0],l=v[1];Object(s.useEffect)((function(){l((function(e){return e.statusMesg===n?e:Object(a.a)(Object(a.a)({},e),{},{statusMesg:n})}))}),[n]),Object(s.useEffect)((function(){var n=Object(j.a)(e,t),r=n.ydoc.getMap("spatialArea"),c=function(){d((function(e){var c=Object(a.a)({},e),i=!1;return r.forEach((function(e,a){var r,o;a!==t&&n.userIdMap[a]&&function(e){try{var t=e;return"string"===typeof t.statusMesg&&"number"===typeof t.position[0]&&"number"===typeof t.position[1]&&"number"===typeof t.position[2]}catch(n){return!1}}(e)&&(c[a]?(r=e,o=c[a],(r.statusMesg!==o.statusMesg||r.position[0]!==o.position[0]||r.position[1]!==o.position[1]||r.position[2]!==o.position[2])&&(c[a]=e,i=!0)):(c[a]=e,i=!0))})),Object.keys(c).forEach((function(e){n.userIdMap[e]||(delete c[e],i=!0)})),i?c:e}))};r.observe(c);var i=Object(p.subscribe)(n.userIdMap,c);return c(),function(){i(),r.unobserve(c)}}),[e,t]);var m=Object(s.useRef)();return Object(s.useEffect)((function(){b&&(m.current?m.current=b:(m.current=b,setTimeout((function(){Object(j.a)(e,t).ydoc.getMap("spatialArea").set(t,m.current),m.current=void 0}),500)))}),[e,t,b]),{avatarMap:u,myAvatar:b,setMyAvatar:l}}(t,n,c),C=A.avatarMap,L=A.myAvatar,T=A.setMyAvatar;return Object(u.jsxs)("div",{className:"SpatialArea-container",children:[Object(u.jsxs)("div",{children:["Select Camera:"," ",Object(u.jsxs)("select",{value:v,onChange:function(e){return b(e.target.value)},children:[Object(u.jsx)("option",{value:"",children:"None"}),i.map((function(e){return Object(u.jsx)("option",{value:e.deviceId,children:e.label},e.deviceId)}))]})]}),Object(u.jsxs)("div",{children:["Select Mic:"," ",Object(u.jsxs)("select",{value:M,onChange:function(e){w(e.target.value)},children:[Object(u.jsx)("option",{value:"",children:"None"}),l.map((function(e){return Object(u.jsx)("option",{value:e.deviceId,children:e.label},e.deviceId)}))]})]}),Object(u.jsx)("div",{className:"SpatialArea-body",children:Object(u.jsx)(k,{userId:n,nickname:r,statusMesg:c,faceStream:S,nicknameMap:I,faceStreamMap:E,avatarMap:C,myAvatar:L,setMyAvatar:T})})]})}));t.default=M},134:function(e,t,n){"use strict";n.d(t,"c",(function(){return u})),n.d(t,"b",(function(){return s})),n.d(t,"d",(function(){return d})),n.d(t,"a",(function(){return v}));var a=n(4),r=n(2),c=n.n(r),i=n(3),o=new WeakMap,u=function(e,t){if(o.has(e))return e;o.set(e,!0);var n=function n(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1e3;if("ended"!==e.readyState){var r=t.getTransceivers().find((function(t){return t.receiver.track===e}));!r||"inactive"!==r.currentDirection&&"sendonly"!==r.currentDirection?a<64e3&&setTimeout((function(){n(2*a)}),a):(e.stop(),e.dispatchEvent(new Event("ended")))}};return e.addEventListener("mute",(function(){return n()})),e},s=function(e){return new Promise(function(){var t=Object(i.a)(c.a.mark((function t(n,a){var r,i,o,u;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,r=new RTCPeerConnection,i=new RTCPeerConnection,r.addEventListener("icecandidate",(function(e){var t=e.candidate;t&&i.addIceCandidate(t)})),i.addEventListener("icecandidate",(function(e){var t=e.candidate;t&&r.addIceCandidate(t)})),i.addEventListener("track",(function(e){n(e.track)})),e.addEventListener("ended",(function(){r.close(),i.close()})),r.addTrack(e),t.next=10,r.createOffer();case 10:return o=t.sent,t.next=13,r.setLocalDescription(o);case 13:return t.next=15,i.setRemoteDescription(o);case 15:return t.next=17,i.createAnswer();case 17:return u=t.sent,t.next=20,i.setLocalDescription(u);case 20:return t.next=22,r.setRemoteDescription(u);case 22:t.next=27;break;case 24:t.prev=24,t.t0=t.catch(0),a(t.t0);case 27:case"end":return t.stop()}}),t,null,[[0,24]])})));return function(e,n){return t.apply(this,arguments)}}())},d=function(){var e=Object(i.a)(c.a.mark((function e(t){var n,a,r,o;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("video"===t.kind){e.next=2;break}throw new Error("track kind is not video");case 2:return n=document.createElement("canvas"),a=n.getContext("2d"),r=new ImageCapture(t),o=function(){var e=Object(i.a)(c.a.mark((function e(){var t;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,r.grabFrame();case 3:return t=e.sent,n.width=t.width,n.height=t.height,a.drawImage(t,0,0),e.abrupt("return",n.toDataURL("image/jpeg"));case 10:return e.prev=10,e.t0=e.catch(0),console.log("failed to grab frame from viedeo track",e.t0),e.abrupt("return",null);case 14:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(){return e.apply(this,arguments)}}(),e.abrupt("return",{getImage:o});case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),f=function(e){return new Promise((function(t,n){var a=new Image;a.onload=function(){return t(a)},a.onerror=n,a.src=e}))},v=function(){var e=document.createElement("canvas"),t=e.getContext("2d"),n=e.captureStream().getVideoTracks();return{videoTrack:Object(a.a)(n,1)[0],setImage:function(){var n=Object(i.a)(c.a.mark((function n(a){var r;return c.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,f(a);case 2:r=n.sent,e.width=r.width,e.height=r.height,t.drawImage(r,0,0);case 6:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}()}}},203:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var a=n(96),r=n(4),c=n(1),i=n(107),o=n(108),u=function(e,t){var n=Object(c.useState)({}),u=Object(r.a)(n,2),s=u[0],d=u[1];return Object(c.useEffect)((function(){var n=Object(o.a)(e,t).ydoc.getMap("faceImages"),r=function(){d((function(e){var r=Object(a.a)({},e),c=!1;return n.forEach((function(e,n){var a;n!==t&&(a=e,Object(i.c)(a)&&Object(i.c)(a.info)&&"string"===typeof a.info.nickname&&(r[n]?e.info.nickname!==r[n]&&(r[n]=e.info.nickname,c=!0):(r[n]=e.info.nickname,c=!0)))})),c?r:e}))};return n.observe(r),r(),function(){n.unobserve(r)}}),[e,t]),s}}}]);
//# sourceMappingURL=16.43df2920.chunk.js.map