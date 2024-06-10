const SPOTIFY_CLIENT_ID = "67b411e20d594f30bf7a8d3bbde54285";
const SPOTIFY_CLIENT_SECRET = "161fc5e3df004b95af3ba8c62f3eaf54";
const PLAYLIST_ID = "5Q5VZcn8fLR1N4upiUvWNl?si=24ebd21262644083";
const container = document.querySelector('div[data-js="tracks"]');

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

      if (data.tracks && data.tracks.items) {
        data.tracks.items.forEach((item) => {
          console.log(item.track.name);
        });

        addTracksToPage(data.tracks.items);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function addTracksToPage(tracks) {
  const ul = document.createElement("ul");

  tracks.forEach((track) => {
    console.log("track: ", track);
    const li = document.createElement("li");

    // Create a span that holds the album name
    li.innerHTML = `<span class="album">Album: ${track.track.album.name}</span>`;

    // Create another span that holds the track name
    const trackSpan = document.createElement("span");
    trackSpan.textContent = `Track: ${track.track.name}`;
    trackSpan.classList.add("track");
    li.appendChild(trackSpan);

    ul.appendChild(li);
  });
  container.appendChild(ul);
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