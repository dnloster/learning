// Import Three.js models module
import threeJSModels from "./threejs-models.js";

// Video player will be initialized separately

// Expose debugging functions to fix model color issues
window.fixModelColors = {
    debug: () => {
        threeJSModels.toggleDebugMode();
        console.log("Debug mode toggled. Check browser console for detailed logs.");
        return "Use these commands for debugging:\nfixModelColors.analyze('cpu');\nfixModelColors.fixBlack('cpu');\nfixModelColors.adjustLighting(0.9);";
    },
    analyze: (modelType) => {
        return threeJSModels.analyzeModelColors(modelType);
    },
    fixBlack: (modelType) => {
        return threeJSModels.fixBlackMaterials(modelType);
    },
    adjustLighting: (intensity) => {
        return threeJSModels.adjustLighting(intensity);
    },
};

// DOM Elements
const loadingScreen = document.getElementById("loading-screen");
const mainBanner = document.getElementById("main-banner");
const contentSection = document.getElementById("content-section");
const startLearningBtn = document.getElementById("start-learning");
const backToHomeBtn = document.getElementById("back-to-home");
const schoolLogo = document.getElementById("school-logo");
const loadingLogo = document.getElementById("loading-logo");

// Loading screen animation with progress ring
window.addEventListener("load", function () {
    let progress = 0;
    const progressRing = document.querySelector(".progress-ring-circle");
    const loadingPercentage = document.querySelector(".loading-percentage");
    const logoPlaceholder = document.querySelector(".logo-placeholder");
    const loadingText = document.querySelector(".loading-text");

    // Handle loading logo error
    if (loadingLogo) {
        loadingLogo.addEventListener("error", function () {
            this.style.display = "none";
            if (logoPlaceholder) {
                logoPlaceholder.style.display = "flex";
            }
        });
    }

    // Loading messages
    const messages = [
        "Đang khởi tạo hệ thống...",
        "Đang tải thông tin CPU...",
        "Đang chuẩn bị dữ liệu RAM...",
        "Đang đọc thông tin ROM...",
        "Hoàn tất!",
    ];

    let messageIndex = 0;

    // Progress animation
    const progressInterval = setInterval(() => {
        progress += Math.random() * 12 + 8; // Random increment between 8-20
        if (progress > 100) progress = 100; // Update progress ring
        if (progressRing) {
            const circumference = 2 * Math.PI * 90; // radius = 90
            const offset = circumference - (progress / 100) * circumference;
            progressRing.style.strokeDashoffset = offset;
        }

        // Update percentage text
        if (loadingPercentage) {
            loadingPercentage.textContent = Math.round(progress) + "%";
        } // Update loading message
        if (loadingText && messageIndex < messages.length) {
            if (progress > messageIndex * 20) {
                loadingText.textContent = messages[messageIndex];
                messageIndex++;
            }
        }

        if (progress >= 100) {
            clearInterval(progressInterval);
            // Fade out loading screen faster to avoid interfering with typewriter effect
            setTimeout(() => {
                loadingScreen.classList.add("fade-out");
                setTimeout(() => {
                    loadingScreen.style.display = "none";
                }, 300); // Reduced from 500ms to 300ms
            }, 200); // Reduced from 800ms to 200ms - total time now 500ms instead of 1300ms
        }
    }, 200);
});

// Handle logo error (fallback if logo not found)
schoolLogo.addEventListener("error", function () {
    this.style.display = "none";
    // Create a placeholder logo
    const placeholder = document.createElement("div");
    placeholder.style.cssText = `
        width: 60px;
        height: 60px;
        background: linear-gradient(45deg, #4CAF50, #64B5F6);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        text-align: center;
    `;
    placeholder.textContent = "LOGO";
    this.parentNode.replaceChild(placeholder, this);
});

// Start learning button functionality
startLearningBtn.addEventListener("click", function () {
    // Add click animation
    this.style.transform = "scale(0.95)";
    setTimeout(() => {
        this.style.transform = "";
    }, 150);

    // Transition to content section
    setTimeout(() => {
        mainBanner.style.display = "none";
        contentSection.style.display = "block";
        contentSection.scrollIntoView({ behavior: "smooth" });
    }, 300);
});

// Back to home button functionality
backToHomeBtn.addEventListener("click", function () {
    // Add click animation
    this.style.transform = "scale(0.95)";
    setTimeout(() => {
        this.style.transform = "";
    }, 150);

    // Transition back to banner
    setTimeout(() => {
        contentSection.style.display = "none";
        mainBanner.style.display = "flex";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
});

// Add hover effects to processor components
document.addEventListener("DOMContentLoaded", function () {
    const processorElements = document.querySelectorAll(".cpu-unit, .memory-unit");

    processorElements.forEach((element) => {
        element.addEventListener("mouseenter", function () {
            this.style.transform = "scale(1.05) translateY(-5px)";
        });

        element.addEventListener("mouseleave", function () {
            this.style.transform = "";
        });
    });
});

// Parallax effect for floating elements
window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const floatingElements = document.querySelectorAll(".element");

    floatingElements.forEach((element, index) => {
        const speed = 0.5 + index * 0.1;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Dynamic binary code generation
function generateBinaryCode() {
    const binaryElements = document.querySelectorAll(".binary-code");

    binaryElements.forEach((element) => {
        setInterval(() => {
            let binaryString = "";
            for (let i = 0; i < 8; i++) {
                binaryString += Math.random() > 0.5 ? "1" : "0";
            }
            element.textContent = binaryString;
        }, 2000 + Math.random() * 3000);
    });
}

// Initialize binary code animation
generateBinaryCode();

// Keyboard navigation
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        if (contentSection.style.display !== "none") {
            backToHomeBtn.click();
        }
    }

    if (e.key === "Enter" || e.key === " ") {
        if (mainBanner.style.display !== "none") {
            e.preventDefault();
            startLearningBtn.click();
        }
    }
});

// Add smooth transitions for all buttons
const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
    button.addEventListener("mousedown", function () {
        this.style.transform = "scale(0.98)";
    });

    button.addEventListener("mouseup", function () {
        this.style.transform = "";
    });

    button.addEventListener("mouseleave", function () {
        this.style.transform = "";
    });
});

// CPU animation enhancement
function enhanceCPUAnimation() {
    const cpuChip = document.querySelector(".cpu-chip");
    const cpuCore = document.querySelector(".cpu-core");

    if (cpuChip && cpuCore) {
        let isActive = false;

        cpuChip.addEventListener("click", function () {
            isActive = !isActive;
            if (isActive) {
                cpuCore.style.animationDuration = "0.5s";
                cpuChip.style.animationDuration = "0.5s";
                cpuChip.style.boxShadow = "0 0 50px rgba(76, 175, 80, 0.8)";
            } else {
                cpuCore.style.animationDuration = "3s";
                cpuChip.style.animationDuration = "2s";
                cpuChip.style.boxShadow = "0 0 30px rgba(76, 175, 80, 0.5)";
            }
        });
    }
}

// Initialize enhanced animations
enhanceCPUAnimation();

// Performance optimization: Throttle scroll events
let scrollTimeout;
window.addEventListener("scroll", function () {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(function () {
        // Update scroll-dependent animations
        const scrolled = window.pageYOffset;
        const circuitLines = document.querySelector(".circuit-lines");

        if (circuitLines) {
            circuitLines.style.transform = `translate(${scrolled * 0.1}px, ${scrolled * 0.1}px)`;
        }
    }, 16); // ~60fps
});

// Console welcome message
console.log(`
🖥️ Bài Giảng Điện Tử - Bộ Vi Xử Lý
═══════════════════════════════════
Chào mừng bạn đến với bài giảng!
📚 Nội dung: CPU, RAM, ROM
⚡ Công nghệ: HTML5, CSS3, JavaScript
🎯 Mục tiêu: Hiểu rõ kiến trúc máy tính

Nhấn F12 để mở Developer Tools
Nhấn Escape để quay về trang chủ
Nhấn Enter để xem nội dung
`);

// Add touch support for mobile devices
if ("ontouchstart" in window) {
    document.body.classList.add("touch-device");

    // Add touch feedback
    const touchElements = document.querySelectorAll(".start-btn, .nav-btn, .cpu-unit, .memory-unit");

    touchElements.forEach((element) => {
        element.addEventListener("touchstart", function () {
            this.style.transform = "scale(0.95)";
        });

        element.addEventListener("touchend", function () {
            setTimeout(() => {
                this.style.transform = "";
            }, 150);
        });
    });
}

// 3D Models Tab Functionality
function init3DModelTabs() {
    console.log("🚀 Initializing tab functionality...");

    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    console.log("Found tab buttons:", tabButtons.length);
    console.log("Found tab panels:", tabPanels.length);

    if (tabButtons.length === 0) {
        console.warn("⚠️ No tab buttons found");
        return;
    }

    tabButtons.forEach((button, index) => {
        console.log(`Adding click listener to button ${index}:`, button.getAttribute("data-tab"));

        button.addEventListener("click", function () {
            const targetTab = this.getAttribute("data-tab");
            console.log("🔄 Tab clicked:", targetTab);

            // Remove active class from all buttons and panels
            tabButtons.forEach((btn) => btn.classList.remove("active"));
            tabPanels.forEach((panel) => panel.classList.remove("active"));

            // Add active class to clicked button
            this.classList.add("active");

            // Show corresponding panel with animation
            const targetPanel = document.getElementById(targetTab + "-panel");
            if (targetPanel) {
                console.log("✅ Showing panel:", targetTab + "-panel");
                setTimeout(() => {
                    targetPanel.classList.add("active");

                    // Initialize Three.js model if not already done
                    if (threeJSModels && !threeJSModels.isInitialized) {
                        console.log("🔧 Initializing Three.js models...");
                        threeJSModels.init();
                    }

                    // Handle resize for the newly shown canvas
                    setTimeout(() => {
                        if (threeJSModels && threeJSModels.handleResize) {
                            threeJSModels.handleResize();
                        }
                    }, 100);
                }, 100);
            } else {
                console.error("❌ Target panel not found:", targetTab + "-panel");
            }

            // Add click animation
            this.style.transform = "scale(0.95)";
            setTimeout(() => {
                this.style.transform = "";
            }, 150);
        });
    });

    console.log("✅ Tab functionality initialized successfully");
}

// Add keyboard navigation for tabs
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        if (contentSection.style.display !== "none") {
            backToHomeBtn.click();
        }
    }

    if (e.key === "Enter" || e.key === " ") {
        if (mainBanner.style.display !== "none") {
            e.preventDefault();
            startLearningBtn.click();
        }
    }

    // Tab navigation with arrow keys
    const activeTab = document.querySelector(".tab-btn.active");
    const allTabs = Array.from(document.querySelectorAll(".tab-btn"));

    if (activeTab && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault();
        const currentIndex = allTabs.indexOf(activeTab);
        let nextIndex;

        if (e.key === "ArrowRight") {
            nextIndex = (currentIndex + 1) % allTabs.length;
        } else {
            nextIndex = (currentIndex - 1 + allTabs.length) % allTabs.length;
        }

        allTabs[nextIndex].click();
    }
});

// Add performance optimization for 3D animations
function optimizeAnimations() {
    let isVisible = true;

    // Pause Three.js animations when tab is not visible
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            isVisible = false;
            // Pause Three.js animations
            if (threeJSModels && threeJSModels.models) {
                Object.keys(threeJSModels.models).forEach((modelType) => {
                    const model = threeJSModels.models[modelType];
                    if (model && model.userData.rotationSpeed) {
                        model.userData.originalSpeed = { ...model.userData.rotationSpeed };
                        model.userData.rotationSpeed = { x: 0, y: 0, z: 0 };
                    }
                });
            }
        } else {
            isVisible = true;
            // Resume Three.js animations
            if (threeJSModels && threeJSModels.models) {
                Object.keys(threeJSModels.models).forEach((modelType) => {
                    const model = threeJSModels.models[modelType];
                    if (model && model.userData.originalSpeed) {
                        model.userData.rotationSpeed = { ...model.userData.originalSpeed };
                    }
                });
            }
        }
    });

    // Intersection Observer for performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const canvas = entry.target;
            const modelType = canvas.id.replace("-canvas", "");

            if (threeJSModels && threeJSModels.models[modelType]) {
                const model = threeJSModels.models[modelType];

                if (entry.isIntersecting && isVisible) {
                    // Resume animation
                    if (model.userData.originalSpeed) {
                        model.userData.rotationSpeed = { ...model.userData.originalSpeed };
                    }
                } else {
                    // Pause animation
                    if (model.userData.rotationSpeed && !model.userData.originalSpeed) {
                        model.userData.originalSpeed = { ...model.userData.rotationSpeed };
                    }
                    if (model.userData.rotationSpeed) {
                        model.userData.rotationSpeed = { x: 0, y: 0, z: 0 };
                    }
                }
            }
        });
    });

    // Observe canvas elements
    setTimeout(() => {
        const canvases = document.querySelectorAll("#cpu-canvas, #ram-canvas, #rom-canvas");
        canvases.forEach((canvas) => observer.observe(canvas));
    }, 3000);
}

// Initialize tab functionality when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("📄 DOM Content Loaded - Initializing tab functionality...");
    // Wait a bit to ensure all elements are rendered
    setTimeout(() => {
        init3DModelTabs();
    }, 100);
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === "loading") {
    console.log("📄 DOM is still loading, waiting...");
} else {
    console.log("📄 DOM already loaded, initializing immediately");
    setTimeout(() => {
        init3DModelTabs();
    }, 100);
}

// Initialize performance optimizations
optimizeAnimations();

// Initialize Three.js models when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
    // Wait a bit for the page to fully load
    setTimeout(async () => {
        try {
            console.log("🔧 Starting Three.js initialization...");
            await threeJSModels.init();
            console.log("✅ Three.js models initialized successfully");
        } catch (error) {
            console.error("❌ Error initializing Three.js models:", error);
        }
    }, 2000); // Delay to ensure everything is loaded
});

// Video player initialization
document.addEventListener("DOMContentLoaded", function () {
    const videoPlayers = document.querySelectorAll(".video-player");

    videoPlayers.forEach((player) => {
        const videoId = player.getAttribute("data-video-id");
        const isMainVideo = player.classList.contains("main-video");

        // Initialize Video.js player
        const videoJsPlayer = videojs(player, {
            controls: true,
            autoplay: false,
            preload: "auto",
            responsive: true,
            fluid: true,
            aspectRatio: "16:9",
        });

        // Load video source
        videoJsPlayer.src({
            src: `https://path/to/your/video/${videoId}.mp4`,
            type: "video/mp4",
        });

        // Poster image
        const posterImage = player.getAttribute("data-poster");
        if (posterImage) {
            videoJsPlayer.poster(posterImage);
        }

        // Main video specific settings
        if (isMainVideo) {
            videoJsPlayer.on("ready", function () {
                this.play();
            });
        }

        // Error handling
        videoJsPlayer.on("error", function () {
            const errorCode = this.error().code;
            console.error("Video.js error:", errorCode);
        });
    });
});

// Add custom control for main video
const mainVideoPlayer = document.querySelector(".video-player.main-video");
if (mainVideoPlayer) {
    const playButton = document.createElement("button");
    playButton.className = "vjs-play-control vjs-control vjs-button";
    playButton.innerHTML = "▶️ Play Video";
    mainVideoPlayer.parentNode.insertBefore(playButton, mainVideoPlayer);

    playButton.addEventListener("click", function () {
        const videoJsPlayer = videojs(mainVideoPlayer);
        if (videoJsPlayer.paused()) {
            videoJsPlayer.play();
            this.style.display = "none"; // Hide button when video plays
        }
    });
}

// Hide video controls on mobile
if (window.innerWidth <= 768) {
    const videoControls = document.querySelectorAll(".video-js .vjs-control-bar");
    videoControls.forEach((controls) => {
        controls.style.display = "none";
    });
}

// Show/hide video controls on scroll
let lastScrollTop = 0;
const videoControlBars = document.querySelectorAll(".video-js .vjs-control-bar");
window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    videoControlBars.forEach((controls) => {
        if (scrollTop > lastScrollTop) {
            // Scroll down - hide controls
            controls.style.transform = "translateY(100%)";
        } else {
            // Scroll up - show controls
            controls.style.transform = "translateY(0)";
        }
    });

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
});
