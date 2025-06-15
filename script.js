document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const title = document.getElementById('title');
    const artist = document.getElementById('artist');
    const cover = document.getElementById('cover');
    const progressContainer = document.getElementById('progress-container');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');
    const playlistEl = document.getElementById('playlist');

    const songs = [
        {
            name: 'kesariya',
            title: 'Kesariya',
            artist: 'Pritam, Arijit Singh',
            src: 'Kesariya (PenduJatt.Com.Se).mp3',
        },
        {
            name: 'raatan_lambiyan',
            title: 'Raatan Lambiyan',
            artist: 'Tanishk Bagchi, Jubin Nautiyal, Asees Kaur',
            src: 'Raataan Lambiyan Shershaah 128 Kbps.mp3',
        },
        {
            name: 'peelings',
            title: 'Peelings',
            artist: 'Artist Name for Peelings',
            src: 'Peelings (PenduJatt.Com.Se).mp3',
        },
        {
    name: 'ak_the_tiger',
    title: 'AK - The Tiger',
    artist: 'Unknown',
    src: 'AK - The Tiger.mp3',
},
{
    name: 'kanimaa',
    title: 'Kanimaa',
    artist: 'Unknown',
    src: 'Kanimaa.mp3',
},
{
    name: 'kannadi_poove',
    title: 'Kannadi Poove',
    artist: 'Unknown',
    src: 'Kannadi Poove.mp3',
},

{
    name: 'rise_of_dragon',
    title: 'Rise Of Dragon',
    artist: 'Unknown',
    src: 'Rise Of Dragon.mp3',
},
{
    name: 'vazhithunaiye',
    title: 'Vazhithunaiye',
    artist: 'Unknown',
    src: 'Vazhithunaiye.mp3',
}
    ];

    let songIndex = 0;
    let isPlaying = false;

    function loadSong(song) {
        title.textContent = song.title;
        artist.textContent = song.artist;
        audio.src = song.src;
        cover.src = song.cover;
        updatePlaylistActive();
    }

    function playSong() {
        isPlaying = true;
        playBtn.classList.replace('fa-play', 'fa-pause');
        playBtn.title = 'Pause';
        audio.play();
    }

    function pauseSong() {
        isPlaying = false;
        playBtn.classList.replace('fa-pause', 'fa-play');
        playBtn.title = 'Play';
        audio.pause();
    }

    function prevSong() {
        songIndex--;
        if (songIndex < 0) {
            songIndex = songs.length - 1;
        }
        loadSong(songs[songIndex]);
        playSong();
    }

    function nextSong() {
        songIndex++;
        if (songIndex > songs.length - 1) {
            songIndex = 0;
        }
        loadSong(songs[songIndex]);
        playSong();
    }

    function updateProgress(e) {
        if (isPlaying) {
            const { duration, currentTime } = e.srcElement;
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = `${progressPercent}%`;

            const minutes = Math.floor(currentTime / 60);
            let seconds = Math.floor(currentTime % 60);
            if (seconds < 10) {
                seconds = `0${seconds}`;
            }
            currentTimeEl.textContent = `${minutes}:${seconds}`;

            if (duration && !isNaN(duration) && durationEl.textContent === '0:00') {
                const totalMinutes = Math.floor(duration / 60);
                let totalSeconds = Math.floor(duration % 60);
                if (totalSeconds < 10) {
                    totalSeconds = `0${totalSeconds}`;
                }
                durationEl.textContent = `${totalMinutes}:${totalSeconds}`;
            }
        }
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    function setVolume() {
        audio.volume = volumeSlider.value;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        if (secs < 10) {
            secs = `0${secs}`;
        }
        return `${minutes}:${secs}`;
    }

    function buildPlaylist() {
        playlistEl.innerHTML = '';
        songs.forEach((song, index) => {
            const listItem = document.createElement('li');
            listItem.dataset.index = index;
            listItem.innerHTML = `
                <span class="song-title-list">${song.title} - ${song.artist}</span>
                <span class="song-duration-list">Loading...</span>
            `;
            listItem.addEventListener('click', () => {
                songIndex = index;
                loadSong(songs[songIndex]);
                playSong();
            });
            playlistEl.appendChild(listItem);

            const tempAudio = new Audio(song.src);
            tempAudio.addEventListener('loadedmetadata', () => {
                listItem.querySelector('.song-duration-list').textContent = formatTime(tempAudio.duration);
            });
        });
        updatePlaylistActive();
    }

    function updatePlaylistActive() {
        Array.from(playlistEl.children).forEach((item, index) => {
            if (index === songIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    audio.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);
    audio.addEventListener('ended', nextSong);
    volumeSlider.addEventListener('input', setVolume);

    loadSong(songs[songIndex]);
    audio.volume = volumeSlider.value;
    buildPlaylist();
});
