# JS-WebPlayer# HLS Player

A simple and modern web-based HLS (HTTP Live Streaming) player built using **HTML5**, **JavaScript**, and **HLS.js**. This player allows users to select and play various HLS streams, view stream metadata such as bitrate and resolution, switch bitrates manually, and monitor network requests in real time.

## 🎯 Features

- ✅ Play/pause controls  
- ✅ Select between multiple HLS streams  
- ✅ Display stream information:  
  - Bitrate  
  - Resolution  
  - Video/Audio codecs  
- ✅ Manual quality (bitrate) selection  
- ✅ Live log of network requests  
- ✅ Responsive layout with clean UI  

## 🧰 Technologies Used

- HTML5 + CSS3  
- JavaScript (ES6)  
- [HLS.js](https://github.com/video-dev/hls.js)  

## 📁 Project Structure

```
📦 HLS-Player
├── index.html         # Main HTML file
├── style.css          # Styling for the player and UI
└── script.js          # Core logic for video player and HLS.js integration
```

## 🚀 Getting Started

1. Clone or download the repository.  
2. Open `index.html` in your web browser.  
3. Select a stream from the dropdown and press **Play**.  

> ✅ No additional server setup required. Everything runs client-side.

## 📺 Supported Streams

- Big Buck Bunny (demo)  
- Parkour (demo)  
- Tears of Steel (demo)  

You can easily add more `.m3u8` HLS URLs by updating the `<select>` element in `index.html`.

## 🛠️ Future Improvements (Suggestions)

- Keyboard shortcuts for controls  
- Picture-in-picture support  
- Error handling and reconnection logic  
- Dark mode toggle  

## 👤 Author

**Mateusz Purol**  
_MIPaC Project 2025_