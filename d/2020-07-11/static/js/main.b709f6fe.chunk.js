(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[0],[,,,function(e,n,t){"use strict";t.d(n,"f",(function(){return c})),t.d(n,"e",(function(){return i})),t.d(n,"c",(function(){return u})),t.d(n,"d",(function(){return s})),t.d(n,"b",(function(){return l})),t.d(n,"a",(function(){return f}));var r=t(1),a=t.n(r),o=t(2),c=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:32,n=window.crypto.getRandomValues(new Uint8Array(e)),t=Array.from(n),r=t.map((function(e){return e.toString(16).padStart(2,"0")})).join("");return r},i=function(){return 1e3+window.crypto.getRandomValues(new Uint16Array(1))[0]%9e3},u=function(){var e=Object(o.a)(a.a.mark((function e(){var n,t,r,o;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.crypto.subtle.generateKey({name:"AES-GCM",length:128},!0,["encrypt","decrypt"]);case 2:return n=e.sent,e.next=5,window.crypto.subtle.exportKey("raw",n);case 5:return t=e.sent,r=Array.from(new Uint8Array(t)),o=r.map((function(e){return e.toString(16).padStart(2,"0")})).join(""),e.abrupt("return",o);case 9:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),s=function(){var e=Object(o.a)(a.a.mark((function e(n,t){var r,o,c,i;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(r=n.length/2,o=new Uint8Array(r),c=0;c<r;c+=1)o[c]=parseInt(n.slice(2*c,2*c+2),16);return e.next=5,window.crypto.subtle.importKey("raw",o,{name:"AES-GCM",length:128},!0,t);case 5:return i=e.sent,e.abrupt("return",i);case 7:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),l=function(){var e=Object(o.a)(a.a.mark((function e(n,t){var r,o,c,i,u;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=new TextEncoder,e.next=3,s(t,["encrypt"]);case 3:return o=e.sent,c=window.crypto.getRandomValues(new Uint8Array(12)),e.next=7,window.crypto.subtle.encrypt({name:"AES-GCM",iv:c},o,r.encode(n));case 7:return i=e.sent,(u=new Uint8Array(c.length+i.byteLength)).set(c),u.set(new Uint8Array(i),c.length),e.abrupt("return",u);case 12:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),f=function(){var e=Object(o.a)(a.a.mark((function e(n,t){var r,o,c,i;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s(t,["decrypt"]);case 2:return r=e.sent,e.next=5,window.crypto.subtle.decrypt({name:"AES-GCM",iv:n.slice(0,12)},r,n.slice(12));case 5:return o=e.sent,c=new TextDecoder("utf-8"),i=c.decode(new Uint8Array(o)),e.abrupt("return",i);case 9:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}()},function(e,n,t){"use strict";t.d(n,"a",(function(){return r})),t.d(n,"b",(function(){return a})),t.d(n,"c",(function(){return o})),t.d(n,"e",(function(){return c})),t.d(n,"d",(function(){return i}));var r=function(e){try{var n=new URL(e).hash.slice(1),t=new URLSearchParams(n),r=window.location.hash.slice(1),a=new URLSearchParams(r);t.forEach((function(e,n){a.set(n,e)})),window.location.hash=a.toString()}catch(o){}},a=function(e){try{var n=new URL(e).hash.slice(1);return new URLSearchParams(n).get("roomId")}catch(t){return null}},o=function(){var e=window.location.hash.slice(1);return new URLSearchParams(e).get("roomId")},c=function(e){var n=window.location.hash.slice(1),t=new URLSearchParams(n);t.set("roomId",e),window.location.hash=t.toString()},i=function(){var e=window.location.hash.slice(1),n=new URLSearchParams(e).get("server");try{var t=new URL(n||""),r="https:"===t.protocol,a=r?443:80;return{host:t.host.split(":")[0],port:t.port?Number(t.port):a,path:t.pathname,secure:r}}catch(o){}return null}},,function(e,n,t){"use strict";t.d(n,"a",(function(){return r}));var r=function(e){return new Promise((function(n){return setTimeout(n,e)}))}},function(e,n,t){"use strict";t.d(n,"a",(function(){return r}));var r=function(e){return"object"===typeof e&&null!==e}},,,,,function(e,n,t){"use strict";t.d(n,"a",(function(){return p})),t.d(n,"b",(function(){return C}));var r=t(8),a=t(1),o=t.n(a),c=t(2),i=t(18),u=t.n(i),s=t(6),l=t(3),f=t(4),d=t(7),p=32,v=function(e,n){return"".concat(e.slice(0,p)," ").concat(n)},m=function(e){return Number(e.split(" ")[1])},h=function(e){return m(e.peer)},y=new WeakMap,b=function(e,n){if(y.has(e))return e;y.set(e,!0);var t=function(){var t=Object(c.a)(o.a.mark((function t(){var r;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Object(s.a)(5e3);case 2:!(r=n.getTransceivers().find((function(n){return n.receiver.track===e})))||"inactive"!==r.currentDirection&&"sendonly"!==r.currentDirection||(e.stop(),e.dispatchEvent(new Event("ended")));case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return e.addEventListener("mute",t),e},g=function(e){var n=m(e);return 10<=n&&n<=14},w=function(e,n,t,a,i,y){var w=!1,C=null,E=function(){var e=new Map;return{addConn:function(n){var t=e.get(n.peer);t&&t.conn.close(),e.set(n.peer,{conn:n,mediaTypes:[]})},markConnected:function(n){var t=e.get(n.peer);t&&(t.connected=!0)},isConnected:function(n){var t=e.get(n);return t&&t.connected||!1},setUserId:function(n,t){var r=e.get(n.peer);r&&(r.userId=t)},getUserId:function(n){var t=e.get(n.peer);return t&&t.userId},setMediaTypes:function(n,t){var r=e.get(n.peer);r&&(r.mediaTypes=t)},getMediaTypes:function(n){var t=e.get(n.peer);return t&&t.mediaTypes||[]},hasConn:function(n){return e.has(n)},getConn:function(n){var t=e.get(n);return t?t.conn:null},delConn:function(n){var t=e.get(n.peer);t&&t.conn===n&&e.delete(n.peer)},getConnectedPeerIds:function(){return Array.from(e.keys()).filter((function(n){var t;return null===(t=e.get(n))||void 0===t?void 0:t.connected}))},forEachConnectedConns:function(n){Array.from(e.values()).forEach((function(e){e.connected&&n(e.conn)}))},forEachConnsAcceptingMedia:function(n,t){Array.from(e.values()).forEach((function(e){e.connected&&e.mediaTypes&&e.mediaTypes.includes(n)&&t(e.conn)}))},clearAll:function(){e.size&&console.log("connectionMap garbage:",e),e.clear()}}}(),k=[],O=null,x=function(){if(!w){var e=E.getConnectedPeerIds().map(m);t({type:"CONNECTED_PEERS",peerIndexList:e})}},j=function(e){if(!w&&C&&C.id!==e&&!C.disconnected&&!E.hasConn(e)){console.log("connectPeer",e);var n=C.connect(e);U(n)}},S=function(e){if(!w){var t=E.getConnectedPeerIds();E.forEachConnectedConns((function(r){L(r,{userId:n,data:e,peers:t,mediaTypes:k})}))}},T=function(e,n){L(e,{SDP:n})},I=function(){var e=Object(c.a)(o.a.mark((function e(n,t){var r,a,c;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(Object(d.a)(t)){e.next=2;break}return e.abrupt("return");case 2:if(!Object(d.a)(t.offer)){e.next=21;break}return r=t.offer,e.prev=4,e.next=7,n.peerConnection.setRemoteDescription(r);case 7:return W(n),e.next=10,n.peerConnection.createAnswer();case 10:return a=e.sent,e.next=13,n.peerConnection.setLocalDescription(a);case 13:T(n,{answer:a}),e.next=19;break;case 16:e.prev=16,e.t0=e.catch(4),console.info("handleSDP offer failed",e.t0);case 19:e.next=38;break;case 21:if(!Object(d.a)(t.answer)){e.next=37;break}return c=t.answer,e.prev=23,e.next=26,n.peerConnection.setRemoteDescription(c);case 26:e.next=35;break;case 28:return e.prev=28,e.t1=e.catch(23),console.info("handleSDP answer failed",e.t1),e.next=33,Object(s.a)(30*Math.random()*1e3);case 33:z(n),W(n);case 35:e.next=38;break;case 37:console.warn("unknown SDP",t);case 38:case"end":return e.stop()}}),e,null,[[4,16],[23,28]])})));return function(n,t){return e.apply(this,arguments)}}(),M=function(e,n){"string"===typeof n&&E.setUserId(e,n)},N=function(){var e=Object(c.a)(o.a.mark((function e(n,t){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!Array.isArray(t)||!t.every((function(e){return"string"===typeof e}))){e.next=5;break}return E.setMediaTypes(n,t),e.next=4,Object(s.a)(5e3);case 4:W(n);case 5:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),P=function(n){Array.isArray(n)&&n.forEach((function(n){(function(e,n){return"string"===typeof n&&n.startsWith("".concat(e.slice(0,p)," "))})(e,n)&&j(n)}))},A=function(e,n){var t=E.getUserId(e);if(t){var r={userId:t,peerIndex:h(e),mediaTypes:E.getMediaTypes(e)};try{i(n,r)}catch(a){console.warn("receiveData",a)}}},R=function(){var n=Object(c.a)(o.a.mark((function n(t,r){var a;return o.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(!w){n.next=2;break}return n.abrupt("return");case 2:return n.prev=2,n.t0=JSON,n.next=6,Object(l.a)(r,e.slice(p));case 6:if(n.t1=n.sent,a=n.t0.parse.call(n.t0,n.t1),console.log("decrypted payload",t.peer,a),Object(d.a)(a)){n.next=11;break}return n.abrupt("return");case 11:I(t,a.SDP),M(t,a.userId),N(t,a.mediaTypes),P(a.peers),A(t,a.data),n.next=21;break;case 18:n.prev=18,n.t2=n.catch(2),console.info("Error in handlePayload",n.t2,r);case 21:case"end":return n.stop()}}),n,null,[[2,18]])})));return function(e,t){return n.apply(this,arguments)}}(),L=function(){var n=Object(c.a)(o.a.mark((function n(t,r){var a;return o.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,Object(l.b)(JSON.stringify(r),e.slice(p));case 3:a=n.sent,t.send(a),n.next=10;break;case 7:n.prev=7,n.t0=n.catch(0),console.error("sendPayload",n.t0);case 10:case"end":return n.stop()}}),n,null,[[0,7]])})));return function(e,t){return n.apply(this,arguments)}}(),U=function(e){if(E.isConnected(e.peer))e.close();else{E.addConn(e),e.on("open",(function(){E.markConnected(e),console.log("dataConnection open",e),x();var n=m(e.peer);a(n)})),e.on("data",(function(n){return R(e,n)})),e.peerConnection.addEventListener("icegatheringstatechange",(function(){var n=e.peerConnection;"complete"===n.iceGatheringState&&(n.onicecandidate=function(){})}));var n=new WeakMap;e.peerConnection.addEventListener("negotiationneeded",Object(c.a)(o.a.mark((function t(){var r;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!n.has(e)){t.next=2;break}return t.abrupt("return");case 2:return n.set(e,!0),t.next=5,Object(s.a)(2e3);case 5:if(n.delete(e),E.isConnected(e.peer)){t.next=8;break}return t.abrupt("return");case 8:return t.next=10,e.peerConnection.createOffer();case 10:return r=t.sent,t.next=13,e.peerConnection.setLocalDescription(r);case 13:T(e,{offer:r});case 14:case"end":return t.stop()}}),t)})))),e.peerConnection.addEventListener("track",(function(n){var t=E.getUserId(e);if(t){var r={userId:t,peerIndex:m(e.peer),mediaTypes:E.getMediaTypes(e)};y(b(n.track,e.peerConnection),r)}})),e.on("close",(function(){if(E.delConn(e),console.log("dataConnection closed",e),t({type:"CONNECTION_CLOSED",peerIndex:h(e)}),x(),0===E.getConnectedPeerIds().length)G(!0);else if(g(e.peer)&&C&&!C.disconnected&&!g(C.id)){var n=30+Math.floor(60*Math.random());console.log("Disconnected seed peer: ".concat(m(e.peer),", reinit in ").concat(n,"sec...")),setTimeout(G,1e3*n)}}))}},D=function n(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10;if(!w&&!C){E.clearAll();var o=10<=a&&a<=14,c=o?a:Object(l.e)();t({type:"INITIALIZING_PEER",peerIndex:c});var i=v(e,c);console.log("initMyPeer start",a,i);var s=new u.a(i,Object(r.a)(Object(r.a)({},Object(f.d)()||{}),{},{debug:3}));C=s,s.on("open",(function(){C=s,t({type:"CONNECTING_SEED_PEERS"});for(var n=10;n<=14;n+=1){var r=v(e,n);j(r)}})),s.on("error",(function(e){"unavailable-id"===e.type?(C=null,s.destroy(),n(a+1)):"peer-unavailable"===e.type||("disconnected"===e.type?(console.log("initMyPeer disconnected error",a,e),s.destroy()):"network"===e.type?console.log("initMyPeer network error",a,e):"server-error"===e.type?(console.log("initMyPeer server error",a,e),t({type:"SERVER_ERROR"})):(console.error("initMyPeer unknown error",a,e.type,e),t({type:"UNKNOWN_ERROR",err:e})))})),s.on("connection",(function(e){C===s?(console.log("new connection received",e),t({type:"NEW_CONNECTION",peerIndex:h(e)}),U(e)):e.close()})),s.on("disconnected",(function(){console.log("initMyPeer disconnected",a),setTimeout((function(){C!==s||s.destroyed||(console.log("initMyPeer reconnecting",a),t({type:"RECONNECTING"}),s.reconnect())}),5e3)})),s.on("close",(function(){C===s?(console.log("initMyPeer closed, re-initializing",a),C=null,setTimeout(n,2e4)):console.log("initMyPeer closed, ignoring",a)}))}};D();var G=function(n){if(C&&!C.disconnected){if(!n){if(g(C.id))return;for(var t=!0,r=10;r<=14;r+=1){var a=v(e,r);if(!E.isConnected(a)){t=!1;break}}if(t)return void x()}var o=C;C=null,o.destroy(),D()}},_=new WeakMap,W=function(e){var n=e.peerConnection.getSenders(),t=E.getMediaTypes(e);O&&O.getTracks().forEach((function(r){var a=_.get(r);O&&a&&t.includes(a)&&n.every((function(e){return e.track!==r}))&&e.peerConnection.addTrack(r,O)})),n.forEach((function(n){if(n.track){var r=_.get(n.track);r&&t.includes(r)||e.peerConnection.removeTrack(n)}})),n.some((function(e){return e.track&&!e.transport}))&&e.peerConnection.dispatchEvent(new Event("negotiationneeded"))},z=function(e){e.peerConnection.getSenders().forEach((function(n){n.track&&e.peerConnection.removeTrack(n)}))};return{broadcastData:S,sendData:function(t,r){if(!w){var a=E.getConn(v(e,r));if(a){var o=E.getConnectedPeerIds();L(a,{userId:n,data:t,peers:o,mediaTypes:k})}}},acceptMediaTypes:function(e){(k=e).length?O||(O=new MediaStream,E.forEachConnectedConns((function(e){var n=E.getUserId(e);if(n){var t={userId:n,peerIndex:m(e.peer),mediaTypes:E.getMediaTypes(e)};e.peerConnection.getReceivers().forEach((function(n){"live"===n.track.readyState&&y(b(n.track,e.peerConnection),t)}))}}))):O=null,S(null)},addTrack:function(e,n){O&&(_.set(n,e),O.addTrack(n),E.forEachConnsAcceptingMedia(e,(function(e){try{if(!O)return;e.peerConnection.addTrack(n,O)}catch(t){if("InvalidAccessError"!==t.name)throw t}})))},removeTrack:function(e,n){O&&O.removeTrack(n),E.forEachConnsAcceptingMedia(e,(function(e){var t=e.peerConnection.getSenders().find((function(e){return e.track===n}));t&&e.peerConnection.removeTrack(t)}))},dispose:function(){w=!0,C&&C.destroy()}}},C=function(){return w.apply(void 0,arguments)}},,,,,,,,,function(e,n,t){e.exports=t(33)},,,,,function(e,n,t){},function(e,n,t){},function(e,n,t){},,function(e,n,t){},function(e,n){function t(e){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}t.keys=function(){return[]},t.resolve=t,e.exports=t,t.id=31},function(e,n,t){},function(e,n,t){"use strict";t.r(n);var r=t(0),a=t.n(r),o=t(15),c=t.n(o),i=(t(26),t(16)),u=t(17),s=t(20),l=t(19),f=(t(27),t(5)),d=a.a.memo((function(e){var n=e.err,t=Object(r.useState)(30),o=Object(f.a)(t,2),c=o[0],i=o[1];return Object(r.useEffect)((function(){c>0?setTimeout((function(){i(c-1)}),1e3):window.location.reload()})),a.a.createElement("div",null,a.a.createElement("h1",null,"Unrecoverable error occurred."),n&&a.a.createElement("h6",null,n.name,": ",n.message),a.a.createElement("p",null,"Will auto reload in ",c," sec."))})),p=(t(28),a.a.memo((function(){return a.a.createElement("div",{className:"Loading-container"},a.a.createElement("div",null,"Loading..."))}))),v=t(1),m=t.n(v),h=t(2),y=(t(30),t(3)),b=t(12),g=t(4),w=a.a.lazy((function(){return t.e(7).then(t.bind(null,102))})),C=a.a.lazy((function(){return Promise.all([t.e(2),t.e(4)]).then(t.bind(null,104))})),E=Object(g.c)(),k=Object(y.f)(),O=a.a.memo((function(){var e=Object(r.useState)(E),n=Object(f.a)(e,2),t=n[0],o=n[1],c=Object(r.useState)(!1),i=Object(f.a)(c,2),u=i[0],s=i[1],l=Object(r.useState)(""),d=Object(f.a)(l,2),p=d[0],v=d[1],O=function(){var e=Object(h.a)(m.a.mark((function e(){return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=o,e.t1=Object(y.f)(b.a/2),e.next=4,Object(y.c)();case 4:e.t2=e.sent,e.t3=e.t1+e.t2,(0,e.t0)(e.t3);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return t?a.a.createElement(C,{roomId:t,userId:k}):a.a.createElement("div",{className:"SingleRoomEntrance-container"},a.a.createElement(w,null,a.a.createElement("div",{className:"SingleRoomEntrance-input"},!u&&a.a.createElement(a.a.Fragment,null,a.a.createElement("div",null,a.a.createElement("button",{type:"button",onClick:O},"Create a new room")),a.a.createElement("div",{className:"SingleRoomEntrance-or"},"OR"),a.a.createElement("div",null,a.a.createElement("button",{type:"button",onClick:function(){return s(!0)}},"Enter an existing room link"))),u&&a.a.createElement("div",null,a.a.createElement("input",{value:p,onChange:function(e){return v(e.target.value)},placeholder:"Enter room link..."}),a.a.createElement("button",{type:"button",onClick:function(){Object(g.a)(p),o(Object(g.b)(p))},disabled:!Object(g.b)(p)},"Enter room"),a.a.createElement("button",{type:"button",onClick:function(){return s(!1)}},"Cancel")))))})),x=(t(32),a.a.memo((function(e){var n=e.size,t=e.fill,r=e.color;return a.a.createElement("a",{href:"https://github.com/dai-shi/remote-faces",className:"GitHubCorner-container","aria-label":"View source on GitHub",target:"_blank",rel:"noopener noreferrer"},a.a.createElement("svg",{width:n||80,height:n||80,viewBox:"0 0 250 250",style:{fill:t||"#151513",color:r||"#fff",position:"absolute",top:0,border:0,right:0},"aria-hidden":"true"},a.a.createElement("path",{d:"M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"}),a.a.createElement("path",{d:"M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2",fill:"currentColor",style:{transformOrigin:"130px 106px"},className:"GitHubCorner-octo-arm"}),a.a.createElement("path",{d:"M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z",fill:"currentColor",className:"GitHubCorner-octo-body"})))}))),j=function(e){Object(s.a)(t,e);var n=Object(l.a)(t);function t(){var e;Object(i.a)(this,t);for(var r=arguments.length,a=new Array(r),o=0;o<r;o++)a[o]=arguments[o];return(e=n.call.apply(n,[this].concat(a))).state={},e}return Object(u.a)(t,[{key:"render",value:function(){var e=this.props.children,n=this.state.err;return n?a.a.createElement(d,{err:n}):e}}],[{key:"getDerivedStateFromError",value:function(e){return{err:e}}}]),t}(a.a.PureComponent),S=a.a.memo((function(){return a.a.createElement("div",{className:"App"},a.a.createElement(j,null,a.a.createElement(r.Suspense,{fallback:a.a.createElement(p,null)},a.a.createElement(O,null),a.a.createElement(x,{size:40,fill:"gray"}))))}));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(S,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[21,1,3]]]);
//# sourceMappingURL=main.b709f6fe.chunk.js.map