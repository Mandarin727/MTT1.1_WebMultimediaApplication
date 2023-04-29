let analyser, audioSourse, audioContext, array, myElements, height, width, num;

num = 50;
array = new Uint8Array(num * 2);
width = 5;

const body = document.querySelector('body');
const musicContainer = document.getElementById('music-container');
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const image = document.getElementById("image");
const currentVolume = document.getElementById('range');  
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const visual = document.getElementById('visual');
let audioVisual = document.getElementById('audio-visual');

const songs = ['Geoffrey day remix - Trava u doma','Smash Mouth - All Star', 'Billie Eilish - Bad Guy', 'Linkin Park - In the end', 'Imagine Dragons - I`m so sorry'];

let songIndex = 0;

loadSong(songs[songIndex]);

function loadSong(song)
{
	title.innerText = song;
	audio.src = `music/${song}.mp3`;
	cover.src = `images/${song}.jpg`;
}

function playSong()
{
	musicContainer.classList.add('play');
	image.src = "icons/pause.png";
  	audio.play();
}

function pauseSong() 
{
	musicContainer.classList.remove('play');
	image.src = "icons/play.png";
	audio.pause();
}

function prevSong() 
{
	songIndex--;

	if (songIndex < 0) 
	{
		songIndex = songs.length - 1;
	}

	loadSong(songs[songIndex]);

	if(!audioContext)
	{
        preparation();
    }

	animate();
	playSong();
}

function nextSong() 
{
	if(!audioContext)
	{
        preparation();
    }	

	songIndex++;

	if (songIndex > songs.length - 1) 
	{
		songIndex = 0;
	}

	loadSong(songs[songIndex]);

	

	animate();
	playSong();
}

function playPause()
{
	audioVisual = document.createElement('div');
	const isPlaying = musicContainer.classList.contains('play');

	
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
}

function updateProgress(e) 
{
	const { duration, currentTime } = e.srcElement;
	const progressPercent = (currentTime / duration) * 100;
	progress.style.width = `${progressPercent}%`;
}

function setProgress(e)
{
	const width = this.clientWidth;
	const clickX = e.offsetX;
	const duration = audio.duration;

	audio.currentTime = (clickX / width) * duration;
}

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
}

function animate()
{
    window.requestAnimationFrame(animate);
    analyser.getByteFrequencyData(array);
	for(let i = 0 ; i < num ; i++)
	{
        height = array[i+num];
        myElements[i].style.minHeight = height +'px';
        myElements[i].style.opacity = 0.009*height;
    }
}

audio.addEventListener('timeupdate', updateProgress);

progressContainer.addEventListener('click', setProgress);

audio.addEventListener('ended', nextSong);

currentVolume.addEventListener("change", changeVolume);

function changeVolume()
{
	audio.volume = currentVolume.value;
}