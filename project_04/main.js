const SPOTIFY_CLIENT_ID = "67b411e20d594f30bf7a8d3bbde54285";
const SPOTIFY_CLIENT_SECRET = "161fc5e3df004b95af3ba8c62f3eaf54";
const PLAYLIST_ID = "5Q5VZcn8fLR1N4upiUvWNl?si=24ebd21262644083";
const container = document.querySelector('div[data-js="tracks"]');
const playlistOwner = document.querySelector('h2[data-js="playlistowner"]');


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
        playlistOwner.textContent = data.owner.display_name;
      }

      if (data.tracks && data.tracks.items) {
        data.tracks.items.forEach((item) => {
          console.log(item.track.name);
        });

        if (data.images && data.images.length > 0) {
          displayCoverImage(data.images[0].url);
        }

        addTracksToPage(data.tracks.items);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayOwner(owner) {
  const ownerDiv = document.createElement("div");
  ownerDiv.innerHTML = `<h2>${owner}'s </h2>`;
  container.appendChild(ownerDiv);
}

function displayCoverImage(imageUrl) {
  const coverImageDiv = document.createElement("div");
  coverImageDiv.innerHTML = `<img src="${imageUrl}" alt="Playlist Cover Image" style="width: 200px; height: 200px;">`;
  container.appendChild(coverImageDiv);
}

function addTracksToPage(items) {
  const ul = document.createElement("ul");



  items.forEach((item) => {
    console.log("track: ", item.track);
    const li = document.createElement("li");

    // SONG LIST

    li.innerHTML = `
     
    <div class="trackinfo">


                      ${
            item.track.album.images[0]
              ? `<img class="albumimage" src="${item.track.album.images[0].url}"></img>`
              : "<p>No imgage available</p>"
          }

    
    <p><span class="trackname">${item.track.name} </span>

          <br>

           ${item.track.album.name}
         

      <br>
      by ${item.track.artists

      .map((artist) => artist.name)
      .join(", ")}
     
      </div>



      </p>

          ${
            item.track.preview_url
              ? `<audio controls src="${item.track.preview_url}"></audio>`
              : "<p>No preview available</p>"
          }



        `;

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