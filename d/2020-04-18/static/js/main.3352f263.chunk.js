(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[0],[,,,,,,,,,,,,,,,function(e,t,n){e.exports=n(26)},,,,,function(e,t,n){},,function(e,t){function n(e){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}n.keys=function(){return[]},n.resolve=n,e.exports=n,n.id=22},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(8),c=n.n(o),u=(n(20),n(9)),i=n(10),s=n(12),l=n(14),f=n(2),d=function(){var e=Object(r.useState)(30),t=Object(f.a)(e,2),n=t[0],o=t[1];return Object(r.useEffect)((function(){n>0?setTimeout((function(){o(n-1)}),1e3):window.location.reload()})),a.a.createElement("div",null,a.a.createElement("h1",null,"Unrecoverable error occurred."),a.a.createElement("p",null,"Will auto reload in ",n," sec."))},m=n(1),p=n.n(m),v=n(3),b=function(){var e=window.crypto.getRandomValues(new Uint8Array(32));return Array.from(e).map((function(e){return e.toString(16).padStart(2,"0")})).join("")},g=function(e){try{var t=new URL(e).hash.slice(1);return new URLSearchParams(t).get("roomId")}catch(n){return null}},h=n(11),E=n.n(h),w=function(e){return new Promise((function(t){return setTimeout(t,e)}))},y=function(e,t){return"".concat(e,"_").concat(t)},O=function(e){return Number(e.split("_")[1])},j=function(e){return O(e.peer)},k=function(e){return O(e)<5},I=function e(t,n,r){r({type:"INITIALIZING_PEER",index:t});var a=t<5?t:1e3+window.crypto.getRandomValues(new Uint16Array(1))[0]%9e3,o=y(n,a);console.log("createMyPeer",t,o);var c=new E.a(o);return new Promise((function(a){c.on("open",(function(){a(c)})),c.on("error",(function(o){"unavailable-id"===o.type?(c.destroy(),e(t+1,n,r).then(a)):"peer-unavailable"===o.type||("network"===o.type?(console.log("createMyPeer network error",o),r({type:"NETWORK_ERROR"})):(console.error("createMyPeer",o.type,o),r({type:"UNKNOWN_ERROR"})))}))}))},S=function(e,t,n){var r=!1,a=null,o=null,c=function(){var e=new Map;return{addConn:function(t){e.set(t.peer,{conn:t,live:!1})},markLive:function(t){var n=e.get(t.peer);n&&(n.live=!0)},isLive:function(t){var n=e.get(t);return!!n&&n.live},hasConn:function(t){return e.has(t)},delConn:function(t){var n=e.get(t.peer);n&&n.conn===t&&e.delete(t.peer)},getLivePeerJsIds:function(){return Array.from(e.keys()).filter((function(t){var n;return null===(n=e.get(t))||void 0===n?void 0:n.live}))},forEachLiveConns:function(t){Array.from(e.values()).forEach((function(e){e.live&&t(e.conn)}))}}}(),u=function(){var e=c.getLivePeerJsIds().map(O);t({type:"CONNECTED_PEERS",peerIds:e})},i=function(e){if(a&&a.id!==e&&!c.hasConn(e)){console.log("connectPeer",e);var t=a.connect(e,{serialization:"json"});c.addConn(t),s(t)}},s=function(t){t.on("open",(function(){c.markLive(t),u(),o&&t.send({data:o,peers:c.getLivePeerJsIds()})})),t.on("data",(function(a){return function(t,a){if(!r)try{var o=j(t);a&&"object"===typeof a&&(n(o,a.data),Array.isArray(a.peers)&&a.peers.forEach((function(t){(function(e,t){return"string"===typeof t&&t.startsWith("".concat(e,"_"))})(e,t)&&i(t)})))}catch(c){console.error("handlePayload",c)}}(t,a)})),t.on("close",Object(v.a)(p.a.mark((function e(){return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:c.delConn(t),console.log("dataConnection closed",t),u(),k(t.peer)&&f(t.peer);case 4:case"end":return e.stop()}}),e)}))))},l=function(){var n=Object(v.a)(p.a.mark((function n(){var o,u;return p.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(!r){n.next=2;break}return n.abrupt("return");case 2:if(!a){n.next=4;break}return n.abrupt("return");case 4:return n.next=6,I(0,e,t);case 6:for((a=n.sent).on("connection",(function(e){console.log("new connection received",e);var n=j(e);t({type:"NEW_CONNECTION",peerId:n}),c.addConn(e),s(e),c.markLive(e)})),a.on("disconnected",(function(){if(a){var e=a;a=null,e.destroy(),setTimeout(l,6e4)}})),a.on("close",(function(){a=null,setTimeout(l,6e4)})),t({type:"CONNECTING_SEED_PEERS"}),o=0;o<5;o+=1)u=y(e,o),i(u);case 13:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();l();var f=function(){var t=Object(v.a)(p.a.mark((function t(n){var r,o;return p.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(a){t.next=2;break}return t.abrupt("return");case 2:if(!k(a.id)){t.next=4;break}return t.abrupt("return");case 4:return r=30+Math.floor(60*Math.random()),console.log("Disconnected seed peer: ".concat(O(n),", reinit in ").concat(r,"sec...")),t.next=8,w(1e3*r);case 8:if(a){t.next=10;break}return t.abrupt("return");case 10:if(!k(a.id)){t.next=12;break}return t.abrupt("return");case 12:if(!Array.from(Array(5).keys()).every((function(t){var n=y(e,t);return c.isLive(n)}))){t.next=16;break}return u(),t.abrupt("return");case 16:o=a,a=null,o.destroy(),l();case 20:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();return{broadcastData:function(e,t){if(!r){t&&(o=e);var n=c.getLivePeerJsIds();c.forEachLiveConns((function(t){try{t.send({data:e,peers:n})}catch(r){console.error("broadcastData",r)}}))}},dispose:function(){if(r=!0,a){var e=a;a=null,e.destroy()}}}},A=new Map,R=function(e,t,n){var r=A.get(e);if(!r){var a=new Set,o=new Set,c=S(e,(function(e){a.forEach((function(t){t(e)}))}),(function(e,t){o.forEach((function(n){n(e,t)}))}));r={room:c,networkStatusListeners:a,dataListeners:o,count:0},A.set(e,r)}t&&r.networkStatusListeners.add(t),n&&r.dataListeners.add(n),r.count+=1;return{broadcastData:r.room.broadcastData,unregister:function(){t&&r.networkStatusListeners.delete(t),n&&r.dataListeners.delete(n),r.count-=1,r.count<=0&&(r.room.dispose(),A.delete(e))}}},C=n(13),N=n(6),x=function(){var e=Object(v.a)(p.a.mark((function e(t,n){var r,a,o,c,u,i,s,l,f;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("undefined"===typeof ImageCapture){e.next=21;break}return r=new ImageCapture(n),e.next=4,w(2e3);case 4:return e.prev=4,e.next=7,r.takePhoto();case 7:return o=e.sent,e.next=10,createImageBitmap(o);case 10:a=e.sent,e.next=18;break;case 13:return e.prev=13,e.t0=e.catch(4),e.next=17,r.grabFrame();case 17:a=e.sent;case 18:return c=a.width,u=a.height,e.abrupt("return",{srcImg:a,srcW:c,srcH:u});case 21:return(i=document.getElementById("internal-video")).style.display="block",i.srcObject=t,e.next=26,w(2e3);case 26:return s=i,l=i.videoWidth,f=i.videoHeight,e.abrupt("return",{srcImg:s,srcW:l,srcH:f});case 30:case"end":return e.stop()}}),e,null,[[4,13]])})));return function(t,n){return e.apply(this,arguments)}}(),L=function(){var e=Object(v.a)(p.a.mark((function e(t){var n,r,a,o,c,u,i,s,l,f,d,m,v,b,g,h;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t?{video:{deviceId:t}}:{video:!0},e.next=3,navigator.mediaDevices.getUserMedia(n);case 3:return r=e.sent,a=r.getVideoTracks()[0],o=document.getElementById("internal-canvas"),c=o.getContext("2d"),u=72,i=72,o.width=u,o.height=i,e.next=13,x(r,a);case 13:return s=e.sent,l=s.srcImg,f=s.srcW,d=s.srcH,m=Math.max(u/f,i/d),v=Math.min(f,u/m),b=Math.min(d,i/m),g=(f-v)/2,h=(d-b)/2,c.drawImage(l,g,h,v,b,0,0,u,i),a.stop(),e.abrupt("return",o.toDataURL("image/png"));case 25:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),D=function(){var e=Object(v.a)(p.a.mark((function e(){var t,n;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,navigator.mediaDevices.enumerateDevices();case 3:return t=e.sent,n=t.filter((function(e){return"videoinput"===e.kind})).map((function(e){return{label:e.label,deviceId:e.deviceId}})),e.abrupt("return",n);case 8:return e.prev=8,e.t0=e.catch(0),e.abrupt("return",[]);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(){return e.apply(this,arguments)}}(),P=function(e){return e&&"object"===typeof e&&"string"===typeof e.userId&&"string"===typeof e.image&&function(e){return e&&"object"===typeof e&&"string"===typeof e.nickname&&"string"===typeof e.message}(e.info)},M=function(e,t,n,a){var o=Object(r.useState)(),c=Object(f.a)(o,2),u=c[0],i=c[1],s=Object(r.useState)([]),l=Object(f.a)(s,2),d=l[0],m=l[1],b=Object(r.useState)(),g=Object(f.a)(b,2),h=g[0],E=g[1];if(h)throw h;var w=function(e){var t=Object(r.useRef)(),n=Object(r.useCallback)((function(){t.current&&t.current.apply(t,arguments)}),[]);return Object(r.useEffect)((function(){var n=R(e),r=n.broadcastData,a=n.unregister;return t.current=r,a}),[e]),n}(e),y=function(e,t){var n=Object(r.useState)(),a=Object(f.a)(n,2),o=a[0],c=a[1];return Object(r.useEffect)((function(){return R(e,void 0,(function(e,n){t(n)&&c(n)})).unregister}),[e,t]),o}(e,P),O=Object(r.useMemo)((function(){return y&&Object(N.a)({},y,{received:Date.now(),obsoleted:!1})}),[y]);if(O){var j=d.find((function(e){return e.userId===O.userId}));j?j.received!==O.received&&m(d.map((function(e){return e.userId===O.userId?O:e}))):m([].concat(Object(C.a)(d),[O]))}return Object(r.useEffect)((function(){var e=function(){var e=Date.now()-12e4;m((function(t){var n=!1,r=t.map((function(t){return t.received<e&&!t.obsoleted?(n=!0,Object(N.a)({},t,{obsoleted:!0})):t}));return n?r:t}))},r=function(){var r=Object(v.a)(p.a.mark((function r(){var o,c;return p.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,e(),r.next=4,L(a);case 4:o=r.sent,i(o),c={userId:t,image:o,info:n()},w(c,!0),r.next=14;break;case 10:r.prev=10,r.t0=r.catch(0),console.error(r.t0),E(r.t0);case 14:case"end":return r.stop()}}),r,null,[[0,10]])})));return function(){return r.apply(this,arguments)}}();r();var o=setInterval(r,12e4);return function(){clearTimeout(o)}}),[e,t,n,a,w]),{myImage:u,roomImages:d}},U=(n(23),function(e){try{return window.localStorage.getItem(e)||""}catch(t){return""}}("nickname")),_=function(e){var t=e.roomId,n=e.userId,o=Object(r.useRef)(U),c=Object(r.useRef)("");Object(r.useEffect)((function(){!function(e){var t=window.location.hash.slice(1),n=new URLSearchParams(t);n.set("roomId",e),window.location.hash=n.toString()}(t)}),[t]);var u=Object(r.useState)(),i=Object(f.a)(u,2),s=i[0],l=i[1],d=Object(r.useState)(!0),m=Object(f.a)(d,2),b=m[0],g=m[1],h=function(){var e=Object(r.useState)([]),t=Object(f.a)(e,2),n=t[0],a=t[1];return Object(r.useEffect)((function(){Object(v.a)(p.a.mark((function e(){var t;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,D();case 2:t=e.sent,a(t);case 4:case"end":return e.stop()}}),e)})))()}),[]),n}(),E=Object(r.useCallback)((function(){return{nickname:o.current,message:c.current}}),[]),w=M(t,n,E,s),y=w.myImage,O=w.roomImages,j=function(e){var t=Object(r.useState)(),n=Object(f.a)(t,2),a=n[0],o=n[1];if(a&&("NETWORK_ERROR"===a.type||"UNKNOWN_ERROR"===a.type))throw new Error("network error");return Object(r.useEffect)((function(){return R(e,o).unregister}),[e]),a}(t),k="remote-faces://".concat(window.location.href.replace(/^https:\/\//,""));return a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{className:"SingleRoom-status"},JSON.stringify(j)),b?a.a.createElement("div",{className:"SingleRoom-room-info"},a.a.createElement("button",{type:"button",onClick:function(){return g(!1)}},"Hide config"),a.a.createElement("div",null,"Link to this room:",a.a.createElement("input",{value:window.location.href,readOnly:!0}),"(Share this link with your colleagues)",a.a.createElement("a",{href:k},"Open App")),a.a.createElement("div",null,"Your Name:"," ",a.a.createElement("input",{defaultValue:U,onChange:function(e){o.current=e.target.value,function(t,n){try{window.localStorage.setItem(t,n)}catch(e){console.log("Failed to save string to localStorage",e)}}("nickname",o.current)}})),a.a.createElement("div",null,"Select Camera:"," ",a.a.createElement("select",{onChange:function(e){return l(e.target.value)}},h.map((function(e){return a.a.createElement("option",{key:e.deviceId,value:e.deviceId},e.label)}))))):a.a.createElement("button",{type:"button",onClick:function(){return g(!0)}},"Show config"),a.a.createElement("div",null,a.a.createElement("div",{className:"SingleRoom-card"},a.a.createElement("img",{src:y||"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=",className:"SingleRoom-photo",alt:"myself"}),a.a.createElement("div",{className:"SingleRoom-name"},o.current),a.a.createElement("div",{className:"SingleRoom-mesg"},a.a.createElement("form",null,a.a.createElement("input",{onChange:function(e){c.current=e.target.value},placeholder:"Enter message."})))),O.map((function(e){return a.a.createElement("div",{key:e.userId,className:"SingleRoom-card",style:{opacity:e.obsoleted?.2:1}},a.a.createElement("img",{src:e.image,className:"SingleRoom-photo",alt:"friend"}),a.a.createElement("div",{className:"SingleRoom-name"},e.info.nickname),a.a.createElement("div",{className:"SingleRoom-mesg"},e.info.message))}))))},T=(n(24),function(){var e=window.location.hash.slice(1);return new URLSearchParams(e).get("roomId")}()),W=b(),V=function(){var e=Object(r.useState)(T),t=Object(f.a)(e,2),n=t[0],o=t[1],c=Object(r.useState)(""),u=Object(f.a)(c,2),i=u[0],s=u[1];return n?a.a.createElement(_,{roomId:n,userId:W}):a.a.createElement("div",{className:"SingleRoomEntrance-init"},a.a.createElement("button",{type:"button",onClick:function(){o(b())}},"Create a new room"),"OR",a.a.createElement("input",{value:i,onChange:function(e){return s(e.target.value)},placeholder:"Enter room link..."}),a.a.createElement("button",{type:"button",onClick:function(){o(g(i))},disabled:!g(i)},"Enter room"))},B=(n(25),function(e){Object(l.a)(n,e);var t=Object(s.a)(n);function n(){var e;Object(u.a)(this,n);for(var r=arguments.length,a=new Array(r),o=0;o<r;o++)a[o]=arguments[o];return(e=t.call.apply(t,[this].concat(a))).state={hasError:!1},e}return Object(i.a)(n,[{key:"render",value:function(){var e=this.props.children;return this.state.hasError?a.a.createElement(d,null):e}}],[{key:"getDerivedStateFromError",value:function(){return{hasError:!0}}}]),n}(a.a.Component)),J=function(){return a.a.createElement("div",{className:"App"},a.a.createElement(B,null,a.a.createElement(V,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(J,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[15,1,2]]]);
//# sourceMappingURL=main.3352f263.chunk.js.map