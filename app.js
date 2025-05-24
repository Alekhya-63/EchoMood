// EchoMood - MoodTunes
// app.js

const moodToQuery = {
    happy: "happy upbeat",
    sad: "sad emotional",
    energetic: "energetic workout",
    relaxed: "relaxing chill",
    romantic: "romantic love"
};

const moodButtons = document.querySelectorAll('.mood-btn');
const tracksContainer = document.getElementById('tracks-container');

moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const mood = btn.getAttribute('data-mood');
        fetchTracksForMood(mood);
    });
});

async function fetchTracksForMood(mood) {
    tracksContainer.innerHTML = '<p>Loading music suggestions...</p>';
    const query = moodToQuery[mood] || mood;
    try {
        // TODO: Replace with your RapidAPI key
        const rapidApiKey = '25043e75b3msh80f15d93ecf8a47p131995jsn9a377867b0c0';
        const response = await fetch(`https://spotify23.p.rapidapi.com/search/?q=${encodeURIComponent(query)}&type=tracks&limit=8`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
            }
        });
        const data = await response.json();
        const tracks = data.tracks?.items || [];
        renderTracks(tracks);
    } catch (error) {
        tracksContainer.innerHTML = '<p>Failed to fetch music. Please try again later.</p>';
        console.error(error);
    }
}

function renderTracks(tracks) {
    if (!tracks.length) {
        tracksContainer.innerHTML = '<p>No tracks found for this mood.</p>';
        return;
    }
    let html = '';
    tracks.forEach(track => {
        const info = track.data;
        const albumArt = info.albumOfTrack?.coverArt?.sources?.[0]?.url || 'https://via.placeholder.com/64x64?text=No+Art';
        const artists = info.artists?.items?.map(a => a.profile.name).join(', ') || 'Unknown Artist';
        html += `
            <div class="track">
                <img src="${albumArt}" alt="Album Art">
                <div class="track-info">
                    <div class="track-title">${info.name}</div>
                    <div class="track-artist">${artists}</div>
                </div>
                <a class="track-link" href="https://open.spotify.com/track/${info.id}" target="_blank">Listen</a>
            </div>
        `;
    });
    tracksContainer.innerHTML = html;
}
