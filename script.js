let analyser, audioSourse, audioContext, array, myElements, height, width;
let currentVolume = document.getElementById('range');  
let num = 64;
array = new Uint8Array(num * 2);
width = 5;

let body = document.querySelector('body');

let visual = document.getElementById('visual');

const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
	
const audio = document.getElementById('audio');
let audioVisual = document.getElementById('audio-visual');


const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const currTime = document.querySelector('#currTime');
const durTime = document.querySelector('#durTime');



// Song titles
const songs = ['Geoffrey day remix - Trava u doma','Smash Mouth - All Star', 'Billie Eilish - Bad Guy', 'Linkin Park - In the end', 'Imagine Dragons - I`m so sorry'];

// Keep track of song
let songIndex = 0;


// Initially load song details into DOM
loadSong(songs[songIndex]);

// Update song details
function loadSong(song)
{
	title.innerText = song;
	audio.src = `music/${song}.mp3`;
	cover.src = `images/${song}.jpg`;
}


// Play song
function playSong()
{
	musicContainer.classList.add('play');
  	playBtn.querySelector('i.fas').classList.remove('fa-play');
  	playBtn.querySelector('i.fas').classList.add('fa-pause');

  	audio.play();
}


// Pause song
function pauseSong() {
	musicContainer.classList.remove('play');
	playBtn.querySelector('i.fas').classList.add('fa-play');
	playBtn.querySelector('i.fas').classList.remove('fa-pause');

	audio.pause();
}

// Previous song
function prevSong() 
{
	songIndex--;

	if (songIndex < 0) 
	{
		songIndex = songs.length - 1;
	}

	loadSong(songs[songIndex]);

	playSong();
}

// Next song
function nextSong() 
{
	songIndex++;

	if (songIndex > songs.length - 1) 
	{
		songIndex = 0;
	}

	loadSong(songs[songIndex]);

	playSong();
}




// Update progress bar
function updateProgress(e) 
{
	const { duration, currentTime } = e.srcElement;
	const progressPercent = (currentTime / duration) * 100;
	progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) 
{
	const width = this.clientWidth;
	const clickX = e.offsetX;
	const duration = audio.duration;

	audio.currentTime = (clickX / width) * duration;
}

//get duration & currentTime for Time of song
function DurTime (e) 
{
	const {duration,currentTime} = e.srcElement;
	var sec;
	var sec_d;

	// define minutes currentTime
	let min = (currentTime==null)? 0:
	 Math.floor(currentTime/60);
	 min = min <10 ? '0'+min:min;

	// define seconds currentTime
	function get_sec (x) 
	{
		if(Math.floor(x) >= 60)
		{
			
			for (var i = 1; i<=60; i++)
			{
				if(Math.floor(x)>=(60*i) && Math.floor(x)<(60*(i+1))) 
				{
					sec = Math.floor(x) - (60*i);
					sec = sec <10 ? '0'+sec:sec;
				}
			}
		}
		else
		{
		 	sec = Math.floor(x);
		 	sec = sec <10 ? '0'+sec:sec;
		}
	} 

	get_sec (currentTime,sec);

	// change currentTime DOM
	currTime.innerHTML = min +':'+ sec;

	// define minutes duration
	let min_d = (isNaN(duration) === true)? '0':
		Math.floor(duration/60);
	 min_d = min_d <10 ? '0'+min_d:min_d;


	 function get_sec_d (x) 
	{
		if(Math.floor(x) >= 60)
		{
			
			for (var i = 1; i<=60; i++){
				if(Math.floor(x)>=(60*i) && Math.floor(x)<(60*(i+1))) 
				{
					sec_d = Math.floor(x) - (60*i);
					sec_d = sec_d <10 ? '0'+sec_d:sec_d;
				}
			}
		}
		else
		{
		 	sec_d = (isNaN(duration) === true)? '0':
		 	Math.floor(x);
		 	sec_d = sec_d <10 ? '0'+sec_d:sec_d;
		 }
	} 

	// define seconds duration
	
	get_sec_d (duration);

	// change duration DOM
	durTime.innerHTML = min_d +':'+ sec_d;
		
};

function preparation()
{
	for(let i = 0 ; i < num; i++)
	{
        audioVisual = document.createElement('div');
        audioVisual.className = 'audio-visual';
		audioVisual.style.background = 'linear-gradient(0deg, rgba(35, 90, 255, 0.747) 20%,rgba(255, 255, 255, 0.7)100%)';
        audioVisual.style.minWidth = width+'px';
        body.appendChild(audioVisual);
    }

	myElements = document.getElementsByClassName('audio-visual');
	audioContext = new AudioContext();
	analyser = audioContext.createAnalyser();
	audioSourse = audioContext.createMediaElementSource(audio);
	audioSourse.connect(analyser);
	analyser.connect(audioContext.destination);

    animate();
}

function animate()
{
	if(!audio.paused)
	{
        window.requestAnimationFrame(animate);
    }

    analyser.getByteFrequencyData(array);
	for(let i = 0 ; i < num ; i++)
	{
        height = array[i+num];
        myElements[i].style.minHeight = height +'px';
        myElements[i].style.opacity = 0.009*height;
    }
}


// Event listeners
playBtn.addEventListener('click', () =>
{

	const isPlaying = musicContainer.classList.contains('play');
	audioVisual = document.createElement('div');
	
	if(!audioContext)
	{
        preparation();
    }		

	if (isPlaying) 
	{
		
		pauseSong();
	} 
	else 
	{
		playSong();
		animate();
	}
	
});

// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time/song update
audio.addEventListener('timeupdate', updateProgress);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', nextSong);

// Time of song
audio.addEventListener('timeupdate', DurTime);

currentVolume.addEventListener("change", changeVolume);

function changeVolume()
{
	audio.volume = currentVolume.value;
}