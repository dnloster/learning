// Video Chapters Controller - YouTube-style chapters system
class VideoChapters {
    constructor() {
        this.chapters = {};
        this.currentVideo = null;
        this.currentChapter = null;
        this.isVisible = false; // Tracks the logical visibility state
        this.isToggling = false; // Prevents re-entrant calls during transition
        this.chapterPanel = null;
        this.videoElement = null;
        this.chapterMarkers = [];
        this.chaptersBtn = null;
        this.chapterIndicator = null;
        this.chapterNavigationPanel = null;

        this._boundToggleChapterHandler = this.toggleChapterPanel.bind(this);
        this._boundHandleClickOutside = this.handleClickOutside.bind(this);

        // Đảm bảo các phần tử DOM đã được tạo trước khi thực hiện khởi tạo
        if (document.readyState === "complete" || document.readyState === "interactive") {
            this.initElements();
        } else {
            document.addEventListener("DOMContentLoaded", () => this.initElements());
        }
    }

    init() {
        this.initElements();
        // Other initializations like loading chapter data can go here
    }

    initElements() {
        this.videoElement = document.getElementById("main-video");
        this.chaptersBtn = document.getElementById("chapters-btn");
        this.chapterNavigationPanel = document.getElementById("chapter-navigation-panel");
        this.chapterIndicator = document.getElementById("chapter-indicator");

        if (!this.chaptersBtn) {
            console.error("Chapters button ('chapters-btn') not found.");
        }

        if (!this.chapterNavigationPanel) {
            console.warn(
                "Chapter navigation panel ('chapter-navigation-panel') not initially found. Will be created if needed by toggleChapterPanel."
            );
        }
        this.setupEventListeners();
    }

    // Phương thức được gọi khi nhấn nút hiển thị/ẩn phân đoạn
    toggleChapterPanel() {
        if (this.isToggling) {
            // console.log("Toggle operation already in progress.");
            return;
        }
        this.isToggling = true;

        if (!this.chapterNavigationPanel) {
            // Attempt to find it again, or create it
            this.chapterNavigationPanel = document.getElementById("chapter-navigation-panel");
            if (!this.chapterNavigationPanel) {
                this.createChapterPanel();
                if (!this.chapterNavigationPanel) {
                    console.error("Failed to get or create chapter panel.");
                    this.isToggling = false;
                    return;
                }
            }
        }

        const transitionDuration = 300; // ms, should match your CSS transition-duration

        if (!this.isVisible) {
            // Current state is hidden, target is to SHOW
            this.isVisible = true; // Update logical state: intent to show

            this.chapterNavigationPanel.style.display = "flex"; // Make it part of layout

            requestAnimationFrame(() => {
                // Allow display change to take effect before class change
                this.chapterNavigationPanel.classList.add("show"); // Trigger show animation
                if (this.chaptersBtn) {
                    this.chaptersBtn.classList.add("active");
                }
                // Add listener for outside clicks
                document.removeEventListener("mousedown", this._boundHandleClickOutside); // Clean first
                document.addEventListener("mousedown", this._boundHandleClickOutside);

                this.isToggling = false; // Show operation initiated, release toggle lock
                // console.log("Panel show initiated. isVisible:", this.isVisible);
            });
        } else {
            // Current state is visible, target is to HIDE
            this.isVisible = false; // Update logical state: intent to hide

            this.chapterNavigationPanel.classList.remove("show"); // Trigger hide animation
            if (this.chaptersBtn) {
                this.chaptersBtn.classList.remove("active");
            }
            document.removeEventListener("mousedown", this._boundHandleClickOutside);
            // console.log("Panel hide initiated. isVisible:", this.isVisible);

            // After transition, set display to none and release toggle lock
            setTimeout(() => {
                if (!this.isVisible && this.chapterNavigationPanel) {
                    // Check state again before hiding
                    this.chapterNavigationPanel.style.display = "none";
                    // console.log("Panel display set to none.");
                }
                this.isToggling = false; // Hide operation completed, release toggle lock
            }, transitionDuration);
        }
    }

    handleClickOutside(event) {
        if (this.isToggling || !this.isVisible) {
            // Check logical state and if a toggle is active
            // console.log("handleClickOutside: ignored (toggling or not visible)");
            return;
        }

        const isClickInsidePanel = this.chapterNavigationPanel && this.chapterNavigationPanel.contains(event.target);
        const isClickOnToggleBtn = this.chaptersBtn && this.chaptersBtn.contains(event.target);

        if (!isClickInsidePanel && !isClickOnToggleBtn) {
            // console.log("Click outside detected, hiding panel.");
            this.toggleChapterPanel(); // This will hide the panel
        }
    }

    // Phương thức tạo panel nếu không tồn tại
    createChapterPanel() {
        // Check if panel already exists
        let panel = document.getElementById("chapter-navigation-panel");
        if (panel) {
            this.chapterNavigationPanel = panel;
            return;
        }

        panel = document.createElement("div");
        panel.id = "chapter-navigation-panel";
        panel.className = "chapter-navigation-panel"; // Base class for styling

        // TODO: Populate panel with necessary inner structure (e.g., title, list)
        // Example: panel.innerHTML = "<h3>Chapters</h3><ul id=\\\\"chapter-list\\\\\"></ul>";
        panel.innerHTML = "<!-- Chapters will be loaded here -->";

        const videoContainer = document.querySelector(".video-container") || document.body;
        videoContainer.appendChild(panel);
        this.chapterNavigationPanel = panel;
        console.log("Chapter panel dynamically created.");

        // Set initial style for a newly created panel, as CSS doesn't set display:none
        this.chapterNavigationPanel.style.display = "none";
        this.chapterNavigationPanel.classList.remove("show"); // Ensure no 'show' class
    }

    setupEventListeners() {
        if (this.chaptersBtn) {
            this.chaptersBtn.removeEventListener("click", this._boundToggleChapterHandler); // Remove old if any
            this.chaptersBtn.addEventListener("click", this._boundToggleChapterHandler);
        } else {
            // console.error("Cannot setup event listeners: chaptersBtn is not defined.");
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
        // this.addVideoTimeUpdateListener(); // This is called in initElements. Ensure addVideoTimeUpdateListener uses a bound handler if it adds one.

        // Add document event listener for clicks outside the panel
        // Remove previous listener first to avoid duplicates if setupEventListeners is called multiple times
        document.removeEventListener("mousedown", this._boundHandleClickOutside);
        document.addEventListener("mousedown", this._boundHandleClickOutside);

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

    // Phương thức cập nhật phân đoạn hiện tại dựa trên thời gian video
    updateCurrentChapterFromTime(currentTime) {
        if (!this.currentVideo || !this.chapters || !this.chapters[this.currentVideo]) {
            // console.warn("No chapters data available to update current chapter from time.");
            return;
        }

        const currentChapters = this.chapters[this.currentVideo];
        let activeChapter = null;
        let activeChapterIndex = -1;

        // Tìm phân đoạn hiện tại
        for (let i = currentChapters.length - 1; i >= 0; i--) {
            if (currentTime >= currentChapters[i].time) {
                activeChapter = currentChapters[i];
                activeChapterIndex = i;
                break;
            }
        }

        // Nếu không tìm thấy (ví dụ: trước phân đoạn đầu tiên), đặt là null
        if (!activeChapter && currentChapters.length > 0) {
            // activeChapter = currentChapters[0]; // Hoặc để là null nếu muốn
            // activeChapterIndex = 0;
        }

        // Chỉ cập nhật nếu phân đoạn thay đổi
        if (this.currentChapter !== activeChapter) {
            this.currentChapter = activeChapter;
            this.updateActiveChapter(activeChapterIndex); // Cập nhật UI cho item trong danh sách
            this.updateChapterDisplay(); // Cập nhật hiển thị phân đoạn hiện tại
        }

        // Cập nhật thanh tiến trình của phân đoạn
        this.updateChapterProgress();
    }

    // Cập nhật hiển thị phân đoạn hiện tại (tiêu đề, thời gian)
    updateChapterDisplay() {
        const currentChapterDisplay = document.getElementById("current-chapter-display");
        const chapterTimeInfo = document.getElementById("chapter-time-info");

        if (this.currentChapter) {
            if (currentChapterDisplay) {
                currentChapterDisplay.textContent = this.currentChapter.title;
            }
            // Thời gian của phân đoạn sẽ được cập nhật bởi updateChapterProgress
        } else {
            if (currentChapterDisplay) {
                currentChapterDisplay.textContent = "Không có phân đoạn";
            }
            if (chapterTimeInfo) {
                chapterTimeInfo.textContent = "0:00 / 0:00";
            }
            // Đặt lại thanh tiến trình nếu không có phân đoạn hiện tại
            const chapterProgressFill = document.getElementById("chapter-progress-fill");
            if (chapterProgressFill) {
                chapterProgressFill.style.width = "0%";
            }
        }
    }

    // Cập nhật thanh tiến trình của phân đoạn hiện tại
    updateChapterProgress() {
        if (!this.videoElement || !this.currentChapter) {
            // console.log("Cannot update chapter progress: no video element or current chapter.");
            return;
        }

        const chapterProgressFill = document.getElementById("chapter-progress-fill");
        const chapterTimeInfo = document.getElementById("chapter-time-info");

        if (!chapterProgressFill || !chapterTimeInfo) {
            // console.warn("Chapter progress elements not found.");
            return;
        }

        const currentTimeInChapter = this.videoElement.currentTime - this.currentChapter.time;

        let chapterDuration;
        const currentChapters = this.chapters[this.currentVideo];
        const currentChapterIndex = currentChapters.findIndex((ch) => ch.time === this.currentChapter.time);

        if (currentChapterIndex < currentChapters.length - 1) {
            chapterDuration = currentChapters[currentChapterIndex + 1].time - this.currentChapter.time;
        } else {
            chapterDuration = this.videoElement.duration - this.currentChapter.time;
        }

        // Đảm bảo chapterDuration không âm hoặc không hợp lệ
        if (isNaN(chapterDuration) || chapterDuration <= 0) {
            // console.warn("Invalid chapter duration:", chapterDuration);
            chapterProgressFill.style.width = "0%";
            chapterTimeInfo.textContent = `${this.formatTime(currentTimeInChapter)} / --:--`;
            return;
        }

        const progressPercentage = Math.min(100, Math.max(0, (currentTimeInChapter / chapterDuration) * 100));

        chapterProgressFill.style.width = `${progressPercentage}%`;
        chapterTimeInfo.textContent = `${this.formatTime(currentTimeInChapter)} / ${this.formatTime(chapterDuration)}`;
    }

    // Đánh dấu phân đoạn đang hoạt động trong danh sách
    updateActiveChapter(activeIndex) {
        const chaptersListExternal = document.getElementById("chapters-list-external");
        if (!chaptersListExternal) return;

        const chapterItems = chaptersListExternal.querySelectorAll(".chapter-item");
        chapterItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add("active");
                // Tùy chọn: cuộn đến item đang active
                // item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove("active");
            }
        });
    }

    // Xử lý sự kiện timeupdate của video
    handleTimeUpdate() {
        if (!this.videoElement) return;
        const currentTime = this.videoElement.currentTime;
        this.updateCurrentChapterFromTime(currentTime);
    }

    // Định dạng thời gian (giữ nguyên)
    formatTime(timeInSeconds) {
        if (isNaN(timeInSeconds) || timeInSeconds < 0) {
            return "0:00";
        }

        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
        if (this.videoElement && !this.videoElement.hasAttribute("data-timeupdate-listener-added")) {
            this.videoElement.addEventListener("timeupdate", this.handleTimeUpdate.bind(this));
            this.videoElement.setAttribute("data-timeupdate-listener-added", "true");
            console.log("Timeupdate listener added to video element.");
        } else if (this.videoElement && this.videoElement.hasAttribute("data-timeupdate-listener-added")) {
            // console.log("Timeupdate listener already exists on video element.");
        } else if (!this.videoElement) {
            // console.warn("Video element not found for adding timeupdate listener.");
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
