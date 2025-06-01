/**
 * Quiz Manager - Manages quiz/exercise panel with 3 tabs for iSpring content
 * Handles tab switching, iframe loading, and panel visibility
 */

class QuizManager {
    constructor() {
        this.panel = null;
        this.currentTab = "theory";
        this.isVisible = false;
        this.quizData = {};
        this.iframes = {};
        this.loadingStates = {};

        this.init();
    }

    /**
     * Initialize the quiz manager
     */
    init() {
        this.setupElements();
        this.bindEvents();
        this.loadQuizData();

        console.log("Quiz Manager initialized");
    }

    /**
     * Set up DOM elements
     */
    setupElements() {
        this.panel = document.getElementById("quiz-panel");
        this.closeBtn = document.getElementById("quiz-close");
        this.quizBtn = document.getElementById("quiz-btn");

        // Get tabs and content
        this.tabs = document.querySelectorAll(".quiz-tab");
        this.tabContents = document.querySelectorAll(".quiz-tab-content");

        // Get iframes and loading elements
        this.iframes = {
            theory: document.getElementById("theory-iframe"),
            thinking: document.getElementById("thinking-iframe"),
            visual: document.getElementById("visual-iframe"),
        };

        this.loadingStates = {
            theory: document.getElementById("theory-loading"),
            thinking: document.getElementById("thinking-loading"),
            visual: document.getElementById("visual-loading"),
        };
    }

    /**
     * Bind event handlers
     */
    bindEvents() {
        // Quiz button click
        if (this.quizBtn) {
            this.quizBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.togglePanel();
            });
        }

        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener("click", () => {
                this.hidePanel();
            });
        }

        // Tab switching
        this.tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const tabType = tab.getAttribute("data-tab");
                this.switchTab(tabType);
            });
        });

        // Keyboard shortcuts
        document.addEventListener("keydown", (e) => {
            // Escape to close
            if (e.key === "Escape" && this.isVisible) {
                this.hidePanel();
            }

            // Ctrl+Q to toggle quiz panel
            if (e.ctrlKey && e.key === "q") {
                e.preventDefault();
                this.togglePanel();
            }
        });

        // Close panel when clicking outside
        document.addEventListener("click", (e) => {
            if (this.isVisible && this.panel && !this.panel.contains(e.target) && e.target !== this.quizBtn) {
                this.hidePanel();
            }
        }); // Listen for video changes to update quiz content
        document.addEventListener("video-changed", (e) => {
            this.updateQuizForVideo(e.detail.videoId);
        });

        // Exercise menu button handlers
        document.addEventListener("click", (e) => {
            const exerciseBtn = e.target.closest(".exercise-start-btn");
            if (exerciseBtn) {
                const card = exerciseBtn.closest(".exercise-card");
                const quizType = card?.getAttribute("data-quiz-type");
                if (quizType) {
                    e.preventDefault();
                    this.showPanelWithTab(quizType);
                }
            }
        });
    }

    /**
     * Load quiz data configuration
     */
    loadQuizData() {
        // Example quiz data structure - can be loaded from JSON file
        this.quizData = {
            "cpu-1": {
                theory: "quizzes/cpu-1-theory.html",
                thinking: "quizzes/cpu-1-thinking.html",
                visual: "quizzes/cpu-1-visual.html",
            },
            "cpu-2": {
                theory: "quizzes/cpu-2-theory.html",
                thinking: "quizzes/cpu-2-thinking.html",
                visual: "quizzes/cpu-2-visual.html",
            },
            "cpu-3": {
                theory: "quizzes/cpu-3-theory.html",
                thinking: "quizzes/cpu-3-thinking.html",
                visual: "quizzes/cpu-3-visual.html",
            },
            "ram-1": {
                theory: "quizzes/ram-1-theory.html",
                thinking: "quizzes/ram-1-thinking.html",
                visual: "quizzes/ram-1-visual.html",
            },
            // Add more video quiz mappings here
            default: {
                theory: "quizzes/default-theory.html",
                thinking: "quizzes/default-thinking.html",
                visual: "quizzes/default-visual.html",
            },
        };
    }

    /**
     * Toggle panel visibility
     */
    togglePanel() {
        if (this.isVisible) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    }
    /**
     * Show the quiz panel
     */
    showPanel() {
        if (!this.panel) return;

        this.panel.style.display = "block";

        // Force reflow for animation
        requestAnimationFrame(() => {
            this.panel.classList.add("show");
        });

        this.isVisible = true;

        // Load content for current tab if not loaded
        this.loadTabContent(this.currentTab);

        console.log("Quiz panel shown");
    }

    /**
     * Hide the quiz panel
     */
    hidePanel() {
        if (!this.panel) return;

        this.panel.classList.remove("show");
        this.isVisible = false;

        setTimeout(() => {
            if (!this.isVisible) {
                this.panel.style.display = "none";
            }
        }, 300);

        console.log("Quiz panel hidden");
    }

    /**
     * Switch to a different tab
     * @param {string} tabType - The tab type to switch to
     */
    switchTab(tabType) {
        if (tabType === this.currentTab) return;

        // Update tab buttons
        this.tabs.forEach((tab) => {
            tab.classList.remove("active");
            if (tab.getAttribute("data-tab") === tabType) {
                tab.classList.add("active");
            }
        });

        // Update tab content
        this.tabContents.forEach((content) => {
            content.classList.remove("active");
            if (content.id === `${tabType}-content`) {
                content.classList.add("active");
            }
        });

        this.currentTab = tabType;
        this.loadTabContent(tabType);

        console.log(`Switched to ${tabType} tab`);
    }

    /**
     * Load content for a specific tab
     * @param {string} tabType - The tab type to load
     */
    loadTabContent(tabType) {
        const iframe = this.iframes[tabType];
        const loading = this.loadingStates[tabType];

        if (!iframe || !loading) return;

        // If already loaded, just show
        if (iframe.src) {
            loading.style.display = "none";
            iframe.style.display = "block";
            return;
        }

        // Show loading state
        loading.style.display = "flex";
        iframe.style.display = "none";

        // Get quiz URL for current video and tab
        const currentVideoId = this.getCurrentVideoId();
        const quizUrl = this.getQuizUrl(currentVideoId, tabType);

        if (quizUrl) {
            // Load iframe
            iframe.onload = () => {
                loading.style.display = "none";
                iframe.style.display = "block";
            };

            iframe.onerror = () => {
                loading.innerHTML = `
                    <div style="text-align: center; color: rgba(255, 255, 255, 0.7);">
                        <div style="font-size: 2rem; margin-bottom: 10px;">⚠️</div>
                        <p>Không thể tải bài tập ${this.getTabDisplayName(tabType)}</p>
                        <p style="font-size: 0.8rem;">Vui lòng thử lại sau</p>
                    </div>
                `;
            };

            iframe.src = quizUrl;
        } else {
            // No quiz available
            loading.innerHTML = `
                <div style="text-align: center; color: rgba(255, 255, 255, 0.7);">
                    <div style="font-size: 2rem; margin-bottom: 10px;">📝</div>
                    <p>Chưa có bài tập ${this.getTabDisplayName(tabType)}</p>
                    <p style="font-size: 0.8rem;">cho bài học này</p>
                </div>
            `;
        }
    }

    /**
     * Get display name for tab type
     * @param {string} tabType - The tab type
     * @returns {string} Display name
     */
    getTabDisplayName(tabType) {
        const names = {
            theory: "lý thuyết",
            thinking: "tư duy",
            visual: "hình ảnh",
        };
        return names[tabType] || tabType;
    }
    /**
     * Get current video ID
     * @returns {string} Current video ID
     */ getCurrentVideoId() {
        // Try to get from video player or custom controls
        if (window.videoPlayer?.currentVideo) {
            console.log("Current video from videoPlayer:", window.videoPlayer.currentVideo);
            return window.videoPlayer.currentVideo;
        }

        // Try to get from active video item
        const activeVideo = document.querySelector(".video-item.playing");
        if (activeVideo) {
            const videoId = activeVideo.getAttribute("data-video");
            console.log("Current video from active item:", videoId);
            return videoId;
        }

        console.log("No current video found, using default");
        return "default";
    }

    /**
     * Get quiz URL for video and tab type
     * @param {string} videoId - Video ID
     * @param {string} tabType - Tab type
     * @returns {string|null} Quiz URL or null if not found
     */ getQuizUrl(videoId, tabType) {
        console.log(`Getting quiz URL for video: ${videoId}, tab: ${tabType}`);
        const videoQuizzes = this.quizData[videoId] || this.quizData.default;
        const url = videoQuizzes ? videoQuizzes[tabType] : null;
        console.log(`Quiz URL: ${url}`);
        return url;
    }

    /**
     * Update quiz content when video changes
     * @param {string} videoId - New video ID
     */
    updateQuizForVideo(videoId) {
        console.log(`Updating quiz for video: ${videoId}`);

        // Clear all iframes to force reload
        Object.values(this.iframes).forEach((iframe) => {
            iframe.src = "";
        });

        // Reset loading states
        Object.values(this.loadingStates).forEach((loading) => {
            loading.style.display = "flex";
            loading.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Đang tải bài tập...</p>
            `;
        });

        // Reload current tab content
        if (this.isVisible) {
            this.loadTabContent(this.currentTab);
        }
    }

    /**
     * Refresh current tab content
     */ refreshCurrentTab() {
        const iframe = this.iframes?.[this.currentTab];
        if (iframe?.src) {
            const currentSrc = iframe.src;
            iframe.src = "";
            iframe.src = currentSrc; // Force reload
        }
    }

    /**
     * Get quiz completion status
     * @returns {Object} Quiz completion status
     */
    getQuizStatus() {
        // This could be enhanced to track quiz completion
        return {
            currentVideo: this.getCurrentVideoId(),
            currentTab: this.currentTab,
            isVisible: this.isVisible,
        };
    }

    /**
     * Show panel with specific tab
     * @param {string} tabType - The tab type to show (theory, thinking, visual)
     */
    showPanelWithTab(tabType) {
        this.showPanel();
        if (tabType && tabType !== this.currentTab) {
            this.switchTab(tabType);
        }
    }
}

// Export QuizManager class for module use
window.QuizManager = QuizManager;

// Initialize quiz manager when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    window.quizManager = new QuizManager();
    console.log("Quiz Manager instance created and available as window.quizManager");
});

// Export for module use
if (typeof module !== "undefined" && module.exports) {
    module.exports = QuizManager;
}
