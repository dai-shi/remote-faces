(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[5],{100:function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));var r=function(e){return new Promise((function(t){return setTimeout(t,e)}))}},111:function(e,t,n){"use strict";n.d(t,"d",(function(){return f})),n.d(t,"e",(function(){return b})),n.d(t,"a",(function(){return j})),n.d(t,"b",(function(){return m})),n.d(t,"c",(function(){return p}));var r=n(5),a=n(1),c=n.n(a),i=n(3),s=n(2),o=n(19),u=function(){var e=Object(i.a)(c.a.mark((function e(t,n){var r,a,i,s,u,d,l,f,b,j;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=new Set,a=new Set,i=new Set,s=new Map,u=new Map,d=function(e){r.forEach((function(t){t(e)}))},l=function(e){a.forEach((function(t){t(e)}))},f=function(e,t){i.forEach((function(n){n(e,t)}))},b=function(e,t,n){var r=u.get(e);r||(r=new Set,u.set(e,r)),r.add({track:t,info:n});var a=s.get(e);a&&a.forEach((function(e){e(t,n)}))},e.next=11,Object(o.b)(t,n,d,l,f,b);case 11:return j=e.sent,e.abrupt("return",{room:j,networkStatusListeners:r,newPeerListeners:a,dataListeners:i,trackListeners:s,trackCache:u,count:0});case 13:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),d=new Map,l=function(){var e=Object(i.a)(c.a.mark((function e(t,n,r){var a,i,s,o,l,f,b,j,m,p;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a="".concat(t,"_").concat(n),d.has(a)||d.set(a,u(t,n)),e.next=4,d.get(a);case 4:return i=e.sent,r.networkStatusListener&&i.networkStatusListeners.add(r.networkStatusListener),r.newPeerListener&&i.newPeerListeners.add(r.newPeerListener),r.dataListener&&i.dataListeners.add(r.dataListener),r.trackListener&&(s=r.trackListener,o=s.mediaType,l=s.listener,f=new Set(i.trackListeners.keys()),b=f.size,(j=i.trackListeners.get(o))||(j=new Set,i.trackListeners.set(o,j)),j.add(l),f.add(o),b!==f.size&&i.room.acceptMediaTypes(Array.from(f)),(m=i.trackCache.get(o))&&m.forEach((function(e){"ended"!==e.track.readyState?l(e.track,e.info):m.delete(e)}))),i.count+=1,p=function(){if(r.networkStatusListener&&i.networkStatusListeners.delete(r.networkStatusListener),r.newPeerListener&&i.newPeerListeners.delete(r.newPeerListener),r.dataListener&&i.dataListeners.delete(r.dataListener),r.trackListener){var e=r.trackListener,t=e.mediaType,n=e.listener,c=i.trackListeners.get(t);c&&(c.delete(n),0===c.size&&(i.trackListeners.delete(t),i.room.acceptMediaTypes(Array.from(i.trackListeners.keys()))))}i.count-=1,i.count<=0&&(i.room.dispose(),d.delete(a))},e.abrupt("return",{broadcastData:i.room.broadcastData,sendData:i.room.sendData,addTrack:i.room.addTrack,removeTrack:i.room.removeTrack,unregister:p});case 12:case"end":return e.stop()}}),e)})));return function(t,n,r){return e.apply(this,arguments)}}(),f=function(e,t,n){var a=Object(s.useState)(),o=Object(r.a)(a,2),u=o[0],d=o[1];if(u&&"UNKNOWN_ERROR"===u.type)throw new Error("Network Error: ".concat(u.err.message));return Object(s.useEffect)((function(){var r=function(){};return Object(i.a)(c.a.mark((function a(){var i,s;return c.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,l(e,t,{networkStatusListener:function(e){d(e),n&&n(e)}});case 2:i=a.sent,s=i.unregister,r=s;case 5:case"end":return a.stop()}}),a)})))(),function(){r()}}),[e,t,n]),u},b=function(e,t,n){Object(s.useEffect)((function(){var r=function(){};return Object(i.a)(c.a.mark((function a(){var i,s,o;return c.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,l(e,t,{newPeerListener:function(e){n((function(t){return o(t,e)}))}});case 2:i=a.sent,s=i.unregister,o=i.sendData,r=s;case 6:case"end":return a.stop()}}),a)})))(),function(){r()}}),[e,t,n])},j=function(e,t){var n=Object(s.useRef)(),r=Object(s.useCallback)((function(){n.current&&n.current.apply(n,arguments)}),[]);return Object(s.useEffect)((function(){var r=function(){};return Object(i.a)(c.a.mark((function a(){var i;return c.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,l(e,t,{});case 2:i=a.sent,n.current=i.broadcastData,r=i.unregister;case 5:case"end":return a.stop()}}),a)})))(),function(){r()}}),[e,t]),r},m=function(e,t,n){Object(s.useEffect)((function(){var r=function(){};return Object(i.a)(c.a.mark((function a(){var i,s;return c.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,l(e,t,{dataListener:n});case 2:i=a.sent,s=i.unregister,r=s;case 5:case"end":return a.stop()}}),a)})))(),function(){r()}}),[e,t,n])},p=function(e,t,n,a){var o=Object(s.useState)(),u=Object(r.a)(o,2),d=u[0],f=u[1];return Object(s.useEffect)((function(){var r=function(){};return a&&Object(i.a)(c.a.mark((function i(){var s;return c.a.wrap((function(c){for(;;)switch(c.prev=c.next){case 0:return c.next=2,l(e,t,{trackListener:{mediaType:a,listener:n}});case 2:s=c.sent,f((function(){return function(e){return s.addTrack(a,e),function(){return s.removeTrack(a)}}})),r=function(){f(void 0),s.unregister()};case 5:case"end":return c.stop()}}),i)})))(),function(){r()}}),[e,t,n,a]),d}},1250:function(e,t,n){"use strict";n.r(t),n.d(t,"SingleRoom",(function(){return re}));var r=n(5),a=n(0),c=n(2),i=n.n(c),s=(n(520),n(4)),o=function(e,t){try{window.localStorage.setItem(e,t)}catch(n){console.info("Failed to save string to localStorage",n)}},u=function(e){try{return window.localStorage.getItem(e)||""}catch(t){return""}},d=n(191),l=n(140),f=(n(521),n(1)),b=n.n(f),j=n(3),m=n(97),p=n(95),O=n(100),v=function(){var e=Object(j.a)(b.a.mark((function e(t,n){var r,a,c,i,s,o,u,d,l,f;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("undefined"===typeof ImageCapture){e.next=21;break}return r=new ImageCapture(n),e.next=4,Object(O.a)(2e3);case 4:return e.prev=4,e.next=7,r.takePhoto();case 7:return c=e.sent,e.next=10,createImageBitmap(c);case 10:a=e.sent,e.next=18;break;case 13:return e.prev=13,e.t0=e.catch(4),e.next=17,r.grabFrame();case 17:a=e.sent;case 18:return i=a.width,s=a.height,e.abrupt("return",{srcImg:a,srcW:i,srcH:s});case 21:return(o=document.createElement("video")).autoplay=!0,o.setAttribute("playsinline",""),o.style.display="block",o.style.width="1px",o.style.height="1px",o.style.position="absolute",o.style.bottom="0",document.body.appendChild(o),u=function(){document.body.removeChild(o)},o.srcObject=t,e.next=34,Object(O.a)(2e3);case 34:return d=o,l=o.videoWidth,f=o.videoHeight,e.abrupt("return",{srcImg:d,srcW:l,srcH:f,dispose:u});case 38:case"end":return e.stop()}}),e,null,[[4,13]])})));return function(t,n){return e.apply(this,arguments)}}(),A=function(){var e=Object(j.a)(b.a.mark((function e(t){var n,a,c,i,s,o,u,d,l,f,j,m,p,O,A,h,g,k,x;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t?{video:{deviceId:t}}:{video:!0},e.next=3,navigator.mediaDevices.getUserMedia(n);case 3:return a=e.sent,c=a.getVideoTracks(),i=Object(r.a)(c,1),s=i[0],o=document.createElement("canvas"),u=o.getContext("2d"),d=72,l=72,o.width=d,o.height=l,e.next=13,v(a,s);case 13:return f=e.sent,j=f.srcImg,m=f.srcW,p=f.srcH,O=f.dispose,A=Math.max(d/m,l/p),h=Math.min(m,d/A),g=Math.min(p,l/A),k=(m-h)/2,x=(p-g)/2,u.drawImage(j,k,x,h,g,0,0,d,l),O&&O(),s.stop(),e.abrupt("return",o.toDataURL("image/jpeg"));case 27:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),h=n(111),g=function(e){return Object(p.c)(e)&&"string"===typeof e.image&&function(e){return Object(p.c)(e)&&"string"===typeof e.nickname&&"string"===typeof e.message&&"boolean"===typeof e.liveMode&&"boolean"===typeof e.micOn&&"boolean"===typeof e.speakerOn}(e.info)},k=n(515),x=i.a.memo((function(e){var t=e.image,n=e.nickname,r=e.statusMesg,c=e.obsoleted,i=e.liveMode,s=e.stream,o=e.muted,u=e.micOn,d=e.speakerOn;return Object(a.jsxs)("div",{className:"FaceImages-card",style:{opacity:c?.2:1},children:[i&&!c&&s?Object(a.jsx)("video",{className:"FaceImages-photo",ref:function(e){e&&e.srcObject!==s&&(e.srcObject=s)},autoPlay:!0,playsInline:!0,muted:o}):Object(a.jsx)("img",{src:t||"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=",className:"FaceImages-photo",alt:"myself"}),Object(a.jsx)("div",{className:"FaceImages-name",children:n}),Object(a.jsx)("div",{className:"FaceImages-mesg",title:Object(l.a)(r)[1]?r:"(No status message)",children:Object(l.a)(r)[0]}),i&&!c&&s&&Object(a.jsx)("div",{className:"FaceImages-live-indicator",title:"Live Mode On",children:"\u25c9"}),i&&!c&&!s&&Object(a.jsx)("div",{className:"FaceImages-live-indicator",title:"Live Mode Available",children:"\u25ce"}),i&&!c&&Object(a.jsxs)("div",{className:"FaceImages-mic-speaker-icons",children:[u&&Object(a.jsx)("span",{title:"Mic On",children:"\ud83c\udfa4"}),d&&Object(a.jsx)("span",{title:"Speaker On",children:"\ud83d\udd08"})]})]})})),w=i.a.memo((function(e){var t=e.roomId,n=e.userId,i=e.nickname,s=e.statusMesg,o=e.suspended,u=e.liveMode,d=e.micOn,f=e.speakerOn,p=e.videoDeviceId,O=e.audioDeviceId,v=function(e,t,n,a,i,s,o,u,d){var f=Object(c.useState)(),p=Object(r.a)(f,2),O=p[0],v=p[1],k=Object(c.useState)([]),x=Object(r.a)(k,2),w=x[0],y=x[1],S=Object(c.useState)(),C=Object(r.a)(S,2),I=C[0],E=C[1];if(I)throw I;var M=Object(c.useRef)();Object(h.e)(e,t,Object(c.useCallback)((function(e){M.current&&e(M.current)}),[]));var N=Object(h.a)(e,t);return Object(h.b)(e,t,Object(c.useCallback)((function(e,t){if(g(e)){var n=Object(m.a)(Object(m.a)({},e),{},{userId:t.userId,received:Date.now(),obsoleted:!1,peerIndex:t.peerIndex});y((function(e){return e.find((function(e){return e.userId===n.userId}))?e.map((function(e){return e.userId===n.userId?n:e})):[].concat(Object(l.a)(e),[n])}))}}),[])),Object(h.d)(e,t,Object(c.useCallback)((function(e){if(e&&"CONNECTION_CLOSED"===e.type){var t=e.peerIndex;y((function(e){var n=!1,r=e.map((function(e){return e.peerIndex===t?(n=!0,Object(m.a)(Object(m.a)({},e),{},{obsoleted:!0})):e}));return n?r:e}))}}),[])),Object(c.useEffect)((function(){var e,t=function(){var e=Date.now()-12e4,t=Date.now()-6e5;y((function(n){var r=!1,a=n.map((function(n){return n.received<e&&!n.obsoleted?(r=!0,Object(m.a)(Object(m.a)({},n),{},{obsoleted:!0})):n.received<t&&n.obsoleted?(r=!0,null):n})).filter((function(e){return e}));return r?a:n}))},r=!1,c=function(){var l=Object(j.a)(b.a.mark((function l(){var f,j;return b.a.wrap((function(l){for(;;)switch(l.prev=l.next){case 0:if(!r){l.next=2;break}return l.abrupt("return");case 2:if(l.prev=2,t(),!i){l.next=8;break}l.t0="data:image/jpeg;base64,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",l.next=11;break;case 8:return l.next=10,A(d);case 10:l.t0=l.sent;case 11:if(f=l.t0,!r){l.next=14;break}return l.abrupt("return");case 14:v(f),N(j={image:f,info:{nickname:n,message:a,liveMode:s,micOn:o,speakerOn:u}}),M.current=j,l.next=24;break;case 21:l.prev=21,l.t1=l.catch(2),E(l.t1);case 24:e=setTimeout(c,12e4);case 25:case"end":return l.stop()}}),l,null,[[2,21]])})));return function(){return l.apply(this,arguments)}}();return c(),function(){r=!0,clearTimeout(e)}}),[e,t,d,n,a,i,s,o,u,N]),{myImage:O,roomImages:w}}(t,n,i,s,o,u,d,f,p),w=v.myImage,y=v.roomImages,S=Object(k.a)(t,n,u,u,d,p,O),C=S.faceStream,I=S.faceStreamMap;return Object(a.jsxs)(a.Fragment,{children:[Object(a.jsx)(x,{image:w,nickname:i,statusMesg:s,liveMode:u,stream:C||void 0,muted:!0,micOn:d,speakerOn:f}),y.map((function(e){return Object(a.jsx)(x,{image:e.image,nickname:e.info.nickname,statusMesg:e.info.message,obsoleted:e.obsoleted,liveMode:e.info.liveMode,stream:u&&I[e.userId]||void 0,muted:!f,micOn:e.info.micOn,speakerOn:e.info.speakerOn},e.userId)}))]})})),y=n(522),S=n.n(y),C=(n(523),n(7)),I=function(e){return Array.isArray(e)&&2===e.length&&"string"===typeof e[0]&&"number"===typeof e[1]},E=function(e){return Object(p.c)(e)&&"string"===typeof e.nickname&&"string"===typeof e.messageId&&"number"===typeof e.createdAt&&"string"===typeof e.text&&("undefined"===typeof e.inReplyTo||"string"===typeof e.inReplyTo)&&("undefined"===typeof e.replies||function(e){return Array.isArray(e)&&e.every(I)}(e.replies))},M=function(e,t){var n=t[1]-e[1];return 0===n?e[0].length-t[0].length:n},N=function(e,t,n){var a=Object(c.useState)([]),i=Object(r.a)(a,2),s=i[0],o=i[1],u=Object(c.useRef)(s);Object(c.useEffect)((function(){u.current=s}));var d=Object(c.useCallback)((function(e){if(e.inReplyTo){var t=e.text,n=e.inReplyTo;o((function(e){return e.map((function(e){if(e.messageId===n){var r=new Map(e.replies);r.set(t,(r.get(t)||0)+1);var a=Object(l.a)(r.entries());return a.sort(M),Object(m.a)(Object(m.a)({},e),{},{replies:a})}return e}))}))}else o((function(t){if(t.some((function(t){return t.messageId===e.messageId})))return t;var n=[e].concat(Object(l.a)(t));return n.length>100&&n.pop(),n.sort((function(e,t){return t.createdAt-e.createdAt})),n}))}),[]);Object(h.e)(e,t,Object(c.useCallback)((function(e){u.current.forEach((function(t){e({chat:t})}))}),[]));var f=Object(h.a)(e,t);Object(h.b)(e,t,Object(c.useCallback)((function(e){var t;t=e,Object(p.c)(t)&&E(t.chat)&&d(e.chat)}),[d]));var b=Object(c.useCallback)((function(e){var t={nickname:n,messageId:Object(C.j)(),createdAt:Date.now(),text:e};f({chat:t}),d(t)}),[f,n,d]),j=Object(c.useCallback)((function(e,t){var r={nickname:n,messageId:Object(C.j)(),createdAt:Date.now(),text:e,inReplyTo:t};f({chat:r}),d(r)}),[f,n,d]);return{chatList:s,sendChat:b,replyChat:j}},L=(n(524),n(316)),Q=L.b,B=n(528),D=n(529),T=n.n(D),R=(n(530),{toolbar:["specialCharacters","|","bold","italic","link","blockQuote","|","imageUpload","insertTable","mediaEmbed","|","undo","redo"],balloonToolbar:["heading","|","bulletedList","numberedList","indent","outdent"],link:{addTargetToExternalLinks:!0}}),P=i.a.memo((function(e){var t=e.registerClear,n=e.onChange,r=e.onMetaEnter;return Object(a.jsx)(B.CKEditor,{editor:T.a,config:R,onReady:function(e){e.sourceElement.addEventListener("keydown",(function(e){e.metaKey&&"Enter"===e.code&&r()})),t((function(){e.setData("")})),function(e){e.plugins.get("SpecialCharacters").addItems("Emoji",[{title:"smiley face",character:"\ud83d\ude0a"},{title:"rocket",character:"\ud83d\ude80"},{title:"wind blowing face",character:"\ud83c\udf2c\ufe0f"},{title:"floppy disk",character:"\ud83d\udcbe"},{title:"heart",character:"\u2764\ufe0f"}])}(e)},onChange:function(e,t){var r=t.getData();n(r)}})})),K=1048576,U=function(e){return new Date(e.createdAt).toLocaleString().split(" ")[1].slice(0,-3)},F=i.a.memo((function(e){var t,n=e.item,i=e.replyChat,s=Object(c.useState)(!1),o=Object(r.a)(s,2),u=o[0],d=o[1],l=function(e){return i(e,n.messageId)};return Object(a.jsxs)("li",{className:"MomentaryChat-listPart",children:[u&&Object(a.jsx)(Q,{onSelect:function(e){l(e.native),d(!1)},style:{width:"100%"}}),Object(a.jsxs)("div",{className:"MomentaryChat-listPart-header",children:[Object(a.jsx)("div",{className:"MomentaryChat-iconButton-container",children:Object(a.jsx)("div",{className:"MomentaryChat-iconButton",children:Object(a.jsx)("button",{type:"button",onClick:function(){d(!u)},children:"+"})})}),Object(a.jsx)("span",{className:"MomentaryChat-nickname",children:n.nickname||"No Name"}),Object(a.jsx)("span",{className:"MomentaryChat-time",children:U(n)})]}),Object(a.jsx)("div",{className:"MomentaryChat-text ck-content",dangerouslySetInnerHTML:(t=n.text,{__html:S.a.sanitize(t,{ADD_ATTR:["target"]})})}),(n.replies||[]).map((function(e){var t=Object(r.a)(e,2),n=t[0],c=t[1];return Object(a.jsxs)("button",{className:"MomentaryChat-icon",type:"button",onClick:function(){return l(n)},children:[n," ",c]},n)}))]},n.messageId)})),V=i.a.memo((function(e){var t,n=e.chatList,r=e.replyChat,i=Object(c.useRef)(null),s=null===(t=n[0])||void 0===t?void 0:t.messageId;return Object(c.useEffect)((function(){i.current&&s&&(i.current.scrollTop=i.current.scrollHeight)}),[s]),Object(a.jsx)("ul",{className:"MomentaryChat-list",ref:i,children:n.map((function(e){return Object(a.jsx)(F,{item:e,replyChat:r},e.messageId)}))})})),W=i.a.memo((function(e){var t=e.roomId,n=e.userId,i=e.nickname,s=Object(c.useRef)(null),o=N(t,n,i),u=o.chatList,d=o.sendChat,l=o.replyChat,f=Object(c.useRef)(),b=Object(c.useState)(!1),j=Object(r.a)(b,2),m=j[0],p=j[1],O=Object(c.useRef)(""),v=Object(c.useCallback)((function(e){O.current=e,p(!!e&&e.length<=K)}),[]),A=Object(c.useCallback)((function(){O.current&&O.current.length<=K&&(d(O.current),v(""),f.current&&f.current())}),[d,v]),h=function(){var e=Object(c.useRef)(),t=Object(c.useCallback)((function(t){"granted"===Notification.permission&&(e.current&&e.current.close(),e.current=new Notification(t))}),[]);return Object(c.useEffect)((function(){"granted"!==Notification.permission&&Notification.requestPermission()}),[]),t}(),g=u[0];return Object(c.useEffect)((function(){g&&g.createdAt>Date.now()-1e4&&new RegExp("@".concat(i,"\\b")).test(g.text)&&h("You got a new message!")}),[i,g,h]),Object(a.jsxs)("div",{className:"MomentaryChat-container",ref:s,children:[Object(a.jsx)(V,{chatList:u,replyChat:l}),Object(a.jsx)("div",{className:"MomentaryChat-editor",children:Object(a.jsx)(P,{registerClear:function(e){f.current=e},onChange:v,onMetaEnter:A})}),Object(a.jsx)("div",{className:"MomentaryChat-button",children:Object(a.jsx)("button",{type:"button",onClick:A,disabled:!m,children:"Send"})})]})})),Y=(n(531),i.a.memo((function(e){var t=e.suspended,n=e.setSuspended,r=e.liveMode,c=e.setLiveMode,i=e.setMicOn,s=e.setSpeakerOn,o=e.secondColumnOpen,u=e.setSecondColumnOpen;return Object(a.jsxs)("div",{className:"ControlPanel-container",children:[Object(a.jsxs)("button",{type:"button",onClick:function(){return n((function(e){return!e}))},title:t?"Enable Camera":"Disable Camera",children:["\ud83d\udcf7",t&&Object(a.jsx)("span",{className:"ControlPanel-disabled",children:"\u274c"})]}),Object(a.jsx)("button",{type:"button",onClick:function(){return u((function(e){return!e}))},title:o?"Close Right Pane":"Open Right Pane",children:o?Object(a.jsx)(a.Fragment,{children:"\u25c0"}):Object(a.jsx)(a.Fragment,{children:"\u25b6"})}),Object(a.jsxs)("button",{type:"button",onClick:function(){return c((function(e){return!e}))},title:r?"Disable Live Mode":"Enable Live Mode",children:["\ud83c\udfa5",!r&&Object(a.jsx)("span",{className:"ControlPanel-disabled",children:"\u274c"})]}),Object(a.jsxs)("div",{className:"ControlPanel-select",children:["\ud83c\udf9b",Object(a.jsxs)("select",{onChange:function(e){switch(e.target.value){case"off":s(!1),i(!1);break;case"speaker":s(!0),i(!1);break;case"mic":s(!0),i(!0);break;default:throw new Error("no option")}},children:[Object(a.jsx)("option",{value:"off",children:"Audio Off"}),Object(a.jsx)("option",{value:"speaker",children:"Speaker Only"}),Object(a.jsx)("option",{value:"mic",children:"Mic + Speaker"})]})]})]})}))),z=(n(532),n(317)),G="true"!==u("config_hidden"),q=i.a.memo((function(e){var t=e.initialText,n=e.onUpdate,i=e.buttonLabel,s=e.placeholder,o=e.clearOnUpdate,u=Object(c.useState)(t),d=Object(r.a)(u,2),l=d[0],f=d[1];return Object(a.jsxs)("form",{onSubmit:function(e){e.preventDefault(),l&&(n(l),o&&f(""))},children:[Object(a.jsx)("input",{value:l,onChange:function(e){return f(e.target.value)},placeholder:s}),i&&Object(a.jsx)("button",{type:"submit",disabled:!l,children:i})]})})),H=i.a.memo((function(e){var t=e.roomId,n=e.userId,i=e.nickname,s=e.setNickname,u=e.videoDeviceId,d=e.setVideoDeviceId,l=e.audioDeviceId,f=e.setAudioDeviceId,b=Object(c.useState)(G),j=Object(r.a)(b,2),m=j[0],p=j[1];Object(c.useEffect)((function(){o("config_hidden",m?"false":"true")}),[m]);var O=Object(z.b)(),v=Object(z.a)(),A=Object(h.d)(t,n),g="remote-faces://".concat(window.location.href.replace(/^https:\/\//,""));return Object(a.jsxs)("div",{className:"SettingPanel-container",children:[Object(a.jsxs)("button",{type:"button",className:"SettingPanel-config-toggle",onClick:function(){return p((function(e){return!e}))},children:["Setting",m?Object(a.jsx)(a.Fragment,{children:"\u25bc"}):Object(a.jsx)(a.Fragment,{children:"\u25b6"})]}),m&&Object(a.jsxs)("div",{className:"SettingPanel-config",children:[Object(a.jsxs)("div",{className:"SettingPanel-config-row",children:[Object(a.jsxs)("span",{title:"Share this link with your colleagues",children:["Room Link:"," "]}),Object(a.jsx)("input",{value:window.location.href,readOnly:!0})," ",Object(a.jsx)("a",{href:g,title:"Open this link in the desktop app",children:"Open App"})]}),Object(a.jsxs)("div",{className:"SettingPanel-config-row",children:["Your Name:"," ",Object(a.jsx)(q,{initialText:i,onUpdate:function(e){s(e),o("nickname",e)},placeholder:"Enter your name",buttonLabel:"Set"})]}),Object(a.jsxs)("div",{className:"SettingPanel-config-row",children:["Select Camera:"," ",Object(a.jsx)("select",{value:u,onChange:function(e){d(e.target.value),o("faceimage_video_device_id",e.target.value)},children:O.map((function(e){return Object(a.jsx)("option",{value:e.deviceId,children:e.label},e.deviceId)}))})]}),Object(a.jsxs)("div",{className:"SettingPanel-config-row",children:["Select Mic:"," ",Object(a.jsx)("select",{value:l,onChange:function(e){f(e.target.value),o("faceimage_audio_device_id",e.target.value)},children:v.map((function(e){return Object(a.jsx)("option",{value:e.deviceId,children:e.label},e.deviceId)}))})]}),Object(a.jsx)("div",{className:"SettingPanel-status",children:JSON.stringify(A)})]})]})})),Z=(n(533),i.a.memo((function(e){var t=e.initialText,n=e.onUpdate,i=e.buttonLabel,s=e.placeholder,o=e.clearOnUpdate,u=Object(c.useState)(t),d=Object(r.a)(u,2),l=d[0],f=d[1];return Object(a.jsxs)("form",{onSubmit:function(e){e.preventDefault(),l&&(n(l),o&&f(""))},children:[Object(a.jsx)("input",{value:l,onChange:function(e){return f(e.target.value)},placeholder:s}),i&&Object(a.jsx)("button",{type:"submit",disabled:!l,children:i})]})}))),J=i.a.memo((function(e){var t=e.emoji,n=e.setEmoji,i=e.setStatusMesg,s=Object(c.useState)(!1),o=Object(r.a)(s,2),u=o[0],d=o[1];return Object(a.jsxs)("div",{className:"UserStatus-container",children:[Object(a.jsxs)("div",{className:"UserStatus-status-area",children:[Object(a.jsx)("div",{className:"UserStatus-emoji",children:Object(a.jsx)("button",{type:"button",onClick:function(){d(!u)},children:t?Object(a.jsx)(L.a,{emoji:t,size:10}):":)"})}),t&&Object(a.jsx)("div",{className:"UserStatus-statusmesg",children:Object(a.jsx)(Z,{initialText:"",onUpdate:i,placeholder:"Enter status message...",buttonLabel:"Set"})}),Object(a.jsx)("button",{type:"button",onClick:function(){n(null),i(""),d(!1)},disabled:!t,children:"Clear"})]}),u&&Object(a.jsx)(Q,{onSelect:function(e){n(e),d(!1)},style:{width:"100%"}})]})})),X=n(26),_=(n(534),{Welcome:i.a.lazy((function(){return n.e(18).then(n.bind(null,1249))})),"Spatial Area":i.a.lazy((function(){return Promise.all([n.e(8),n.e(11)]).then(n.bind(null,1252))})),"Screen Share":i.a.lazy((function(){return n.e(16).then(n.bind(null,1251))})),"White Board":i.a.lazy((function(){return n.e(13).then(n.bind(null,1253))})),"Video Share":i.a.lazy((function(){return n.e(17).then(n.bind(null,1254))})),"Go Board":i.a.lazy((function(){return Promise.all([n.e(19),n.e(14)]).then(n.bind(null,1255))}))}),$=i.a.memo((function(e){var t=e.roomId,n=e.userId,i=e.nickname,s=e.statusMesg,o=Object(c.useState)(["Welcome"]),u=Object(r.a)(o,2),d=u[0],f=u[1];return Object(a.jsxs)("div",{className:"SelectivePane-container",children:[Object(a.jsxs)("div",{className:"SelectivePane-select",children:["\u2630",Object(a.jsx)("select",{multiple:!0,size:Object.keys(_).length,value:d,onChange:function(e){return t=e.target.value,void f((function(e){return e.includes(t)?e.filter((function(e){return e!==t})):[].concat(Object(l.a)(e),[t])}));var t},children:Object.keys(_).map((function(e){var t=d.indexOf(e);return t>=0?Object(a.jsx)("option",{value:e,children:"[".concat(t+1,"] ").concat(e)},e):Object(a.jsxs)("option",{value:e,children:["\xa0\xa0\xa0\xa0\xa0",e]},e)}))})]}),Object(a.jsx)("div",{className:"SelectivePane-body",children:d.map((function(e){return Object(a.jsx)(c.Suspense,{fallback:Object(a.jsx)(X.a,{}),children:Object(c.createElement)(_[e],{roomId:t,userId:n,nickname:i,statusMesg:s})},e)}))})]})})),ee=u("nickname"),te=u("faceimage_video_device_id"),ne=u("faceimage_audio_device_id"),re=i.a.memo((function(e){var t=e.roomId,n=e.userId,i=Object(c.useState)(ee),o=Object(r.a)(i,2),u=o[0],l=o[1],f=Object(c.useState)(""),b=Object(r.a)(f,2),j=b[0],m=b[1],p=Object(c.useState)(null),O=Object(r.a)(p,2),v=O[0],A=O[1];Object(c.useEffect)((function(){Object(s.g)(t)}),[t]);var h=Object(c.useState)(te),g=Object(r.a)(h,2),k=g[0],x=g[1],y=Object(c.useState)(ne),S=Object(r.a)(y,2),C=S[0],I=S[1],E=Object(c.useState)(!1),M=Object(r.a)(E,2),N=M[0],L=M[1],Q=Object(c.useState)(!1),B=Object(r.a)(Q,2),D=B[0],T=B[1],R=Object(c.useState)(!1),P=Object(r.a)(R,2),K=P[0],U=P[1],F=Object(c.useState)(!1),V=Object(r.a)(F,2),z=V[0],G=V[1],q=Object(c.useState)(!0),Z=Object(r.a)(q,2),X=Z[0],_=Z[1],re=Object(c.useState)(!0),ae=Object(r.a)(re,2),ce=ae[0],ie=ae[1];return Object(d.a)(t,n),Object(a.jsxs)("div",{className:"SingleRoom-container",children:[Object(a.jsxs)("div",{className:"SingleRoom-1st-column",children:[Object(a.jsx)(Y,{suspended:N,setSuspended:L,liveMode:D,setLiveMode:T,micOn:K,setMicOn:U,speakerOn:z,setSpeakerOn:G,secondColumnOpen:X,setSecondColumnOpen:_}),Object(a.jsx)(w,{roomId:t,userId:n,videoDeviceId:k,audioDeviceId:C,nickname:u,statusMesg:"".concat((null===v||void 0===v?void 0:v.native)||" ").concat(j),suspended:N,liveMode:D,micOn:K,speakerOn:z})]}),Object(a.jsxs)("div",{className:"SingleRoom-2nd-column",style:{width:X?"inherit":"0"},children:[Object(a.jsx)("button",{type:"button",className:"SingleRoom-toggle-3rd-column",onClick:function(){return ie((function(e){return!e}))},title:ce?"Close Right Pane":"Open Right Pane",children:ce?Object(a.jsx)(a.Fragment,{children:"\u25c0"}):Object(a.jsx)(a.Fragment,{children:"\u25b6"})}),Object(a.jsx)(J,{emoji:v,setEmoji:A,setStatusMesg:m}),Object(a.jsx)(H,{roomId:t,userId:n,nickname:u,setNickname:l,videoDeviceId:k,setVideoDeviceId:x,audioDeviceId:C,setAudioDeviceId:I}),Object(a.jsx)(W,{roomId:t,userId:n,nickname:u})]}),Object(a.jsx)("div",{className:"SingleRoom-3rd-column",style:{display:ce?"inherit":"none"},children:Object(a.jsx)($,{roomId:t,userId:n,nickname:u,statusMesg:"".concat((null===v||void 0===v?void 0:v.native)||" ").concat(j)})})]})}));t.default=re},191:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var r=n(5),a=n(2),c=n(95),i=n(111),s=[],o=function(e){var t={};return s.forEach((function(n){n.roomId===e&&(t[n.userId]=n.nickname)})),t},u=function(e,t){var n=Object(a.useState)((function(){return o(e)})),u=Object(r.a)(n,2),d=u[0],l=u[1];return Object(i.b)(e,t,Object(a.useCallback)((function(t,n){if(r=t,Object(c.c)(r)&&Object(c.c)(r.info)&&"string"===typeof r.info.nickname){var r,a=s.findIndex((function(t){return t.roomId===e&&t.userId===n.userId})),i=Date.now();a>=0?(s[a].nickname!==t.info.nickname&&(s[a].nickname=t.info.nickname),s[a].lastUpdated=i):s.push({roomId:e,userId:n.userId,nickname:t.info.nickname,lastUpdated:i});for(var u=s.length-1;u>=0;u-=1)s[u].lastUpdated+6e5<i&&s.splice(u,1);l((function(t){var n=o(e),r=Object.keys(n);return r.length===Object.keys(t).length&&r.every((function(e){return n[e]===t[e]}))?t:n}))}}),[e])),d}},317:function(e,t,n){"use strict";n.d(t,"b",(function(){return d})),n.d(t,"a",(function(){return l}));var r=n(1),a=n.n(r),c=n(3),i=n(5),s=n(2),o=function(){var e=Object(c.a)(a.a.mark((function e(){var t,n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,navigator.mediaDevices.enumerateDevices();case 3:return t=e.sent,n=t.filter((function(e){return"videoinput"===e.kind})).map((function(e){return{label:e.label,deviceId:e.deviceId}})),e.abrupt("return",n);case 8:return e.prev=8,e.t0=e.catch(0),e.abrupt("return",[]);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(){return e.apply(this,arguments)}}(),u=function(){var e=Object(c.a)(a.a.mark((function e(){var t,n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,navigator.mediaDevices.enumerateDevices();case 3:return t=e.sent,n=t.filter((function(e){return"audioinput"===e.kind})).map((function(e){return{label:e.label,deviceId:e.deviceId}})),e.abrupt("return",n);case 8:return e.prev=8,e.t0=e.catch(0),e.abrupt("return",[]);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(){return e.apply(this,arguments)}}(),d=function(){var e=Object(s.useState)([]),t=Object(i.a)(e,2),n=t[0],r=t[1];return Object(s.useEffect)((function(){Object(c.a)(a.a.mark((function e(){var t;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o();case 2:t=e.sent,r(t);case 4:case"end":return e.stop()}}),e)})))()}),[]),n},l=function(){var e=Object(s.useState)([]),t=Object(i.a)(e,2),n=t[0],r=t[1];return Object(s.useEffect)((function(){Object(c.a)(a.a.mark((function e(){var t;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u();case 2:t=e.sent,r(t);case 4:case"end":return e.stop()}}),e)})))()}),[]),n}},319:function(e,t,n){"use strict";n.d(t,"b",(function(){return s})),n.d(t,"a",(function(){return o}));var r=n(1),a=n.n(r),c=n(5),i=n(3),s=function(){var e=Object(i.a)(a.a.mark((function e(t){var n,r,i,s,o,u;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t?{video:{deviceId:t}}:{video:!0},e.next=3,navigator.mediaDevices.getUserMedia(n);case 3:return r=e.sent,i=r.getVideoTracks(),s=Object(c.a)(i,1),o=s[0],u=function(){o.stop()},e.abrupt("return",{stream:r,dispose:u});case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),o=function(){var e=Object(i.a)(a.a.mark((function e(t){var n,r,i,s,o,u;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={video:{deviceId:t,frameRate:{max:5},width:{exact:72},height:{exact:72}}},e.next=3,navigator.mediaDevices.getUserMedia(n);case 3:return r=e.sent,i=r.getVideoTracks(),s=Object(c.a)(i,1),o=s[0],u=function(){o.stop()},e.abrupt("return",{stream:r,dispose:u});case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},515:function(e,t,n){"use strict";n.d(t,"a",(function(){return p}));var r=n(1),a=n.n(r),c=n(98),i=n(97),s=n(516),o=n(1247),u=n(3),d=n(5),l=n(2),f=n(319),b=function(){var e=Object(u.a)(a.a.mark((function e(t){var n,r,c,i,s,o;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t?{audio:{deviceId:t}}:{audio:!0},e.next=3,navigator.mediaDevices.getUserMedia(n);case 3:return r=e.sent,c=r.getAudioTracks(),i=Object(d.a)(c,1),s=i[0],e.next=7,s.applyConstraints({echoCancellation:!0,echoCancellationType:{ideal:"system"},noiseSuppression:{ideal:!0}});case 7:return o=function(){s.stop()},e.abrupt("return",{stream:r,dispose:o});case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),j=n(111),m=function(e,t,n){var r=t||new MediaStream;return r.addTrack(e),r.dispatchEvent(new MediaStreamTrackEvent("addtrack",{track:e})),e.addEventListener("ended",(function(){r.removeTrack(e),0===r.getTracks().length&&n(r)})),r},p=function(e,t,n,r,p,O,v,A){var h=Object(l.useState)(null),g=Object(d.a)(h,2),k=g[0],x=g[1],w=Object(l.useState)({}),y=Object(d.a)(w,2),S=y[0],C=y[1],I=Object(l.useRef)(!0);Object(l.useEffect)((function(){return function(){I.current=!1}}),[]);var E=Object(l.useCallback)(function(){var e=Object(u.a)(a.a.mark((function e(t,n){var r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=function(e){I.current&&C((function(t){var r=n.userId,a=t[r],c=Object(s.a)(t,[r].map(o.a));return a===e?c:t}))},C((function(e){var a=e[n.userId],s=m(t,a,r);return a===s?e:Object(i.a)(Object(i.a)({},e),{},Object(c.a)({},n.userId,s))}));case 2:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),[]),M=Object(j.c)(e,t,E,n?"".concat(A||"face","Video"):void 0),N=Object(j.c)(e,t,E,r?"".concat(A||"face","Audio"):void 0);return Object(l.useEffect)((function(){var e=null;return n&&M&&Object(u.a)(a.a.mark((function t(){var n,r,c,i,s,o,u,l;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Object(f.a)(O);case 2:n=t.sent,r=n.stream,c=n.dispose,i=r.getVideoTracks(),s=Object(d.a)(i,1),o=s[0],u=M(o),l=function(e){I.current&&x((function(t){return t===e?null:t}))},x((function(e){return m(o,e,l)})),e=function(){u(),c(),o.dispatchEvent(new Event("ended"))};case 10:case"end":return t.stop()}}),t)})))(),function(){e&&e()}}),[e,n,O,M]),Object(l.useEffect)((function(){var e=null;return r&&N&&Object(u.a)(a.a.mark((function t(){var n,r,c,i,s,o,u,l;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,b(v);case 2:n=t.sent,r=n.stream,c=n.dispose,i=r.getAudioTracks(),s=Object(d.a)(i,1),o=s[0],u=N(o),l=function(e){I.current&&x((function(t){return t===e?null:t}))},x((function(e){return m(o,e,l)})),e=function(){u(),c(),o.dispatchEvent(new Event("ended"))};case 10:case"end":return t.stop()}}),t)})))(),function(){e&&e()}}),[e,r,v,N]),Object(l.useEffect)((function(){if(k){k.getAudioTracks().forEach((function(e){e.enabled=p}));var e=function(e){var t=e.track;"audio"===t.kind&&(t.enabled=p)};return k.addEventListener("addtrack",e),function(){k.removeEventListener("addtrack",e)}}}),[k,p]),{faceStream:k,faceStreamMap:S}}},520:function(e,t,n){},521:function(e,t,n){},523:function(e,t,n){},530:function(e,t,n){},531:function(e,t,n){},532:function(e,t,n){},533:function(e,t,n){},534:function(e,t,n){},95:function(e,t,n){"use strict";n.d(t,"c",(function(){return r})),n.d(t,"b",(function(){return a})),n.d(t,"a",(function(){return c}));var r=function(e){return"object"===typeof e&&null!==e},a=function(e,t){return"string"===typeof e[t]},c=function(e,t){return r(e[t])}}}]);
//# sourceMappingURL=5.983cc665.chunk.js.map