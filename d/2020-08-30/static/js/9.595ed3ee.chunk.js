(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[9],{104:function(e,n,t){"use strict";t.d(n,"a",(function(){return r}));var r=function(e){return new Promise((function(n){return setTimeout(n,e)}))}},162:function(e,n,t){"use strict";t.d(n,"b",(function(){return s})),t.d(n,"a",(function(){return u}));var r=t(1),c=t.n(r),o=t(2),a=t(104),i=new WeakMap,s=function(e,n){if(i.has(e))return e;i.set(e,!0);var t=function(){var t=Object(o.a)(c.a.mark((function t(){var r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Object(a.a)(5e3);case 2:!(r=n.getTransceivers().find((function(n){return n.receiver.track===e})))||"inactive"!==r.currentDirection&&"sendonly"!==r.currentDirection||(e.stop(),e.dispatchEvent(new Event("ended")));case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return e.addEventListener("mute",t),e},u=function(e){return new Promise(function(){var n=Object(o.a)(c.a.mark((function n(t,r){var o,a,i,s;return c.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,o=new RTCPeerConnection,a=new RTCPeerConnection,o.addEventListener("icecandidate",(function(e){var n=e.candidate;n&&a.addIceCandidate(n)})),a.addEventListener("icecandidate",(function(e){var n=e.candidate;n&&o.addIceCandidate(n)})),a.addEventListener("track",(function(e){t(e.track)})),e.addEventListener("ended",(function(){o.close(),a.close()})),o.addTrack(e),n.next=10,o.createOffer();case 10:return i=n.sent,n.next=13,o.setLocalDescription(i);case 13:return n.next=15,a.setRemoteDescription(i);case 15:return n.next=17,a.createAnswer();case 17:return s=n.sent,n.next=20,a.setLocalDescription(s);case 20:return n.next=22,o.setRemoteDescription(s);case 22:n.next=27;break;case 24:n.prev=24,n.t0=n.catch(0),r(n.t0);case 27:case"end":return n.stop()}}),n,null,[[0,24]])})));return function(e,t){return n.apply(this,arguments)}}())}},487:function(e,n){function t(e){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}t.keys=function(){return[]},t.resolve=t,e.exports=t,t.id=487},54:function(e,n,t){"use strict";t.r(n),t.d(n,"createRoom",(function(){return k}));var r=t(1),c=t.n(r),o=t(108),a=t(2),i=t(486),s=t.n(i),u=t(104),d=t(7),f=t(4),p=t(97),l=t(14),v=function(e,n){return"string"===typeof n&&n.startsWith("".concat(e.slice(0,l.a)," "))},g=function(e,n){return"".concat(e.slice(0,l.a)," ").concat(n)},y=function(e){return Number(e.split(" ")[1])},m=function(e){return y(e.peer)},C=function(){var e=new Map,n=function(n,t,r){var c,o=e.get(n.peer);o&&r.split(/[\r\n]+/).forEach((function(e){if(e.startsWith("a=mid:"))c=e.slice("a=mid:".length);else if(e.startsWith("a=msid:")){e.slice("a=msid:".length).split(" ").forEach((function(e){var n=t[e];"string"===typeof n&&(o.remoteMediaTypes[c]=n)}))}}))};return{setAcceptingMediaTypes:function(n,t){var r=e.get(n.peer);r&&(r.acceptingMediaTypes=t)},getAcceptingMediaTypes:function(n){var t=e.get(n.peer);return t?t.acceptingMediaTypes:[]},addConn:function(n){var t=e.get(n.peer);t&&t.conn.close(),e.set(n.peer,{conn:n,acceptingMediaTypes:[],remoteMediaTypes:{}})},markConnected:function(n){var t=e.get(n.peer);t&&(t.connected=!0)},isConnected:function(n){var t=e.get(n);return t&&t.connected||!1},setUserId:function(n,t){var r=e.get(n.peer);r&&(r.userId=t)},getUserId:function(n){var t=e.get(n.peer);return t&&t.userId},hasConn:function(n){return e.has(n)},getConn:function(n){var t=e.get(n);return t?t.conn:null},delConn:function(n){var t=e.get(n.peer);t&&t.conn===n&&e.delete(n.peer)},getConnectedPeerIds:function(){return Array.from(e.keys()).filter((function(n){var t;return null===(t=e.get(n))||void 0===t?void 0:t.connected}))},forEachConnectedConns:function(n){Array.from(e.values()).forEach((function(e){e.connected&&n(e.conn)}))},forEachConnsAcceptingMedia:function(n,t){Array.from(e.values()).forEach((function(e){e.connected&&e.acceptingMediaTypes.includes(n)&&t(e.conn)}))},clearAll:function(){e.size&&console.log("connectionMap garbage:",e),e.clear()},getRemoteMediaType:function(n,t){var r=e.get(n.peer);return r&&r.remoteMediaTypes[t]||null},registerRemoteMediaType:function(e,t){Object(p.a)(t,"msid2mediaType")&&(Object(p.a)(t,"offer")&&Object(p.b)(t.offer,"sdp")&&n(e,t.msid2mediaType,t.offer.sdp),Object(p.a)(t,"answer")&&Object(p.b)(t.answer,"sdp")&&n(e,t.msid2mediaType,t.answer.sdp))}}},h=t(162),b=function(e){var n=y(e);return 10<=n&&n<=14},k=function(){var e=Object(a.a)(c.a.mark((function e(n,t,r,i,k,w){var E,T,x,O,M,I,j,P,N,R,D,A,S,L,_,U,W,G,J,z,F,K,V,Z,q,B,H,Q;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return E=!1,T=null,x=C(),O=[],e.next=6,Object(d.h)(n.slice(l.a));case 6:return M=e.sent,I=function(){if(!E){var e=x.getConnectedPeerIds().map(y);r({type:"CONNECTED_PEERS",peerIndexList:e})}},j=function(e){if(!E&&T&&T.id!==e&&!T.disconnected&&!x.hasConn(e)){console.log("connectPeer",e);var n=T.connect(e);G(n)}},P=function(e){if(!E){var n=x.getConnectedPeerIds();x.forEachConnectedConns((function(r){W(r,{userId:t,data:e,peers:n,mediaTypes:O})}))}},N=function(e,r){if(!E){var c=x.getConn(g(n,r));if(c){var o=x.getConnectedPeerIds();W(c,{userId:t,data:e,peers:o,mediaTypes:O})}}},R=function(e,n){var t=V();W(e,{SDP:Object(o.a)(Object(o.a)({},n),{},{msid2mediaType:t})})},D=function(){var e=Object(a.a)(c.a.mark((function e(n,t){var r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(Object(p.c)(t)){e.next=2;break}return e.abrupt("return");case 2:if(x.registerRemoteMediaType(n,t),!Object(p.a)(t,"offer")){e.next=21;break}return e.prev=4,e.next=7,n.peerConnection.setRemoteDescription(t.offer);case 7:return B(n),e.next=10,n.peerConnection.createAnswer();case 10:return r=e.sent,e.next=13,n.peerConnection.setLocalDescription(r);case 13:R(n,{answer:r}),e.next=19;break;case 16:e.prev=16,e.t0=e.catch(4),console.info("handleSDP offer failed",e.t0);case 19:e.next=37;break;case 21:if(!Object(p.a)(t,"answer")){e.next=36;break}return e.prev=22,e.next=25,n.peerConnection.setRemoteDescription(t.answer);case 25:e.next=34;break;case 27:return e.prev=27,e.t1=e.catch(22),console.info("handleSDP answer failed",e.t1),e.next=32,Object(u.a)(30*Math.random()*1e3);case 32:H(n),B(n);case 34:e.next=37;break;case 36:console.warn("unknown SDP",t);case 37:case"end":return e.stop()}}),e,null,[[4,16],[22,27]])})));return function(n,t){return e.apply(this,arguments)}}(),A=function(e,n){"string"===typeof n&&x.setUserId(e,n)},S=function(){var e=Object(a.a)(c.a.mark((function e(n,t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!Array.isArray(t)||!t.every((function(e){return"string"===typeof e}))){e.next=5;break}return x.setAcceptingMediaTypes(n,t),e.next=4,Object(u.a)(5e3);case 4:B(n);case 5:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),L=function(e){Array.isArray(e)&&e.forEach((function(e){v(n,e)&&j(e)}))},_=function(e,n){var t=x.getUserId(e);if(t){var r={userId:t,peerIndex:m(e),mediaTypes:x.getAcceptingMediaTypes(e)};try{k(n,r)}catch(c){console.warn("receiveData",c)}}},U=function(){var e=Object(a.a)(c.a.mark((function e(n,t){var r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!E){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,e.t0=JSON,e.next=6,Object(d.b)(t,M);case 6:if(e.t1=e.sent,r=e.t0.parse.call(e.t0,e.t1),console.log("decrypted payload",n.peer,r),Object(p.c)(r)){e.next=11;break}return e.abrupt("return");case 11:D(n,r.SDP),A(n,r.userId),S(n,r.mediaTypes),L(r.peers),_(n,r.data),e.next=21;break;case 18:e.prev=18,e.t2=e.catch(2),console.info("Error in handlePayload",e.t2,t);case 21:case"end":return e.stop()}}),e,null,[[2,18]])})));return function(n,t){return e.apply(this,arguments)}}(),W=function(){var e=Object(a.a)(c.a.mark((function e(n,t){var r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Object(d.e)(JSON.stringify(t),M);case 3:r=e.sent,n.send(r),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.error("sendPayload",e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(n,t){return e.apply(this,arguments)}}(),G=function(e){if(x.isConnected(e.peer))e.close();else{x.addConn(e),e.on("open",(function(){x.markConnected(e),console.log("dataConnection open",e),I();var n=y(e.peer);i(n)})),e.on("data",(function(n){return U(e,n)})),e.peerConnection.addEventListener("icegatheringstatechange",(function(){var n=e.peerConnection;"complete"===n.iceGatheringState&&(n.onicecandidate=function(){})}));var n=!1;e.peerConnection.addEventListener("negotiationneeded",Object(a.a)(c.a.mark((function t(){var r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!n){t.next=2;break}return t.abrupt("return");case 2:return n=!0,t.next=5,Object(u.a)(5e3);case 5:if(n=!1,x.isConnected(e.peer)){t.next=8;break}return t.abrupt("return");case 8:return t.next=10,e.peerConnection.createOffer();case 10:return r=t.sent,t.next=13,e.peerConnection.setLocalDescription(r);case 13:R(e,{offer:r});case 14:case"end":return t.stop()}}),t)})))),e.peerConnection.addEventListener("track",(function(n){var t=n.transceiver.mid,r=t&&x.getRemoteMediaType(e,t);if(r){var c=x.getUserId(e);if(c){var o={userId:c,peerIndex:y(e.peer),mediaTypes:x.getAcceptingMediaTypes(e)};w(r,Object(h.b)(n.track,e.peerConnection),o)}}else console.warn("failed to find media type from mid")})),e.on("close",(function(){if(x.delConn(e),console.log("dataConnection closed",e),r({type:"CONNECTION_CLOSED",peerIndex:m(e)}),I(),0===x.getConnectedPeerIds().length)z(!0);else if(b(e.peer)&&T&&!T.disconnected&&!b(T.id)){var n=30+Math.floor(60*Math.random());console.log("Disconnected seed peer: ".concat(y(e.peer),", reinit in ").concat(n,"sec...")),setTimeout(z,1e3*n)}}))}},(J=function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10;if(!E&&!T){x.clearAll();var c=10<=t&&t<=14,o=c?t:Object(d.i)();r({type:"INITIALIZING_PEER",peerIndex:o});var a=g(n,o);console.log("initMyPeer start",t,a);var i=new s.a(a,Object(f.c)());T=i,i.on("open",(function(){T=i,r({type:"CONNECTING_SEED_PEERS"});for(var e=10;e<=14;e+=1){var t=g(n,e);j(t)}})),i.on("error",(function(n){"unavailable-id"===n.type?(T=null,i.destroy(),e(t+1)):"peer-unavailable"===n.type||("disconnected"===n.type?(console.log("initMyPeer disconnected error",t,n),i.destroy()):"network"===n.type?console.log("initMyPeer network error",t,n):"server-error"===n.type?(console.log("initMyPeer server error",t,n),r({type:"SERVER_ERROR"})):(console.error("initMyPeer unknown error",t,n.type,n),r({type:"UNKNOWN_ERROR",err:n})))})),i.on("connection",(function(e){T===i?(console.log("new connection received",e),r({type:"NEW_CONNECTION",peerIndex:m(e)}),G(e)):e.close()})),i.on("disconnected",(function(){console.log("initMyPeer disconnected",t),setTimeout((function(){T!==i||i.destroyed||(console.log("initMyPeer reconnecting",t),r({type:"RECONNECTING"}),i.reconnect())}),5e3)})),i.on("close",(function(){T===i?(console.log("initMyPeer closed, re-initializing",t),T=null,setTimeout(e,2e4)):console.log("initMyPeer closed, ignoring",t)}))}})(),z=function(e){if(T&&!T.disconnected){if(!e){if(b(T.id))return;for(var t=!0,r=10;r<=14;r+=1){var c=g(n,r);if(!x.isConnected(c)){t=!1;break}}if(t)return void I()}var o=T;T=null,o.destroy(),J()}},F=function(e){e.length!==O.length&&x.forEachConnectedConns((function(n){var t=x.getUserId(n);if(t){var r={userId:t,peerIndex:y(n.peer),mediaTypes:x.getAcceptingMediaTypes(n)},c=n.peerConnection.getTransceivers();n.peerConnection.getReceivers().forEach((function(t){var o=c.find((function(e){return e.receiver===t})),a=null===o||void 0===o?void 0:o.mid,i=a&&x.getRemoteMediaType(n,a);i?"live"===t.track.readyState&&!O.includes(i)&&e.includes(i)&&w(i,Object(h.b)(t.track,n.peerConnection),r):console.warn("failed to find media type from mid")}))}})),O=e,P(null)},K=new Map,V=function(){var e={};return K.forEach((function(n,t){var r=n.stream;e[r.id]=t})),e},Z=function(e,n){if(K.has(e))throw new Error("track is already added for ".concat(e));var t=new MediaStream([n]);K.set(e,{stream:t,track:n}),x.forEachConnsAcceptingMedia(e,(function(e){try{e.peerConnection.addTrack(n,t)}catch(r){if("InvalidAccessError"!==r.name)throw r}}))},q=function(e){var n=K.get(e);if(n){var t=n.track;K.delete(e),x.forEachConnsAcceptingMedia(e,(function(e){var n=e.peerConnection.getSenders().find((function(e){return e.track===t}));n&&e.peerConnection.removeTrack(n)}))}else console.log("track is already removed for",e)},B=function(e){var n=e.peerConnection.getSenders(),t=x.getAcceptingMediaTypes(e);t.forEach((function(t){var r=K.get(t);if(r){var c=r.stream,o=r.track;n.every((function(e){return e.track!==o}))&&e.peerConnection.addTrack(o,c)}})),n.forEach((function(n){n.track&&(t.some((function(e){var t;return(null===(t=K.get(e))||void 0===t?void 0:t.track)===n.track}))||e.peerConnection.removeTrack(n))})),n.some((function(e){return e.track&&!e.transport}))&&e.peerConnection.dispatchEvent(new Event("negotiationneeded"))},H=function(e){e.peerConnection.getSenders().forEach((function(n){n.track&&e.peerConnection.removeTrack(n)}))},Q=function(){E=!0,T&&T.destroy()},e.abrupt("return",{broadcastData:P,sendData:N,acceptMediaTypes:F,addTrack:Z,removeTrack:q,dispose:Q});case 32:case"end":return e.stop()}}),e)})));return function(n,t,r,c,o,a){return e.apply(this,arguments)}}()},97:function(e,n,t){"use strict";t.d(n,"c",(function(){return r})),t.d(n,"b",(function(){return c})),t.d(n,"a",(function(){return o}));var r=function(e){return"object"===typeof e&&null!==e},c=function(e,n){return"string"===typeof e[n]},o=function(e,n){return r(e[n])}}}]);
//# sourceMappingURL=9.595ed3ee.chunk.js.map