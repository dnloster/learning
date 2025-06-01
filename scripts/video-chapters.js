// Video Chapters Controller - YouTube-style chapters system
class VideoChapters {
    constructor(videoElement, customControls) {
        this.video = videoElement;
        this.customControls = customControls;
        this.chapters = [];
        this.currentChapter = null;
        this.isMenuOpen = false; // Get DOM elements
        this.chaptersBtn = document.getElementById("chapters-btn");
        this.chaptersMenu = document.getElementById("chapters-menu"); // Legacy modal
        this.closeChaptersBtn = document.getElementById("close-chapters-btn");
        this.chaptersList = document.getElementById("chapters-list");
        this.chapterMarkers = document.getElementById("chapter-markers");
        this.chapterInfo = document.getElementById("chapter-info");
        this.chapterPreview = document.getElementById("chapter-preview");
        this.progressBar = document.getElementById("progress-bar");

        // New external chapter navigation elements
        this.chapterNavigationPanel = document.getElementById("chapter-navigation-panel");
        this.chapterNavToggle = document.getElementById("chapter-nav-toggle");
        this.chapterNavContent = document.getElementById("chapter-nav-content");
        this.chapterCount = document.getElementById("chapter-count");
        this.currentChapterDisplay = document.getElementById("current-chapter-display");
        this.chapterProgressFill = document.getElementById("chapter-progress-fill");
        this.chapterTimeInfo = document.getElementById("chapter-time-info");
        this.chaptersListExternal = document.getElementById("chapters-list-external");
        this.chapterIndicator = document.getElementById("chapter-indicator");

        // State for external panel
        this.isExternalPanelVisible = false;
        this.isExternalPanelCollapsed = false;

        this.init();
    }

    init() {
        console.log("Initializing Video Chapters...");

        // Load default chapters
        this.loadChapters();

        // Setup event listeners
        this.setupEventListeners();

        console.log("Video Chapters initialized successfully");
    }
    setupEventListeners() {
        // Chapters button click - now toggles external panel
        if (this.chaptersBtn) {
            this.chaptersBtn.addEventListener("click", () => this.toggleExternalPanel());
        }

        // External panel toggle (collapse/expand)
        if (this.chapterNavToggle) {
            this.chapterNavToggle.addEventListener("click", () => this.toggleExternalPanelCollapse());
        }

        // Close chapters menu (legacy)
        if (this.closeChaptersBtn) {
            this.closeChaptersBtn.addEventListener("click", () => this.closeChaptersMenu());
        }

        // Video time update for chapter tracking
        if (this.video) {
            this.video.addEventListener("timeupdate", () => {
                this.updateCurrentChapter();
                this.updateChapterProgress();
            });
            this.video.addEventListener("loadedmetadata", () => {
                this.renderChapterMarkers();
                this.updateChapterCount();
            });
        }

        // Progress bar hover for chapter preview
        if (this.progressBar) {
            this.progressBar.addEventListener("mousemove", (e) => this.showChapterPreview(e));
            this.progressBar.addEventListener("mouseleave", () => this.hideChapterPreview());
        }

        // Click outside to close panels
        document.addEventListener("click", (e) => {
            if (
                this.isMenuOpen &&
                this.chaptersMenu &&
                !this.chaptersMenu.contains(e.target) &&
                !this.chaptersBtn.contains(e.target)
            ) {
                this.closeChaptersMenu();
            }
            if (
                this.isExternalPanelVisible &&
                this.chapterNavigationPanel &&
                !this.chapterNavigationPanel.contains(e.target) &&
                !this.chaptersBtn.contains(e.target)
            ) {
                this.hideExternalPanel();
            }
        });

        // Keyboard navigation
        document.addEventListener("keydown", (e) => this.handleKeyboard(e));
    }

    loadChapters() {
        // Default chapters for demo - in real app, this would come from video metadata or API
        this.chapters = [
            {
                id: "intro",
                title: "Giới thiệu về CPU",
                startTime: 0,
                endTime: 150, // 2:30
                thumbnail: "images/chapter-thumb-1.jpg",
            },
            {
                id: "architecture",
                title: "Kiến trúc cơ bản",
                startTime: 150,
                endTime: 300, // 5:00
                thumbnail: "images/chapter-thumb-2.jpg",
            },
            {
                id: "components",
                title: "Các thành phần chính",
                startTime: 300,
                endTime: 480, // 8:00
                thumbnail: "images/chapter-thumb-3.jpg",
            },
            {
                id: "performance",
                title: "Hiệu năng và tối ưu",
                startTime: 480,
                endTime: 650, // 10:50
                thumbnail: "images/chapter-thumb-4.jpg",
            },
            {
                id: "practical",
                title: "Thực hành và ứng dụng",
                startTime: 650,
                endTime: 930, // 15:30 (end)
                thumbnail: "images/chapter-thumb-5.jpg",
            },
        ];

        this.renderChaptersList();
        this.renderExternalChaptersList();
        this.updateChapterCount();
        this.updateChapterIndicator();
    }

    loadChaptersForVideo(videoId) {
        // Load specific chapters for different videos
        const videoChapters = {
            "cpu-1": [
                { id: "intro", title: "Giới thiệu về CPU", startTime: 0, endTime: 150 },
                { id: "history", title: "Lịch sử phát triển", startTime: 150, endTime: 300 },
                { id: "importance", title: "Tầm quan trọng", startTime: 300, endTime: 450 },
                { id: "overview", title: "Tổng quan chung", startTime: 450, endTime: 600 },
            ],
            "cpu-2": [
                { id: "basic-arch", title: "Kiến trúc cơ bản", startTime: 0, endTime: 200 },
                { id: "alu", title: "Đơn vị tính toán ALU", startTime: 200, endTime: 400 },
                { id: "control-unit", title: "Đơn vị điều khiển", startTime: 400, endTime: 600 },
                { id: "registers", title: "Thanh ghi", startTime: 600, endTime: 800 },
                { id: "cache", title: "Bộ nhớ đệm", startTime: 800, endTime: 1000 },
            ],
            "ram-1": [
                { id: "ram-intro", title: "Giới thiệu RAM", startTime: 0, endTime: 120 },
                { id: "ram-types", title: "Các loại RAM", startTime: 120, endTime: 300 },
                { id: "ram-speed", title: "Tốc độ và hiệu năng", startTime: 300, endTime: 480 },
                { id: "ram-usage", title: "Cách sử dụng", startTime: 480, endTime: 600 },
            ],
        };
        this.chapters = videoChapters[videoId] || this.chapters;
        this.renderChaptersList();
        this.renderExternalChaptersList();
        this.renderChapterMarkers();
        this.updateChapterCount();
        this.updateChapterIndicator();
    }

    renderChaptersList() {
        if (!this.chaptersList) return;

        this.chaptersList.innerHTML = "";

        if (this.chapters.length === 0) {
            this.chaptersList.innerHTML = '<div class="chapter-loading">Không có phân đoạn cho video này</div>';
            return;
        }

        this.chapters.forEach((chapter, index) => {
            const chapterItem = document.createElement("div");
            chapterItem.className = "chapter-item";
            chapterItem.setAttribute("data-chapter-id", chapter.id);
            chapterItem.setAttribute("tabindex", "0");
            chapterItem.setAttribute("role", "button");
            chapterItem.setAttribute("aria-label", `Chuyển đến phân đoạn: ${chapter.title}`);

            const startTimeFormatted = this.formatTime(chapter.startTime);
            const duration = chapter.endTime - chapter.startTime;
            const durationFormatted = this.formatTime(duration);

            chapterItem.innerHTML = `
                <div class="chapter-thumbnail">
                    <img src="${chapter.thumbnail || "images/video-placeholder.jpg"}" 
                         alt="Thumbnail phân đoạn ${chapter.title}" 
                         onerror="this.src='images/video-placeholder.jpg'">
                </div>
                <div class="chapter-details">
                    <div class="chapter-item-title">${chapter.title}</div>
                    <div class="chapter-item-time">
                        ${startTimeFormatted}
                        <span class="chapter-item-duration">(${durationFormatted})</span>
                    </div>
                </div>
            `;

            // Click to jump to chapter
            chapterItem.addEventListener("click", () => this.jumpToChapter(chapter));
            chapterItem.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.jumpToChapter(chapter);
                }
            });

            this.chaptersList.appendChild(chapterItem);
        });
    }
    renderChapterMarkers() {
        if (!this.chapterMarkers || !this.video.duration || this.chapters.length === 0) return;

        this.chapterMarkers.innerHTML = "";

        this.chapters.forEach((chapter) => {
            if (chapter.startTime > 0) {
                // Don't show marker at 0:00
                const marker = document.createElement("div");
                marker.className = "chapter-marker";
                marker.setAttribute("data-chapter-id", chapter.id);
                marker.setAttribute("role", "button");
                marker.setAttribute("tabindex", "0");
                marker.setAttribute("aria-label", `Chuyển đến: ${chapter.title}`);
                marker.setAttribute("title", `${chapter.title} - ${this.formatTime(chapter.startTime)}`);

                const position = (chapter.startTime / this.video.duration) * 100;
                marker.style.left = `${position}%`;

                // Enhanced interactivity
                marker.addEventListener("click", (e) => {
                    e.stopPropagation();
                    this.jumpToChapter(chapter);
                });

                marker.addEventListener("mouseenter", () => {
                    marker.style.transform = "translateX(-50%) scale(1.2)";
                    marker.style.zIndex = "10";
                });

                marker.addEventListener("mouseleave", () => {
                    marker.style.transform = "translateX(-50%) scale(1)";
                    marker.style.zIndex = "1";
                });

                marker.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        this.jumpToChapter(chapter);
                    }
                });

                this.chapterMarkers.appendChild(marker);
            }
        });

        console.log(`Rendered ${this.chapters.length} chapter markers`);
    }

    updateCurrentChapter() {
        const currentTime = this.video.currentTime;

        // Find current chapter
        const newCurrentChapter = this.chapters.find(
            (chapter) => currentTime >= chapter.startTime && currentTime < chapter.endTime
        );
        if (newCurrentChapter && newCurrentChapter !== this.currentChapter) {
            this.currentChapter = newCurrentChapter;
            this.updateChapterInfo();
            this.updateActiveChapterInList();
            this.updateActiveChapterInExternalList();

            // Show chapter info briefly when chapter changes
            this.showChapterInfo();
        } else if (!newCurrentChapter && this.currentChapter) {
            // No current chapter
            this.currentChapter = null;
            if (this.currentChapterDisplay) {
                this.currentChapterDisplay.textContent = "Chưa có phân đoạn";
            }
            if (this.chapterTimeInfo) {
                this.chapterTimeInfo.textContent = "--:-- / --:--";
            }
            if (this.chapterProgressFill) {
                this.chapterProgressFill.style.width = "0%";
            }
        }
    }

    updateChapterInfo() {
        if (!this.chapterInfo || !this.currentChapter) return;

        const titleEl = document.getElementById("current-chapter-title");
        const timeEl = document.getElementById("current-chapter-time");

        if (titleEl) titleEl.textContent = this.currentChapter.title;
        if (timeEl) {
            const startTime = this.formatTime(this.currentChapter.startTime);
            const endTime = this.formatTime(this.currentChapter.endTime);
            timeEl.textContent = `${startTime} - ${endTime}`;
        }
    }

    updateActiveChapterInList() {
        // Update active state in chapters list
        const chapterItems = this.chaptersList.querySelectorAll(".chapter-item");
        chapterItems.forEach((item) => {
            const chapterId = item.getAttribute("data-chapter-id");
            item.classList.toggle("active", chapterId === this.currentChapter?.id);
        });
    }

    showChapterInfo() {
        if (!this.chapterInfo) return;

        this.chapterInfo.classList.add("visible");

        // Hide after 3 seconds
        setTimeout(() => {
            this.chapterInfo.classList.remove("visible");
        }, 3000);
    }

    jumpToChapter(chapter) {
        if (!this.video) return;

        console.log(`Jumping to chapter: ${chapter.title} at ${chapter.startTime}s`);

        this.video.currentTime = chapter.startTime;
        this.closeChaptersMenu();

        // Highlight the marker briefly
        const marker = this.chapterMarkers.querySelector(`[data-chapter-id="${chapter.id}"]`);
        if (marker) {
            marker.classList.add("highlight");
            setTimeout(() => marker.classList.remove("highlight"), 1000);
        }

        // Show chapter info
        this.showChapterInfo();
    }

    showChapterPreview(e) {
        if (!this.chapterPreview || !this.video.duration || this.chapters.length === 0) return;

        const rect = this.progressBar.getBoundingClientRect();
        const position = (e.clientX - rect.left) / rect.width;
        const previewTime = position * this.video.duration;

        // Find chapter at this time
        const chapter = this.chapters.find((ch) => previewTime >= ch.startTime && previewTime < ch.endTime);

        if (chapter) {
            const previewTitle = this.chapterPreview.querySelector(".preview-title");
            const previewTimeEl = this.chapterPreview.querySelector(".preview-time");

            if (previewTitle) previewTitle.textContent = chapter.title;
            if (previewTimeEl) {
                const timeFormatted = this.formatTime(previewTime);
                previewTimeEl.textContent = timeFormatted;
            }

            // Position the preview
            this.chapterPreview.style.left = `${e.clientX - rect.left}px`;
            this.chapterPreview.classList.add("visible");
        } else {
            this.chapterPreview.classList.remove("visible");
        }
    }

    hideChapterPreview() {
        if (this.chapterPreview) {
            this.chapterPreview.classList.remove("visible");
        }
    }

    toggleChaptersMenu() {
        if (this.isMenuOpen) {
            this.closeChaptersMenu();
        } else {
            this.openChaptersMenu();
        }
    }

    openChaptersMenu() {
        if (!this.chaptersMenu) return;

        this.chaptersMenu.style.display = "block";
        this.chaptersMenu.setAttribute("aria-hidden", "false");
        this.isMenuOpen = true;

        // Add active state to button
        this.chaptersBtn?.classList.add("chapters-active");

        // Focus first chapter item
        const firstChapter = this.chaptersList.querySelector(".chapter-item");
        if (firstChapter) {
            setTimeout(() => firstChapter.focus(), 100);
        }

        console.log("Chapters menu opened");
    }

    closeChaptersMenu() {
        if (!this.chaptersMenu) return;

        this.chaptersMenu.style.display = "none";
        this.chaptersMenu.setAttribute("aria-hidden", "true");
        this.isMenuOpen = false;

        // Remove active state from button
        this.chaptersBtn?.classList.remove("chapters-active");

        console.log("Chapters menu closed");
    }

    // External Chapter Navigation Panel Methods

    toggleExternalPanel() {
        if (this.isExternalPanelVisible) {
            this.hideExternalPanel();
        } else {
            this.showExternalPanel();
        }
    }
    showExternalPanel() {
        if (!this.chapterNavigationPanel) return;

        this.isExternalPanelVisible = true;
        this.chapterNavigationPanel.style.display = "block";

        // Force reflow
        this.chapterNavigationPanel.getBoundingClientRect();

        this.chapterNavigationPanel.classList.add("visible");
        this.chaptersBtn.classList.add("chapters-active");

        console.log("External chapter panel shown");
    }

    hideExternalPanel() {
        if (!this.chapterNavigationPanel) return;

        this.isExternalPanelVisible = false;
        this.chapterNavigationPanel.classList.remove("visible");
        this.chaptersBtn.classList.remove("chapters-active");

        setTimeout(() => {
            if (!this.isExternalPanelVisible) {
                this.chapterNavigationPanel.style.display = "none";
            }
        }, 300);

        console.log("External chapter panel hidden");
    }

    toggleExternalPanelCollapse() {
        if (!this.chapterNavigationPanel) return;

        this.isExternalPanelCollapsed = !this.isExternalPanelCollapsed;
        this.chapterNavigationPanel.classList.toggle("collapsed", this.isExternalPanelCollapsed);

        console.log(`External panel ${this.isExternalPanelCollapsed ? "collapsed" : "expanded"}`);
    }

    renderExternalChaptersList() {
        if (!this.chaptersListExternal) return;

        this.chaptersListExternal.innerHTML = "";

        if (this.chapters.length === 0) {
            this.chaptersListExternal.innerHTML = '<div class="chapter-loading">Không có phân đoạn cho video này</div>';
            return;
        }

        this.chapters.forEach((chapter, index) => {
            const chapterItem = document.createElement("div");
            chapterItem.className = "chapter-item";
            chapterItem.setAttribute("data-chapter-id", chapter.id);
            chapterItem.setAttribute("tabindex", "0");
            chapterItem.setAttribute("role", "button");
            chapterItem.setAttribute("aria-label", `Chuyển đến phân đoạn: ${chapter.title}`);

            const startTimeFormatted = this.formatTime(chapter.startTime);
            const duration = chapter.endTime - chapter.startTime;
            const durationFormatted = this.formatTime(duration);

            chapterItem.innerHTML = `
                <div class="chapter-thumbnail">
                    <img src="${chapter.thumbnail || "images/video-placeholder.jpg"}" 
                         alt="Thumbnail phân đoạn ${chapter.title}" 
                         onerror="this.src='images/video-placeholder.jpg'">
                </div>
                <div class="chapter-details">
                    <div class="chapter-item-title">${chapter.title}</div>
                    <div class="chapter-item-time">
                        ${startTimeFormatted}
                        <span class="chapter-item-duration">(${durationFormatted})</span>
                    </div>
                </div>
            `;

            // Click to jump to chapter
            chapterItem.addEventListener("click", () => this.jumpToChapter(chapter));
            chapterItem.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.jumpToChapter(chapter);
                }
            });

            this.chaptersListExternal.appendChild(chapterItem);
        });
    }

    updateChapterCount() {
        if (this.chapterCount) {
            const count = this.chapters.length;
            this.chapterCount.textContent = `${count} phần`;
        }
    }

    updateChapterIndicator() {
        if (this.chapterIndicator) {
            const hasChapters = this.chapters.length > 0;
            this.chapterIndicator.style.display = hasChapters ? "block" : "none";
        }
    }

    updateChapterProgress() {
        if (!this.currentChapter || !this.chapterProgressFill || !this.chapterTimeInfo || !this.currentChapterDisplay)
            return;

        const currentTime = this.video.currentTime;
        const chapterStart = this.currentChapter.startTime;
        const chapterEnd = this.currentChapter.endTime;
        const chapterDuration = chapterEnd - chapterStart;
        const chapterProgress = Math.max(0, Math.min(1, (currentTime - chapterStart) / chapterDuration));

        // Update progress bar
        this.chapterProgressFill.style.width = `${chapterProgress * 100}%`;

        // Update time info
        const currentChapterTime = Math.max(0, currentTime - chapterStart);
        const currentTimeFormatted = this.formatTime(currentChapterTime);
        const durationFormatted = this.formatTime(chapterDuration);
        this.chapterTimeInfo.textContent = `${currentTimeFormatted} / ${durationFormatted}`;

        // Update current chapter title
        this.currentChapterDisplay.textContent = this.currentChapter.title;

        // Update active state in external list
        this.updateActiveChapterInExternalList();
    }

    updateActiveChapterInExternalList() {
        if (!this.chaptersListExternal) return;

        const chapterItems = this.chaptersListExternal.querySelectorAll(".chapter-item");
        chapterItems.forEach((item) => {
            const chapterId = item.getAttribute("data-chapter-id");
            item.classList.toggle("active", chapterId === this.currentChapter?.id);
        });
    }

    handleKeyboard(e) {
        if (!this.isMenuOpen) return;

        const chapterItems = Array.from(this.chaptersList.querySelectorAll(".chapter-item"));
        const activeItem = document.activeElement;
        const currentIndex = chapterItems.indexOf(activeItem);

        switch (e.key) {
            case "Escape":
                e.preventDefault();
                this.closeChaptersMenu();
                this.chaptersBtn?.focus();
                break;
            case "ArrowDown":
                e.preventDefault();
                {
                    const nextIndex = Math.min(currentIndex + 1, chapterItems.length - 1);
                    chapterItems[nextIndex]?.focus();
                }
                break;

            case "ArrowUp":
                e.preventDefault();
                {
                    const prevIndex = Math.max(currentIndex - 1, 0);
                    chapterItems[prevIndex]?.focus();
                }
                break;

            case "Home":
                e.preventDefault();
                chapterItems[0]?.focus();
                break;

            case "End":
                e.preventDefault();
                chapterItems[chapterItems.length - 1]?.focus();
                break;
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, "0")}`;
        }
    }

    // Public methods for external control
    getCurrentChapter() {
        return this.currentChapter;
    }

    getChapters() {
        return this.chapters;
    }

    setChapters(chapters) {
        this.chapters = chapters;
        this.renderChaptersList();
        this.renderChapterMarkers();
    }

    nextChapter() {
        if (!this.currentChapter) return;

        const currentIndex = this.chapters.findIndex((ch) => ch.id === this.currentChapter.id);
        if (currentIndex < this.chapters.length - 1) {
            this.jumpToChapter(this.chapters[currentIndex + 1]);
        }
    }

    previousChapter() {
        if (!this.currentChapter) return;

        const currentIndex = this.chapters.findIndex((ch) => ch.id === this.currentChapter.id);
        if (currentIndex > 0) {
            this.jumpToChapter(this.chapters[currentIndex - 1]);
        }
    }

    // Update chapters when video changes
    onVideoChange(videoId) {
        this.loadChaptersForVideo(videoId);
        this.currentChapter = null;
        this.closeChaptersMenu();
    }
}

// Export for global use
window.VideoChapters = VideoChapters;
