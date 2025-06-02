// Bookmark Manager - Save and manage important lessons
class BookmarkManager {
    constructor() {
        this.bookmarks = JSON.parse(localStorage.getItem("videoBookmarks")) || [];
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
        this.useDialogPolyfill = false; // For dialog polyfill support

        this.init();
    }

    init() {
        // Check dialog support
        this.checkDialogSupport();

        // Load bookmarks from localStorage
        this.loadBookmarks();

        // Setup event listeners
        this.setupEventListeners();

        // Update UI
        this.updateBookmarkCount();
        this.updateBookmarkList();
    }

    checkDialogSupport() {
        if (!window.HTMLDialogElement) {
            console.warn("Dialog element not supported by browser, loading polyfill");

            // Simple dialog polyfill
            this.useDialogPolyfill = true;

            // Create a showModal method for standard elements
            HTMLElement.prototype._showModal = function () {
                this.style.display = "block";
                this.style.position = "fixed";
                this.style.zIndex = 1000;
                this.style.top = "50%";
                this.style.left = "50%";
                this.style.transform = "translate(-50%, -50%)";

                // Add backdrop
                const backdrop = document.createElement("div");
                backdrop.className = "dialog-backdrop";
                backdrop.style.position = "fixed";
                backdrop.style.top = 0;
                backdrop.style.left = 0;
                backdrop.style.right = 0;
                backdrop.style.bottom = 0;
                backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                backdrop.style.zIndex = 999;
                this._backdrop = backdrop;
                document.body.appendChild(backdrop);

                // Handle close on backdrop click
                backdrop.addEventListener("click", () => {
                    this.close();
                });
            };

            HTMLElement.prototype._close = function () {
                this.style.display = "none";
                if (this._backdrop && this._backdrop.parentNode) {
                    this._backdrop.parentNode.removeChild(this._backdrop);
                }
            };
        }
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

        // Add bookmark button events
        const bookmarksBtn = document.getElementById("bookmarks-btn");
        if (bookmarksBtn) {
            bookmarksBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.showBookmarksDialog();
            });
        } else {
            console.warn("Bookmarks button not found in DOM");
        }
    }
    showBookmarksDialog() {
        // Find or create bookmarks dialog
        let dialog = document.getElementById("bookmarks-dialog");

        if (!dialog) {
            dialog = document.createElement("dialog");
            dialog.id = "bookmarks-dialog";
            dialog.className = "bookmarks-dialog";

            dialog.innerHTML = `
                <div class="dialog-header">
                    <h3>Video đã đánh dấu</h3>
                    <button class="close-dialog">×</button>
                </div>
                <div id="bookmarks-container" class="dialog-content">
                    <!-- Bookmarks will be loaded here -->
                </div>
            `;

            document.body.appendChild(dialog);

            // Add close button event
            dialog.querySelector(".close-dialog").addEventListener("click", () => {
                dialog.close();
            });

            // Close on click outside
            dialog.addEventListener("click", (e) => {
                if (e.target === dialog) {
                    dialog.close();
                }
            });
        } else {
            console.warn("Using existing bookmarks dialog");
        }

        try {
            // Display bookmarks
            this.displayBookmarks();

            // Show dialog with support for browsers without dialog
            if (this.useDialogPolyfill) {
                dialog._showModal();
            } else {
                dialog.showModal();
            }
        } catch (error) {
            console.error("Error showing bookmarks dialog:", error);
            this.showMessage("Không thể hiển thị danh sách video đánh dấu", "error");

            // Fallback display if showModal fails
            dialog.style.display = "block";
        }
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

        // Update bookmark icon in playlist for this video
        if (this.currentVideo && this.currentVideo.id) {
            const isBookmarked = this.isVideoBookmarked(this.currentVideo.id);
            this.updateBookmarkUI(this.currentVideo.id, isBookmarked);
        }
    }
    toggleBookmark(videoId) {
        // Nếu không truyền videoId, sử dụng currentVideo.id
        if (!videoId && this.currentVideo) {
            videoId = this.currentVideo.id;
        }

        // Nếu vẫn không có videoId, hiển thị thông báo và thoát
        if (!videoId) {
            this.showMessage("Không có video nào đang phát", "error");
            return false;
        }

        const index = this.bookmarks.findIndex((b) => b.id === videoId);
        let isBookmarked = false;

        if (index === -1) {
            // Video chưa được đánh dấu - thêm vào
            if (this.currentVideo) {
                this.addBookmark(this.currentVideo);
                this.animateBookmarkButton("add");
                this.showMessage("Đã thêm vào danh sách đánh dấu", "success");
                isBookmarked = true;
            }
        } else {
            // Video đã được đánh dấu - xóa khỏi danh sách
            this.removeBookmark(videoId);
            this.animateBookmarkButton("remove");
            this.showMessage("Đã xóa khỏi danh sách đánh dấu", "success");
            isBookmarked = false;
        }

        // Cập nhật UI cho videoId này
        this.updateBookmarkUI(videoId, isBookmarked);
        return isBookmarked;
    }

    updateBookmarkUI(videoId, isBookmarked) {
        // Update bookmark button on video player
        const bookmarkBtn = document.getElementById("bookmark-btn");
        if (bookmarkBtn) {
            if (isBookmarked) {
                bookmarkBtn.classList.add("active", "bookmarked");
                bookmarkBtn.title = "Đã đánh dấu - Bỏ đánh dấu";
            } else {
                bookmarkBtn.classList.remove("active", "bookmarked");
                bookmarkBtn.title = "Đánh dấu video này";
            }
        }

        // Update bookmark icon on video items in playlist
        const videoItems = document.querySelectorAll(`.video-item[data-video="${videoId}"]`);
        videoItems.forEach((item) => {
            let bookmarkIcon = item.querySelector(".video-bookmark-icon");

            // Nếu không tìm thấy icon, tạo mới
            if (!bookmarkIcon) {
                bookmarkIcon = document.createElement("span");
                bookmarkIcon.className = "video-bookmark-icon";
                bookmarkIcon.innerHTML = "🔖";
                bookmarkIcon.title = "Video đã được đánh dấu";

                // Thêm vào thumbnail container
                const thumbnailContainer = item.querySelector(".video-thumbnail");
                if (thumbnailContainer) {
                    thumbnailContainer.appendChild(bookmarkIcon);
                }
            }

            if (isBookmarked) {
                bookmarkIcon.classList.add("active");
                bookmarkIcon.style.display = "block";
            } else {
                bookmarkIcon.classList.remove("active");
                bookmarkIcon.style.display = "none";
            }
        });
    }
    findVideoById(videoId) {
        for (const category in this.videoData) {
            const found = this.videoData[category].find((v) => v.id === videoId);
            if (found) return found;
        }
        return null;
    }
    getCategoryFromVideoId(videoId) {
        // Assumes IDs are in format "category-number" (e.g., "cpu-1")
        return videoId.split("-")[0];
    }

    checkIfBookmarked(videoId) {
        return this.bookmarks.some((b) => b.id === videoId);
    }
    displayBookmarks() {
        const bookmarksContainer = document.getElementById("bookmarks-container");
        if (!bookmarksContainer) return;

        // Clear existing content
        bookmarksContainer.innerHTML = "";

        if (this.bookmarks.length === 0) {
            bookmarksContainer.innerHTML = `
                <div class="empty-bookmarks">
                    <div class="empty-icon">🔖</div>
                    <p>Chưa có video nào được đánh dấu</p>
                    <p class="empty-hint">Nhấn vào biểu tượng 🔖 khi xem video để đánh dấu và xem lại sau</p>
                </div>
            `;
            return;
        }

        // Sort bookmarks by most recent first
        const sortedBookmarks = [...this.bookmarks].sort((a, b) => b.timestamp - a.timestamp);

        // Create bookmarks list
        const bookmarksList = document.createElement("div");
        bookmarksList.className = "bookmarks-list";

        sortedBookmarks.forEach((bookmark) => {
            // Create thumbnail path
            const thumbnailSrc = bookmark.src.replace(".mp4", ".jpg").replace("videos/", "images/thumbnails/");

            const bookmarkItem = document.createElement("div");
            bookmarkItem.className = "bookmark-item";
            bookmarkItem.dataset.video = bookmark.id;
            bookmarkItem.dataset.src = bookmark.src;

            bookmarkItem.innerHTML = `
                <div class="bookmark-thumbnail">
                    <img src="${thumbnailSrc}" alt="${bookmark.title}">
                    <span class="bookmark-duration">${bookmark.duration}</span>
                    <button class="remove-bookmark" title="Xóa đánh dấu">×</button>
                </div>
                <div class="bookmark-info">
                    <h4>${bookmark.title}</h4>
                    <p>${this.getCategoryLabel(bookmark.category)}</p>
                    <span class="bookmark-date">${this.formatBookmarkDate(bookmark.timestamp)}</span>
                </div>
            `;

            bookmarksList.appendChild(bookmarkItem);
        });

        bookmarksContainer.appendChild(bookmarksList);

        // Add event listeners
        this.setupBookmarkEvents();
    }
    getCategoryLabel(category) {
        const labels = {
            cpu: "CPU - Bộ xử lý trung tâm",
            ram: "RAM - Bộ nhớ truy cập ngẫu nhiên",
            rom: "ROM - Bộ nhớ chỉ đọc",
        };

        return labels[category] || category;
    }
    formatBookmarkDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    setupBookmarkEvents() {
        // Handle bookmark item click to play video
        document.querySelectorAll(".bookmark-item").forEach((item) => {
            item.addEventListener("click", (e) => {
                if (!e.target.closest(".remove-bookmark")) {
                    const videoId = item.dataset.video;
                    const videoSrc = item.dataset.src;
                    if (videoId && videoSrc) {
                        this.playVideo(videoId, videoSrc);

                        // Close bookmarks panel if it's in a dialog
                        const bookmarksDialog = document.getElementById("bookmarks-dialog");
                        if (bookmarksDialog) {
                            bookmarksDialog.close();
                        }
                    }
                }
            });
        });

        // Handle remove bookmark button
        document.querySelectorAll(".remove-bookmark").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const bookmarkItem = e.target.closest(".bookmark-item");
                const videoId = bookmarkItem.dataset.video;

                if (videoId) {
                    this.toggleBookmark(videoId);
                    bookmarkItem.classList.add("removing");

                    // Animate removal
                    setTimeout(() => {
                        bookmarkItem.remove();

                        // Check if bookmarks list is now empty
                        if (this.bookmarks.length === 0) {
                            this.displayBookmarks();
                        }
                    }, 300);
                }
            });
        });
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
            category: video.topic, // Ensure we use the same field name for consistency
            topic: video.topic,
            duration: video.duration,
            timestamp: Date.now(),
            dateAdded: Date.now(),
            currentTime: this.getCurrentVideoTime(),
        };

        this.bookmarks.unshift(bookmark); // Add to beginning
        this.saveBookmarks();
        this.updateBookmarkButton();
        this.updateBookmarkCount();
        this.updateBookmarkList();

        // Update UI
        this.updateBookmarkUI(video.id, true);

        // Add animation effect
        this.bookmarkBtn?.classList.add("bookmark-added");
        setTimeout(() => {
            this.bookmarkBtn?.classList.remove("bookmark-added");
        }, 600);
    }

    removeBookmark(videoId) {
        const index = this.bookmarks.findIndex((bookmark) => bookmark.id === videoId);
        if (index !== -1) {
            const removed = this.bookmarks.splice(index, 1)[0];
            this.saveBookmarks();
            this.updateBookmarkButton();
            this.updateBookmarkCount();
            this.updateBookmarkList();

            // Update UI
            this.updateBookmarkUI(videoId, false);
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
            this.bookmarkCount.textContent = `${count}`;
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
    }

    saveBookmarks() {
        localStorage.setItem("videoBookmarks", JSON.stringify(this.bookmarks));

        // Also update the bookmarks count in the UI
        const bookmarkCountElement = document.getElementById("bookmark-count");
        if (bookmarkCountElement) {
            bookmarkCountElement.textContent = this.bookmarks.length;

            // Show/hide the badge based on bookmark count
            if (this.bookmarks.length > 0) {
                bookmarkCountElement.classList.add("active");
            } else {
                bookmarkCountElement.classList.remove("active");
            }
        }
    }

    loadBookmarks() {
        try {
            const saved = localStorage.getItem("videoBookmarks");
            if (saved) {
                this.bookmarks = JSON.parse(saved);
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
