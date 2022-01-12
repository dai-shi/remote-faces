(self.webpackChunkremote_faces_web=self.webpackChunkremote_faces_web||[]).push([[305],{24961:(e,n,t)=>{"use strict";t.r(n),t.d(n,{createRoom:()=>w});var r=t(25066),a=t(4792),c=t.n(a),i=t(93057),s=t(65954),o=t(1239),d=t(50634),l=t(76996);let p=0;const f={iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"turn:0.peerjs.com:3478",username:"peerjs",credential:"peerjsp"}],sdpSemantics:"unified-plan"};var u=t(52780);const g=r.Ue,w=async(e,n,t,r,a,w)=>{let y=!1;const m=(()=>{const e=new Map,n=(n,t,r)=>{const a=e.get(n.peer);if(!a)return;let c;r.split(/[\r\n]+/).forEach((e=>{e.startsWith("a=mid:")?c=e.slice("a=mid:".length):e.startsWith("a=msid:")&&e.slice("a=msid:".length).split(" ").forEach((e=>{const n=t[e];"string"===typeof n&&(a.remoteMediaTypes[c]=n)}))}))};return{setAcceptingMediaTypes:(n,t)=>{const r=e.get(n.peer);r&&(r.acceptingMediaTypes=t)},getAcceptingMediaTypes:n=>{const t=e.get(n.peer);return t?t.acceptingMediaTypes:[]},addConn:(n,t)=>{if(e.get(n))throw new Error("addConn: already exists");const r={peerIndex:(p+=1,p),peer:n,userId:t,sendPc:new RTCPeerConnection(f),recvPc:new RTCPeerConnection(f)};return e.set(r.peer,{conn:r,acceptingMediaTypes:[],remoteMediaTypes:{}}),r},getConn:n=>{const t=e.get(n);return t?t.conn:null},findConn:n=>{const t=Array.from(e.values()).find((e=>e.conn.peerIndex===n));return t?t.conn:null},delConn:n=>{const t=e.get(n.peer);if(!t||t.conn!==n)throw new Error("delConn: does not exist");e.delete(n.peer),n.sendPc.close(),n.recvPc.close()},getPeerIndexList:()=>Array.from(e.values()).map((e=>e.conn.peerIndex)),forEachConns:n=>{Array.from(e.values()).forEach((e=>{n(e.conn)}))},forEachConnsAcceptingMedia:(n,t)=>{Array.from(e.values()).forEach((e=>{e.acceptingMediaTypes.includes(n)&&t(e.conn)}))},size:()=>e.size,getRemoteMediaType:(n,t)=>{const r=e.get(n.peer);return r&&r.remoteMediaTypes[t]||null},registerRemoteMediaType:(e,t)=>{(0,d.Hk)(t,"msid2mediaType")&&((0,d.Hk)(t,"offer")&&(0,d.wH)(t.offer,"sdp")&&n(e,t.msid2mediaType,t.offer.sdp),(0,d.Hk)(t,"answer")&&(0,d.wH)(t.answer,"sdp")&&n(e,t.msid2mediaType,t.answer.sdp))}}})();let v=[];const h=e.slice(0,l.W),I=await(0,s.I1)(e.slice(l.W));t({type:"INITIALIZING_PEER",peerIndex:0});const T=await g({repo:(0,s.Ze)(),config:{Addresses:{Swarm:[(0,o.Q_)()||"/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/"]},Bootstrap:[]}}),P=(await T.id()).id,E=new(c())(T,h);E.on("message",(e=>R(e))),E.on("peer joined",(()=>{k(null)})),E.on("peer left",(e=>{const n=m.getConn(e);n&&(m.delConn(n),t({type:"CONNECTION_CLOSED",peerIndex:n.peerIndex}))}));const C=async(e,n)=>{try{for await(const t of(0,s.Ri)(JSON.stringify(n),I))E.sendTo(e.peer,t)}catch(t){console.error("sendPayloadDirectly",t)}},k=async e=>{if(y)return;const t={userId:n,data:e,mediaTypes:v};await(async(e,n)=>{try{console.log("payload to encrypt",e,n);for await(const e of(0,s.Ri)(JSON.stringify(n),I))E.broadcast(e)}catch(t){console.error("sendPayload",t)}})(h,t)};const M=async(e,n)=>{const t=N();await C(e,{SDP:{...n,msid2mediaType:t}})},x=new WeakMap,D=e=>{const n=x.has(e);if(x.set(e,(0,s.Ze)()),n)return;const t=async()=>{const n=x.get(e);if(!n)return;if("closed"===e.sendPc.signalingState)return void x.delete(e);const r=await e.sendPc.createOffer();await e.sendPc.setLocalDescription(r),await M(e,{negotiationId:n,offer:r}),await(0,i._)(5e3),t()};t()},S=(e,n)=>{C(e,{ICE:n})},A=async(e,n)=>{try{if(!(0,d.Kn)(n))return;(async(e,n)=>{if(!(0,d.Kn)(n))return;if(!(0,d.wH)(n,"negotiationId"))return void console.warn("negotiationId not found in SDP");const{negotiationId:t}=n;if(m.registerRemoteMediaType(e,n),(0,d.Hk)(n,"offer"))try{await e.recvPc.setRemoteDescription(n.offer);const r=await e.recvPc.createAnswer();await e.recvPc.setLocalDescription(r),M(e,{negotiationId:t,answer:r})}catch(r){console.info("handleSDP offer failed",r)}else if((0,d.Hk)(n,"answer")){x.get(e)===t&&x.delete(e);try{await e.sendPc.setRemoteDescription(n.answer)}catch(r){console.info("handleSDP answer failed",r)}}else console.warn("unknown SDP",n)})(e,n.SDP),((e,n)=>{if((0,d.Kn)(n))if((0,d.wH)(n,"direction"))if((0,d.Hk)(n,"candidate"))try{"send"===n.direction?e.recvPc.addIceCandidate(n.candidate):"recv"===n.direction&&e.sendPc.addIceCandidate(n.candidate)}catch(t){console.info("handleCandidate failed",t)}else console.warn("candidate not found in ICE");else console.warn("direction not found in ICE")})(e,n.ICE),(async(e,n)=>{Array.isArray(n)&&n.every((e=>"string"===typeof e))&&(m.setAcceptingMediaTypes(e,n),await(0,i._)(5e3),b(e))})(e,n.mediaTypes),((e,n)=>{const t={userId:e.userId,peerIndex:e.peerIndex,mediaTypes:m.getAcceptingMediaTypes(e)};try{a(n,t)}catch(r){console.warn("receiveData",r)}})(e,n.data)}catch(t){console.info("Error in handlePayload",t,n)}},R=async e=>{if(y)return;if(e.from===P)return;const n=await(async e=>{try{const n=await(0,s.KI)(e,I);if(null===n)return;const t=JSON.parse(n);return console.log("decrypted payload",t),t}catch(n){return void console.info("Error in parsePayload",n,e)}})(e.data);if(void 0===n)return;const a=(e=>{if(!(0,d.Kn)(e))return null;const n=e.userId;return"string"!==typeof n?null:n})(n);let c=m.getConn(e.from);c||(a?c=((e,n)=>{const a=m.addConn(e,n);return a.sendPc.addEventListener("icecandidate",(e=>{let{candidate:n}=e;n&&S(a,{direction:"send",candidate:n})})),a.recvPc.addEventListener("icecandidate",(e=>{let{candidate:n}=e;n&&S(a,{direction:"recv",candidate:n})})),a.recvPc.addEventListener("track",(e=>{const{mid:n}=e.transceiver,t=n&&m.getRemoteMediaType(a,n);if(!t)return void console.warn("failed to find media type from mid");const r={userId:a.userId,peerIndex:a.peerIndex,mediaTypes:m.getAcceptingMediaTypes(a)};w(t,(0,u.xm)(e.track,a.recvPc),r)})),r(a.peerIndex),t({type:"NEW_CONNECTION",peerIndex:a.peerIndex}),a})(e.from,a):console.warn("cannot initialize conn without user id")),c&&await A(c,n);const i=m.getPeerIndexList();t({type:"CONNECTED_PEERS",peerIndexList:i})},L=new Map,N=()=>{const e={};return L.forEach(((n,t)=>{let{stream:r}=n;e[r.id]=t})),e},b=e=>{const n=e.sendPc.getSenders(),t=m.getAcceptingMediaTypes(e);t.forEach((t=>{const r=L.get(t);if(!r)return;const{stream:a,track:c}=r;n.every((e=>e.track!==c))&&(e.sendPc.addTrack(c,a),D(e))})),n.forEach((n=>{if(!n.track)return;t.some((e=>{var t;return(null===(t=L.get(e))||void 0===t?void 0:t.track)===n.track}))||"closed"===e.sendPc.signalingState||(e.sendPc.removeTrack(n),D(e))}))};return{broadcastData:k,sendData:async(e,t)=>{if(y)return;const r=m.findConn(t);if(!r)return;const a={userId:n,data:e,mediaTypes:v};await C(r,a)},acceptMediaTypes:e=>{y||(e.length!==v.length&&m.forEachConns((n=>{const t={userId:n.userId,peerIndex:n.peerIndex,mediaTypes:m.getAcceptingMediaTypes(n)},r=n.recvPc.getTransceivers();n.recvPc.getReceivers().forEach((a=>{const c=r.find((e=>e.receiver===a)),i=null===c||void 0===c?void 0:c.mid,s=i&&m.getRemoteMediaType(n,i);s?"live"===a.track.readyState&&!v.includes(s)&&e.includes(s)&&w(s,(0,u.xm)(a.track,n.recvPc),t):console.warn("failed to find media type from mid")}))})),v=e,k(null))},addTrack:(e,n)=>{if(y)return;if(L.has(e))throw new Error(`track is already added for ${e}`);const t=new MediaStream([n]);L.set(e,{stream:t,track:n}),m.forEachConnsAcceptingMedia(e,(e=>{try{e.sendPc.addTrack(n,t),D(e)}catch(r){if("InvalidAccessError"!==r.name)throw r}}))},removeTrack:e=>{if(y)return;const n=L.get(e);if(!n)return void console.log("track is already removed for",e);const{track:t}=n;L.delete(e),m.forEachConnsAcceptingMedia(e,(e=>{const n=e.sendPc.getSenders().find((e=>e.track===t));n&&"closed"!==e.sendPc.signalingState&&(e.sendPc.removeTrack(n),D(e))}))},dispose:async()=>{y=!0,await E.leave(),await T.stop()}}}},52780:(e,n,t)=>{"use strict";t.d(n,{xm:()=>a,sW:()=>c,gG:()=>i,FX:()=>s});const r=new WeakMap,a=(e,n)=>{if(r.has(e))return e;r.set(e,!0);const t=function(){let r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1e3;if("ended"===e.readyState)return;const a=n.getTransceivers().find((n=>n.receiver.track===e));!a||"inactive"!==a.currentDirection&&"sendonly"!==a.currentDirection?r<64e3&&setTimeout((()=>{t(2*r)}),r):(e.stop(),e.dispatchEvent(new Event("ended")))};return e.addEventListener("mute",(()=>t())),e},c=e=>new Promise((async(n,t)=>{try{const t=new RTCPeerConnection,r=new RTCPeerConnection;t.addEventListener("icecandidate",(e=>{let{candidate:n}=e;n&&r.addIceCandidate(n)})),r.addEventListener("icecandidate",(e=>{let{candidate:n}=e;n&&t.addIceCandidate(n)})),r.addEventListener("track",(e=>{n(e.track)})),e.addEventListener("ended",(()=>{t.close(),r.close()})),t.addTrack(e);const a=await t.createOffer();await t.setLocalDescription(a),await r.setRemoteDescription(a);const c=await r.createAnswer();await r.setLocalDescription(c),await t.setRemoteDescription(c)}catch(r){t(r)}})),i=async e=>{if("video"!==e.kind)throw new Error("track kind is not video");const n=document.createElement("canvas"),t=n.getContext("2d"),r=new ImageCapture(e);return{getImage:async()=>{try{const e=await r.grabFrame();return n.width=e.width,n.height=e.height,t.drawImage(e,0,0),n.toDataURL("image/jpeg")}catch(e){return console.log("failed to grab frame from viedeo track",e),null}}}},s=()=>{const e=document.createElement("canvas"),n=e.getContext("2d"),t=e.captureStream(),[r]=t.getVideoTracks();return{videoTrack:r,setImage:async t=>{const r=await(a=t,new Promise(((e,n)=>{const t=new Image;t.onload=()=>e(t),t.onerror=n,t.src=a})));var a;e.width=r.width,e.height=r.height,n.drawImage(r,0,0)}}}},45022:()=>{},32296:()=>{},91586:()=>{},77265:()=>{},59983:()=>{},97868:()=>{},73034:()=>{},17847:()=>{},75715:()=>{},45089:()=>{},31566:()=>{},95745:()=>{},50471:()=>{},71632:()=>{}}]);
//# sourceMappingURL=305.8d7aff00.chunk.js.map