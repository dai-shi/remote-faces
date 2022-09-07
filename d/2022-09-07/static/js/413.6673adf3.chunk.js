"use strict";(self.webpackChunkremote_faces_web=self.webpackChunkremote_faces_web||[]).push([[413],{33413:(e,n,t)=>{t.r(n),t.d(n,{createRoom:()=>g});var o=t(10366),r=t(93057),c=t(65954),i=t(1239),a=t(50634),s=t(76996);const d=(e,n)=>`${e.slice(0,s.W)} ${n}`,l=e=>Number(e.split(" ")[1]);var p=t(52780);const g=async(e,n,t,g,f,y)=>{let m=!1;const u=(()=>{const e=new Map,n=e=>!!(e&&e.connected&&e.conn.open),t=(n,t,o)=>{const r=e.get(n.peer);if(!r)return;let c;o.split(/[\r\n]+/).forEach((e=>{e.startsWith("a=mid:")?c=e.slice("a=mid:".length):e.startsWith("a=msid:")&&e.slice("a=msid:".length).split(" ").forEach((e=>{const n=t[e];"string"===typeof n&&(r.remoteMediaTypes[c]=n)}))}))};return{setAcceptingMediaTypes:(n,t)=>{const o=e.get(n.peer);o&&(o.acceptingMediaTypes=t)},getAcceptingMediaTypes:n=>{const t=e.get(n.peer);return t?t.acceptingMediaTypes:[]},addConn:n=>{const t=e.get(n.peer);e.set(n.peer,{conn:n,createdAt:Date.now(),acceptingMediaTypes:[],remoteMediaTypes:{}}),t&&t.conn.close()},markConnected:n=>{const t=e.get(n.peer);t&&t.conn===n&&(t.connected=!0)},isConnectedConn:t=>{const o=e.get(t.peer);return!(!o||o.conn!==t)&&n(o)},setUserId:(n,t)=>{const o=e.get(n.peer);o&&(o.userId=t)},getUserId:n=>{const t=e.get(n.peer);return t&&t.userId},getConn:n=>{const t=e.get(n);return t?t.conn:null},delConn:n=>{const t=e.get(n.peer);return!(!t||t.conn!==n)&&(e.delete(n.peer),!0)},getConnectedPeerIds:()=>Array.from(e.keys()).filter((t=>n(e.get(t)))),getNotConnectedPeerIds:()=>Array.from(e.keys()).filter((t=>!n(e.get(t)))),forEachConnectedConns:t=>{Array.from(e.values()).forEach((e=>{n(e)&&t(e.conn)}))},forEachConnsAcceptingMedia:(t,o)=>{Array.from(e.values()).forEach((e=>{n(e)&&e.acceptingMediaTypes.includes(t)&&o(e.conn)}))},clearAll:()=>{e.size&&console.log("connectionMap garbage:",[...e.entries()].map((e=>{let[n,t]=e;return{id:n,createdAt:t.createdAt,connected:t.connected,open:t.conn.open,userId:t.userId}}))),e.clear()},getRemoteMediaType:(n,t)=>{const o=e.get(n.peer);return o&&o.remoteMediaTypes[t]||null},registerRemoteMediaType:(e,n)=>{(0,a.Hk)(n,"msid2mediaType")&&((0,a.Hk)(n,"offer")&&(0,a.wH)(n.offer,"sdp")&&t(e,n.msid2mediaType,n.offer.sdp),(0,a.Hk)(n,"answer")&&(0,a.wH)(n.answer,"sdp")&&t(e,n.msid2mediaType,n.answer.sdp))}}})();window.myConnMap=u;let C=[];const w=await(0,c.I1)(e.slice(s.W));let v=null;window.getMyPeer=()=>v;const h=function(){let n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;if(m)return;u.clearAll(),t({type:"INITIALIZING_PEER",peerIndex:n});const r=d(e,n),c=new o._z(r,(0,i.sR)());c.on("open",(()=>{v=c,console.log("myPeer initialized",n),setTimeout(E,10)})),c.on("error",(e=>{if("unavailable-id"===e.type){if(c.destroy(),50===n)throw new Error("max peer index reached");setTimeout((()=>{h(n+1)}),100)}else"peer-unavailable"===e.type||("disconnected"===e.type?console.log("initMyPeer disconnected error",n,e):"network"===e.type?(console.log("initMyPeer network error",n,e),setTimeout((()=>{c.destroyed||null!==v||(c.destroy(),h())}),1e4)):"server-error"===e.type?(console.log("initMyPeer server error",n,e),t({type:"SERVER_ERROR"})):(console.error("initMyPeer unknown error",n,e.type,e),t({type:"UNKNOWN_ERROR",err:e})))})),c.on("connection",(e=>c!==v?(console.log("new connection to old peer, closing"),void e.close()):c.id===e.peer?(console.log("new connection from self, closing"),void e.close()):(t({type:"NEW_CONNECTION",peerIndex:l(e.peer)}),void R(e)))),c.on("disconnected",(()=>{console.log("initMyPeer disconnected",n),setTimeout((()=>{c.destroyed||c!==v||(t({type:"RECONNECTING",peerIndex:n}),c.reconnect(),setTimeout((()=>{c.disconnected&&!c.destroyed&&c===v&&(console.log("reconnect failed, re-initializing"),D())}),6e4))}),5e3)}))};h();const T=()=>{var e;if(m)return;const n=u.getConnectedPeerIds().map(l);t({type:"CONNECTED_PEERS",peerIndexList:n}),console.log("myPeer index:",(null===(e=v)||void 0===e?void 0:e.id)&&l(v.id),", connecting:",u.getNotConnectedPeerIds().map(l))},E=()=>{if(!v)return;const n=l(v.id);if(n>1){t({type:"CONNECTING_SEED_PEERS"});for(let t=1;t<n;t+=1){const n=d(e,t);k(n)}}},k=e=>{if(m||!v)return;if(v.id===e||v.disconnected)return;if(u.getConn(e))return;console.log("connectPeer",e);const n=v.connect(e);R(n)},I=e=>{if(m)return;const t=u.getConnectedPeerIds();u.forEachConnectedConns((o=>{N(o,{userId:n,data:e,peers:t,mediaTypes:C})}))},M=(e,n)=>{const t=L();N(e,{SDP:{...n,msid2mediaType:t}})},P=n=>{Array.isArray(n)&&n.forEach((n=>{((e,n)=>"string"===typeof n&&n.startsWith(`${e.slice(0,s.W)} `))(e,n)&&v&&l(n)<l(v.id)&&k(n)}))},A=async(e,n)=>{if(!m)try{const t=JSON.parse(await(0,c.NA)(n,w));if(!(0,a.Kn)(t))return;(async(e,n)=>{if((0,a.Kn)(n))if(u.registerRemoteMediaType(e,n),(0,a.Hk)(n,"offer"))try{await e.peerConnection.setRemoteDescription(n.offer),_(e);const t=await e.peerConnection.createAnswer();await e.peerConnection.setLocalDescription(t),M(e,{answer:t})}catch(t){console.info("handleSDP offer failed",t)}else if((0,a.Hk)(n,"answer"))try{await e.peerConnection.setRemoteDescription(n.answer)}catch(t){console.info("handleSDP answer failed",t),await(0,r._)(30*Math.random()*1e3),O(e),_(e)}else console.warn("unknown SDP",n)})(e,t.SDP),((e,n)=>{"string"===typeof n&&u.setUserId(e,n)})(e,t.userId),(async(e,n)=>{Array.isArray(n)&&n.every((e=>"string"===typeof e))&&(u.setAcceptingMediaTypes(e,n),await(0,r._)(5e3),_(e))})(e,t.mediaTypes),P(t.peers),((e,n)=>{const t=u.getUserId(e);if(t){const r={userId:t,peerIndex:l(e.peer),mediaTypes:u.getAcceptingMediaTypes(e)};try{f(n,r)}catch(o){console.warn("receiveData",o)}}})(e,t.data)}catch(t){console.info("Error in handlePayload",t,n)}},N=async(e,n)=>{try{const t=await(0,c.Wu)(JSON.stringify(n),w);e.send(t)}catch(t){console.error("sendPayload",t)}},R=e=>{const n=l(e.peer);let o;u.addConn(e);const c=t=>{clearTimeout(o),o=setTimeout((()=>{console.log("Connection inactive for",t,"msec:",n,e.open),e.close(),u.delConn(e),S(e.peer)}),t)},i=v&&n<l(v.id);c(i?2e4:5e4),e.on("open",(()=>{c(3e4),u.markConnected(e),console.log("dataConnection open",n),T(),g(n)})),e.on("data",(n=>{c(18e4),u.markConnected(e),A(e,n)})),e.peerConnection.addEventListener("icegatheringstatechange",(()=>{const n=e.peerConnection;"complete"===n.iceGatheringState&&(n.onicecandidate=()=>{})}));let a=!1;e.peerConnection.addEventListener("negotiationneeded",(async()=>{if(a)return;if(a=!0,await(0,r._)(5e3),a=!1,!u.isConnectedConn(e))return;if(!e.peerConnection)return;if("closed"===e.peerConnection.signalingState)return;const n=await e.peerConnection.createOffer();await e.peerConnection.setLocalDescription(n),M(e,{offer:n})})),e.peerConnection.addEventListener("track",(t=>{if(!u.isConnectedConn(e))return void console.warn("received track from non-connected peer, ignoring");const{mid:o}=t.transceiver,r=o&&u.getRemoteMediaType(e,o);if(!r)return void console.warn("failed to find media type from mid");const c=u.getUserId(e);if(c){const o={userId:c,peerIndex:n,mediaTypes:u.getAcceptingMediaTypes(e)};y(r,(0,p.xm)(t.track,e.peerConnection),o)}})),e.on("close",(()=>{clearTimeout(o),u.delConn(e),t({type:"CONNECTION_CLOSED",peerIndex:n}),T(),u.getNotConnectedPeerIds().length>=u.getConnectedPeerIds().length?D():S(e.peer)}))},S=e=>{v&&l(e)<l(v.id)&&k(e)},D=()=>{v&&!v.disconnected&&(v.destroy(),v=null,h())},x=new Map,L=()=>{const e={};return x.forEach(((n,t)=>{let{stream:o}=n;e[o.id]=t})),e},_=e=>{var n,t;const o=null!==(n=null===(t=e.peerConnection)||void 0===t?void 0:t.getSenders())&&void 0!==n?n:[],r=u.getAcceptingMediaTypes(e);r.forEach((n=>{const t=x.get(n);if(!t)return;const{stream:r,track:c}=t;o.every((e=>e.track!==c))&&e.peerConnection.addTrack(c,r)})),o.forEach((n=>{if(!n.track)return;r.some((e=>{var t;return(null===(t=x.get(e))||void 0===t?void 0:t.track)===n.track}))||"closed"===e.peerConnection.signalingState||e.peerConnection.removeTrack(n)})),o.some((e=>e.track&&!e.transport))&&e.peerConnection.dispatchEvent(new Event("negotiationneeded"))},O=e=>{var n,t;(null!==(n=null===(t=e.peerConnection)||void 0===t?void 0:t.getSenders())&&void 0!==n?n:[]).forEach((n=>{n.track&&"closed"!==e.peerConnection.signalingState&&e.peerConnection.removeTrack(n)}))};return{broadcastData:I,sendData:(t,o)=>{if(m)return;const r=u.getConn(d(e,o));if(!r)return;const c=u.getConnectedPeerIds();N(r,{userId:n,data:t,peers:c,mediaTypes:C})},acceptMediaTypes:e=>{m||(e.length!==C.length&&u.forEachConnectedConns((n=>{const t=u.getUserId(n);if(t){const o={userId:t,peerIndex:l(n.peer),mediaTypes:u.getAcceptingMediaTypes(n)},r=n.peerConnection.getTransceivers();n.peerConnection.getReceivers().forEach((t=>{const c=r.find((e=>e.receiver===t)),i=null===c||void 0===c?void 0:c.mid,a=i&&u.getRemoteMediaType(n,i);a?"live"===t.track.readyState&&!C.includes(a)&&e.includes(a)&&y(a,(0,p.xm)(t.track,n.peerConnection),o):console.warn("failed to find media type from mid")}))}})),C=e,I(null))},addTrack:(e,n)=>{if(m)return;if(x.has(e))throw new Error(`track is already added for ${e}`);const t=new MediaStream([n]);x.set(e,{stream:t,track:n}),u.forEachConnsAcceptingMedia(e,(e=>{try{e.peerConnection.addTrack(n,t)}catch(o){if("InvalidAccessError"!==o.name)throw o}}))},removeTrack:e=>{if(m)return;const n=x.get(e);if(!n)return void console.log("track is already removed for",e);const{track:t}=n;x.delete(e),u.forEachConnsAcceptingMedia(e,(e=>{var n,o;const r=(null!==(n=null===(o=e.peerConnection)||void 0===o?void 0:o.getSenders())&&void 0!==n?n:[]).find((e=>e.track===t));r&&"closed"!==e.peerConnection.signalingState&&e.peerConnection.removeTrack(r)}))},dispose:()=>{m=!0,v&&(v.destroy(),v=null)}}}},52780:(e,n,t)=>{t.d(n,{FX:()=>a,gG:()=>i,sW:()=>c,xm:()=>r});const o=new WeakMap,r=(e,n)=>{if(o.has(e))return e;o.set(e,!0);const t=function(){let o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1e3;if("ended"===e.readyState)return;const r=n.getTransceivers().find((n=>n.receiver.track===e));!r||"inactive"!==r.currentDirection&&"sendonly"!==r.currentDirection?o<64e3&&setTimeout((()=>{t(2*o)}),o):(e.stop(),e.dispatchEvent(new Event("ended")))};return e.addEventListener("mute",(()=>t())),e},c=e=>new Promise((async(n,t)=>{try{const t=new RTCPeerConnection,o=new RTCPeerConnection;t.addEventListener("icecandidate",(e=>{let{candidate:n}=e;n&&o.addIceCandidate(n)})),o.addEventListener("icecandidate",(e=>{let{candidate:n}=e;n&&t.addIceCandidate(n)})),o.addEventListener("track",(e=>{n(e.track)})),e.addEventListener("ended",(()=>{t.close(),o.close()})),t.addTrack(e);const r=await t.createOffer();await t.setLocalDescription(r),await o.setRemoteDescription(r);const c=await o.createAnswer();await o.setLocalDescription(c),await t.setRemoteDescription(c)}catch(o){t(o)}})),i=async e=>{if("video"!==e.kind)throw new Error("track kind is not video");const n=document.createElement("canvas"),t=n.getContext("2d"),o=new ImageCapture(e);return{getImage:async()=>{try{const e=await o.grabFrame();return n.width=e.width,n.height=e.height,t.drawImage(e,0,0),n.toDataURL("image/jpeg")}catch(e){return console.log("failed to grab frame from viedeo track",e),null}}}},a=()=>{const e=document.createElement("canvas"),n=e.getContext("2d"),t=e.captureStream(),[o]=t.getVideoTracks();return{videoTrack:o,setImage:async t=>{const o=await(r=t,new Promise(((e,n)=>{const t=new Image;t.onload=()=>e(t),t.onerror=n,t.src=r})));var r;e.width=o.width,e.height=o.height,n.drawImage(o,0,0)}}}}}]);
//# sourceMappingURL=413.6673adf3.chunk.js.map