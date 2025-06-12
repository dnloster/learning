/**
 * Quiz Page Manager - Manages the dedicated quiz page functionality
 * Handles quiz listing, filtering, and exercise management for a comprehensive quiz.
 */

class QuizPageManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupFilterButtons();
        this.applyInitialFilter();
        this.loadExercises();
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

                // Filter categories
                this.filterCategories(filterValue);
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
        // Find the active filter button
        const activeButton = document.querySelector(".filter-btn.active");
        if (activeButton) {
            const filterValue = activeButton.getAttribute("data-filter");
            this.filterCategories(filterValue);
        }
    }

    loadExercises() {
        // Load exercises for each category
        this.loadTheoryExercises();
        this.loadThinkingExercises();
        this.loadVisualExercises();
    }

    loadTheoryExercises() {
        const theoryList = document.getElementById("theory-exercises");
        if (theoryList) {
            theoryList.innerHTML = `
                <iframe
                    src="/quizzes/cpu-1-theory.html"
                    width="100%"
                    height="600px"
                    frameborder="0">
                </iframe>
            `;
        }
    }

    loadThinkingExercises() {
        const thinkingList = document.getElementById("thinking-exercises");
        if (thinkingList) {
            thinkingList.innerHTML = `
                <iframe
                    src="/quizzes/ram-1-theory.html"
                    width="100%"
                    height="600px"
                    frameborder="0">
                </iframe>
            `;
        }
    }

    loadVisualExercises() {
        const visualList = document.getElementById("visual-exercises");
        if (visualList) {
            visualList.innerHTML = `
                <iframe
                    src="/quizzes/cpu-3-theory.html"
                    width="100%"
                    height="600px"
                    frameborder="0">
                </iframe>
            `;
        }
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
