document.addEventListener("DOMContentLoaded",()=>{
  const form = document.getElementById("signupForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const demoCodeInput = document.getElementById("demoCode");
  const msg = document.getElementById("signupMsg");
  const btn = document.getElementById("signupBtn");

  form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    msg.textContent = "";
    btn.disabled = true;
    btn.textContent = "Membuat akun...";

    try {
      const d = await apiPost({
        action: "signup",
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        demo_code: demoCodeInput.value.trim()
      });

      if (!d.ok) {
        throw new Error(d.error || "Sign up gagal");
      }

      msg.style.color = "#2a8a4a";
      msg.textContent =
        "Akun demo berhasil dibuat. Mengarahkan ke login...";

      setTimeout(()=>{
        location.href = "login.html";
      }, 700);

    } catch (err) {
      msg.style.color = "";
      msg.textContent = err.message || String(err);

      btn.disabled = false;
      btn.textContent = "Sign Up";
    }
  });
});
