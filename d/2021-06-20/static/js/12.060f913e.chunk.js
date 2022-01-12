(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[12],{108:function(e,n,t){"use strict";t.d(n,"c",(function(){return r})),t.d(n,"b",(function(){return c})),t.d(n,"a",(function(){return o}));var r=function(e){return"object"===typeof e&&null!==e},c=function(e,n){return"string"===typeof e[n]},o=function(e,n){return r(e[n])}},144:function(e,n,t){"use strict";t.d(n,"a",(function(){return r}));var r=function(e){return new Promise((function(n){return setTimeout(n,e)}))}},189:function(e,n,t){"use strict";t.d(n,"c",(function(){return s})),t.d(n,"b",(function(){return u})),t.d(n,"d",(function(){return d})),t.d(n,"a",(function(){return p}));var r=t(4),c=t(2),o=t.n(c),a=t(3),i=new WeakMap,s=function(e,n){if(i.has(e))return e;i.set(e,!0);var t=function t(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1e3;if("ended"!==e.readyState){var c=n.getTransceivers().find((function(n){return n.receiver.track===e}));!c||"inactive"!==c.currentDirection&&"sendonly"!==c.currentDirection?r<64e3&&setTimeout((function(){t(2*r)}),r):(e.stop(),e.dispatchEvent(new Event("ended")))}};return e.addEventListener("mute",(function(){return t()})),e},u=function(e){return new Promise(function(){var n=Object(a.a)(o.a.mark((function n(t,r){var c,a,i,s;return o.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,c=new RTCPeerConnection,a=new RTCPeerConnection,c.addEventListener("icecandidate",(function(e){var n=e.candidate;n&&a.addIceCandidate(n)})),a.addEventListener("icecandidate",(function(e){var n=e.candidate;n&&c.addIceCandidate(n)})),a.addEventListener("track",(function(e){t(e.track)})),e.addEventListener("ended",(function(){c.close(),a.close()})),c.addTrack(e),n.next=10,c.createOffer();case 10:return i=n.sent,n.next=13,c.setLocalDescription(i);case 13:return n.next=15,a.setRemoteDescription(i);case 15:return n.next=17,a.createAnswer();case 17:return s=n.sent,n.next=20,a.setLocalDescription(s);case 20:return n.next=22,c.setRemoteDescription(s);case 22:n.next=27;break;case 24:n.prev=24,n.t0=n.catch(0),r(n.t0);case 27:case"end":return n.stop()}}),n,null,[[0,24]])})));return function(e,t){return n.apply(this,arguments)}}())},d=function(){var e=Object(a.a)(o.a.mark((function e(n){var t,r,c,i;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("video"===n.kind){e.next=2;break}throw new Error("track kind is not video");case 2:return t=document.createElement("canvas"),r=t.getContext("2d"),c=new ImageCapture(n),i=function(){var e=Object(a.a)(o.a.mark((function e(){var n;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,c.grabFrame();case 3:return n=e.sent,t.width=n.width,t.height=n.height,r.drawImage(n,0,0),e.abrupt("return",t.toDataURL("image/jpeg"));case 10:return e.prev=10,e.t0=e.catch(0),console.log("failed to grab frame from viedeo track",e.t0),e.abrupt("return",null);case 14:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(){return e.apply(this,arguments)}}(),e.abrupt("return",{getImage:i});case 7:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),f=function(e){return new Promise((function(n,t){var r=new Image;r.onload=function(){return n(r)},r.onerror=t,r.src=e}))},p=function(){var e=document.createElement("canvas"),n=e.getContext("2d"),t=e.captureStream().getVideoTracks();return{videoTrack:Object(r.a)(t,1)[0],setImage:function(){var t=Object(a.a)(o.a.mark((function t(r){var c;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,f(r);case 2:c=t.sent,e.width=c.width,e.height=c.height,n.drawImage(c,0,0);case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()}}},48:function(e,n,t){"use strict";t.r(n),t.d(n,"createRoom",(function(){return E}));var r=t(2),c=t.n(r),o=t(101),a=t(3),i=t(660),s=t.n(i),u=t(144),d=t(10),f=t(6),p=t(108),l=t(23),v=t(4),g=t(13),m=function(e,n){return"string"===typeof n&&n.startsWith("".concat(e.slice(0,l.a)," "))},y=function(e,n){return"".concat(e.slice(0,l.a)," ").concat(n)},h=function(e){return Number(e.split(" ")[1])},C=function(e){return h(e.peer)},b=function(){var e=new Map,n=function(e){return!!(e&&e.connected&&e.conn.open)},t=function(n,t,r){var c,o=e.get(n.peer);o&&r.split(/[\r\n]+/).forEach((function(e){if(e.startsWith("a=mid:"))c=e.slice("a=mid:".length);else if(e.startsWith("a=msid:")){e.slice("a=msid:".length).split(" ").forEach((function(e){var n=t[e];"string"===typeof n&&(o.remoteMediaTypes[c]=n)}))}}))};return{setAcceptingMediaTypes:function(n,t){var r=e.get(n.peer);r&&(r.acceptingMediaTypes=t)},getAcceptingMediaTypes:function(n){var t=e.get(n.peer);return t?t.acceptingMediaTypes:[]},addConn:function(n){var t=e.get(n.peer);e.set(n.peer,{conn:n,createdAt:Date.now(),acceptingMediaTypes:[],remoteMediaTypes:{}}),t&&t.conn.close()},markConnected:function(n){var t=e.get(n.peer);t&&t.conn===n&&(t.connected=!0)},isConnectedPeerId:function(t){return n(e.get(t))},isConnectedConn:function(t){var r=e.get(t.peer);return!(!r||r.conn!==t)&&n(r)},setUserId:function(n,t){var r=e.get(n.peer);r&&(r.userId=t)},getUserId:function(n){var t=e.get(n.peer);return t&&t.userId},hasFreshConn:function(n){var t=e.get(n);return!!t&&t.createdAt>Date.now()-6e5},getConn:function(n){var t=e.get(n);return t?t.conn:null},delConn:function(n){var t=e.get(n.peer);return!(!t||t.conn!==n)&&(e.delete(n.peer),!0)},getConnectedPeerIds:function(){return Array.from(e.keys()).filter((function(t){return n(e.get(t))}))},getNotConnectedPeerIds:function(){return Array.from(e.keys()).filter((function(t){return!n(e.get(t))}))},forEachConnectedConns:function(t){Array.from(e.values()).forEach((function(e){n(e)&&t(e.conn)}))},forEachConnsAcceptingMedia:function(t,r){Array.from(e.values()).forEach((function(e){n(e)&&e.acceptingMediaTypes.includes(t)&&r(e.conn)}))},clearAll:function(){e.size&&console.log("connectionMap garbage:",Object(g.a)(e.entries()).map((function(e){var n=Object(v.a)(e,2),t=n[0],r=n[1];return{id:t,createdAt:r.createdAt,connected:r.connected,open:r.conn.open,userId:r.userId}}))),e.clear()},getRemoteMediaType:function(n,t){var r=e.get(n.peer);return r&&r.remoteMediaTypes[t]||null},registerRemoteMediaType:function(e,n){Object(p.a)(n,"msid2mediaType")&&(Object(p.a)(n,"offer")&&Object(p.b)(n.offer,"sdp")&&t(e,n.msid2mediaType,n.offer.sdp),Object(p.a)(n,"answer")&&Object(p.b)(n.answer,"sdp")&&t(e,n.msid2mediaType,n.answer.sdp))}}},k=t(189),w=10,T=14,x=function(e){var n=h(e);return w<=n&&n<=T},E=function(){var e=Object(a.a)(c.a.mark((function e(n,t,r,i,v,g){var E,I,O,M,j,P,A,D,N,R,S,L,U,_,W,F,G,J,z,V,K,Z,q,B,H,Q,X,Y;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return E=!1,I=b(),O=[],e.next=6,Object(d.h)(n.slice(l.a));case 6:return M=e.sent,j=null,(P=function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:w;if(!E){I.clearAll();var c=w<=t&&t<=T,o=c?t:Object(d.i)();r({type:"INITIALIZING_PEER",peerIndex:o});var a=y(n,o),i=new s.a(a,Object(f.a)());i.on("open",(function(){j=i,r({type:"CONNECTING_SEED_PEERS"}),setTimeout((function(){for(var e=w;e<=T;e+=1){var t=y(n,e);D(t)}}),10)})),i.on("error",(function(n){"unavailable-id"===n.type?(i.destroy(),e(t+1)):"peer-unavailable"===n.type||("disconnected"===n.type?console.log("initMyPeer disconnected error",o,n):"network"===n.type?(console.log("initMyPeer network error",o,n),setTimeout((function(){i.destroyed||null!==j||(i.destroy(),e())}),1e4)):"server-error"===n.type?(console.log("initMyPeer server error",o,n),r({type:"SERVER_ERROR"})):(console.error("initMyPeer unknown error",o,n.type,n),r({type:"UNKNOWN_ERROR",err:n})))})),i.on("connection",(function(e){return i!==j?(console.log("new connection to old peer, closing"),void e.close()):i.id===e.peer?(console.log("new connection from self, closing"),void e.close()):(r({type:"NEW_CONNECTION",peerIndex:C(e)}),void z(e))})),i.on("disconnected",(function(){console.log("initMyPeer disconnected",o),setTimeout((function(){i.destroyed||i!==j||(r({type:"RECONNECTING",peerIndex:o}),i.reconnect(),setTimeout((function(){i.disconnected&&!i.destroyed&&i===j&&(console.log("reconnect failed, re-initializing"),i.destroy(),j=null,e())}),6e4))}),5e3)}))}})(),A=function(){var e;if(!E){var n=I.getConnectedPeerIds().map(h);r({type:"CONNECTED_PEERS",peerIndexList:n}),console.log("myPeer index:",(null===(e=j)||void 0===e?void 0:e.id)&&h(j.id),", connnecting:",I.getNotConnectedPeerIds().map(h))}},D=function(e){if(!E&&j&&j.id!==e&&!j.disconnected&&!I.isConnectedPeerId(e)&&!I.hasFreshConn(e)){console.log("connectPeer",e);var n=j.connect(e);z(n)}},N=function(e){if(!E){var n=I.getConnectedPeerIds();I.forEachConnectedConns((function(r){J(r,{userId:t,data:e,peers:n,mediaTypes:O})}))}},R=function(e,r){if(!E){var c=I.getConn(y(n,r));if(c){var o=I.getConnectedPeerIds();J(c,{userId:t,data:e,peers:o,mediaTypes:O})}}},S=function(e,n){var t=q();J(e,{SDP:Object(o.a)(Object(o.a)({},n),{},{msid2mediaType:t})})},L=function(){var e=Object(a.a)(c.a.mark((function e(n,t){var r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(Object(p.c)(t)){e.next=2;break}return e.abrupt("return");case 2:if(I.registerRemoteMediaType(n,t),!Object(p.a)(t,"offer")){e.next=21;break}return e.prev=4,e.next=7,n.peerConnection.setRemoteDescription(t.offer);case 7:return Q(n),e.next=10,n.peerConnection.createAnswer();case 10:return r=e.sent,e.next=13,n.peerConnection.setLocalDescription(r);case 13:S(n,{answer:r}),e.next=19;break;case 16:e.prev=16,e.t0=e.catch(4),console.info("handleSDP offer failed",e.t0);case 19:e.next=37;break;case 21:if(!Object(p.a)(t,"answer")){e.next=36;break}return e.prev=22,e.next=25,n.peerConnection.setRemoteDescription(t.answer);case 25:e.next=34;break;case 27:return e.prev=27,e.t1=e.catch(22),console.info("handleSDP answer failed",e.t1),e.next=32,Object(u.a)(30*Math.random()*1e3);case 32:X(n),Q(n);case 34:e.next=37;break;case 36:console.warn("unknown SDP",t);case 37:case"end":return e.stop()}}),e,null,[[4,16],[22,27]])})));return function(n,t){return e.apply(this,arguments)}}(),U=function(e,n){"string"===typeof n&&I.setUserId(e,n)},_=function(){var e=Object(a.a)(c.a.mark((function e(n,t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!Array.isArray(t)||!t.every((function(e){return"string"===typeof e}))){e.next=5;break}return I.setAcceptingMediaTypes(n,t),e.next=4,Object(u.a)(5e3);case 4:Q(n);case 5:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),W=function(e){Array.isArray(e)&&e.forEach((function(e){m(n,e)&&D(e)}))},F=function(e,n){var t=I.getUserId(e);if(t){var r={userId:t,peerIndex:C(e),mediaTypes:I.getAcceptingMediaTypes(e)};try{v(n,r)}catch(c){console.warn("receiveData",c)}}},G=function(){var e=Object(a.a)(c.a.mark((function e(n,t){var r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!E){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,e.t0=JSON,e.next=6,Object(d.b)(t,M);case 6:if(e.t1=e.sent,r=e.t0.parse.call(e.t0,e.t1),Object(p.c)(r)){e.next=10;break}return e.abrupt("return");case 10:L(n,r.SDP),U(n,r.userId),_(n,r.mediaTypes),W(r.peers),F(n,r.data),e.next=20;break;case 17:e.prev=17,e.t2=e.catch(2),console.info("Error in handlePayload",e.t2,t);case 20:case"end":return e.stop()}}),e,null,[[2,17]])})));return function(n,t){return e.apply(this,arguments)}}(),J=function(){var e=Object(a.a)(c.a.mark((function e(n,t){var r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Object(d.e)(JSON.stringify(t),M);case 3:r=e.sent,n.send(r),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.error("sendPayload",e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(n,t){return e.apply(this,arguments)}}(),z=function(e){var n;I.isConnectedPeerId(e.peer)&&console.info("dataConnection already in map, overriding",e.peer),I.addConn(e);var t=function(){clearTimeout(n),n=setTimeout((function(){e.close()}),3e5)};t(),e.on("open",(function(){t(),I.markConnected(e);var n=C(e);console.log("dataConnection open",n),A(),i(n)})),e.on("data",(function(n){t(),I.markConnected(e),G(e,n)})),e.peerConnection.addEventListener("icegatheringstatechange",(function(){var n=e.peerConnection;"complete"===n.iceGatheringState&&(n.onicecandidate=function(){})}));var o=!1;e.peerConnection.addEventListener("negotiationneeded",Object(a.a)(c.a.mark((function n(){var t;return c.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(!o){n.next=2;break}return n.abrupt("return");case 2:return o=!0,n.next=5,Object(u.a)(5e3);case 5:if(o=!1,I.isConnectedConn(e)){n.next=8;break}return n.abrupt("return");case 8:if(e.peerConnection){n.next=10;break}return n.abrupt("return");case 10:if("closed"!==e.peerConnection.signalingState){n.next=12;break}return n.abrupt("return");case 12:return n.next=14,e.peerConnection.createOffer();case 14:return t=n.sent,n.next=17,e.peerConnection.setLocalDescription(t);case 17:S(e,{offer:t});case 18:case"end":return n.stop()}}),n)})))),e.peerConnection.addEventListener("track",(function(n){if(I.isConnectedConn(e)){var t=n.transceiver.mid,r=t&&I.getRemoteMediaType(e,t);if(r){var c=I.getUserId(e);if(c){var o={userId:c,peerIndex:h(e.peer),mediaTypes:I.getAcceptingMediaTypes(e)};g(r,Object(k.c)(n.track,e.peerConnection),o)}}else console.warn("failed to find media type from mid")}else console.warn("received track from non-connected peer, ignoring")})),e.on("close",(function(){if(clearTimeout(n),I.delConn(e)){var t=C(e);if(r({type:"CONNECTION_CLOSED",peerIndex:t}),A(),0===I.getConnectedPeerIds().length)V(!0);else if(j&&x(e.peer)&&!j.disconnected&&!x(j.id)){var c=600+Math.floor(10*Math.random()*60);console.log("Disconnected seed peer: ".concat(t,", reinit in ").concat(c,"sec...")),setTimeout(V,1e3*c)}}}))},V=function(e){if(j&&!j.disconnected){if(!e){if(x(j.id))return;for(var t=!0,r=w;r<=T;r+=1){var c=y(n,r);if(!I.isConnectedPeerId(c)){t=!1;break}}if(t)return void A()}j.destroy(),j=null,P()}},K=function(e){E||(e.length!==O.length&&I.forEachConnectedConns((function(n){var t=I.getUserId(n);if(t){var r={userId:t,peerIndex:h(n.peer),mediaTypes:I.getAcceptingMediaTypes(n)},c=n.peerConnection.getTransceivers();n.peerConnection.getReceivers().forEach((function(t){var o=c.find((function(e){return e.receiver===t})),a=null===o||void 0===o?void 0:o.mid,i=a&&I.getRemoteMediaType(n,a);i?"live"===t.track.readyState&&!O.includes(i)&&e.includes(i)&&g(i,Object(k.c)(t.track,n.peerConnection),r):console.warn("failed to find media type from mid")}))}})),O=e,N(null))},Z=new Map,q=function(){var e={};return Z.forEach((function(n,t){var r=n.stream;e[r.id]=t})),e},B=function(e,n){if(!E){if(Z.has(e))throw new Error("track is already added for ".concat(e));var t=new MediaStream([n]);Z.set(e,{stream:t,track:n}),I.forEachConnsAcceptingMedia(e,(function(e){try{e.peerConnection.addTrack(n,t)}catch(r){if("InvalidAccessError"!==r.name)throw r}}))}},H=function(e){if(!E){var n=Z.get(e);if(n){var t=n.track;Z.delete(e),I.forEachConnsAcceptingMedia(e,(function(e){var n,r,c=(null!==(n=null===(r=e.peerConnection)||void 0===r?void 0:r.getSenders())&&void 0!==n?n:[]).find((function(e){return e.track===t}));c&&"closed"!==e.peerConnection.signalingState&&e.peerConnection.removeTrack(c)}))}else console.log("track is already removed for",e)}},Q=function(e){var n,t,r=null!==(n=null===(t=e.peerConnection)||void 0===t?void 0:t.getSenders())&&void 0!==n?n:[],c=I.getAcceptingMediaTypes(e);c.forEach((function(n){var t=Z.get(n);if(t){var c=t.stream,o=t.track;r.every((function(e){return e.track!==o}))&&e.peerConnection.addTrack(o,c)}})),r.forEach((function(n){n.track&&(c.some((function(e){var t;return(null===(t=Z.get(e))||void 0===t?void 0:t.track)===n.track}))||"closed"===e.peerConnection.signalingState||e.peerConnection.removeTrack(n))})),r.some((function(e){return e.track&&!e.transport}))&&e.peerConnection.dispatchEvent(new Event("negotiationneeded"))},X=function(e){var n,t;(null!==(n=null===(t=e.peerConnection)||void 0===t?void 0:t.getSenders())&&void 0!==n?n:[]).forEach((function(n){n.track&&"closed"!==e.peerConnection.signalingState&&e.peerConnection.removeTrack(n)}))},Y=function(){E=!0,j&&(j.destroy(),j=null)},e.abrupt("return",{broadcastData:N,sendData:R,acceptMediaTypes:K,addTrack:B,removeTrack:H,dispose:Y});case 34:case"end":return e.stop()}}),e)})));return function(n,t,r,c,o,a){return e.apply(this,arguments)}}()},661:function(e,n){function t(e){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}t.keys=function(){return[]},t.resolve=t,e.exports=t,t.id=661}}]);
//# sourceMappingURL=12.060f913e.chunk.js.map