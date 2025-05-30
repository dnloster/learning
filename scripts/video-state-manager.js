// Video State Manager - Handles pause/resume functionality when navigating away
class VideoStateManager {
    constructor() {
        this.storageKey = "video_playback_state";
        this.currentState = null;
        this.isNavigatingAway = false;
        this.resumeNotification = null;
        this.videoElement = null;
        this.customControls = null;

        // Initialize when DOM is ready
        this.init();
    }

    init() {
        console.log("VideoStateManager: Initializing...");

        // Wait for video elements to be available
        this.waitForVideoElements();

        // Setup navigation detection
        this.setupNavigationDetection();

        // Check for saved state on page load
        this.checkForSavedState();

        // Setup periodic state saving
        this.setupPeriodicStateSave();
    }

    waitForVideoElements() {
        const checkElements = () => {
            this.videoElement = document.getElementById("main-video");
            this.customControls = window.customVideoControls;

            if (this.videoElement && this.customControls) {
                console.log("VideoStateManager: Video elements found, setting up event listeners");
                this.setupVideoEventListeners();
            } else {
                setTimeout(checkElements, 100);
            }
        };
        checkElements();
    }

    setupVideoEventListeners() {
        // Listen for video play/pause events
        this.videoElement.addEventListener("play", () => {
            this.updateCurrentState();
        });

        this.videoElement.addEventListener("pause", () => {
            this.updateCurrentState();
        });

        this.videoElement.addEventListener("timeupdate", () => {
            // Update state periodically during playback
            if (!this.videoElement.paused) {
                this.updateCurrentState();
            }
        });

        // Listen for video changes
        window.addEventListener("video-changed", (event) => {
            this.handleVideoChange(event.detail);
        });
    }

    setupNavigationDetection() {
        // Detect navigation away from video player
        const backToHomeBtn = document.getElementById("back-to-home");
        if (backToHomeBtn) {
            backToHomeBtn.addEventListener("click", () => {
                console.log("VideoStateManager: Detected navigation to home");
                this.handleNavigationAway();
            });
        }

        // Detect page unload/refresh
        window.addEventListener("beforeunload", () => {
            console.log("VideoStateManager: Detected page unload");
            this.handleNavigationAway();
        });

        // Detect browser tab change
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                console.log("VideoStateManager: Tab became hidden");
                this.handleTabHidden();
            } else {
                console.log("VideoStateManager: Tab became visible");
                this.handleTabVisible();
            }
        });

        // Detect navigation within the app (topic changes)
        document.addEventListener("click", (e) => {
            // Check if user is clicking on topic navigation or other sections
            const topicBtn = e.target.closest(".topic-btn");
            if (topicBtn && !this.videoElement?.paused) {
                console.log("VideoStateManager: Detected topic navigation while video playing");
                // Don't pause for topic changes within video player
                // This is intentional as per requirements
            }
        });
    }

    handleNavigationAway() {
        if (this.shouldSaveState()) {
            console.log("VideoStateManager: Saving state before navigation");
            this.saveCurrentState();
            this.pauseVideo();
        }
    }

    handleTabHidden() {
        if (this.shouldSaveState()) {
            console.log("VideoStateManager: Saving state due to tab change");
            this.saveCurrentState();
            this.pauseVideo();
        }
    }

    handleTabVisible() {
        // Check if we have a saved state when tab becomes visible again
        this.checkForSavedState();
    }

    shouldSaveState() {
        return (
            this.videoElement &&
            !this.videoElement.paused &&
            this.videoElement.currentTime > 0 &&
            this.videoElement.duration > 0
        );
    }

    updateCurrentState() {
        if (!this.videoElement) return;

        this.currentState = {
            videoId: this.getCurrentVideoId(),
            currentTime: this.videoElement.currentTime,
            isPlaying: !this.videoElement.paused,
            duration: this.videoElement.duration,
            src: this.videoElement.src,
            timestamp: Date.now(),
        };
    }
    getCurrentVideoId() {
        // Get current video ID from the video player controller
        if (window.videoPlayer?.currentVideo) {
            return window.videoPlayer.currentVideo;
        }

        // Fallback: get from playing video item
        const playingItem = document.querySelector(".video-item.playing");
        return playingItem ? playingItem.dataset.video : null;
    }

    saveCurrentState() {
        if (this.currentState) {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(this.currentState));
                console.log("VideoStateManager: State saved", this.currentState);
            } catch (error) {
                console.error("VideoStateManager: Failed to save state", error);
            }
        }
    }

    loadSavedState() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                const state = JSON.parse(savedData);
                // Check if the saved state is not too old (within 24 hours)
                const isRecent = Date.now() - state.timestamp < 24 * 60 * 60 * 1000;

                if (isRecent) {
                    console.log("VideoStateManager: Loaded saved state", state);
                    return state;
                }
            }
        } catch (error) {
            console.error("VideoStateManager: Failed to load state", error);
        }
        return null;
    }

    checkForSavedState() {
        const savedState = this.loadSavedState();
        if (savedState && savedState.currentTime > 10) {
            // Only show if more than 10 seconds
            console.log("VideoStateManager: Found saved state, showing resume option");
            this.showResumeNotification(savedState);
        }
    }

    showResumeNotification(savedState) {
        // Remove any existing notification
        this.hideResumeNotification();

        // Create resume notification
        this.resumeNotification = document.createElement("div");
        this.resumeNotification.className = "video-resume-notification";
        this.resumeNotification.innerHTML = `
            <div class="resume-content">
                <div class="resume-icon">▶️</div>
                <div class="resume-text">
                    <div class="resume-title">Tiếp tục xem video</div>
                    <div class="resume-subtitle">
                        Video "${this.getVideoTitle(savedState.videoId)}" đã dừng tại ${this.formatTime(
            savedState.currentTime
        )}
                    </div>
                </div>
                <div class="resume-actions">
                    <button class="resume-btn" data-action="resume">Tiếp tục</button>
                    <button class="resume-btn secondary" data-action="start-over">Xem từ đầu</button>
                    <button class="resume-btn dismiss" data-action="dismiss">×</button>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(this.resumeNotification);

        // Setup event listeners
        this.resumeNotification.addEventListener("click", (e) => {
            const action = e.target.dataset.action;
            if (action) {
                this.handleResumeAction(action, savedState);
            }
        });

        // Auto-hide after 15 seconds
        setTimeout(() => {
            this.hideResumeNotification();
        }, 15000);

        // Add animation
        setTimeout(() => {
            this.resumeNotification.classList.add("visible");
        }, 100);
    }

    handleResumeAction(action, savedState) {
        switch (action) {
            case "resume":
                this.resumeFromState(savedState);
                break;
            case "start-over":
                this.startVideoFromBeginning(savedState.videoId);
                break;
            case "dismiss":
                this.dismissResumeNotification();
                break;
        }
        this.hideResumeNotification();
    }

    resumeFromState(savedState) {
        console.log("VideoStateManager: Resuming from saved state", savedState);

        // Navigate to video player if not already there
        this.ensureVideoPlayerVisible();

        // Load the video
        this.loadVideoForResume(savedState);

        // Clear saved state
        this.clearSavedState();
    }

    loadVideoForResume(savedState) {
        // Use video player controller to load the video
        if (window.videoPlayer) {
            // Find the video data
            const videoData = window.videoPlayer.findVideoData(savedState.videoId);
            if (videoData) {
                // Load the video
                window.videoPlayer.playVideo(savedState.videoId, savedState.src);

                // Wait for video to load and then seek to saved position
                const seekToPosition = () => {
                    if (this.videoElement.readyState >= 1) {
                        this.videoElement.currentTime = savedState.currentTime;
                        console.log(`VideoStateManager: Resumed at ${savedState.currentTime}s`);

                        // Show brief confirmation message
                        this.showMessage(`Tiếp tục từ ${this.formatTime(savedState.currentTime)}`);
                    } else {
                        setTimeout(seekToPosition, 100);
                    }
                };
                setTimeout(seekToPosition, 500);
            }
        }
    }

    startVideoFromBeginning(videoId) {
        console.log("VideoStateManager: Starting video from beginning", videoId);

        // Navigate to video player if not already there
        this.ensureVideoPlayerVisible();

        // Load the video from the beginning
        if (window.videoPlayer) {
            const videoData = window.videoPlayer.findVideoData(videoId);
            if (videoData) {
                window.videoPlayer.playVideo(videoId, videoData.src);
            }
        }

        // Clear saved state
        this.clearSavedState();
    }

    ensureVideoPlayerVisible() {
        const contentSection = document.getElementById("content-section");
        const mainBanner = document.getElementById("main-banner");

        if (contentSection && mainBanner) {
            if (contentSection.style.display === "none") {
                // Navigate to video player
                mainBanner.style.display = "none";
                contentSection.style.display = "block";
                contentSection.scrollIntoView({ behavior: "smooth" });
            }
        }
    }

    dismissResumeNotification() {
        console.log("VideoStateManager: Resume notification dismissed");
        this.clearSavedState();
    }

    hideResumeNotification() {
        if (this.resumeNotification) {
            this.resumeNotification.classList.remove("visible");
            setTimeout(() => {
                if (this.resumeNotification?.parentNode) {
                    this.resumeNotification.parentNode.removeChild(this.resumeNotification);
                }
                this.resumeNotification = null;
            }, 300);
        }
    }

    clearSavedState() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log("VideoStateManager: Saved state cleared");
        } catch (error) {
            console.error("VideoStateManager: Failed to clear state", error);
        }
    }

    pauseVideo() {
        if (this.videoElement && !this.videoElement.paused) {
            this.videoElement.pause();
            console.log("VideoStateManager: Video paused");
        }
    }

    handleVideoChange(videoData) {
        // Clear saved state when user manually changes video
        this.clearSavedState();
        this.updateCurrentState();
    }

    setupPeriodicStateSave() {
        // Save state every 5 seconds during playback
        setInterval(() => {
            if (this.shouldSaveState()) {
                this.updateCurrentState();
                // Only save to localStorage if video has been playing for a while
                if (this.currentState.currentTime > 10) {
                    this.saveCurrentState();
                }
            }
        }, 5000);
    }

    getVideoTitle(videoId) {
        if (window.videoPlayer) {
            const videoData = window.videoPlayer.findVideoData(videoId);
            return videoData ? videoData.title : "Unknown Video";
        }
        return "Unknown Video";
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }

    showMessage(message) {
        // Create and show a temporary message
        const messageElement = document.createElement("div");
        messageElement.className = "video-state-message";
        messageElement.textContent = message;
        document.body.appendChild(messageElement);

        setTimeout(() => {
            messageElement.classList.add("visible");
        }, 100);

        setTimeout(() => {
            messageElement.classList.remove("visible");
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, 3000);
    }

    // Public API methods
    getCurrentState() {
        return this.currentState;
    }

    forceCheckSavedState() {
        this.checkForSavedState();
    }

    forceClearSavedState() {
        this.clearSavedState();
        this.hideResumeNotification();
    }
}

// Initialize and expose globally
let videoStateManager;

document.addEventListener("DOMContentLoaded", () => {
    videoStateManager = new VideoStateManager();
    window.videoStateManager = videoStateManager;
    console.log("VideoStateManager: Initialized and available globally");
});

export default VideoStateManager;
