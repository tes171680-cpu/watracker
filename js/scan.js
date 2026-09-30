
const steps=[
 {label:"Nomor perangkat",value:"phone"},
 {label:"Country",value:"Indonesia"},
 {label:"Account verification",value:"✓"},
 {label:"Messaging service",value:"checking"},
 {label:"Media service",value:"checking"},
 {label:"Region",value:"Demo Region"},
 {label:"City",value:"Demo City"},
 {label:"Current Geolocation",value:"demo only"},
 {label:"Movement History",value:"demo only"},
 {label:"Call Logs and Saved Contacts",value:"not accessed"},
 {label:"Wi-Fi Hotspots",value:"not accessed"},
 {label:"Network Address",value:"demo"}
];

function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
function rowHtml(step,i,phone){
 const shown=step.value==="phone"?phone:step.value;
 let right=`<span class="spinner wait" id="sp${i}"></span>`;
 return `<div class="data-row" id="row${i}">
   <span class="dot"></span>
   <span>${step.label}${i===0?` <b>${phone}</b>`:""}</span>
   <span class="value-right" id="val${i}">${right}</span>
 </div>`;
}
function finishRow(i,val){
 const el=document.getElementById("val"+i);
 if(!el)return;
 if(val==="✓") el.innerHTML='<span class="value-check">✓</span>';
 else if(val==="demo only") el.innerHTML='<span class="value-chip">defined</span>';
 else if(val==="not accessed") el.innerHTML='<span class="muted">not accessed</span>';
 else if(val==="checking") el.innerHTML='<span class="value-check">✓</span>';
 else if(val==="phone") el.innerHTML='<span class="value-check">✓</span>';
 else el.textContent=val;
}
function line(txt,cls=""){consoleText.innerHTML+=`<div class="${cls}">${txt}</div>`;consoleText.scrollTop=consoleText.scrollHeight}

document.addEventListener("DOMContentLoaded",async()=>{
 const token=sessionStorage.getItem("GW_TOKEN");
 if(!token){location.href="login.html";return}
 const me=await apiGet({action:"me",token});
 if(!me.ok){sessionStorage.removeItem("GW_TOKEN");location.href="login.html";return}

 const pending=sessionStorage.getItem("pending_demo_phone")||"";
 phone2.placeholder=pending||"Masukkan nomor kembali";
 todayLabel.textContent=new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"});
 apiId.textContent="demo-"+Math.random().toString(16).slice(2,18);

 logoutBtn.onclick=async()=>{apiPost({action:"logout",token}).catch(()=>{});sessionStorage.removeItem("GW_TOKEN");location.href="login.html"};

 scanForm.onsubmit=async e=>{
  e.preventDefault();
  const p=norm(prefix2.value,phone2.value);
  if(p.length<9)return;

  startBtn.disabled=true; startBtn.textContent="Searching...";
  scanArea.classList.remove("hidden");
  downloadLine.classList.remove("hidden");
  phoneShown.textContent=p; accountPhone.textContent=p;

  rows.innerHTML=steps.map((x,i)=>rowHtml(x,i,p)).join("");
  progressBar.style.width="2%";percent.textContent="2%";
  scanMessage.innerHTML=`Check user phone number &nbsp; <b>${p}</b> ;`;
  consoleText.innerHTML='<div class="cyan">#demo server console</div><div>Debian GNU/Linux simulation console.</div>';
  line("API ID: "+apiId.textContent,"dim");
  line("Initializing local UI simulation ...","green");

  // Start DB write in background so UI does not wait for Apps Script cold-start.
  const jobPromise=apiPost({action:"create_job",token,phone:p}).catch(()=>({ok:false}));

  let downloadedMB=0;
  for(let i=0;i<steps.length;i++){
    // faster: around 300-420ms each = ~4-5 sec total
    await sleep(260+(i%3)*70);

    const pct=Math.min(96,Math.round(((i+1)/steps.length)*92)+4);
    progressBar.style.width=pct+"%"; percent.textContent=pct+"%";

    downloadedMB += 18 + (i*3.7);
    downloaded.textContent=downloadedMB.toFixed(2)+" MB";
    speed.textContent=(48+Math.random()*45).toFixed(2)+" MB/s";
    filesPerSec.textContent="—"+Math.floor(8+Math.random()*18)+"/s";

    finishRow(i,steps[i].value);
    const safeLog = [
      "Checking service endpoint ... OK",
      "Reading demo network metadata ... OK",
      "Loading UI dataset ... OK",
      "Preparing map preview ... OK",
      "Synchronizing demo status ... OK"
    ][i%5];
    line("> "+safeLog, i%2===0?"green":"");
    if(i===5){
      scanMessage.textContent="Incoming and outgoing service simulation";
      totalSize.textContent="1.92 GB";
    }
  }

  progressBar.style.width="100%";percent.textContent="100%";
  speed.textContent="0.00 MB/s";filesPerSec.textContent="—0/s";
  line("> Simulation finished.","green");
  line("> Storage capacity check: FULL","redact");

  // Finish DB status when/if Apps Script responds, without blocking the UX.
  jobPromise.then(d=>{
    if(d&&d.ok) apiPost({action:"finish_job",token,job_id:d.id,status:"storage_full"}).catch(()=>{});
  });

  await sleep(350);
  fullAlert.classList.add("show");
  startBtn.disabled=false; startBtn.textContent="Start Search";
 };
 closeAlert.onclick=()=>fullAlert.classList.remove("show");
});
