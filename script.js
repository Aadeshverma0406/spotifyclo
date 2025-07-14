console.log("🎧 Spotifi Script Loaded");

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Data ----------
  const songs = [
    { name:"Piya O Re Piya", file:"my.mp3",   cover:"cover9.png", dur:"03:34" },
    { name:"Blinding Lights",file:"your.mp3", cover:"cover10.png",dur:"03:20" },
    { name:"Levitating",     file:"there.mp3",cover:"cover1.jpg", dur:"03:15" }
  ];

  // ---------- Elements ----------
  const listCards  = document.querySelectorAll(".songItem");
  const playMain   = document.getElementById("masterPlay");
  const prevBtn    = document.getElementById("prev");   // ← must match HTML
  const nextBtn    = document.getElementById("next");   // ← must match HTML
  const bar        = document.getElementById("myProgressBar");
  const gif        = document.getElementById("gif");
  const nowTitle   = document.getElementById("currentSongName");

  // ---------- State ----------
  let idx = 0;
  const audio = new Audio(songs[idx].file);

  // ---------- Init song list ----------
  listCards.forEach((c,i)=>{
    c.dataset.i = i;
    c.querySelector("img").src = songs[i].cover;
    c.querySelector(".songName").textContent = songs[i].name;
    // add inline play icon if missing
    if(!c.querySelector(".songItemPlay")){
      const icon = document.createElement("i");
      icon.className = "fa-solid fa-circle-play songItemPlay";
      icon.dataset.i = i;
      c.appendChild(icon);
    }
  });
  updateNowPlaying(idx);

  // ---------- Helpers ----------
  function updateNowPlaying(i){
    nowTitle.textContent = songs[i].name;
  }
  function toggleMainIcon(play){
    playMain.classList.toggle("fa-circle-play", !play);
    playMain.classList.toggle("fa-circle-pause", play);
  }
  function playTrack(i=idx){
    idx = i;
    audio.src = songs[i].file;
    audio.play();
    updateNowPlaying(i);
    gif.style.opacity = 1;
    toggleMainIcon(true);
  }

  // ---------- List click ----------
  document.addEventListener("click", e=>{
    const btn = e.target.closest(".songItemPlay");
    if(!btn) return;
    const i = +btn.dataset.i;
    if(i===idx && !audio.paused){
      audio.pause(); toggleMainIcon(false); gif.style.opacity = 0;
    }else{
      playTrack(i);
    }
  });

  // ---------- Main controls ----------
  playMain.addEventListener("click", ()=>{
    if(audio.paused){ audio.play(); toggleMainIcon(true); }
    else            { audio.pause();toggleMainIcon(false); gif.style.opacity = 0; }
  });
  nextBtn.addEventListener("click", ()=> playTrack((idx+1)%songs.length));
  prevBtn.addEventListener("click", ()=> playTrack((idx-1+songs.length)%songs.length));

  // ---------- Progress bar ----------
  audio.addEventListener("timeupdate", ()=>{
    if(audio.duration) bar.value = (audio.currentTime/audio.duration)*100;
  });
  bar.addEventListener("input", ()=> {
    if(audio.duration) audio.currentTime = (bar.value/100)*audio.duration;
  });

  // ---------- End ----------
  audio.addEventListener("ended", ()=>{
    toggleMainIcon(false); gif.style.opacity = 0;
  });
});
