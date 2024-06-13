const SPOTIFY_CLIENT_ID = "67b411e20d594f30bf7a8d3bbde54285";
const SPOTIFY_CLIENT_SECRET = "161fc5e3df004b95af3ba8c62f3eaf54";
const PLAYLIST_ID = "5Q5VZcn8fLR1N4upiUvWNl?si=24ebd21262644083";
const container = document.querySelector('div[data-js="tracks"]');
const playlistOwner = document.querySelector('h2[data-js="playlistowner"]');
const playlistCover = document.querySelector('img[data-js="playlistcover"]');
const playlistName = document.querySelector('h2[data-js="playlistname"]');

function fetchPlaylist(token, playlistId) {
  console.log("token: ", token);

  fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.owner && data.owner.display_name) {
        playlistOwner.textContent = data.owner.display_name + "'s";
      }

      if (data.name) {
        playlistName.textContent = "\"" + data.name + "\""
      }

      if (data.tracks && data.tracks.items) {
        data.tracks.items.forEach((item) => {
          console.log(item.track.name);
        });

        if (data.images && data.images[0]) {
          playlistCover.src = data.images[0].url;
        }

        addTracksToPage(data.tracks.items);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function addTracksToPage(items) {
  const ul = document.createElement("ul");

  items.forEach((item) => {
    console.log("track: ", item.track);
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="trackinfo">
        ${
          item.track.album.images[0]
            ? `<img class="albumimage" src="${item.track.album.images[0].url}"></img>`
            : "<p>No image available</p>"
        }
        <p>
          <span class="trackname">${item.track.name} </span>
          <br>
          ${item.track.album.name}
          <br>
          by ${item.track.artists.map((artist) => artist.name).join(", ")}
        </p>
      </div>
      <div class="custom-audio-player" data-url="${item.track.preview_url || ''}">
        ${item.track.preview_url
          ? `<button class="play-pause">Play</button>
             <input type="range" class="seek-bar" value="0">
             <span class="current-time">0:00</span> / 
             <span class="total-time">0:30</span>`
          : "<p>No Preview Available</p>"
        }
      </div>
    `;

    ul.appendChild(li);
  });

  container.appendChild(ul);
  initializeCustomPlayers(); // Ensure this is called here
}

function initializeCustomPlayers() {
  const players = document.querySelectorAll(".custom-audio-player");

  players.forEach(player => {
    const audioUrl = player.dataset.url;
    if (!audioUrl) {
      console.warn("No preview URL available for this track");
      return;
    }

    const audio = new Audio(audioUrl);
    const playPauseButton = player.querySelector(".play-pause");
    const seekBar = player.querySelector(".seek-bar");
    const currentTimeElem = player.querySelector(".current-time");
    const totalTimeElem = player.querySelector(".total-time");

    let isPlaying = false;

    playPauseButton.addEventListener("click", () => {
      if (isPlaying) {
        audio.pause();
        playPauseButton.textContent = "Play";
      } else {
        audio.play();
        playPauseButton.textContent = "Pause";
      }
      isPlaying = !isPlaying;
    });

    audio.addEventListener("timeupdate", () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      seekBar.value = (currentTime / duration) * 100;
      currentTimeElem.textContent = formatTime(currentTime);
    });

    seekBar.addEventListener("input", () => {
      const duration = audio.duration;
      audio.currentTime = (seekBar.value / 100) * duration;
    });

    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      seconds = Math.floor(seconds % 60);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
  });
}

function fetchAccessToken() {
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.access_token) {
        fetchPlaylist(data.access_token, PLAYLIST_ID);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

fetchAccessToken();
