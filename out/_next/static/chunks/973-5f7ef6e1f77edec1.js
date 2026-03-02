"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[973],{973:function(t,e,n){var s,i,o,r,a,l,c,d,u,h,f,p,E,g,y,m,C,O;n.d(e,{$D:function(){return z}});/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let _=["user","model","function","system"];(h=s||(s={})).HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",h.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",h.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",h.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",h.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",(f=i||(i={})).HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",f.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",f.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",f.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",f.BLOCK_NONE="BLOCK_NONE",(p=o||(o={})).HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",p.NEGLIGIBLE="NEGLIGIBLE",p.LOW="LOW",p.MEDIUM="MEDIUM",p.HIGH="HIGH",(E=r||(r={})).BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",E.SAFETY="SAFETY",E.OTHER="OTHER",(g=a||(a={})).FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",g.STOP="STOP",g.MAX_TOKENS="MAX_TOKENS",g.SAFETY="SAFETY",g.RECITATION="RECITATION",g.OTHER="OTHER",(y=l||(l={})).TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",y.RETRIEVAL_QUERY="RETRIEVAL_QUERY",y.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",y.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",y.CLASSIFICATION="CLASSIFICATION",y.CLUSTERING="CLUSTERING",(m=c||(c={})).MODE_UNSPECIFIED="MODE_UNSPECIFIED",m.AUTO="AUTO",m.ANY="ANY",m.NONE="NONE",(C=d||(d={})).STRING="STRING",C.NUMBER="NUMBER",C.INTEGER="INTEGER",C.BOOLEAN="BOOLEAN",C.ARRAY="ARRAY",C.OBJECT="OBJECT";/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class T extends Error{constructor(t){super(`[GoogleGenerativeAI Error]: ${t}`)}}class N extends T{constructor(t,e){super(t),this.response=e}}class I extends T{constructor(t,e,n,s){super(t),this.status=e,this.statusText=n,this.errorDetails=s}}class R extends T{}(O=u||(u={})).GENERATE_CONTENT="generateContent",O.STREAM_GENERATE_CONTENT="streamGenerateContent",O.COUNT_TOKENS="countTokens",O.EMBED_CONTENT="embedContent",O.BATCH_EMBED_CONTENTS="batchEmbedContents";class A{constructor(t,e,n,s,i){this.model=t,this.task=e,this.apiKey=n,this.stream=s,this.requestOptions=i}toString(){var t,e;let n=(null===(t=this.requestOptions)||void 0===t?void 0:t.apiVersion)||"v1beta",s=(null===(e=this.requestOptions)||void 0===e?void 0:e.baseUrl)||"https://generativelanguage.googleapis.com",i=`${s}/${n}/${this.model}:${this.task}`;return this.stream&&(i+="?alt=sse"),i}}async function S(t){let e=new Headers;e.append("Content-Type","application/json"),e.append("x-goog-api-client",function(t){let e=[];return(null==t?void 0:t.apiClient)&&e.push(t.apiClient),e.push("genai-js/0.11.5"),e.join(" ")}(t.requestOptions)),e.append("x-goog-api-key",t.apiKey);let n=t.requestOptions.customHeaders;if(n){if(!(n instanceof Headers))try{n=new Headers(n)}catch(t){throw new R(`unable to convert customHeaders value ${JSON.stringify(n)} to Headers: ${t.message}`)}for(let[t,s]of n.entries()){if("x-goog-api-key"===t)throw new R(`Cannot set reserved header name ${t}`);if("x-goog-api-client"===t)throw new R(`Header name ${t} can only be set using the apiClient field`);e.append(t,s)}}return e}async function w(t,e,n,s,i,o){let r=new A(t,e,n,s,o);return{url:r.toString(),fetchOptions:Object.assign(Object.assign({},function(t){let e={};if((null==t?void 0:t.timeout)>=0){let n=new AbortController,s=n.signal;setTimeout(()=>n.abort(),t.timeout),e.signal=s}return e}(o)),{method:"POST",headers:await S(r),body:i})}}async function v(t,e,n,s,i,o){return b(t,e,n,s,i,o,fetch)}async function b(t,e,n,s,i,o,r=fetch){let a;let l=new A(t,e,n,s,o);try{let c=await w(t,e,n,s,i,o);if(!(a=await r(c.url,c.fetchOptions)).ok){let t,e="";try{let n=await a.json();e=n.error.message,n.error.details&&(e+=` ${JSON.stringify(n.error.details)}`,t=n.error.details)}catch(t){}throw new I(`Error fetching from ${l.toString()}: [${a.status} ${a.statusText}] ${e}`,a.status,a.statusText,t)}}catch(e){let t=e;throw e instanceof I||e instanceof R||((t=new T(`Error fetching from ${l.toString()}: ${e.message}`)).stack=e.stack),t}return a}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M(t){return t.text=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),D(t.candidates[0]))throw new N(`${$(t)}`,t);return function(t){var e,n,s,i;let o=[];if(null===(n=null===(e=t.candidates)||void 0===e?void 0:e[0].content)||void 0===n?void 0:n.parts)for(let e of null===(i=null===(s=t.candidates)||void 0===s?void 0:s[0].content)||void 0===i?void 0:i.parts)e.text&&o.push(e.text);return o.length>0?o.join(""):""}(t)}if(t.promptFeedback)throw new N(`Text not available. ${$(t)}`,t);return""},t.functionCall=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),D(t.candidates[0]))throw new N(`${$(t)}`,t);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),H(t)[0]}if(t.promptFeedback)throw new N(`Function call not available. ${$(t)}`,t)},t.functionCalls=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),D(t.candidates[0]))throw new N(`${$(t)}`,t);return H(t)}if(t.promptFeedback)throw new N(`Function call not available. ${$(t)}`,t)},t}function H(t){var e,n,s,i;let o=[];if(null===(n=null===(e=t.candidates)||void 0===e?void 0:e[0].content)||void 0===n?void 0:n.parts)for(let e of null===(i=null===(s=t.candidates)||void 0===s?void 0:s[0].content)||void 0===i?void 0:i.parts)e.functionCall&&o.push(e.functionCall);return o.length>0?o:void 0}let L=[a.RECITATION,a.SAFETY];function D(t){return!!t.finishReason&&L.includes(t.finishReason)}function $(t){var e,n,s;let i="";if((!t.candidates||0===t.candidates.length)&&t.promptFeedback)i+="Response was blocked",(null===(e=t.promptFeedback)||void 0===e?void 0:e.blockReason)&&(i+=` due to ${t.promptFeedback.blockReason}`),(null===(n=t.promptFeedback)||void 0===n?void 0:n.blockReasonMessage)&&(i+=`: ${t.promptFeedback.blockReasonMessage}`);else if(null===(s=t.candidates)||void 0===s?void 0:s[0]){let e=t.candidates[0];D(e)&&(i+=`Candidate was blocked due to ${e.finishReason}`,e.finishMessage&&(i+=`: ${e.finishMessage}`))}return i}function F(t){return this instanceof F?(this.v=t,this):new F(t)}"function"==typeof SuppressedError&&SuppressedError;/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let P=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function x(t){let e=[],n=t.getReader();for(;;){let{done:t,value:s}=await n.read();if(t)return M(function(t){let e=t[t.length-1],n={promptFeedback:null==e?void 0:e.promptFeedback};for(let e of t)if(e.candidates)for(let t of e.candidates){let e=t.index;if(n.candidates||(n.candidates=[]),n.candidates[e]||(n.candidates[e]={index:t.index}),n.candidates[e].citationMetadata=t.citationMetadata,n.candidates[e].finishReason=t.finishReason,n.candidates[e].finishMessage=t.finishMessage,n.candidates[e].safetyRatings=t.safetyRatings,t.content&&t.content.parts){n.candidates[e].content||(n.candidates[e].content={role:t.content.role||"user",parts:[]});let s={};for(let i of t.content.parts)i.text&&(s.text=i.text),i.functionCall&&(s.functionCall=i.functionCall),0===Object.keys(s).length&&(s.text=""),n.candidates[e].content.parts.push(s)}}return n}(e));e.push(s)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function G(t,e,n,s){return function(t){let[e,n]=(function(t){let e=t.getReader();return new ReadableStream({start(t){let n="";return function s(){return e.read().then(({value:e,done:i})=>{let o;if(i){if(n.trim()){t.error(new T("Failed to parse stream"));return}t.close();return}let r=(n+=e).match(P);for(;r;){try{o=JSON.parse(r[1])}catch(e){t.error(new T(`Error parsing JSON response: "${r[1]}"`));return}t.enqueue(o),r=(n=n.substring(r[0].length)).match(P)}return s()})}()}})})(t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0}))).tee();return{stream:function(t){return function(t,e,n){if(!Symbol.asyncIterator)throw TypeError("Symbol.asyncIterator is not defined.");var s,i=n.apply(t,e||[]),o=[];return s={},r("next"),r("throw"),r("return"),s[Symbol.asyncIterator]=function(){return this},s;function r(t){i[t]&&(s[t]=function(e){return new Promise(function(n,s){o.push([t,e,n,s])>1||a(t,e)})})}function a(t,e){try{var n;(n=i[t](e)).value instanceof F?Promise.resolve(n.value.v).then(l,c):d(o[0][2],n)}catch(t){d(o[0][3],t)}}function l(t){a("next",t)}function c(t){a("throw",t)}function d(t,e){t(e),o.shift(),o.length&&a(o[0][0],o[0][1])}}(this,arguments,function*(){let e=t.getReader();for(;;){let{value:t,done:n}=yield F(e.read());if(n)break;yield yield F(M(t))}})}(e),response:x(n)}}(await v(e,u.STREAM_GENERATE_CONTENT,t,!0,JSON.stringify(n),s))}async function U(t,e,n,s){let i=await v(e,u.GENERATE_CONTENT,t,!1,JSON.stringify(n),s);return{response:M(await i.json())}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B(t){if(null!=t){if("string"==typeof t)return{role:"system",parts:[{text:t}]};if(t.text)return{role:"system",parts:[t]};if(t.parts)return t.role?t:{role:"system",parts:t.parts}}}function K(t){let e=[];if("string"==typeof t)e=[{text:t}];else for(let n of t)"string"==typeof n?e.push({text:n}):e.push(n);return function(t){let e={role:"user",parts:[]},n={role:"function",parts:[]},s=!1,i=!1;for(let o of t)"functionResponse"in o?(n.parts.push(o),i=!0):(e.parts.push(o),s=!0);if(s&&i)throw new T("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!s&&!i)throw new T("No content is provided for sending chat message.");return s?e:n}(e)}function k(t){let e;return e=t.contents?t:{contents:[K(t)]},t.systemInstruction&&(e.systemInstruction=B(t.systemInstruction)),e}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Y=["text","inlineData","functionCall","functionResponse"],j={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall"],system:["text"]},q="SILENT_ERROR";class J{constructor(t,e,n,s){this.model=e,this.params=n,this.requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=t,(null==n?void 0:n.history)&&(function(t){let e=!1;for(let n of t){let{role:t,parts:s}=n;if(!e&&"user"!==t)throw new T(`First content should be with role 'user', got ${t}`);if(!_.includes(t))throw new T(`Each item should include role field. Got ${t} but valid roles are: ${JSON.stringify(_)}`);if(!Array.isArray(s))throw new T("Content should have 'parts' property with an array of Parts");if(0===s.length)throw new T("Each Content should have at least one part");let i={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0};for(let t of s)for(let e of Y)e in t&&(i[e]+=1);let o=j[t];for(let e of Y)if(!o.includes(e)&&i[e]>0)throw new T(`Content with role '${t}' can't contain '${e}' part`);e=!0}}(n.history),this._history=n.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(t){var e,n,s,i,o;let r;await this._sendPromise;let a=K(t),l={safetySettings:null===(e=this.params)||void 0===e?void 0:e.safetySettings,generationConfig:null===(n=this.params)||void 0===n?void 0:n.generationConfig,tools:null===(s=this.params)||void 0===s?void 0:s.tools,toolConfig:null===(i=this.params)||void 0===i?void 0:i.toolConfig,systemInstruction:null===(o=this.params)||void 0===o?void 0:o.systemInstruction,contents:[...this._history,a]};return this._sendPromise=this._sendPromise.then(()=>U(this._apiKey,this.model,l,this.requestOptions)).then(t=>{var e;if(t.response.candidates&&t.response.candidates.length>0){this._history.push(a);let n=Object.assign({parts:[],role:"model"},null===(e=t.response.candidates)||void 0===e?void 0:e[0].content);this._history.push(n)}else{let e=$(t.response);e&&console.warn(`sendMessage() was unsuccessful. ${e}. Inspect response object for details.`)}r=t}),await this._sendPromise,r}async sendMessageStream(t){var e,n,s,i,o;await this._sendPromise;let r=K(t),a={safetySettings:null===(e=this.params)||void 0===e?void 0:e.safetySettings,generationConfig:null===(n=this.params)||void 0===n?void 0:n.generationConfig,tools:null===(s=this.params)||void 0===s?void 0:s.tools,toolConfig:null===(i=this.params)||void 0===i?void 0:i.toolConfig,systemInstruction:null===(o=this.params)||void 0===o?void 0:o.systemInstruction,contents:[...this._history,r]},l=G(this._apiKey,this.model,a,this.requestOptions);return this._sendPromise=this._sendPromise.then(()=>l).catch(t=>{throw Error(q)}).then(t=>t.response).then(t=>{if(t.candidates&&t.candidates.length>0){this._history.push(r);let e=Object.assign({},t.candidates[0].content);e.role||(e.role="model"),this._history.push(e)}else{let e=$(t);e&&console.warn(`sendMessageStream() was unsuccessful. ${e}. Inspect response object for details.`)}}).catch(t=>{t.message!==q&&console.error(t)}),l}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function V(t,e,n,s){return(await v(e,u.COUNT_TOKENS,t,!1,JSON.stringify(Object.assign(Object.assign({},n),{model:e})),s)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function X(t,e,n,s){return(await v(e,u.EMBED_CONTENT,t,!1,JSON.stringify(n),s)).json()}async function W(t,e,n,s){let i=n.requests.map(t=>Object.assign(Object.assign({},t),{model:e}));return(await v(e,u.BATCH_EMBED_CONTENTS,t,!1,JSON.stringify({requests:i}),s)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q{constructor(t,e,n){this.apiKey=t,e.model.includes("/")?this.model=e.model:this.model=`models/${e.model}`,this.generationConfig=e.generationConfig||{},this.safetySettings=e.safetySettings||[],this.tools=e.tools,this.toolConfig=e.toolConfig,this.systemInstruction=B(e.systemInstruction),this.requestOptions=n||{}}async generateContent(t){let e=k(t);return U(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction},e),this.requestOptions)}async generateContentStream(t){let e=k(t);return G(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction},e),this.requestOptions)}startChat(t){return new J(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction},t),this.requestOptions)}async countTokens(t){let e=k(t);return V(this.apiKey,this.model,e,this.requestOptions)}async embedContent(t){let e="string"==typeof t||Array.isArray(t)?{content:K(t)}:t;return X(this.apiKey,this.model,e,this.requestOptions)}async batchEmbedContents(t){return W(this.apiKey,this.model,t,this.requestOptions)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z{constructor(t){this.apiKey=t}getGenerativeModel(t,e){if(!t.model)throw new T("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new Q(this.apiKey,t,e)}}}}]);