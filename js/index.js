
document.addEventListener("DOMContentLoaded",()=>{
 targetForm.addEventListener("submit",e=>{
  e.preventDefault();const p=norm(prefix.value,phone.value);if(p.length<9)return;
  sessionStorage.setItem("pending_demo_phone",p);location.href="login.html";
 });
});
