/**
 * Quiz Page Manager - Manages the dedicated quiz page functionality
 * Handles quiz listing, filtering, and exercise management for a comprehensive quiz.
 */

class QuizPageManager {
    constructor() {
        if (window.quizManager?.initialized) {
            this.init();
        } else {
            window.addEventListener("quizManagerReady", () => this.init());
        }
    }

    init() {
        this.quizManager = window.quizManager;
        // First set up the event listeners
        this.setupFilterButtons();
        // Then apply initial filter which will also load the content
        requestAnimationFrame(() => this.applyInitialFilter());
    }

    setupFilterButtons() {
        const filterButtons = document.querySelectorAll(".filter-btn");
        const categories = document.querySelectorAll(".exercise-category");

        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                // Remove active class from all buttons
                filterButtons.forEach((btn) => btn.classList.remove("active"));
                // Add active class to clicked button
                button.classList.add("active");
                // Get filter value
                const filterValue = button.getAttribute("data-filter");
                // Filter and load
                this.filterCategories(filterValue);
                this.loadExercisesByType(filterValue);
            });
        });
    }

    filterCategories(filterValue) {
        const categories = document.querySelectorAll(".exercise-category");
        categories.forEach((category) => {
            const categoryType = category.getAttribute("data-category");
            if (filterValue === "all" || categoryType === filterValue) {
                category.style.display = "block";
                category.classList.add("visible");
            } else {
                category.style.display = "none";
                category.classList.remove("visible");
            }
        });
    }

    applyInitialFilter() {
        // Find the active filter button or default to theory
        const activeButton =
            document.querySelector(".filter-btn.active") || document.querySelector('[data-filter="cpu"]');
        if (activeButton) {
            // Make sure the button is marked as active
            activeButton.classList.add("active");
            const filterValue = activeButton.getAttribute("data-filter");
            // Apply filter and load content immediately
            this.filterCategories(filterValue);
            this.loadExercisesByType(filterValue);
        }
    }
    loadExercisesByType(type) {
        // Get the target exercise list and make sure it's ready
        const exerciseList = document.getElementById(`${type}-exercises`);
        if (!exerciseList) return;

        // Make sure the container is visible first
        const category = exerciseList.closest(".exercise-category");
        if (category) {
            category.style.display = "block";
            category.classList.add("visible");
        }

        // Hide other category containers
        const otherCategories = document.querySelectorAll(`.exercise-category:not([data-category="${type}"])`);
        otherCategories.forEach((cat) => {
            cat.style.display = "none";
            cat.classList.remove("visible");
        });

        // Let quiz manager handle the state change and content loading
        window.quizManager?.switchExerciseType(type);
    }
}

// Global function for starting quiz
function startQuiz(type, category) {
    console.log(`Starting ${type} quiz for ${category}`);
    // This will integrate with your existing quiz modal system
    const quizPanel = document.getElementById("quiz-panel");
    if (quizPanel) {
        quizPanel.style.display = "block";

        // Switch to appropriate tab
        const tabs = document.querySelectorAll(".quiz-tab");
        const contents = document.querySelectorAll(".quiz-tab-content");

        tabs.forEach((tab) => tab.classList.remove("active"));
        contents.forEach((content) => content.classList.remove("active"));

        const targetTab = document.querySelector(`[data-tab="${type}"]`);
        const targetContent = document.getElementById(`${type}-content`);

        if (targetTab) targetTab.classList.add("active");
        if (targetContent) targetContent.classList.add("active");
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new QuizPageManager();
});
