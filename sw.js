if(!self.define){let e,i={};const c=(c,n)=>(c=new URL(c+".js",n).href,i[c]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=i,document.head.appendChild(e)}else e=c,importScripts(c),i()})).then((()=>{let e=i[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(n,r)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(i[s])return;let o={};const t=e=>c(e,s),f={module:{uri:s},exports:o,require:t};i[s]=Promise.all(n.map((e=>f[e]||t(e)))).then((e=>(r(...e),o)))}}define(["./workbox-27b29e6f"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index-273fc3fe.css",revision:null},{url:"assets/index-95f1c37a.js",revision:null},{url:"index.html",revision:"3cf46a4740cc7a4c9c21372ab33a0abf"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"favicon-16x16.png",revision:"2ccb9bae4b7ef98e42bd489c33c75c63"},{url:"favicon-32x32.png",revision:"fb5ce09459c5b16bf8cb9046edba5a7b"},{url:"apple-touch-icon-144x144.png",revision:"a54f00791f53d542afb92ca245401b06"},{url:"android-chrome-192x192.png",revision:"4c61880ce6c60cc05bbf1bea713648de"},{url:"android-chrome-512x512.png",revision:"4f891abb32262d8ca48bed5c13e30e36"},{url:"manifest.webmanifest",revision:"859b88ac1d2b43c57048c66c96563494"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
