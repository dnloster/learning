/**
 * Quiz Manager - Handles quiz interface and content loading
 */
class QuizManager {
    constructor() {
        this.currentExerciseType = "cpu";
        this.currentDifficulty = "easy";
        this.currentUnit = 1;
        this.loadingTimeout = null;
        this.progressData = {
            cpu: { easy: [], medium: [], hard: [] },
            BoNhoNgoai: { easy: [], medium: [], hard: [] },
            BoNhoTrong: { easy: [], medium: [], hard: [] },
        };

        this.init();
    }
    async init() {
        this.setupElements();
        this.bindEvents();
        this.loadProgress();
        // Mark as initialized before loading content
        this.initialized = true;
        // Load content and wait for it to complete
        await this.loadContent();
        this.updateAllProgressIndicators();
        // Notify page that initialization is complete
        window.dispatchEvent(new CustomEvent("quizManagerReady"));
    }

    setupElements() {
        // Exercise type filters
        this.exerciseButtons = {
            cpu: document.querySelector('[data-filter="cpu"]'),
            BoNhoNgoai: document.querySelector('[data-filter="BoNhoNgoai"]'),
            BoNhoTrong: document.querySelector('[data-filter="BoNhoTrong"]'),
        };

        // Both sidebar and tab group difficulty buttons
        this.difficultyButtons = {
            easy: Array.from(document.querySelectorAll('button[data-difficulty="easy"]')),
            medium: Array.from(document.querySelectorAll('button[data-difficulty="medium"]')),
            hard: Array.from(document.querySelectorAll('button[data-difficulty="hard"]')),
        };

        // Content container and loading screen
        this.contentArea = document.querySelector(".quiz-content-area");
        this.loadingScreen = document.querySelector(".quiz-loading");

        // Progress indicators
        this.progressElements = {
            cpu: {
                easy: document.querySelector(".cpu-progress-easy"),
                medium: document.querySelector(".cpu-progress-medium"),
                hard: document.querySelector(".cpu-progress-hard"),
            },
            BoNhoNgoai: {
                easy: document.querySelector(".BoNhoNgoai-progress-easy"),
                medium: document.querySelector(".BoNhoNgoai-progress-medium"),
                hard: document.querySelector(".BoNhoNgoai-progress-hard"),
            },
            BoNhoTrong: {
                easy: document.querySelector(".BoNhoTrong-progress-easy"),
                medium: document.querySelector(".BoNhoTrong-progress-medium"),
                hard: document.querySelector(".BoNhoTrong-progress-hard"),
            },
        };
    }

    bindEvents() {
        // Exercise type switching
        Object.entries(this.exerciseButtons).forEach(([type, button]) => {
            button?.addEventListener("click", () => {
                this.switchExerciseType(type);
            });
        });

        // Difficulty switching for both sidebar and tab group buttons
        Object.entries(this.difficultyButtons).forEach(([difficulty, buttons]) => {
            buttons.forEach((button) => {
                button.addEventListener("click", () => {
                    this.switchDifficulty(difficulty);
                });
            });
        });

        // Listen for iframe messages
        window.addEventListener("message", (event) => {
            if (event.data.type === "quizComplete") {
                this.handleQuizComplete(event.data);
            } else if (event.data.type === "quizStarted") {
                this.handleQuizStarted();
            }
        });
    }

    showInitialContent() {
        this.showLoading();
        this.loadContent();
        this.updateAllProgressIndicators();
    }

    showLoading(message = "Đang tải bài tập...") {
        if (this.loadingScreen) {
            const loadingText = this.loadingScreen.querySelector("p");
            if (loadingText) loadingText.textContent = message;
            this.loadingScreen.classList.add("active");
        }

        if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
        this.loadingTimeout = setTimeout(() => this.hideLoading(), 10000);
    }

    hideLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove("active");
        }
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        }
    }
    switchExerciseType(type) {
        if (type === this.currentExerciseType) return;

        // Update exercise type buttons
        Object.values(this.exerciseButtons).forEach((button) => {
            button?.classList.remove("active");
        });
        this.exerciseButtons[type]?.classList.add("active");

        // Set current exercise type
        this.currentExerciseType = type;

        // Ensure current difficulty is properly reflected in UI
        const activeDifficultyBtn = document.querySelector(".difficulty-tab.active");
        if (activeDifficultyBtn) {
            this.currentDifficulty = activeDifficultyBtn.getAttribute("data-difficulty");
            // Update all difficulty buttons to match current state
            Object.values(this.difficultyButtons).forEach((buttons) => {
                buttons.forEach((btn) => {
                    btn.classList.toggle("active", btn.getAttribute("data-difficulty") === this.currentDifficulty);
                });
            });
        }

        // Load content with current settings
        this.loadContent();
        this.updateAllProgressIndicators();
    }

    switchDifficulty(difficulty) {
        if (difficulty === this.currentDifficulty) return;

        // Update all difficulty buttons (both sidebar and tab group)
        Object.values(this.difficultyButtons).forEach((buttons) => {
            buttons.forEach((btn) => btn.classList.remove("active"));
        });
        this.difficultyButtons[difficulty].forEach((btn) => btn.classList.add("active"));

        this.currentDifficulty = difficulty;
        this.loadContent();
    }
    async loadContent() {
        this.showLoading();

        try {
            // Find the container for this exercise type
            const container = document.getElementById(`${this.currentExerciseType}-exercises`);
            if (!container) {
                throw new Error(`Container for ${this.currentExerciseType} exercises not found`);
            }

            // Clear the container
            container.innerHTML = "";

            // Create loading placeholder
            const loadingPlaceholder = document.createElement("div");
            loadingPlaceholder.className = "quiz-loading-placeholder";
            loadingPlaceholder.textContent = "Đang tải bài tập...";
            container.appendChild(loadingPlaceholder);

            return new Promise((resolve, reject) => {
                // Create and set up the new iframe
                const iframe = document.createElement("iframe");
                const url = `quizzes/${this.currentExerciseType}_${this.currentDifficulty}.html`;
                iframe.src = url;
                iframe.classList.add("quiz-iframe");

                // Add load event listener before setting src
                iframe.addEventListener("load", () => {
                    // Remove loading placeholder
                    loadingPlaceholder.remove();

                    // Show iframe
                    iframe.style.display = "block";

                    // Send current progress to the iframe
                    const currentProgress = this.progressData[this.currentExerciseType][this.currentDifficulty];
                    iframe.contentWindow.postMessage(
                        {
                            type: "progressUpdate",
                            progress: currentProgress,
                        },
                        "*"
                    );

                    this.hideLoading();
                    resolve();
                });

                iframe.addEventListener("error", (error) => {
                    loadingPlaceholder.remove();
                    this.hideLoading();
                    this.showError("Không thể tải bài tập. Vui lòng thử lại.");
                    reject(error);
                });

                // Add iframe to container
                container.appendChild(iframe);
            });
        } catch (error) {
            console.error("Error loading quiz content:", error);
            this.hideLoading();
            this.showError("Đã xảy ra lỗi khi tải bài tập.");
            throw error;
        }
    }

    showError(message) {
        let errorDiv = this.contentArea.querySelector(".quiz-error");
        if (!errorDiv) {
            errorDiv = document.createElement("div");
            errorDiv.className = "quiz-error";
            this.contentArea.appendChild(errorDiv);
        }
        errorDiv.textContent = message;

        // Auto-hide error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    handleQuizComplete(data) {
        const { score, exerciseId, maxScore } = data;

        // Store quiz completion data
        const quizData = {
            exerciseId,
            score,
            maxScore,
            completedAt: new Date().toISOString(),
            attempts: 1,
        };

        // Check if this exercise was already completed
        const progressArray = this.progressData[this.currentExerciseType][this.currentDifficulty];
        const existingIndex = progressArray.findIndex((p) => p.exerciseId === exerciseId);

        if (existingIndex !== -1) {
            // Update existing record
            quizData.attempts = progressArray[existingIndex].attempts + 1;
            if (score > progressArray[existingIndex].score) {
                progressArray[existingIndex] = quizData;
            }
        } else {
            // Add new record
            progressArray.push(quizData);
        }

        this.saveProgress();
        this.updateProgressDisplay();
        this.showCompletionMessage(score, maxScore);
    }

    showCompletionMessage(score, maxScore) {
        const percentage = Math.round((score / maxScore) * 100);
        const emoji = percentage >= 80 ? "🌟" : percentage >= 60 ? "👍" : "💪";
        this.showMessage(`${emoji} Hoàn thành bài tập! Điểm số: ${score}/${maxScore} (${percentage}%)`);
    }

    showMessage(message, type = "success") {
        const messageDiv = document.createElement("div");
        messageDiv.className = `quiz-message ${type}`;
        messageDiv.textContent = message;
        this.contentArea.appendChild(messageDiv);

        setTimeout(() => messageDiv.remove(), 5000);
    }

    handleQuizStarted() {
        // Could be used to track active sessions or show starting UI state
        console.log("Quiz started:", this.currentExerciseType, this.currentDifficulty);
    }

    loadProgress() {
        const savedProgress = localStorage.getItem("quizProgress");
        if (savedProgress) {
            try {
                this.progressData = JSON.parse(savedProgress);
                this.updateAllProgressIndicators();
            } catch (error) {
                console.error("Error loading progress:", error);
                this.progressData = this.getInitialProgressData();
            }
        }
    }

    saveProgress() {
        try {
            localStorage.setItem("quizProgress", JSON.stringify(this.progressData));
        } catch (error) {
            console.error("Error saving progress:", error);
            this.showError("Không thể lưu tiến trình. Vui lòng thử lại.");
        }
    }

    updateProgressDisplay() {
        this.updateProgressBar();
        this.updateAllProgressIndicators();
    }

    updateProgressBar() {
        let completed = 0;
        let total = 0;

        // Count completed exercises across all types and difficulties
        Object.values(this.progressData).forEach((difficulties) => {
            Object.values(difficulties).forEach((exercises) => {
                completed += exercises.length;
                total += 10; // Assuming 10 exercises per difficulty level
            });
        });

        // Update progress bar
        const progressBar = document.querySelector(".progress-fill");
        const progressText = document.getElementById("completed-exercises");

        if (progressBar) {
            const percentage = Math.min((completed / total) * 100, 100);
            progressBar.style.width = `${percentage}%`;
        }

        if (progressText) {
            progressText.textContent = `${completed}/${total}`;
        }
    }

    updateAllProgressIndicators() {
        Object.keys(this.progressData).forEach((type) => {
            Object.keys(this.progressData[type]).forEach((difficulty) => {
                this.updateDifficultyProgress(type, difficulty);
            });
        });
    }

    updateDifficultyProgress(type, difficulty) {
        const progressElement = this.progressElements[type]?.[difficulty];
        if (!progressElement) return;

        const exercises = this.progressData[type][difficulty];
        const totalExercises = exercises.length;
        const averageScore =
            exercises.length > 0
                ? Math.round((exercises.reduce((sum, ex) => sum + ex.score / ex.maxScore, 0) / exercises.length) * 100)
                : 0;

        progressElement.innerHTML = `
            <span class="progress-count">${totalExercises}/10</span>
            ${averageScore > 0 ? `<span class="progress-score">${averageScore}%</span>` : ""}
        `;
    }

    getInitialProgressData() {
        return {
            cpu: { easy: [], medium: [], hard: [] },
            BoNhoNgoai: { easy: [], medium: [], hard: [] },
            BoNhoTrong: { easy: [], medium: [], hard: [] },
        };
    }
}

// Initialize quiz manager when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    window.quizManager = new QuizManager();
    // Dispatch event to notify quiz-page.js
    window.dispatchEvent(new CustomEvent("quizManagerReady"));
});
