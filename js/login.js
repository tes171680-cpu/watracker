
document.addEventListener("DOMContentLoaded",()=>{
 loginForm.addEventListener("submit",async e=>{
  e.preventDefault();loginError.textContent="";
  try{
   const d=await apiPost({action:"login",email:email.value.trim(),demo_code:demoCode.value});
   if(!d.ok)throw new Error(d.error||"Login gagal");
   sessionStorage.setItem("GW_TOKEN",d.token);location.href="scan.html";
  }catch(x){loginError.textContent=x.message||String(x)}
 });
});
