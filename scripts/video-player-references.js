// Video Player Controller for References Page
class VideoPlayerController {
    constructor() {
        this.currentVideo = null;
        this.currentPlaylist = "cpu";
        this.isChangingVideo = false;
        this.videoChangeDebounce = null;
        this.videoData = {
            cpu: [
                {
                    id: "cpu-ref-1",
                    title: "1. CPU - Khái niệm cơ bản",
                    src: "videos/cpu-basics-reference.mp4",
                    thumb: "images/cpu-thumb-1.jpg",
                    duration: "12:45",
                    completed: false,
                },
                {
                    id: "cpu-ref-2",
                    title: "2. CPU - Kiến trúc nâng cao",
                    src: "videos/cpu-advanced-reference.mp4",
                    thumb: "images/cpu-thumb-2.jpg",
                    duration: "18:30",
                    completed: false,
                },
                {
                    id: "cpu-ref-3",
                    title: "3. CPU - So sánh và lựa chọn",
                    src: "videos/cpu-comparison-reference.mp4",
                    thumb: "images/cpu-thumb-3.jpg",
                    duration: "15:20",
                    completed: false,
                },
            ],
            boNhoTrong: [
                {
                    id: "ram-ref-1",
                    title: "1. RAM - Nguyên lý hoạt động",
                    src: "videos/ram-principles-reference.mp4",
                    thumb: "images/ram-thumb-1.jpg",
                    duration: "14:15",
                    completed: false,
                },
                {
                    id: "ram-ref-2",
                    title: "2. RAM - Các loại và ứng dụng",
                    src: "videos/ram-types-reference.mp4",
                    thumb: "images/ram-thumb-2.jpg",
                    duration: "16:40",
                    completed: false,
                },
                {
                    id: "rom-ref-1",
                    title: "3. ROM - Bộ nhớ chỉ đọc",
                    src: "videos/rom-basics-reference.mp4",
                    thumb: "images/rom-thumb-1.jpg",
                    duration: "11:30",
                    completed: false,
                },
                {
                    id: "rom-ref-2",
                    title: "4. BIOS/UEFI và Firmware",
                    src: "videos/bios-firmware-reference.mp4",
                    thumb: "images/rom-thumb-2.jpg",
                    duration: "13:25",
                    completed: false,
                },
            ],
            boNhoNgoai: [
                {
                    id: "hdd-ref-1",
                    title: "1. Ổ cứng HDD - Cơ bản",
                    src: "videos/hdd-basics-reference.mp4",
                    thumb: "images/cpu-thumb-4.jpg",
                    duration: "13:50",
                    completed: false,
                },
                {
                    id: "ssd-ref-1",
                    title: "2. Ổ cứng SSD - Công nghệ mới",
                    src: "videos/ssd-technology-reference.mp4",
                    thumb: "images/cpu-thumb-5.jpg",
                    duration: "15:30",
                    completed: false,
                },
                {
                    id: "storage-ref-1",
                    title: "3. Lưu trữ đám mây",
                    src: "videos/cloud-storage-reference.mp4",
                    thumb: "images/ram-thumb-3.jpg",
                    duration: "12:20",
                    completed: false,
                },
                {
                    id: "backup-ref-1",
                    title: "4. Sao lưu và phục hồi dữ liệu",
                    src: "videos/backup-recovery-reference.mp4",
                    thumb: "images/ram-thumb-4.jpg",
                    duration: "14:40",
                    completed: false,
                },
            ],
        };

        this.progress = {
            cpu: { completed: 0, total: this.videoData.cpu.length },
            boNhoTrong: { completed: 0, total: this.videoData.boNhoTrong.length },
            boNhoNgoai: { completed: 0, total: this.videoData.boNhoNgoai.length },
        };

        this.customControls = null;
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.updateVideoLevels();
        this.generateAccordionPlaylist();
        this.switchPlaylist("cpu");
        this.autoLoadFirstVideo();
        this.waitForCustomControls();
        this.loadCompletionStatus();
    } // Removed chapter functionality for references page
    getChapterForVideo() {
        // No chapters in references page
        return [];
    }

    updateVideoLevels() {
        // Placeholder for video levels update logic
    }

    generateAccordionPlaylist() {
        const accordionContainer = document.getElementById("accordion-playlist");
        if (!accordionContainer) {
            console.error("Accordion playlist container not found!");
            return;
        }

        accordionContainer.innerHTML = "";

        const topicIcons = {
            cpu: "💻",
            boNhoTrong: "🧠",
            boNhoNgoai: "💽",
        };

        const topicTitles = {
            cpu: "CPU - Bộ xử lý trung tâm",
            boNhoTrong: "Bộ nhớ trong (RAM, ROM)",
            boNhoNgoai: "Bộ nhớ ngoài",
        };

        for (const topic in this.videoData) {
            const videos = this.videoData[topic];
            const isFirstTopic = topic === "cpu";

            const accordionItem = document.createElement("div");
            accordionItem.className = `accordion-item ${isFirstTopic ? "active" : ""}`;

            const header = document.createElement("div");
            header.className = "accordion-header";
            header.innerHTML = `
                <span class="topic-icon">${topicIcons[topic] || "📚"}</span>
                <span class="topic-title">${topicTitles[topic] || topic.toUpperCase()}</span>
                <span class="accordion-icon">▼</span>
            `;

            const content = document.createElement("div");
            content.className = "accordion-content";

            videos.forEach((video, index) => {
                const videoItem = document.createElement("div");
                videoItem.className = "video-item";
                videoItem.dataset.video = video.id;
                videoItem.dataset.src = video.src;

                if (isFirstTopic && index === 0) {
                    videoItem.classList.add("active");
                }

                const thumbnailSrc = video.thumb;

                videoItem.innerHTML = `
                    <div class="video-thumbnail">
                        <img src="${thumbnailSrc}" alt="${video.title}">
                        <span class="video-duration">${video.duration}</span>
                    </div>
                    <div class="video-info">
                        <h4>${video.title}</h4>
                        <p>Bài học ${index + 1} - ${topic.toUpperCase()}</p>
                    </div>
                `;

                content.appendChild(videoItem);
            });

            accordionItem.appendChild(header);
            accordionItem.appendChild(content);
            accordionContainer.appendChild(accordionItem);
        }

        this.setupAccordionEvents();
    }

    setupAccordionEvents() {
        const accordionHeaders = document.querySelectorAll(".accordion-header");

        accordionHeaders.forEach((header) => {
            header.addEventListener("click", () => {
                const accordionItem = header.parentElement;
                const isActive = accordionItem.classList.contains("active");

                document.querySelectorAll(".accordion-item").forEach((item) => {
                    item.classList.remove("active");
                });

                if (!isActive) {
                    accordionItem.classList.add("active");
                }
            });
        });

        document.addEventListener("click", (e) => {
            const videoItem = e.target.closest(".video-item");
            if (videoItem) {
                const videoId = videoItem.dataset.video;
                const videoSrc = videoItem.dataset.src;
                if (videoId && videoSrc) {
                    this.playVideo(videoId, videoSrc);
                }
            }
        });
    }

    autoLoadFirstVideo() {
        setTimeout(() => {
            const firstVideo = this.videoData.cpu[0];
            if (firstVideo) {
                this.playVideo(firstVideo.id, firstVideo.src);
            }
        }, 1000);
    }

    waitForCustomControls() {
        const checkControls = () => {
            if (window.customVideoControls) {
                this.customControls = window.customVideoControls;

                document.addEventListener("keydown", (e) => {
                    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable)
                        return;

                    switch (e.code) {
                        case "Space":
                            e.preventDefault();
                            this.togglePlayPause();
                            break;
                        case "ArrowLeft":
                            e.preventDefault();
                            this.seekVideo(-5);
                            break;
                        case "ArrowRight":
                            e.preventDefault();
                            this.seekVideo(5);
                            break;
                        case "KeyM":
                            e.preventDefault();
                            this.toggleMute();
                            break;
                    }
                });

                clearInterval(checkInterval);
            }
        };

        const checkInterval = setInterval(checkControls, 100);
    }

    setupEventListeners() {
        window.addEventListener("previous-video", () => {
            this.previousVideo();
        });

        window.addEventListener("next-video", () => {
            this.nextVideo();
        });

        const prevVideoBtn = document.getElementById("prev-video-btn");
        const nextVideoBtn = document.getElementById("next-video-btn");

        if (prevVideoBtn) {
            prevVideoBtn.addEventListener("click", () => {
                this.previousVideo();
            });
        }

        if (nextVideoBtn) {
            nextVideoBtn.addEventListener("click", () => {
                this.nextVideo();
            });
        }

        const videoElement = document.getElementById("main-video");
        if (videoElement) {
            videoElement.addEventListener("timeupdate", () => {
                this.onVideoTimeUpdate();
            });

            videoElement.addEventListener("ended", () => {
                this.onVideoEnded();
            });
        }
    }

    onVideoTimeUpdate() {
        const videoElement = document.getElementById("main-video");
        if (!videoElement || !this.currentVideo) return;

        const currentTime = videoElement.currentTime;
        const duration = videoElement.duration;

        if (!duration || duration <= 0 || isNaN(duration) || isNaN(currentTime)) {
            return;
        }

        if (videoElement.paused) {
            return;
        }

        const progressPercent = (currentTime / duration) * 100;

        if (progressPercent >= 75 && !this.currentVideo.completed) {
            if (currentTime >= 5) {
                this.markVideoAsCompleted(this.currentVideo.id);
            }
        }
    }

    markVideoAsCompleted(videoId) {
        if (!this.currentVideo || this.currentVideo.id !== videoId) {
            return;
        }

        const videoElement = document.getElementById("main-video");
        const videoData = this.findVideoById(videoId);

        if (!videoElement || !videoData) {
            return;
        }

        const currentProgress = (videoElement.currentTime / videoElement.duration) * 100;

        if (currentProgress >= 75 && !videoData.completed && !videoElement.paused) {
            videoData.completed = true;
            this.updateVideoItemUI(videoId);
            this.updatePlaylistProgress();
            this.saveCompletionStatus();
            this.showMessage(`✅ Đã hoàn thành: ${videoData.title}`);
        }
    }

    updateVideoItemUI(videoId) {
        const videoItemElement = document.querySelector(`.video-item[data-video="${videoId}"]`);
        if (videoItemElement) {
            videoItemElement.classList.add("completed");

            let statusIndicator = videoItemElement.querySelector(".video-completion-status");
            if (!statusIndicator) {
                statusIndicator = document.createElement("span");
                statusIndicator.className = "video-completion-status";
                statusIndicator.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
                    <path d="M7 12.5L10 15.5L17 8.5" stroke="white" stroke-width="2" fill="none"/>
                </svg>`;
                statusIndicator.title = "Đã hoàn thành";

                const videoInfo = videoItemElement.querySelector(".video-info");
                if (videoInfo) {
                    videoInfo.appendChild(statusIndicator);
                }
            }
        }
    }

    updatePlaylistProgress() {
        const progressElement = document.getElementById("playlist-progress");
        if (!progressElement) return;

        const currentPlaylistVideos = this.videoData[this.currentPlaylist];
        if (!currentPlaylistVideos) return;

        const completedCount = currentPlaylistVideos.filter((video) => video.completed).length;
        const totalCount = currentPlaylistVideos.length;

        progressElement.textContent = `${completedCount}/${totalCount} hoàn thành`;
    }

    saveCompletionStatus() {
        const completionData = {};
        for (const category in this.videoData) {
            this.videoData[category].forEach((video) => {
                if (video.completed) {
                    if (!completionData[category]) {
                        completionData[category] = [];
                    }
                    completionData[category].push(video.id);
                }
            });
        }
        localStorage.setItem("videoCompletionStatusReferences", JSON.stringify(completionData));
    }

    showMessage(message) {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease-out;
        `;

        if (!document.querySelector("#message-animations")) {
            const style = document.createElement("style");
            style.id = "message-animations";
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = "slideOutRight 0.3s ease-in";
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    document.body.removeChild(messageDiv);
                }
            }, 300);
        }, 4000);
    }

    loadCompletionStatus() {
        const storedCompletion = localStorage.getItem("videoCompletionStatusReferences");
        if (storedCompletion) {
            const completionData = JSON.parse(storedCompletion);
            for (const category in completionData) {
                if (this.videoData[category]) {
                    completionData[category].forEach((videoId) => {
                        const video = this.videoData[category].find((v) => v.id === videoId);
                        if (video) {
                            video.completed = true;
                            this.updateVideoItemUI(videoId);
                        }
                    });
                }
            }
        }
    }

    switchPlaylist(topic) {
        this.currentPlaylist = topic;

        const titles = {
            cpu: "Danh sách bài học - CPU",
            boNhoTrong: "Danh sách bài học - Bộ nhớ trong",
            boNhoNgoai: "Danh sách bài học - Bộ nhớ ngoài",
        };

        const playlistTitleElement = document.getElementById("playlist-title");
        if (playlistTitleElement) {
            playlistTitleElement.textContent = titles[topic] || `Danh sách bài học - ${topic.toUpperCase()}`;
        }

        const progressData = this.progress[topic];
        const playlistProgressElement = document.getElementById("playlist-progress");
        if (playlistProgressElement && progressData) {
            const completedCount = this.videoData[topic] ? this.videoData[topic].filter((v) => v.completed).length : 0;
            this.progress[topic].completed = completedCount;
            playlistProgressElement.textContent = `${completedCount}/${progressData.total} hoàn thành`;
        }
    }

    playVideo(videoId, videoSrc) {
        if (this.isChangingVideo) {
            return;
        }

        if (this.currentVideo && this.currentVideo.id === videoId) {
            return;
        }

        this.isChangingVideo = true;

        const videoElement = document.getElementById("main-video");
        const videoData = this.findVideoById(videoId);

        if (!videoElement || !videoData) {
            this.isChangingVideo = false;
            return;
        }

        const videoCategory = this.getCategoryFromVideoId(videoId);
        if (videoCategory && videoCategory !== this.currentPlaylist) {
            this.switchPlaylist(videoCategory);
        }

        videoElement.pause();
        this.currentVideo = videoData;

        setTimeout(() => {
            videoElement.src = videoSrc;

            videoElement.onloadedmetadata = () => {
                if (this.customControls) {
                    this.customControls.resetControls();
                    this.customControls.updateDuration();
                }

                videoElement
                    .play()
                    .then(() => {
                        this.isChangingVideo = false;
                    })
                    .catch((error) => {
                        console.error("Error playing video:", error);
                        this.isChangingVideo = false;
                    });
            };

            videoElement.onerror = () => {
                console.error("Video load error");
                this.isChangingVideo = false;
            };
            this.updatePlayingStatus(videoId);

            // No chapters in references page
            const videoChangedEvent = new CustomEvent("video-changed", {
                detail: {
                    id: videoId,
                    src: videoSrc,
                    title: videoData.title,
                    topic: videoCategory,
                    duration: videoData.duration,
                },
            });
            window.dispatchEvent(videoChangedEvent);
        }, 200);
    }

    findVideoById(videoId) {
        for (const playlist of Object.values(this.videoData)) {
            const video = playlist.find((v) => v.id === videoId);
            if (video) return video;
        }
        return null;
    }

    getCategoryFromVideoId(videoId) {
        if (!videoId) return null;

        if (videoId.startsWith("cpu-ref")) return "cpu";
        if (videoId.startsWith("ram-ref")) return "boNhoTrong";
        if (videoId.startsWith("rom-ref")) return "boNhoTrong";
        if (videoId.startsWith("hdd-ref")) return "boNhoNgoai";
        if (videoId.startsWith("ssd-ref")) return "boNhoNgoai";
        if (videoId.startsWith("storage-ref")) return "boNhoNgoai";
        if (videoId.startsWith("backup-ref")) return "boNhoNgoai";

        for (const category in this.videoData) {
            if (this.videoData[category].some((video) => video.id === videoId)) {
                return category;
            }
        }

        return null;
    }

    updatePlayingStatus(id) {
        document.querySelectorAll(".video-item").forEach((item) => {
            if (item.dataset.video === id) {
                if (!item.classList.contains("playing")) {
                    item.classList.add("playing", "active");

                    const accordionItem = item.closest(".accordion-item");
                    if (accordionItem && !accordionItem.classList.contains("active")) {
                        document.querySelectorAll(".accordion-item").forEach((accItem) => {
                            accItem.classList.remove("active");
                        });
                        accordionItem.classList.add("active");
                    }
                }
            } else {
                item.classList.remove("playing", "active");
            }
        });
    }

    onVideoEnded() {
        if (this.currentVideo) {
            setTimeout(() => {
                this.nextVideo();
            }, 1000);
        }
    }

    previousVideo() {
        const currentPlaylistVideos = this.videoData[this.currentPlaylist];
        if (!currentPlaylistVideos || !this.currentVideo) {
            return;
        }

        const currentIndex = currentPlaylistVideos.findIndex((video) => video.id === this.currentVideo.id);

        if (currentIndex > 0) {
            const previousVideo = currentPlaylistVideos[currentIndex - 1];
            this.playVideo(previousVideo.id, previousVideo.src);
        }
    }

    nextVideo() {
        if (this.isChangingVideo) {
            return;
        }

        const currentPlaylistVideos = this.videoData[this.currentPlaylist];
        if (!currentPlaylistVideos || !this.currentVideo) {
            return;
        }

        const currentIndex = currentPlaylistVideos.findIndex((video) => video.id === this.currentVideo.id);

        if (currentIndex < currentPlaylistVideos.length - 1) {
            const nextVideo = currentPlaylistVideos[currentIndex + 1];
            this.playVideo(nextVideo.id, nextVideo.src);
            this.showMessage(`▶️ Chuyển sang: ${nextVideo.title}`);
        } else {
            this.showMessage("🎉 Đã hoàn thành danh mục này!");
        }
    }

    togglePlayPause() {
        const video = document.getElementById("main-video");
        if (!video) return;

        if (video.paused) {
            video.play().catch((error) => console.error("Error playing video:", error));
        } else {
            video.pause();
        }
    }

    seekVideo(seconds) {
        const videoElement = document.getElementById("main-video");
        if (!videoElement) return;

        const newTime = Math.min(Math.max(0, videoElement.currentTime + seconds), videoElement.duration);
        videoElement.currentTime = newTime;

        if (this.customControls) {
            this.customControls.updateProgress();
        }
    }

    toggleMute() {
        const videoElement = document.getElementById("main-video");
        if (!videoElement) return;

        videoElement.muted = !videoElement.muted;

        if (this.customControls) {
            this.customControls.updateVolumeUI();
        }
    }
}

// Initialize video player when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const videoPlayer = new VideoPlayerController();
    window.videoPlayerController = videoPlayer;
});

// Export for global use
window.VideoPlayerController = VideoPlayerController;
