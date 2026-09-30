
const stages=["Nomor perangkat","Negara","Wilayah","Kota","Status perangkat","Status jaringan","Sinkronisasi data demo","Map preview","Aktivitas perangkat","Pemeriksaan penyimpanan","Finalisasi"];
document.addEventListener("DOMContentLoaded",async()=>{
 const token=sessionStorage.getItem("GW_TOKEN");if(!token){location.href="login.html";return}
 const me=await apiGet({action:"me",token});if(!me.ok){sessionStorage.removeItem("GW_TOKEN");location.href="login.html";return}
 phone2.placeholder=sessionStorage.getItem("pending_demo_phone")||"Masukkan nomor kembali";
 logoutBtn.onclick=async()=>{await apiPost({action:"logout",token});sessionStorage.removeItem("GW_TOKEN");location.href="login.html"};
 scanForm.onsubmit=async e=>{
  e.preventDefault();const p=norm(prefix2.value,phone2.value);if(p.length<9)return;
  startBtn.disabled=true;scanArea.classList.remove("hidden");phoneShown.textContent=p;
  rows.innerHTML=stages.map((x,i)=>`<div class="data-row"><span class="dot"></span><span>${x}${i===0?` <b>${p}</b>`:""}</span><span class="spinner" id="sp${i}"></span></div>`).join("");
  const created=await apiPost({action:"create_job",token,phone:p});if(!created.ok){alert(created.error||"Gagal menyimpan");startBtn.disabled=false;return}
  consoleText.innerHTML=`<div class="console-title">#demo device console</div><div>User: ${me.user.email}</div>`;
  for(let i=0;i<stages.length;i++){const pct=Math.round((i+1)/stages.length*100);progressBar.style.width=pct+"%";percent.textContent=pct+"%";consoleText.innerHTML+=`<div>&gt; ${stages[i]} ... OK</div>`;document.getElementById("sp"+i).classList.add("done");await new Promise(r=>setTimeout(r,480+(i%3)*160))}
  await apiPost({action:"finish_job",token,job_id:created.id,status:"storage_full"});
  fullAlert.classList.add("show");startBtn.disabled=false;
 };
 closeAlert.onclick=()=>fullAlert.classList.remove("show");
});
