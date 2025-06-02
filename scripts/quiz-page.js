/**
 * Quiz Page Manager - Manages the dedicated quiz page functionality
 * Handles quiz listing, filtering, and exercise management for a comprehensive quiz.
 */

class QuizPageManager {
    constructor() {
        // currentTopic is removed
        this.currentFilter = "theory"; // Default filter
        this.allExercises = { theory: [], thinking: [], visual: [] }; // Combined exercises
        this.progress = {
            theory: { completed: 0, total: 0 },
            thinking: { completed: 0, total: 0 },
            visual: { completed: 0, total: 0 },
        }; // Simplified progress
        this.quizManager = null;

        this.init();
    }

    /**
     * Initialize the quiz page manager
     */
    init() {
        this.setupElements();
        this.loadAndCombineExercises();
        this.bindEvents();
        this.updateProgress();
        this.updateOverallStats();
        this.setFilter(this.currentFilter); // Initial call to set filter and render iframe containers visibility
    }

    /**
     * Setup DOM elements
     */
    setupElements() {
        this.filterButtons = document.querySelectorAll(".filter-btn");
        // Direct references to header stat elements by ID
        this.totalExercisesStatElement = document.getElementById("total-exercises-stat");
        this.completionStatElement = document.getElementById("completion-stat");

        // Exercise list containers per category (used for visibility control)
        this.theoryExercisesContainer = document.getElementById("theory-exercises");
        this.thinkingExercisesContainer = document.getElementById("thinking-exercises");
        this.visualExercisesContainer = document.getElementById("visual-exercises");

        // Progress cards for the sidebar
        this.progressCards = document.querySelectorAll(".progress-card");
    }

    /**
     * Bind event handlers
     */
    bindEvents() {
        // Filter switching
        this.filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const filter = btn.dataset.filter;
                this.setFilter(filter);
            });
        });
    }

    /**
     * Load and combine exercise data from all topics.
     */
    loadAndCombineExercises() {
        const rawExercisesByTopic = {
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

        this.allExercises = { theory: [], thinking: [], visual: [] };
        this.progress = {
            theory: { completed: 0, total: 0 },
            thinking: { completed: 0, total: 0 },
            visual: { completed: 0, total: 0 },
        };

        for (const topic in rawExercisesByTopic) {
            for (const category in rawExercisesByTopic[topic]) {
                if (this.allExercises[category]) {
                    rawExercisesByTopic[topic][category].forEach((exercise) => {
                        this.allExercises[category].push(exercise);
                        this.progress[category].total++;
                    });
                }
            }
        }
    }

    /**
     * Set filter for exercises
     */
    setFilter(filter) {
        if (filter === this.currentFilter && filter !== "all") return; // Allow re-filtering for 'all'
        this.currentFilter = filter;

        this.filterButtons.forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.filter === filter);
        });

        this.renderExercises();
    }

    /**
     * Render exercises based on the current filter.
     * This will now primarily control the visibility of category containers (which will host iframes).
     */
    renderExercises() {
        // Hide all category sections initially
        document.querySelectorAll(".exercise-category").forEach((catEl) => (catEl.style.display = "none"));

        const categoriesToDisplay =
            this.currentFilter === "all" ? ["theory", "thinking", "visual"] : [this.currentFilter];

        categoriesToDisplay.forEach((category) => {
            const categoryContainerElement = document.querySelector(`.exercise-category[data-category="${category}"]`);
            if (categoryContainerElement) {
                categoryContainerElement.style.display = "block";
            }
        });
    }

    /**
     * Start an exercise
     */
    startExercise(exerciseId, category, exerciseTitle) {
        if (!this.quizManager && window.QuizManager) {
            this.quizManager = new window.QuizManager();
        }
        if (this.quizManager) {
            this.quizManager.showPanelWithTab(category, exerciseId, exerciseTitle);
        } else {
            console.error("QuizManager not available to start exercise.");
        }
    }

    /**
     * Update progress statistics in the right sidebar.
     */
    updateProgress() {
        const categories = ["theory", "thinking", "visual"];

        categories.forEach((category, index) => {
            const progressCard = this.progressCards[index];
            if (!progressCard) return;

            const categoryProgress = this.progress[category];
            const percentage =
                categoryProgress.total > 0
                    ? Math.round((categoryProgress.completed / categoryProgress.total) * 100)
                    : 0;

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
        this.updateOverallStats();
    }

    /**
     * Update overall statistics in the main header.
     */
    updateOverallStats() {
        let totalExercisesAllCategories = 0;
        let completedExercisesAllCategories = 0;

        for (const category in this.progress) {
            totalExercisesAllCategories += this.progress[category].total;
            completedExercisesAllCategories += this.progress[category].completed;
        }

        const overallPercentage =
            totalExercisesAllCategories > 0
                ? Math.round((completedExercisesAllCategories / totalExercisesAllCategories) * 100)
                : 0;

        if (this.totalExercisesStatElement) {
            this.totalExercisesStatElement.textContent = totalExercisesAllCategories;
        }
        if (this.completionStatElement) {
            this.completionStatElement.textContent = `${overallPercentage}%`;
        }
    }

    /**
     * Mark exercise as completed
     */
    completeExercise(exerciseId) {
        let exerciseFound = false;
        let completedCategory = null;
        for (const category in this.allExercises) {
            const exercise = this.allExercises[category].find((ex) => ex.id === exerciseId);
            if (exercise && !exercise.completed) {
                exercise.completed = true;
                this.progress[category].completed++;
                exerciseFound = true;
                completedCategory = category;
                break;
            }
        }

        if (exerciseFound) {
            this.updateProgress();

            // Notify the specific iframe to update its display.
            const iframe = document.querySelector(`.exercise-category[data-category="${completedCategory}"] iframe`);
            if (iframe && iframe.contentWindow && typeof iframe.contentWindow.markExerciseAsCompleted === "function") {
                iframe.contentWindow.markExerciseAsCompleted(exerciseId);
            }
        }
    }

    /**
     * Get exercise statistics (simplified)
     */
    getStats() {
        let totalExercises = 0;
        Object.values(this.allExercises).forEach((catList) => (totalExercises += catList.length));

        return {
            currentFilter: this.currentFilter,
            progress: this.progress,
            totalExercises: totalExercises,
        };
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (!window.quizPageManager) {
        window.quizPageManager = new QuizPageManager();
    }

    const progressSidebar = document.getElementById("progress-overview-sidebar");
    const toggleProgressSidebarBtn = document.getElementById("toggle-progress-sidebar-btn");

    if (toggleProgressSidebarBtn && progressSidebar) {
        toggleProgressSidebarBtn.addEventListener("click", () => {
            progressSidebar.classList.toggle("collapsed");
            const isCollapsed = progressSidebar.classList.contains("collapsed");
            toggleProgressSidebarBtn.setAttribute("aria-expanded", !isCollapsed);

            const icon = toggleProgressSidebarBtn.querySelector(".toggle-icon");
            if (isCollapsed) {
                icon.innerHTML = "&laquo;";
            } else {
                icon.innerHTML = "&raquo;";
            }
        });

        const isInitiallyCollapsed = progressSidebar.classList.contains("collapsed");
        toggleProgressSidebarBtn.setAttribute("aria-expanded", !isInitiallyCollapsed);
        const initialIcon = toggleProgressSidebarBtn.querySelector(".toggle-icon");
        if (initialIcon) {
            initialIcon.innerHTML = isInitiallyCollapsed ? "&laquo;" : "&raquo;";
        }
    } else {
        console.warn(
            "Sidebar toggle elements not found. Ensure IDs 'progress-overview-sidebar' and 'toggle-progress-sidebar-btn' are correct."
        );
    }
});

if (typeof module !== "undefined" && module.exports) {
    module.exports = QuizPageManager;
}
