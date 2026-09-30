
document.addEventListener("DOMContentLoaded",()=>{
 signupForm.onsubmit=async e=>{
  e.preventDefault(); signupMsg.textContent=""; signupBtn.disabled=true; signupBtn.textContent="Membuat akun...";
  try{
   const d=await apiPost({
    action:"signup",
    name:name.value.trim(),
    email:email.value.trim(),
    phone:phone.value.trim(),
    demo_code:demoCode.value.trim()
   });
   if(!d.ok)throw new Error(d.error||"Sign up gagal");
   signupMsg.style.color="#2a8a4a";
   signupMsg.textContent="Akun demo berhasil dibuat. Mengarahkan ke login...";
   setTimeout(()=>location.href="login.html",700);
  }catch(x){
   signupMsg.style.color="";
   signupMsg.textContent=x.message||String(x);
   signupBtn.disabled=false;signupBtn.textContent="Sign Up";
  }
 };
});
