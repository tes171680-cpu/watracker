
document.addEventListener("DOMContentLoaded",()=>{
 adminLoginForm.onsubmit=async e=>{
  e.preventDefault();adminMsg.textContent="";
  try{const d=await apiGet({action:"admin_ping",admin_key:adminKey.value.trim()});if(!d.ok)throw new Error(d.error||"Key salah");sessionStorage.setItem("GW_ADMIN_KEY",adminKey.value.trim());location.href="admin.html"}catch(x){adminMsg.textContent=x.message||String(x)}
 };
});
