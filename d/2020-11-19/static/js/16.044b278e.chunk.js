(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[16],{1232:function(e,t,a){},1255:function(e,t,a){"use strict";a.r(t),a.d(t,"SpatialArea",(function(){return k}));var n=a(1),r=a.n(n),c=a(2),i=a(5),u=a(0),o=a.n(u),l=a(332),s=a(1246),f=a(1244),v=(a(1232),a(112)),m=a(119),p=a(108),b=a(125),d=function(e,t){var a=Object(u.useState)({}),n=Object(i.a)(a,2),r=n[0],c=n[1],o=Object(u.useState)(),l=Object(i.a)(o,2),s=l[0],f=l[1],d=Object(u.useRef)();Object(u.useEffect)((function(){d.current=s}),[s]);var j=Object(b.a)(e,t),O=Object(u.useRef)();return Object(u.useEffect)((function(){if(s){var e={spatialArea:"avatar",userId:t,avatarData:s};O.current?O.current=e:(O.current=e,setTimeout((function(){j(O.current),O.current=void 0}),200))}}),[j,t,s]),Object(b.b)(e,t,Object(u.useCallback)((function(e){var t;if(t=e,Object(p.c)(t)&&("init"===t.spatialArea||"avatar"===t.spatialArea&&function(e){try{var t=e;return"number"===typeof t.position[0]&&"number"===typeof t.position[1]&&"number"===typeof t.position[2]}catch(a){return!1}}(t.avatarData)))if("init"===e.spatialArea)d.current&&j({spatialArea:"avatar",avatarData:d.current});else if("avatar"===e.spatialArea){var a=e.userId,n=e.avatarData;c((function(e){return Object(m.a)(Object(m.a)({},e),{},Object(v.a)({},a,n))}))}}),[j])),Object(u.useEffect)((function(){j({spatialArea:"init"})}),[j]),{avatarMap:r,myAvatar:s,setMyAvatar:f}},j=a(333),O=a(523),E=a(206),S=o.a.memo((function(e){var t=e.nickname,a=e.faceStream,n=e.position,v=e.setPosition,m=e.distance,p=e.muted,b=Object(s.b)(),d=b.size,j=b.viewport,O=d.width/j.width,E=Object(u.useRef)(),S=Object(f.a)((function(e){var t=e.first,a=Object(i.a)(e.initial,2),r=a[0],c=a[1],u=Object(i.a)(e.xy,2),o=u[0],l=u[1];t&&(E.current=n);var s=E.current,f=Object(i.a)(s,2),m=f[0],p=f[1];v&&v([m+(o-r)/O,p-(l-c)/O,0])})),A=Object(u.useState)(),h=Object(i.a)(A,2),k=h[0],y=h[1],M=null===a||void 0===a?void 0:a.getVideoTracks()[0];Object(u.useEffect)((function(){if(M){var e=document.createElement("canvas"),a=new l.CanvasTexture(e);y(a);var n=new ImageCapture(M),i=e.getContext("2d"),u=setInterval(Object(c.a)(r.a.mark((function c(){var u;return r.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,n.grabFrame();case 3:u=r.sent,e.width=u.width,e.height=u.height,i.drawImage(u,0,0),i.font="18px selif",i.textBaseline="top",i.fillStyle="blue",i.fillText(t,2,2),a.needsUpdate=!0,r.next=16;break;case 14:r.prev=14,r.t0=r.catch(0);case 16:case"end":return r.stop()}}),c,null,[[0,14]])}))),1e3/7.5);return function(){clearInterval(u)}}}),[t,M]);var g=!!!v&&(null===a||void 0===a?void 0:a.getAudioTracks()[0]),I=Object(u.useRef)();return Object(u.useEffect)((function(){if(a&&g){var e=new AudioContext,t=e.createMediaStreamSource(a),n=e.createGain();return n.gain.value=0,I.current=function(t){n.gain.setValueAtTime(t,e.currentTime+1)},t.connect(n),n.connect(e.destination),function(){e.close()}}}),[a,g]),Object(u.useEffect)((function(){I.current&&(void 0===m||p?I.current(0):I.current(Math.min(1,Math.max(0,(5-m)/5))))}),[p,m]),k?o.a.createElement("sprite",Object.assign({},v&&S(),{position:n}),o.a.createElement("spriteMaterial",{map:k})):null})),A=function(e){return[parseInt(e.slice(0,2),16)/128-1,parseInt(e.slice(2,4),16)/128-1,0]},h=o.a.memo((function(e){var t=e.userId,a=e.nickname,n=e.faceStream,r=e.nicknameMap,c=e.faceStreamMap,i=e.avatarMap,l=e.myAvatar,f=e.setMyAvatar,v=function(e){var t;return(null===(t=i[e])||void 0===t?void 0:t.position)||A(e)},m=(null===l||void 0===l?void 0:l.position)||A(t);return o.a.createElement(s.a,null,o.a.createElement(u.Suspense,{fallback:null},o.a.createElement("ambientLight",null),Object.keys(c).map((function(e){if(e===t)return null;var a=v(e),n=Math.hypot(a[0]-m[0],a[1]-m[1],a[2]-m[2]);return o.a.createElement(S,{key:e,nickname:r[e]||"",faceStream:c[e]||null,position:v(e),distance:n})})),o.a.createElement(S,{nickname:a,faceStream:n,position:m,setPosition:function(e){f({position:e})},muted:!0})))})),k=o.a.memo((function(e){var t=e.roomId,a=e.userId,n=e.nickname,r=Object(j.b)(),c=Object(u.useState)(""),l=Object(i.a)(c,2),s=l[0],f=l[1],v=Object(j.a)(),m=Object(u.useState)(""),p=Object(i.a)(m,2),b=p[0],S=p[1],A=Object(O.a)(t,a,!!s,!!b,!!b,s,b,"spatialArea"),k=A.faceStream,y=A.faceStreamMap,M=Object(E.a)(t,a),g=d(t,a),I=g.avatarMap,w=g.myAvatar,x=g.setMyAvatar;return o.a.createElement("div",{className:"SpatialArea-container"},o.a.createElement("div",null,"Select Camera:"," ",o.a.createElement("select",{value:s,onChange:function(e){return f(e.target.value)}},o.a.createElement("option",{value:""},"None"),r.map((function(e){return o.a.createElement("option",{key:e.deviceId,value:e.deviceId},e.label)})))),o.a.createElement("div",null,"Select Mic:"," ",o.a.createElement("select",{value:b,onChange:function(e){S(e.target.value)}},o.a.createElement("option",{value:""},"None"),v.map((function(e){return o.a.createElement("option",{key:e.deviceId,value:e.deviceId},e.label)})))),o.a.createElement("div",{className:"SpatialArea-body"},o.a.createElement(h,{userId:a,nickname:n,faceStream:k,nicknameMap:M,faceStreamMap:y,avatarMap:I,myAvatar:w,setMyAvatar:x})))}));t.default=k}}]);
//# sourceMappingURL=16.044b278e.chunk.js.map