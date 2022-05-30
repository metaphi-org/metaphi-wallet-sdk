/*! For license information please see index.js.LICENSE.txt */
(()=>{"use strict";var e={n:t=>{var n=t&&t.__esModule?()=>t.default:()=>t;return e.d(n,{a:n}),n},d:(t,n)=>{for(var r in n)e.o(n,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:n[r]})}};e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),e.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},e.p="";var t={};e.r(t),e.d(t,{MetaphiModal:()=>z});const n=require("react");var r=e.n(n);const a=e.p+"1168d6d99700da4d16e0c8534567d853-metaphi-logo.png",o=function(e){return r().createElement("div",{className:"metaphi"},r().createElement("div",{className:"modal"},r().createElement("div",{className:"modal-background"}),r().createElement("div",{className:"modal-body-wrapper"},r().createElement("div",{className:"modal-btn-close",onClick:e.onClose},r().createElement("img",{src:"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2LjAwMDMgMi42NjY2OUM4LjYyNjk5IDIuNjY2NjkgMi42NjY5OSA4LjYyNjY5IDIuNjY2OTkgMTZDMi42NjY5OSAyMy4zNzM0IDguNjI2OTkgMjkuMzMzNCAxNi4wMDAzIDI5LjMzMzRDMjMuMzczNyAyOS4zMzM0IDI5LjMzMzcgMjMuMzczNCAyOS4zMzM3IDE2QzI5LjMzMzcgOC42MjY2OSAyMy4zNzM3IDIuNjY2NjkgMTYuMDAwMyAyLjY2NjY5Wk0yMS43MzM3IDIxLjczMzRDMjEuMjEzNyAyMi4yNTM0IDIwLjM3MzcgMjIuMjUzNCAxOS44NTM3IDIxLjczMzRMMTYuMDAwMyAxNy44OEwxMi4xNDcgMjEuNzMzNEMxMS42MjcgMjIuMjUzNCAxMC43ODcgMjIuMjUzNCAxMC4yNjcgMjEuNzMzNEM5Ljc0Njk5IDIxLjIxMzQgOS43NDY5OSAyMC4zNzM0IDEwLjI2NyAxOS44NTM0TDE0LjEyMDMgMTZMMTAuMjY3IDEyLjE0NjdDOS43NDY5OSAxMS42MjY3IDkuNzQ2OTkgMTAuNzg2NyAxMC4yNjcgMTAuMjY2N0MxMC43ODcgOS43NDY2OSAxMS42MjcgOS43NDY2OSAxMi4xNDcgMTAuMjY2N0wxNi4wMDAzIDE0LjEyTDE5Ljg1MzcgMTAuMjY2N0MyMC4zNzM3IDkuNzQ2NjkgMjEuMjEzNyA5Ljc0NjY5IDIxLjczMzcgMTAuMjY2N0MyMi4yNTM3IDEwLjc4NjcgMjIuMjUzNyAxMS42MjY3IDIxLjczMzcgMTIuMTQ2N0wxNy44ODAzIDE2TDIxLjczMzcgMTkuODUzNEMyMi4yNDAzIDIwLjM2IDIyLjI0MDMgMjEuMjEzNCAyMS43MzM3IDIxLjczMzRaIiBmaWxsPSIjOEY4RjhGIi8+Cjwvc3ZnPgo=",width:"48px",height:"48px"})),r().createElement("div",{className:"modal-content-wrapper"},r().createElement("div",{className:"modal-header"},r().createElement("div",{className:"logo"},r().createElement("img",{src:a,width:"40px",height:"40px"})),r().createElement("div",{className:"branding"},"Metaphi")),r().createElement("div",null,e.children)))))},l=function(e){var t=e.text,n=e.onClick;return r().createElement("div",{className:"btn btn--text",onClick:n},t)},i=function(e){var t=e.children,n=e.disabled,a=e.onClick;return r().createElement("div",{className:"btn btn--primary ".concat(n?"disabled":"active"),onClick:a},t)},c=function(e){var t=e.label,n=e.onChange;return r().createElement(r().Fragment,null,r().createElement("label",null,t),r().createElement("input",{type:"text",onChange:function(e){return n(e.target.value)}}))},u=function(e){var t=e.label,n=e.maxLength,a=e.onInputChange,o=function(e){var t,r,o=e.target.id;code[o]=e.target.value,(void 0)(code),o<n&&(null===(t=e.target)||void 0===t||null===(r=t.nextElementSibling)||void 0===r||r.focus()),code.join("").length===n&&a(code.join(""))};return r().createElement("div",null,r().createElement("label",null,t),r().createElement("div",{className:"numeric-input-container"},r().createElement("input",{id:"0",type:"text",maxLength:"1",className:"rounded",onChange:o}),r().createElement("input",{id:"1",type:"text",maxLength:"1",className:"rounded",onChange:o}),r().createElement("input",{id:"2",type:"text",maxLength:"1",className:"rounded",onChange:o}),r().createElement("input",{id:"3",type:"text",maxLength:"1",className:"rounded",onChange:o}),r().createElement("input",{id:"4",type:"text",maxLength:"1",className:"rounded",onChange:o}),r().createElement("input",{id:"5",type:"text",maxLength:"1",className:"rounded",onChange:o})))};function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var d=function(){return r().createElement("a",{className:"text-link",href:"https://metaphi.xyz",target:"_blank",rel:"noreferrer"},"Learn more about Metaphi")};const m=function(e){var t,n,a=e.mode,o=e.resolve,m=(t=useState(""),n=2,function(e){if(Array.isArray(e))return e}(t)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,a,o=[],l=!0,i=!1;try{for(n=n.call(e);!(l=(r=n.next()).done)&&(o.push(r.value),!t||o.length!==t);l=!0);}catch(e){i=!0,a=e}finally{try{l||null==n.return||n.return()}finally{if(i)throw a}}return o}}(t,n)||function(e,t){if(e){if("string"==typeof e)return s(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?s(e,t):void 0}}(t,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),f=m[0],h=m[1];return r().createElement("div",null,r().createElement("div",{className:"modal-description"},"Enter the following details to connect to Metaphi"),r().createElement("div",{className:"modal-section"},r().createElement(c,{label:"Email Address",onChange:h}),r().createElement(l,{text:"Send Authorization Code",onClick:o})),r().createElement("div",{className:"modal-section modal-section--".concat(1===a?"active":"disabled")},r().createElement(u,{label:"Authentication Code",onInputChange:h})),r().createElement("div",{className:"modal-cta-wrapper"},r().createElement(i,{disabled:0===a||(null==f?void 0:f.length)<6,onClick:o},"Continue"),r().createElement(d,null)))},f=function(e){var t=e.walletAddress,n=(e.resolve,e.onProcess),a=function(e){return e<2?"complete":2===e?"active":e>2?"incomplete":void 0};return r().createElement("div",null,r().createElement("div",{className:"modal-description"},"Connection Initialization"),r().createElement("div",{className:"bullet-container"},r().createElement("div",{className:"modal-bullet modal-bullet--".concat(a(0))},r().createElement("div",{className:"bullet"},"1"),r().createElement("div",{className:"bullet-body"},r().createElement("div",{className:"bullet-title"},"Wallet Address"),r().createElement("div",{className:"bullet-description"},null,t))),r().createElement("div",{className:"modal-bullet modal-bullet--".concat(a(1))},r().createElement("div",{className:"bullet"},"2"),r().createElement("div",{className:"bullet-body"},r().createElement("div",{className:"bullet-title"},"Local Share"),r().createElement("div",{className:"bullet-description"},null,"Retrived local share"))),r().createElement("div",{className:"modal-bullet modal-bullet--".concat(a(2))},r().createElement("div",{className:"bullet"},"3"),r().createElement("div",{className:"bullet-body"},r().createElement("div",{className:"bullet-title"},"Metaphi Share"),r().createElement("div",{className:"bullet-description"},"Fetching Metaphi share...",null))),r().createElement("div",{className:"modal-bullet modal-bullet--".concat(a(3))},r().createElement("div",{className:"bullet"},"4"),r().createElement("div",{className:"bullet-body"},r().createElement("div",{className:"bullet-title"},"Pin:"),r().createElement("div",{className:"bullet-description"},r().createElement("input",{type:"text",disabled:!0,placeholder:"Please enter your user pin"})))),r().createElement("div",{className:"modal-bullet modal-bullet--".concat(a(4))},r().createElement("div",{className:"bullet"},"5"),r().createElement("div",{className:"bullet-body"},r().createElement("div",{className:"bullet-title"},"Private Key Reconstruction"),r().createElement("div",{className:"bullet-description"},null,null)))),r().createElement("div",{className:"modal-cta-wrapper"},r().createElement(i,{disabled:!0,onClick:n},"Connect Wallet")))},h=function(e){var t=e.disabled,n=e.children,a=e.onClick;return r().createElement("div",{className:"btn btn--secondary ".concat(t?"disabled":"active"),onClick:a},n)},p=function(e){var t=e.resolve,n=e.address,a=e.balance,o=e.origin,l=e.message;return r().createElement("div",null,r().createElement("div",{className:"modal-description"},"Signature Request"),r().createElement("div",{className:"modal-section flex flex-row"},r().createElement("div",{className:"half-container"},r().createElement("div",null,"Address:"),r().createElement("div",null,n)),r().createElement("div",{className:"half-container"},r().createElement("div",null,"Balance:"),r().createElement("div",null,a))),r().createElement("div",{className:"modal-section"},r().createElement("div",null,"Origin:"),r().createElement("div",null,o)),r().createElement("div",{className:"modal-section"},r().createElement("div",{className:"message-box"},r().createElement("div",null,"Message:"),r().createElement("div",null,l))),r().createElement("div",{className:"modal-cta-wrapper wrapper-row"},r().createElement(h,{onClick:function(){return t(!1)}},"Cancel"),r().createElement(i,{onClick:function(){return t(!0)}},"Sign")))},v=function(){return r().createElement("div",null,r().createElement("div",{style:{width:"144px",height:"144px"}}),r().createElement("div",{className:"modal-cta-wrapper loading"},"Connecting ..."))},y=function(e){var t=e.address,n=e.dapp,a=e.onClose;return r().createElement("div",null,r().createElement("div",{style:{width:"144px",height:"144px"}}),r().createElement("div",null,"You have successfully cnnected your Metaphi Wallet (",t,") to",n),r().createElement("div",{className:"modal-cta-wrapper"},r().createElement(i,{onClick:a},"Go to Pegaxy"),r().createElement(h,{onClick:function(){window.open("https:/metaphi.xyz")}},"View Metaphi Dashboard")))},E=function(){return r().createElement("div",null,r().createElement("div",{style:{width:"144px",height:"144px"}}),r().createElement("div",{className:"modal-cta-wrapper loading"},"Connecting ..."))};function g(e){return g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},g(e)}function N(){N=function(){return e};var e={},t=Object.prototype,n=t.hasOwnProperty,r="function"==typeof Symbol?Symbol:{},a=r.iterator||"@@iterator",o=r.asyncIterator||"@@asyncIterator",l=r.toStringTag||"@@toStringTag";function i(e,t,n){return Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{i({},"")}catch(e){i=function(e,t,n){return e[t]=n}}function c(e,t,n,r){var a=t&&t.prototype instanceof d?t:d,o=Object.create(a.prototype),l=new I(r||[]);return o._invoke=function(e,t,n){var r="suspendedStart";return function(a,o){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===a)throw o;return{value:void 0,done:!0}}for(n.method=a,n.arg=o;;){var l=n.delegate;if(l){var i=M(l,n);if(i){if(i===s)continue;return i}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var c=u(e,t,n);if("normal"===c.type){if(r=n.done?"completed":"suspendedYield",c.arg===s)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(r="completed",n.method="throw",n.arg=c.arg)}}}(e,n,l),o}function u(e,t,n){try{return{type:"normal",arg:e.call(t,n)}}catch(e){return{type:"throw",arg:e}}}e.wrap=c;var s={};function d(){}function m(){}function f(){}var h={};i(h,a,(function(){return this}));var p=Object.getPrototypeOf,v=p&&p(p(x([])));v&&v!==t&&n.call(v,a)&&(h=v);var y=f.prototype=d.prototype=Object.create(h);function E(e){["next","throw","return"].forEach((function(t){i(e,t,(function(e){return this._invoke(t,e)}))}))}function b(e,t){function r(a,o,l,i){var c=u(e[a],e,o);if("throw"!==c.type){var s=c.arg,d=s.value;return d&&"object"==g(d)&&n.call(d,"__await")?t.resolve(d.__await).then((function(e){r("next",e,l,i)}),(function(e){r("throw",e,l,i)})):t.resolve(d).then((function(e){s.value=e,l(s)}),(function(e){return r("throw",e,l,i)}))}i(c.arg)}var a;this._invoke=function(e,n){function o(){return new t((function(t,a){r(e,n,t,a)}))}return a=a?a.then(o,o):o()}}function M(e,t){var n=e.iterator[t.method];if(void 0===n){if(t.delegate=null,"throw"===t.method){if(e.iterator.return&&(t.method="return",t.arg=void 0,M(e,t),"throw"===t.method))return s;t.method="throw",t.arg=new TypeError("The iterator does not provide a 'throw' method")}return s}var r=u(n,e.iterator,t.arg);if("throw"===r.type)return t.method="throw",t.arg=r.arg,t.delegate=null,s;var a=r.arg;return a?a.done?(t[e.resultName]=a.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,s):a:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,s)}function w(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function j(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function I(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(w,this),this.reset(!0)}function x(e){if(e){var t=e[a];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var r=-1,o=function t(){for(;++r<e.length;)if(n.call(e,r))return t.value=e[r],t.done=!1,t;return t.value=void 0,t.done=!0,t};return o.next=o}}return{next:S}}function S(){return{value:void 0,done:!0}}return m.prototype=f,i(y,"constructor",f),i(f,"constructor",m),m.displayName=i(f,l,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===m||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,f):(e.__proto__=f,i(e,l,"GeneratorFunction")),e.prototype=Object.create(y),e},e.awrap=function(e){return{__await:e}},E(b.prototype),i(b.prototype,o,(function(){return this})),e.AsyncIterator=b,e.async=function(t,n,r,a,o){void 0===o&&(o=Promise);var l=new b(c(t,n,r,a),o);return e.isGeneratorFunction(n)?l:l.next().then((function(e){return e.done?e.value:l.next()}))},E(y),i(y,l,"Generator"),i(y,a,(function(){return this})),i(y,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=[];for(var n in e)t.push(n);return t.reverse(),function n(){for(;t.length;){var r=t.pop();if(r in e)return n.value=r,n.done=!1,n}return n.done=!0,n}},e.values=x,I.prototype={constructor:I,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(j),!e)for(var t in this)"t"===t.charAt(0)&&n.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function r(n,r){return l.type="throw",l.arg=e,t.next=n,r&&(t.method="next",t.arg=void 0),!!r}for(var a=this.tryEntries.length-1;a>=0;--a){var o=this.tryEntries[a],l=o.completion;if("root"===o.tryLoc)return r("end");if(o.tryLoc<=this.prev){var i=n.call(o,"catchLoc"),c=n.call(o,"finallyLoc");if(i&&c){if(this.prev<o.catchLoc)return r(o.catchLoc,!0);if(this.prev<o.finallyLoc)return r(o.finallyLoc)}else if(i){if(this.prev<o.catchLoc)return r(o.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return r(o.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var a=this.tryEntries[r];if(a.tryLoc<=this.prev&&n.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var o=a;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var l=o?o.completion:{};return l.type=e,l.arg=t,o?(this.method="next",this.next=o.finallyLoc,s):this.complete(l)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),s},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),j(n),s}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if("throw"===r.type){var a=r.arg;j(n)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,n){return this.delegate={iterator:x(e),resultName:t,nextLoc:n},"next"===this.method&&(this.arg=void 0),s}},e}function b(e,t,n,r,a,o,l){try{var i=e[o](l),c=i.value}catch(e){return void n(e)}i.done?t(c):Promise.resolve(c).then(r,a)}function M(e){return function(){var t=this,n=arguments;return new Promise((function(r,a){var o=e.apply(t,n);function l(e){b(o,r,a,l,i,"next",e)}function i(e){b(o,r,a,l,i,"throw",e)}l(void 0)}))}}function w(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function j(e,t){return j=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},j(e,t)}function I(e,t){if(t&&("object"===g(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return x(e)}function x(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function S(e){return S=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},S(e)}function C(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var O=function(t){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&j(e,t)}(u,t);var n,a,l,i,c=(l=u,i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=S(l);if(i){var n=S(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return I(this,e)});function u(t){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,u),C(x(n=c.call(this,t)),"handleClose",(function(){n.setState({show:!1})})),C(x(n),"getEmail",function(){var e=M(N().mark((function e(t){return N().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",n.getUserInput(u.INPUT_TYPES.EMAIL));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),C(x(n),"getVerificationCode",M(N().mark((function e(){return N().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",n.getUserInput(u.INPUT_TYPES.VERIFICATION_CODE));case 1:case"end":return e.stop()}}),e)})))),C(x(n),"getUserPin",M(N().mark((function e(){return N().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",n.getUserInput(u.INPUT_TYPES.USER_PIN));case 1:case"end":return e.stop()}}),e)})))),C(x(n),"getUserInput",function(){var e=M(N().mark((function e(t){var r,a;return N().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n.setState({show:!0,modalState:t}),r=x(n),a=new Promise((function(e,t){r._resolve=e})),e.abrupt("return",a);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),C(x(n),"updateState",(function(e){if("processing"===e&&n.setState({modalState:3}),"success"===e){n.setState({modalState:4});var t=x(n);setTimeout((function(){t.setState({show:!1})}),1e3)}})),C(x(n),"renderState",(function(e){switch(e){case u.INPUT_TYPES.EMAIL:return r().createElement(m,{mode:0,resolve:n._resolve});case u.INPUT_TYPES.VERIFICATION_CODE:return r().createElement(m,{mode:1,resolve:n._resolve});case u.INPUT_TYPES.USER_PIN:return r().createElement(f,{resolve:n._resolve});case u.INPUT_TYPES.TRANSACTION_SIGNING:return r().createElement(p,{resolve:n._resolve});case u.INPUT_TYPES.SUCCESS:return r().createElement(y,{onClose:n.handleClose});case u.INPUT_TYPES.PROCESSING:return r().createElement(v,null);case u.INPUT_TYPES.ERROR:return r().createElement(E,null)}})),n.state={show:!0,modalState:u.INPUT_TYPES.USER_PIN},n._resolve=null,e.g.window&&(window.MetaphiModal=x(n)),n}return n=u,(a=[{key:"show",value:function(){this.setState({show:!0})}},{key:"render",value:function(){return this.state.show?r().createElement(o,{onClose:this.handleClose},r().createElement("div",null,this.renderState(this.state.modalState))):null}}])&&w(n.prototype,a),Object.defineProperty(n,"prototype",{writable:!1}),u}(r().Component);C(O,"INPUT_TYPES",{EMAIL:0,VERIFICATION_CODE:1,USER_PIN:2,TRANSACTION_SIGN:3,SUCCESS:4,PROCESSING:5,ERROR:6,CONNECT:7});const z=O;module.exports=t})();