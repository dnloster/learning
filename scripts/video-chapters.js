// Video Chapters Controller - YouTube-style chapters system
class VideoChapters {
    constructor() {
        this.chapters = {};
        this.currentVideo = null;
        this.currentChapter = null;
        this.isVisible = false;
        this.chapterPanel = null;
        this.videoElement = null;
        this.chapterMarkers = [];
        this.chaptersBtn = null;
        this.chapterIndicator = null;
        this.chapterNavigationPanel = null;

        // Đảm bảo các phần tử DOM đã được tạo trước khi thực hiện khởi tạo
        if (document.readyState === "complete" || document.readyState === "interactive") {
            this.initElements();
        } else {
            document.addEventListener("DOMContentLoaded", () => this.initElements());
        }
    }

    initElements() {
        this.videoElement = document.getElementById("main-video");
        this.chapterNavigationPanel = document.getElementById("chapter-navigation-panel");
        this.chaptersBtn = document.getElementById("chapters-btn");
        this.chapterIndicator = document.getElementById("chapter-indicator");

        // Thêm các tham chiếu khác
        this.chapterNavContent = document.getElementById("chapter-nav-content");
        this.chapterNavToggle = document.getElementById("chapter-nav-toggle");
        this.chaptersListExternal = document.getElementById("chapters-list-external");
        this.currentChapterDisplay = document.getElementById("current-chapter-display");
        this.chapterProgressFill = document.getElementById("chapter-progress-fill");
        this.chapterTimeInfo = document.getElementById("chapter-time-info");
        this.markersContainer = document.querySelector(".progress-markers");

        if (!this.chapterNavigationPanel) {
            this.createChapterPanel();
        }

        // Thêm listener cho timeupdate
        this.addVideoTimeUpdateListener();

        this.setupEventListeners();
    }

    // Phương thức được gọi khi nhấn nút hiển thị/ẩn phân đoạn
    toggleChapterPanel() {
        if (!this.chapterNavigationPanel) {
            this.chapterNavigationPanel = document.getElementById("chapter-navigation-panel");

            if (!this.chapterNavigationPanel) {
                console.error("Cannot find chapter panel, creating one");
                this.createChapterPanel();

                if (!this.chapterNavigationPanel) {
                    console.error("Failed to create chapter panel");
                    return;
                }
            }
        }

        // Toggle hiển thị/ẩn
        this.isVisible = !this.isVisible;

        if (this.isVisible) {
            // Hiển thị panel
            this.chapterNavigationPanel.style.display = "flex";
            this.chapterNavigationPanel.classList.add("show");
            this.chapterNavigationPanel.classList.add("visible");

            if (this.chaptersBtn) {
                this.chaptersBtn.classList.add("active");
            }

            // Cập nhật dữ liệu nếu cần
            setTimeout(() => {
                this.updateChaptersData();
            }, 50);
        } else {
            // Ẩn panel
            this.chapterNavigationPanel.classList.remove("show");
            this.chapterNavigationPanel.classList.remove("visible");

            // Đợi animation hoàn thành
            setTimeout(() => {
                if (!this.isVisible) {
                    // Kiểm tra lại để tránh conflict nếu người dùng nhấn lại nút
                    this.chapterNavigationPanel.style.display = "none";
                }
            }, 300);

            if (this.chaptersBtn) {
                this.chaptersBtn.classList.remove("active");
            }
        }

        return this.isVisible;
    }

    // Phương thức tạo panel nếu không tồn tại
    createChapterPanel() {
        const videoPlayerContainer = document.querySelector(".video-player-container");
        if (!videoPlayerContainer) {
            console.error("Video player container not found");
            return;
        } // Tạo panel mới
        this.chapterNavigationPanel = document.createElement("div");
        this.chapterNavigationPanel.id = "chapter-navigation-panel";
        this.chapterNavigationPanel.className = "chapter-navigation-panel";
        this.chapterNavigationPanel.style.display = "none";

        // Thêm nội dung HTML
        this.chapterNavigationPanel.innerHTML = `
            <div class="chapter-nav-header">
                <div class="chapter-nav-title">
                    <span class="chapter-nav-icon">📑</span>
                    <span>Phân đoạn</span>
                    <span class="chapter-count" id="chapter-count">0 phần</span>
                </div>
                <button class="chapter-nav-toggle" id="chapter-nav-toggle">
                    <span class="toggle-icon">▼</span>
                </button>
            </div>
            <div class="chapter-nav-content" id="chapter-nav-content">
                <div class="chapter-current-info">
                    <div class="current-chapter-title" id="current-chapter-display">
                        Chưa có phân đoạn
                    </div>
                    <div class="chapter-progress-container">
                        <div class="chapter-progress-bar">
                            <div class="chapter-progress-fill" id="chapter-progress-fill"></div>
                        </div>
                        <div class="chapter-time-info" id="chapter-time-info">0:00 / 0:00</div>
                    </div>
                </div>
                <div class="chapters-list-external" id="chapters-list-external">
                    <div class="chapter-loading">Đang tải...</div>
                </div>
            </div>
        `;

        videoPlayerContainer.appendChild(this.chapterNavigationPanel);
    }

    updateChaptersData() {
        // Nếu không có video hiện tại hoặc không có dữ liệu phân đoạn, thử lấy từ controller
        if (
            !this.currentVideo ||
            !this.chapters ||
            (this.currentVideo && (!this.chapters[this.currentVideo] || this.chapters[this.currentVideo].length === 0))
        ) {
            // Lấy ID video hiện tại
            let videoId = this.currentVideo;
            if (!videoId && window.videoPlayerController && window.videoPlayerController.currentVideo) {
                videoId = window.videoPlayerController.currentVideo.id;
                this.currentVideo = videoId;
            }

            if (videoId) {
                // Thử tất cả các cách để lấy phân đoạn
                const sources = [
                    window.videoPlayer,
                    window.videoPlayerController,
                    window.VideoPlayerController ? new window.VideoPlayerController() : null,
                ];

                for (const source of sources) {
                    if (!source) continue;

                    // Thử từng phương thức có thể
                    const methodsToTry = ["getChaptersForVideo", "getChapterForVideo", "getVideoChapters"];

                    for (const method of methodsToTry) {
                        if (typeof source[method] === "function") {
                            try {
                                const chapters = source[method](videoId);

                                if (chapters && chapters.length > 0) {
                                    if (!this.chapters) this.chapters = {};
                                    this.chapters[videoId] = chapters;

                                    // Render chapters
                                    this.renderChapters(chapters);

                                    // Create markers
                                    this.createChapterMarkers(chapters);

                                    return;
                                }
                            } catch (e) {
                                console.warn(`Error trying to get chapters with ${method}:`, e);
                            }
                        }
                    }
                }

                // Nếu tất cả các cách trên đều thất bại, thử truy cập trực tiếp vào dữ liệu
                try {
                    if (window.videoPlayer && window.videoPlayer.videoData) {
                        for (const category in window.videoPlayer.videoData) {
                            const video = window.videoPlayer.videoData[category].find((v) => v.id === videoId);
                            if (video && video.chapters && video.chapters.length > 0) {
                                if (!this.chapters) this.chapters = {};
                                this.chapters[videoId] = video.chapters;

                                this.renderChapters(video.chapters);
                                this.createChapterMarkers(video.chapters);
                                return;
                            }
                        }
                    }
                } catch (e) {
                    console.warn("Error accessing video data directly:", e);
                }

                console.warn(`No chapters found for video: ${videoId}`);
                this.renderEmptyChapters();
            } else {
                console.warn("No current video identified");
                this.renderEmptyChapters();
            }
        } else if (this.currentVideo && this.chapters[this.currentVideo]) {
            // Đã có dữ liệu, render lại
            this.renderChapters(this.chapters[this.currentVideo]);
            this.createChapterMarkers(this.chapters[this.currentVideo]);
        }
    }

    setupEventListeners() {
        // Xử lý nút chapters
        if (this.chaptersBtn) {
            // Xóa các event listeners cũ nếu có
            this.chaptersBtn.removeEventListener("click", this._toggleChapterHandler);

            // Tạo handler và lưu tham chiếu để có thể xóa sau này
            this._toggleChapterHandler = () => {
                this.toggleChapterPanel();
            };

            this.chaptersBtn.addEventListener("click", this._toggleChapterHandler);
        }

        // Xử lý nút toggle trong panel
        if (this.chapterNavToggle) {
            this.chapterNavToggle.addEventListener("click", () => {
                if (this.chapterNavContent) {
                    const isCollapsed = this.chapterNavContent.classList.toggle("collapsed");
                    const toggleIcon = this.chapterNavToggle.querySelector(".toggle-icon");
                    if (toggleIcon) {
                        toggleIcon.textContent = isCollapsed ? "▲" : "▼";
                    }
                }
            });
        }

        // Thêm timeupdate listener cho video
        this.addVideoTimeUpdateListener();

        // Các event listeners khác (giữ nguyên)
        // Lắng nghe sự kiện videoChaptersReady
        window.addEventListener("video-chapters-ready", (event) => {
            if (event.detail && event.detail.videoId) {
                const videoId = event.detail.videoId;
                const chapters = event.detail.chapters || [];

                if (chapters.length > 0) {
                    // Cập nhật dữ liệu
                    if (!this.chapters) this.chapters = {};
                    this.chapters[videoId] = chapters;
                    this.currentVideo = videoId;

                    // Hiển thị indicator nếu có phân đoạn
                    if (this.chapterIndicator) {
                        this.chapterIndicator.style.display = "inline-block";
                    }

                    // Nếu panel đang hiển thị, cập nhật nội dung
                    if (this.isVisible && this.chapterNavigationPanel) {
                        this.updateChaptersData();
                    }
                }
            }
        });

        // Lắng nghe sự kiện video-changed
        window.addEventListener("video-changed", (event) => {
            if (event.detail && event.detail.id) {
                const videoId = event.detail.id;
                const chapters = event.detail.chapters || [];

                // Lưu ID video hiện tại
                this.currentVideo = videoId;

                if (chapters.length > 0) {
                    // Cập nhật dữ liệu phân đoạn
                    if (!this.chapters) this.chapters = {};
                    this.chapters[videoId] = chapters;

                    // Hiển thị indicator
                    if (this.chapterIndicator) {
                        this.chapterIndicator.style.display = "inline-block";
                    }

                    // Nếu panel đang hiển thị, cập nhật nội dung
                    if (this.isVisible && this.chapterNavigationPanel) {
                        this.updateChaptersData();
                    }
                } else {
                    // Ẩn indicator nếu không có phân đoạn
                    if (this.chapterIndicator) {
                        this.chapterIndicator.style.display = "none";
                    }
                }
            }
        });
    }

    loadChaptersForVideo(videoId) {
        this.currentVideo = videoId;

        // Đầu tiên kiểm tra xem đã có dữ liệu phân đoạn trong cache chưa
        if (this.chapters && this.chapters[videoId] && this.chapters[videoId].length > 0) {
            this.renderChapters(this.chapters[videoId]);
            this.createChapterMarkers(this.chapters[videoId]);
            return;
        }

        // Nếu không có cache, thử lấy từ VideoPlayerController
        if (window.videoPlayer && window.videoPlayer.getChaptersForVideo) {
            const videoChapters = window.videoPlayer.getChaptersForVideo(videoId);
            if (videoChapters && videoChapters.length > 0) {
                if (!this.chapters) this.chapters = {};
                this.chapters[videoId] = videoChapters;
                this.renderChapters(videoChapters);
                this.createChapterMarkers(videoChapters);
                return;
            }
        }

        // Thử lấy trực tiếp từ đối tượng video
        const videoPlayerController = window.videoPlayer || window.videoPlayerController;
        if (videoPlayerController) {
            const videoData = videoPlayerController.findVideoById(videoId);
            if (videoData && videoData.chapters && videoData.chapters.length > 0) {
                if (!this.chapters) this.chapters = {};
                this.chapters[videoId] = videoData.chapters;
                this.renderChapters(videoData.chapters);
                this.createChapterMarkers(videoData.chapters);
                return;
            }
        }

        console.warn(`No chapters found for video: ${videoId}`);
        this.renderEmptyChapters();
    }

    /**
     * Hiển thị danh sách phân đoạn video
     * @param {Array} chapters - Mảng các phân đoạn cần hiển thị
     */
    renderChapters(chapters) {
        // Kiểm tra tham số đầu vào
        if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
            console.warn("No chapters to render");
            this.renderEmptyChapters();
            return;
        }

        // Lấy container để đổ dữ liệu vào
        const chaptersListExternal = document.getElementById("chapters-list-external");
        if (!chaptersListExternal) {
            console.error("Chapters list external container not found");
            return;
        }

        // Xóa nội dung cũ
        chaptersListExternal.innerHTML = "";

        // Cập nhật số lượng phân đoạn
        const chapterCount = document.getElementById("chapter-count");
        if (chapterCount) {
            chapterCount.textContent = `${chapters.length} phần`;
        }

        // Tạo danh sách phân đoạn
        chapters.forEach((chapter, index) => {
            const chapterItem = document.createElement("div");
            chapterItem.className = "chapter-item";
            chapterItem.dataset.time = chapter.time;
            chapterItem.dataset.index = index;

            // Kiểm tra nếu đây là phân đoạn hiện tại
            if (this.currentChapter && this.currentChapter.time === chapter.time) {
                chapterItem.classList.add("active");
            }

            chapterItem.innerHTML = `
                <div class="chapter-item-content">
                    <div class="chapter-number">${index + 1}</div>
                    <div class="chapter-details">
                        <div class="chapter-item-title">${chapter.title}</div>
                        <div class="chapter-item-time">${this.formatTime(chapter.time)}</div>
                    </div>
                </div>
            `;

            // Thêm sự kiện click để nhảy đến phân đoạn
            chapterItem.addEventListener("click", () => {
                if (this.videoElement) {
                    this.videoElement.currentTime = chapter.time;

                    // Nếu video đang tạm dừng, phát lại
                    if (this.videoElement.paused) {
                        this.videoElement.play().catch((err) => {
                            console.error("Error playing video:", err);
                        });
                    }

                    // Cập nhật phân đoạn hiện tại
                    this.currentChapter = chapter;
                    this.updateActiveChapter(index);
                }
            });

            chaptersListExternal.appendChild(chapterItem);
        });

        // Định vị đến phân đoạn hiện tại nếu có
        if (this.videoElement && this.videoElement.currentTime > 0) {
            this.updateCurrentChapterFromTime(this.videoElement.currentTime);
        }
    }

    /**
     * Hiển thị trạng thái khi không có phân đoạn
     */
    renderEmptyChapters() {
        const chaptersListExternal = document.getElementById("chapters-list-external");
        const chapterCount = document.getElementById("chapter-count");
        const currentChapterDisplay = document.getElementById("current-chapter-display");

        if (chapterCount) {
            chapterCount.textContent = "0 phần";
        }

        if (currentChapterDisplay) {
            currentChapterDisplay.textContent = "Không có phân đoạn";
        }

        if (chaptersListExternal) {
            chaptersListExternal.innerHTML = `
                <div class="empty-chapters">
                    <div class="empty-icon">📑</div>
                    <p>Video này không có phân đoạn</p>
                </div>
            `;
        }

        // Xóa các markers nếu có
        this.clearChapterMarkers();
    }

    /**
     * Tạo các markers trên thanh tiến trình video
     * @param {Array} chapters - Mảng các phân đoạn
     */
    createChapterMarkers(chapters) {
        // Xóa markers cũ
        this.clearChapterMarkers();

        // Kiểm tra video và danh sách phân đoạn
        if (!this.videoElement || !chapters || !Array.isArray(chapters) || chapters.length === 0) {
            return;
        }

        // Tìm container cho markers - thử nhiều selector khác nhau
        const possibleProgressSelectors = [
            ".progress-markers", // Nếu đã tồn tại
            ".progress-bar",
            ".video-progress-bar",
            ".video-progress",
            ".progress-container",
            ".progress",
        ];

        let markersContainer = null;
        let progressBar = null;

        // Tìm container markers nếu đã tồn tại
        for (const selector of possibleProgressSelectors) {
            const found = document.querySelector(selector);
            if (found) {
                if (selector === ".progress-markers") {
                    markersContainer = found;
                    break;
                } else {
                    progressBar = found;
                    break;
                }
            }
        }

        // Nếu không tìm thấy progress bar, tạo một cái mới
        if (!progressBar && !markersContainer) {
            console.error("Cannot find progress bar for chapter markers");
            return;
        }

        // Nếu chưa có container markers, tạo mới
        if (!markersContainer) {
            const newMarkersContainer = document.createElement("div");
            newMarkersContainer.className = "progress-markers";
            progressBar.appendChild(newMarkersContainer);

            markersContainer = newMarkersContainer;
        }

        // Lưu lại tham chiếu
        this.markersContainer = markersContainer;

        // Lấy thời lượng video
        const duration = this.videoElement.duration || 1;

        // Tạo markers cho từng phân đoạn
        chapters.forEach((chapter, index) => {
            // Tính toán vị trí theo phần trăm
            const position = (chapter.time / duration) * 100;

            // Tạo marker
            const marker = document.createElement("div");
            marker.className = "chapter-marker";
            marker.style.left = `${position}%`;
            marker.dataset.time = chapter.time;
            marker.dataset.title = chapter.title;
            marker.dataset.index = index;

            // Thêm tooltip
            marker.setAttribute("title", `${chapter.title} (${this.formatTime(chapter.time)})`);

            // Thêm sự kiện click
            marker.addEventListener("click", (e) => {
                e.stopPropagation(); // Ngăn chặn sự kiện lan sang thanh tiến trình

                if (this.videoElement) {
                    this.videoElement.currentTime = chapter.time;

                    // Phát video nếu đang tạm dừng
                    if (this.videoElement.paused) {
                        this.videoElement.play().catch((err) => {
                            console.error("Error playing video:", err);
                        });
                    }
                }
            });

            // Thêm vào container
            markersContainer.appendChild(marker);
            this.chapterMarkers.push(marker);
        });
    }

    /**
     * Xóa tất cả markers phân đoạn
     */
    clearChapterMarkers() {
        if (this.markersContainer) {
            this.markersContainer.innerHTML = "";
        } else {
            const markersContainer = document.querySelector(".progress-markers");
            if (markersContainer) {
                markersContainer.innerHTML = "";
            }
        }

        this.chapterMarkers = [];
    }

    /**
     * Cập nhật phân đoạn hiện tại dựa trên thời gian video
     * @param {number} currentTime - Thời gian hiện tại của video
     */
    updateCurrentChapterFromTime(currentTime) {
        if (!this.currentVideo || !this.chapters || !this.chapters[this.currentVideo]) {
            return;
        }

        const chapters = this.chapters[this.currentVideo];
        let activeIndex = -1;

        // Tìm phân đoạn hiện tại (phân đoạn cuối cùng có time <= currentTime)
        for (let i = chapters.length - 1; i >= 0; i--) {
            if (chapters[i].time <= currentTime) {
                activeIndex = i;
                this.currentChapter = chapters[i];
                this.currentChapter.index = i;
                break;
            }
        }

        // Cập nhật UI
        if (activeIndex >= 0) {
            this.updateActiveChapter(activeIndex);
            this.updateChapterDisplay();
        }
    }

    /**
     * Cập nhật trạng thái active cho phân đoạn
     * @param {number} activeIndex - Chỉ số của phân đoạn hiện tại
     */
    updateActiveChapter(activeIndex) {
        // Cập nhật trạng thái active trong danh sách
        const chapterItems = document.querySelectorAll(".chapter-item");

        chapterItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add("active");

                // Cuộn đến phần tử active nếu panel đang hiển thị
                if (this.isVisible) {
                    item.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
            } else {
                item.classList.remove("active");
            }
        });
    }

    /**
     * Cập nhật hiển thị thông tin phân đoạn hiện tại
     */
    updateChapterDisplay() {
        if (!this.currentChapter) return;

        const currentChapterDisplay = document.getElementById("current-chapter-display");
        const chapterProgressFill = document.getElementById("chapter-progress-fill");
        const chapterTimeInfo = document.getElementById("chapter-time-info");

        if (currentChapterDisplay) {
            currentChapterDisplay.textContent = this.currentChapter.title;
        }

        // Nếu có video element và current chapter
        if (this.videoElement && this.currentVideo && this.chapters && this.chapters[this.currentVideo]) {
            const chapters = this.chapters[this.currentVideo];
            const currentIndex = this.currentChapter.index;
            const currentTime = this.videoElement.currentTime;

            // Xác định thời gian kết thúc của phân đoạn hiện tại
            let endTime;

            if (currentIndex < chapters.length - 1) {
                // Nếu không phải phân đoạn cuối, lấy thời gian bắt đầu của phân đoạn tiếp theo
                endTime = chapters[currentIndex + 1].time;
            } else {
                // Nếu là phân đoạn cuối, lấy thời lượng video
                endTime = this.videoElement.duration;
            }

            // Tính tiến trình phân đoạn
            if (chapterProgressFill && endTime > this.currentChapter.time) {
                const chapterProgress =
                    ((currentTime - this.currentChapter.time) / (endTime - this.currentChapter.time)) * 100;
                chapterProgressFill.style.width = `${Math.min(100, Math.max(0, chapterProgress))}%`;
            }

            // Cập nhật thông tin thời gian
            if (chapterTimeInfo) {
                const elapsedInChapter = currentTime - this.currentChapter.time;
                const chapterDuration = endTime - this.currentChapter.time;

                chapterTimeInfo.textContent = `${this.formatTime(elapsedInChapter)} / ${this.formatTime(
                    chapterDuration
                )}`;
            }
        }
    }

    /**
     * Định dạng thời gian từ giây sang MM:SS
     * @param {number} seconds - Số giây cần định dạng
     * @returns {string} - Chuỗi thời gian đã định dạng
     */
    formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return "0:00";
        }

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    /**
     * Phương thức được gọi khi thời gian video thay đổi
     */
    updateCurrentChapter() {
        if (!this.videoElement || !this.currentVideo) return;

        const currentTime = this.videoElement.currentTime;
        this.updateCurrentChapterFromTime(currentTime);
    }

    /**
     * Thêm sự kiện lắng nghe thời gian video thay đổi
     */
    addVideoTimeUpdateListener() {
        if (this.videoElement) {
            // Xóa listener cũ nếu có
            this.videoElement.removeEventListener("timeupdate", this._timeUpdateHandler);

            // Tạo và lưu tham chiếu đến handler
            this._timeUpdateHandler = () => this.updateCurrentChapter();

            // Thêm listener mới
            this.videoElement.addEventListener("timeupdate", this._timeUpdateHandler);
        }
    }
}

// Đảm bảo chỉ có một instance duy nhất
let videoChaptersInstance = null;

// Hàm khởi tạo instance duy nhất
function initVideoChapters() {
    if (!videoChaptersInstance) {
        videoChaptersInstance = new VideoChapters();
        window.videoChapters = videoChaptersInstance;
    }
    return videoChaptersInstance;
}

// Khởi tạo instance ngay khi tệp được tải
initVideoChapters();

// Export cho module system
export default videoChaptersInstance;
