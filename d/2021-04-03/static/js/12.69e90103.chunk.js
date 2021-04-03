(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[12],{105:function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));var a=n(14),r=n(2),c=n.n(r),i=n(3),s=n(6),o=n(1273),u=n(28),d=new Map,l=function(e,t){var n="".concat(e,":").concat(t);if(!d.has(n)){var r=function(e,t){var n=function(){var e=Object(i.a)(c.a.mark((function e(t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!p.acceptingMediaTypes.includes(t)){e.next=3;break}return console.log("media type already added",t),e.abrupt("return");case 3:return p.acceptingMediaTypes.push(t),e.next=6,b;case 6:e.sent.acceptMediaTypes(Object(s.snapshot)(p.acceptingMediaTypes));case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),r=function(){var e=Object(i.a)(c.a.mark((function e(t){var n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(-1!==(n=p.acceptingMediaTypes.indexOf(t))){e.next=4;break}return console.log("media type already added",t),e.abrupt("return");case 4:return p.acceptingMediaTypes.splice(n,1),e.next=7,b;case 7:e.sent.acceptMediaTypes(Object(s.snapshot)(p.acceptingMediaTypes));case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),d=function(){var e=Object(i.a)(c.a.mark((function e(t,n){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b;case 2:e.sent.addTrack(t,n);case 4:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),l=function(){var e=Object(i.a)(c.a.mark((function e(t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b;case 2:e.sent.removeTrack(t);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),f=function(){var e=Object(i.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b;case 2:e.sent.dispose();case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),p=Object(s.proxy)({networkStatusList:[],userIdMap:{},ydoc:Object(s.ref)(new o.a),acceptingMediaTypes:[],trackMap:{},addMediaType:n,removeMediaType:r,addTrack:d,removeTrack:l,dispose:f});p.ydoc.on("update",(function(e){var t=btoa(String.fromCharCode.apply(String,Object(a.a)(e)));b.then((function(e){e.broadcastData({ydocUpdate:t})}))}));var b=Object(u.b)(e,t,(function(e){console.log("[network status]",e),p.networkStatusList.unshift(e),p.networkStatusList.length>10&&p.networkStatusList.pop(),null===e||void 0===e||e.type}),(function(e){var t=o.c(p.ydoc),n={ydocUpdate:btoa(String.fromCharCode.apply(String,Object(a.a)(t)))};b.then((function(t){t.sendData(n,e)}))}),(function(e,t){if(p.userIdMap[t.userId]=t.peerIndex,null===e||void 0===e?void 0:e.ydocUpdate){var n=atob(e.ydocUpdate),a=new Uint8Array([].map.call(n,(function(e){return e.charCodeAt(0)})));o.b(p.ydoc,a)}}),(function(e,t,n){p.trackMap[e]||(p.trackMap[e]={}),t.addEventListener("ended",(function(){p.trackMap[e][n.userId]===t&&delete p.trackMap[e][n.userId]})),p.trackMap[e][n.userId]=Object(s.ref)(t)}));return p}(e,t);d.set(n,r)}return d.get(n)}},108:function(e,t,n){"use strict";n.d(t,"c",(function(){return a})),n.d(t,"b",(function(){return r})),n.d(t,"a",(function(){return c}));var a=function(e){return"object"===typeof e&&null!==e},r=function(e,t){return"string"===typeof e[t]},c=function(e,t){return a(e[t])}},1279:function(e,t,n){"use strict";n.r(t),n.d(t,"SingleRoom",(function(){return g}));var a=n(4),r=n(0),c=n(1),i=n.n(c),s=n(17),o=(n(540),n(8)),u=n(11),d=(n(541),n(542),i.a.memo((function(){return Object(r.jsx)("div",{className:"Loading-container",children:Object(r.jsx)("div",{className:"loader",children:Object(r.jsx)("div",{children:"Loading..."})})})}))),l=n(535),f=n(333),p=n(340),b=i.a.memo((function(e){var t=e.roomId,n=e.userId,a=e.avatar,c=e.nickname,i=e.statusMesg,s=e.suspended,o=e.liveMode,u=e.micOn,b=e.speakerOn,v=e.videoDeviceId,m=e.audioDeviceId,j=Object(l.a)(t,n,a,c,i,s,o,u,b,v),O=j.myImage,h=j.roomImages,g=Object(f.a)(t,n,o,o,u,v,m),k=g.faceStream,x=g.faceStreamMap,y=Date.now()-12e4;return Object(r.jsxs)("div",{className:"FaceImages-list",children:[Object(r.jsx)("div",{className:"FaceImages-item",children:Object(r.jsx)(p.a,{image:O,nickname:c,statusMesg:i,liveMode:o,stream:k||void 0,muted:!0,micOn:u,speakerOn:b})}),h.map((function(e){return Object(r.jsx)("div",{className:"FaceImages-item",children:Object(r.jsx)(p.a,{image:e.image,nickname:e.info.nickname,statusMesg:e.info.message,obsoleted:e.updated<y,liveMode:e.info.liveMode,stream:o&&x[e.userId]||void 0,muted:!b,micOn:e.info.micOn,speakerOn:e.info.speakerOn})},e.userId)})),!h.length&&Object(r.jsx)("div",{className:"FaceImages-item",children:Object(r.jsx)(d,{})})]})})),v=(n(547),i.a.memo((function(e){var t=e.suspended,n=e.toggleSuspended,a=e.liveMode,c=e.setLiveMode,i=e.setMicOn,s=e.setSpeakerOn,o=e.secondColumnOpen,u=e.setSecondColumnOpen;return Object(r.jsxs)("div",{className:"ControlPanel-container",children:[Object(r.jsxs)("button",{type:"button",onClick:n,title:t?"Enable Camera":"Disable Camera",children:["\ud83d\udcf7",t&&Object(r.jsx)("span",{className:"ControlPanel-disabled",children:"\u274c"})]}),Object(r.jsx)("button",{type:"button",onClick:function(){return u((function(e){return!e}))},title:o?"Close Right Pane":"Open Right Pane",children:o?Object(r.jsx)(r.Fragment,{children:"\u25c0"}):Object(r.jsx)(r.Fragment,{children:"\u25b6"})}),Object(r.jsxs)("button",{type:"button",onClick:function(){return c((function(e){return!e}))},title:a?"Disable Live Mode":"Enable Live Mode",children:["\ud83c\udfa5",!a&&Object(r.jsx)("span",{className:"ControlPanel-disabled",children:"\u274c"})]}),Object(r.jsxs)("div",{className:"ControlPanel-select",children:["\ud83c\udf9b",Object(r.jsxs)("select",{onChange:function(e){switch(e.target.value){case"off":s(!1),i(!1);break;case"speaker":s(!0),i(!1);break;case"mic":s(!0),i(!0);break;default:throw new Error("no option")}},children:[Object(r.jsx)("option",{value:"off",children:"Audio Off"}),Object(r.jsx)("option",{value:"speaker",children:"Speaker Only"}),Object(r.jsx)("option",{value:"mic",children:"Mic + Speaker"})]})]})]})}))),m=n(14),j=n(31),O=(n(548),{"Gather Area":i.a.lazy((function(){return n.e(16).then(n.bind(null,1280))})),Welcome:i.a.lazy((function(){return Promise.all([n.e(0),n.e(17)]).then(n.bind(null,1282))})),"Momentary Chat":i.a.lazy((function(){return Promise.all([n.e(0),n.e(3),n.e(4)]).then(n.bind(null,1281))})),"Spatial Area":i.a.lazy((function(){return Promise.all([n.e(14),n.e(20)]).then(n.bind(null,1283))})),"Screen Share":i.a.lazy((function(){return n.e(19).then(n.bind(null,1284))})),"White Board":i.a.lazy((function(){return n.e(22).then(n.bind(null,1278))})),"Video Share":i.a.lazy((function(){return n.e(23).then(n.bind(null,1285))})),"Go Board":i.a.lazy((function(){return Promise.all([n.e(6),n.e(5)]).then(n.bind(null,1286))}))}),h=i.a.memo((function(e){var t=e.roomId,n=e.userId,i=e.avatar,s=e.nickname,o=e.statusMesg,u=e.setStatusMesg,d=e.suspended,l=e.videoDeviceId,f=e.audioDeviceId,p=Object(c.useState)(["Gather Area"]),b=Object(a.a)(p,2),v=b[0],h=b[1];return Object(r.jsxs)("div",{className:"SelectivePane-container",children:[Object(r.jsxs)("div",{className:"SelectivePane-select",children:["\u2630",Object(r.jsx)("select",{multiple:!0,size:Object.keys(O).length,value:v,onChange:function(e){return t=e.target.value,void h((function(e){return e.includes(t)?e.filter((function(e){return e!==t})):[].concat(Object(m.a)(e),[t])}));var t},children:Object.keys(O).map((function(e){var t=v.indexOf(e);return t>=0?Object(r.jsx)("option",{value:e,children:"[".concat(t+1,"] ").concat(e)},e):Object(r.jsxs)("option",{value:e,children:["\xa0\xa0\xa0\xa0\xa0",e]},e)}))})]}),Object(r.jsx)("div",{className:"SelectivePane-body",children:v.map((function(e){return Object(r.jsx)(c.Suspense,{fallback:Object(r.jsx)(j.a,{}),children:Object(c.createElement)(O[e],{roomId:t,userId:n,avatar:i,nickname:s,statusMesg:o,setStatusMesg:u,suspended:d,videoDeviceId:l,audioDeviceId:f,uniqueId:void 0})},e)}))})]})})),g=i.a.memo((function(){var e=Object(s.useSnapshot)(o.b),t=e.roomId,n=e.userId,i=e.config,d=Object(c.useState)(""),l=Object(a.a)(d,2),f=l[0],p=l[1];Object(c.useEffect)((function(){Object(u.e)(t)}),[t]);var m=Object(c.useState)(!1),j=Object(a.a)(m,2),O=j[0],g=j[1],k=Object(c.useState)(!1),x=Object(a.a)(k,2),y=x[0],M=x[1],I=Object(c.useState)(!1),w=Object(a.a)(I,2),S=w[0],T=w[1],C=Object(c.useState)(!0),E=Object(a.a)(C,2),D=E[0],N=E[1];return Object(r.jsxs)("div",{className:"SingleRoom-container",children:[Object(r.jsxs)("div",{className:"SingleRoom-1st-column",children:[Object(r.jsx)(v,{suspended:!i.takePhoto,toggleSuspended:o.c,liveMode:O,setLiveMode:g,micOn:y,setMicOn:M,speakerOn:S,setSpeakerOn:T,secondColumnOpen:D,setSecondColumnOpen:N}),Object(r.jsx)(b,{roomId:t,userId:n,videoDeviceId:i.videoDeviceId,audioDeviceId:i.audioDeviceId,avatar:i.avatar,nickname:i.nickname,statusMesg:f,suspended:!i.takePhoto,liveMode:O,micOn:y,speakerOn:S})]}),Object(r.jsx)("div",{className:"SingleRoom-2nd-column",style:{display:D?"inherit":"none"},children:Object(r.jsx)(h,{roomId:t,userId:n,avatar:i.avatar,nickname:i.nickname,statusMesg:f,setStatusMesg:p,suspended:!i.takePhoto,videoDeviceId:i.videoDeviceId,audioDeviceId:i.audioDeviceId})})]})}));t.default=g},133:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var a=function(e){return new Promise((function(t){return setTimeout(t,e)}))}},237:function(e,t,n){"use strict";n.d(t,"b",(function(){return s})),n.d(t,"a",(function(){return o}));var a=n(2),r=n.n(a),c=n(4),i=n(3),s=function(){var e=Object(i.a)(r.a.mark((function e(t){var n,a,i,s,o,u;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t?{video:{deviceId:t}}:{video:!0},e.next=3,navigator.mediaDevices.getUserMedia(n);case 3:return a=e.sent,i=a.getVideoTracks(),s=Object(c.a)(i,1),o=s[0],u=function(){o.stop()},e.abrupt("return",{stream:a,dispose:u});case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),o=function(){var e=Object(i.a)(r.a.mark((function e(t){var n,a,i,s,o,u;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={video:{deviceId:t,frameRate:{max:5},width:{exact:72},height:{exact:72}}},e.next=3,navigator.mediaDevices.getUserMedia(n);case 3:return a=e.sent,i=a.getVideoTracks(),s=Object(c.a)(i,1),o=s[0],u=function(){o.stop()},e.abrupt("return",{stream:a,dispose:u});case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},333:function(e,t,n){"use strict";n.d(t,"a",(function(){return j}));var a=n(2),r=n.n(a),c=n(3),i=n(16),s=n(95),o=n(536),u=n(1275),d=n(4),l=n(1),f=n(17),p=n(237),b=function(){var e=Object(c.a)(r.a.mark((function e(t){var n,a,c,i,s,o;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t?{audio:{deviceId:t}}:{audio:!0},e.next=3,navigator.mediaDevices.getUserMedia(n);case 3:return a=e.sent,c=a.getAudioTracks(),i=Object(d.a)(c,1),s=i[0],e.next=7,s.applyConstraints({echoCancellation:!0,echoCancellationType:{ideal:"system"},noiseSuppression:{ideal:!0}});case 7:return o=function(){s.stop()},e.abrupt("return",{stream:a,dispose:o});case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),v=n(105),m=function(e,t,n){var a=t||new MediaStream;return a.addTrack(e),a.dispatchEvent(new MediaStreamTrackEvent("addtrack",{track:e})),e.addEventListener("ended",(function(){a.removeTrack(e),0===a.getTracks().length&&n(a)})),a},j=function(e,t,n,a,j,O,h,g){var k="".concat(g||"face","Video"),x="".concat(g||"face","Audio"),y=Object(l.useState)(null),M=Object(d.a)(y,2),I=M[0],w=M[1],S=Object(l.useState)({}),T=Object(d.a)(S,2),C=T[0],E=T[1],D=Object(l.useRef)(!0);Object(l.useEffect)((function(){return function(){D.current=!1}}),[]);var N=function(e){var t,n=Object(d.a)(e,2),a=n[0],r=n[1];if("ended"!==r.readyState&&!(null===(t=C[a])||void 0===t?void 0:t.getTracks().includes(r))){var c=function(e){D.current&&E((function(t){var n=t[a],r=Object(o.a)(t,[a].map(u.a));return n===e?r:t}))};E((function(e){var t=e[a],n=m(r,t,c);return t===n?e:Object(s.a)(Object(s.a)({},e),{},Object(i.a)({},a,n))}))}},P=Object(f.useSnapshot)(Object(v.a)(e,t).trackMap);return Object.entries(P[k]||{}).forEach(N),Object.entries(P[x]||{}).forEach(N),Object(l.useEffect)((function(){var a=Object(v.a)(e,t),i=null;return n&&Object(c.a)(r.a.mark((function e(){var t,n,c,s,o,u,l,f;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(p.a)(O);case 2:t=e.sent,n=t.stream,c=t.dispose,s=n.getVideoTracks(),o=Object(d.a)(s,1),u=o[0],a.addMediaType(k),a.addTrack(k,u),l=function(e){D.current&&w((function(t){return t===e?null:t}))},w((function(e){return m(u,e,l)})),f=function(){a.removeMediaType(k),a.removeTrack(k),c(),u.dispatchEvent(new Event("ended"))},!1===i?f():i=f;case 12:case"end":return e.stop()}}),e)})))(),function(){i&&i(),i=!1}}),[e,t,n,O,k]),Object(l.useEffect)((function(){var n=Object(v.a)(e,t),i=null;return a&&Object(c.a)(r.a.mark((function e(){var t,a,c,s,o,u,l,f;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b(h);case 2:t=e.sent,a=t.stream,c=t.dispose,s=a.getAudioTracks(),o=Object(d.a)(s,1),u=o[0],n.addMediaType(x),n.addTrack(x,u),l=function(e){D.current&&w((function(t){return t===e?null:t}))},w((function(e){return m(u,e,l)})),f=function(){n.removeMediaType(x),n.removeTrack(x),c(),u.dispatchEvent(new Event("ended"))},!1===i?f():i=f;case 12:case"end":return e.stop()}}),e)})))(),function(){i&&i(),i=!1}}),[e,t,a,h,x]),Object(l.useEffect)((function(){if(I){I.getAudioTracks().forEach((function(e){e.enabled=j}));var e=function(e){var t=e.track;"audio"===t.kind&&(t.enabled=j)};return I.addEventListener("addtrack",e),function(){I.removeEventListener("addtrack",e)}}}),[I,j]),{faceStream:I,faceStreamMap:C}}},340:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var a=n(14),r=n(0),c=n(1),i=n.n(c),s=(n(546),n(37)),o=i.a.memo((function(e){var t=e.image,n=e.nickname,c=e.statusMesg,i=e.obsoleted,o=e.liveMode,u=e.stream,d=e.muted,l=e.micOn,f=e.speakerOn;return Object(r.jsxs)("div",{className:"FaceCard-container",style:{opacity:i?.2:1},children:[o&&!i&&u?Object(r.jsx)("video",{className:"FaceCard-photo",ref:function(e){e&&e.srcObject!==u&&(e.srcObject=u)},autoPlay:!0,playsInline:!0,muted:d}):Object(r.jsx)("img",{src:t||s.a,className:"FaceCard-photo",alt:"faceImage"}),Object(r.jsx)("div",{className:"FaceCard-name",children:n}),Object(r.jsx)("div",{className:"FaceCard-mesg",title:Object(a.a)(c)[1]?c:"(No status message)",children:Object(a.a)(c)[0]}),o&&!i&&u&&Object(r.jsx)("div",{className:"FaceCard-live-indicator",title:"Live Mode On",children:"\u25c9"}),o&&!i&&!u&&Object(r.jsx)("div",{className:"FaceCard-live-indicator",title:"Live Mode Available",children:"\u25ce"}),o&&!i&&Object(r.jsxs)("div",{className:"FaceCard-mic-speaker-icons",children:[l&&Object(r.jsx)("span",{title:"Mic On",children:"\ud83c\udfa4"}),f&&Object(r.jsx)("span",{title:"Speaker On",children:"\ud83d\udd08"})]})]})}))},535:function(e,t,n){"use strict";n.d(t,"a",(function(){return m}));var a=n(2),r=n.n(a),c=n(3),i=n(14),s=n(4),o=n(1),u=n(6),d=n(108),l=n(133),f=function(){var e=Object(c.a)(r.a.mark((function e(t,n){var a,c,i,s,o,u,d,f,p,b;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("undefined"===typeof ImageCapture){e.next=21;break}return a=new ImageCapture(n),e.next=4,Object(l.a)(2e3);case 4:return e.prev=4,e.next=7,a.takePhoto();case 7:return i=e.sent,e.next=10,createImageBitmap(i);case 10:c=e.sent,e.next=18;break;case 13:return e.prev=13,e.t0=e.catch(4),e.next=17,a.grabFrame();case 17:c=e.sent;case 18:return s=c.width,o=c.height,e.abrupt("return",{srcImg:c,srcW:s,srcH:o});case 21:return(u=document.createElement("video")).autoplay=!0,u.setAttribute("playsinline",""),u.style.display="block",u.style.width="1px",u.style.height="1px",u.style.position="absolute",u.style.bottom="0",document.body.appendChild(u),d=function(){document.body.removeChild(u)},u.srcObject=t,e.next=34,Object(l.a)(2e3);case 34:return f=u,p=u.videoWidth,b=u.videoHeight,e.abrupt("return",{srcImg:f,srcW:p,srcH:b,dispose:d});case 38:case"end":return e.stop()}}),e,null,[[4,13]])})));return function(t,n){return e.apply(this,arguments)}}(),p=function(){var e=Object(c.a)(r.a.mark((function e(t){var n,a,c,i,o,u,d,l,p,b,v,m,j,O,h,g,k,x,y;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t?{video:{deviceId:t}}:{video:!0},e.next=3,navigator.mediaDevices.getUserMedia(n);case 3:return a=e.sent,c=a.getVideoTracks(),i=Object(s.a)(c,1),o=i[0],u=document.createElement("canvas"),d=u.getContext("2d"),l=72,p=72,u.width=l,u.height=p,e.next=13,f(a,o);case 13:return b=e.sent,v=b.srcImg,m=b.srcW,j=b.srcH,O=b.dispose,h=Math.max(l/m,p/j),g=Math.min(m,l/h),k=Math.min(j,p/h),x=(m-g)/2,y=(j-k)/2,d.drawImage(v,x,y,g,k,0,0,l,p),O&&O(),o.stop(),e.abrupt("return",u.toDataURL("image/jpeg"));case 27:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),b=n(105),v=function(e){return Object(d.c)(e)&&"string"===typeof e.image&&function(e){return Object(d.c)(e)&&"string"===typeof e.nickname&&"string"===typeof e.message&&"boolean"===typeof e.liveMode&&"boolean"===typeof e.micOn&&"boolean"===typeof e.speakerOn}(e.info)&&"number"===typeof e.updated},m=function(e,t,n,a,d,l,f,m,j,O){var h=Object(o.useState)(),g=Object(s.a)(h,2),k=g[0],x=g[1],y=Object(o.useState)([]),M=Object(s.a)(y,2),I=M[0],w=M[1];return Object(o.useEffect)((function(){var n=Object(b.a)(e,t),a=n.ydoc.getMap("faceImages"),r=function(){w((function(e){var r=Object(i.a)(e),c=!1;a.forEach((function(e,a){if(a!==t&&n.userIdMap[a]&&v(e)){var i=r.findIndex((function(e){return e.userId===a}));-1===i?(r.push(e),c=!0):e.updated>r[i].updated&&(r[i]=e,c=!0)}}));var s=Date.now()-6e5,o=r.filter((function(e){return e.updated>=s&&n.userIdMap[e.userId]}));return(c=c||r.length!==o.length)?o:e}))};a.observe(r);var c=Object(u.subscribe)(n.userIdMap,r);return r(),function(){c(),a.unobserve(r)}}),[e,t]),Object(o.useEffect)((function(){var i,s=Object(b.a)(e,t).ydoc.getMap("faceImages"),o=!1,u=function(){var e=Object(c.a)(r.a.mark((function e(){var c,b;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!o){e.next=2;break}return e.abrupt("return");case 2:if(e.prev=2,!l){e.next=7;break}e.t0=n,e.next=10;break;case 7:return e.next=9,p(O);case 9:e.t0=e.sent;case 10:if(c=e.t0,!o){e.next=13;break}return e.abrupt("return");case 13:x(c),b={userId:t,image:c,info:{nickname:a,message:d,liveMode:f,micOn:m,speakerOn:j},updated:Date.now()},s.set(t,b),e.next=22;break;case 19:e.prev=19,e.t1=e.catch(2),console.error(e.t1);case 22:i=setTimeout(u,12e4);case 23:case"end":return e.stop()}}),e,null,[[2,19]])})));return function(){return e.apply(this,arguments)}}();return u(),function(){o=!0,clearTimeout(i)}}),[e,t,O,n,a,d,l,f,m,j]),{myImage:k,roomImages:I}}},540:function(e,t,n){},541:function(e,t,n){},542:function(e,t,n){},546:function(e,t,n){},547:function(e,t,n){},548:function(e,t,n){}}]);
//# sourceMappingURL=12.69e90103.chunk.js.map