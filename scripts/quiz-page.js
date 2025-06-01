/**
 * Quiz Page Manager - Manages the dedicated quiz page functionality
 * Handles quiz listing, filtering, topic switching, and exercise management
 */

class QuizPageManager {
    constructor() {
        this.currentTopic = "cpu";
        this.currentFilter = "theory";
        this.exercises = {};
        this.progress = {};
        this.quizManager = null;

        this.init();
    }

    /**
     * Initialize the quiz page manager
     */
    init() {
        this.setupElements();
        this.bindEvents();
        this.loadExercises();
        this.renderExercises();
        this.updateProgress();

        console.log("Quiz Page Manager initialized");
    }
    /**
     * Setup DOM elements
     */
    setupElements() {
        this.topicButtons = document.querySelectorAll(".quiz-topic-btn");
        this.filterButtons = document.querySelectorAll(".filter-btn");
        this.exerciseGrid = document.querySelector(".exercise-grid-large");
        this.progressCards = document.querySelectorAll(".progress-card");
        this.statsNumbers = document.querySelectorAll(".stat-number");

        // Exercise lists
        this.theoryExercises = document.getElementById("theory-exercises");
        this.thinkingExercises = document.getElementById("thinking-exercises");
        this.visualExercises = document.getElementById("visual-exercises");
    }

    /**
     * Bind event handlers
     */
    bindEvents() {
        // Topic switching
        this.topicButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const topic = btn.dataset.topic;
                this.switchTopic(topic);
            });
        });

        // Filter switching
        this.filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const filter = btn.dataset.filter;
                this.setFilter(filter);
            });
        });

        // Exercise click handlers will be bound dynamically
    }

    /**
     * Load exercise data
     */
    loadExercises() {
        this.exercises = {
            cpu: {
                theory: [
                    {
                        id: "cpu-theory-1",
                        title: "Khái niệm cơ bản về CPU",
                        difficulty: "Dễ",
                        questions: 10,
                        completed: false,
                    },
                    {
                        id: "cpu-theory-2",
                        title: "Kiến trúc von Neumann",
                        difficulty: "Trung bình",
                        questions: 12,
                        completed: false,
                    },
                    {
                        id: "cpu-theory-3",
                        title: "Chu kỳ máy và chu kỳ lệnh",
                        difficulty: "Khó",
                        questions: 15,
                        completed: false,
                    },
                    {
                        id: "cpu-theory-4",
                        title: "Bộ nhớ đệm (Cache)",
                        difficulty: "Trung bình",
                        questions: 8,
                        completed: false,
                    },
                ],
                thinking: [
                    {
                        id: "cpu-thinking-1",
                        title: "Phân tích hiệu năng CPU",
                        difficulty: "Trung bình",
                        questions: 8,
                        completed: false,
                    },
                    {
                        id: "cpu-thinking-2",
                        title: "So sánh kiến trúc RISC vs CISC",
                        difficulty: "Khó",
                        questions: 10,
                        completed: false,
                    },
                    {
                        id: "cpu-thinking-3",
                        title: "Tối ưu hóa pipeline",
                        difficulty: "Khó",
                        questions: 12,
                        completed: false,
                    },
                ],
                visual: [
                    {
                        id: "cpu-visual-1",
                        title: "Nhận dạng thành phần CPU",
                        difficulty: "Dễ",
                        questions: 6,
                        completed: false,
                    },
                    {
                        id: "cpu-visual-2",
                        title: "Sơ đồ khối kiến trúc",
                        difficulty: "Trung bình",
                        questions: 8,
                        completed: false,
                    },
                    {
                        id: "cpu-visual-3",
                        title: "Luồng dữ liệu trong CPU",
                        difficulty: "Trung bình",
                        questions: 10,
                        completed: false,
                    },
                ],
            },
            ram: {
                theory: [
                    {
                        id: "ram-theory-1",
                        title: "Khái niệm bộ nhớ RAM",
                        difficulty: "Dễ",
                        questions: 8,
                        completed: false,
                    },
                    {
                        id: "ram-theory-2",
                        title: "Phân loại RAM: SRAM vs DRAM",
                        difficulty: "Trung bình",
                        questions: 10,
                        completed: false,
                    },
                    {
                        id: "ram-theory-3",
                        title: "Cơ chế làm tươi DRAM",
                        difficulty: "Khó",
                        questions: 12,
                        completed: false,
                    },
                ],
                thinking: [
                    {
                        id: "ram-thinking-1",
                        title: "Tính toán dung lượng RAM",
                        difficulty: "Trung bình",
                        questions: 6,
                        completed: false,
                    },
                    {
                        id: "ram-thinking-2",
                        title: "Phân tích băng thông bộ nhớ",
                        difficulty: "Khó",
                        questions: 8,
                        completed: false,
                    },
                ],
                visual: [
                    {
                        id: "ram-visual-1",
                        title: "Nhận dạng loại RAM",
                        difficulty: "Dễ",
                        questions: 5,
                        completed: false,
                    },
                    {
                        id: "ram-visual-2",
                        title: "Cấu trúc mảng bộ nhớ",
                        difficulty: "Trung bình",
                        questions: 7,
                        completed: false,
                    },
                ],
            },
            rom: {
                theory: [
                    {
                        id: "rom-theory-1",
                        title: "Khái niệm bộ nhớ ROM",
                        difficulty: "Dễ",
                        questions: 6,
                        completed: false,
                    },
                    {
                        id: "rom-theory-2",
                        title: "Phân loại ROM: PROM, EPROM, EEPROM",
                        difficulty: "Trung bình",
                        questions: 8,
                        completed: false,
                    },
                ],
                thinking: [
                    {
                        id: "rom-thinking-1",
                        title: "Ứng dụng ROM trong hệ thống",
                        difficulty: "Trung bình",
                        questions: 5,
                        completed: false,
                    },
                ],
                visual: [
                    {
                        id: "rom-visual-1",
                        title: "Nhận dạng chip ROM",
                        difficulty: "Dễ",
                        questions: 4,
                        completed: false,
                    },
                ],
            },
        };

        // Initialize progress
        this.progress = {
            cpu: {
                theory: { completed: 0, total: 4 },
                thinking: { completed: 0, total: 3 },
                visual: { completed: 0, total: 3 },
            },
            ram: {
                theory: { completed: 0, total: 3 },
                thinking: { completed: 0, total: 2 },
                visual: { completed: 0, total: 2 },
            },
            rom: {
                theory: { completed: 0, total: 2 },
                thinking: { completed: 0, total: 1 },
                visual: { completed: 0, total: 1 },
            },
        };
    }

    /**
     * Switch to different topic
     */
    switchTopic(topic) {
        if (topic === this.currentTopic) return;

        this.currentTopic = topic;

        // Update topic buttons
        this.topicButtons.forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.topic === topic);
        });

        this.renderExercises();
        this.updateProgress();

        console.log(`Switched to topic: ${topic}`);
    }

    /**
     * Set filter for exercises
     */
    setFilter(filter) {
        if (filter === this.currentFilter) return;

        this.currentFilter = filter;

        // Update filter buttons
        this.filterButtons.forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.filter === filter);
        });

        this.renderExercises();

        console.log(`Set filter to: ${filter}`);
    }

    /**
     * Render exercises for current topic and filter
     */
    renderExercises() {
        const topicExercises = this.exercises[this.currentTopic];

        // Clear existing exercises
        const categories = ["theory", "thinking", "visual"];
        categories.forEach((category) => {
            const container = document.getElementById(`${category}-exercises`);
            if (container) {
                container.innerHTML = "";
            }
        });

        // Render exercises by category
        categories.forEach((category) => {
            if (this.currentFilter === "all" || this.currentFilter === category) {
                this.renderCategoryExercises(category, topicExercises[category]);
            }
        });

        // Show/hide categories based on filter
        document.querySelectorAll(".exercise-category").forEach((categoryEl) => {
            const category = categoryEl.dataset.category;
            if (this.currentFilter === "all" || this.currentFilter === category) {
                categoryEl.style.display = "block";
            } else {
                categoryEl.style.display = "none";
            }
        });
    }

    /**
     * Render exercises for a specific category
     */
    renderCategoryExercises(category, exercises) {
        const container = document.getElementById(`${category}-exercises`);
        if (!container || !exercises) return;

        exercises.forEach((exercise, index) => {
            const exerciseCard = document.createElement("div");
            exerciseCard.className = `exercise-item ${exercise.completed ? "completed" : ""}`;
            exerciseCard.innerHTML = `
                <div class="exercise-item-header">
                    <div class="exercise-number">${index + 1}</div>
                    <div class="exercise-status">
                        ${exercise.completed ? "✅" : "⭕"}
                    </div>
                </div>
                <div class="exercise-content">
                    <h5 class="exercise-title">${exercise.title}</h5>
                    <div class="exercise-meta">
                        <span class="exercise-difficulty difficulty-${exercise.difficulty
                            .toLowerCase()
                            .replace(" ", "-")}">${exercise.difficulty}</span>
                        <span class="exercise-questions">${exercise.questions} câu hỏi</span>
                    </div>
                    <div class="exercise-actions">
                        <button class="exercise-start-btn" data-exercise-id="${
                            exercise.id
                        }" data-quiz-type="${category}">
                            ${exercise.completed ? "Làm lại" : "Bắt đầu"}
                        </button>
                        ${exercise.completed ? '<button class="exercise-review-btn">Xem lại</button>' : ""}
                    </div>
                </div>
            `;

            // Bind click event
            const startBtn = exerciseCard.querySelector(".exercise-start-btn");
            startBtn.addEventListener("click", () => {
                this.startExercise(exercise.id, category);
            });

            container.appendChild(exerciseCard);
        });
    }

    /**
     * Start an exercise
     */
    startExercise(exerciseId, category) {
        console.log(`Starting exercise: ${exerciseId} (${category})`);

        // Initialize quiz manager if not already done
        if (!this.quizManager && window.QuizManager) {
            this.quizManager = new window.QuizManager();
        }

        // Show quiz panel with specific tab
        if (this.quizManager) {
            this.quizManager.showPanelWithTab(category);
        }
    }

    /**
     * Update progress statistics
     */
    updateProgress() {
        const topicProgress = this.progress[this.currentTopic];
        const cards = ["theory", "thinking", "visual"];

        cards.forEach((category, index) => {
            const progressCard = this.progressCards[index];
            if (!progressCard) return;

            const categoryProgress = topicProgress[category];
            const percentage =
                categoryProgress.total > 0
                    ? Math.round((categoryProgress.completed / categoryProgress.total) * 100)
                    : 0;

            // Update progress circle
            const circle = progressCard.querySelector(".circle");
            const percentageText = progressCard.querySelector(".percentage");
            const completedSpan = progressCard.querySelector(".completed");
            const totalSpan = progressCard.querySelector(".total");

            if (circle) {
                circle.style.strokeDasharray = `${percentage}, 100`;
            }
            if (percentageText) {
                percentageText.textContent = `${percentage}%`;
            }
            if (completedSpan) {
                completedSpan.textContent = categoryProgress.completed;
            }
            if (totalSpan) {
                totalSpan.textContent = categoryProgress.total;
            }
        });

        // Update overall stats
        this.updateOverallStats();
    }

    /**
     * Update overall statistics in header
     */
    updateOverallStats() {
        const topicProgress = this.progress[this.currentTopic];

        let totalExercises = 0;
        let completedExercises = 0;

        Object.values(topicProgress).forEach((category) => {
            totalExercises += category.total;
            completedExercises += category.completed;
        });

        const overallPercentage = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

        // Update header stats
        const statsNumbers = document.querySelectorAll(".stat-number");
        if (statsNumbers[0]) statsNumbers[0].textContent = totalExercises;
        if (statsNumbers[2]) statsNumbers[2].textContent = `${overallPercentage}%`;
    }

    /**
     * Mark exercise as completed
     */
    completeExercise(exerciseId) {
        // Find and mark exercise as completed
        Object.keys(this.exercises).forEach((topic) => {
            Object.keys(this.exercises[topic]).forEach((category) => {
                const exercise = this.exercises[topic][category].find((ex) => ex.id === exerciseId);
                if (exercise && !exercise.completed) {
                    exercise.completed = true;
                    this.progress[topic][category].completed++;
                }
            });
        });

        this.renderExercises();
        this.updateProgress();
    }

    /**
     * Get exercise statistics
     */
    getStats() {
        return {
            currentTopic: this.currentTopic,
            currentFilter: this.currentFilter,
            progress: this.progress,
            totalExercises: Object.values(this.exercises).reduce((total, topic) => {
                return (
                    total +
                    Object.values(topic).reduce((topicTotal, category) => {
                        return topicTotal + category.length;
                    }, 0)
                );
            }, 0),
        };
    }
}

// Initialize quiz page manager when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    window.quizPageManager = new QuizPageManager();
    console.log("Quiz Page Manager instance created and available as window.quizPageManager");
});

// Export for module use
if (typeof module !== "undefined" && module.exports) {
    module.exports = QuizPageManager;
}
