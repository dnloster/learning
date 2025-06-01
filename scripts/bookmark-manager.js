// Bookmark Manager - Save and manage important lessons
class BookmarkManager {
    constructor() {
        this.bookmarks = [];
        this.currentVideo = null;
        this.videoPlayerController = null;

        // DOM elements
        this.bookmarkBtn = document.getElementById("bookmark-btn");
        this.bookmarkPanel = document.getElementById("bookmark-panel");
        this.bookmarkList = document.getElementById("bookmark-list");
        this.bookmarkEmpty = document.getElementById("bookmark-empty");
        this.bookmarkCount = document.getElementById("bookmark-count");
        this.bookmarkClose = document.getElementById("bookmark-close");
        this.bookmarkIndicator = document.getElementById("bookmark-indicator");

        // State
        this.isPanelVisible = false;

        this.init();
    }

    init() {
        console.log("Initializing Bookmark Manager...");

        // Load bookmarks from localStorage
        this.loadBookmarks();

        // Setup event listeners
        this.setupEventListeners();

        // Update UI
        this.updateBookmarkCount();
        this.updateBookmarkList();

        console.log("Bookmark Manager initialized successfully");
    }
    setupEventListeners() {
        // Bookmark button click - toggle bookmark
        if (this.bookmarkBtn) {
            this.bookmarkBtn.addEventListener("click", (e) => {
                if (e.ctrlKey || e.shiftKey) {
                    // Ctrl+Click or Shift+Click to show bookmark panel
                    this.toggleBookmarkPanel();
                } else {
                    // Regular click to toggle bookmark
                    this.toggleBookmark();
                }
            });

            // Right-click to show bookmark panel
            this.bookmarkBtn.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                this.toggleBookmarkPanel();
            });
        }

        // Close bookmark panel
        if (this.bookmarkClose) {
            this.bookmarkClose.addEventListener("click", () => this.hideBookmarkPanel());
        } // Listen for video changes
        window.addEventListener("video-changed", (event) => {
            console.log("Bookmark manager received video-changed event:", event.detail);
            this.onVideoChange(event.detail);
        });

        // Listen for bookmark panel toggle
        window.addEventListener("toggle-bookmark-panel", () => {
            this.toggleBookmarkPanel();
        });

        // Click outside to close panel
        document.addEventListener("click", (e) => {
            if (
                this.isPanelVisible &&
                this.bookmarkPanel &&
                !this.bookmarkPanel.contains(e.target) &&
                !this.bookmarkBtn.contains(e.target)
            ) {
                this.hideBookmarkPanel();
            }
        });

        // Keyboard shortcuts
        document.addEventListener("keydown", (e) => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

            switch (e.code) {
                case "KeyB":
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleBookmark();
                    }
                    break;
                case "KeyL":
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleBookmarkPanel();
                    }
                    break;
            }
        });
    }
    setVideoPlayerController(controller) {
        this.videoPlayerController = controller;
    }

    setVideoPlayer(playerInterface) {
        this.videoPlayerInterface = playerInterface;
    }

    onVideoChange(videoData) {
        if (!videoData) return;

        this.currentVideo = {
            id: videoData.id || videoData.title,
            title: videoData.title,
            src: videoData.src,
            thumbnail: videoData.thumbnail || "images/video-placeholder.jpg",
            topic: videoData.topic || "General",
            duration: videoData.duration || 0,
        };

        // Update bookmark button state
        this.updateBookmarkButton();

        console.log("Bookmark manager updated for video:", this.currentVideo.title);
    }
    toggleBookmark() {
        console.log("toggleBookmark called, currentVideo:", this.currentVideo);
        if (!this.currentVideo) {
            this.showMessage("Không có video nào đang phát", "error");
            return;
        }

        const isBookmarked = this.isVideoBookmarked(this.currentVideo.id);
        console.log("Is video bookmarked:", isBookmarked);

        if (isBookmarked) {
            this.removeBookmark(this.currentVideo.id);
            this.showMessage("✅ Đã bỏ đánh dấu bài học", "success");
            this.animateBookmarkButton("remove");
        } else {
            this.addBookmark(this.currentVideo);
            this.showMessage("🔖 Đã đánh dấu bài học", "success");
            this.animateBookmarkButton("add");
        }
    }
    animateBookmarkButton(action) {
        if (!this.bookmarkBtn) return;

        // Add animation class
        const animationClass = action === "add" ? "bookmark-add-animation" : "bookmark-remove-animation";
        this.bookmarkBtn.classList.add(animationClass);

        // Remove animation class after animation completes
        setTimeout(() => {
            this.bookmarkBtn.classList.remove(animationClass);
        }, 600);
    }

    addBookmark(video) {
        // Check if already bookmarked
        if (this.isVideoBookmarked(video.id)) {
            return;
        }

        const bookmark = {
            id: video.id,
            title: video.title,
            src: video.src,
            thumbnail: video.thumbnail,
            topic: video.topic,
            duration: video.duration,
            dateAdded: Date.now(),
            currentTime: this.getCurrentVideoTime(),
        };

        this.bookmarks.unshift(bookmark); // Add to beginning
        this.saveBookmarks();
        this.updateBookmarkButton();
        this.updateBookmarkCount();
        this.updateBookmarkList();

        // Add animation effect
        this.bookmarkBtn?.classList.add("bookmark-added");
        setTimeout(() => {
            this.bookmarkBtn?.classList.remove("bookmark-added");
        }, 600);

        console.log("Bookmark added:", bookmark.title);
    }

    removeBookmark(videoId) {
        const index = this.bookmarks.findIndex((bookmark) => bookmark.id === videoId);
        if (index !== -1) {
            const removed = this.bookmarks.splice(index, 1)[0];
            this.saveBookmarks();
            this.updateBookmarkButton();
            this.updateBookmarkCount();
            this.updateBookmarkList();

            console.log("Bookmark removed:", removed.title);
        }
    }

    isVideoBookmarked(videoId) {
        return this.bookmarks.some((bookmark) => bookmark.id === videoId);
    }
    getCurrentVideoTime() {
        // Try direct video access first
        const videoElement = document.getElementById("main-video");
        if (videoElement) {
            return videoElement.currentTime || 0;
        }

        // Fallback to videoPlayerController if available
        if (this.videoPlayerController?.video) {
            return this.videoPlayerController.video.currentTime || 0;
        }

        return 0;
    }

    updateBookmarkButton() {
        if (!this.bookmarkBtn || !this.currentVideo) return;

        const isBookmarked = this.isVideoBookmarked(this.currentVideo.id);

        this.bookmarkBtn.classList.toggle("bookmarked", isBookmarked);

        if (this.bookmarkIndicator) {
            this.bookmarkIndicator.style.display = isBookmarked ? "block" : "none";
        }
        // Update tooltip
        this.bookmarkBtn.title = isBookmarked
            ? "Bỏ đánh dấu bài học\nCtrl+Click hoặc chuột phải: Xem danh sách đã đánh dấu"
            : "Đánh dấu bài học quan trọng\nCtrl+Click hoặc chuột phải: Xem danh sách đã đánh dấu";
    }

    updateBookmarkButtonState() {
        // Alias for updateBookmarkButton for external calls
        this.updateBookmarkButton();
    }

    updateBookmarkCount() {
        if (this.bookmarkCount) {
            const count = this.bookmarks.length;
            this.bookmarkCount.textContent = `${count} bài`;
        }
    }

    updateBookmarkList() {
        if (!this.bookmarkList || !this.bookmarkEmpty) return;

        // Show/hide empty state
        if (this.bookmarks.length === 0) {
            this.bookmarkEmpty.style.display = "block";
            this.bookmarkList.style.display = "none";
            return;
        }

        this.bookmarkEmpty.style.display = "none";
        this.bookmarkList.style.display = "block";

        // Clear existing items
        this.bookmarkList.innerHTML = "";

        // Create bookmark items
        this.bookmarks.forEach((bookmark) => {
            const item = this.createBookmarkItem(bookmark);
            this.bookmarkList.appendChild(item);
        });
    }

    createBookmarkItem(bookmark) {
        const item = document.createElement("div");
        item.className = "bookmark-item";
        item.setAttribute("data-video-id", bookmark.id);

        // Check if this is the currently playing video
        const isCurrent = this.currentVideo && this.currentVideo.id === bookmark.id;
        if (isCurrent) {
            item.classList.add("current");
        }

        item.innerHTML = `
            <div class="bookmark-thumbnail">
                <img src="${bookmark.thumbnail}" 
                     alt="Thumbnail ${bookmark.title}" 
                     onerror="this.src='images/video-placeholder.jpg'">
                <div class="bookmark-play-icon">▶</div>
            </div>
            <div class="bookmark-info">
                <div class="bookmark-item-title">${bookmark.title}</div>
                <div class="bookmark-meta">
                    <span class="bookmark-topic">${bookmark.topic}</span>
                    <span class="bookmark-duration">${this.formatDuration(bookmark.duration)}</span>
                    <span class="bookmark-date">${this.formatDate(bookmark.dateAdded)}</span>
                </div>
            </div>
            <button class="bookmark-remove" title="Xóa đánh dấu">✕</button>
        `;

        // Click to play video
        item.addEventListener("click", (e) => {
            if (!e.target.classList.contains("bookmark-remove")) {
                this.playBookmarkedVideo(bookmark);
            }
        });

        // Remove bookmark
        const removeBtn = item.querySelector(".bookmark-remove");
        removeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.removeBookmark(bookmark.id);
        });
        return item;
    }

    playBookmarkedVideo(bookmark) {
        // Hide bookmark panel
        this.hideBookmarkPanel();
        // Try using the video player interface first
        if (this.videoPlayerInterface?.loadVideo) {
            this.videoPlayerInterface.loadVideo(bookmark);
        }
        // Fallback to video player controller
        else if (this.videoPlayerController) {
            this.videoPlayerController.playVideo(bookmark.id, bookmark.src);

            // Seek to bookmarked time if available
            if (bookmark.currentTime && bookmark.currentTime > 0) {
                setTimeout(() => {
                    if (this.videoPlayerController.video) {
                        this.videoPlayerController.video.currentTime = bookmark.currentTime;
                    }
                }, 500);
            }
        }
        // Final fallback to global video player
        else if (window.videoPlayer) {
            window.videoPlayer.loadVideo(bookmark.id, bookmark.playlist || "cpu");

            // Seek to bookmarked time if available
            if (bookmark.currentTime && bookmark.currentTime > 0) {
                setTimeout(() => {
                    const video = document.getElementById("main-video");
                    if (video) {
                        video.currentTime = bookmark.currentTime;
                    }
                }, 500);
            }
        } else {
            this.showMessage("Không thể phát video", "error");
        }

        console.log("Playing bookmarked video:", bookmark.title);
    }

    toggleBookmarkPanel() {
        if (this.isPanelVisible) {
            this.hideBookmarkPanel();
        } else {
            this.showBookmarkPanel();
        }
    }
    showBookmarkPanel() {
        if (!this.bookmarkPanel) return;

        this.isPanelVisible = true;
        this.bookmarkPanel.style.display = "block";

        // Force reflow
        this.bookmarkPanel.getBoundingClientRect();

        this.bookmarkPanel.classList.add("visible");

        // Add active class to bookmark button
        if (this.bookmarkBtn) {
            this.bookmarkBtn.classList.add("bookmark-active");
        }

        // Update list
        this.updateBookmarkList();

        console.log("Bookmark panel shown");
    }
    hideBookmarkPanel() {
        if (!this.bookmarkPanel) return;

        this.isPanelVisible = false;
        this.bookmarkPanel.classList.remove("visible");

        // Remove active class from bookmark button
        if (this.bookmarkBtn) {
            this.bookmarkBtn.classList.remove("bookmark-active");
        }

        setTimeout(() => {
            if (!this.isPanelVisible) {
                this.bookmarkPanel.style.display = "none";
            }
        }, 300);

        console.log("Bookmark panel hidden");
    }

    saveBookmarks() {
        try {
            localStorage.setItem("videoBookmarks", JSON.stringify(this.bookmarks));
        } catch (error) {
            console.error("Failed to save bookmarks:", error);
        }
    }

    loadBookmarks() {
        try {
            const saved = localStorage.getItem("videoBookmarks");
            if (saved) {
                this.bookmarks = JSON.parse(saved);
                console.log(`Loaded ${this.bookmarks.length} bookmarks from storage`);
            }
        } catch (error) {
            console.error("Failed to load bookmarks:", error);
            this.bookmarks = [];
        }
    }

    formatDuration(seconds) {
        if (!seconds || isNaN(seconds)) return "0:00";

        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return "Hôm nay";
        } else if (diffDays === 1) {
            return "Hôm qua";
        } else if (diffDays < 7) {
            return `${diffDays} ngày trước`;
        } else {
            return date.toLocaleDateString("vi-VN");
        }
    }
    showMessage(message, type = "success") {
        // Remove any existing message
        const existingMessage = document.querySelector(".message-notification");
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement("div");
        messageEl.className = `message-notification ${type}`;

        // Add icon based on message type
        const iconSpan = document.createElement("span");
        iconSpan.className = "message-icon";
        iconSpan.textContent = type === "success" ? "✅" : "❌";

        const messageText = document.createElement("span");
        messageText.textContent = message;

        messageEl.appendChild(iconSpan);
        messageEl.appendChild(messageText);

        // Add to document
        document.body.appendChild(messageEl);

        // Show with animation
        requestAnimationFrame(() => {
            messageEl.classList.add("show");
        });

        // Hide after delay
        setTimeout(() => {
            messageEl.classList.remove("show");
            setTimeout(() => {
                if (messageEl.parentElement) {
                    messageEl.remove();
                }
            }, 500);
        }, 3000);
    }

    // Public API methods
    getBookmarks() {
        return [...this.bookmarks];
    }

    getBookmarkCount() {
        return this.bookmarks.length;
    }

    clearAllBookmarks() {
        this.bookmarks = [];
        this.saveBookmarks();
        this.updateBookmarkButton();
        this.updateBookmarkCount();
        this.updateBookmarkList();
        this.showMessage("Đã xóa tất cả đánh dấu", "success");
    }

    exportBookmarks() {
        const data = {
            version: "1.0",
            exported: Date.now(),
            bookmarks: this.bookmarks,
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `video-bookmarks-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        this.showMessage("Đã xuất danh sách đánh dấu", "success");
    }

    importBookmarks(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.bookmarks && Array.isArray(data.bookmarks)) {
                    this.bookmarks = data.bookmarks;
                    this.saveBookmarks();
                    this.updateBookmarkButton();
                    this.updateBookmarkCount();
                    this.updateBookmarkList();
                    this.showMessage(`Đã nhập ${data.bookmarks.length} đánh dấu`, "success");
                } else {
                    this.showMessage("File không đúng định dạng", "error");
                }
            } catch (error) {
                this.showMessage("Lỗi khi đọc file", "error");
                console.error("Import error:", error);
            }
        };
        reader.readAsText(file);
    }
}

// Export for use in other modules
window.BookmarkManager = BookmarkManager;
