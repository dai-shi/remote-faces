import { RegionData } from "../hooks/useGatherArea";

const createMeeting = (
  i: number,
  x: number,
  y: number,
  w: number,
  h: number
) => ({
  [`meeting${i}`]: {
    type: "meeting",
    position: [x, y],
    size: [w, h],
    zIndex: 0,
    background: "",
    border: "",
    iframe: "",
  },
});

const createGoBoard = (i: number, x: number, y: number) => ({
  [`gomeeting${i}`]: {
    type: "meeting",
    position: [x, y],
    size: [250, 150],
    zIndex: 0,
    background: "",
    border: "",
    iframe: "",
  },
  [`gobard${i}`]: {
    type: "goboard",
    position: [x, y],
    size: [250, 150],
    zIndex: 0,
    background: "rgba(140, 140, 140, 0.2)",
    border: "",
    iframe: "",
  },
});

const intro: Record<string, RegionData> = {
  background: {
    type: "default",
    position: [36, 36],
    size: [800, 500],
    zIndex: -100,
    background:
      "url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDY2Ny4yOTIyOTgzMDU3OTI3IDQxOC4xNDczNjEzODYyNzcyIiB3aWR0aD0iMTMzNC41ODQ1OTY2MTE1ODUzIiBoZWlnaHQ9IjgzNi4yOTQ3MjI3NzI1NTQ1Ij4KICA8IS0tIHN2Zy1zb3VyY2U6ZXhjYWxpZHJhdyAtLT4KICAKICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgQGZvbnQtZmFjZSB7CiAgICAgICAgZm9udC1mYW1pbHk6ICJWaXJnaWwiOwogICAgICAgIHNyYzogdXJsKCJodHRwczovL2V4Y2FsaWRyYXcuY29tL1ZpcmdpbC53b2ZmMiIpOwogICAgICB9CiAgICAgIEBmb250LWZhY2UgewogICAgICAgIGZvbnQtZmFtaWx5OiAiQ2FzY2FkaWEiOwogICAgICAgIHNyYzogdXJsKCJodHRwczovL2V4Y2FsaWRyYXcuY29tL0Nhc2NhZGlhLndvZmYyIik7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSI2NjcuMjkyMjk4MzA1NzkyNyIgaGVpZ2h0PSI0MTguMTQ3MzYxMzg2Mjc3MiIgZmlsbD0iI2ZmZmZmZiI+PC9yZWN0PjxnPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUzLjQ5Nzc3MzUzMDI3OTc0NCAyMDMuNDAxNzY0NDE1NzM2MjQpIHJvdGF0ZSgwIC0xOS42MDg3MTQwNDM1Njc1NDUgLTI1LjY3MDMzNTAxNDg0OTk2OCkiPjxwYXRoIGQ9Ik0wLjA0MDc4OTI4NTY3NDY5MTIgMC45Mzk2MDg4MDMwMTg5Mjc0IEMtNi4zODU5NzU3NzkzNTIyODkgLTcuODM1OTk0ODM4NjU1MDIwNCwgLTMxLjkzNzUxNjQ0NjY5ODIxIC00My40NTIxNDcxOTExNjcsIC0zOC42NTQ4NTA0MzU2NzUzODUgLTUyLjI4MDI3ODgzMjcxODg4IE0tMS4zOTY5MzUwNjg2ODU1NjE1IDAuMzg3Mjk5NDc5MjY0NzY2MTYgQy03LjkxNjAyNzI0NzQ2MDEzNjUgLTguMjcwNDExODcyNjUxNDUsIC0zMy4xNzk2MDIyNzkxNDg3NDYgLTQyLjUxNzM2NTQxMTEyODk3LCAtMzkuMjU4MjE3MzcyODA5Nzk2IC01MS4wNjU3MDEyNDgwNjEwNiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIj48L3BhdGg+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUzLjQ5Nzc3MzUzMDI3OTc0NCAyMDMuNDAxNzY0NDE1NzM2MjQpIHJvdGF0ZSgwIC0xOS42MDg3MTQwNDM1Njc1NDUgLTI1LjY3MDMzNTAxNDg0OTk2OCkiPjxwYXRoIGQ9Ik0tMTIuODE5NTU5MjAxNTg1NTczIC0zMy4xOTc5NDQ4NTk4MDkxMyBDLTIyLjcyOTA5MTEzNzk5NDczIC00MC43NzA0MDI4NDQ1NjY0NiwgLTI5LjU3NzAxMzE2ODExNjA3IC00NC40MzUyOTM5NjAyODc3OSwgLTQxLjE3OTY5NDcyNjAxMDExIC01MC42OTkwMTc1ODA1MzU0MSBNLTE0LjgzMjg2MTc1NzgyNDY0MiAtMzMuMzI1NjM3MDc1ODg1MDggQy0yMy4wOTQ1OTE4MzE5MjYwOTUgLTM5LjQ0ODUwODEzMzYwMzIzLCAtMjkuNDgyNTU4MTQwMzcxMTc1IC00NS4xNjMzNTk5OTQ5MDM5MywgLTM4LjU0OTkxMTY1MzUwMTI0IC01MC40NDAzMjQ1MDQ3OTY1NjQiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSI+PC9wYXRoPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1My40OTc3NzM1MzAyNzk3NDQgMjAzLjQwMTc2NDQxNTczNjI0KSByb3RhdGUoMCAtMTkuNjA4NzE0MDQzNTY3NTQ1IC0yNS42NzAzMzUwMTQ4NDk5NjgpIj48cGF0aCBkPSJNLTI5LjQyMDQ3NTMwMjAzMDM1OCAtMjEuMTM0MzgwNDE5MjM3MTU0IEMtMzQuNTE3NjY0NzMwMTM4MzY0IC0zMi4yMzY3OTEyMjA5NzQ4MSwgLTM2LjUxNTcxMjE4OTA1OTA5NCAtMzkuNDI1OTkyMzI0NDMyNDM2LCAtNDEuMTc5Njk0NzI2MDEwMTEgLTUwLjY5OTAxNzU4MDUzNTQxIE0tMzEuNDMzNzc3ODU4MjY5NDI2IC0yMS4yNjIwNzI2MzUzMTMxMSBDLTM0LjY3MzY3MzM5NDc0NDQ1IC0zMS4xMTQxMTM5MjIyMzUwMDYsIC0zNS45MjU4ODQ3MzQ2NzkxNDQgLTQwLjU2MTAxOTUyMzE0NTQ1NCwgLTM4LjU0OTkxMTY1MzUwMTI0IC01MC40NDAzMjQ1MDQ3OTY1NjQiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSI+PC9wYXRoPjwvZz48L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDguNTA3MTUxMDU3MjU0MzA1IDIwNy4wODIxNjEzODY5ODAyNikgcm90YXRlKDAgMjYuODczNjY2OTA1NTM0NjM0IDcuNjMwNzk0MzA2NTA5ODQxKSI+PHRleHQgeD0iMCIgeT0iMTIuMjYxNTg4NjEzMDE5NjgiIGZvbnQtZmFtaWx5PSJIZWx2ZXRpY2EsIFNlZ29lIFVJIEVtb2ppIiBmb250LXNpemU9IjEzLjI3MDk0NjYyMDAxNzA5MnB4IiBmaWxsPSJibGFjayIgdGV4dC1hbmNob3I9InN0YXJ0IiBzdHlsZT0id2hpdGUtc3BhY2U6IHByZTsiIGRpcmVjdGlvbj0ibHRyIj5GYWNlIExpc3Q8L3RleHQ+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEwIDEwKSByb3RhdGUoMCA5MS45NTMyMDg4MTIzODY0OSA2Mi4xODA5MDgwMjEzMTE4MzYpIj48cGF0aCBkPSJNMzEuMDkwNDU0MDEwNjU1OTE1IDAgTTMxLjA5MDQ1NDAxMDY1NTkxNSAwIEM2MS4wMjY0NzI3NDM3Nzc3NDUgMCwgOTAuOTYyNDkxNDc2ODk5NTcgMCwgMTUyLjgxNTk2MzYxNDExNzEgMCBNMTUyLjgxNTk2MzYxNDExNzEgMCBDMTczLjU0MjkzMjk1NDU1NDM3IDAsIDE4My45MDY0MTc2MjQ3NzMgMTAuMzYzNDg0NjcwMjE4NjQsIDE4My45MDY0MTc2MjQ3NzMgMzEuMDkwNDU0MDEwNjU1OTE1IE0xODMuOTA2NDE3NjI0NzczIDMxLjA5MDQ1NDAxMDY1NTkxNSBDMTgzLjkwNjQxNzYyNDc3MyA1Mi42MjY4Mjg3MDA3OTU0MTQsIDE4My45MDY0MTc2MjQ3NzMgNzQuMTYzMjAzMzkwOTM0OTIsIDE4My45MDY0MTc2MjQ3NzMgOTMuMjcxMzYyMDMxOTY3NzQgTTE4My45MDY0MTc2MjQ3NzMgOTMuMjcxMzYyMDMxOTY3NzQgQzE4My45MDY0MTc2MjQ3NzMgMTEzLjk5ODMzMTM3MjQwNTAyLCAxNzMuNTQyOTMyOTU0NTU0MzcgMTI0LjM2MTgxNjA0MjYyMzY2LCAxNTIuODE1OTYzNjE0MTE3MSAxMjQuMzYxODE2MDQyNjIzNjYgTTE1Mi44MTU5NjM2MTQxMTcxIDEyNC4zNjE4MTYwNDI2MjM2NiBDMTIyLjM4MTg1MjIwNjMxMjg2IDEyNC4zNjE4MTYwNDI2MjM2NiwgOTEuOTQ3NzQwNzk4NTA4NiAxMjQuMzYxODE2MDQyNjIzNjYsIDMxLjA5MDQ1NDAxMDY1NTkxNSAxMjQuMzYxODE2MDQyNjIzNjYgTTMxLjA5MDQ1NDAxMDY1NTkxNSAxMjQuMzYxODE2MDQyNjIzNjYgQzEwLjM2MzQ4NDY3MDIxODY0IDEyNC4zNjE4MTYwNDI2MjM2NiwgMCAxMTMuOTk4MzMxMzcyNDA1MDIsIDAgOTMuMjcxMzYyMDMxOTY3NzQgTTAgOTMuMjcxMzYyMDMxOTY3NzQgQzAgNjguNzAxMDc4NjE1NDc1NTQsIDAgNDQuMTMwNzk1MTk4OTgzMzM2LCAwIDMxLjA5MDQ1NDAxMDY1NTkxNSBNMCAzMS4wOTA0NTQwMTA2NTU5MTUgQzAgMTAuMzYzNDg0NjcwMjE4NjQsIDEwLjM2MzQ4NDY3MDIxODY0IDAsIDMxLjA5MDQ1NDAxMDY1NTkxNSAwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIgc3Ryb2tlLWRhc2hhcnJheT0iMyA2Ij48L3BhdGg+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyMS44NDU1MTM2Mjc3NzM1OCAyMS40NjQ0OTk0NDQxMDQ5NDUpIHJvdGF0ZSgwIDMwLjg1NDk1MDg5MTUzOTc3MiA3LjYzMDc5NDMwNjUwOTg0MSkiPjx0ZXh0IHg9IjAiIHk9IjEyLjI2MTU4ODYxMzAxOTY4IiBmb250LWZhbWlseT0iSGVsdmV0aWNhLCBTZWdvZSBVSSBFbW9qaSIgZm9udC1zaXplPSIxMy4yNzA5NDY2MjAwMTcwOThweCIgZmlsbD0iYmxhY2siIHRleHQtYW5jaG9yPSJzdGFydCIgc3R5bGU9IndoaXRlLXNwYWNlOiBwcmU7IiBkaXJlY3Rpb249Imx0ciI+RW50cnkgQXJlYTwvdGV4dD48L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjUuOTEzMzg0ODEwNzE0ODkgMTM5LjEwNzQyODcwODQyNTgpIHJvdGF0ZSgwIDU5IDYpIj48dGV4dCB4PSIwIiB5PSIxMCIgZm9udC1mYW1pbHk9IkhlbHZldGljYSwgU2Vnb2UgVUkgRW1vamkiIGZvbnQtc2l6ZT0iMTAuNjE2NzU3Mjk2MDEzNjgxcHgiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHN0eWxlPSJ3aGl0ZS1zcGFjZTogcHJlOyIgZGlyZWN0aW9uPSJsdHIiPllvdSBjYW4gZHJhZyB5b3VyIGF2YXRhcjwvdGV4dD48L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjgwLjMxMjEzNTA1NjYwNzMgMzEuMjA4NDk0OTIwNTQxMTE0KSByb3RhdGUoMCA4NC4xOTkyMzE1Mzg2NjEyNSA1NS4yNTA2ODMyMzI4NjgwODQpIj48cGF0aCBkPSJNMC45NjU4MTM2NDIzNjc3MjA2IDAuNzkwMzMwNzMyMjQxMjcyOSBDNTkuOTI2MDgxODMzNzkyOTcgLTIuNTQwMDEwMzg1OTkwNzcwNiwgMTI0LjAzNTUyNTY2OTEzOTEyIC0xLjM3OTY0NTEwMjUwMTU0MzMsIDE2OC42ODM5NzY0MjQzMzczMiAtMS45ODUyMjYyNDkzMjIyOTUyIE0wLjA5NTA2MDI0MTQwODY0NjEgMC42NTI5MTMwMzY3NTYyMTc1IEM0NC4wNzQ5MTU2NTcwMzQ3NCAyLjI3MDc5MDQ0NjA5MDQyMDUsIDg2Ljk2ODg0NTk3MDQyNjk0IDEuNzY0MTc0NzE3OTUwNTQzMSwgMTY3LjkwMDA1OTIxMjQwOTg0IC0wLjQ1Mjk2MzIwMDM5Nzc4OTUgTTE2OC43MjgyNDgzNzAyOTA3IC0wLjkzNDEyMzEzNDI0MDUwODEgQzE2OC44ODkzMDA0MDE1ODA4NCAyMi41NjAxOTg5NDg1NDU2NDcsIDE2Ni4xOTM3ODU1NDM4MTE4MyA0NS42MTAzMzE5NTk2NzY1MywgMTY2LjQ5ODk0MjU2NjUxNDkgMTEwLjc0Njc4OTI3MDQ2NDMyIE0xNjcuNzg0NjI3MTg4NDA3NzcgLTAuNDcyMTkzODA0NTY5NTQyNCBDMTcwLjE2ODc0NzEyNTkzMjYgMjYuNDEwNDYzNzc4OTc1NzksIDE3MC4xNjQ0MTEzMzUwNjAwNCA1My42NjEwNzQ2NjI5OTcxOTQsIDE2OC41OTY0MTgzOTk3NzQ0MiAxMTAuMDAyNzM2NTQwODk0OTQgTTE2Ny42NTcyNDM0NDMxMzIzMyAxMTEuMDg4NDA0NDcwNTA3MDQgQzEwOC4wOTg4Njc4ODk0NjMyOSAxMTIuMjIzNzg5NzU4MzMzMzcsIDQ1LjEwOTQ2Nzc4NDQwMjY1IDExMy4wMzI5NTQ5MzgwNjI4MywgLTEuNjU0MzU3NjA2NTQ1MDkwNyAxMDkuMDA1MzQwOTI3NjY0MTggTTE2Ny40NDc3NzU2MjEzNzc4MiAxMDkuODY3MTgwNTU4MzA1MjIgQzEwNS43MTM1NTA4NTIyNzQ1NSAxMTAuOTMwNDI4ODY4NjYzMTYsIDQ0LjQ2MTgyMTM5MTA5MzYzNiAxMTEuNTU5NzcwODU4NDE4NzksIDAuODI0NDk1MDU5NDM4MDQ5OCAxMDkuNzAyMzgwNTk5ODM3NzQgTTEuMzcwNDEzNjA2OTg2NDAzNSAxMDkuNzM2NTg5MzA2NDE3ODQgQy0wLjk1ODA3OTU0MjQxNzAyMDUgNzYuMDExNzIyMjI5ODc4MzIsIC0xLjY2OTM5ODY5MDk1NzUxNzQgNDEuMDgxMDY5NDAxOTk2MDIsIDEuNTM1MTAxMTgwODk2MTYzIDAuODY5MTAzMDM4NjgzNTMzNyBNLTAuNzM3NDg1NDI2NDc4MDg3OSAxMTEuMzQyMzQ0OTQxOTU1MDUgQzAuMDAwNDM3MDA0Njg0Nzk5OTAyMDcgNzQuMjg0NjkzMTg4MTU4MzcsIC0xLjY5NDE0NzI3NTU2NzY1NjggMzkuMjQ0MzQ3NzYyMTgxNTMsIDAuODc2NjA3MTkxNzQ4OTE3MSAwLjcwNTc1MjkxMTk3NzQ2OTkiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSI+PC9wYXRoPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNTQuNjU5NDg1ODA1NzkyNjYgMTIuMDQ4MzI5Mjg0ODcxMDQ1KSByb3RhdGUoMCA0NC41IDcuNSkiPjx0ZXh0IHg9IjAiIHk9IjEyIiBmb250LWZhbWlseT0iSGVsdmV0aWNhLCBTZWdvZSBVSSBFbW9qaSIgZm9udC1zaXplPSIxMy4yNzA5NDY2MjAwMTcxMXB4IiBmaWxsPSJibGFjayIgdGV4dC1hbmNob3I9InN0YXJ0IiBzdHlsZT0id2hpdGUtc3BhY2U6IHByZTsiIGRpcmVjdGlvbj0ibHRyIj5NZWV0aW5nIEFyZWEgMTwvdGV4dD48L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDc1LjAzODY5NzU1NjYwNzMgMzEuOTg5NzQ0OTIwNTQxMTE0KSByb3RhdGUoMCA4NC4xOTkyMzE1Mzg2NjEyNSA1NS4yNTA2ODMyMzI4NjgwODQpIj48cGF0aCBkPSJNMC4zOTU5MTA2NDQ5MDM3NzkwMyAtMC45OTcyNTk4NDk2ODI0NTAzIEM0OS41NDc4MTEzMzM3Nzk3OSAtMi42NDQ4MTQ3MzMxMjI5NTA2LCA5OC4xNDc2MTI3OTQ3NTA1MyAtMS43MDc3MDk3MzMxMDM4NzcsIDE2OC45ODU1MDEwODIwOTM0IDAuOTExNTI4Mjk0OTA2MDIwMiBNLTAuODI3MTc4ODAzMjcyNTQ1MyAtMC43NDgwMTI3NjkwMzU5OTUgQzU0LjQxNDI5ODUwNjE3MDU4IC0xLjg2NzE2Nzk0ODg3NjY3NDQsIDEwOC4wNTAzNDA0NDQyMTQ3OCAtMS45NTM5MTE2OTExMDQyMjg3LCAxNjcuNzY0Mjc3MTY5ODkxNTkgLTAuNzg3OTM3NTk5MjM0MjgzIE0xNzAuMDQ3NDUzMTk2MTk4NjMgLTEuNTk3OTcxNzMxNzk2ODYwNyBDMTY4LjU0NzMyMDQyMDk4MjA2IDI3Ljk1MjgxNjAwNDQ4NDI2LCAxNjcuNTk1MjA5MzU1NTk0MzMgNTUuODI4NzQzNzQwMTU1MDI2LCAxNjcuNjMzNjg1OTE4MDA0MiAxMDkuOTQzMTA5MDEwNzI5OTMgTTE2OS4xNjYwMTM2Njc3NzA2IDAuNDM0NTUxNTE5MzQxNzY2ODMgQzE2Ny45MzM0MDM0NzYxMjUxNiAzNS44OTcxOTM3MjM3NjQzOSwgMTY3Ljg0MjY3NTU4MDYyNjkgNjkuNDc5Mzg1Njc5NDY4NzUsIDE2OS4yMzk0NDE1NTM1NDE0IDExMS4zNzMzOTIwMjcyNTUxNCBNMTcwLjE1MTY3NzQ2MDgyMDM3IDExMS45MTI4NzIyODk2OTExMSBDMTI0LjMyMzg2MTkwNjM1OTYxIDExMS4yNjAyMzI3NTAwNzI3MywgODEuNjUxMTAwNDQ0MzA2MDggMTExLjc3MjIzMTcwMTUwNzgyLCAxLjY5ODQ4MDY4OTg5ODEzMzMgMTA5Ljg2Mjc0ODUzODUyNzYzIE0xNjguOTc3MjQ1MjUxMTI3NDcgMTEwLjg5NTY3ODIwMzkzNjY1IEMxMDYuOTczNTU2MDAyMTU1MzYgMTA4LjcyMDc4NTYzMTcwNDk0LCA0Ni4wMjk0MDk0MDkxMjgwOSAxMDkuMTUzMzI3MDkxNTAzNzUsIC0wLjY2NjYwNDIxODA3MzE4OTMgMTEwLjg0OTE1NTg1NDgxNzQ3IE0tMS45OTM5OTIyNDQ4MjQ3NjcxIDExMC41MDE3MTY1Mjk0MDI4NyBDMS43OTI3ODk2MTkxNDA0NzU3IDc1LjQzOTcxMTg2MzkxMTkxLCAwLjk4OTIzNDMwOTM2Nzk4NDQgNDAuMzA2MjQwNzUyNDk4MSwgMS41MzQwMDE0OTM4MjY1MDg1IC0wLjIxMzg5MTUwMDYwNzEzMjkgTS0wLjY5MzA3NTExNzY1NTA5ODQgMTExLjA3MjM2MjEzNjQ3OTQ2IEMwLjAyNjEwNjAyNDQ1MjQ0MzU4OCA4MC43ODcwMTA1NTUxNTE4LCAtMS4yNzgxNTE0NTc4Mzc4MjQ0IDUyLjAwNDA4MjI2MDI2MjEyLCAtMC42MDIwMzI4NjcyNjAyNzczIC0wLjcyODUzNTUyMDg0NDE2MTUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSI+PC9wYXRoPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1NDkuODA3OTIzMzA1NzkyNyAxMS42NjE2MTA1MzQ4NzEwNDUpIHJvdGF0ZSgwIDQ0LjUgNy41KSI+PHRleHQgeD0iMCIgeT0iMTIiIGZvbnQtZmFtaWx5PSJIZWx2ZXRpY2EsIFNlZ29lIFVJIEVtb2ppIiBmb250LXNpemU9IjEzLjI3MDk0NjYyMDAxNzExcHgiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHN0eWxlPSJ3aGl0ZS1zcGFjZTogcHJlOyIgZGlyZWN0aW9uPSJsdHIiPk1lZXRpbmcgQXJlYSAyPC90ZXh0PjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyOTMuMjM3OTE2MzA2NjA3MyAyMjkuMTEwODM4NjcwNTQxMSkgcm90YXRlKDAgMTc3LjY4OTQ2NTkxMzY2MTI1IDg5LjUxODI2MTM1Nzg2ODA2KSI+PHBhdGggZD0iTS0wLjU5MzUyMzcxOTEwNjI2NiAtMC4zNjYwNzgxMzM1MDc5MTI3NCBDODkuNzQ2Nzg5MTQ4NjQ0NzUgMC45MDk2ODU1MTA4ODEwNTA0LCAxNzguNzIxNTM1NjM2MDMzMiAwLjQzMDgxOTU0OTQ1NjcxMjg2LCAzNTUuNDk0NjU0NTY2OTA0IC0wLjgwMjUwMDk0NzMwMTI3ODIgTS0wLjUyNDE2Nzc4NjI0ODIyMjQgMC4yNzI3NTA2OTg1MTYyNzM4IEMxNDEuMzU0MDExMzUyNDM0NzggMC41NzQ1MjE2NDkwODMxNTQ3LCAyODIuNzQxMjAwODQ3MDIxODQgLTAuMDc1OTYwMzk0MTU3Njg4NDYsIDM1NS41NDU1OTkwMjYxNDY3NiAtMC40OTM5OTc1NDc1MDg2NDQxNiBNMzU3LjE4NzE0MTUwOTIwNTk2IDAuMDg5NTU0MTk2MjIzNjE2NiBDMzUzLjU4ODY4NTY2NjY4MDMgNjAuOTYwNDM3Mjg5MjU3ODEsIDM1NS4zNDAwNzE1MzQyNzYgMTI0LjA1MDE5ODE3NDY1MDQsIDM1Ny4yMDIyMjQ0MDQ5NjE3IDE3OS4xOTI1Mzc5Mzg2MjgzIE0zNTQuNTcxNDIzMDkzMjY3NjQgMC43NDU4OTg0Mzc2ODYyNjQ1IEMzNTQuMTkxNTA5OTM5MDY4NyA0NC41NjcxODg3MDAzNjQwMSwgMzU0LjQwMDc4MjIzNDMwNTI3IDg5LjIwNjE3OTM0OTA4OTExLCAzNTYuMjc2Mjk2ODYzNzQzIDE3OS43NDQxOTU3NzA4NTU5NSBNMzU2LjMwNTUzMDUxNTM2ODEgMTc4LjcxMTQ5MDQ2NDIwODMgQzI0NC45MDc2MTgzOTU3MzgyNCAxNzguNzQwMzE2Mzg5MTY1NDMsIDEzNS4yMDM5MzYxODk5ODQ1MiAxNzguNTkyNDcxMTExNTc3MiwgMC41NzUzNzQ0NjQ0MjM2ODA4IDE4MC4xOTIwNTQzODI3MTUyNyBNMzU1LjE0NDkwODA1Njc5NzkzIDE3OS4yNTQ1OTQ0MTE0Njk0NyBDMjUyLjkwNTc2NzY2NjE2Mzc0IDE4MC42MDg1ODg1OTkxNzcsIDE0OS42NzkyMDgwODA1MTE4IDE4MS4zNjMyMDE2NjI1NTg3NCwgLTAuNDYwMDQ4MTI4MjE4MDk2NSAxNzguNDU1MzMxNDI4NTAwMjQgTTAuNzY5OTA2NDI1ODQ4NjAzMiAxNzkuMTg5NjA0ODUzNjYzNTUgQzAuNTQzOTkwMDA5OTg2MDk0NiAxMjMuODQ4MjQ5Nzk4MTM0MTMsIC0wLjUwMzQ1NjA2MjExNTQ5ODQgNjYuMjAwMjU5ODM5NjUwNiwgLTAuMjQwNDEyNzQ3NDg3NDI1OCAtMC45NjM3MzM5NjU1MzA5OTE2IE0wLjg4ODYwMTkzMTc0MzMyMzggMTc4Ljc0MDM2OTg5NzcxOTQzIEMxLjMxNzU2MjMzNDk0NzU1MDcgMTI4Ljc0MzMxMzY0MjcwMzE2LCAxLjI1MjgxOTIwMzU0ODM5NiA3OS40MTc1MzQ0MzM4OTA1MSwgLTAuNTA3ODY3NDUyNjg4NTE1MiAwLjczMDE5MTI3MjY4MzQ0MTYiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSI+PC9wYXRoPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNjEuNTQ2MjA0NTU1NzkyNjYgMTUxLjM3MjU0ODAzNDg3MTA0KSByb3RhdGUoMCAxOTcuODczMDQ2ODc1IDYuNTAyODcwMDg1MDkzODg5KSI+PHRleHQgeD0iMCIgeT0iMTAuMDA1NzQwMTcwMTg3Nzk0IiBmb250LWZhbWlseT0iSGVsdmV0aWNhLCBTZWdvZSBVSSBFbW9qaSIgZm9udC1zaXplPSIxMC44ODA1MTA4MDI4MDg3MjRweCIgZmlsbD0iYmxhY2siIHRleHQtYW5jaG9yPSJzdGFydCIgc3R5bGU9IndoaXRlLXNwYWNlOiBwcmU7IiBkaXJlY3Rpb249Imx0ciI+RHJhZyB5b3UgYXZhdGFyIGludG8gYSBtZWV0aW5nIGFyZWEgYW5kIHlvdSBjYW4gdGFsayB3aXRoIG90aGVycyBpbiB0aGUgc2FtZSBhcmVhPC90ZXh0PjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1ODEuMDMwNTc5NTU1NzkyNyAyMDYuMjQzNjQxNzg0ODcxMDQpIHJvdGF0ZSgwIDI5LjUgNy41KSI+PHRleHQgeD0iMCIgeT0iMTIiIGZvbnQtZmFtaWx5PSJIZWx2ZXRpY2EsIFNlZ29lIFVJIEVtb2ppIiBmb250LXNpemU9IjEzLjI3MDk0NjYyMDAxNzExcHgiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHN0eWxlPSJ3aGl0ZS1zcGFjZTogcHJlOyIgZGlyZWN0aW9uPSJsdHIiPkNoYXQgQXJlYTwvdGV4dD48L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQuNjMyNDQ3NTU2NjA3MzAzIDI1My41NjM5NjM2NzA1NDExKSByb3RhdGUoMCAxMTYuMjU1ODcyMTYzNjYxMjUgNzYuOTU3NzE0NDgyODY4MDYpIj48cGF0aCBkPSJNMS4xMzg4NTQxNzQyNTE2MjE2IDEuMDkwMzgyOTA5MDMzODU4NCBDNTcuODAwMDQ1MDg4OTY3MzggLTIuOTg2OTUwOTgwMDcxMjU5LCAxMTguNTY3NzA5MzQwMzk2NjggLTIuNzQ1NTE2MzE5NTY3MzYyNiwgMjMzLjAzNDkyMDQwODQ3NTIgLTAuODYwNDQzODk4MjY1MjQyMyBNLTAuMzg4NjE3MjcwMzg0NTM3NzUgMC41MzIwOTc5MDI3Mjg5MDc2IEM3My4yNjc5NTc3ODIxNTg1NSAwLjU2NTUyMzg3OTk0NzI3NTYsIDE0Ni4xODk4NTE1NjY0ODE5IDEuMzg0NDA0NjM0NzM3NjA3MywgMjMyLjExODExNjI2OTMwOTM1IDAuNTUwNDI3NzA0NzE0MTAzOCBNMjM0LjMyMjI5MTE0ODMwNTggMC45MDU1OTU2ODQ0MjQwNDI3IEMyMzEuOTQxNzIwMDI1MDM1NCA0OC45MTEwMjMxMjI1NDg2MiwgMjM1LjAwNzM0NDA4MzI4MjAyIDEwMC40NjkzMzE4MDE1MTc5MiwgMjMzLjc4MjY1MjA5MjU3Njg4IDE1My45MDQxNjU1NTk4MzE5NCBNMjMxLjYyMDczMTEwNDU3NTk1IC0wLjA5OTI3NTE5ODc2NTA5OTA1IEMyMzMuMDM5NjcyODQyMTU3NTYgNDguMTE5NDM3ODI5Njc2NCwgMjMyLjY5OTQ0NTMyNzY1MjE3IDk3LjUxMjI1NjUwMjM0Mzk3LCAyMzIuOTcxNzIyMTQ1MDQ0MTcgMTUzLjUwNDY2ODIwODIyMjc3IE0yMzMuMjE3NzQxOTI4MjM3NDQgMTU0LjgxOTg4MDU1MTY4MjEzIEMxNTguMzA2MzgxNzk2ODY0IDE1NC42NDYzMzQ0MDcxMzQ2NywgODMuNTc0Nzc2MTMxODI5NSAxNTMuNzE2ODYzNzYzODUyODQsIC0xLjAwMDI5OTg2NjM0MDg3NjYgMTUyLjUyNDcyMTgzMzYwNTcyIE0yMzIuMTM5Mzg2NTg5MDQwMiAxNTQuNDI0MzgyOTg4ODk2NyBDMTUyLjU2NjcyMTMwNjMzNzY4IDE1NC45MDI5MTczMjUwNTY1NiwgNzQuMDM1MjQxMTg1MzU0NjggMTU0LjExOTYxNzI0MzMzMTAyLCAtMC41NTcwMTk3NDcyMDI5MDczIDE1My40NzAyNzgzNDQ2MDEyIE0tMS4yNDQ1ODkwMjUxNTQ3MDk4IDE1Mi4zNTg1OTU3MjI3Mzg1OCBDLTMuMDgxNzg3MDM3Nzk3NTExIDEwNC44NjgxNTc5NTc3ODc4NiwgLTIuNDA1MDE0MTQ1MzIyMzgzIDU3LjIzMTUwNDc1Mzk5NDM2LCAxLjQ5MDYyNDY3MTgwMTkyNDcgMS45NDM1MzI1NTA3MDc0NTk0IE0tMC4wMzg1NTgwMjM5ODE3NTAwMSAxNTQuNjgxMDUzMzQyNjgxMyBDMC40OTg0MjQ1ODc0MjE1MDMyIDEwNi4yMzM5OTIzNDgwODk1NCwgMC40NTEzNDcwMjEwMzYyMzQwMyA1Ny41NzkxNDAwMjUwNjc1OSwgLTAuOTM1MDcwMjY0MTUzMTgyNSAtMC43NzY3MjA5MzgyNzI3NzQyIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjwvcGF0aD48L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTEyLjk4MzcwNDU1NTc5MjY2IDIzMC4wODM0ODU1MzQ4NzEwNCkgcm90YXRlKDAgNzEgNy41KSI+PHRleHQgeD0iMCIgeT0iMTIiIGZvbnQtZmFtaWx5PSJIZWx2ZXRpY2EsIFNlZ29lIFVJIEVtb2ppIiBmb250LXNpemU9IjEzLjI3MDk0NjYyMDAxNzExcHgiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHN0eWxlPSJ3aGl0ZS1zcGFjZTogcHJlOyIgZGlyZWN0aW9uPSJsdHIiPlZpZGUvU2NyZWVuIFNoYXJlIEFyZWE8L3RleHQ+PC9nPjwvc3ZnPg==) left top / contain no-repeat",
    border: "",
    iframe: "",
  },
  chat: {
    type: "chat",
    position: [392, 313],
    size: [415, 208],
    zIndex: 0,
    background: "rgba(135, 206, 235, 0.2)",
    border: "",
    iframe: "",
  },
  ...createMeeting(1, 382, 82, 180, 115),
  ...createMeeting(2, 614, 82, 180, 115),
  share: {
    type: "media",
    position: [69, 343],
    size: [272, 177],
    zIndex: 0,
    background: "rgba(0, 240, 0, 0.2)",
    border: "",
    iframe: "",
  },
};

const phone: Record<string, RegionData> = {
  ...createMeeting(0, 45, 40, 45, 500),
  share: {
    type: "media",
    position: [100, 40],
    size: [1000, 500],
    zIndex: 0,
    background: "rgba(0, 240, 0, 0.2)",
    border: "",
    iframe: "",
  },
};

const igo: Record<string, RegionData> = {
  chat: {
    type: "chat",
    position: [45, 200],
    size: [240, 310],
    zIndex: 0,
    background: "rgba(135, 206, 235, 0.2)",
    border: "",
    iframe: "",
  },
  ...createGoBoard(1, 300, 40),
  ...createGoBoard(2, 300, 200),
  ...createGoBoard(3, 300, 360),
  ...createGoBoard(4, 560, 40),
  ...createGoBoard(5, 560, 200),
  ...createGoBoard(6, 560, 360),
  ...createGoBoard(7, 820, 40),
  ...createGoBoard(8, 820, 200),
  ...createGoBoard(9, 820, 360),
};

const office1: Record<string, RegionData> = {
  background: {
    type: "default",
    position: [0, 0],
    size: [1021, 676],
    zIndex: -100,
    background:
      "url(https://user-images.githubusercontent.com/17561803/111254880-55862c80-8659-11eb-88f1-3aaa42ba2b68.png) left top / contain no-repeat",
    border: "",
    iframe: "",
  },
  chat: {
    type: "chat",
    position: [40, 480],
    size: [380, 190],
    zIndex: 0,
    background: "white",
    border: "skyblue solid 3px",
    iframe: "",
  },
  ...createMeeting(1, 77, 244, 273, 230),
  ...createMeeting(2, 297, 41, 135, 125),
  ...createMeeting(3, 385, 321, 113, 75),
  share: {
    type: "media",
    position: [540, 405],
    size: [480, 270],
    zIndex: 0,
    background: "rgba(0, 240, 0, 0.3)",
    border: "",
    iframe: "",
  },
  go: {
    type: "goboard",
    position: [820, 95],
    size: [200, 120],
    zIndex: 0,
    background: "rgba(0,240,0,0.6)",
    border: "",
    iframe: "",
  },
  go2: {
    type: "goboard",
    position: [820, 220],
    size: [200, 120],
    zIndex: 0,
    background: "rgba(0,100,240,0.6)",
    border: "",
    iframe: "",
  },
};

const office2: Record<string, RegionData> = {
  background: {
    type: "default",
    position: [0, 0],
    size: [1120, 740],
    zIndex: -100,
    background:
      "url(https://user-images.githubusercontent.com/17561803/118205142-ab7d2200-b49a-11eb-863a-3a9a5560d7df.png) left top / contain no-repeat",
    border: "",
    iframe: "",
  },
  chat: {
    type: "chat",
    position: [85, 530],
    size: [375, 200],
    zIndex: 0,
    background: "rgba(206,206,206,0.9)",
    border: "#2C2F33 solid 2px",
    iframe: "",
  },
  ...createMeeting(1, 220, 180, 240, 180),
  ...createMeeting(2, 863, 230, 250, 230),
  ...createMeeting(3, 650, 47, 160, 160),
  ...createMeeting(4, 64, 315, 100, 45),
  ...createMeeting(5, 64, 388, 100, 45),
  ...createMeeting(6, 64, 457, 100, 45),
  share: {
    type: "media",
    position: [600, 480],
    size: [510, 250],
    zIndex: 0,
    background: "rgba(0,0,0,0.2)",
    border: "limegreen solid 2px",
    iframe: "",
  },
  ...createGoBoard(10, 865, 5),
};

const office3: Record<string, RegionData> = {
  background: {
    type: "default",
    position: [0, 0],
    size: [1120, 740],
    zIndex: -100,
    background:
      "url(https://user-images.githubusercontent.com/17561803/120201967-fc459680-c260-11eb-8b1f-6bb108476f2f.png) left top / contain no-repeat",
    border: "",
    iframe: "",
  },
  chat: {
    type: "chat",
    position: [56, 340],
    size: [250, 394],
    zIndex: 0,
    background: "rgba(167,194,211,0.9)",
    border: "#2C2F33 solid 3px",
    iframe: "",
  },
  ...createMeeting(1, 575, 295, 200, 130),
  ...createMeeting(2, 516, 555, 200, 180),
  ...createMeeting(3, 441, 373, 100, 100),
  ...createMeeting(4, 684, 17, 100, 45),
  ...createMeeting(5, 684, 83, 100, 45),
  ...createMeeting(6, 684, 149, 100, 45),
  share: {
    type: "media",
    position: [763, 643],
    size: [350, 90],
    zIndex: 0,
    background: "rgba(167,194,211,0.6)",
    border: "#2C2F33 solid 3px",
    iframe: "",
  },
  go: {
    type: "goboard",
    position: [320, 594],
    size: [180, 140],
    zIndex: 0,
    background: "rgba(167,194,211,0.6)",
    border: "#2C2F33 solid 3px",
    iframe: "",
  },
  movable: {
    type: "default",
    position: [244, 109],
    size: [36, 36],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/17561803/120613305-12d23480-c491-11eb-91ba-d338c3ba631e.png) center center / contain no-repeat",
    border: "",
    iframe: "",
    movable: true,
  },
};

const office4: Record<string, RegionData> = {
  background: {
    type: "default",
    position: [0, 0],
    size: [1120, 740],
    zIndex: -100,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919537-78c7d05e-26f4-43f6-9fdd-4db8e7fbc098.jpg) left top / contain no-repeat",
    border: "",
    iframe: "",
  },
  chat: {
    type: "chat",
    position: [60, 460],
    size: [230, 270],
    zIndex: 0,
    background: "rgba(255,255,255,0.3)",
    border: "#deca54 solid 1px",
    iframe: "",
  },
  ...createMeeting(1, 480, 580, 220, 150),
  ...createMeeting(2, 160, 300, 250, 140),
  ...createMeeting(3, 830, 190, 140, 70),
  movie: {
    type: "default",
    position: [763, 289],
    size: [109, 63],
    zIndex: 0,
    background: "",
    border: "",
    iframe: "https://www.youtube.com/embed/ofrC1WFeoLw",
  },
  share: {
    type: "media",
    position: [820, 590],
    size: [290, 140],
    zIndex: 0,
    background: "rgba(255,255,255,0.3)",
    border: "#deca54 solid 1px",
    iframe: "",
  },
  go: {
    type: "goboard",
    position: [292, 590],
    size: [160, 140],
    zIndex: 0,
    background: "rgba(255,255,255,0.3)",
    border: "#deca54 solid 1px",
    iframe: "",
  },
  BeachChair: {
    type: "default",
    position: [959, 422],
    size: [35, 63],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919528-eac984b0-ce64-4ab1-8973-c429e9a10052.png) center center / contain no-repeat",
    border: "",
    iframe: "",
    movable: true,
  },
  BeachChair2: {
    type: "default",
    position: [1068, 423],
    size: [35, 63],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919528-eac984b0-ce64-4ab1-8973-c429e9a10052.png) center center / contain no-repeat",
    border: "",
    iframe: "",
    movable: true,
  },
  ChairA: {
    type: "default",
    position: [367, 317],
    size: [35, 48],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919531-82d14682-c684-4da7-bc83-8ae17861150e.png) center center / contain no-repeat",
    border: "",
    iframe: "",
    movable: true,
  },
  ChairB: {
    type: "default",
    position: [174, 330],
    size: [35, 48],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919533-6a09f353-16c2-465d-b09f-ff64b0357418.png) center center / contain no-repeat",
    border: "",
    iframe: "",
    movable: true,
  },
  ChairC: {
    type: "default",
    position: [345, 374],
    size: [35, 48],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919534-d4a669f9-c228-4a55-9b2a-df04bd2dd0d1.png) center center / contain no-repeat",
    border: "",
    iframe: "",
    movable: true,
  },
  Digda: {
    type: "default",
    position: [119, 409],
    size: [26, 22],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919535-97212807-b151-4937-8e08-b4fdd1f497e7.png) center center / contain no-repeat",
    border: "",
    iframe: "",
    movable: true,
  },
  Kintone: {
    type: "default",
    position: [907, 110],
    size: [46, 28],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919536-99b58589-238f-44e9-b2a2-f20a615e730c.png) center center / contain no-repeat",
    border: "",
    iframe: "",
    movable: true,
  },
  BlockA: {
    type: "default",
    position: [400, 500],
    size: [22, 19],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126926610-244ca224-89b8-4418-b457-5d23ca34d69e.png) center center / contain no-repeat",
    border: "",
    iframe: "",
    movable: true,
  },
  BlockB: {
    type: "default",
    position: [430, 500],
    size: [22, 19],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126926292-dd184ddb-2a78-4720-8b69-2daa6e911f08.png) center center / contain no-repeat",
    border: "",
    iframe: "",
    movable: true,
  },
  BlockC: {
    type: "default",
    position: [460, 500],
    size: [22, 19],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919530-aeff42a1-a033-4eb1-a395-bc3700b9a54d.png) center center / contain no-repeat",
    border: "",
    iframe: "",
    movable: true,
  },
  BlockD: {
    type: "default",
    position: [490, 500],
    size: [22, 19],
    zIndex: 0,
    background:
      "url(https://user-images.githubusercontent.com/52230939/126919529-b82d5f24-71ae-482b-987d-55d68829a490.png) center center / contain no-repeat",
    border: "",
    iframe: "",
    movable: true,
  },
};

export const roomPresets: Record<string, Record<string, RegionData>> = {
  intro,
  phone,
  igo,
  office1,
  office2,
  office3,
  office4,
};
