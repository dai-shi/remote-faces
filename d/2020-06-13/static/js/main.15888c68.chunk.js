(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[0],[,,,,function(e,n,t){"use strict";t.d(n,"a",(function(){return r})),t.d(n,"b",(function(){return a})),t.d(n,"c",(function(){return c})),t.d(n,"e",(function(){return o})),t.d(n,"d",(function(){return u}));var r=function(e){try{var n=new URL(e).hash.slice(1),t=new URLSearchParams(n),r=window.location.hash.slice(1),a=new URLSearchParams(r);t.forEach((function(e,n){a.set(n,e)})),window.location.hash=a.toString()}catch(c){}},a=function(e){try{var n=new URL(e).hash.slice(1);return new URLSearchParams(n).get("roomId")}catch(t){return null}},c=function(){var e=window.location.hash.slice(1);return new URLSearchParams(e).get("roomId")},o=function(e){var n=window.location.hash.slice(1),t=new URLSearchParams(n);t.set("roomId",e),window.location.hash=t.toString()},u=function(){var e=window.location.hash.slice(1),n=new URLSearchParams(e).get("server");try{var t=new URL(n||""),r="https:"===t.protocol,a=r?443:80;return{host:t.host.split(":")[0],port:t.port?Number(t.port):a,path:t.pathname,secure:r}}catch(c){}return null}},function(e,n,t){"use strict";t.d(n,"f",(function(){return o})),t.d(n,"e",(function(){return u})),t.d(n,"c",(function(){return i})),t.d(n,"d",(function(){return l})),t.d(n,"b",(function(){return s})),t.d(n,"a",(function(){return f}));var r=t(1),a=t.n(r),c=t(2),o=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:32,n=window.crypto.getRandomValues(new Uint8Array(e)),t=Array.from(n),r=t.map((function(e){return e.toString(16).padStart(2,"0")})).join("");return r},u=function(){return 1e3+window.crypto.getRandomValues(new Uint16Array(1))[0]%9e3},i=function(){var e=Object(c.a)(a.a.mark((function e(){var n,t,r,c;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.crypto.subtle.generateKey({name:"AES-GCM",length:128},!0,["encrypt","decrypt"]);case 2:return n=e.sent,e.next=5,window.crypto.subtle.exportKey("raw",n);case 5:return t=e.sent,r=Array.from(new Uint8Array(t)),c=r.map((function(e){return e.toString(16).padStart(2,"0")})).join(""),e.abrupt("return",c);case 9:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),l=function(){var e=Object(c.a)(a.a.mark((function e(n,t){var r,c,o,u;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(r=n.length/2,c=new Uint8Array(r),o=0;o<r;o+=1)c[o]=parseInt(n.slice(2*o,2*o+2),16);return e.next=5,window.crypto.subtle.importKey("raw",c,{name:"AES-GCM",length:128},!0,t);case 5:return u=e.sent,e.abrupt("return",u);case 7:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),s=function(){var e=Object(c.a)(a.a.mark((function e(n,t){var r,c,o,u,i;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=new TextEncoder,e.next=3,l(t,["encrypt"]);case 3:return c=e.sent,o=window.crypto.getRandomValues(new Uint8Array(12)),e.next=7,window.crypto.subtle.encrypt({name:"AES-GCM",iv:o},c,r.encode(n));case 7:return u=e.sent,(i=new Uint8Array(o.length+u.byteLength)).set(o),i.set(new Uint8Array(u),o.length),e.abrupt("return",i);case 12:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),f=function(){var e=Object(c.a)(a.a.mark((function e(n,t){var r,c,o,u;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l(t,["decrypt"]);case 2:return r=e.sent,e.next=5,window.crypto.subtle.decrypt({name:"AES-GCM",iv:n.slice(0,12)},r,n.slice(12));case 5:return c=e.sent,o=new TextDecoder("utf-8"),u=o.decode(new Uint8Array(c)),e.abrupt("return",u);case 9:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}()},,,function(e,n,t){"use strict";t.d(n,"a",(function(){return r})),t.d(n,"f",(function(){return a})),t.d(n,"c",(function(){return c})),t.d(n,"e",(function(){return o})),t.d(n,"d",(function(){return u})),t.d(n,"b",(function(){return i}));var r=32,a=function(e,n){return"string"===typeof n&&n.startsWith("".concat(e.slice(0,r)," "))},c=function(e,n){return"".concat(e.slice(0,r)," ").concat(n)},o=function(e){return Number(e.split(" ")[1])},u=function(e){return o(e.peer)},i=function(){var e=new Map;return{addConn:function(n){var t=e.get(n.peer);t&&t.conn.close(),e.set(n.peer,{conn:n,mediaTypes:[]})},markConnected:function(n){var t=e.get(n.peer);t&&(t.connected=!0)},isConnected:function(n){var t=e.get(n);return t&&t.connected||!1},setUserId:function(n,t){var r=e.get(n.peer);r&&(r.userId=t)},getUserId:function(n){var t=e.get(n.peer);return t&&t.userId},setMediaTypes:function(n,t){var r=e.get(n.peer);r&&(r.mediaTypes=t)},getMediaTypes:function(n){var t=e.get(n.peer);return t&&t.mediaTypes||[]},hasConn:function(n){return e.has(n)},delConn:function(n){var t=e.get(n.peer);t&&t.conn===n&&e.delete(n.peer)},getConnectedPeerIds:function(){return Array.from(e.keys()).filter((function(n){var t;return null===(t=e.get(n))||void 0===t?void 0:t.connected}))},forEachConnectedConns:function(n){Array.from(e.values()).forEach((function(e){e.connected&&n(e.conn)}))},forEachConnsAcceptingMedia:function(n,t){Array.from(e.values()).forEach((function(e){e.connected&&e.mediaTypes&&e.mediaTypes.includes(n)&&t(e.conn)}))},clearAll:function(){e.size&&console.log("connectionMap garbage:",e),e.clear()}}}},,,,,,,,function(e,n,t){e.exports=t(27)},,,,,function(e,n,t){},function(e,n,t){},function(e,n,t){},,function(e,n,t){},function(e,n,t){},function(e,n,t){"use strict";t.r(n);var r=t(0),a=t.n(r),c=t(11),o=t.n(c),u=(t(21),t(12)),i=t(13),l=t(15),s=t(14),f=(t(22),t(3)),d=a.a.memo((function(e){var n=e.err,t=Object(r.useState)(30),c=Object(f.a)(t,2),o=c[0],u=c[1];return Object(r.useEffect)((function(){o>0?setTimeout((function(){u(o-1)}),1e3):window.location.reload()})),a.a.createElement("div",null,a.a.createElement("h1",null,"Unrecoverable error occurred."),n&&a.a.createElement("h6",null,n.name,": ",n.message),a.a.createElement("p",null,"Will auto reload in ",o," sec."))})),m=(t(23),a.a.memo((function(){return a.a.createElement("div",{className:"Loading-container"},a.a.createElement("div",null,"Loading..."))}))),p=t(1),h=t.n(p),w=t(2),v=(t(25),t(5)),b=t(8),y=t(4),g=a.a.lazy((function(){return t.e(6).then(t.bind(null,104))})),E=a.a.lazy((function(){return Promise.all([t.e(2),t.e(3)]).then(t.bind(null,106))})),C=Object(y.c)(),j=Object(v.f)(),O=a.a.memo((function(){var e=Object(r.useState)(C),n=Object(f.a)(e,2),t=n[0],c=n[1],o=Object(r.useState)(!1),u=Object(f.a)(o,2),i=u[0],l=u[1],s=Object(r.useState)(""),d=Object(f.a)(s,2),m=d[0],p=d[1],O=function(){var e=Object(w.a)(h.a.mark((function e(){return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=c,e.t1=Object(v.f)(b.a/2),e.next=4,Object(v.c)();case 4:e.t2=e.sent,e.t3=e.t1+e.t2,(0,e.t0)(e.t3);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return t?a.a.createElement(E,{roomId:t,userId:j}):a.a.createElement("div",{className:"SingleRoomEntrance-container"},a.a.createElement(g,null,a.a.createElement("div",{className:"SingleRoomEntrance-input"},!i&&a.a.createElement(a.a.Fragment,null,a.a.createElement("div",null,a.a.createElement("button",{type:"button",onClick:O},"Create a new room")),a.a.createElement("div",{className:"SingleRoomEntrance-or"},"OR"),a.a.createElement("div",null,a.a.createElement("button",{type:"button",onClick:function(){return l(!0)}},"Enter an existing room link"))),i&&a.a.createElement("div",null,a.a.createElement("input",{value:m,onChange:function(e){return p(e.target.value)},placeholder:"Enter room link..."}),a.a.createElement("button",{type:"button",onClick:function(){Object(y.a)(m),c(Object(y.b)(m))},disabled:!Object(y.b)(m)},"Enter room"),a.a.createElement("button",{type:"button",onClick:function(){return l(!1)}},"Cancel")))))})),S=(t(26),a.a.memo((function(e){var n=e.size,t=e.fill,r=e.color;return a.a.createElement("a",{href:"https://github.com/dai-shi/remote-faces",className:"GitHubCorner-container","aria-label":"View source on GitHub",target:"_blank",rel:"noopener noreferrer"},a.a.createElement("svg",{width:n||80,height:n||80,viewBox:"0 0 250 250",style:{fill:t||"#151513",color:r||"#fff",position:"absolute",top:0,border:0,right:0},"aria-hidden":"true"},a.a.createElement("path",{d:"M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"}),a.a.createElement("path",{d:"M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2",fill:"currentColor",style:{transformOrigin:"130px 106px"},className:"GitHubCorner-octo-arm"}),a.a.createElement("path",{d:"M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z",fill:"currentColor",className:"GitHubCorner-octo-body"})))}))),k=function(e){Object(l.a)(t,e);var n=Object(s.a)(t);function t(){var e;Object(u.a)(this,t);for(var r=arguments.length,a=new Array(r),c=0;c<r;c++)a[c]=arguments[c];return(e=n.call.apply(n,[this].concat(a))).state={},e}return Object(i.a)(t,[{key:"render",value:function(){var e=this.props.children,n=this.state.err;return n?a.a.createElement(d,{err:n}):e}}],[{key:"getDerivedStateFromError",value:function(e){return{err:e}}}]),t}(a.a.PureComponent),x=a.a.memo((function(){return a.a.createElement("div",{className:"App"},a.a.createElement(k,null,a.a.createElement(r.Suspense,{fallback:a.a.createElement(m,null)},a.a.createElement(O,null),a.a.createElement(S,{size:40,fill:"gray"}))))}));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(x,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[16,1,4]]]);
//# sourceMappingURL=main.15888c68.chunk.js.map