(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[3],{1256:function(e,t,n){},1259:function(e,t,n){},1283:function(e,t,n){"use strict";n.r(t),n.d(t,"MomentaryChat",(function(){return A}));var a=n(4),r=n(0),c=n(1),i=n.n(c),o=n(1255),s=n.n(o),u=(n(1256),n(95)),l=n(14),b=n(10),d=n(108),f=n(105),m=function(e){return Array.isArray(e)&&2===e.length&&"string"===typeof e[0]&&"number"===typeof e[1]},j=function(e){return Object(d.c)(e)&&"string"===typeof e.nickname&&"string"===typeof e.messageId&&"number"===typeof e.createdAt&&"string"===typeof e.text&&function(e){return Array.isArray(e)&&e.every(m)}(e.replies)},h=function(e,t){var n=t[1]-e[1];return 0===n?e[0].length-t[0].length:n},y=n(239),O=n(1257),g=n(1258),p=n.n(g),C=(n(1259),{toolbar:["specialCharacters","|","bold","italic","link","blockQuote","|","imageUpload","insertTable","mediaEmbed","|","undo","redo"],balloonToolbar:["heading","|","bulletedList","numberedList","indent","outdent"],link:{addTargetToExternalLinks:!0}}),v=i.a.memo((function(e){var t=e.registerClear,n=e.onChange,a=e.onMetaEnter;return Object(r.jsx)(O.CKEditor,{editor:p.a,config:C,onReady:function(e){e.sourceElement.addEventListener("keydown",(function(e){e.metaKey&&"Enter"===e.code&&a()})),t((function(){e.setData("")})),function(e){e.plugins.get("SpecialCharacters").addItems("Emoji",[{title:"smiley face",character:"\ud83d\ude0a"},{title:"rocket",character:"\ud83d\ude80"},{title:"wind blowing face",character:"\ud83c\udf2c\ufe0f"},{title:"floppy disk",character:"\ud83d\udcbe"},{title:"heart",character:"\u2764\ufe0f"}])}(e)},onChange:function(e,t){var a=t.getData();n(a)}})})),x=1048576,k=function(e){return new Date(e.createdAt).toLocaleString().split(" ")[1].slice(0,-3)},N=i.a.memo((function(e){var t,n=e.item,i=e.replyChat,o=Object(c.useState)(!1),u=Object(a.a)(o,2),l=u[0],b=u[1],d=function(e){return i(e,n.messageId)};return Object(r.jsxs)("li",{className:"MomentaryChat-listPart",children:[l&&Object(r.jsx)(y.b,{onSelect:function(e){d(e.native),b(!1)},style:{width:"100%"}}),Object(r.jsxs)("div",{className:"MomentaryChat-listPart-header",children:[Object(r.jsx)("div",{className:"MomentaryChat-iconButton-container",children:Object(r.jsx)("div",{className:"MomentaryChat-iconButton",children:Object(r.jsx)("button",{type:"button",onClick:function(){b(!l)},children:"+"})})}),Object(r.jsx)("span",{className:"MomentaryChat-nickname",children:n.nickname||"No Name"}),Object(r.jsx)("span",{className:"MomentaryChat-time",children:k(n)})]}),Object(r.jsx)("div",{className:"MomentaryChat-text ck-content",dangerouslySetInnerHTML:(t=n.text,{__html:s.a.sanitize(t,{ADD_ATTR:["target"]})})}),(n.replies||[]).map((function(e){var t=Object(a.a)(e,2),n=t[0],c=t[1];return Object(r.jsxs)("button",{className:"MomentaryChat-icon",type:"button",onClick:function(){return d(n)},children:[n," ",c]},n)}))]},n.messageId)})),M=i.a.memo((function(e){var t,n=e.chatList,a=e.replyChat,i=Object(c.useRef)(null),o=null===(t=n[0])||void 0===t?void 0:t.messageId;return Object(c.useEffect)((function(){i.current&&o&&(i.current.scrollTop=i.current.scrollHeight)}),[o]),Object(r.jsx)("ul",{className:"MomentaryChat-list",ref:i,children:n.map((function(e){return Object(r.jsx)(N,{item:e,replyChat:a},e.messageId)}))})})),A=i.a.memo((function(e){var t=e.roomId,n=e.userId,i=e.nickname,o=e.uniqueId,s=Object(c.useRef)(null),d=function(e,t,n,r){var i="".concat(r||"momentray","Chat"),o=Object(c.useState)([]),s=Object(a.a)(o,2),d=s[0],m=s[1];return Object(c.useEffect)((function(){var n=Object(f.a)(e,t).ydoc.getArray(i),a=function(){m(n.toArray().filter(j))};return n.observe(a),a(),function(){n.unobserve(a)}}),[e,t,i]),{chatList:d,sendChat:Object(c.useCallback)((function(a){var r=Object(f.a)(e,t).ydoc.getArray(i),c={nickname:n,messageId:Object(b.j)(),createdAt:Date.now(),text:a,replies:[]};r.unshift([c]),r.length>100&&r.delete(r.length-1,1),m(r.toArray().filter(j))}),[e,t,n,i]),replyChat:Object(c.useCallback)((function(n,a){var r=Object(f.a)(e,t).ydoc.getArray(i);r.forEach((function(e,t){if(j(e)&&e.messageId===a){var c=new Map(e.replies);c.set(n,(c.get(n)||0)+1);var i=Object(l.a)(c.entries());i.sort(h),r.delete(t,1),r.insert(t,[Object(u.a)(Object(u.a)({},e),{},{replies:i})])}})),m(r.toArray().filter(j))}),[e,t,i])}}(t,n,i,o),m=d.chatList,y=d.sendChat,O=d.replyChat,g=Object(c.useRef)(),p=Object(c.useState)(!1),C=Object(a.a)(p,2),k=C[0],N=C[1],A=Object(c.useRef)(""),w=Object(c.useCallback)((function(e){A.current=e,N(!!e&&e.length<=x)}),[]),E=Object(c.useCallback)((function(){A.current&&A.current.length<=x&&(y(A.current),w(""),g.current&&g.current())}),[y,w]),I=function(){var e=Object(c.useRef)(),t=Object(c.useCallback)((function(t){"granted"===Notification.permission&&(e.current&&e.current.close(),e.current=new Notification(t))}),[]);return Object(c.useEffect)((function(){"granted"!==Notification.permission&&Notification.requestPermission()}),[]),t}(),L=m[0];return Object(c.useEffect)((function(){L&&L.createdAt>Date.now()-1e4&&new RegExp("@".concat(i,"\\b")).test(L.text)&&I("You got a new message!")}),[i,L,I]),Object(r.jsxs)("div",{className:"MomentaryChat-container",ref:s,children:[Object(r.jsx)(M,{chatList:m,replyChat:O}),Object(r.jsx)("div",{className:"MomentaryChat-editor",children:Object(r.jsx)(v,{registerClear:function(e){g.current=e},onChange:w,onMetaEnter:E})}),Object(r.jsx)("div",{className:"MomentaryChat-button",children:Object(r.jsx)("button",{type:"button",onClick:E,disabled:!k,children:"Send"})})]})}));t.default=A}}]);
//# sourceMappingURL=3.0e8e7344.chunk.js.map