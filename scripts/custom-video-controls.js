class CustomVideoControls {
    constructor() {
        // Get DOM elements with error checking
        this.video = document.getElementById("main-video");
        this.controls = document.getElementById("video-controls");
        this.progressBar = document.getElementById("progress-bar");
        this.progressFilled = document.getElementById("progress-filled");
        this.progressBuffer = document.getElementById("progress-buffer");
        this.progressHandle = document.getElementById("progress-handle");
        this.playPauseBtn = document.getElementById("play-pause-btn");
        this.backwardBtn = document.getElementById("backward-btn");
        this.forwardBtn = document.getElementById("forward-btn");
        this.volumeBtn = document.getElementById("volume-btn");
        this.volumeRange = document.getElementById("volume-range");
        this.currentTimeSpan = document.getElementById("current-time");
        this.durationSpan = document.getElementById("duration");
        this.prevVideoBtn = document.getElementById("prev-video-btn");
        this.nextVideoBtn = document.getElementById("next-video-btn");
        this.fullscreenBtn = document.getElementById("fullscreen-btn");
        this.pipBtn = document.getElementById("pip-btn");
        this.isDragging = false;
        this.hideControlsTimer = null;
        this.warningTimer = null; // For fade warning timer
        this.lastMouseMoveTime = 0; // For throttling mouse events        this.isSeekPending = false; // For smooth seeking
        this.seekValue = 0; // Current seek position during drag
        this.seekDebounceTimer = null; // For debounced seeking
        this.lastSeekTime = 0; // Track last seek time for throttling        // Video chapters system
        this.chapters = null;

        // Bookmark system
        this.bookmarkManager = null; // Debug logging

        this.initSync();

        // Test duration functionality immediately
        setTimeout(() => this.testDurationFunctionality(), 2000);

        // Initialize async parts after a brief delay
        setTimeout(() => this.initAsync(), 0);
    }

    initSync() {
        if (!this.video) {
            console.error("Video element not found! Cannot initialize controls.");
            return;
        }
        this.setupEventListeners();
        this.updateVolumeIcon();
        this.showControls();
        this.startHideTimer();

        // Khởi tạo màu sắc volume slider
        setTimeout(() => {
            const initialVolume = this.video.volume * 100;
            this.updateVolumeSliderColor(initialVolume);
        }, 100);
    }
    async initAsync() {
        // Initialize video chapters system
        try {
            await this.initializeChapters();
        } catch (error) {
            console.error("Failed to initialize chapters:", error);
        } // Initialize bookmark system
        try {
            await this.initializeBookmarks();
        } catch (error) {
            console.error("Failed to initialize bookmark system:", error);
        }

        // Initialize notes system
        try {
            await this.initializeNotes();
        } catch (error) {
            console.error("Failed to initialize notes system:", error);
        }

        // Initialize quiz system - wait a bit longer to ensure quiz manager is loaded
        try {
            await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
        } catch (error) {
            console.error("Failed to initialize quiz system:", error);
            console.warn("Quiz functionality may not work properly");
        }
    }
    setupEventListeners() {
        // Video events
        this.video.addEventListener("loadedmetadata", () => {
            this.updateDuration();
        });
        this.video.addEventListener("timeupdate", () => this.updateProgress());
        this.video.addEventListener("progress", () => this.updateBuffered());
        this.video.addEventListener("play", () => {
            this.updatePlayButton(false);
        });
        this.video.addEventListener("pause", () => {
            this.updatePlayButton(true);
        });
        this.video.addEventListener("volumechange", () => this.updateVolumeIcon());

        // Control button events with null checks
        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener("click", () => {
                this.togglePlayPause();
                this.showPlayPauseFeedback();
            });
        }

        if (this.backwardBtn) {
            this.backwardBtn.addEventListener("click", () => {
                this.skipBackward();
            });
        }

        if (this.forwardBtn) {
            this.forwardBtn.addEventListener("click", () => {
                this.skipForward();
            });
        }

        if (this.volumeBtn) {
            this.volumeBtn.addEventListener("click", () => {
                this.toggleMute();
            });
        }

        if (this.volumeRange) {
            this.volumeRange.addEventListener("input", (e) => {
                this.setVolume(e.target.value);
            });

            // Thêm event listener cho khi user đang kéo để update màu sắc realtime
            this.volumeRange.addEventListener("mousemove", (e) => {
                if (e.buttons === 1) {
                    // Chỉ khi đang nhấn chuột
                    this.updateVolumeSliderColor(e.target.value);
                }
            });

            // Touch events cho mobile
            this.volumeRange.addEventListener("touchmove", (e) => {
                this.updateVolumeSliderColor(e.target.value);
            });
        }

        if (this.prevVideoBtn) {
            this.prevVideoBtn.addEventListener("click", () => {
                this.previousVideo();
            });
        }

        if (this.nextVideoBtn) {
            this.nextVideoBtn.addEventListener("click", () => {
                this.nextVideo();
            });
        }

        if (this.fullscreenBtn) {
            this.fullscreenBtn.addEventListener("click", () => {
                this.toggleFullscreen();
            });
        }

        if (this.pipBtn) {
            this.pipBtn.addEventListener("click", () => {
                this.togglePictureInPicture();
            });
        }

        // Progress bar events with enhanced touch support
        if (this.progressBar) {
            this.progressBar.addEventListener("click", (e) => this.seekTo(e));
            this.progressBar.addEventListener("mouseenter", () => this.onProgressHoverStart());
            this.progressBar.addEventListener("mouseleave", () => this.onProgressHoverEnd());
            this.progressBar.addEventListener("mousemove", (e) => this.onProgressHover(e));

            // Touch events for progress bar direct interaction
            this.progressBar.addEventListener(
                "touchstart",
                (e) => {
                    e.preventDefault();
                    this.seekTo(e);
                },
                { passive: false }
            );
        }

        if (this.progressHandle) {
            // Mouse events
            this.progressHandle.addEventListener("mousedown", (e) => this.startDrag(e));

            // Enhanced touch events with passive: false for better control
            this.progressHandle.addEventListener("touchstart", (e) => this.startDrag(e), { passive: false });

            // Pointer events for unified handling (mouse + touch + pen)
            this.progressHandle.addEventListener("pointerdown", (e) => this.startDrag(e));
        }

        // Global drag events with enhanced touch support
        document.addEventListener("mousemove", (e) => this.drag(e));
        document.addEventListener("mouseup", () => this.endDrag());

        // Touch events with passive: false for preventDefault to work
        document.addEventListener("touchmove", (e) => this.drag(e), { passive: false });
        document.addEventListener("touchend", () => this.endDrag());
        document.addEventListener("touchcancel", () => this.endDrag()); // Pointer events for unified handling
        document.addEventListener("pointermove", (e) => this.drag(e));
        document.addEventListener("pointerup", () => this.endDrag());
        document.addEventListener("pointercancel", () => this.endDrag());

        // Video click functionality - click to play/pause, double-click for fullscreen
        this.setupVideoClickHandlers();

        // Show/hide controls
        this.video.addEventListener("mousemove", () => this.showControls());
        if (this.controls) {
            this.controls.addEventListener("mousemove", () => this.showControls());
        }
        this.video.addEventListener("mouseleave", () => this.startHideTimer());

        // Global mousemove for fullscreen mode
        document.addEventListener("mousemove", () => this.handleGlobalMouseMove()); // Keyboard shortcuts
        document.addEventListener("keydown", (e) => this.handleKeyboard(e)); // Fullscreen change events
        document.addEventListener("fullscreenchange", () => this.onFullscreenChange());
        document.addEventListener("webkitfullscreenchange", () => this.onFullscreenChange());
        document.addEventListener("mozfullscreenchange", () => this.onFullscreenChange());
        document.addEventListener("MSFullscreenChange", () => this.onFullscreenChange());

        // Picture-in-Picture events
        this.video.addEventListener("enterpictureinpicture", () => {
            this.updatePipButton(true);
        });

        this.video.addEventListener("leavepictureinpicture", () => {
            this.updatePipButton(false);
        });

        // Chapter button click handler
        const chaptersBtn = document.getElementById("chapters-btn");
        if (chaptersBtn) {
            chaptersBtn.addEventListener("click", () => {
                if (window.videoChapters) {
                    window.videoChapters.toggleChapterPanel();
                } else {
                    console.error("VideoChapters module not initialized");
                }
            });
        }

        // Chapter preview on progress bar hover
        const progressBar = document.getElementById("progress-bar");
        const chapterPreview = document.getElementById("chapter-preview");
        if (progressBar && chapterPreview) {
            progressBar.addEventListener("mousemove", (e) => {
                // Calculate position percentage
                const rect = progressBar.getBoundingClientRect();
                const position = (e.clientX - rect.left) / rect.width;

                // Find closest chapter
                const videoElement = document.getElementById("main-video");
                if (!videoElement) return;

                const duration = videoElement.duration;
                const currentTime = position * duration;

                // Get current video ID
                let currentVideoId = null;
                if (window.videoPlayerController && window.videoPlayerController.currentVideo) {
                    currentVideoId = window.videoPlayerController.currentVideo.id;
                }

                if (!currentVideoId) return;

                // Get chapters for current video
                let chapters = [];
                if (window.videoPlayerController) {
                    chapters = window.videoPlayerController.getChaptersForVideo(currentVideoId);
                }

                if (chapters.length === 0) return;

                // Find closest chapter
                let closestChapter = chapters[0];
                let nextChapter = null;

                for (let i = 0; i < chapters.length; i++) {
                    if (chapters[i].time <= currentTime) {
                        closestChapter = chapters[i];
                        if (i < chapters.length - 1) {
                            nextChapter = chapters[i + 1];
                        }
                    } else {
                        if (!nextChapter) {
                            nextChapter = chapters[i];
                        }
                        break;
                    }
                }

                // Update preview content
                const previewTitle = chapterPreview.querySelector(".preview-title");
                const previewTime = chapterPreview.querySelector(".preview-time");

                if (previewTitle && previewTime) {
                    previewTitle.textContent = closestChapter.title;

                    const formatTime = (seconds) => {
                        const mins = Math.floor(seconds / 60);
                        const secs = Math.floor(seconds % 60);
                        return `${mins}:${secs.toString().padStart(2, "0")}`;
                    };

                    // Calculate chapter end time
                    let endTime = duration;
                    if (nextChapter) {
                        endTime = nextChapter.time;
                    }

                    previewTime.textContent = `${formatTime(closestChapter.time)} - ${formatTime(endTime)}`;
                }

                // Position and show the preview
                chapterPreview.style.left = `${position * 100}%`;
                chapterPreview.style.display = "block";
                chapterPreview.classList.add("show");
            });

            progressBar.addEventListener("mouseleave", () => {
                chapterPreview.classList.remove("show");
                setTimeout(() => {
                    chapterPreview.style.display = "none";
                }, 200);
            });
        }
    }

    setupVideoClickHandlers() {
        // Variables to track click behavior
        this.clickTimeout = null;
        this.clickCount = 0;
        this.lastClickTime = 0;
        this.doubleClickDelay = 300; // 300ms to detect double-click

        // Add click event listener to video element
        this.video.addEventListener("click", (e) => this.handleVideoClick(e));
    }

    handleVideoClick(e) {
        // Prevent click if it's on the controls area
        if (this.isClickOnControls(e)) {
            return;
        }

        const currentTime = Date.now();
        const timeSinceLastClick = currentTime - this.lastClickTime;

        // Clear existing timeout
        if (this.clickTimeout) {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
        }

        // Check for double-click (within delay and not too far apart)
        if (timeSinceLastClick < this.doubleClickDelay && this.clickCount === 1) {
            // This is a double-click
            this.handleDoubleClick(e);
            this.clickCount = 0;
        } else {
            // This might be a single click, wait to see if there's another click
            this.clickCount = 1;
            this.lastClickTime = currentTime;

            this.clickTimeout = setTimeout(() => {
                // No second click came, this is a single click
                this.handleSingleClick(e);
                this.clickCount = 0;
                this.clickTimeout = null;
            }, this.doubleClickDelay);
        }
    }

    isClickOnControls(e) {
        // Check if click is on controls area by checking if the click target
        // is within the controls overlay or any control element
        const controlsOverlay = document.getElementById("video-controls");
        const controlElements = [
            this.playPauseBtn,
            this.backwardBtn,
            this.forwardBtn,
            this.volumeBtn,
            this.volumeRange,
            this.progressBar,
            this.fullscreenBtn,
            this.pipBtn,
            this.prevVideoBtn,
            this.nextVideoBtn,
        ].filter(Boolean); // Remove null elements        // Check if click is on controls overlay
        if (controlsOverlay?.contains(e.target)) {
            return true;
        }

        // Check if click is on any control element
        for (const element of controlElements) {
            if (element?.contains(e.target)) {
                return true;
            }
        }

        return false;
    }
    handleSingleClick(e) {
        // Show visual feedback effect BEFORE toggle to show correct state
        this.showPlayPauseFeedback();

        this.togglePlayPause();

        // Show controls briefly when user clicks
        this.showControls();
        this.startHideTimer();
    }

    handleDoubleClick(e) {
        this.toggleFullscreen();
    }
    togglePlayPause() {
        if (this.video.paused) {
            this.video.play().catch((error) => {
                console.warn("Play failed:", error);
                // Show fallback message for demo mode
                this.showDemoMessage();
            });
        } else {
            this.video.pause();
        }
    }
    showPlayPauseFeedback() {
        // Remove any existing feedback elements
        const existingFeedback = this.video.parentElement.querySelector(".video-action-feedback");
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Create simple feedback element
        const feedback = document.createElement("div");
        feedback.className = "video-action-feedback";

        // Determine if video will be playing or paused after toggle
        const willPlay = this.video.paused;

        // Create simple icons like YouTube
        if (willPlay) {
            feedback.innerHTML = '<span class="feedback-icon play">▶</span>';
        } else {
            feedback.innerHTML = '<span class="feedback-icon pause">⏸</span>';
        }

        // Add to video player container
        this.video.parentElement.appendChild(feedback);

        // Simple show/hide animation
        requestAnimationFrame(() => {
            feedback.classList.add("show");
        }); // Remove after a short time
        setTimeout(() => {
            if (feedback.parentElement) {
                feedback.remove();
            }
        }, 600);
    }

    showDemoMessage() {
        // Show demo message when video can't play
        const overlay = document.querySelector(".video-overlay");
        if (overlay) {
            overlay.classList.add("visible");
            const title = document.getElementById("current-video-title");
            if (title && !title.textContent.includes("Demo Mode")) {
                title.textContent += " - Demo Mode (No video file)";
            }

            setTimeout(() => {
                overlay.classList.remove("visible");
            }, 3000);
        }
    }

    updatePlayButton(isPaused) {
        const icon = this.playPauseBtn?.querySelector(".icon");
        if (icon) {
            icon.textContent = isPaused ? "▶️" : "⏸️";
        }
    }

    skipBackward() {
        this.video.currentTime = Math.max(0, this.video.currentTime - 10);
        this.showControls();
    }

    skipForward() {
        this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 10);
        this.showControls();
    }

    toggleMute() {
        this.video.muted = !this.video.muted;
        this.volumeRange.value = this.video.muted ? 0 : this.video.volume * 100;
    }
    updateVolumeIcon() {
        const icon = this.volumeBtn?.querySelector(".icon");
        if (!icon) return;

        const currentVolume = this.video.muted ? 0 : this.video.volume * 100;

        if (this.video.muted || this.video.volume === 0) {
            icon.textContent = "🔇";
        } else if (this.video.volume < 0.5) {
            icon.textContent = "🔉";
        } else {
            icon.textContent = "🔊";
        }

        // Cập nhật màu sắc thanh volume
        this.updateVolumeSliderColor(currentVolume);
    }
    setVolume(value) {
        this.video.volume = value / 100;
        this.video.muted = false;
        this.updateVolumeSliderColor(value);
    }

    updateVolumeSliderColor(volumePercentage) {
        const volumeRange = document.getElementById("volume-range");
        if (volumeRange) {
            // Cập nhật CSS custom property để thay đổi màu sắc
            volumeRange.style.setProperty("--volume-percentage", `${volumePercentage}%`);

            // Tạo gradient động dựa trên mức âm lượng với màu sắc trực quan
            let gradientColor = "#666666"; // Màu mặc định cho âm lượng thấp

            if (volumePercentage > 80) {
                gradientColor = "#ff0000"; // Đỏ - âm lượng rất cao
            } else if (volumePercentage > 60) {
                gradientColor = "#ff4400"; // Cam đỏ - âm lượng cao
            } else if (volumePercentage > 40) {
                gradientColor = "#ff8800"; // Cam - âm lượng trung bình cao
            } else if (volumePercentage > 20) {
                gradientColor = "#ffbb00"; // Vàng cam - âm lượng trung bình
            } else if (volumePercentage > 5) {
                gradientColor = "#44ff44"; // Xanh lá - âm lượng thấp
            } // Tạo gradient đúng hướng cho slider dọc (xoay 180 độ)
            // Gradient hiển thị từ dưới lên: màu âm lượng ở dưới, trong suốt ở trên
            const gradient = `linear-gradient(to bottom, 
                rgba(255, 255, 255, 0.2) 0%, 
                rgba(255, 255, 255, 0.2) ${volumePercentage}%, 
                ${gradientColor} ${volumePercentage}%, 
                ${gradientColor} 100%)`;

            volumeRange.style.background = gradient;

            // Cập nhật màu sắc thumb
            const thumbColor = volumePercentage > 0 ? gradientColor : "#666666";
            volumeRange.style.setProperty("--thumb-color", thumbColor);
        }
    }

    testDurationFunctionality() {
        if (this.durationSpan) {
            // Try to manually set a test duration
            this.durationSpan.textContent = "TEST";

            // Reset to original or formatted time
            if (this.video?.duration) {
                const formatted = this.formatTime(this.video.duration);
                this.durationSpan.textContent = formatted;
            } else {
                this.durationSpan.textContent = "0:00";
            }
        } else {
            console.error("Duration span element not found!");
        }
    }

    updateDuration() {
        if (this.durationSpan) {
            const formattedTime = this.formatTime(this.video.duration);
            this.durationSpan.textContent = formattedTime;
        } else {
            console.warn("durationSpan element not found!");
        }
    }

    updateProgress() {
        if (!this.video.duration) return;

        const progress = (this.video.currentTime / this.video.duration) * 100;

        if (this.progressFilled) {
            this.progressFilled.style.width = `${progress}%`;
        }

        if (this.progressHandle) {
            this.progressHandle.style.left = `${progress}%`;
        }

        if (this.currentTimeSpan) {
            this.currentTimeSpan.textContent = this.formatTime(this.video.currentTime);
        }
    }

    updateBuffered() {
        if (!this.video.duration || !this.progressBuffer) return;

        const buffered = this.video.buffered;
        if (buffered.length > 0) {
            const bufferedEnd = buffered.end(buffered.length - 1);
            const bufferedPercent = (bufferedEnd / this.video.duration) * 100;
            this.progressBuffer.style.width = `${bufferedPercent}%`;
        }
    }
    seekTo(e) {
        if (!this.video.duration) return;

        const rect = this.progressBar.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = pos * this.video.duration;

        // Smooth seeking with visual feedback
        this.updateSeekPreview(pos, newTime);
        this.performSeek(newTime);
        this.showControls();
    }
    updateSeekPreview(pos, time) {
        // Enhanced visual feedback with requestAnimationFrame for smoothness
        requestAnimationFrame(() => {
            // Update progress bar immediately for visual feedback
            if (this.progressFilled) {
                this.progressFilled.style.width = `${pos * 100}%`;
                // Temporarily disable transition for immediate response during drag
                if (this.isDragging) {
                    this.progressFilled.style.transition = "none";
                } else {
                    this.progressFilled.style.transition = "";
                }
            }

            if (this.progressHandle) {
                this.progressHandle.style.left = `${pos * 100}%`;
                // Add slight scale effect during drag for better feedback
                if (this.isDragging) {
                    this.progressHandle.style.transform = "translate(-50%, -50%) scale(1.15)";
                } else {
                    this.progressHandle.style.transform = "";
                }
            }

            if (this.currentTimeSpan) {
                this.currentTimeSpan.textContent = this.formatTime(time);
            }
        });
    }
    performSeek(time) {
        // Enhanced throttling with debounce for smoother seeking
        const now = Date.now();
        const timeSinceLastSeek = now - this.lastSeekTime;

        // Clear any existing debounce timer
        clearTimeout(this.seekDebounceTimer);

        // If it's been more than 16ms (60fps) since last seek, seek immediately
        if (timeSinceLastSeek >= 16 && !this.isSeekPending) {
            this.doSeek(time);
        } else {
            // Otherwise, debounce the seek operation
            this.seekDebounceTimer = setTimeout(() => {
                this.doSeek(time);
            }, 16);
        }
    }

    doSeek(time) {
        if (this.isSeekPending) return;

        this.isSeekPending = true;
        this.lastSeekTime = Date.now();

        try {
            this.video.currentTime = time;
        } catch (error) {
            console.warn("Seek failed:", error);
        }

        // Clear the pending flag after a short delay
        setTimeout(() => {
            this.isSeekPending = false;
        }, 16);
    }
    startDrag(e) {
        this.isDragging = true;
        this.showControls();

        // Add visual feedback for dragging
        this.progressHandle?.classList.add("dragging");
        this.progressBar?.classList.add("seeking");

        // Store initial mouse/touch position for smooth dragging
        this.lastDragX = e.clientX || e.touches?.[0]?.clientX;

        // Prevent text selection and other interactions
        e.preventDefault();
        document.body.style.userSelect = "none";
        // Add pointer capture for better drag tracking
        if (e.target?.setPointerCapture && e.pointerId) {
            e.target.setPointerCapture(e.pointerId);
        }
    }
    drag(e) {
        if (!this.isDragging || !this.video.duration) return;

        const rect = this.progressBar.getBoundingClientRect();
        const clientX = e.clientX || e.touches?.[0]?.clientX;

        // Enhanced position calculation with bounds checking
        const rawPos = (clientX - rect.left) / rect.width;
        const pos = Math.max(0, Math.min(1, rawPos));
        const newTime = pos * this.video.duration;

        // Store the seek value for smooth updates
        this.seekValue = newTime;
        this.lastDragX = clientX;

        // Update visual feedback immediately for responsiveness
        this.updateSeekPreview(pos, newTime);

        // Enhanced throttled seeking with better performance
        this.performSeek(newTime);

        e.preventDefault();

        // Prevent event bubbling for better touch handling
        e.stopPropagation();
    }
    endDrag() {
        if (!this.isDragging) return;

        this.isDragging = false;

        // Remove visual feedback
        this.progressHandle?.classList.remove("dragging");
        this.progressBar?.classList.remove("seeking");
        document.body.style.userSelect = "";

        // Clear any pending debounce timers
        clearTimeout(this.seekDebounceTimer);

        // Final seek to ensure accuracy with the exact position
        if (this.seekValue !== undefined) {
            // Force final seek without throttling for precision
            this.video.currentTime = this.seekValue;
        }

        // Reset drag-related variables
        this.lastDragX = null;
        this.seekValue = undefined;
    }

    previousVideo() {
        // Dispatch custom event for video player controller
        window.dispatchEvent(new CustomEvent("previous-video"));

        // Also try direct call if video player controller exists
        if (window.videoPlayerController && typeof window.videoPlayerController.previousVideo === "function") {
            window.videoPlayerController.previousVideo();
        }
    }

    nextVideo() {
        // Dispatch custom event for video player controller
        window.dispatchEvent(new CustomEvent("next-video"));

        // Also try direct call if video player controller exists
        if (window.videoPlayerController && typeof window.videoPlayerController.nextVideo === "function") {
            window.videoPlayerController.nextVideo();
        }
    }

    toggleFullscreen() {
        const elem = this.video?.parentElement || this.video;

        if (
            !document.fullscreenElement &&
            !document.webkitFullscreenElement &&
            !document.mozFullScreenElement &&
            !document.msFullscreenElement
        ) {
            // Enter fullscreen
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(console.error);
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else if (document.exitFullscreen) {
            document.exitFullscreen().catch(console.error);
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    async togglePictureInPicture() {
        try {
            if (!("pictureInPictureEnabled" in document)) {
                console.warn("Picture-in-Picture is not supported by this browser");
                this.showMessage("Picture-in-Picture không được hỗ trợ trên trình duyệt này");
                return;
            }

            if (this.video.pictureInPictureElement) {
                // Exit PiP mode
                await document.exitPictureInPicture();
                this.updatePipButton(false);
            } else {
                // Enter PiP mode
                await this.video.requestPictureInPicture();
                this.updatePipButton(true);
            }
        } catch (error) {
            console.error("Error toggling Picture-in-Picture:", error);
            this.showMessage("Không thể kích hoạt Picture-in-Picture");
        }
    }

    updatePipButton(isInPip) {
        if (!this.pipBtn) return;

        const icon = this.pipBtn.querySelector(".icon");
        if (icon) {
            icon.textContent = isInPip ? "📺" : "📱";
        }

        this.pipBtn.title = isInPip ? "Thoát Picture-in-Picture" : "Picture-in-Picture";
    }

    showMessage(message) {
        // Create a temporary message overlay
        const messageDiv = document.createElement("div");
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
            pointer-events: none;
        `;

        document.body.appendChild(messageDiv);

        // Remove after 3 seconds
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
    }

    onFullscreenChange() {
        const isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );

        if (isFullscreen) {
            // In fullscreen mode - ensure controls are visible and properly styled
            this.showControls();
            this.clearHideTimer(); // Clear any existing timer
            this.controls?.classList.add("fullscreen-mode");

            // Make sure controls are above fullscreen content
            if (this.controls) {
                this.controls.style.zIndex = "2147483647"; // Maximum z-index
                this.controls.style.position = "fixed";
                this.controls.style.bottom = "0";
                this.controls.style.left = "0";
                this.controls.style.right = "0";
            }

            // Update fullscreen button icon
            if (this.fullscreenBtn) {
                this.fullscreenBtn.innerHTML = "⏹"; // Exit fullscreen icon
                this.fullscreenBtn.title = "Exit fullscreen";
            }

            // Start 4-second timer for fullscreen auto-hide
            this.startHideTimer();
        } else {
            // Not in fullscreen mode - restore normal styling
            this.controls?.classList.remove("fullscreen-mode");

            // Reset control styles
            if (this.controls) {
                this.controls.style.zIndex = "";
                this.controls.style.position = "";
                this.controls.style.bottom = "";
                this.controls.style.left = "";
                this.controls.style.right = "";
            }
            // Update fullscreen button icon
            if (this.fullscreenBtn) {
                this.fullscreenBtn.innerHTML = "⛶"; // Enter fullscreen icon
                this.fullscreenBtn.title = "Enter fullscreen";
            }

            // Restart hide timer for normal mode
            this.startHideTimer();
        }
    }

    showControls() {
        this.controls?.classList.add("visible");
        this.clearHideTimer();
        this.startHideTimer();
    }
    hideControls() {
        this.controls?.classList.remove("visible");
    }

    startHideTimer() {
        const isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );

        // Use 4 seconds timer for fullscreen mode, 3 seconds for normal mode
        const hideDelay = isFullscreen ? 4000 : 3000;

        // For fullscreen mode, show warning 1 second before hiding
        if (isFullscreen) {
            const warningDelay = hideDelay - 1000; // 3 seconds for warning
            this.warningTimer = setTimeout(() => {
                if (this.controls?.classList.contains("visible")) {
                    this.controls.classList.add("fade-warning");
                    setTimeout(() => {
                        this.controls?.classList.remove("fade-warning");
                    }, 500);
                }
            }, warningDelay);
        }

        this.hideControlsTimer = setTimeout(() => {
            if (!this.video.paused) {
                this.hideControls();
            }
        }, hideDelay);
    }

    clearHideTimer() {
        if (this.hideControlsTimer) {
            clearTimeout(this.hideControlsTimer);
            this.hideControlsTimer = null;
        }
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
            this.warningTimer = null;
        }
        // Remove warning class if present
        this.controls?.classList.remove("fade-warning");
    }

    handleGlobalMouseMove() {
        // Throttle mouse move events to avoid excessive calls
        const now = Date.now();
        if (now - this.lastMouseMoveTime < 100) {
            // Throttle to 100ms
            return;
        }
        this.lastMouseMoveTime = now;

        const isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );

        // Only handle global mouse move in fullscreen mode
        if (isFullscreen) {
            this.showControls();
        }
    }
    handleKeyboard(e) {
        if (e.target.tagName === "INPUT") return;

        switch (e.code) {
            case "Space":
                e.preventDefault();
                this.showPlayPauseFeedback();
                this.togglePlayPause();
                break;
            case "ArrowLeft":
                e.preventDefault();
                if (e.shiftKey) {
                    this.fineSeek(-1); // 1 second backward
                } else {
                    this.skipBackward(); // 10 seconds backward
                }
                break;
            case "ArrowRight":
                e.preventDefault();
                if (e.shiftKey) {
                    this.fineSeek(1); // 1 second forward
                } else {
                    this.skipForward(); // 10 seconds forward
                }
                break;
            case "Comma":
                e.preventDefault();
                this.fineSeek(-0.1); // Frame by frame backward
                break;
            case "Period":
                e.preventDefault();
                this.fineSeek(0.1); // Frame by frame forward
                break;
            case "Home":
                e.preventDefault();
                this.seekToPosition(0); // Go to start
                break;
            case "End":
                e.preventDefault();
                this.seekToPosition(this.video.duration - 1); // Go to end
                break;
            case "ArrowUp":
                e.preventDefault();
                this.video.volume = Math.min(1, this.video.volume + 0.1);
                break;
            case "ArrowDown":
                e.preventDefault();
                this.video.volume = Math.max(0, this.video.volume - 0.1);
                break;
            case "KeyM":
                e.preventDefault();
                this.toggleMute();
                break;
            case "KeyF":
                e.preventDefault();
                this.toggleFullscreen();
                break;
        }
    }

    fineSeek(seconds) {
        if (!this.video.duration) return;

        const newTime = Math.max(0, Math.min(this.video.duration, this.video.currentTime + seconds));
        this.seekToPosition(newTime);
        this.showControls();
    }

    seekToPosition(time) {
        if (!this.video.duration) return;

        const pos = time / this.video.duration;
        this.updateSeekPreview(pos, time);
        this.video.currentTime = time;
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";

        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }

    // Public methods for external control
    play() {
        return this.video.play();
    }

    pause() {
        this.video.pause();
    }
    setSource(src) {
        this.video.src = src;
    }

    resetControls() {
        // Reset control states when loading a new video
        if (this.progressFilled) {
            this.progressFilled.style.width = "0%";
        }
        if (this.progressHandle) {
            this.progressHandle.style.left = "0%";
        }
        if (this.currentTimeSpan) {
            this.currentTimeSpan.textContent = "0:00";
        }
        if (this.durationSpan) {
            this.durationSpan.textContent = "0:00";
        }
    }

    getCurrentTime() {
        return this.video.currentTime;
    }
    getDuration() {
        return this.video.duration;
    }

    setCurrentTime(time) {
        this.video.currentTime = time;
    }
    // Video Chapters Integration
    async initializeChapters() {
        try {
            // Check if VideoChapters is already available globally
            if (window.videoChapters) {
                this.chapters = window.videoChapters;
            } else if (window.VideoChapters) {
                // If the class is available but not instantiated
                this.chapters = new window.VideoChapters(this.video, this);
                console.log("Created new VideoChapters instance from global class");
            } else {
                // Try dynamic import
                try {
                    const chapterModule = await import("./video-chapters.js");

                    // Handle different export patterns
                    const VideoChaptersClass = chapterModule.default || chapterModule.VideoChapters || chapterModule;

                    if (typeof VideoChaptersClass === "function") {
                        this.chapters = new VideoChaptersClass(this.video, this);
                        console.log("Created VideoChapters instance from dynamic import");
                    } else if (typeof VideoChaptersClass === "object" && VideoChaptersClass !== null) {
                        // If it's already an instance
                        this.chapters = VideoChaptersClass;
                        console.log("Using VideoChapters object from import");
                    } else {
                        throw new Error("VideoChapters is not a constructor or valid object");
                    }
                } catch (importError) {
                    console.error("Failed to import VideoChapters:", importError);

                    // Create a minimal fallback
                    this.chapters = this.createFallbackChapters();
                    console.warn("Using fallback chapter system");
                }
            }

            // Listen for video changes to update chapters
            window.addEventListener("video-changed", (event) => {
                this.handleVideoChange(event.detail);
            });
        } catch (error) {
            console.error("Failed to initialize video chapters:", error);

            // Create fallback system
            this.chapters = this.createFallbackChapters();
            console.warn("Using fallback chapter system due to initialization error");
        }
    }

    createFallbackChapters() {
        return {
            loadChaptersForVideo: (videoId) => {
                console.log("Fallback: Loading chapters for video", videoId);
                // Basic fallback implementation
            },
            toggleChapterPanel: () => {
                const chapterPanel = document.getElementById("chapter-navigation-panel");
                const chaptersBtn = document.getElementById("chapters-btn");

                if (chapterPanel) {
                    const isVisible = chapterPanel.style.display !== "none";
                    chapterPanel.style.display = isVisible ? "none" : "flex";

                    if (chaptersBtn) {
                        chaptersBtn.classList.toggle("active", !isVisible);
                    }

                    const indicator = document.getElementById("chapter-indicator");
                    if (indicator) {
                        indicator.style.display = isVisible ? "none" : "inline-block";
                    }
                }
            },
            getCurrentChapter: () => null,
            getChapters: () => [],
        };
    }

    handleVideoChange(videoData) {
        if (this.chapters && videoData) {
            // Load chapters for the new video
            this.chapters.loadChaptersForVideo(videoData.id || videoData.title);
        }
    } // Get chapters instance for external access
    getChapters() {
        return this.chapters;
    }

    // Bookmark System Integration
    async initializeBookmarks() {
        try {
            // Wait for BookmarkManager to be available
            let attempts = 0;
            const maxAttempts = 50;

            const waitForBookmarkManager = () => {
                return new Promise((resolve, reject) => {
                    const checkForBookmarks = () => {
                        attempts++;

                        if (window.bookmarkManager) {
                            resolve(window.bookmarkManager);
                        } else if (window.BookmarkManager) {
                            resolve(new window.BookmarkManager());
                        } else if (attempts >= maxAttempts) {
                            reject(new Error("BookmarkManager not available after maximum attempts"));
                        } else {
                            setTimeout(checkForBookmarks, 100);
                        }
                    };

                    checkForBookmarks();
                });
            };

            this.bookmarkManager = await waitForBookmarkManager();

            // Connect bookmark manager with video player
            if (this.bookmarkManager.setVideoPlayer) {
                this.bookmarkManager.setVideoPlayer({
                    getCurrentVideo: () => this.getCurrentVideoData(),
                    loadVideo: (videoData) => this.loadVideoFromBookmark(videoData),
                });
            }

            // Listen for video changes to update bookmark status
            window.addEventListener("video-changed", (event) => {
                this.handleBookmarkVideoChange(event.detail);
            });
        } catch (error) {
            console.error("Failed to initialize bookmark system:", error);

            // Create fallback bookmark system
            this.bookmarkManager = this.createFallbackBookmarkManager();
            console.warn("Using fallback bookmark system");
        }
    }

    handleBookmarkVideoChange(videoData) {
        if (this.bookmarkManager && videoData) {
            // Update bookmark button state for the new video
            const videoId = videoData.id || videoData.title || "default";

            // Check which method is available
            if (this.bookmarkManager.updateBookmarkButtonState) {
                this.bookmarkManager.updateBookmarkButtonState(videoId);
            } else if (this.bookmarkManager.setCurrentVideo) {
                this.bookmarkManager.setCurrentVideo(videoId);
            } else if (this.bookmarkManager.checkBookmarkStatus) {
                this.bookmarkManager.checkBookmarkStatus(videoId);
            } else {
                console.warn("BookmarkManager does not have any video update method");
            }

            // Update bookmark button appearance
            this.updateBookmarkButtonAppearance(videoId);
        }
    }

    updateBookmarkButtonAppearance(videoId) {
        const bookmarkBtn = document.getElementById("bookmark-btn");
        if (bookmarkBtn && this.bookmarkManager) {
            try {
                // Check if current video is bookmarked
                let isBookmarked = false;

                if (this.bookmarkManager.isBookmarked) {
                    isBookmarked = this.bookmarkManager.isBookmarked(videoId);
                } else if (this.bookmarkManager.getBookmarks) {
                    const bookmarks = this.bookmarkManager.getBookmarks();
                    isBookmarked = bookmarks.some((bookmark) => bookmark.id === videoId);
                }

                // Update button appearance
                const icon = bookmarkBtn.querySelector(".control-icon");
                if (icon) {
                    icon.textContent = isBookmarked ? "🔖" : "🔖";
                }

                // Update button state
                bookmarkBtn.classList.toggle("bookmarked", isBookmarked);
                bookmarkBtn.title = isBookmarked ? "Bỏ đánh dấu video này" : "Đánh dấu video này";
            } catch (error) {
                console.error("Error updating bookmark button appearance:", error);
            }
        }
    }

    getCurrentVideoData() {
        // Get current video data from video player controller
        if (window.videoPlayerController && window.videoPlayerController.currentVideo) {
            return window.videoPlayerController.currentVideo;
        }

        // Fallback: try to get data from video element
        const videoElement = document.getElementById("main-video");
        if (videoElement) {
            const source = videoElement.querySelector("source");
            const src = source ? source.src : "";
            const videoId = src.split("/").pop().replace(".mp4", "") || "default";

            return {
                id: videoId,
                title: document.getElementById("current-video-title")?.textContent || "Unknown Video",
                src: src,
                currentTime: videoElement.currentTime || 0,
                duration: videoElement.duration || 0,
            };
        }

        return null;
    }

    getCurrentVideoId() {
        const videoData = this.getCurrentVideoData();
        return videoData ? videoData.id : "default";
    }

    loadVideoFromBookmark(videoData) {
        // Load video from bookmark data
        if (window.videoPlayerController && videoData) {
            try {
                // Load the video
                if (window.videoPlayerController.playVideo) {
                    window.videoPlayerController.playVideo(videoData.id, videoData.src);
                }

                // Seek to bookmarked time if available
                if (videoData.currentTime && videoData.currentTime > 0) {
                    setTimeout(() => {
                        const videoElement = document.getElementById("main-video");
                        if (videoElement) {
                            videoElement.currentTime = videoData.currentTime;
                        }
                    }, 1000); // Wait for video to load
                }
            } catch (error) {
                console.error("Error loading video from bookmark:", error);
            }
        }
    }

    createFallbackBookmarkManager() {
        return {
            setVideoPlayer: (player) => {
                console.log("Fallback: Video player set for bookmarks");
            },
            updateBookmarkButtonState: () => {
                console.log("Fallback: Updating bookmark button state");
            },
            toggleBookmark: () => {
                console.log("Fallback: Toggling bookmark");
            },
            getBookmarks: () => [],
            isBookmarked: (videoId) => false,
        };
    }

    // Notes System Integration
    async initializeNotes() {
        try {
            // Wait for NotesManager to be available
            let attempts = 0;
            const maxAttempts = 50;

            const waitForNotesManager = () => {
                return new Promise((resolve, reject) => {
                    const checkForNotes = () => {
                        attempts++;

                        if (window.notesManager) {
                            resolve(window.notesManager);
                        } else if (window.NotesManager) {
                            resolve(new window.NotesManager());
                        } else if (attempts >= maxAttempts) {
                            reject(new Error("NotesManager not available after maximum attempts"));
                        } else {
                            setTimeout(checkForNotes, 100);
                        }
                    };

                    checkForNotes();
                });
            };

            this.notesManager = await waitForNotesManager();

            // Connect notes manager with video player - check if methods exist first
            if (this.notesManager.setCurrentVideo) {
                this.notesManager.setCurrentVideo(this.getCurrentVideoId());
            } else if (this.notesManager.setVideo) {
                this.notesManager.setVideo(this.getCurrentVideoId());
            } else {
                console.warn("NotesManager does not have setCurrentVideo or setVideo method");
            }

            // Listen for video changes to update notes for current video
            window.addEventListener("video-changed", (event) => {
                this.handleNotesVideoChange(event.detail);
            });

            // Set up notes button to toggle notes panel
            const notesBtn = document.getElementById("note-add-btn");
            if (notesBtn) {
                // Click to add note at current time
                notesBtn.addEventListener("click", () => {
                    if (this.notesManager.addNoteAtCurrentTime) {
                        this.notesManager.addNoteAtCurrentTime();
                    } else if (this.notesManager.showNotesModal) {
                        this.notesManager.showNotesModal();
                    } else {
                        console.warn("NotesManager does not have addNoteAtCurrentTime method");
                    }
                });

                // Right click to open notes panel
                notesBtn.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    if (this.notesManager.toggleNotesPanel) {
                        this.notesManager.toggleNotesPanel();
                    } else if (this.notesManager.showNotesPanel) {
                        this.notesManager.showNotesPanel();
                    } else {
                        console.warn("NotesManager does not have toggleNotesPanel method");
                    }
                });
            }

            // Set up notes panel toggle button
            const notesPanelToggle = document.getElementById("note-panel-toggle");
            if (notesPanelToggle) {
                notesPanelToggle.addEventListener("click", () => {
                    if (this.notesManager.toggleNotesPanel) {
                        this.notesManager.toggleNotesPanel();
                    } else {
                        console.warn("NotesManager does not have toggleNotesPanel method");
                    }
                });
            }
        } catch (error) {
            console.error("Failed to initialize notes system:", error);

            // Create fallback notes system
            this.notesManager = this.createFallbackNotesManager();
            console.warn("Using fallback notes system");
        }
    }

    createFallbackNotesManager() {
        return {
            setCurrentVideo: (videoId) => {
                console.log("Fallback: Setting current video for notes:", videoId);
            },
            setVideo: (videoId) => {
                console.log("Fallback: Setting video for notes:", videoId);
            },
            toggleNotesPanel: () => {
                console.log("Fallback: Toggling notes panel");
                // Simple fallback to show/hide notes panel
                const notesPanel = document.getElementById("notes-panel");
                if (notesPanel) {
                    const isVisible = notesPanel.style.display !== "none";
                    notesPanel.style.display = isVisible ? "none" : "block";
                }
            },
            showNotesPanel: () => {
                console.log("Fallback: Showing notes panel");
                const notesPanel = document.getElementById("notes-panel");
                if (notesPanel) {
                    notesPanel.style.display = "block";
                }
            },
            addNoteAtCurrentTime: () => {
                console.log("Fallback: Adding note at current time");
                // Simple fallback to show notes modal
                const notesModal = document.getElementById("notes-modal");
                if (notesModal) {
                    notesModal.style.display = "block";
                }
            },
            showNotesModal: () => {
                console.log("Fallback: Showing notes modal");
                const notesModal = document.getElementById("notes-modal");
                if (notesModal) {
                    notesModal.style.display = "block";
                }
            },
            addNote: (content, timestamp) => {
                console.log("Fallback: Adding note:", content, timestamp);
            },
            getNotes: () => [],
            deleteNote: (noteId) => {
                console.log("Fallback: Deleting note:", noteId);
            },
        };
    }

    handleNotesVideoChange(videoData) {
        if (this.notesManager && videoData) {
            // Update notes system for the new video
            const videoId = videoData.id || videoData.title || "default";

            // Check which method is available
            if (this.notesManager.setCurrentVideo) {
                this.notesManager.setCurrentVideo(videoId);
            } else if (this.notesManager.setVideo) {
                this.notesManager.setVideo(videoId);
            } else if (this.notesManager.updateCurrentVideo) {
                this.notesManager.updateCurrentVideo(videoId);
            } else {
                console.warn("NotesManager does not have any video setting method");
            }
        }
    }

    onProgressHoverStart() {
        // Show chapter preview when hover starts
        const chapterPreview = document.getElementById("chapter-preview");
        if (chapterPreview) {
            chapterPreview.style.display = "block";
        }

        // Add hover class to progress bar for styling
        if (this.progressBar) {
            this.progressBar.classList.add("hovering");
        }

        // Show time tooltip if available
        this.showTimeTooltip = true;
    }

    onProgressHoverEnd() {
        // Hide chapter preview when hover ends
        const chapterPreview = document.getElementById("chapter-preview");
        if (chapterPreview) {
            chapterPreview.classList.remove("show");
            setTimeout(() => {
                if (!chapterPreview.classList.contains("show")) {
                    chapterPreview.style.display = "none";
                }
            }, 200);
        }

        // Remove hover class from progress bar
        if (this.progressBar) {
            this.progressBar.classList.remove("hovering");
        }

        // Hide time tooltip
        this.showTimeTooltip = false;
        this.hideTimeTooltip();
    }

    onProgressHover(e) {
        if (!this.video.duration) return;

        // Calculate position and time
        const rect = this.progressBar.getBoundingClientRect();
        const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const hoverTime = position * this.video.duration;

        // Update chapter preview
        this.updateChapterPreview(position, hoverTime);

        // Show time tooltip
        this.showTimeTooltipAtPosition(e.clientX, hoverTime);

        // Add visual hover effect to progress bar
        this.updateProgressHoverEffect(position);
    }

    updateChapterPreview(position, currentTime) {
        const chapterPreview = document.getElementById("chapter-preview");
        if (!chapterPreview) return;

        // Get current video ID
        let currentVideoId = null;
        if (window.videoPlayerController && window.videoPlayerController.currentVideo) {
            currentVideoId = window.videoPlayerController.currentVideo.id;
        }

        if (!currentVideoId) return;

        // Get chapters for current video
        let chapters = [];
        if (window.videoPlayerController && window.videoPlayerController.getChaptersForVideo) {
            chapters = window.videoPlayerController.getChaptersForVideo(currentVideoId);
        }

        if (chapters.length === 0) {
            chapterPreview.style.display = "none";
            return;
        }

        // Find closest chapter
        let closestChapter = chapters[0];
        let nextChapter = null;

        for (let i = 0; i < chapters.length; i++) {
            if (chapters[i].time <= currentTime) {
                closestChapter = chapters[i];
                if (i < chapters.length - 1) {
                    nextChapter = chapters[i + 1];
                }
            } else {
                if (!nextChapter) {
                    nextChapter = chapters[i];
                }
                break;
            }
        }

        // Update preview content
        const previewTitle = chapterPreview.querySelector(".preview-title");
        const previewTime = chapterPreview.querySelector(".preview-time");

        if (previewTitle && previewTime) {
            previewTitle.textContent = closestChapter.title;

            // Calculate chapter end time
            let endTime = this.video.duration;
            if (nextChapter) {
                endTime = nextChapter.time;
            }

            previewTime.textContent = `${this.formatTime(closestChapter.time)} - ${this.formatTime(endTime)}`;
        }

        // Position the preview
        const progressBarRect = this.progressBar.getBoundingClientRect();
        const previewWidth = chapterPreview.offsetWidth;
        const maxLeft = progressBarRect.width - previewWidth;
        const leftPosition = Math.max(0, Math.min(maxLeft, position * progressBarRect.width - previewWidth / 2));

        chapterPreview.style.left = `${leftPosition}px`;
        chapterPreview.style.display = "block";
        chapterPreview.classList.add("show");
    }

    showTimeTooltipAtPosition(clientX, time) {
        // Create or get time tooltip
        let timeTooltip = document.getElementById("time-tooltip");
        if (!timeTooltip) {
            timeTooltip = document.createElement("div");
            timeTooltip.id = "time-tooltip";
            timeTooltip.className = "time-tooltip";
            document.body.appendChild(timeTooltip);
        }

        // Update tooltip content
        timeTooltip.textContent = this.formatTime(time);

        // Position tooltip
        const tooltipWidth = timeTooltip.offsetWidth || 50; // Fallback width
        const leftPosition = clientX - tooltipWidth / 2;
        const topPosition = this.progressBar.getBoundingClientRect().top - 35;

        timeTooltip.style.left = `${Math.max(10, Math.min(window.innerWidth - tooltipWidth - 10, leftPosition))}px`;
        timeTooltip.style.top = `${topPosition}px`;
        timeTooltip.style.display = "block";
        timeTooltip.classList.add("visible");
    }

    hideTimeTooltip() {
        const timeTooltip = document.getElementById("time-tooltip");
        if (timeTooltip) {
            timeTooltip.classList.remove("visible");
            setTimeout(() => {
                if (!timeTooltip.classList.contains("visible")) {
                    timeTooltip.style.display = "none";
                }
            }, 200);
        }
    }

    updateProgressHoverEffect(position) {
        // Add hover line effect on progress bar
        let hoverLine = document.getElementById("progress-hover-line");
        if (!hoverLine) {
            hoverLine = document.createElement("div");
            hoverLine.id = "progress-hover-line";
            hoverLine.className = "progress-hover-line";
            this.progressBar.appendChild(hoverLine);
        }

        // Position the hover line
        hoverLine.style.left = `${position * 100}%`;
        hoverLine.style.display = "block";
    }
}

// Initialize custom video controls when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.customVideoControls = new CustomVideoControls();
    }, 500);
});

// Export for global use
window.CustomVideoControls = CustomVideoControls;

// Thêm xử lý fallback cho nút chapters

// Đảm bảo nút chapters hoạt động ngay cả khi module không được tải
document.addEventListener("DOMContentLoaded", () => {
    const chaptersBtn = document.getElementById("chapters-btn");
    const chapterPanel = document.getElementById("chapter-navigation-panel");

    if (chaptersBtn && chapterPanel) {
        // Fallback handler nếu videoChapters không được khởi tạo
        const fallbackChaptersHandler = (e) => {
            // Chỉ xử lý nếu module videoChapters không tồn tại
            if (!window.videoChapters) {
                e.stopPropagation(); // Tránh xử lý trùng lặp

                if (chapterPanel.style.display === "none" || !chapterPanel.style.display) {
                    chapterPanel.style.display = "flex";
                    chaptersBtn.classList.add("active");

                    // Hiển thị nội dung cơ bản nếu có
                    const chaptersList = document.getElementById("chapters-list-external");
                    if (chaptersList) {
                        // Xác định video hiện tại
                        const videoElement = document.getElementById("main-video");
                        const src = videoElement.querySelector("source")?.src || "";
                        const videoId = src.split("/").pop().replace(".mp4", "");

                        if (videoId) {
                            chaptersList.innerHTML = `
                                <div class="loading-chapters">
                                    <div class="loading-spinner"></div>
                                    <p>Đang tải dữ liệu phân đoạn...</p>
                                </div>
                            `;

                            // Thử lấy dữ liệu phân đoạn từ controller
                            if (window.videoPlayerController && window.videoPlayerController.getChaptersForVideo) {
                                setTimeout(() => {
                                    const chapters = window.videoPlayerController.getChaptersForVideo(videoId);
                                    if (chapters && chapters.length > 0) {
                                        renderSimpleChapters(chapters, chaptersList);
                                    } else {
                                        chaptersList.innerHTML = `
                                            <div class="empty-chapters">
                                                <div class="empty-icon">📑</div>
                                                <p>Video này không có phân đoạn</p>
                                            </div>
                                        `;
                                    }
                                }, 500);
                            }
                        }
                    }
                } else {
                    chapterPanel.style.display = "none";
                    chaptersBtn.classList.remove("active");
                }

                // Cập nhật indicator
                const indicator = document.getElementById("chapter-indicator");
                if (indicator) {
                    indicator.style.display = "inline-block";
                }
            }
        };

        // Thêm sự kiện fallback nếu đúng nút đã được click
        document.addEventListener("click", (e) => {
            if (e.target.closest("#chapters-btn") && !window.videoChapters) {
                fallbackChaptersHandler(e);
            }
        });
    }
});

// Hàm render đơn giản cho phân đoạn video nếu module không được tải
function renderSimpleChapters(chapters, container) {
    if (!container) return;

    container.innerHTML = "";

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Update chapter count
    const chapterCount = document.getElementById("chapter-count");
    if (chapterCount) {
        chapterCount.textContent = `${chapters.length} phần`;
    }

    chapters.forEach((chapter, index) => {
        const chapterItem = document.createElement("div");
        chapterItem.className = "chapter-item";
        chapterItem.dataset.time = chapter.time;

        chapterItem.innerHTML = `
            <div class="chapter-item-content">
                <div class="chapter-number">${index + 1}</div>
                <div class="chapter-details">
                    <div class="chapter-item-title">${chapter.title}</div>
                    <div class="chapter-item-time">${formatTime(chapter.time)}</div>
                </div>
            </div>
        `;

        chapterItem.addEventListener("click", () => {
            const videoElement = document.getElementById("main-video");
            if (videoElement) {
                videoElement.currentTime = chapter.time;
                if (videoElement.paused) {
                    videoElement.play().catch((err) => console.error("Error playing video:", err));
                }
            }
        });

        container.appendChild(chapterItem);
    });
}

// Thêm vào khu vực khởi tạo các nút điều khiển video

// Xử lý nút hiển thị/ẩn phân đoạn video
const chaptersBtn = document.getElementById("chapters-btn");
if (chaptersBtn) {
    chaptersBtn.addEventListener("click", function (e) {
        e.preventDefault();

        try {
            if (window.videoChapters && typeof window.videoChapters.toggleChapterPanel === "function") {
                window.videoChapters.toggleChapterPanel();
            } else {
                console.error("VideoChapters module not properly initialized");

                // Fallback: Xử lý thủ công nếu module không khởi tạo đúng
                const chapterPanel = document.getElementById("chapter-navigation-panel");
                if (chapterPanel) {
                    const isVisible = chapterPanel.style.display !== "none";
                    chapterPanel.style.display = isVisible ? "none" : "flex";
                    this.classList.toggle("active", !isVisible);

                    const indicator = document.getElementById("chapter-indicator");
                    if (indicator) {
                        indicator.style.display = isVisible ? "none" : "inline-block";
                    }
                }
            }
        } catch (error) {
            console.error("Error when toggling chapter panel:", error);

            // Fallback khi có lỗi
            const chapterPanel = document.getElementById("chapter-navigation-panel");
            if (chapterPanel) {
                chapterPanel.style.display = chapterPanel.style.display === "none" ? "flex" : "none";
            }
        }
    });
}
