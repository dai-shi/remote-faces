(this["webpackJsonpremote-faces-web"]=this["webpackJsonpremote-faces-web"]||[]).push([[14],{1245:function(t,e,n){},1256:function(t,e,n){"use strict";n.r(e),n.d(e,"GoBoard",(function(){return f}));var o=n(5),r=n(0),i=n.n(r),a=n(522),c=(n(1245),n(108)),u=n(125),s=function(t){return Object(c.c)(t)&&function(t){return["play","pass","undo"].indexOf(t)>=0}(t.action)&&"number"===typeof t.updatedAt&&function(t){try{var e=t;return"number"===typeof e.size&&(e.grid.length===e.size*e.size&&(!e.grid.some((function(t){return t!==a.Color.B&&t!==a.Color.W&&t!==a.Color.E}))&&("number"===typeof e.capCount.black&&"number"===typeof e.capCount.white&&(e.turn===a.Color.B||e.turn===a.Color.W))))}catch(n){return!1}}(t.position)},l=function(t,e,n){var o=Object(r.useRef)(),i=Object(u.a)(t,e),a=Object(r.useCallback)((function(t,e){var n={action:t,position:e,updatedAt:Date.now()};i({goBoard:"action",actionData:n}),o.current=n}),[i]);return Object(u.b)(t,e,Object(r.useCallback)((function(t){var e;if(e=t,Object(c.c)(e)&&("init"===e.goBoard||"action"===e.goBoard&&s(e.actionData)))if("init"!==t.goBoard){var r=t.actionData;o.current&&o.current.updatedAt>r.updatedAt||(o.current=r,n(r.action,r.position))}else o.current&&i({goBoard:"action",actionData:o.current})}),[i,n])),Object(r.useEffect)((function(){i({goBoard:"init"})}),[i]),{sendActionData:a}},d=function(t,e,n,o){var r=new a.Game(6),i=new a.CanvasBoard(t,{theme:a.themes.modernTheme,width:t.clientWidth/2,size:6}),c=[],u=null,s=function(){c=c.filter((function(t){return r.getStone(t.x,t.y)===("B"===t.type?a.Color.B:a.Color.W)||(i.removeObject(t),!1)})),u&&i.removeObject(u),u=null;for(var t=function(t){for(var e=function(e){var n=r.position.get(t,e);if(n&&!c.some((function(o){return o.x===t&&o.y===e&&n===("B"===o.type?a.Color.B:a.Color.W)}))){var o=new a.FieldObject(n===a.Color.B?"B":"W",t,e);i.addObject(o),c.push(o),null===u?(u=new a.BoardMarkupObject("SQ",t,e,n),i.addObject(u)):u&&(i.removeObject(u),u=!1)}},n=0;n<r.position.size;n+=1)e(n)},e=0;e<r.position.size;e+=1)t(e)},l=null,d=function(){l&&(i.removeObject(l),l=null)};i.on("mousemove",(function(t,e){if(e&&r.isValid(e.x,e.y)){if(l){if(l.x===e.x&&l.y===e.y)return;i.removeObject(l)}else l=new a.FieldObject(r.turn===a.Color.B?"B":"W");l.setPosition(e.x,e.y),i.addObject(l)}else d()})),i.on("mouseout",d),i.on("click",(function(t,i){var c=i.x,u=i.y;r.isValid(c,u)&&(d(),r.play(c,u),s(),e(r.turn===a.Color.B?"black":"white"),n(r.position.capCount),o("play",r.position))})),e(r.turn===a.Color.B?"black":"white");return{receiveData:function(t,o){var i=function(t){var e=new a.Position(t.size);return e.grid=t.grid,e.capCount=t.capCount,e.turn=t.turn,e}(o);r.pushPosition(i),s(),e(r.turn===a.Color.B?"black":"white"),n(r.position.capCount),d()},pass:function(){r.pass(),e(r.turn===a.Color.B?"black":"white"),o("pass",r.position)},undo:function(){r.popPosition(),s(),e(r.turn===a.Color.B?"black":"white"),n(r.position.capCount),o("undo",r.position)},resize:function(){i.setWidth(t.clientWidth/2)}}},f=i.a.memo((function(t){var e=t.roomId,n=t.userId,a=Object(r.useRef)(),c=Object(r.useCallback)((function(t,e){a.current&&a.current.receiveData(t,e)}),[]),u=l(e,n,c).sendActionData,s=Object(r.useState)("black"),f=Object(o.a)(s,2),b=f[0],p=f[1],m=Object(r.useState)({black:0,white:0}),v=Object(o.a)(m,2),C=v[0],B=v[1],O=Object(r.useRef)(null);Object(r.useEffect)((function(){if(O.current){var t=O.current,e=d(t,p,B,u);return a.current=e,window.addEventListener("resize",e.resize),function(){window.removeEventListener("resize",e.resize)}}}),[u]);return i.a.createElement("div",{className:"GoBoard-container"},i.a.createElement("div",{className:"GoBoard-toolbar"},"Next Turn: ","black"===b?"Black":"White",i.a.createElement("button",{type:"button",onClick:function(){a.current&&a.current.pass()}},"Pass"),i.a.createElement("button",{type:"button",onClick:function(){a.current&&a.current.undo()}},"Undo"),i.a.createElement("div",null,"Capture Count: Black ",C.black,", White ",C.white)),i.a.createElement("div",{className:"GoBoard-canvas",ref:O}))}));e.default=f}}]);
//# sourceMappingURL=14.299755e3.chunk.js.map