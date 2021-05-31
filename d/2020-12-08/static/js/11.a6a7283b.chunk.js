(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[11],{1232:function(e,t,a){},1255:function(e,t,a){"use strict";a.r(t),a.d(t,"SpatialArea",(function(){return x}));var n=a(1),r=a.n(n),c=a(2),i=a(5),u=a(0),o=a.n(u),s=a(332),d=a(1246),f=a(1244),l=(a(1232),a(112)),v=a(119),p=a(108),m=a(125),b=function(e,t){var a=Object(u.useState)({}),n=Object(i.a)(a,2),r=n[0],c=n[1],o=Object(u.useState)(),s=Object(i.a)(o,2),d=s[0],f=s[1],b=Object(u.useRef)();Object(u.useEffect)((function(){b.current=d}),[d]);var h=Object(m.a)(e,t),j=Object(u.useRef)();return Object(u.useEffect)((function(){if(d){var e={spatialArea:"avatar",userId:t,avatarData:d};j.current?j.current=e:(j.current=e,setTimeout((function(){h(j.current),j.current=void 0}),200))}}),[h,t,d]),Object(m.b)(e,t,Object(u.useCallback)((function(e){var t;if(t=e,Object(p.c)(t)&&("init"===t.spatialArea||"avatar"===t.spatialArea&&function(e){try{var t=e;return"number"===typeof t.position[0]&&"number"===typeof t.position[1]&&"number"===typeof t.position[2]}catch(a){return!1}}(t.avatarData)))if("init"===e.spatialArea)b.current&&h({spatialArea:"avatar",avatarData:b.current});else if("avatar"===e.spatialArea){var a=e.userId,n=e.avatarData;c((function(e){return Object(v.a)(Object(v.a)({},e),{},Object(l.a)({},a,n))}))}}),[h])),Object(u.useEffect)((function(){h({spatialArea:"init"})}),[h]),{avatarMap:r,myAvatar:d,setMyAvatar:f}},h=a(333),j=a(523),O=a(206),w=a(141),k=o.a.memo((function(e){var t=e.nickname,a=e.faceStream,n=e.position,l=e.setPosition,v=e.distance,p=e.muted,m=Object(d.b)(),b=m.size,h=m.viewport,j=b.width/h.width,O=Object(u.useRef)(),k=Object(f.a)((function(e){var t=e.first,a=Object(i.a)(e.initial,2),r=a[0],c=a[1],u=Object(i.a)(e.xy,2),o=u[0],s=u[1];t&&(O.current=n);var d=O.current,f=Object(i.a)(d,2),v=f[0],p=f[1];l&&l([v+(o-r)/j,p-(s-c)/j,0])})),E=Object(u.useState)(),g=Object(i.a)(E,2),x=g[0],y=g[1],S=null===a||void 0===a?void 0:a.getVideoTracks()[0],A=!!l,I=Object(u.useRef)(.5);Object(u.useEffect)((function(){if(S){var e=document.createElement("canvas"),a=new s.CanvasTexture(e);y(a);var n=new ImageCapture(S),i=e.getContext("2d"),u=setInterval(Object(c.a)(r.a.mark((function c(){var u;return r.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,n.grabFrame();case 3:u=r.sent,e.width=u.width,e.height=u.height,i.drawImage(u,0,0),i.font="18px selif",i.textBaseline="top",i.fillStyle="blue",i.fillText(t,2,2),A||(i.fillStyle="red",i.fillText(I.current.toFixed(2),2,54)),a.needsUpdate=!0,r.next=17;break;case 15:r.prev=15,r.t0=r.catch(0);case 17:case"end":return r.stop()}}),c,null,[[0,15]])}))),1e3/7.5);return function(){clearInterval(u)}}}),[t,A,S]);var M=!A&&(null===a||void 0===a?void 0:a.getAudioTracks()[0]),C=Object(u.useRef)();return Object(u.useEffect)((function(){if(M){var e=new AudioContext,t=e.createMediaStreamDestination(),a=e.createMediaStreamSource(new MediaStream([M])),n=e.createGain();n.gain.value=.5,C.current=function(t){n.gain.setValueAtTime(t,e.currentTime),I.current=t},a.connect(n),n.connect(t);var i=t.stream.getAudioTracks()[0],u=document.createElement("video");return u.autoplay=!0,document.body.appendChild(u),Object(c.a)(r.a.mark((function e(){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=MediaStream,e.next=3,Object(w.b)(i);case 3:e.t1=e.sent,e.t2=[e.t1],u.srcObject=new e.t0(e.t2);case 6:case"end":return e.stop()}}),e)})))(),function(){e.close(),i.dispatchEvent(new Event("ended")),document.body.removeChild(u)}}}),[M]),Object(u.useEffect)((function(){C.current&&(void 0===v||p?C.current(0):C.current(Math.min(1,Math.max(0,(5-v)/5))))}),[p,v]),x?o.a.createElement("sprite",Object.assign({},l&&k(),{position:n}),o.a.createElement("spriteMaterial",{map:x})):null})),E=function(e){return[parseInt(e.slice(0,2),16)/128-1,parseInt(e.slice(2,4),16)/128-1,0]},g=o.a.memo((function(e){var t=e.userId,a=e.nickname,n=e.faceStream,r=e.nicknameMap,c=e.faceStreamMap,i=e.avatarMap,s=e.myAvatar,f=e.setMyAvatar,l=function(e){var t;return(null===(t=i[e])||void 0===t?void 0:t.position)||E(e)},v=(null===s||void 0===s?void 0:s.position)||E(t);return o.a.createElement(d.a,null,o.a.createElement(u.Suspense,{fallback:null},o.a.createElement("ambientLight",null),Object.keys(c).map((function(e){if(e===t)return null;var a=l(e),n=Math.hypot(a[0]-v[0],a[1]-v[1],a[2]-v[2]);return o.a.createElement(k,{key:e,nickname:r[e]||"",faceStream:c[e]||null,position:l(e),distance:n})})),o.a.createElement(k,{nickname:a,faceStream:n,position:v,setPosition:function(e){f({position:e})},muted:!0})))})),x=o.a.memo((function(e){var t=e.roomId,a=e.userId,n=e.nickname,r=Object(h.b)(),c=Object(u.useState)(""),s=Object(i.a)(c,2),d=s[0],f=s[1],l=Object(h.a)(),v=Object(u.useState)(""),p=Object(i.a)(v,2),m=p[0],w=p[1],k=Object(j.a)(t,a,!!d,!!m,!!m,d,m,"spatialArea"),E=k.faceStream,x=k.faceStreamMap,y=Object(O.a)(t,a),S=b(t,a),A=S.avatarMap,I=S.myAvatar,M=S.setMyAvatar;return o.a.createElement("div",{className:"SpatialArea-container"},o.a.createElement("div",null,"Select Camera:"," ",o.a.createElement("select",{value:d,onChange:function(e){return f(e.target.value)}},o.a.createElement("option",{value:""},"None"),r.map((function(e){return o.a.createElement("option",{key:e.deviceId,value:e.deviceId},e.label)})))),o.a.createElement("div",null,"Select Mic:"," ",o.a.createElement("select",{value:m,onChange:function(e){w(e.target.value)}},o.a.createElement("option",{value:""},"None"),l.map((function(e){return o.a.createElement("option",{key:e.deviceId,value:e.deviceId},e.label)})))),o.a.createElement("div",{className:"SpatialArea-body"},o.a.createElement(g,{userId:a,nickname:n,faceStream:E,nicknameMap:y,faceStreamMap:x,avatarMap:A,myAvatar:I,setMyAvatar:M})))}));t.default=x},141:function(e,t,a){"use strict";a.d(t,"c",(function(){return s})),a.d(t,"b",(function(){return d})),a.d(t,"d",(function(){return f})),a.d(t,"a",(function(){return v}));var n=a(5),r=a(1),c=a.n(r),i=a(2),u=a(113),o=new WeakMap,s=function(e,t){if(o.has(e))return e;o.set(e,!0);var a=function(){var a=Object(i.a)(c.a.mark((function a(){var n;return c.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,Object(u.a)(5e3);case 2:!(n=t.getTransceivers().find((function(t){return t.receiver.track===e})))||"inactive"!==n.currentDirection&&"sendonly"!==n.currentDirection||(e.stop(),e.dispatchEvent(new Event("ended")));case 4:case"end":return a.stop()}}),a)})));return function(){return a.apply(this,arguments)}}();return e.addEventListener("mute",a),e},d=function(e){return new Promise(function(){var t=Object(i.a)(c.a.mark((function t(a,n){var r,i,u,o;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,r=new RTCPeerConnection,i=new RTCPeerConnection,r.addEventListener("icecandidate",(function(e){var t=e.candidate;t&&i.addIceCandidate(t)})),i.addEventListener("icecandidate",(function(e){var t=e.candidate;t&&r.addIceCandidate(t)})),i.addEventListener("track",(function(e){a(e.track)})),e.addEventListener("ended",(function(){r.close(),i.close()})),r.addTrack(e),t.next=10,r.createOffer();case 10:return u=t.sent,t.next=13,r.setLocalDescription(u);case 13:return t.next=15,i.setRemoteDescription(u);case 15:return t.next=17,i.createAnswer();case 17:return o=t.sent,t.next=20,i.setLocalDescription(o);case 20:return t.next=22,r.setRemoteDescription(o);case 22:t.next=27;break;case 24:t.prev=24,t.t0=t.catch(0),n(t.t0);case 27:case"end":return t.stop()}}),t,null,[[0,24]])})));return function(e,a){return t.apply(this,arguments)}}())},f=function(){var e=Object(i.a)(c.a.mark((function e(t){var a,n,r,u;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("video"===t.kind){e.next=2;break}throw new Error("track kind is not video");case 2:return a=document.createElement("canvas"),n=a.getContext("2d"),r=new ImageCapture(t),u=function(){var e=Object(i.a)(c.a.mark((function e(){var t;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,r.grabFrame();case 3:return t=e.sent,a.width=t.width,a.height=t.height,n.drawImage(t,0,0),e.abrupt("return",a.toDataURL("image/jpeg"));case 10:return e.prev=10,e.t0=e.catch(0),console.log("failed to grab frame from viedeo track",e.t0),e.abrupt("return",null);case 14:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(){return e.apply(this,arguments)}}(),e.abrupt("return",{getImage:u});case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),l=function(e){return new Promise((function(t,a){var n=new Image;n.onload=function(){return t(n)},n.onerror=a,n.src=e}))},v=function(){var e=document.createElement("canvas"),t=e.getContext("2d"),a=e.captureStream().getVideoTracks();return{videoTrack:Object(n.a)(a,1)[0],setImage:function(){var a=Object(i.a)(c.a.mark((function a(n){var r;return c.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,l(n);case 2:r=a.sent,e.width=r.width,e.height=r.height,t.drawImage(r,0,0);case 6:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}()}}}}]);
//# sourceMappingURL=11.a6a7283b.chunk.js.map