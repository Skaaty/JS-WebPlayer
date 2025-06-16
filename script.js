// DOM Elements
const video = document.getElementById('video-player');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const streamSelect = document.getElementById('stream-select');
const qualityControls = document.getElementById('quality-controls');
const bitrateValue = document.getElementById('bitrate-value');
const resolutionValue = document.getElementById('resolution-value');
const videoCodec = document.getElementById('video-codec');
const audioCodec = document.getElementById('audio-codec');
const logContainer = document.getElementById('log-container');
const ipValue = document.getElementById('ip-value');
const countryFlag = document.getElementById('country-flag');
const countryName = document.getElementById('country-name');
const accessStatus = document.getElementById('access-status');

let hls;
let currentLevel = -1;
let ipAddress = '';
let countryCode = '';

// Initialize player
function initPlayer() {
    if (hls) {
        hls.destroy();
    }
    
    const streamUrl = streamSelect.value;
    if (Hls.isSupported()) {
        hls = new Hls({
            debug: false,
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });
        
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        
        // Event listeners
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            generateQualityControls();
            video.play();
        });
        
        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
            currentLevel = data.level;
            updateStreamInfo();
        });
        
        hls.on(Hls.Events.FRAG_LOADING, (event, data) => {
            logRequest(data.frag.url, 'Fragment');
        });
        
        hls.on(Hls.Events.LEVEL_LOADING, (event, data) => {
            logRequest(data.url, 'Playlist');
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log('Network error. Trying to recover...');
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log('Media error. Trying to recover...');
                        hls.recoverMediaError();
                        break;
                    default:
                        console.log('Unrecoverable error. Please reload the player.');
                        break;
                }
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', () => {
            updateStreamInfo();
        });
    }
}

// Generate quality controls based on available levels
function generateQualityControls() {
    qualityControls.innerHTML = '';
    
    if (hls && hls.levels && hls.levels.length > 0) {
        hls.levels.forEach((level, index) => {
            const btn = document.createElement('button');
            btn.classList.add('quality-btn');
            if (index === currentLevel) {
                btn.classList.add('active');
            }
            
            const bitrate = Math.round(level.bitrate / 1000);
            btn.textContent = `${bitrate} Kbps`;
            
            btn.addEventListener('click', () => {
                hls.currentLevel = index;
                document.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
            
            qualityControls.appendChild(btn);
        });
    } else {
        const message = document.createElement('p');
        message.textContent = 'Manual quality switching not available';
        message.style.color = '#999';
        qualityControls.appendChild(message);
    }
}

function updateStreamInfo() {
    if (hls && hls.levels && hls.levels.length > 0 && currentLevel >= 0) {
        const level = hls.levels[currentLevel];
        const bitrate = Math.round(level.bitrate / 1000);
        const resolution = `${level.width}x${level.height}`;
        
        bitrateValue.textContent = `${bitrate} Kbps`;
        resolutionValue.textContent = resolution;
        
        const codecs = level.videoCodec ? level.videoCodec.split('.') : [];
        if (codecs.length > 0) {
            videoCodec.textContent = codecs[0];
        }
        
        if (level.audioCodec) {
            audioCodec.textContent = level.audioCodec;
        }
    } else if (video.videoWidth) {
        const resolution = `${video.videoWidth}x${video.videoHeight}`;
        resolutionValue.textContent = resolution;
    }
}

// Log network requests
function logRequest(url, type) {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    
    const logEntry = document.createElement('div');
    logEntry.classList.add('log-entry');
    logEntry.innerHTML = `
        <span class="log-time">[${timeString}]</span> 
        <span class="log-type">${type}:</span>
        <span class="log-url">${url}</span>
    `;
    
    logContainer.prepend(logEntry);
    
    if (logContainer.children.length > 20) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

// Event listeners
playBtn.addEventListener('click', () => {
    video.play();
});

pauseBtn.addEventListener('click', () => {
    video.pause();
});

streamSelect.addEventListener('change', () => {
    initPlayer();
});

// Initialize everything when the page loads
window.addEventListener('load', () => {
    initPlayer();
    
    // Update stream info periodically
    setInterval(updateStreamInfo, 2000);
});