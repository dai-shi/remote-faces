(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[1],{12:function(e,n,t){"use strict";t.d(n,"a",(function(){return r}));var r=32},16:function(e,n,t){"use strict";t.d(n,"b",(function(){return u}));var r=t(1),a=t.n(r),c=t(3),o=t(4),i=t(12);t.d(n,"a",(function(){return i.a}));var u=function(){var e=Object(c.a)(a.a.mark((function e(){var n,r=arguments;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!Object(o.e)()){e.next=6;break}return e.next=3,Promise.all([t.e(12),t.e(10)]).then(t.bind(null,43));case 3:n=e.sent.createRoom,e.next=15;break;case 6:if(!Object(o.f)()){e.next=12;break}return e.next=9,Promise.all([t.e(0),t.e(6)]).then(t.bind(null,42));case 9:n=e.sent.createRoom,e.next=15;break;case 12:return e.next=14,Promise.all([t.e(0),t.e(9),t.e(7)]).then(t.bind(null,44));case 14:n=e.sent.createRoom;case 15:return e.abrupt("return",n.apply(void 0,r));case 16:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},26:function(e,n,t){"use strict";t.d(n,"a",(function(){return o}));var r=t(0),a=t(2),c=t.n(a),o=(t(37),c.a.memo((function(){return Object(r.jsx)("div",{className:"Loading-container",children:Object(r.jsx)("div",{children:"Loading..."})})})))},35:function(e,n,t){},36:function(e,n,t){},37:function(e,n,t){},39:function(e,n,t){},4:function(e,n,t){"use strict";t.d(n,"a",(function(){return r})),t.d(n,"b",(function(){return a})),t.d(n,"d",(function(){return c})),t.d(n,"g",(function(){return o})),t.d(n,"e",(function(){return i})),t.d(n,"c",(function(){return u})),t.d(n,"f",(function(){return s}));var r=function(e){try{var n=new URL(e).hash.slice(1),t=new URLSearchParams(n),r=window.location.hash.slice(1),a=new URLSearchParams(r);t.forEach((function(e,n){a.set(n,e)})),window.location.hash=a.toString()}catch(c){}},a=function(e){try{var n=new URL(e).hash.slice(1);return new URLSearchParams(n).get("roomId")}catch(t){return null}},c=function(){var e=window.location.hash.slice(1);return new URLSearchParams(e).get("roomId")},o=function(e){var n=window.location.hash.slice(1),t=new URLSearchParams(n);t.set("roomId",e),window.location.hash=t.toString()},i=function(){var e=window.location.hash.slice(1);return new URLSearchParams(e).has("peerjs")},u=function(){var e=window.location.hash.slice(1),n=new URLSearchParams(e).get("peerjs");try{var t=new URL(n||""),r="https:"===t.protocol,a=r?443:80;return{host:t.host.split(":")[0],port:t.port?Number(t.port):a,path:t.pathname,secure:r}}catch(c){}},s=function(){var e=window.location.hash.slice(1);return new URLSearchParams(e).has("pubsub")}},40:function(e,n,t){},41:function(e,n,t){"use strict";t.r(n);var r=t(0),a=t(2),c=t.n(a),o=t(28),i=t.n(o),u=(t(35),t(14)),s=t(17),f=t(18),l=t(20),h=(t(36),t(5)),d=c.a.memo((function(e){var n=e.err,t=Object(a.useState)(30),c=Object(h.a)(t,2),o=c[0],i=c[1];return Object(a.useEffect)((function(){o>0?setTimeout((function(){i(o-1)}),1e3):window.location.reload()})),Object(r.jsxs)("div",{children:[Object(r.jsx)("h1",{children:"Unrecoverable error occurred."}),n&&Object(r.jsxs)("h6",{children:[n.name,": ",n.message]}),Object(r.jsxs)("p",{children:["Will auto reload in ",o," sec."]})]})})),b=t(26),p=t(1),w=t.n(p),j=t(3),m=(t(39),t(7)),y=t(16),v=t(4),x=c.a.lazy((function(){return t.e(15).then(t.bind(null,1244))})),O=c.a.lazy((function(){return Promise.all([t.e(3),t.e(5)]).then(t.bind(null,1246))})),g=Object(v.d)(),k=Object(m.j)(),U=c.a.memo((function(){var e=Object(a.useState)(g),n=Object(h.a)(e,2),t=n[0],c=n[1],o=Object(a.useState)(!1),i=Object(h.a)(o,2),u=i[0],s=i[1],f=Object(a.useState)(""),l=Object(h.a)(f,2),d=l[0],b=l[1],p=function(){var e=Object(j.a)(w.a.mark((function e(){return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=c,e.t1=Object(m.j)(y.a/2),e.next=4,Object(m.g)();case 4:e.t2=e.sent,e.t3=e.t1+e.t2,(0,e.t0)(e.t3);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return t?Object(r.jsx)(O,{roomId:t,userId:k}):Object(r.jsx)("div",{className:"SingleRoomEntrance-container",children:Object(r.jsx)(x,{children:Object(r.jsxs)("div",{className:"SingleRoomEntrance-input",children:[!u&&Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("div",{children:Object(r.jsx)("button",{type:"button",onClick:p,children:"Create a new room"})}),Object(r.jsx)("div",{className:"SingleRoomEntrance-or",children:"OR"}),Object(r.jsx)("div",{children:Object(r.jsx)("button",{type:"button",onClick:function(){return s(!0)},children:"Enter an existing room link"})})]}),u&&Object(r.jsxs)("div",{children:[Object(r.jsx)("input",{value:d,onChange:function(e){return b(e.target.value)},placeholder:"Enter room link..."}),Object(r.jsx)("button",{type:"button",onClick:function(){Object(v.a)(d),c(Object(v.b)(d))},disabled:!Object(v.b)(d),children:"Enter room"}),Object(r.jsx)("button",{type:"button",onClick:function(){return s(!1)},children:"Cancel"})]})]})})})})),A=(t(40),c.a.memo((function(e){var n=e.size,t=e.fill,a=e.color;return Object(r.jsx)("a",{href:"https://github.com/dai-shi/remote-faces",className:"GitHubCorner-container","aria-label":"View source on GitHub",target:"_blank",rel:"noopener noreferrer",children:Object(r.jsxs)("svg",{width:n||80,height:n||80,viewBox:"0 0 250 250",style:{fill:t||"#151513",color:a||"#fff",position:"absolute",top:0,border:0,right:0},"aria-hidden":"true",children:[Object(r.jsx)("path",{d:"M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"}),Object(r.jsx)("path",{d:"M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2",fill:"currentColor",style:{transformOrigin:"130px 106px"},className:"GitHubCorner-octo-arm"}),Object(r.jsx)("path",{d:"M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z",fill:"currentColor",className:"GitHubCorner-octo-body"})]})})}))),C=function(e){Object(f.a)(t,e);var n=Object(l.a)(t);function t(){var e;Object(u.a)(this,t);for(var r=arguments.length,a=new Array(r),c=0;c<r;c++)a[c]=arguments[c];return(e=n.call.apply(n,[this].concat(a))).state={},e}return Object(s.a)(t,[{key:"render",value:function(){var e=this.props.children,n=this.state.err;return n?Object(r.jsx)(d,{err:n}):e}}],[{key:"getDerivedStateFromError",value:function(e){return{err:e}}}]),t}(c.a.PureComponent),S=c.a.memo((function(){return Object(r.jsx)("div",{className:"App",children:Object(r.jsx)(C,{children:Object(r.jsxs)(a.Suspense,{fallback:Object(r.jsx)(b.a,{}),children:[Object(r.jsx)(U,{}),Object(r.jsx)(A,{size:40,fill:"gray"})]})})})}));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(Object(r.jsx)(c.a.StrictMode,{children:Object(r.jsx)(S,{})}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},7:function(e,n,t){"use strict";t.d(n,"k",(function(){return u})),t.d(n,"j",(function(){return s})),t.d(n,"i",(function(){return f})),t.d(n,"g",(function(){return l})),t.d(n,"h",(function(){return h})),t.d(n,"e",(function(){return p})),t.d(n,"b",(function(){return w})),t.d(n,"f",(function(){return j})),t.d(n,"c",(function(){return v})),t.d(n,"d",(function(){return x})),t.d(n,"a",(function(){return O}));var r=t(1),a=t.n(r),c=t(3),o=(t(30),t(27)),i=t(6),u=function(){var e=Object(c.a)(a.a.mark((function e(n){var t,r,c,o,i;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=new TextEncoder,r=t.encode(n),e.next=4,window.crypto.subtle.digest("SHA-256",r);case 4:return c=e.sent,o=Array.from(new Uint8Array(c)),i=o.map((function(e){return e.toString(16).padStart(2,"0")})).join(""),e.abrupt("return",i);case 8:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),s=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:32,n=window.crypto.getRandomValues(new Uint8Array(e)),t=Array.from(n),r=t.map((function(e){return e.toString(16).padStart(2,"0")})).join("");return r},f=function(){return 1e3+window.crypto.getRandomValues(new Uint16Array(1))[0]%9e3},l=function(){var e=Object(c.a)(a.a.mark((function e(){var n,t,r,c;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.crypto.subtle.generateKey({name:"AES-GCM",length:128},!0,["encrypt","decrypt"]);case 2:return n=e.sent,e.next=5,window.crypto.subtle.exportKey("raw",n);case 5:return t=e.sent,r=Array.from(new Uint8Array(t)),c=r.map((function(e){return e.toString(16).padStart(2,"0")})).join(""),e.abrupt("return",c);case 9:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),h=function(){var e=Object(c.a)(a.a.mark((function e(n){var t,r,c,o,i,u=arguments;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(t=u.length>1&&void 0!==u[1]?u[1]:["encrypt","decrypt"],r=n.length/2,c=new Uint8Array(r),o=0;o<r;o+=1)c[o]=parseInt(n.slice(2*o,2*o+2),16);return e.next=6,window.crypto.subtle.importKey("raw",c,{name:"AES-GCM",length:128},!0,t);case 6:return i=e.sent,e.abrupt("return",i);case 8:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),d=function(){var e=Object(c.a)(a.a.mark((function e(n,t){var r,c,o;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=window.crypto.getRandomValues(new Uint8Array(12)),e.next=3,window.crypto.subtle.encrypt({name:"AES-GCM",iv:r},t,n);case 3:return c=e.sent,(o=new Uint8Array(r.length+c.byteLength)).set(r),o.set(new Uint8Array(c),r.length),e.abrupt("return",o.buffer);case 8:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),b=function(){var e=Object(c.a)(a.a.mark((function e(n,t,r,c){var o;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.crypto.subtle.decrypt({name:"AES-GCM",iv:n.slice(t,t+12)},c,n.slice(t+12,t+r));case 2:return o=e.sent,e.abrupt("return",o);case 4:case"end":return e.stop()}}),e)})));return function(n,t,r,a){return e.apply(this,arguments)}}(),p=function(){var e=Object(c.a)(a.a.mark((function e(n,t){var r,c,o;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=new TextEncoder,c=r.encode(n),o=i.a.deflate(c),e.abrupt("return",d(o,t));case 4:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),w=function(){var e=Object(c.a)(a.a.mark((function e(n,t){var r,c,o,u;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b(n,0,n.byteLength,t);case 2:return r=e.sent,c=i.a.inflate(new Uint8Array(r)),o=new TextDecoder("utf-8"),u=o.decode(c),e.abrupt("return",u);case 7:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}();function j(e,n){return m.apply(this,arguments)}function m(){return(m=Object(o.a)(a.a.mark((function e(n,t){var r,c,o,u,s,f,l,h,b,p=arguments;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=p.length>2&&void 0!==p[2]?p[2]:6e4,c=new TextEncoder,o=c.encode(n),u=[],(s=new i.a.Deflate({chunkSize:r})).onData=function(e){u.push(e)},s.push(o,!0),f=u.length,l=window.crypto.getRandomValues(new Uint8Array(4)),h=0;case 10:if(!(h<f)){e.next=21;break}return(b=new Uint8Array(8+u[h].byteLength)).set(l),b.set(new Uint8Array(Uint16Array.of(h).buffer),4),b.set(new Uint8Array(Uint16Array.of(f).buffer),6),b.set(u[h],8),e.next=18,d(b,t);case 18:h+=1,e.next=10;break;case 21:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var y=[],v=function(){var e=Object(c.a)(a.a.mark((function e(n,t){var r,c,o,u,s,f,l,h,d,p;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b(n,0,n.byteLength,t);case 2:if(r=e.sent,c=new Uint32Array(r,0,4)[0],o=new Uint16Array(r,4,2)[0],u=new Uint16Array(r,6,2)[0],s=y.find((function(e){return e.id===c}))){e.next=13;break}s={id:c,len:u,chunks:[]},y.push(s),y.length>100&&y.shift(),e.next=15;break;case 13:if(s.len===u){e.next=15;break}throw new Error("chunk len mismatch");case 15:s.chunks[o]=r,f=0;case 17:if(!(f<u)){e.next=23;break}if(s.chunks[f]){e.next=20;break}return e.abrupt("return",null);case 20:f+=1,e.next=17;break;case 23:for(l=new i.a.Inflate,h=0;h<u;h+=1)l.push(new Uint8Array(s.chunks[h],8),h===u-1);return d=new TextDecoder("utf-8"),p=d.decode(l.result),e.abrupt("return",p);case 28:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),x=function(e,n){var t=2*(e.length+1)+e.reduce((function(e,n){return e+n.byteLength}),0),r=new Uint8Array(t),a=0;return e.forEach((function(e){if(0===e.byteLength)throw new Error("buffer is empty");r.set(new Uint8Array(Uint16Array.of(e.byteLength).buffer),a),a+=2})),r.set(new Uint8Array(Uint16Array.of(0).buffer),a),a+=2,e.forEach((function(e){r.set(new Uint8Array(e),a),a+=e.byteLength})),d(r,n)},O=function(){var e=Object(c.a)(a.a.mark((function e(n,t,r,c){var o,i,u,s,f;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b(n,t,r,c);case 2:o=e.sent,i=[],u=0;case 5:if(!(u<o.byteLength)){e.next=13;break}if(s=new Uint16Array(o,u,2)[0],u+=2,0!==s){e.next=10;break}return e.abrupt("break",13);case 10:i.push(s),e.next=5;break;case 13:return f=[],i.forEach((function(e){f.push(o.slice(u,u+e)),u+=e})),e.abrupt("return",f);case 16:case"end":return e.stop()}}),e)})));return function(n,t,r,a){return e.apply(this,arguments)}}()}},[[41,2,4]]]);
//# sourceMappingURL=main.c4a8dcd4.chunk.js.map