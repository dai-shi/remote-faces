(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[6],{100:function(e,n,t){"use strict";t.d(n,"a",(function(){return r}));var r=function(e){return new Promise((function(n){return setTimeout(n,e)}))}},1224:function(e,n,t){"use strict";t.d(n,"a",(function(){return a}));var r=0,a=function(){var e=new Map;return{setAcceptingMediaTypes:function(n,t){var r=e.get(n.peer);r&&(r.acceptingMediaTypes=t)},getAcceptingMediaTypes:function(n){var t=e.get(n.peer);return t?t.acceptingMediaTypes:[]},addConn:function(n,t){if(e.get(n))throw new Error("addConn: already exists");var a={peerIndex:r+=1,peer:n,userId:t,audioWorkers:new Map,vidoeSetImages:new Map};return e.set(a.peer,{conn:a,acceptingMediaTypes:[]}),a},getConn:function(n){var t=e.get(n);return t?t.conn:null},findConn:function(n){var t=Array.from(e.values()).find((function(e){return e.conn.peerIndex===n}));return t?t.conn:null},delConn:function(n){var t=e.get(n.peer);if(!t||t.conn!==n)throw new Error("delConn: does not exist");e.delete(n.peer)},getPeerIndexList:function(){return Array.from(e.values()).map((function(e){return e.conn.peerIndex}))},forEachConns:function(n){Array.from(e.values()).forEach((function(e){n(e.conn)}))},size:function(){return e.size}}}},127:function(e,n,t){"use strict";t.d(n,"c",(function(){return i})),t.d(n,"b",(function(){return f})),t.d(n,"d",(function(){return p})),t.d(n,"a",(function(){return b}));var r=t(5),a=t(1),c=t.n(a),u=t(3),s=t(100),o=new WeakMap,i=function(e,n){if(o.has(e))return e;o.set(e,!0);var t=function(){var t=Object(u.a)(c.a.mark((function t(){var r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Object(s.a)(5e3);case 2:!(r=n.getTransceivers().find((function(n){return n.receiver.track===e})))||"inactive"!==r.currentDirection&&"sendonly"!==r.currentDirection||(e.stop(),e.dispatchEvent(new Event("ended")));case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return e.addEventListener("mute",t),e},f=function(e){return new Promise(function(){var n=Object(u.a)(c.a.mark((function n(t,r){var a,u,s,o;return c.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,a=new RTCPeerConnection,u=new RTCPeerConnection,a.addEventListener("icecandidate",(function(e){var n=e.candidate;n&&u.addIceCandidate(n)})),u.addEventListener("icecandidate",(function(e){var n=e.candidate;n&&a.addIceCandidate(n)})),u.addEventListener("track",(function(e){t(e.track)})),e.addEventListener("ended",(function(){a.close(),u.close()})),a.addTrack(e),n.next=10,a.createOffer();case 10:return s=n.sent,n.next=13,a.setLocalDescription(s);case 13:return n.next=15,u.setRemoteDescription(s);case 15:return n.next=17,u.createAnswer();case 17:return o=n.sent,n.next=20,u.setLocalDescription(o);case 20:return n.next=22,a.setRemoteDescription(o);case 22:n.next=27;break;case 24:n.prev=24,n.t0=n.catch(0),r(n.t0);case 27:case"end":return n.stop()}}),n,null,[[0,24]])})));return function(e,t){return n.apply(this,arguments)}}())},p=function(){var e=Object(u.a)(c.a.mark((function e(n){var t,r,a,s;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("video"===n.kind){e.next=2;break}throw new Error("track kind is not video");case 2:return t=document.createElement("canvas"),r=t.getContext("2d"),a=new ImageCapture(n),s=function(){var e=Object(u.a)(c.a.mark((function e(){var n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,a.grabFrame();case 3:return n=e.sent,t.width=n.width,t.height=n.height,r.drawImage(n,0,0),e.abrupt("return",t.toDataURL("image/jpeg"));case 10:return e.prev=10,e.t0=e.catch(0),console.log("failed to grab frame from viedeo track",e.t0),e.abrupt("return",null);case 14:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(){return e.apply(this,arguments)}}(),e.abrupt("return",{getImage:s});case 7:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),d=function(e){return new Promise((function(n,t){var r=new Image;r.onload=function(){return n(r)},r.onerror=t,r.src=e}))},b=function(){var e=document.createElement("canvas"),n=e.getContext("2d"),t=e.captureStream().getVideoTracks();return{videoTrack:Object(r.a)(t,1)[0],setImage:function(){var t=Object(u.a)(c.a.mark((function t(r){var a;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,d(r);case 2:a=t.sent,e.width=a.width,e.height=a.height,n.drawImage(a,0,0);case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()}}},195:function(e,n){},325:function(e,n){},328:function(e,n){},344:function(e,n){},347:function(e,n){},375:function(e,n){},376:function(e,n){},395:function(e,n){},411:function(e,n){},415:function(e,n){},416:function(e,n){},42:function(e,n,t){"use strict";t.r(n),function(e){t.d(n,"createRoom",(function(){return h}));var r=t(1),a=t.n(r),c=t(3),u=t(232),s=t(323),o=t.n(s),i=t(100),f=t(7),p=t(95),d=t(12),b=t(1224),v=t(127),x=new Map,l=function(){var e=Object(c.a)(a.a.mark((function e(n,t){var r,c;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r="".concat(n," ").concat(t),c=x.get(r)){e.next=7;break}return e.next=5,Object(f.k)(r);case 5:c=e.sent.slice(0,d.a),x.set(r,c);case 7:return e.abrupt("return",c);case 8:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),h=function(){var n=Object(c.a)(a.a.mark((function n(t,r,s,x,h,w){var k,m,y,g,O,j,I,E,T,C,A,M,S,N,W,D,L,P,R,_,V,z,J,B,F,G,U,Z,q,H,K;return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return k=!1,m=Object(b.a)(),y=[],g=t.slice(0,d.a),n.next=7,Object(f.h)(t.slice(d.a));case 7:return O=n.sent,s({type:"INITIALIZING_PEER",peerIndex:0}),n.next=11,o.a.create({repo:Object(f.j)(),config:{Addresses:{Swarm:["/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/"]}}});case 11:return j=n.sent,n.next=14,j.id();case 14:return I=n.sent.id,n.next=17,j.pubsub.subscribe(g,(function(e){return z(e)}));case 17:return n.next=19,j.pubsub.subscribe("".concat(g," ").concat(I),(function(e){return z(e)}));case 19:return E=function(){var e=Object(c.a)(a.a.mark((function e(n){var t,r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Object(f.c)(n,O);case 3:if(null!==(t=e.sent)){e.next=6;break}return e.abrupt("return",void 0);case 6:return r=JSON.parse(t),console.log("decrypted payload",r),e.abrupt("return",r);case 11:return e.prev=11,e.t0=e.catch(0),console.info("Error in parsePayload",e.t0,n),e.abrupt("return",void 0);case 15:case"end":return e.stop()}}),e,null,[[0,11]])})));return function(n){return e.apply(this,arguments)}}(),T=function(){var n=Object(c.a)(a.a.mark((function n(t,r){var c,s,o,i,p,d,b;return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:n.prev=0,console.log("payload to encrypt",t,r),c=!0,s=!1,n.prev=4,i=Object(u.a)(Object(f.f)(JSON.stringify(r),O));case 6:return n.next=8,i.next();case 8:return p=n.sent,c=p.done,n.next=12,p.value;case 12:if(d=n.sent,c){n.next=20;break}return b=d,n.next=17,j.pubsub.publish(t,e.from(b));case 17:c=!0,n.next=6;break;case 20:n.next=26;break;case 22:n.prev=22,n.t0=n.catch(4),s=!0,o=n.t0;case 26:if(n.prev=26,n.prev=27,c||null==i.return){n.next=31;break}return n.next=31,i.return();case 31:if(n.prev=31,!s){n.next=34;break}throw o;case 34:return n.finish(31);case 35:return n.finish(26);case 36:n.next=41;break;case 38:n.prev=38,n.t1=n.catch(0),console.error("sendPayload",n.t1);case 41:case"end":return n.stop()}}),n,null,[[0,38],[4,22,26,36],[27,,31,35]])})));return function(e,t){return n.apply(this,arguments)}}(),C=function(){var e=Object(c.a)(a.a.mark((function e(n,t){var r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="".concat(g," ").concat(n.peer),e.next=3,T(r,t);case 3:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),A=function(){var e=Object(c.a)(a.a.mark((function e(n){var t;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!k){e.next=2;break}return e.abrupt("return");case 2:return t={userId:r,data:n,mediaTypes:y},e.next=5,T(g,t);case 5:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),M=function(){var e=Object(c.a)(a.a.mark((function e(n,t){var c,u;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!k){e.next=2;break}return e.abrupt("return");case 2:if(c=m.findConn(t)){e.next=5;break}return e.abrupt("return");case 5:return u={userId:r,data:n,mediaTypes:y},e.next=8,C(c,u);case 8:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),S=new Map,N=function(){var e=Object(c.a)(a.a.mark((function e(n){var r,u,s;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=[],S.set(n,r),e.next=4,l(t,n);case 4:u=e.sent,s=function(){var e=Object(c.a)(a.a.mark((function e(t){var c,u,s,o,i,p,d,b,x,l;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.from!==I){e.next=2;break}return e.abrupt("return");case 2:if(c=m.getConn(t.from)){e.next=6;break}return console.warn("conn not ready"),e.abrupt("return");case 6:if(u={userId:c.userId,peerIndex:c.peerIndex,mediaTypes:m.getAcceptingMediaTypes(c)},c.audioWorkers.has(n)){e.next=24;break}return s=new AudioContext,o=s.createMediaStreamDestination(),i=0,p=0,(d=new Worker("audio-decoder.js",{type:"module"})).onmessage=function(e){var n=new Float32Array(e.data);p||(i=s.currentTime),i+=.06,p+=1;var t=s.createBuffer(1,2880,48e3);t.copyToChannel(n,0);var r=s.createBufferSource();r.buffer=t,r.connect(o),r.onended=function(){p-=1},r.start(i)},c.audioWorkers.set(n,d),b=o.stream.getAudioTracks()[0],e.t0=w,e.t1=n,e.next=20,Object(v.b)(b);case 20:e.t2=e.sent,e.t3=u,(0,e.t0)(e.t1,e.t2,e.t3),r.push((function(){s.close(),b.dispatchEvent(new Event("ended")),d.terminate(),c.audioWorkers.delete(n)}));case 24:return e.next=26,Object(f.a)(t.data.buffer,t.data.byteOffset,t.data.byteLength,O);case 26:x=e.sent,(l=c.audioWorkers.get(n))&&x.forEach((function(e){l.postMessage([e],[e])}));case 29:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),j.pubsub.subscribe(u,s),r.unshift((function(){j.pubsub.unsubscribe(u,s)}));case 8:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),W=function(){var e=Object(c.a)(a.a.mark((function e(n){var r,u,s;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=[],S.set(n,r),e.next=4,l(t,n);case 4:u=e.sent,s=function(){var e=Object(c.a)(a.a.mark((function e(t){var c,u,s,o,i,p,d;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.from!==I){e.next=2;break}return e.abrupt("return");case 2:if(c=m.getConn(t.from)){e.next=6;break}return console.warn("conn not ready"),e.abrupt("return");case 6:return u={userId:c.userId,peerIndex:c.peerIndex,mediaTypes:m.getAcceptingMediaTypes(c)},c.vidoeSetImages.has(n)||(s=Object(v.a)(),o=s.videoTrack,i=s.setImage,c.vidoeSetImages.set(n,i),w(n,o,u),r.push((function(){o.dispatchEvent(new Event("ended")),c.vidoeSetImages.delete(n)}))),p=c.vidoeSetImages.get(n),e.prev=9,e.next=12,Object(f.c)(t.data,O);case 12:d=e.sent,p&&d&&p(d),e.next=19;break;case 16:e.prev=16,e.t0=e.catch(9),console.info("Error in parse for video media",e.t0);case 19:case"end":return e.stop()}}),e,null,[[9,16]])})));return function(n){return e.apply(this,arguments)}}(),j.pubsub.subscribe(u,s),r.unshift((function(){j.pubsub.unsubscribe(u,s)}));case 8:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),D=function(e){k||(S.forEach((function(n,t){e.includes(t)||(n.forEach((function(e){return e()})),S.delete(t))})),e.forEach((function(e){if(!S.has(e))if(e.endsWith("Audio"))N(e);else{if(!e.endsWith("Video"))throw new Error("pubsubRoom: cannot guess mediaType (Audio/Video)");W(e)}})),y=e,A(null))},L=function(){var e=Object(c.a)(a.a.mark((function e(n,t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:Array.isArray(t)&&t.every((function(e){return"string"===typeof e}))&&m.setAcceptingMediaTypes(n,t);case 1:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),P=function(e,n){var t={userId:e.userId,peerIndex:e.peerIndex,mediaTypes:m.getAcceptingMediaTypes(e)};try{h(n,t)}catch(r){console.warn("receiveData",r)}},R=function(){var e=Object(c.a)(a.a.mark((function e(n,t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,Object(p.c)(t)){e.next=3;break}return e.abrupt("return");case 3:L(n,t.mediaTypes),P(n,t.data),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.info("Error in handlePayload",e.t0,t);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(n,t){return e.apply(this,arguments)}}(),_=function(e,n){var t=m.addConn(e,n);return x(t.peerIndex),s({type:"NEW_CONNECTION",peerIndex:t.peerIndex}),t},V=function(e){if(!Object(p.c)(e))return null;var n=e.userId;return"string"!==typeof n?null:n},z=function(){var e=Object(c.a)(a.a.mark((function e(n){var t,r,c,u;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!k){e.next=2;break}return e.abrupt("return");case 2:if(n.from!==I){e.next=4;break}return e.abrupt("return");case 4:return e.next=6,E(n.data);case 6:if(void 0!==(t=e.sent)){e.next=9;break}return e.abrupt("return");case 9:if(r=V(t),(c=m.getConn(n.from))||(r?c=_(n.from,r):console.warn("cannot initialize conn without user id")),!c){e.next=15;break}return e.next=15,R(c,t);case 15:u=m.getPeerIndexList(),s({type:"CONNECTED_PEERS",peerIndexList:u});case 17:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),(J=function(){var e=Object(c.a)(a.a.mark((function e(){var n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!k){e.next=2;break}return e.abrupt("return");case 2:if(n=j.pubsub.peers(g),m.forEachConns((function(e){n.includes(e.peer)||(m.delConn(e),s({type:"CONNECTION_CLOSED",peerIndex:e.peerIndex}))})),n.length){e.next=10;break}return s({type:"CONNECTING_SEED_PEERS"}),e.next=8,Object(i.a)(1e3);case 8:return J(),e.abrupt("return");case 10:if(m.size()){e.next=13;break}return e.next=13,A(null);case 13:return e.next=15,Object(i.a)(5e3);case 15:J();case 16:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}())(),B=new WeakMap,F=function(e){e&&e()},G=function(){var n=Object(c.a)(a.a.mark((function n(r,u){var s,o,i,p,d,b;return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return F(B.get(u)),s=new MediaStream([u]),o=new AudioContext,i=o.createMediaStreamSource(s),n.next=6,o.audioWorklet.addModule("audio-encoder.js");case 6:return p=new AudioWorkletNode(o,"audio-encoder"),n.next=9,l(t,r);case 9:d=n.sent,b=[],p.port.onmessage=function(){var n=Object(c.a)(a.a.mark((function n(t){var r;return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(b.push(t.data),!(b.length<17)){n.next=3;break}return n.abrupt("return");case 3:return n.next=5,Object(f.d)(b.splice(0,b.length),O);case 5:r=n.sent,j.pubsub.publish(d,e.from(r));case 7:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}(),i.connect(p),B.set(u,(function(){o.close()}));case 14:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}(),U=function(){var n=Object(c.a)(a.a.mark((function n(r,s){var o,p,d,b,x;return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return F(B.get(s)),n.next=3,l(t,r);case 3:return o=n.sent,n.next=6,Object(v.d)(s);case 6:p=n.sent,d=p.getImage,b=!1,(x=function(){var n=Object(c.a)(a.a.mark((function n(){var t,r,c,s,p,v,l,h;return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(!b){n.next=2;break}return n.abrupt("return");case 2:return n.next=4,d();case 4:if(!(t=n.sent)){n.next=46;break}r=!0,c=!1,n.prev=8,p=Object(u.a)(Object(f.f)(t,O));case 10:return n.next=12,p.next();case 12:return v=n.sent,r=v.done,n.next=16,v.value;case 16:if(l=n.sent,r){n.next=28;break}if(h=l,!b){n.next=21;break}return n.abrupt("return");case 21:return n.next=23,j.pubsub.publish(o,e.from(h));case 23:return n.next=25,Object(i.a)(1e3);case 25:r=!0,n.next=10;break;case 28:n.next=34;break;case 30:n.prev=30,n.t0=n.catch(8),c=!0,s=n.t0;case 34:if(n.prev=34,n.prev=35,r||null==p.return){n.next=39;break}return n.next=39,p.return();case 39:if(n.prev=39,!c){n.next=42;break}throw s;case 42:return n.finish(39);case 43:return n.finish(34);case 44:n.next=48;break;case 46:return n.next=48,Object(i.a)(5e3);case 48:x();case 49:case"end":return n.stop()}}),n,null,[[8,30,34,44],[35,,39,43]])})));return function(){return n.apply(this,arguments)}}())(),B.set(s,(function(){b=!0}));case 12:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}(),Z=new Map,q=function(){var e=Object(c.a)(a.a.mark((function e(n,t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!k){e.next=2;break}return e.abrupt("return");case 2:if(!Z.has(n)){e.next=4;break}throw new Error("track is already added for ".concat(n));case 4:if(Z.set(n,t),!n.endsWith("Audio")){e.next=9;break}G(n,t),e.next=14;break;case 9:if(!n.endsWith("Video")){e.next=13;break}U(n,t),e.next=14;break;case 13:throw new Error("pubsubRoom: cannot guess mediaType (Audio/Video)");case 14:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),H=function(e){if(!k){var n=Z.get(e);n?(Z.delete(e),F(B.get(n))):console.log("track is already removed for",e)}},K=function(){var e=Object(c.a)(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return k=!0,e.next=3,j.pubsub.unsubscribe("".concat(g," ").concat(I),z);case 3:return e.next=5,j.pubsub.unsubscribe(g,z);case 5:return e.next=7,j.stop();case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),n.abrupt("return",{broadcastData:A,sendData:M,acceptMediaTypes:D,addTrack:q,removeTrack:H,dispose:K});case 47:case"end":return n.stop()}}),n)})));return function(e,t,r,a,c,u){return n.apply(this,arguments)}}()}.call(this,t(57).Buffer)},443:function(e,n){},446:function(e,n){},459:function(e,n){},472:function(e,n){},473:function(e,n){},486:function(e,n){},95:function(e,n,t){"use strict";t.d(n,"c",(function(){return r})),t.d(n,"b",(function(){return a})),t.d(n,"a",(function(){return c}));var r=function(e){return"object"===typeof e&&null!==e},a=function(e,n){return"string"===typeof e[n]},c=function(e,n){return r(e[n])}}}]);
//# sourceMappingURL=6.6763e497.chunk.js.map