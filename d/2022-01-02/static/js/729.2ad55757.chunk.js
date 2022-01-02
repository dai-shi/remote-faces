(self.webpackChunkremote_faces_web=self.webpackChunkremote_faces_web||[]).push([[729],{33413:(e,n,t)=>{"use strict";t.r(n),t.d(n,{createRoom:()=>C});var o=t(28326),r=t.n(o),c=t(93057),i=t(65954),a=t(1239),s=t(50634),d=t(76996);const l=(e,n)=>`${e.slice(0,d.W)} ${n}`,p=e=>Number(e.split(" ")[1]),g=e=>p(e.peer);var f=t(52780);const u=10,y=14,m=e=>{const n=p(e);return u<=n&&n<=y},C=async(e,n,t,o,C,v)=>{let w=!1;const h=(()=>{const e=new Map,n=e=>!!(e&&e.connected&&e.conn.open),t=(n,t,o)=>{const r=e.get(n.peer);if(!r)return;let c;o.split(/[\r\n]+/).forEach((e=>{e.startsWith("a=mid:")?c=e.slice("a=mid:".length):e.startsWith("a=msid:")&&e.slice("a=msid:".length).split(" ").forEach((e=>{const n=t[e];"string"===typeof n&&(r.remoteMediaTypes[c]=n)}))}))};return{setAcceptingMediaTypes:(n,t)=>{const o=e.get(n.peer);o&&(o.acceptingMediaTypes=t)},getAcceptingMediaTypes:n=>{const t=e.get(n.peer);return t?t.acceptingMediaTypes:[]},addConn:n=>{const t=e.get(n.peer);e.set(n.peer,{conn:n,createdAt:Date.now(),acceptingMediaTypes:[],remoteMediaTypes:{}}),t&&t.conn.close()},markConnected:n=>{const t=e.get(n.peer);t&&t.conn===n&&(t.connected=!0)},isConnectedPeerId:t=>n(e.get(t)),isConnectedConn:t=>{const o=e.get(t.peer);return!(!o||o.conn!==t)&&n(o)},setUserId:(n,t)=>{const o=e.get(n.peer);o&&(o.userId=t)},getUserId:n=>{const t=e.get(n.peer);return t&&t.userId},hasFreshConn:n=>{const t=e.get(n);return!!t&&t.createdAt>Date.now()-6e5},getConn:n=>{const t=e.get(n);return t?t.conn:null},delConn:n=>{const t=e.get(n.peer);return!(!t||t.conn!==n)&&(e.delete(n.peer),!0)},getConnectedPeerIds:()=>Array.from(e.keys()).filter((t=>n(e.get(t)))),getNotConnectedPeerIds:()=>Array.from(e.keys()).filter((t=>!n(e.get(t)))),forEachConnectedConns:t=>{Array.from(e.values()).forEach((e=>{n(e)&&t(e.conn)}))},forEachConnsAcceptingMedia:(t,o)=>{Array.from(e.values()).forEach((e=>{n(e)&&e.acceptingMediaTypes.includes(t)&&o(e.conn)}))},clearAll:()=>{e.size&&console.log("connectionMap garbage:",[...e.entries()].map((e=>{let[n,t]=e;return{id:n,createdAt:t.createdAt,connected:t.connected,open:t.conn.open,userId:t.userId}}))),e.clear()},getRemoteMediaType:(n,t)=>{const o=e.get(n.peer);return o&&o.remoteMediaTypes[t]||null},registerRemoteMediaType:(e,n)=>{(0,s.Hk)(n,"msid2mediaType")&&((0,s.Hk)(n,"offer")&&(0,s.wH)(n.offer,"sdp")&&t(e,n.msid2mediaType,n.offer.sdp),(0,s.Hk)(n,"answer")&&(0,s.wH)(n.answer,"sdp")&&t(e,n.msid2mediaType,n.answer.sdp))}}})();let T=[];const E=await(0,i.I1)(e.slice(d.W));let k=null;const I=function(){let n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:u;if(w)return;h.clearAll();const o=u<=n&&n<=y,c=o?n:(0,i.oq)();t({type:"INITIALIZING_PEER",peerIndex:c});const s=l(e,c),d=new(r())(s,(0,a.sR)());d.on("open",(()=>{k=d,t({type:"CONNECTING_SEED_PEERS"}),setTimeout((()=>{for(let n=u;n<=y;n+=1){const t=l(e,n);P(t)}}),10)})),d.on("error",(e=>{"unavailable-id"===e.type?(d.destroy(),I(n+1)):"peer-unavailable"===e.type||("disconnected"===e.type?console.log("initMyPeer disconnected error",c,e):"network"===e.type?(console.log("initMyPeer network error",c,e),setTimeout((()=>{d.destroyed||null!==k||(d.destroy(),I())}),1e4)):"server-error"===e.type?(console.log("initMyPeer server error",c,e),t({type:"SERVER_ERROR"})):(console.error("initMyPeer unknown error",c,e.type,e),t({type:"UNKNOWN_ERROR",err:e})))})),d.on("connection",(e=>d!==k?(console.log("new connection to old peer, closing"),void e.close()):d.id===e.peer?(console.log("new connection from self, closing"),void e.close()):(t({type:"NEW_CONNECTION",peerIndex:g(e)}),void O(e)))),d.on("disconnected",(()=>{console.log("initMyPeer disconnected",c),setTimeout((()=>{d.destroyed||d!==k||(t({type:"RECONNECTING",peerIndex:c}),d.reconnect(),setTimeout((()=>{d.disconnected&&!d.destroyed&&d===k&&(console.log("reconnect failed, re-initializing"),d.destroy(),k=null,I())}),6e4))}),5e3)}))};I();const M=()=>{var e;if(w)return;const n=h.getConnectedPeerIds().map(p);t({type:"CONNECTED_PEERS",peerIndexList:n}),console.log("myPeer index:",(null===(e=k)||void 0===e?void 0:e.id)&&p(k.id),", connecting:",h.getNotConnectedPeerIds().map(p))},P=e=>{if(w||!k)return;if(k.id===e||k.disconnected)return;if(h.isConnectedPeerId(e))return;if(h.hasFreshConn(e))return;console.log("connectPeer",e);const n=k.connect(e);O(n)},A=e=>{if(w)return;const t=h.getConnectedPeerIds();h.forEachConnectedConns((o=>{S(o,{userId:n,data:e,peers:t,mediaTypes:T})}))},N=(e,n)=>{const t=x();S(e,{SDP:{...n,msid2mediaType:t}})},D=n=>{Array.isArray(n)&&n.forEach((n=>{((e,n)=>"string"===typeof n&&n.startsWith(`${e.slice(0,d.W)} `))(e,n)&&P(n)}))},R=async(e,n)=>{if(!w)try{const t=JSON.parse(await(0,i.NA)(n,E));if(!(0,s.Kn)(t))return;(async(e,n)=>{if((0,s.Kn)(n))if(h.registerRemoteMediaType(e,n),(0,s.Hk)(n,"offer"))try{await e.peerConnection.setRemoteDescription(n.offer),b(e);const t=await e.peerConnection.createAnswer();await e.peerConnection.setLocalDescription(t),N(e,{answer:t})}catch(t){console.info("handleSDP offer failed",t)}else if((0,s.Hk)(n,"answer"))try{await e.peerConnection.setRemoteDescription(n.answer)}catch(t){console.info("handleSDP answer failed",t),await(0,c._)(30*Math.random()*1e3),W(e),b(e)}else console.warn("unknown SDP",n)})(e,t.SDP),((e,n)=>{"string"===typeof n&&h.setUserId(e,n)})(e,t.userId),(async(e,n)=>{Array.isArray(n)&&n.every((e=>"string"===typeof e))&&(h.setAcceptingMediaTypes(e,n),await(0,c._)(5e3),b(e))})(e,t.mediaTypes),D(t.peers),((e,n)=>{const t=h.getUserId(e);if(t){const r={userId:t,peerIndex:g(e),mediaTypes:h.getAcceptingMediaTypes(e)};try{C(n,r)}catch(o){console.warn("receiveData",o)}}})(e,t.data)}catch(t){console.info("Error in handlePayload",t,n)}},S=async(e,n)=>{try{const t=await(0,i.Wu)(JSON.stringify(n),E);e.send(t)}catch(t){console.error("sendPayload",t)}},O=e=>{let n;h.isConnectedPeerId(e.peer)&&console.info("dataConnection already in map, overriding",e.peer),h.addConn(e);const r=()=>{clearTimeout(n),n=setTimeout((()=>{const n=g(e);console.log("dataConnection inactive for 5min",n,e.open),e.open||h.delConn(e),e.close()}),3e5)};r(),e.on("open",(()=>{r(),h.markConnected(e);const n=g(e);console.log("dataConnection open",n),M(),o(n)})),e.on("data",(n=>{r(),h.markConnected(e),R(e,n)})),e.peerConnection.addEventListener("icegatheringstatechange",(()=>{const n=e.peerConnection;"complete"===n.iceGatheringState&&(n.onicecandidate=()=>{})}));let i=!1;e.peerConnection.addEventListener("negotiationneeded",(async()=>{if(i)return;if(i=!0,await(0,c._)(5e3),i=!1,!h.isConnectedConn(e))return;if(!e.peerConnection)return;if("closed"===e.peerConnection.signalingState)return;const n=await e.peerConnection.createOffer();await e.peerConnection.setLocalDescription(n),N(e,{offer:n})})),e.peerConnection.addEventListener("track",(n=>{if(!h.isConnectedConn(e))return void console.warn("received track from non-connected peer, ignoring");const{mid:t}=n.transceiver,o=t&&h.getRemoteMediaType(e,t);if(!o)return void console.warn("failed to find media type from mid");const r=h.getUserId(e);if(r){const t={userId:r,peerIndex:p(e.peer),mediaTypes:h.getAcceptingMediaTypes(e)};v(o,(0,f.xm)(n.track,e.peerConnection),t)}})),e.on("close",(()=>{if(clearTimeout(n),!h.delConn(e))return;const o=g(e);if(t({type:"CONNECTION_CLOSED",peerIndex:o}),M(),0===h.getConnectedPeerIds().length)L(!0);else if(k&&m(e.peer)&&!k.disconnected&&!m(k.id)){const e=600+Math.floor(10*Math.random()*60);console.log(`Disconnected seed peer: ${o}, reinit in ${e}sec...`),setTimeout(L,1e3*e)}}))},L=n=>{if(k&&!k.disconnected){if(!n){if(m(k.id))return;let n=!0;for(let t=u;t<=y;t+=1){const o=l(e,t);if(!h.isConnectedPeerId(o)){n=!1;break}}if(n)return void M()}k.destroy(),k=null,I()}},_=new Map,x=()=>{const e={};return _.forEach(((n,t)=>{let{stream:o}=n;e[o.id]=t})),e},b=e=>{var n,t;const o=null!==(n=null===(t=e.peerConnection)||void 0===t?void 0:t.getSenders())&&void 0!==n?n:[],r=h.getAcceptingMediaTypes(e);r.forEach((n=>{const t=_.get(n);if(!t)return;const{stream:r,track:c}=t;o.every((e=>e.track!==c))&&e.peerConnection.addTrack(c,r)})),o.forEach((n=>{if(!n.track)return;r.some((e=>{var t;return(null===(t=_.get(e))||void 0===t?void 0:t.track)===n.track}))||"closed"===e.peerConnection.signalingState||e.peerConnection.removeTrack(n)})),o.some((e=>e.track&&!e.transport))&&e.peerConnection.dispatchEvent(new Event("negotiationneeded"))},W=e=>{var n,t;(null!==(n=null===(t=e.peerConnection)||void 0===t?void 0:t.getSenders())&&void 0!==n?n:[]).forEach((n=>{n.track&&"closed"!==e.peerConnection.signalingState&&e.peerConnection.removeTrack(n)}))};return{broadcastData:A,sendData:(t,o)=>{if(w)return;const r=h.getConn(l(e,o));if(!r)return;const c=h.getConnectedPeerIds();S(r,{userId:n,data:t,peers:c,mediaTypes:T})},acceptMediaTypes:e=>{w||(e.length!==T.length&&h.forEachConnectedConns((n=>{const t=h.getUserId(n);if(t){const o={userId:t,peerIndex:p(n.peer),mediaTypes:h.getAcceptingMediaTypes(n)},r=n.peerConnection.getTransceivers();n.peerConnection.getReceivers().forEach((t=>{const c=r.find((e=>e.receiver===t)),i=null===c||void 0===c?void 0:c.mid,a=i&&h.getRemoteMediaType(n,i);a?"live"===t.track.readyState&&!T.includes(a)&&e.includes(a)&&v(a,(0,f.xm)(t.track,n.peerConnection),o):console.warn("failed to find media type from mid")}))}})),T=e,A(null))},addTrack:(e,n)=>{if(w)return;if(_.has(e))throw new Error(`track is already added for ${e}`);const t=new MediaStream([n]);_.set(e,{stream:t,track:n}),h.forEachConnsAcceptingMedia(e,(e=>{try{e.peerConnection.addTrack(n,t)}catch(o){if("InvalidAccessError"!==o.name)throw o}}))},removeTrack:e=>{if(w)return;const n=_.get(e);if(!n)return void console.log("track is already removed for",e);const{track:t}=n;_.delete(e),h.forEachConnsAcceptingMedia(e,(e=>{var n,o;const r=(null!==(n=null===(o=e.peerConnection)||void 0===o?void 0:o.getSenders())&&void 0!==n?n:[]).find((e=>e.track===t));r&&"closed"!==e.peerConnection.signalingState&&e.peerConnection.removeTrack(r)}))},dispose:()=>{w=!0,k&&(k.destroy(),k=null)}}}},52780:(e,n,t)=>{"use strict";t.d(n,{xm:()=>r,sW:()=>c,gG:()=>i,FX:()=>a});const o=new WeakMap,r=(e,n)=>{if(o.has(e))return e;o.set(e,!0);const t=function(){let o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1e3;if("ended"===e.readyState)return;const r=n.getTransceivers().find((n=>n.receiver.track===e));!r||"inactive"!==r.currentDirection&&"sendonly"!==r.currentDirection?o<64e3&&setTimeout((()=>{t(2*o)}),o):(e.stop(),e.dispatchEvent(new Event("ended")))};return e.addEventListener("mute",(()=>t())),e},c=e=>new Promise((async(n,t)=>{try{const t=new RTCPeerConnection,o=new RTCPeerConnection;t.addEventListener("icecandidate",(e=>{let{candidate:n}=e;n&&o.addIceCandidate(n)})),o.addEventListener("icecandidate",(e=>{let{candidate:n}=e;n&&t.addIceCandidate(n)})),o.addEventListener("track",(e=>{n(e.track)})),e.addEventListener("ended",(()=>{t.close(),o.close()})),t.addTrack(e);const r=await t.createOffer();await t.setLocalDescription(r),await o.setRemoteDescription(r);const c=await o.createAnswer();await o.setLocalDescription(c),await t.setRemoteDescription(c)}catch(o){t(o)}})),i=async e=>{if("video"!==e.kind)throw new Error("track kind is not video");const n=document.createElement("canvas"),t=n.getContext("2d"),o=new ImageCapture(e);return{getImage:async()=>{try{const e=await o.grabFrame();return n.width=e.width,n.height=e.height,t.drawImage(e,0,0),n.toDataURL("image/jpeg")}catch(e){return console.log("failed to grab frame from viedeo track",e),null}}}},a=()=>{const e=document.createElement("canvas"),n=e.getContext("2d"),t=e.captureStream(),[o]=t.getVideoTracks();return{videoTrack:o,setImage:async t=>{const o=await(r=t,new Promise(((e,n)=>{const t=new Image;t.onload=()=>e(t),t.onerror=n,t.src=r})));var r;e.width=o.width,e.height=o.height,n.drawImage(o,0,0)}}}},98983:e=>{function n(e){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}n.keys=()=>[],n.resolve=n,n.id=98983,e.exports=n}}]);
//# sourceMappingURL=729.2ad55757.chunk.js.map