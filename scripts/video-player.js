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
        };        this.progress = {
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
          // Initialize custom video controls after DOM is ready
        if (typeof CustomVideoControls !== 'undefined') {
            this.customControls = new CustomVideoControls();
        }
    }

    setupEventListeners() {
        // Topic navigation
        document.querySelectorAll(".topic-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const topic = e.currentTarget.dataset.topic;
                this.switchPlaylist(topic);
            });        });

        // Video items
        document.addEventListener("click", (e) => {
            if (e.target.closest(".video-item")) {
                const videoItem = e.target.closest(".video-item");
                const videoId = videoItem.dataset.video;
                const videoSrc = videoItem.dataset.src;
                this.playVideo(videoId, videoSrc);
            }        });

        // Custom control integration - listen for next/prev events from custom controls
        window.addEventListener('next-video', () => this.nextVideo());
        window.addEventListener('previous-video', () => this.previousVideo());

        // Video events
        const videoElement = document.getElementById("main-video");
        if (videoElement) {
            videoElement.addEventListener("ended", () => this.onVideoEnded());
        }    }

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
        this.currentVideo = videoId;
        const videoElement = document.getElementById("main-video");

        if (videoElement) {
            videoElement.src = videoSrc;

            // Update video title
            const videoData = this.findVideoData(videoId);
            if (videoData) {
                document.getElementById("current-video-title").textContent = videoData.title;
            }

            // Update video item states
            document.querySelectorAll(".video-item").forEach((item) => {
                item.classList.toggle("playing", item.dataset.video === videoId);
            });

            // Try to play video (might fail if no actual video file exists)
            videoElement.play().catch((error) => {
                console.log("Video play failed (expected if no video file):", error);
                // Show placeholder message
                document.getElementById("current-video-title").textContent = `${
                    videoData?.title || "Video"
                } - Demo Mode (No video file)`;
            });
        }
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
    }    togglePlayPause() {
        const videoElement = document.getElementById("main-video");

        if (videoElement.paused) {
            videoElement.play().catch(() => {
                console.log("Play failed - demo mode");
            });
        } else {
            videoElement.pause();
        }
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
        this.updatePlaylistProgress();        // Auto play next video
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
}

// Initialize video player when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const videoPlayer = new VideoPlayerController();

    // Expose to global scope for debugging
    window.videoPlayer = videoPlayer;

    console.log("Video player initialized successfully");
});

export default VideoPlayerController;
