(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[14],{1142:function(e,t,n){},1152:function(e,t,n){"use strict";n.r(t),n.d(t,"ScreenShare",(function(){return p}));var r=n(5),a=n(0),c=n.n(a),u=(n(1142),n(1)),s=n.n(u),i=n(108),o=n(114),f=n(2),m=function(){var e=Object(f.a)(s.a.mark((function e(){var t,n,a,c,u,i;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t={video:!0},e.next=4,navigator.mediaDevices.getDisplayMedia(t);case 4:return n=e.sent,a=n.getVideoTracks(),c=Object(r.a)(a,1),u=c[0],i=function(){u.stop()},e.abrupt("return",{stream:n,dispose:i});case 10:return e.prev=10,e.t0=e.catch(0),e.abrupt("return",null);case 13:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(){return e.apply(this,arguments)}}(),b=n(121),l=n(209),d=c.a.memo((function(e){var t=e.nickname,n=e.stream,r=Object(a.useRef)(null);return Object(a.useEffect)((function(){n&&r.current&&(r.current.srcObject=n)}),[n]),c.a.createElement("div",null,c.a.createElement("div",{className:"ScreenShare-nickname"},t),c.a.createElement("video",{className:"ScreenShare-video",ref:r,autoPlay:!0,muted:!0}))})),p=c.a.memo((function(e){var t=e.roomId,n=e.userId,u=e.nickname,p=Object(a.useState)(!1),v=Object(r.a)(p,2),j=v[0],O=v[1],S=function(e,t,n,c){var u=Object(a.useState)(null),l=Object(r.a)(u,2),d=l[0],p=l[1],v=Object(a.useState)({}),j=Object(r.a)(v,2),O=j[0],S=j[1],h=Object(a.useRef)([]);Object(a.useEffect)((function(){return function(){h.current.forEach((function(e){return e()}))}}),[]);var k=Object(a.useCallback)(function(){var e=Object(f.a)(s.a.mark((function e(t,n){var r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:S((function(e){return Object(o.a)(Object(o.a)({},e),{},Object(i.a)({},n.userId,new MediaStream([t])))})),r=function(){S((function(e){return Object(o.a)(Object(o.a)({},e),{},Object(i.a)({},n.userId,null))}))},t.addEventListener("ended",r),h.current.push((function(){t.removeEventListener("ended",r)}));case 4:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),[]),E=Object(b.c)(e,t,k,"screenVideo");return Object(a.useEffect)((function(){var e=null;return n&&E&&Object(f.a)(s.a.mark((function t(){var n,a,u,i,o;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,m();case 2:if(n=t.sent){t.next=6;break}return c(!1),t.abrupt("return");case 6:a=n.stream.getVideoTracks(),u=Object(r.a)(a,1),i=u[0],o=E(i),p(n.stream),e=function(){o(),n.dispose(),p(null),c(!1)},i.addEventListener("ended",(function(){e&&e(),e=null}));case 11:case"end":return t.stop()}}),t)})))(),function(){e&&e()}}),[e,n,c,E]),{screenStream:d,screenStreamMap:O}}(t,n,j,O),h=S.screenStream,k=S.screenStreamMap,E=Object(l.a)(t,n);return c.a.createElement("div",{className:"ScreenShare-container"},c.a.createElement("button",{type:"button",onClick:function(){return O(!j)}},j?"Stop screen share":"Start screen share"),h&&c.a.createElement(d,{nickname:u,stream:h}),Object.keys(k).map((function(e){var t=k[e];return t?c.a.createElement(d,{key:e,nickname:E[e]||"No Name",stream:t}):null})))}));t.default=p}}]);
//# sourceMappingURL=14.249db0b2.chunk.js.map