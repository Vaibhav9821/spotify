let circle = document.querySelector(".circle");
let hamburger = document.querySelector(".hamburger");
let Currsong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
  seconds = Math.floor(seconds);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function GetSongs(folder){
   currFolder = folder
let ab = await fetch(`http://127.0.0.1:5500/${currFolder}/`);
let response = await ab.text();
// console.log(response);
let divi = document.createElement("div") ;
 divi.innerHTML = response;
let as = divi.getElementsByTagName("a")
console.log(as);
songs=[]
 for(let i=0; i<as.length;i++){
    const element = as[i];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split(`/${currFolder}/`)[1])
    }
 }

 let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
songUL.innerHTML ="";

for(let song of  songs){
   songUL.innerHTML = songUL.innerHTML+`  <li >
               <img class="invert asdd" id="playpause" src="svg/music.svg" alt="">
               <div class="sna">
                  <div class="sname">${song.replaceAll("%20", " ") }</div>
                  <div class="Sartist"> Song Artist</div>
               </div>
               <div class="fnc">Play Now</div>
               <div class="play fnc"><img class=" asdd invert" src="svg/playbtn.svg" alt="">
               </div>
              </li>`;
     
}

//Attach every song to playfunction
Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
   e.addEventListener("click",element=>{
  console.log(e.querySelector(".sna").firstElementChild.innerHTML);
playMusic(e.querySelector(".sna").firstElementChild.innerHTML.trim());
   
   })
 
   
});
 
}


const playMusic = (track, pause=false)=>{
   // let audio =new Audio("/music/" + track)
   Currsong.src = `${currFolder}/${track}`;
 ;                     
   
   if(!pause){
      Currsong.play();
   }
   playpause.src="svg/pause.svg"  
   document.querySelector(".songInfo").innerHTML =decodeURI(track);
   document.querySelector(".songTime").innerHTML = "00:00";
   document.querySelector(".totalTime").innerHTML = "00:00";
}




async function main(){
  let ab = await fetch(`http://127.0.0.1:5500/music/`);
  let response = await ab.text();

  let divi = document.createElement("div");
  divi.innerHTML = response;
  let anchors = divi.getElementsByTagName("a");

  // find albums
  let albums = Array.from(anchors)
  .map(a => a.href.split("/music/")[1])     // get part after /music/
  .filter(x => x)                           // remove undefined / empty
  .map(name => name.replace("/", ""))       // clean up the trailing slash
  .filter(name => !name.endsWith(".mp3"));  // skip mp3 files

  console.log("Albums:", albums);

  if(albums.length > 0){
    await GetSongs(`music/${albums[0]}`);   // load first album
    if(songs.length > 0){
      playMusic(songs[0], true);            // play first song
      console.log("Songs:", songs);
    }
  }
}



main();

playpause.addEventListener("click",(e)=>{
   if(Currsong.paused){
Currsong.play();
 playpause.src="svg/pause.svg" 
                    
   }else{
      Currsong.pause();
     playpause.src="svg/playbtn.svg"   
   }
 
})

// for song Timer

Currsong.addEventListener("timeupdate", ()=>{
   document.querySelector(".songTime").innerHTML = `${formatTime(Currsong.currentTime)}`;
   document.querySelector(".totalTime").innerHTML = `${formatTime(Currsong.duration)}`;
   circle.style.left =(Currsong.currentTime/Currsong.duration)*100 +"%"
})

//Add an event listener to seekbar
//e.offsetX tells x direction of mouse location where it is clicked
//e.target.getBoundingClientRect().width tells details ofmouse location where it is clicked
document.querySelector(".line").addEventListener("click",(e)=>{
   let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
   console.log(e.target.getBoundingClientRect().width );
   circle.style.left = percent +"%"
  Currsong.currentTime = (Currsong.duration*percent)/100 
})

hamburger.addEventListener("click", ()=>{
   document.querySelector(".left").style.left = 0;
})

document.querySelector(".close").addEventListener("click",()=>{
   document.querySelector(".left").style.left = "-120%"
})
 
previous.addEventListener("click",()=>{
   console.log("previous clicked")
   let index = songs.indexOf(Currsong.src.split("/").splice(-1)[0]);
   if((index-1)>=0){
      playMusic(songs[index-1]);
   }
})


next.addEventListener("click",()=>{
   console.log("next clicked")
   let index = songs.indexOf(Currsong.src.split("/").splice(-1)[0]);
   if((index+1)<songs.length){
      playMusic(songs[index+1]);
   }
})

document.addEventListener("keydown", function(event) {
  // Check if the pressed key is the spacebar
  if (event.code === "Space") {
    event.preventDefault(); // Prevent page scrolling on spacebar

    if (Currsong.paused) {
      Currsong.play();
      playpause.src = "svg/pause.svg";  // Update UI to pause icon
    } else {
      Currsong.pause();
      playpause.src = "svg/playbtn.svg"; // Update UI to play icon
    }
  }
});

document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("input",(event)=>{
console.log(event); 
Currsong.volume = parseInt(event.target.value)/100;
})

//load the playlist when card is clicked

Array.from(document.querySelectorAll(".card")).forEach(element=>{
   element.addEventListener("click", async (item) => {
     
      music = await GetSongs(`music/${item.currentTarget.dataset.folder}`)
      playMusic(songs[0])
   })
})

volImg = document.querySelector(".volume img")
volImg.addEventListener("click", (e)=>{
if(Currsong.volume!==0){
   Currsong.volume = 0;
volImg.src = "svg/mute.svg"
document.getElementById("myRange").disabled = true;
}
else{
   let volumeBar = document.querySelector(".volume input")
   Currsong.volume = volumeBar.value/100;
   volImg.src = "svg/volume.svg"
   document.getElementById("myRange").disabled = false;
}
}) 

// Select playlist container
const cardList = document.querySelector(".Card-list");

// Select arrow buttons
const rightBtn = document.querySelector(".sidebtn img:nth-child(1)"); // right arrow
const leftBtn  = document.querySelector(".sidebtn img:nth-child(2)"); // left arrow

// Scroll amount (in px) — adjust as needed
const scrollAmount = 900;

rightBtn.addEventListener("click", () => {
  cardList.scrollBy({
    left: scrollAmount,
    behavior: "smooth"
  });
});

leftBtn.addEventListener("click", () => {
  cardList.scrollBy({
    left: -scrollAmount,
    behavior: "smooth"
  });
});
