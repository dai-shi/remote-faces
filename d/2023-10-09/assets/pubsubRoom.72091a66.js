import{c as ce}from"./index.5ec669a3.js";import{i as V,s as S}from"./SingleRoom.adcf2433.js";import{q as R,v as ie,l as de,w as ue,x as z,y as j,C as pe,D as fe,E as le}from"./index.7499875d.js";import{v as ye,l as we,i as ge}from"./trackUtils.b921598c.js";let H=0;const be=()=>(H+=1,H),he=()=>{const c=new Map;return{setAcceptingMediaTypes:(r,o)=>{const f=c.get(r.peer);f&&(f.acceptingMediaTypes=o)},getAcceptingMediaTypes:r=>{const o=c.get(r.peer);return o?o.acceptingMediaTypes:[]},addConn:(r,o)=>{if(c.get(r))throw new Error("addConn: already exists");const C={peerIndex:be(),peer:r,userId:o,audioWorkers:new Map,vidoeSetImages:new Map};return c.set(C.peer,{conn:C,acceptingMediaTypes:[]}),C},getConn:r=>{const o=c.get(r);return o?o.conn:null},findConn:r=>{const o=Array.from(c.values()).find(f=>f.conn.peerIndex===r);return o?o.conn:null},delConn:r=>{const o=c.get(r.peer);if(o&&o.conn===r)c.delete(r.peer);else throw new Error("delConn: does not exist")},getPeerIndexList:()=>Array.from(c.values()).map(r=>r.conn.peerIndex),forEachConns:r=>{Array.from(c.values()).forEach(o=>{r(o.conn)})},size:()=>c.size}},G=new Map,k=async(c,I)=>{const y=`${c} ${I}`;let h=G.get(y);return h||(h=(await fe(y)).slice(0,R),G.set(y,h)),h},Ae=async(c,I,y,h,U,P)=>{let w=!1;const d=he();let M=[];const g=c.slice(0,R),r=await ie(c.slice(R));y({type:"INITIALIZING_PEER",peerIndex:0});const o=await ce({repo:de(),config:{Addresses:{Swarm:[ue()||"/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/"]},Bootstrap:[]}}),f=(await o.id()).id;await o.pubsub.subscribe(g,e=>m(e)),await o.pubsub.subscribe(`${g} ${f}`,e=>m(e));const C=async e=>{try{const t=await z(e,r);if(t===null)return;const n=JSON.parse(t);return console.log("decrypted payload",n),n}catch(t){console.info("Error in parsePayload",t,e);return}},_=async(e,t)=>{try{console.log("payload to encrypt",e,t);for await(const n of j(JSON.stringify(t),r))await o.pubsub.publish(e,new Uint8Array(n),{})}catch(n){console.error("sendPayload",n)}},J=async(e,t)=>{const n=`${g} ${e.peer}`;await _(n,t)},T=async e=>{if(w)return;await _(g,{userId:I,data:e,mediaTypes:M})},K=async(e,t)=>{if(w)return;const n=d.findConn(t);if(!n)return;await J(n,{userId:I,data:e,mediaTypes:M})},E=new Map,q=async e=>{const t=[];E.set(e,t);const n=await k(c,e),a=async i=>{if(!("from"in i)||i.from.toString()===f.toString())return;const s=d.getConn(i.from.toString());if(!s){console.warn("conn not ready");return}const b={userId:s.userId,peerIndex:s.peerIndex,mediaTypes:d.getAcceptingMediaTypes(s)};if(!s.audioWorkers.has(e)){const p=new AudioContext,$=p.createMediaStreamDestination();let W=0,L=0;const O=new Worker("audio-decoder.js",{type:"module"});O.onmessage=se=>{const ae=new Float32Array(se.data);L||(W=p.currentTime),W+=.06,L+=1;const B=p.createBuffer(1,2880,48e3);B.copyToChannel(ae,0);const A=p.createBufferSource();A.buffer=B,A.connect($),A.onended=()=>{L-=1},A.start(W)},s.audioWorkers.set(e,O);const F=$.stream.getAudioTracks()[0];P(e,await we(F),b),t.push(()=>{p.close(),F.dispatchEvent(new Event("ended")),O.terminate(),s.audioWorkers.delete(e)})}const l=await le(i.data.buffer,i.data.byteOffset,i.data.byteLength,r),u=s.audioWorkers.get(e);u&&l.forEach(p=>{u.postMessage([p],[p])})};o.pubsub.subscribe(n,a),t.unshift(()=>{o.pubsub.unsubscribe(n,a)})},X=async e=>{const t=[];E.set(e,t);const n=await k(c,e),a=async i=>{if(!("from"in i)||i.from.toString()===f.toString())return;const s=d.getConn(i.from.toString());if(!s){console.warn("conn not ready");return}const b={userId:s.userId,peerIndex:s.peerIndex,mediaTypes:d.getAcceptingMediaTypes(s)};if(!s.vidoeSetImages.has(e)){const{videoTrack:u,setImage:p}=ge();s.vidoeSetImages.set(e,p),P(e,u,b),t.push(()=>{u.dispatchEvent(new Event("ended")),s.vidoeSetImages.delete(e)})}const l=s.vidoeSetImages.get(e);try{const u=await z(i.data,r);l&&u&&l(u)}catch(u){console.info("Error in parse for video media",u)}};o.pubsub.subscribe(n,a),t.unshift(()=>{o.pubsub.unsubscribe(n,a)})},Z=e=>{w||(E.forEach((t,n)=>{e.includes(n)||(t.forEach(a=>a()),E.delete(n))}),e.forEach(t=>{if(!E.has(t))if(t.endsWith("Audio"))q(t);else if(t.endsWith("Video"))X(t);else throw new Error("pubsubRoom: cannot guess mediaType (Audio/Video)")}),M=e,T(null))},Q=async(e,t)=>{Array.isArray(t)&&t.every(n=>typeof n=="string")&&d.setAcceptingMediaTypes(e,t)},Y=(e,t)=>{const n={userId:e.userId,peerIndex:e.peerIndex,mediaTypes:d.getAcceptingMediaTypes(e)};try{U(t,n)}catch(a){console.warn("receiveData",a)}},ee=async(e,t)=>{try{if(!V(t))return;Q(e,t.mediaTypes),Y(e,t.data)}catch(n){console.info("Error in handlePayload",n,t)}},te=(e,t)=>{const n=d.addConn(e,t);return h(n.peerIndex),y({type:"NEW_CONNECTION",peerIndex:n.peerIndex}),n},ne=e=>{if(!V(e))return null;const t=e.userId;return typeof t!="string"?null:t},m=async e=>{if(w||!("from"in e)||e.from.toString()===f.toString())return;const t=await C(e.data);if(t===void 0)return;const n=ne(t);let a=d.getConn(e.from.toString());a||(n?a=te(e.from.toString(),n):console.warn("cannot initialize conn without user id")),a&&await ee(a,t);const i=d.getPeerIndexList();y({type:"CONNECTED_PEERS",peerIndexList:i})},D=async()=>{if(w)return;const e=await o.pubsub.peers(g);if(d.forEachConns(t=>{e.some(n=>n.toString()===t.peer)||(d.delConn(t),y({type:"CONNECTION_CLOSED",peerIndex:t.peerIndex}))}),!e.length){y({type:"CONNECTING_SEED_PEERS"}),await S(1e3),D();return}d.size()||await T(null),await S(5e3),D()};D();const v=new WeakMap,N=e=>{e&&e()},oe=async(e,t)=>{N(v.get(t));const n=new MediaStream([t]),a=new AudioContext,i=a.createMediaStreamSource(n);await a.audioWorklet.addModule("audio-encoder.js");const s=new AudioWorkletNode(a,"audio-encoder"),b=await k(c,e),l=[];s.port.onmessage=async u=>{if(l.push(u.data),l.length<17)return;const p=await pe(l.splice(0,l.length),r);o.pubsub.publish(b,new Uint8Array(p),{})},i.connect(s),v.set(t,()=>{a.close()})},re=async(e,t)=>{N(v.get(t));const n=await k(c,e),{getImage:a}=await ye(t);let i=!1;const s=async()=>{if(i)return;const b=await a();if(b)for await(const l of j(b,r)){if(i)return;await o.pubsub.publish(n,new Uint8Array(l),{}),await S(1e3)}else await S(5e3);s()};s(),v.set(t,()=>{i=!0})},x=new Map;return{broadcastData:T,sendData:K,acceptMediaTypes:Z,addTrack:async(e,t)=>{if(!w){if(x.has(e))throw new Error(`track is already added for ${e}`);if(x.set(e,t),e.endsWith("Audio"))oe(e,t);else if(e.endsWith("Video"))re(e,t);else throw new Error("pubsubRoom: cannot guess mediaType (Audio/Video)")}},removeTrack:e=>{if(w)return;const t=x.get(e);if(!t){console.log("track is already removed for",e);return}x.delete(e),N(v.get(t))},dispose:async()=>{w=!0,await o.pubsub.unsubscribe(`${g} ${f}`,m),await o.pubsub.unsubscribe(g,m),await o.stop()}}};export{Ae as createRoom};
