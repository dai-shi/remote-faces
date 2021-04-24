(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[13],{1236:function(t,e,n){},1245:function(t,e,n){"use strict";n.r(e),n.d(e,"GoBoard",(function(){return b}));var o=n(4),r=n(0),i=n(1),c=n.n(i),u=n(517),a=(n(1236),n(113)),s=function(t,e,n,o){var r="".concat(o||"go","Board");return Object(i.useEffect)((function(){var o=Object(a.a)(t,e).ydoc.getArray(r),i=function(){n(o.toArray().flatMap((function(t){try{var e=JSON.parse(t);if(function(t){try{var e=t;return"number"===typeof e.size&&e.grid.length===e.size*e.size&&!e.grid.some((function(t){return t!==u.Color.B&&t!==u.Color.W&&t!==u.Color.E}))&&"number"===typeof e.capCount.black&&"number"===typeof e.capCount.white&&(e.turn===u.Color.B||e.turn===u.Color.W)}catch(n){return!1}}(e))return[e]}catch(n){}return[]})))};return o.observe(i),i(),function(){o.unobserve(i)}}),[t,e,n,r]),{syncUp:Object(i.useCallback)((function(n){var o=Object(a.a)(t,e).ydoc.getArray(r);o.length<n.length?o.push(n.slice(o.length).map((function(t){return JSON.stringify(t)}))):o.length>n.length&&o.delete(n.length,o.length-n.length)}),[t,e,r])}},l=function(t){var e=new u.Position(t.size);return e.grid=t.grid,e.capCount=t.capCount,e.turn=t.turn,e},b=c.a.memo((function(t){var e=t.roomId,n=t.userId,c=t.uniqueId,a=Object(i.useRef)(),b=Object(i.useCallback)((function(t){a.current&&a.current.syncDown(t)}),[]),f=s(e,n,b,c).syncUp,p=Object(i.useState)("black"),d=Object(o.a)(p,2),h=d[0],j=d[1],v=Object(i.useState)({black:0,white:0}),O=Object(o.a)(v,2),C=O[0],g=O[1],m=Object(i.useRef)(null);Object(i.useEffect)((function(){if(m.current){var t,e=m.current,n=function(t,e,n,o){var r=new u.Game(6),i=new u.CanvasBoard(t,{theme:u.themes.modernTheme,width:t.clientWidth,height:t.clientHeight,size:6}),c=[],a=null,s=function(){c=c.filter((function(t){return r.getStone(t.x,t.y)===("B"===t.type?u.Color.B:u.Color.W)||(i.removeObject(t),!1)})),a&&i.removeObject(a),a=null;for(var t=function(t){for(var e=function(e){var n=r.position.get(t,e);if(n&&!c.some((function(o){return o.x===t&&o.y===e&&n===("B"===o.type?u.Color.B:u.Color.W)}))){var o=new u.FieldObject(n===u.Color.B?"B":"W",t,e);i.addObject(o),c.push(o),null===a?(a=new u.BoardMarkupObject("SQ",t,e,n),i.addObject(a)):a&&(i.removeObject(a),a=!1)}},n=0;n<r.position.size;n+=1)e(n)},e=0;e<r.position.size;e+=1)t(e)},b=null,f=function(){b&&(i.removeObject(b),b=null)};return i.on("mousemove",(function(t,e){if(e&&r.isValid(e.x,e.y)){if(b){if(b.x===e.x&&b.y===e.y)return;i.removeObject(b)}else b=new u.FieldObject(r.turn===u.Color.B?"B":"W");b.setPosition(e.x,e.y),i.addObject(b)}else f()})),i.on("mouseout",f),i.on("click",(function(t,i){var c=i.x,a=i.y;r.isValid(c,a)&&(f(),r.play(c,a),s(),e(r.turn===u.Color.B?"black":"white"),n(r.position.capCount),o(r.positionStack))})),e(r.turn===u.Color.B?"black":"white"),{syncDown:function(t){if(r.positionStack.length!==t.length){for(;r.positionStack.length<t.length;)r.pushPosition(l(t[r.positionStack.length]));for(;r.positionStack.length>t.length;)r.popPosition();s(),e(r.turn===u.Color.B?"black":"white"),n(r.position.capCount),f()}},pass:function(){r.pass(),e(r.turn===u.Color.B?"black":"white"),o(r.positionStack)},undo:function(){r.popPosition()&&(s(),e(r.turn===u.Color.B?"black":"white"),n(r.position.capCount),o(r.positionStack))},resize:function(){i.setDimensions(t.clientWidth,t.clientHeight)}}}(e,j,g,f);a.current=n;var o=new MutationObserver(n.resize),r=null===(t=e.parentNode)||void 0===t?void 0:t.parentNode;return r&&o.observe(r,{attributes:!0,attributeFilter:["style"]}),function(){o.disconnect()}}}),[f]);return Object(r.jsxs)("div",{className:"GoBoard-container",children:[Object(r.jsxs)("div",{className:"GoBoard-toolbar",children:["Next Turn: ","black"===h?"Black":"White",Object(r.jsx)("button",{type:"button",onClick:function(){a.current&&a.current.pass()},children:"Pass"}),Object(r.jsx)("button",{type:"button",onClick:function(){a.current&&a.current.undo()},children:"Undo"}),Object(r.jsxs)("div",{children:["Capture Count: Black ",C.black,", White ",C.white]})]}),Object(r.jsx)("div",{className:"GoBoard-canvas",ref:m})]})}));e.default=b}}]);
//# sourceMappingURL=13.ff5db6c8.chunk.js.map