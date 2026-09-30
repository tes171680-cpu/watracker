
function apiUrl(){const u=(window.APP_CONFIG||{}).APPS_SCRIPT_URL;if(!u||u.includes("PASTE_"))throw new Error("Apps Script URL belum diisi di js/config.js");return u}
function norm(prefix,v){return String(prefix||"")+String(v||"").replace(/\D/g,"")}
async function apiGet(params){const r=await fetch(apiUrl()+"?"+new URLSearchParams(params));return r.json()}
async function apiPost(params){const r=await fetch(apiUrl(),{method:"POST",body:new URLSearchParams(params)});return r.json()}
