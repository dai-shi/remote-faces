(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[6],{100:function(e,n,r){"use strict";r.d(n,"a",(function(){return t}));var t=function(e){return new Promise((function(n){return setTimeout(n,e)}))}},104:function(e,n,r){"use strict";r.d(n,"c",(function(){return t})),r.d(n,"b",(function(){return a})),r.d(n,"a",(function(){return c}));var t=function(e){return"object"===typeof e&&null!==e},a=function(e,n){return"string"===typeof e[n]},c=function(e,n){return t(e[n])}},158:function(e,n,r){"use strict";r.d(n,"b",(function(){return s})),r.d(n,"a",(function(){return o}));var t=r(1),a=r.n(t),c=r(2),u=r(100),i=new WeakMap,s=function(e,n){if(i.has(e))return e;i.set(e,!0);var r=function(){var r=Object(c.a)(a.a.mark((function r(){var t;return a.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,Object(u.a)(5e3);case 2:!(t=n.getTransceivers().find((function(n){return n.receiver.track===e})))||"inactive"!==t.currentDirection&&"sendonly"!==t.currentDirection||(e.stop(),e.dispatchEvent(new Event("ended")));case 4:case"end":return r.stop()}}),r)})));return function(){return r.apply(this,arguments)}}();return e.addEventListener("mute",r),e},o=function(e){return new Promise(function(){var n=Object(c.a)(a.a.mark((function n(r,t){var c,u,i,s;return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,c=new RTCPeerConnection,u=new RTCPeerConnection,c.addEventListener("icecandidate",(function(e){var n=e.candidate;n&&u.addIceCandidate(n)})),u.addEventListener("icecandidate",(function(e){var n=e.candidate;n&&c.addIceCandidate(n)})),u.addEventListener("track",(function(e){r(e.track)})),e.addEventListener("ended",(function(){c.close(),u.close()})),c.addTrack(e),n.next=10,c.createOffer();case 10:return i=n.sent,n.next=13,c.setLocalDescription(i);case 13:return n.next=15,u.setRemoteDescription(i);case 15:return n.next=17,u.createAnswer();case 17:return s=n.sent,n.next=20,u.setLocalDescription(s);case 20:return n.next=22,c.setRemoteDescription(s);case 22:n.next=27;break;case 24:n.prev=24,n.t0=n.catch(0),t(n.t0);case 27:case"end":return n.stop()}}),n,null,[[0,24]])})));return function(e,r){return n.apply(this,arguments)}}())}},184:function(e,n){},288:function(e,n,r){"use strict";r.d(n,"a",(function(){return c}));var t=0,a={iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"turn:0.peerjs.com:3478",username:"peerjs",credential:"peerjsp"}],sdpSemantics:"unified-plan"},c=function(){var e=new Map;return{setMediaTypes:function(n,r){var t=e.get(n.peer);t&&(t.mediaTypes=r)},getMediaTypes:function(n){var r=e.get(n.peer);return r&&r.mediaTypes||[]},addConn:function(n,r){if(e.get(n))throw new Error("addConn: already exists");var c={peerIndex:t+=1,peer:n,userId:r,sendPc:new RTCPeerConnection(a),recvPc:new RTCPeerConnection(a)};return e.set(c.peer,{conn:c,mediaTypes:[]}),c},getConn:function(n){var r=e.get(n);return r?r.conn:null},findConn:function(n){var r=Array.from(e.values()).find((function(e){return e.conn.peerIndex===n}));return r?r.conn:null},delConn:function(n){var r=e.get(n.peer);if(!r||r.conn!==n)throw new Error("delConn: does not exist");e.delete(n.peer),n.sendPc.close(),n.recvPc.close()},getPeerIndexList:function(){return Array.from(e.values()).map((function(e){return e.conn.peerIndex}))},forEachConns:function(n){Array.from(e.values()).forEach((function(e){n(e.conn)}))},forEachConnsAcceptingMedia:function(n,r){Array.from(e.values()).forEach((function(e){e.mediaTypes&&e.mediaTypes.includes(n)&&r(e.conn)}))},size:function(){return e.size}}}},292:function(e,n){},308:function(e,n){},311:function(e,n){},351:function(e,n){},366:function(e,n){},370:function(e,n){},371:function(e,n){},402:function(e,n){},413:function(e,n){},426:function(e,n){},427:function(e,n){},440:function(e,n){},50:function(e,n,r){"use strict";r.r(n),r.d(n,"createRoom",(function(){return v}));var t=r(1),a=r.n(t),c=r(2),u=r(291),i=r.n(u),s=r(100),o=r(6),f=r(104),d=r(13),p=r(288),b=r(158),v=function(){var e=Object(c.a)(a.a.mark((function e(n,r,t,u,v,l){var x,w,h,y,k,m,O,I,g,j,E,P,C,T,D,L,S,M,N,A,R,z,_,J,W,G,Z,q,B,F,H,K,Q,U,V,X;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return x=!1,w=null,h=null,y=Object(p.a)(),k=[],m=null,O=n.slice(0,d.a),e.next=10,Object(o.f)(n.slice(d.a));case 10:return I=e.sent,g=function(){if(!x){var e=y.getPeerIndexList();t({type:"CONNECTED_PEERS",peerIndexList:e})}},j=function(){var e=Object(c.a)(a.a.mark((function e(n){var r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.t0=JSON,e.next=4,Object(o.a)(n,I);case 4:return e.t1=e.sent,r=e.t0.parse.call(e.t0,e.t1),console.log("decrypted payload",r),e.abrupt("return",r);case 10:return e.prev=10,e.t2=e.catch(0),console.info("Error in parsePayload",e.t2,n),e.abrupt("return",void 0);case 14:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(n){return e.apply(this,arguments)}}(),E=function(){var e=Object(c.a)(a.a.mark((function e(n,r){var t;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,console.log("payload to encrypt",n,r),e.next=4,Object(o.c)(JSON.stringify(r),I);case 4:if(t=e.sent,console.log("sending encrypted",t.byteLength),!(t.byteLength>262144)){e.next=9;break}return console.warn("encrypted message too large, aborting"),e.abrupt("return");case 9:if(w){e.next=12;break}return console.warn("no myIpfs initialized"),e.abrupt("return");case 12:return e.next=14,w.pubsub.publish(n,t);case 14:e.next=19;break;case 16:e.prev=16,e.t0=e.catch(0),console.error("sendPayload",e.t0);case 19:case"end":return e.stop()}}),e,null,[[0,16]])})));return function(n,r){return e.apply(this,arguments)}}(),P=function(){var e=Object(c.a)(a.a.mark((function e(n,r){var t,c;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t="".concat(O," ").concat(n.peer),!w){e.next=7;break}return c=function(){return null},e.next=5,w.pubsub.subscribe(t,c);case 5:return e.next=7,w.pubsub.unsubscribe(t,c);case 7:return e.next=9,E(t,r);case 9:case"end":return e.stop()}}),e)})));return function(n,r){return e.apply(this,arguments)}}(),C=function(){var e=Object(c.a)(a.a.mark((function e(n){var t;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!x){e.next=2;break}return e.abrupt("return");case 2:return t={userId:r,data:n,mediaTypes:k},e.next=5,E(O,t);case 5:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),T=function(){var e=Object(c.a)(a.a.mark((function e(n,t){var c,u;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!x){e.next=2;break}return e.abrupt("return");case 2:if(c=y.findConn(t)){e.next=5;break}return e.abrupt("return");case 5:return u={userId:r,data:n,mediaTypes:k},e.next=8,P(c,u);case 8:case"end":return e.stop()}}),e)})));return function(n,r){return e.apply(this,arguments)}}(),D=function(e){(k=e).length?m||(m=new MediaStream,y.forEachConns((function(e){var n={userId:e.userId,peerIndex:e.peerIndex,mediaTypes:y.getMediaTypes(e)};e.recvPc.getReceivers().forEach((function(r){"live"===r.track.readyState&&l(Object(b.b)(r.track,e.recvPc),n)}))}))):m=null,C(null)},L=function(){var e=Object(c.a)(a.a.mark((function e(n,r){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,P(n,{SDP:r});case 2:case"end":return e.stop()}}),e)})));return function(n,r){return e.apply(this,arguments)}}(),S=function(){var e=Object(c.a)(a.a.mark((function e(n,r){var t,c;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(Object(f.c)(r)){e.next=2;break}return e.abrupt("return");case 2:if(Object(f.b)(r,"negotiationId")){e.next=5;break}return console.warn("negotiationId not found in SDP"),e.abrupt("return");case 5:if(t=r.negotiationId,!Object(f.a)(r,"offer")){e.next=23;break}return e.prev=7,e.next=10,n.recvPc.setRemoteDescription(r.offer);case 10:return e.next=12,n.recvPc.createAnswer();case 12:return c=e.sent,e.next=15,n.recvPc.setLocalDescription(c);case 15:L(n,{negotiationId:t,answer:c}),e.next=21;break;case 18:e.prev=18,e.t0=e.catch(7),console.info("handleSDP offer failed",e.t0);case 21:e.next=36;break;case 23:if(!Object(f.a)(r,"answer")){e.next=35;break}return M.get(n)===t&&M.delete(n),e.prev=25,e.next=28,n.sendPc.setRemoteDescription(r.answer);case 28:e.next=33;break;case 30:e.prev=30,e.t1=e.catch(25),console.info("handleSDP answer failed",e.t1);case 33:e.next=36;break;case 35:console.warn("unknown SDP",r);case 36:case"end":return e.stop()}}),e,null,[[7,18],[25,30]])})));return function(n,r){return e.apply(this,arguments)}}(),M=new WeakMap,N=function(e){var n=M.has(e);if(M.set(e,Object(o.h)()),!n){var r=function(){var n=Object(c.a)(a.a.mark((function n(){var t,c;return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(t=M.get(e)){n.next=3;break}return n.abrupt("return");case 3:return n.next=5,e.sendPc.createOffer();case 5:return c=n.sent,n.next=8,e.sendPc.setLocalDescription(c);case 8:return n.next=10,L(e,{negotiationId:t,offer:c});case 10:return n.next=12,Object(s.a)(5e3);case 12:r();case 13:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();r()}},A=function(e,n){P(e,{ICE:n})},R=function(e,n){if(Object(f.c)(n))if(Object(f.b)(n,"direction"))if(Object(f.a)(n,"candidate"))try{"send"===n.direction?e.recvPc.addIceCandidate(n.candidate):"recv"===n.direction&&e.sendPc.addIceCandidate(n.candidate)}catch(r){console.info("handleCandidate failed",r)}else console.warn("candidate not found in ICE");else console.warn("direction not found in ICE")},z=function(){var e=Object(c.a)(a.a.mark((function e(n,r){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!Array.isArray(r)||!r.every((function(e){return"string"===typeof e}))){e.next=5;break}return y.setMediaTypes(n,r),e.next=4,Object(s.a)(5e3);case 4:V(n);case 5:case"end":return e.stop()}}),e)})));return function(n,r){return e.apply(this,arguments)}}(),_=function(e,n){var r={userId:e.userId,peerIndex:e.peerIndex,mediaTypes:y.getMediaTypes(e)};try{v(n,r)}catch(t){console.warn("receiveData",t)}},J=function(){var e=Object(c.a)(a.a.mark((function e(n,r){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!x){e.next=2;break}return e.abrupt("return");case 2:if(e.prev=2,Object(f.c)(r)){e.next=5;break}return e.abrupt("return");case 5:S(n,r.SDP),R(n,r.ICE),z(n,r.mediaTypes),_(n,r.data),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(2),console.info("Error in handlePayload",e.t0,r);case 14:case"end":return e.stop()}}),e,null,[[2,11]])})));return function(n,r){return e.apply(this,arguments)}}(),W=function(e,n){var r=y.addConn(e,n);return r.sendPc.addEventListener("icecandidate",(function(e){var n=e.candidate;n&&A(r,{direction:"send",candidate:n})})),r.recvPc.addEventListener("icecandidate",(function(e){var n=e.candidate;n&&A(r,{direction:"recv",candidate:n})})),r.recvPc.addEventListener("track",(function(e){var n={userId:r.userId,peerIndex:r.peerIndex,mediaTypes:y.getMediaTypes(r)};l(Object(b.b)(e.track,r.recvPc),n)})),u(r.peerIndex),t({type:"NEW_CONNECTION",peerIndex:r.peerIndex}),r},G=function(e){if(!Object(f.c)(e))return null;var n=e.userId;return"string"!==typeof n?null:n},Z=function(){var e=Object(c.a)(a.a.mark((function e(n){var r,t,c;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n.from!==h){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,j(n.data);case 4:if(r=e.sent,t=G(r),(c=y.getConn(n.from))||(t?c=W(n.from,t):console.warn("cannot initialize conn without user id")),!c){e.next=11;break}return e.next=11,J(c,r);case 11:g();case 12:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),q=function(){var e=Object(c.a)(a.a.mark((function e(){var n,r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!x){e.next=2;break}return e.abrupt("return");case 2:if(n=w?w.pubsub.peers(O):[],y.forEachConns((function(e){n.includes(e.peer)||(y.delConn(e),t({type:"CONNECTION_CLOSED",peerIndex:e.peerIndex}))})),!(w&&0===y.size()&&B+18e4<Date.now())){e.next=15;break}return r=w,w=null,h=null,e.next=10,H(r);case 10:return e.next=12,Object(s.a)(2e4);case 12:return e.next=14,F();case 14:return e.abrupt("return");case 15:if(n.length){e.next=21;break}return t({type:"CONNECTING_SEED_PEERS"}),e.next=19,Object(s.a)(1e3);case 19:return q(),e.abrupt("return");case 21:if(y.size()){e.next=24;break}return e.next=24,C(null);case 24:return e.next=26,Object(s.a)(5e3);case 26:q();case 27:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),B=0,(F=function(){var e=Object(c.a)(a.a.mark((function e(){var n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return B=Date.now(),t({type:"INITIALIZING_PEER",peerIndex:0}),e.next=4,i.a.create({repo:Object(o.h)(),config:{Addresses:{Swarm:["/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/"]}}});case 4:return n=e.sent,e.next=7,n.id();case 7:return h=e.sent.id,e.next=10,n.pubsub.subscribe(O,Z);case 10:return e.next=12,n.pubsub.subscribe("".concat(O," ").concat(h),Z);case 12:w=n,q();case 15:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}())(),H=function(){var e=Object(c.a)(a.a.mark((function e(n){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.pubsub.unsubscribe("".concat(O," ").concat(h),Z);case 2:return e.next=4,n.pubsub.unsubscribe(O,Z);case 4:return e.next=6,n.stop();case 6:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),K=new WeakMap,Q=function(e,n){m&&(K.set(n,e),m.addTrack(n),y.forEachConnsAcceptingMedia(e,(function(e){try{if(!m)return;e.sendPc.addTrack(n,m),N(e)}catch(r){if("InvalidAccessError"!==r.name)throw r}})))},U=function(e,n){m&&m.removeTrack(n),y.forEachConnsAcceptingMedia(e,(function(e){var r=e.sendPc.getSenders().find((function(e){return e.track===n}));r&&(e.sendPc.removeTrack(r),N(e))}))},V=function(e){var n=e.sendPc.getSenders(),r=y.getMediaTypes(e);m&&m.getTracks().forEach((function(t){var a=K.get(t);m&&a&&r.includes(a)&&n.every((function(e){return e.track!==t}))&&(e.sendPc.addTrack(t,m),N(e))})),n.forEach((function(n){if(n.track){var t=K.get(n.track);t&&r.includes(t)||(e.sendPc.removeTrack(n),N(e))}}))},X=function(){var e=Object(c.a)(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:x=!0,w&&H(w);case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),e.abrupt("return",{broadcastData:C,sendData:T,acceptMediaTypes:D,addTrack:Q,removeTrack:U,dispose:X});case 42:case"end":return e.stop()}}),e)})));return function(n,r,t,a,c,u){return e.apply(this,arguments)}}()}}]);
//# sourceMappingURL=6.75180a70.chunk.js.map