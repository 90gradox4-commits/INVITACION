const CONFIG={
 nombre:"Victoria",
 fecha:"2027-01-02T17:00:00",
 whatsapp1:"573142041670",
 whatsapp2:"573107386004",
 mensaje:"Hola, confirmo mi asistencia a los quince años de Victoria Galván Arámbula."
};

document.querySelectorAll(".name").forEach(e=>e.textContent=CONFIG.nombre);

// Música de fondo: intenta iniciar automáticamente al abrir la invitación.
// Si el navegador bloquea el autoplay con sonido, se activa al primer toque/clic.
const audio=document.getElementById("music"),
 play=document.getElementById("playPause"),
 heroPlay=document.getElementById("heroPlay"),
 bar=document.getElementById("musicBar"),
 label=document.getElementById("musicLabel");

function syncMusicUI(){
 const playing=!audio.paused;
 play.textContent=playing?"❚❚":"▶";
 label.textContent=playing?"Música reproduciendo":"Toca para escuchar la canción";
 bar.classList.toggle("playing",playing);
 heroPlay.innerHTML=playing?'❚❚ <span>Pausar música</span>':'▶ <span>Reproducir música</span>';
}
async function startMusic(){
 try{
   await audio.play();
   syncMusicUI();
   return true;
 }catch(e){
   syncMusicUI();
   return false;
 }
}
async function toggleMusic(){
 if(audio.paused){await startMusic();}
 else{audio.pause();syncMusicUI();}
}
play.addEventListener("click",toggleMusic);
heroPlay.addEventListener("click",toggleMusic);
audio.addEventListener("play",syncMusicUI);
audio.addEventListener("pause",syncMusicUI);

// La música comienza al pulsar "ABRIR INVITACIÓN".
// Ese primer toque permite al navegador autorizar la reproducción con sonido.
// El enlace de lista de regalos no tiene ninguna relación con el reproductor.
const welcomeScreen=document.getElementById("welcomeScreen");
const openInvitation=document.getElementById("openInvitation");
document.body.classList.add("welcome-locked");
openInvitation.addEventListener("click",async()=>{
 await startMusic();
 welcomeScreen.classList.add("is-closing");
 document.body.classList.remove("welcome-locked");
 window.setTimeout(()=>welcomeScreen.remove(),800);
},{once:true});

// Confirmación por WhatsApp en los dos números proporcionados.
const message=encodeURIComponent(CONFIG.mensaje);
document.getElementById("whatsapp1").href=`https://wa.me/${CONFIG.whatsapp1}?text=${message}`;
document.getElementById("whatsapp2").href=`https://wa.me/${CONFIG.whatsapp2}?text=${message}`;

// Cuenta regresiva para el inicio de la celebración.
function tick(){
 const d=Math.max(0,new Date(CONFIG.fecha)-Date.now());
 const vals={days:Math.floor(d/86400000),hours:Math.floor(d%86400000/3600000),minutes:Math.floor(d%3600000/60000),seconds:Math.floor(d%60000/1000)};
 Object.entries(vals).forEach(([k,v])=>{const el=document.getElementById(k);if(el)el.textContent=String(v).padStart(2,"0")});
}
tick();setInterval(tick,1000);

// Galería con seis fotografías y visor ampliado.
const photos=Array.from({length:6},(_,i)=>`assets/images/galeria-${i+1}.jpg`);
let current=0;
const lb=document.getElementById("lightbox"),big=document.getElementById("bigImg"),cl=document.getElementById("counterLabel");
function show(i){current=(i+photos.length)%photos.length;big.src=photos[current];cl.textContent=`${current+1} / ${photos.length}`;lb.classList.add("open")}
document.querySelectorAll(".gallery-grid .gallery-item").forEach((a,i)=>a.addEventListener("click",e=>{e.preventDefault();show(i)}));
document.getElementById("prev").onclick=()=>show(current-1);
document.getElementById("next").onclick=()=>show(current+1);
document.getElementById("close").onclick=()=>lb.classList.remove("open");
document.addEventListener("keydown",e=>{if(!lb.classList.contains("open"))return;if(e.key==="ArrowLeft")show(current-1);if(e.key==="ArrowRight")show(current+1);if(e.key==="Escape")lb.classList.remove("open")});

// Animaciones de entrada.
const observer=new IntersectionObserver(entries=>{
 entries.forEach(e=>e.isIntersecting?e.target.classList.add("visible"):e.target.classList.remove("visible"));
},{threshold:.12,rootMargin:"0px 0px -8% 0px"});
document.querySelectorAll(".reveal").forEach((e,i)=>{e.style.transitionDelay=(i%3)*.08+"s";observer.observe(e)});

// Partículas doradas flotando por toda la página.
const particleLayer=document.getElementById("goldParticles");
if(particleLayer && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  for(let i=0;i<46;i++){
    const p=document.createElement("span");
    p.className="gold-particle"+(i%7===0?" star":"");
    p.style.setProperty("--size",(i%5===0?2.6:1.4+Math.random()*3.4)+"px");
    p.style.left=(Math.random()*100)+"%";
    p.style.setProperty("--duration",(10+Math.random()*13)+"s");
    p.style.setProperty("--delay",(-Math.random()*20)+"s");
    p.style.setProperty("--drift1",(-45+Math.random()*90)+"px");
    p.style.setProperty("--drift2",(-80+Math.random()*160)+"px");
    p.style.setProperty("--drift3",(-100+Math.random()*200)+"px");
    p.style.setProperty("--drift4",(-140+Math.random()*280)+"px");
    p.style.animationTimingFunction="linear";
    particleLayer.appendChild(p);
  }
}
