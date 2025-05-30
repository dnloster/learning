// Video Player Controller
class VideoPlayerController {
    constructor() {
        this.currentVideo = null;
        this.currentPlaylist = "cpu";
        this.videoData = {
            cpu: [
                { id: "cpu-1", title: "1. Giới thiệu về CPU", src: "videos/cpu-intro.mp4", duration: "15:30" },
                { id: "cpu-2", title: "2. Kiến trúc CPU", src: "videos/cpu-architecture.mp4", duration: "22:45" },
                { id: "cpu-3", title: "3. Bộ lệnh CPU", src: "videos/cpu-instructions.mp4", duration: "18:20" },
                { id: "cpu-4", title: "4. Hiệu năng CPU", src: "videos/cpu-performance.mp4", duration: "25:10" },
                { id: "cpu-5", title: "5. Thực hành với CPU", src: "videos/cpu-practical.mp4", duration: "30:15" },
            ],
            ram: [
                { id: "ram-1", title: "1. Giới thiệu về RAM", src: "videos/ram-intro.mp4", duration: "12:30" },
                { id: "ram-2", title: "2. Các loại RAM", src: "videos/ram-types.mp4", duration: "18:45" },
                { id: "ram-3", title: "3. Hiệu năng RAM", src: "videos/ram-performance.mp4", duration: "20:15" },
                { id: "ram-4", title: "4. Lắp đặt RAM", src: "videos/ram-installation.mp4", duration: "15:30" },
            ],
            rom: [
                { id: "rom-1", title: "1. Giới thiệu về ROM", src: "videos/rom-intro.mp4", duration: "10:20" },
                { id: "rom-2", title: "2. BIOS và UEFI", src: "videos/rom-bios.mp4", duration: "16:40" },
                { id: "rom-3", title: "3. Các loại ROM", src: "videos/rom-types.mp4", duration: "14:15" },
            ],
        };
        this.progress = {
            cpu: { completed: 0, total: 5 },
            ram: { completed: 0, total: 4 },
            rom: { completed: 0, total: 3 },
        };

        this.customControls = null;
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.updateVideoLevels();
        this.switchPlaylist("cpu");

        // Auto-load first video when app starts
        this.autoLoadFirstVideo();

        // Wait for custom controls to be initialized
        this.waitForCustomControls();
    }

    autoLoadFirstVideo() {
        // Auto-load the first CPU video when the app starts
        setTimeout(() => {
            const firstVideo = this.videoData.cpu[0];
            if (firstVideo) {
                console.log("Auto-loading first video:", firstVideo.title);
                this.playVideo(firstVideo.id, firstVideo.src);
            }
        }, 1000); // Delay to ensure all elements are loaded
    }

    waitForCustomControls() {
        const checkControls = () => {
            if (window.customVideoControls) {
                this.customControls = window.customVideoControls;
                console.log("Video player connected to custom controls");

                // Add click event to video element for play/pause with visual feedback
                const videoElement = document.getElementById("main-video");
                if (videoElement) {
                    videoElement.addEventListener("click", () => {
                        this.togglePlayPause();
                        this.showPlayPauseFeedback();
                    });
                }
                // Add enhanced keyboard controls
                document.addEventListener("keydown", (e) => {
                    // Ignore if focus is on input elements
                    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable)
                        return;

                    switch (e.code) {
                        case "Space": // Play/Pause
                            e.preventDefault();
                            this.togglePlayPause();
                            this.showPlayPauseFeedback();
                            break;

                        case "ArrowLeft": // Rewind 5 seconds
                            e.preventDefault();
                            this.seekVideo(-5);
                            break;

                        case "ArrowRight": // Forward 5 seconds
                            e.preventDefault();
                            this.seekVideo(5);
                            break;

                        case "ArrowUp": // Increase volume
                            e.preventDefault();
                            this.adjustVolume(0.1);
                            break;

                        case "ArrowDown": // Decrease volume
                            e.preventDefault();
                            this.adjustVolume(-0.1);
                            break;

                        case "KeyM": // Mute/Unmute
                            e.preventDefault();
                            this.toggleMute();
                            break;

                        case "KeyN": // Next video
                            e.preventDefault();
                            this.playNextVideo();
                            break;

                        case "KeyP": // Previous video
                            e.preventDefault();
                            this.playPreviousVideo();
                            break;

                        case "KeyF": // Toggle fullscreen
                            e.preventDefault();
                            if (this.customControls) {
                                this.customControls.toggleFullscreen();
                            }
                            break;
                    }
                });

                clearInterval(checkInterval);
            }
        };

        const checkInterval = setInterval(checkControls, 100);
    }

    setupCustomControlsIntegration() {
        // Listen for custom control events
        window.addEventListener("next-video", () => this.nextVideo());
        window.addEventListener("previous-video", () => this.previousVideo());

        console.log("Custom controls integration setup complete");
    }

    setupEventListeners() {
        // Topic navigation
        document.querySelectorAll(".topic-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const topic = e.currentTarget.dataset.topic;
                this.switchPlaylist(topic);
            });
        });

        // Video items
        document.addEventListener("click", (e) => {
            if (e.target.closest(".video-item")) {
                const videoItem = e.target.closest(".video-item");
                const videoId = videoItem.dataset.video;
                const videoSrc = videoItem.dataset.src;
                this.playVideo(videoId, videoSrc);
            }
        }); // Custom control integration - listen for next/prev events from custom controls
        // (This will be handled in setupCustomControlsIntegration)

        // Video events
        const videoElement = document.getElementById("main-video");
        if (videoElement) {
            videoElement.addEventListener("ended", () => this.onVideoEnded());
        }
    }

    updateVideoLevels() {
        // Add appropriate classes to video level spans
        document.querySelectorAll(".video-level").forEach((span) => {
            const text = span.textContent.trim();
            span.classList.remove("level-basic", "level-intermediate", "level-advanced", "level-practical");

            switch (text) {
                case "Cơ bản":
                    span.classList.add("level-basic");
                    break;
                case "Trung bình":
                    span.classList.add("level-intermediate");
                    break;
                case "Nâng cao":
                    span.classList.add("level-advanced");
                    break;
                case "Thực hành":
                    span.classList.add("level-practical");
                    break;
            }
        });
    }

    switchPlaylist(topic) {
        this.currentPlaylist = topic;

        // Update topic buttons
        document.querySelectorAll(".topic-btn").forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.topic === topic);
        });

        // Update playlist visibility
        document.querySelectorAll(".video-list").forEach((list) => {
            list.classList.toggle("active", list.id === `${topic}-playlist`);
        });

        // Update playlist title
        const titles = {
            cpu: "Danh sách bài học - CPU",
            ram: "Danh sách bài học - RAM",
            rom: "Danh sách bài học - ROM",
        };

        document.getElementById("playlist-title").textContent = titles[topic];

        // Update progress
        const progress = this.progress[topic];
        document.getElementById("playlist-progress").textContent = `${progress.completed}/${progress.total} hoàn thành`;
    }
    playVideo(videoId, videoSrc) {
        // Check if we actually have a new video to play
        if (this.currentVideo && this.currentVideo.id === videoId) {
            console.log("This video is already playing");
            return;
        }

        console.log("Playing video:", videoId, videoSrc);

        // Get the video element and find the video item in the current playlist
        const videoElement = document.getElementById("main-video");
        const videoItems = document.querySelectorAll(".video-item");
        const videoData = this.findVideoById(videoId);

        if (!videoElement || !videoData) return;

        // Add fade-out transition effect
        this.addVideoTransitionEffect(videoElement);

        // Pause the current video
        videoElement.pause();

        // Update the currentVideo reference
        this.currentVideo = videoData;

        // Update video source and play after a slight delay for transition effect
        setTimeout(() => {
            videoElement.src = videoSrc;

            // When metadata is loaded, play the video
            videoElement.onloadedmetadata = () => {
                // If custom controls are available, reset them
                if (this.customControls) {
                    this.customControls.resetControls();
                }

                // Play the video
                videoElement
                    .play()
                    .then(() => {
                        console.log("Video playback started");
                    })
                    .catch((error) => {
                        console.error("Error playing video:", error);
                    });

                // Remove transition overlay after video starts playing
                this.removeVideoTransitionEffect(videoElement);
            };

            // Update play buttons and UI
            this.updatePlayingStatus(videoId, videoItems);

            // Track video progress
            this.trackVideoProgress(videoId);

            // Update the video levels display
            this.updateVideoLevels();

            // Show feedback that video is starting
            this.showPlayPauseFeedback();
        }, 400); // Short delay for transition effect
    }

    /**
     * Add a transition effect when changing videos
     * @param {HTMLElement} videoElement - The video element
     */
    addVideoTransitionEffect(videoElement) {
        // Check if transition overlay already exists
        if (document.querySelector(".video-transition-overlay")) {
            return;
        }

        // Create transition overlay
        const overlay = document.createElement("div");
        overlay.className = "video-transition-overlay";
        overlay.innerHTML = '<div class="transition-spinner"></div>';

        // Add the overlay to video parent
        videoElement.parentElement.appendChild(overlay);

        // Add the CSS for the transition effect if it doesn't exist yet
        if (!document.getElementById("video-transition-styles")) {
            const style = document.createElement("style");
            style.id = "video-transition-styles";
            style.textContent = `
                .video-transition-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                    z-index: 15;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease forwards;
                    border-radius: 20px;
                }
                
                .transition-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top: 3px solid #4caf50;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .video-transition-overlay.fade-out {
                    animation: fadeOut 0.5s ease forwards;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Remove the transition effect
     * @param {HTMLElement} videoElement - The video element
     */
    removeVideoTransitionEffect(videoElement) {
        const overlay = document.querySelector(".video-transition-overlay");
        if (!overlay) return;

        // Add fade-out animation
        overlay.classList.add("fade-out");

        // Remove overlay after animation completes
        setTimeout(() => {
            overlay?.parentElement?.removeChild(overlay);
        }, 500);
    }

    findVideoData(videoId) {
        for (const playlist of Object.values(this.videoData)) {
            const video = playlist.find((v) => v.id === videoId);
            if (video) return video;
        }
        return null;
    }

    previousVideo() {
        const currentPlaylist = this.videoData[this.currentPlaylist];
        const currentIndex = currentPlaylist.findIndex((v) => v.id === this.currentVideo);

        if (currentIndex > 0) {
            const prevVideo = currentPlaylist[currentIndex - 1];
            this.playVideo(prevVideo.id, prevVideo.src);
        }
    }

    nextVideo() {
        const currentPlaylist = this.videoData[this.currentPlaylist];
        const currentIndex = currentPlaylist.findIndex((v) => v.id === this.currentVideo);

        if (currentIndex < currentPlaylist.length - 1) {
            const nextVideo = currentPlaylist[currentIndex + 1];
            this.playVideo(nextVideo.id, nextVideo.src);
        }
    }
    togglePlayPause() {
        const video = document.getElementById("main-video");
        if (!video) return;

        if (video.paused) {
            video
                .play()
                .then(() => console.log("Video play initiated"))
                .catch((error) => console.error("Error playing video:", error));
        } else {
            video.pause();
        }
    }

    showPlayPauseFeedback() {
        const video = document.getElementById("main-video");
        if (!video) return;

        // Remove any existing feedback elements
        const existingFeedback = video.parentElement.querySelector(".video-action-feedback");
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Create feedback element
        const feedback = document.createElement("div");
        feedback.className = "video-action-feedback";

        // Determine if video will be playing or paused after toggle
        const willPlay = video.paused;

        if (willPlay) {
            feedback.classList.add("play-feedback");
            feedback.innerHTML = '<span class="feedback-icon play">▶</span>';
            console.log("Play feedback shown");
        } else {
            feedback.classList.add("pause-feedback");
            feedback.innerHTML = '<span class="feedback-icon pause">⏸</span>';
            console.log("Pause feedback shown");
        }

        // Add to video player container
        video.parentElement.appendChild(feedback);

        // Trigger show animation
        requestAnimationFrame(() => {
            feedback.classList.add("show");
        });

        // Remove feedback after animation
        setTimeout(() => {
            feedback.classList.add("animate-out");
            setTimeout(() => {
                if (feedback.parentElement) {
                    feedback.remove();
                }
            }, 300);
        }, 800);
    }

    onVideoEnded() {
        // Mark video as completed
        const videoItem = document.querySelector(`[data-video="${this.currentVideo}"]`);
        if (videoItem) {
            const statusSpan = videoItem.querySelector(".video-status");
            statusSpan.textContent = "đã xem";
            statusSpan.classList.add("completed");
        }

        // Update progress
        this.updatePlaylistProgress(); // Auto play next video
        this.nextVideo();
    }

    updatePlaylistProgress() {
        const completedVideos = document.querySelectorAll(
            `#${this.currentPlaylist}-playlist .video-status.completed`
        ).length;
        this.progress[this.currentPlaylist].completed = completedVideos;

        const progress = this.progress[this.currentPlaylist];
        document.getElementById("playlist-progress").textContent = `${progress.completed}/${progress.total} hoàn thành`;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }

    updatePlayingStatus(id, videoItems) {
        // Update the playing status for all videos
        videoItems.forEach((item) => {
            if (item.id === id) {
                if (!item.classList.contains("playing")) {
                    // Add playing class with animation
                    item.classList.add("playing");
                    this.addPlayingAnimation(item);
                }
            } else {
                item.classList.remove("playing");
            }
        });

        // Ensure the playing video is visible in the playlist by scrolling to it
        this.scrollToPlayingVideo();
    }

    /**
     * Add playing animation to the video item
     * @param {HTMLElement} item - The video item element
     */
    addPlayingAnimation(item) {
        // Add a highlight animation
        item.style.animation = "highlightItem 1s ease";

        // Remove the animation after it completes
        setTimeout(() => {
            item.style.animation = "";
        }, 1000);

        // Add animation styles if they don't exist
        if (!document.getElementById("playlist-animation-styles")) {
            const style = document.createElement("style");
            style.id = "playlist-animation-styles";
            style.textContent = `
                @keyframes highlightItem {
                    0% {
                        background: rgba(76, 175, 80, 0.4);
                        transform: translateY(-3px);
                    }
                    100% {
                        background: rgba(76, 175, 80, 0.1);
                        transform: translateY(-3px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Scroll to make sure the currently playing video is visible in the playlist
     */
    scrollToPlayingVideo() {
        const playingItem = document.querySelector(".video-item.playing");
        const playlist = document.querySelector(".video-playlist");

        if (playingItem && playlist) {
            // Get the position of the playing item relative to the playlist
            const itemTop = playingItem.offsetTop;
            const itemHeight = playingItem.offsetHeight;
            const playlistHeight = playlist.offsetHeight;
            const playlistScroll = playlist.scrollTop;

            // If the item is not fully visible, scroll to it
            if (itemTop < playlistScroll || itemTop + itemHeight > playlistScroll + playlistHeight) {
                // Calculate position to scroll to (center the item)
                const scrollTo = itemTop - playlistHeight / 2 + itemHeight / 2;

                // Smooth scroll to the item
                playlist.scrollTo({
                    top: scrollTo,
                    behavior: "smooth",
                });
            }
        }
    }

    /**
     * Seek the video by a specific amount of seconds
     * @param {number} seconds - Seconds to seek (negative for rewind, positive for forward)
     */
    seekVideo(seconds) {
        const videoElement = document.getElementById("main-video");
        if (!videoElement) return;

        // Calculate new time and ensure it's within valid range
        const newTime = Math.min(Math.max(0, videoElement.currentTime + seconds), videoElement.duration);

        // Set the new time
        videoElement.currentTime = newTime;

        // Show a small feedback indication
        this.showSeekFeedback(seconds);

        // Update custom controls if available
        if (this.customControls) {
            this.customControls.updateProgress();
        }
    }

    /**
     * Adjust video volume
     * @param {number} delta - Volume change (-1 to 1)
     */
    adjustVolume(delta) {
        const videoElement = document.getElementById("main-video");
        if (!videoElement) return;

        // Calculate new volume and ensure it's within valid range (0-1)
        const newVolume = Math.min(Math.max(0, videoElement.volume + delta), 1);

        // Set the new volume
        videoElement.volume = newVolume;

        // Update custom controls if available
        if (this.customControls) {
            this.customControls.updateVolumeUI();
        }

        // Show volume change feedback
        this.showVolumeFeedback(newVolume);
    }

    /**
     * Toggle mute/unmute
     */
    toggleMute() {
        const videoElement = document.getElementById("main-video");
        if (!videoElement) return;

        // Toggle mute state
        videoElement.muted = !videoElement.muted;

        // Update custom controls if available
        if (this.customControls) {
            this.customControls.updateVolumeUI();
        }

        // Show feedback
        this.showMuteFeedback(videoElement.muted);
    }

    /**
     * Play the next video in the playlist
     */
    playNextVideo() {
        const currentId = this.currentVideo?.id;
        if (!currentId) return;

        const videos = this.videoData[this.currentPlaylist];
        const currentIndex = videos.findIndex((video) => video.id === currentId);

        if (currentIndex !== -1 && currentIndex < videos.length - 1) {
            const nextVideo = videos[currentIndex + 1];
            this.playVideo(nextVideo.id, nextVideo.src);
        }
    }

    /**
     * Play the previous video in the playlist
     */
    playPreviousVideo() {
        const currentId = this.currentVideo?.id;
        if (!currentId) return;

        const videos = this.videoData[this.currentPlaylist];
        const currentIndex = videos.findIndex((video) => video.id === currentId);

        if (currentIndex > 0) {
            const prevVideo = videos[currentIndex - 1];
            this.playVideo(prevVideo.id, prevVideo.src);
        }
    }

    /**
     * Show visual feedback for seek operations
     * @param {number} seconds - Seconds (negative for rewind, positive for forward)
     */
    showSeekFeedback(seconds) {
        // Create feedback element if it doesn't exist
        let feedback = document.querySelector(".video-seek-feedback");
        if (!feedback) {
            feedback = document.createElement("div");
            feedback.className = "video-seek-feedback";

            // Add to video container
            const videoContainer = document.querySelector(".video-player");
            if (videoContainer) {
                videoContainer.appendChild(feedback);
            } else {
                return; // Exit if container doesn't exist
            }

            // Add CSS if not already added
            if (!document.getElementById("seek-feedback-styles")) {
                const style = document.createElement("style");
                style.id = "seek-feedback-styles";
                style.textContent = `
                    .video-seek-feedback {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        background: rgba(0, 0, 0, 0.7);
                        color: white;
                        padding: 15px;
                        border-radius: 50%;
                        width: 80px;
                        height: 80px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.8rem;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                        backdrop-filter: blur(4px);
                        z-index: 15;
                    }
                    
                    .video-seek-feedback.forward {
                        right: 20%;
                        border: 2px solid rgba(76, 175, 80, 0.5);
                    }
                    
                    .video-seek-feedback.rewind {
                        left: 20%;
                        border: 2px solid rgba(33, 150, 243, 0.5);
                    }
                    
                    .video-seek-feedback.show {
                        opacity: 1;
                        animation: feedbackPulse 0.5s ease;
                    }
                    
                    @keyframes feedbackPulse {
                        0% { transform: translateY(-50%) scale(0.8); }
                        50% { transform: translateY(-50%) scale(1.1); }
                        100% { transform: translateY(-50%) scale(1); }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        // Set content and styles based on direction
        const isForward = seconds > 0;
        const symbol = isForward ? "⏩" : "⏪";
        feedback.innerHTML = `${Math.abs(seconds)}s`;

        // Update classes
        feedback.className = "video-seek-feedback";
        feedback.classList.add(isForward ? "forward" : "rewind");

        // Trigger animation
        setTimeout(() => {
            feedback.classList.add("show");
        }, 10);

        // Remove after delay
        setTimeout(() => {
            feedback.classList.remove("show");
        }, 800);
    }

    /**
     * Show visual feedback for volume changes
     * @param {number} volume - Current volume (0-1)
     */
    showVolumeFeedback(volume) {
        // Create volume feedback element if it doesn't exist
        let feedback = document.querySelector(".video-volume-feedback");
        if (!feedback) {
            feedback = document.createElement("div");
            feedback.className = "video-volume-feedback";

            // Add to video container
            const videoContainer = document.querySelector(".video-player");
            if (videoContainer) {
                videoContainer.appendChild(feedback);
            } else {
                return; // Exit if container doesn't exist
            }

            // Add CSS if not already added
            if (!document.getElementById("volume-feedback-styles")) {
                const style = document.createElement("style");
                style.id = "volume-feedback-styles";
                style.textContent = `
                    .video-volume-feedback {
                        position: absolute;
                        top: 20%;
                        right: 10%;
                        background: rgba(0, 0, 0, 0.7);
                        color: white;
                        padding: 12px;
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                        backdrop-filter: blur(4px);
                        z-index: 15;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }
                    
                    .video-volume-feedback.show {
                        opacity: 1;
                    }
                    
                    .volume-icon {
                        margin-right: 10px;
                        font-size: 1.2rem;
                    }
                    
                    .volume-bar {
                        width: 100px;
                        height: 6px;
                        background: rgba(255, 255, 255, 0.3);
                        border-radius: 3px;
                        overflow: hidden;
                        position: relative;
                    }
                    
                    .volume-level {
                        position: absolute;
                        left: 0;
                        top: 0;
                        height: 100%;
                        background: linear-gradient(90deg, #4caf50, #8bc34a);
                        border-radius: 3px;
                        transition: width 0.2s ease;
                    }
                `;
                document.head.appendChild(style);
            }
        }

        // Set content based on volume
        const volumePercent = Math.round(volume * 100);
        const icon = volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊";

        feedback.innerHTML = `
            <span class="volume-icon">${icon}</span>
            <div class="volume-bar">
                <div class="volume-level" style="width: ${volumePercent}%"></div>
            </div>
        `;

        // Show the feedback
        feedback.classList.add("show");

        // Hide after delay
        clearTimeout(this.volumeFeedbackTimer);
        this.volumeFeedbackTimer = setTimeout(() => {
            feedback.classList.remove("show");
        }, 1500);
    }

    /**
     * Show mute/unmute feedback
     * @param {boolean} isMuted - Whether the video is muted
     */
    showMuteFeedback(isMuted) {
        // Create the volume feedback and then update it
        this.showVolumeFeedback(isMuted ? 0 : document.getElementById("main-video")?.volume || 0.5);
    }
}

// Initialize video player when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const videoPlayer = new VideoPlayerController();

    // Expose to global scope for debugging
    window.videoPlayer = videoPlayer;

    console.log("Video player initialized successfully");
});

export default VideoPlayerController;
