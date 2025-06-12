// Video Player Controller
class VideoPlayerController {
    constructor() {
        this.currentVideo = null;
        this.currentPlaylist = "cpu"; // Mặc định vẫn là CPU
        this.isChangingVideo = false; // Thêm flag để prevent multiple calls
        this.videoChangeDebounce = null; // Debounce timer
        this.videoData = {
            cpu: [
                {
                    id: "cpu-1",
                    title: "1. Giới thiệu về CPU",
                    src: "videos/cpu-intro.mp4",
                    thumb: "images/cpu-thumb-1.jpg",
                    duration: "15:30",
                    chapters: [
                        { time: 0, title: "Giới thiệu" },
                        { time: 80, title: "Định nghĩa CPU" },
                        { time: 180, title: "Lịch sử phát triển" },
                        { time: 300, title: "Kiến trúc cơ bản" },
                        { time: 500, title: "Vai trò trong hệ thống" },
                        { time: 750, title: "Tổng kết" },
                    ],
                    completed: false, // Added completion status
                },
                {
                    id: "cpu-2",
                    title: "2. Kiến trúc CPU",
                    src: "videos/cpu-architecture.mp4",
                    thumb: "images/cpu-thumb-2.jpg",
                    duration: "22:45",
                    chapters: [
                        { time: 0, title: "Giới thiệu kiến trúc" },
                        { time: 120, title: "ALU - Đơn vị tính toán" },
                        { time: 300, title: "Control Unit" },
                        { time: 480, title: "Registers" },
                        { time: 720, title: "Cache Memory" },
                        { time: 900, title: "Bus hệ thống" },
                        { time: 1080, title: "Kết luận" },
                    ],
                    completed: false, // Added completion status
                },
                {
                    id: "cpu-3",
                    title: "3. Bộ lệnh CPU",
                    src: "videos/cpu-instructions.mp4",
                    thumb: "images/cpu-thumb-3.jpg",
                    duration: "18:20",
                    chapters: [
                        { time: 0, title: "Tổng quan về bộ lệnh" },
                        { time: 100, title: "Các loại lệnh cơ bản" },
                        { time: 280, title: "Chu kỳ lệnh" },
                        { time: 500, title: "Pipeline" },
                        { time: 780, title: "Tối ưu hóa thực thi" },
                    ],
                    completed: false, // Added completion status
                },
                {
                    id: "cpu-4",
                    title: "4. Hiệu năng CPU",
                    src: "videos/cpu-performance.mp4",
                    duration: "25:10",
                    chapters: [
                        { time: 0, title: "Các yếu tố ảnh hưởng hiệu năng" },
                        { time: 200, title: "Clock speed và IPC" },
                        { time: 450, title: "Multi-core và thread" },
                        { time: 750, title: "Benchmark và đánh giá" },
                        { time: 1000, title: "So sánh các thế hệ CPU" },
                        { time: 1300, title: "Kết luận" },
                    ],
                    completed: false, // Added completion status
                },
                {
                    id: "cpu-5",
                    title: "5. Thực hành với CPU",
                    src: "videos/cpu-practical.mp4",
                    duration: "30:15",
                    chapters: [
                        { time: 0, title: "Giới thiệu bài thực hành" },
                        { time: 120, title: "Tháo lắp CPU" },
                        { time: 500, title: "Làm mát CPU" },
                        { time: 800, title: "Overclocking cơ bản" },
                        { time: 1200, title: "Khắc phục sự cố" },
                        { time: 1500, title: "Tổng kết" },
                    ],
                    completed: false, // Added completion status
                },
            ],
            boNhoTrong: [
                // Danh mục mới: Bộ nhớ trong (RAM + ROM)                {
                {
                    id: "ram-1",
                    title: "1. Giới thiệu về RAM",
                    src: "videos/ram-intro.mp4",
                    thumb: "images/ram-thumb-1.jpg",
                    duration: "12:30",
                    chapters: [
                        { time: 0, title: "Khái niệm RAM" },
                        { time: 90, title: "Vai trò của RAM" },
                        { time: 220, title: "So sánh các loại bộ nhớ" },
                        { time: 400, title: "Cách thức hoạt động" },
                        { time: 600, title: "Tổng kết" },
                    ],
                    completed: false,
                },
                {
                    id: "ram-2",
                    title: "2. Các loại RAM",
                    src: "videos/ram-types.mp4",
                    thumb: "images/ram-thumb-2.jpg",
                    duration: "18:45",
                    chapters: [
                        { time: 0, title: "SRAM và DRAM" },
                        { time: 150, title: "DDR, DDR2, DDR3, DDR4, DDR5" },
                        { time: 300, title: "SDRAM vs RDRAM" },
                        { time: 600, title: "ECC Memory" },
                        { time: 800, title: "Tương lai của RAM" },
                    ],
                    completed: false, // Added completion status
                },
                {
                    id: "ram-3",
                    title: "3. Hiệu năng RAM",
                    src: "videos/ram-performance.mp4",
                    thumb: "images/ram-thumb-3.jpg",
                    duration: "20:15",
                    chapters: [
                        { time: 0, title: "Các thông số hiệu năng" },
                        { time: 180, title: "Latency và timing" },
                        { time: 400, title: "Băng thông và tốc độ" },
                        { time: 700, title: "Dual-channel, Quad-channel" },
                        { time: 950, title: "Tối ưu hóa RAM" },
                    ],
                    completed: false, // Added completion status
                },
                {
                    id: "ram-4",
                    title: "4. Lắp đặt RAM",
                    src: "videos/ram-installation.mp4",
                    thumb: "images/ram-thumb-4.jpg",
                    duration: "15:30",
                    chapters: [
                        { time: 0, title: "Chuẩn bị lắp đặt" },
                        { time: 120, title: "Quy trình lắp đặt" },
                        { time: 300, title: "Cấu hình BIOS/UEFI" },
                        { time: 500, title: "Kiểm tra sau lắp đặt" },
                        { time: 800, title: "Xử lý sự cố thường gặp" },
                    ],
                    completed: false, // Added completion status
                },
                {
                    // Videos từ ROM
                    id: "rom-1",
                    title: "5. Giới thiệu về ROM", // Đánh số lại title cho phù hợp
                    src: "videos/rom-intro.mp4",
                    thumb: "images/rom-thumb-1.jpg",
                    duration: "10:20",
                    chapters: [
                        { time: 0, title: "Khái niệm ROM" },
                        { time: 90, title: "Đặc điểm và vai trò" },
                        { time: 200, title: "So sánh với RAM" },
                        { time: 350, title: "Ứng dụng của ROM" },
                        { time: 500, title: "Kết luận" },
                    ],
                    completed: false, // Added completion status
                },
                {
                    id: "rom-2",
                    title: "6. BIOS và UEFI", // Đánh số lại title
                    src: "videos/rom-bios.mp4",
                    thumb: "images/rom-thumb-2.jpg",
                    duration: "16:40",
                    chapters: [
                        { time: 0, title: "Giới thiệu BIOS" },
                        { time: 150, title: "Chức năng của BIOS" },
                        { time: 300, title: "UEFI và sự khác biệt" },
                        { time: 500, title: "Cập nhật firmware" },
                        { time: 700, title: "Cấu hình và tùy chỉnh" },
                        { time: 900, title: "Tổng kết" },
                    ],
                    completed: false, // Added completion status
                },
                {
                    id: "rom-3",
                    title: "7. Các loại ROM", // Đánh số lại title
                    src: "videos/rom-types.mp4",
                    thumb: "images/rom-thumb-3.jpg",
                    duration: "14:15",
                    chapters: [
                        { time: 0, title: "ROM truyền thống" },
                        { time: 120, title: "PROM và EPROM" },
                        { time: 250, title: "EEPROM và Flash ROM" },
                        { time: 400, title: "Mask ROM" },
                        { time: 600, title: "Xu hướng phát triển" },
                        { time: 780, title: "Kết luận" },
                    ],
                    completed: false, // Added completion status
                },
            ],
            boNhoNgoai: [
                // Danh mục: Bộ nhớ ngoài (Ổ cứng, SSD, USB,...)                {
                {
                    id: "hdd-1",
                    title: "1. Giới thiệu về ổ cứng HDD",
                    src: "videos/hdd-intro.mp4",
                    thumb: "images/hdd-thumb-1.jpg",
                    duration: "14:30",
                    chapters: [
                        { time: 0, title: "Khái niệm ổ cứng HDD" },
                        { time: 120, title: "Cấu tạo cơ bản" },
                        { time: 280, title: "Nguyên lý hoạt động" },
                        { time: 450, title: "Các thông số chính" },
                        { time: 650, title: "Ưu và nhược điểm" },
                        { time: 780, title: "Tổng kết" },
                    ],
                    completed: false, // Added completion status
                },
                {
                    id: "hdd-2",
                    title: "2. Cấu trúc và hoạt động của HDD",
                    src: "videos/hdd-structure.mp4",
                    thumb: "images/hdd-thumb-2.jpg",
                    duration: "18:15",
                    chapters: [
                        { time: 0, title: "Chi tiết cấu trúc vật lý" },
                        { time: 180, title: "Đĩa từ và đầu đọc" },
                        { time: 390, title: "Bộ điều khiển" },
                        { time: 600, title: "Quy trình đọc/ghi dữ liệu" },
                        { time: 850, title: "Công nghệ ghi từ hiện đại" },
                        { time: 1000, title: "Kết luận" },
                    ],
                    completed: false, // Added completion status
                },
                {
                    id: "ssd-1",
                    title: "3. Giới thiệu về ổ cứng SSD",
                    src: "videos/ssd-intro.mp4",
                    thumb: "images/ssd-thumb-1.jpg",
                    duration: "16:20",
                    chapters: [
                        { time: 0, title: "Khái niệm ổ SSD" },
                        { time: 150, title: "Lịch sử phát triển" },
                        { time: 300, title: "Cấu tạo cơ bản" },
                        { time: 480, title: "Nguyên lý hoạt động" },
                        { time: 720, title: "So sánh với HDD" },
                        { time: 900, title: "Kết luận" },
                    ],
                    completed: false, // Added completion status
                },
                {
                    id: "ssd-2",
                    title: "4. Công nghệ và hiệu năng SSD",
                    src: "videos/ssd-technology.mp4",
                    thumb: "images/ssd-thumb-2.jpg",
                    duration: "21:40",
                    chapters: [
                        { time: 0, title: "Các loại chip nhớ" },
                        { time: 200, title: "Giao tiếp SATA và NVMe" },
                        { time: 450, title: "Hiệu năng và benchmark" },
                        { time: 720, title: "Độ bền và tuổi thọ" },
                        { time: 950, title: "Công nghệ tối ưu" },
                        { time: 1150, title: "Xu hướng phát triển" },
                    ],
                    completed: false, // Added completion status
                },
                {
                    id: "usb-1",
                    title: "5. Thiết bị lưu trữ di động",
                    src: "videos/usb-storage.mp4",
                    thumb: "images/usb-thumb-1.jpg",
                    duration: "15:10",
                    chapters: [
                        { time: 0, title: "Tổng quan về lưu trữ di động" },
                        { time: 120, title: "USB Flash Drive" },
                        { time: 300, title: "Thẻ nhớ (SD, microSD)" },
                        { time: 500, title: "Ổ cứng di động" },
                        { time: 700, title: "Tiêu chí lựa chọn" },
                        { time: 850, title: "Kết luận" },
                    ],
                    completed: false, // Added completion status
                },
                {
                    id: "cloud-1",
                    title: "6. Lưu trữ đám mây",
                    src: "videos/cloud-storage.mp4",
                    thumb: "images/cloud-thumb-1.jpg",
                    duration: "19:25",
                    chapters: [
                        { time: 0, title: "Khái niệm lưu trữ đám mây" },
                        { time: 180, title: "Các dịch vụ phổ biến" },
                        { time: 400, title: "Cơ chế đồng bộ hóa" },
                        { time: 650, title: "Bảo mật và riêng tư" },
                        { time: 900, title: "Ưu điểm và hạn chế" },
                        { time: 1050, title: "Tổng kết" },
                    ],
                    completed: false, // Added completion status
                },
                {
                    id: "raid-1",
                    title: "7. Công nghệ RAID",
                    src: "videos/raid-tech.mp4",
                    thumb: "images/raid-thumb-1.jpg",
                    duration: "22:30",
                    chapters: [
                        { time: 0, title: "Khái niệm RAID" },
                        { time: 180, title: "Các cấp độ RAID phổ biến" },
                        { time: 450, title: "RAID 0, 1, 5, 10" },
                        { time: 780, title: "Hardware vs Software RAID" },
                        { time: 1100, title: "Thiết lập và quản lý" },
                        { time: 1250, title: "Kết luận" },
                    ],
                    completed: false, // Added completion status
                },
            ],
        };
        this.progress = {
            cpu: { completed: 0, total: this.videoData.cpu.length },
            boNhoTrong: { completed: 0, total: this.videoData.boNhoTrong.length },
            boNhoNgoai: { completed: 0, total: this.videoData.boNhoNgoai.length },
        };

        this.customControls = null;
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.updateVideoLevels();
        this.generateAccordionPlaylist();
        this.switchPlaylist("cpu");
        this.getChapterForVideo();

        // Auto-load first video when app starts
        this.autoLoadFirstVideo();

        // Wait for custom controls to be initialized
        this.waitForCustomControls();

        // Initialize completion status for all videos from localStorage
        this.loadCompletionStatus();

        // Initialize bookmark count
        const bookmarkCountElement = document.getElementById("bookmark-count");
        if (bookmarkCountElement && this.bookmarks && this.bookmarks.length > 0) {
            bookmarkCountElement.textContent = this.bookmarks.length;
            bookmarkCountElement.classList.add("active");
        } else if (bookmarkCountElement) {
            bookmarkCountElement.textContent = "0";
            bookmarkCountElement.classList.remove("active");
        }
    }

    getChapterForVideo() {
        // Nếu không có video hiện tại, không làm gì cả
        if (!this.currentVideo || !this.currentVideo.id) {
            return [];
        }

        const videoId = this.currentVideo.id;

        // Tìm video trong các danh mục
        for (const category in this.videoData) {
            const video = this.videoData[category].find((v) => v.id === videoId);
            if (video && video.chapters) {
                // Kích hoạt sự kiện để thông báo phân đoạn video đã sẵn sàng
                const chaptersEvent = new CustomEvent("video-chapters-ready", {
                    detail: {
                        videoId: videoId,
                        chapters: video.chapters,
                    },
                });
                window.dispatchEvent(chaptersEvent);

                // Cập nhật indicator nếu có phân đoạn
                const indicator = document.getElementById("chapter-indicator");
                if (indicator && video.chapters.length > 0) {
                    indicator.style.display = "inline-block";
                }

                return video.chapters;
            }
        }

        return [];
    }

    updateVideoLevels() {
        // Placeholder for video levels update logic
        // This function will be called to update any UI elements
        // related to video levels or progress within a series.
        // Example: You might want to update a visual indicator for the current video's level
        // or the overall progress through a series of videos.
        // const currentVideoLevel = this.currentVideo ? this.currentVideo.level : 0; // Assuming 'level' property
        // const totalLevels = this.videoData[this.currentPlaylist] ? this.videoData[this.currentPlaylist].length : 0;
        // const levelIndicator = document.getElementById('video-level-indicator');
        // if (levelIndicator) {
        //     levelIndicator.textContent = `Level ${currentVideoLevel} / ${totalLevels}`;
        // }
    }

    checkIfBookmarked(videoId) {
        // Check if the video is bookmarked
        if (!this.bookmarks) {
            this.bookmarks = JSON.parse(localStorage.getItem("videoBookmarks")) || [];
        }
        return this.bookmarks.some((bookmark) => bookmark.id === videoId);
    }

    generateAccordionPlaylist() {
        const accordionContainer = document.getElementById("accordion-playlist");
        if (!accordionContainer) {
            console.error("Accordion playlist container not found!");
            return;
        }

        // Clear any existing content
        accordionContainer.innerHTML = "";

        // Topic icons mapping
        const topicIcons = {
            cpu: "💻",
            boNhoTrong: "🧠", // Icon cho Bộ nhớ trong
            boNhoNgoai: "💽", // Icon cho Bộ nhớ ngoài
        };

        // Topic titles mapping
        const topicTitles = {
            cpu: "CPU - Bộ xử lý trung tâm",
            boNhoTrong: "Bộ nhớ trong (RAM, ROM)",
            boNhoNgoai: "Bộ nhớ ngoài (Ổ cứng, SSD,...)",
        };

        // Generate accordion items for each topic
        for (const topic in this.videoData) {
            const videos = this.videoData[topic];
            const isFirstTopic = topic === "cpu"; // First topic expanded by default

            // Create accordion item
            const accordionItem = document.createElement("div");
            accordionItem.className = `accordion-item ${isFirstTopic ? "active" : ""}`;

            // Create header
            const header = document.createElement("div");
            header.className = "accordion-header";
            header.innerHTML = `
                <span class="topic-icon">${topicIcons[topic] || "📚"}</span>
                <span class="topic-title">${topicTitles[topic] || topic.toUpperCase()}</span>
                <span class="accordion-icon">▼</span>
            `;

            // Create content container
            const content = document.createElement("div");
            content.className = "accordion-content";

            // Add videos to content
            videos.forEach((video, index) => {
                const videoItem = document.createElement("div");
                videoItem.className = "video-item";
                videoItem.dataset.video = video.id;
                videoItem.dataset.src = video.src;

                // If first video in first topic, mark as active
                if (isFirstTopic && index === 0) {
                    videoItem.classList.add("active");
                }

                // Check if this video is bookmarked using global bookmark manager
                let isBookmarked = false;
                try {
                    if (window.bookmarkManager) {
                        isBookmarked = window.bookmarkManager.isVideoBookmarked(video.id);
                    }
                } catch (error) {
                    console.warn("Error checking bookmark status:", error);
                }

                // Create thumbnail image path from video src
                const thumbnailSrc = video.thumb;

                videoItem.innerHTML = `
                    <div class="video-thumbnail">
                        <img src="${thumbnailSrc}" alt="${video.title}">
                        <span class="video-duration">${video.duration}</span>
                        <span class="video-bookmark-icon ${isBookmarked ? "active" : ""}" 
                              style="display: ${isBookmarked ? "flex" : "none"}">🔖</span>
                    </div>
                    <div class="video-info">
                        <h4>${video.title}</h4>
                        <p>Bài học ${index + 1} - ${topic.toUpperCase()}</p>
                    </div>
                `;

                content.appendChild(videoItem);
            });

            // Assemble accordion item
            accordionItem.appendChild(header);
            accordionItem.appendChild(content);

            // Add to container
            accordionContainer.appendChild(accordionItem);
        }

        // Add event listeners for accordion headers
        this.setupAccordionEvents();
    }

    setupAccordionEvents() {
        const accordionHeaders = document.querySelectorAll(".accordion-header");

        accordionHeaders.forEach((header) => {
            header.addEventListener("click", () => {
                const accordionItem = header.parentElement;
                const isActive = accordionItem.classList.contains("active");

                // Close all accordion items
                document.querySelectorAll(".accordion-item").forEach((item) => {
                    item.classList.remove("active");
                });

                // If clicked item wasn't active, activate it
                if (!isActive) {
                    accordionItem.classList.add("active");
                }
            });
        });

        // Video item click handler
        document.addEventListener("click", (e) => {
            const videoItem = e.target.closest(".video-item");
            if (videoItem) {
                const videoId = videoItem.dataset.video;
                const videoSrc = videoItem.dataset.src;
                if (videoId && videoSrc) {
                    this.playVideo(videoId, videoSrc);
                }
            }
        });

        // Add click handler for bookmark icons in playlist
        document.addEventListener("click", (e) => {
            if (e.target.closest(".video-bookmark-icon")) {
                e.stopPropagation(); // Prevent video selection
                const videoItem = e.target.closest(".video-item");
                if (videoItem && window.bookmarkManager) {
                    const videoId = videoItem.dataset.video;
                    if (videoId) {
                        window.bookmarkManager.toggleBookmark(videoId);
                    }
                }
            }
        });
    }

    autoLoadFirstVideo() {
        // Auto-load the first CPU video when the app starts
        setTimeout(() => {
            const firstVideo = this.videoData.cpu[0];
            if (firstVideo) {
                this.playVideo(firstVideo.id, firstVideo.src);
            }
        }, 1000); // Delay to ensure all elements are loaded
    }

    waitForCustomControls() {
        const checkControls = () => {
            if (window.customVideoControls) {
                this.customControls = window.customVideoControls;
                // Removed duplicate click handler to prevent conflicts
                // Add enhanced keyboard controls
                document.addEventListener("keydown", (e) => {
                    // Ignore if focus is on input elements
                    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable)
                        return;

                    switch (e.code) {
                        case "Space": // Play/Pause
                            e.preventDefault();
                            this.togglePlayPause();
                            this.showPlayPauseFeedback();
                            break;

                        case "ArrowLeft": // Rewind 5 seconds
                            e.preventDefault();
                            this.seekVideo(-5);
                            break;

                        case "ArrowRight": // Forward 5 seconds
                            e.preventDefault();
                            this.seekVideo(5);
                            break;

                        case "ArrowUp": // Increase volume
                            e.preventDefault();
                            this.adjustVolume(0.1);
                            break;

                        case "ArrowDown": // Decrease volume
                            e.preventDefault();
                            this.adjustVolume(-0.1);
                            break;

                        case "KeyM": // Mute/Unmute
                            e.preventDefault();
                            this.toggleMute();
                            break;

                        case "KeyN": // Next video
                            e.preventDefault();
                            this.playNextVideo();
                            break;

                        case "KeyP": // Previous video
                            e.preventDefault();
                            this.playPreviousVideo();
                            break;

                        case "KeyF": // Toggle fullscreen
                            e.preventDefault();
                            if (this.customControls) {
                                this.customControls.toggleFullscreen();
                            }
                            break;
                    }
                });

                clearInterval(checkInterval);
            }
        };

        const checkInterval = setInterval(checkControls, 100);
    }

    setupCustomControlsIntegration() {
        // Listen for custom control events
        window.addEventListener("next-video", () => this.nextVideo());
        window.addEventListener("previous-video", () => this.previousVideo());
    }

    setupEventListeners() {
        // Listen for custom events from video controls
        window.addEventListener("previous-video", () => {
            this.previousVideo();
        });

        window.addEventListener("next-video", () => {
            this.nextVideo();
        });
        const prevVideoBtn = document.getElementById("prev-video-btn");
        const nextVideoBtn = document.getElementById("next-video-btn");

        if (prevVideoBtn) {
            prevVideoBtn.addEventListener("click", () => {
                this.previousVideo();
            });
        }

        if (nextVideoBtn) {
            nextVideoBtn.addEventListener("click", () => {
                this.nextVideo();
            });
        }
        // Listen for video ended event to auto-advance and track progress
        const videoElement = document.getElementById("main-video");
        if (videoElement) {
            videoElement.addEventListener("timeupdate", () => {
                this.onVideoTimeUpdate();
            });

            videoElement.addEventListener("ended", () => {
                this.onVideoEnded();
            });
        }
        // Topic navigation
        document.querySelectorAll(".topic-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const topic = e.currentTarget.dataset.topic;
                this.switchPlaylist(topic);
            });
        });

        // Video items
        document.addEventListener("click", (e) => {
            if (e.target.closest(".video-item")) {
                const videoItem = e.target.closest(".video-item");
                const videoId = videoItem.dataset.video;
                const videoSrc = videoItem.dataset.src;
                this.playVideo(videoId, videoSrc);
            }
        }); // Custom control integration - listen for next/prev events from custom controls
    }

    onVideoTimeUpdate() {
        const videoElement = document.getElementById("main-video");
        if (!videoElement || !this.currentVideo) return;

        const currentTime = videoElement.currentTime;
        const duration = videoElement.duration;

        // Đảm bảo video đã load đủ metadata và có duration hợp lệ
        if (!duration || duration <= 0 || isNaN(duration) || isNaN(currentTime)) {
            return;
        }

        // Chỉ kiểm tra completion khi video đang phát (không pause)
        if (videoElement.paused) {
            return;
        }

        const progressPercent = (currentTime / duration) * 100;

        // Kiểm tra kỹ hơn và chỉ đánh dấu khi thực sự đạt 75%
        if (progressPercent >= 75 && !this.currentVideo.completed) {
            // Thêm kiểm tra để đảm bảo video đã được xem đủ lâu (ít nhất 5 giây)
            if (currentTime >= 5) {
                this.markVideoAsCompleted(this.currentVideo.id);
            }
        }
    }

    checkVideoCompletion() {
        const videoElement = document.getElementById("main-video");
        if (!videoElement || !this.currentVideo || this.currentVideo.completed) {
            return;
        }

        if (videoElement.duration > 0 && videoElement.currentTime / videoElement.duration >= 0.75) {
            this.markVideoAsCompleted(this.currentVideo.id);
        }
    }

    markVideoAsCompleted(videoId) {
        // Kiểm tra video ID có khớp với video đang phát không
        if (!this.currentVideo || this.currentVideo.id !== videoId) {
            console.warn(
                `Attempted to mark video ${videoId} as completed, but current video is ${this.currentVideo?.id}`
            );
            return;
        }

        const videoElement = document.getElementById("main-video");
        const videoData = this.findVideoById(videoId);

        if (!videoElement || !videoData) {
            console.warn(`Cannot mark video ${videoId} as completed: missing element or data`);
            return;
        }

        // Kiểm tra lại progress một lần nữa để chắc chắn
        const currentProgress = (videoElement.currentTime / videoElement.duration) * 100;

        if (currentProgress >= 75 && !videoData.completed && !videoElement.paused) {
            videoData.completed = true;
            this.updateVideoItemUI(videoId);
            this.updateNextButtonState();
            this.updatePlaylistProgress();
            this.saveCompletionStatus();

            // Hiển thị thông báo hoàn thành
            this.showMessage(`✅ Đã hoàn thành: ${videoData.title}`);
        } else if (currentProgress < 75) {
            console.log(`Video ${videoId} only at ${currentProgress.toFixed(2)}%, not marking as completed`);
        }
    }
    updateVideoItemUI(videoId) {
        const videoItemElement = document.querySelector(`.video-item[data-video="${videoId}"]`);
        if (videoItemElement) {
            videoItemElement.classList.add("completed");

            // Add completion indicator if not present
            let statusIndicator = videoItemElement.querySelector(".video-completion-status");
            if (!statusIndicator) {
                statusIndicator = document.createElement("span");
                statusIndicator.className = "video-completion-status";
                statusIndicator.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
                    <path d="M7 12.5L10 15.5L17 8.5" stroke="white" stroke-width="2" fill="none"/>
                </svg>`;
                statusIndicator.title = "Đã hoàn thành";

                // Insert into video info area
                const videoInfo = videoItemElement.querySelector(".video-info");
                if (videoInfo) {
                    videoInfo.appendChild(statusIndicator);
                }
            }
        }
    }

    updateNextButtonState() {
        const nextVideoBtn = document.getElementById("next-video-btn");
        if (nextVideoBtn && this.currentVideo) {
            nextVideoBtn.disabled = !this.currentVideo.completed;
            nextVideoBtn.title = this.currentVideo.completed
                ? "Chuyển sang video tiếp theo"
                : "Xem hết 75% video hiện tại để mở khóa";
        }
    }

    updatePlaylistProgress() {
        const progressElement = document.getElementById("playlist-progress");
        if (!progressElement) return;

        const currentPlaylistVideos = this.videoData[this.currentPlaylist];
        if (!currentPlaylistVideos) return;

        const completedCount = currentPlaylistVideos.filter((video) => video.completed).length;
        const totalCount = currentPlaylistVideos.length;

        progressElement.textContent = `${completedCount}/${totalCount} hoàn thành`;

        // Update progress percentage in UI if there's a progress bar
        const progressBar = document.querySelector(".playlist-progress-bar");
        if (progressBar) {
            const percentage = (completedCount / totalCount) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }

    updateProgress(category) {
        if (!this.progress[category]) return;

        const completedVideos = this.videoData[category].filter((video) => video.completed);
        this.progress[category].completed = completedVideos.length;
    }

    saveCompletionStatus() {
        const completionData = {};
        for (const category in this.videoData) {
            this.videoData[category].forEach((video) => {
                if (video.completed) {
                    if (!completionData[category]) {
                        completionData[category] = [];
                    }
                    completionData[category].push(video.id);
                }
            });
        }
        localStorage.setItem("videoCompletionStatus", JSON.stringify(completionData));
    }

    showMessage(message) {
        // Create a toast-style message
        const messageDiv = document.createElement("div");
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease-out;
        `;

        // Add animation keyframes if not already present
        if (!document.querySelector("#message-animations")) {
            const style = document.createElement("style");
            style.id = "message-animations";
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(messageDiv);

        // Remove after 4 seconds with animation
        setTimeout(() => {
            messageDiv.style.animation = "slideOutRight 0.3s ease-in";
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    document.body.removeChild(messageDiv);
                }
            }, 300);
        }, 4000);
    }

    loadCompletionStatus() {
        const storedCompletion = localStorage.getItem("videoCompletionStatus");
        if (storedCompletion) {
            const completionData = JSON.parse(storedCompletion);
            for (const category in completionData) {
                if (this.videoData[category]) {
                    completionData[category].forEach((videoId) => {
                        const video = this.videoData[category].find((v) => v.id === videoId);
                        if (video) {
                            video.completed = true;
                            // Update UI for initially completed videos
                            const videoItemElement = document.querySelector(`.video-item[data-video="${videoId}"]`);
                            if (videoItemElement) {
                                videoItemElement.classList.add("completed");
                                let statusIndicator = videoItemElement.querySelector(".video-completion-status");
                                if (!statusIndicator) {
                                    statusIndicator = document.createElement("span");
                                    statusIndicator.className = "video-completion-status material-icons";
                                    const videoInfo = videoItemElement.querySelector(".video-info p");
                                    if (videoInfo) {
                                        videoInfo.insertAdjacentElement("beforeend", statusIndicator);
                                    }
                                }
                                statusIndicator.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
                                                                <path d="M7 12.5L10 15.5L17 8.5" stroke="white" stroke-width="2" fill="none"/>
                                                            </svg>`;
                                statusIndicator.title = "Đã hoàn thành";
                            }
                        }
                    });
                }
            }
        }
        // Update progress for all playlists initially
        for (const topic in this.progress) {
            this.updatePlaylistProgress(topic);
        }
    }

    switchPlaylist(topic) {
        this.currentPlaylist = topic;

        // Update topic buttons
        document.querySelectorAll(".topic-btn").forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.topic === topic);
        });

        // Update playlist visibility
        document.querySelectorAll(".video-list").forEach((list) => {
            list.classList.toggle("active", list.id === `${topic}-playlist`);
        });

        // Update playlist title
        const titles = {
            cpu: "Danh sách bài học - CPU",
            boNhoTrong: "Danh sách bài học - Bộ nhớ trong",
            boNhoNgoai: "Danh sách bài học - Bộ nhớ ngoài",
        };

        const playlistTitleElement = document.getElementById("playlist-title");
        if (playlistTitleElement) {
            playlistTitleElement.textContent = titles[topic] || `Danh sách bài học - ${topic.toUpperCase()}`;
        }

        // Update progress
        const progressData = this.progress[topic];
        const playlistProgressElement = document.getElementById("playlist-progress");
        if (playlistProgressElement && progressData) {
            // Recalculate completed count for the topic
            const completedCount = this.videoData[topic] ? this.videoData[topic].filter((v) => v.completed).length : 0;
            this.progress[topic].completed = completedCount;
            playlistProgressElement.textContent = `${completedCount}/${progressData.total} hoàn thành`;
        } else if (playlistProgressElement) {
            playlistProgressElement.textContent = `0/0 hoàn thành`; // Fallback for new/empty categories
        }
    }

    getChaptersForVideo(videoId) {
        // Tìm video theo ID trong tất cả các danh mục
        for (const category in this.videoData) {
            const video = this.videoData[category].find((v) => v.id === videoId);
            if (video && video.chapters) {
                return video.chapters;
            }
        }
        return []; // Trả về mảng rỗng nếu không tìm thấy
    }

    playVideo(videoId, videoSrc) {
        console.log(`🎬 Playing video: ${videoId}`);

        // DEBOUNCING: Prevent rapid successive calls
        if (this.videoChangeDebounce) {
            clearTimeout(this.videoChangeDebounce);
        }

        // Check if we're already changing video
        if (this.isChangingVideo) {
            console.log("🚫 Video change already in progress, ignoring request");
            return;
        }

        // Check if we actually have a new video to play
        if (this.currentVideo && this.currentVideo.id === videoId) {
            console.log("Same video already playing, ignoring request");
            return;
        }

        // Set flag to prevent concurrent video changes
        this.isChangingVideo = true;

        // Add debounce delay
        this.videoChangeDebounce = setTimeout(() => {
            this.executeVideoChange(videoId, videoSrc);
        }, 100); // 100ms debounce

        const videoElement = document.getElementById("main-video");
        const videoData = this.findVideoById(videoId);

        if (!videoElement || !videoData) {
            console.error("Video element or data not found");
            return;
        }

        // Determine which playlist this video belongs to
        const videoCategory = this.getCategoryFromVideoId(videoId);

        // Switch playlist if necessary
        if (videoCategory && videoCategory !== this.currentPlaylist) {
            console.log(`📁 Switching playlist from ${this.currentPlaylist} to ${videoCategory}`);
            this.switchPlaylist(videoCategory);
        }

        // Add fade-out transition effect
        this.addVideoTransitionEffect(videoElement);

        // Pause the current video
        videoElement.pause();

        // Update the currentVideo reference BEFORE setting new source
        this.currentVideo = videoData;
        this.updateNextButtonState();

        // Update video source and play after a slight delay for transition effect
        setTimeout(() => {
            videoElement.src = videoSrc;

            videoElement.onloadedmetadata = () => {
                console.log(`✅ Video loaded: ${videoData.title}`);

                if (this.customControls) {
                    this.customControls.resetControls();
                    this.customControls.updateDuration();
                }

                videoElement
                    .play()
                    .then(() => {
                        console.log("▶️ Video playback started");
                    })
                    .catch((error) => {
                        console.error("❌ Error playing video:", error);
                    });

                this.removeVideoTransitionEffect(videoElement);
            };

            // Update UI and tracking
            this.updatePlayingStatus(videoId, document.querySelectorAll(".video-item"));
            this.trackVideoProgress(videoId);
            this.updateVideoLevels();
            this.showPlayPauseFeedback();
            this.dispatchVideoChangeEvent(videoData);

            // Update bookmark status
            if (window.bookmarkManager) {
                const isBookmarked = window.bookmarkManager.isVideoBookmarked(videoId);
                window.bookmarkManager.updateBookmarkUI(videoId, isBookmarked);
            }

            // Dispatch video change event
            const chapters = this.getChapterForVideo();
            const videoChangedEvent = new CustomEvent("video-changed", {
                detail: {
                    id: videoId,
                    src: videoSrc,
                    title: videoData.title,
                    topic: videoCategory,
                    duration: videoData.duration,
                    chapters: chapters,
                },
            });
            window.dispatchEvent(videoChangedEvent);
        }, 400);
    }

    executeVideoChange(videoId, videoSrc) {
        console.log(`🎯 Executing video change to: ${videoId}`);

        const videoElement = document.getElementById("main-video");
        const videoData = this.findVideoById(videoId);

        if (!videoElement || !videoData) {
            console.error("❌ Video element or data not found");
            this.isChangingVideo = false;
            return;
        }

        // Determine which playlist this video belongs to
        const videoCategory = this.getCategoryFromVideoId(videoId);

        // Switch playlist if necessary
        if (videoCategory && videoCategory !== this.currentPlaylist) {
            console.log(`📁 Switching playlist from ${this.currentPlaylist} to ${videoCategory}`);
            this.switchPlaylist(videoCategory);
        }

        // Add fade-out transition effect
        this.addVideoTransitionEffect(videoElement);

        // Pause the current video
        videoElement.pause();

        // Update the currentVideo reference BEFORE setting new source
        this.currentVideo = videoData;
        this.updateNextButtonState();

        // Update video source and play after a slight delay for transition effect
        setTimeout(() => {
            videoElement.src = videoSrc;

            videoElement.onloadedmetadata = () => {
                console.log(`✅ Video loaded: ${videoData.title}`);

                if (this.customControls) {
                    this.customControls.resetControls();
                    this.customControls.updateDuration();
                }

                videoElement
                    .play()
                    .then(() => {
                        console.log("▶️ Video playback started");
                        // Reset flag after successful video change
                        this.isChangingVideo = false;
                    })
                    .catch((error) => {
                        console.error("❌ Error playing video:", error);
                        this.isChangingVideo = false;
                    });

                this.removeVideoTransitionEffect(videoElement);
            };

            videoElement.onerror = () => {
                console.error("❌ Video load error");
                this.isChangingVideo = false;
            };

            // Update UI and tracking
            this.updatePlayingStatus(videoId, document.querySelectorAll(".video-item"));
            this.trackVideoProgress(videoId);
            this.updateVideoLevels();
            this.showPlayPauseFeedback();
            this.dispatchVideoChangeEvent(videoData);

            // Update bookmark status
            if (window.bookmarkManager) {
                const isBookmarked = window.bookmarkManager.isVideoBookmarked(videoId);
                window.bookmarkManager.updateBookmarkUI(videoId, isBookmarked);
            }

            // Dispatch video change event
            const chapters = this.getChapterForVideo();
            const videoChangedEvent = new CustomEvent("video-changed", {
                detail: {
                    id: videoId,
                    src: videoSrc,
                    title: videoData.title,
                    topic: videoCategory,
                    duration: videoData.duration,
                    chapters: chapters,
                },
            });
            window.dispatchEvent(videoChangedEvent);
        }, 400);
    }

    /**
     * Add a transition effect when changing videos
     * @param {HTMLElement} videoElement - The video element
     */
    addVideoTransitionEffect(videoElement) {
        // Check if transition overlay already exists
        if (document.querySelector(".video-transition-overlay")) {
            return;
        }

        // Create transition overlay
        const overlay = document.createElement("div");
        overlay.className = "video-transition-overlay";
        overlay.innerHTML = '<div class="transition-spinner"></div>';

        // Add the overlay to video parent
        videoElement.parentElement.appendChild(overlay);

        // Add the CSS for the transition effect if it doesn't exist yet
        if (!document.getElementById("video-transition-styles")) {
            const style = document.createElement("style");
            style.id = "video-transition-styles";
            style.textContent = `
                .video-transition-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                    z-index: 15;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease forwards;
                    border-radius: 20px;
                }
                
                .transition-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top: 3px solid #4caf50;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .video-transition-overlay.fade-out {
                    animation: fadeOut 0.5s ease forwards;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Remove the transition effect
     * @param {HTMLElement} videoElement - The video element
     */
    removeVideoTransitionEffect(videoElement) {
        const overlay = document.querySelector(".video-transition-overlay");
        if (!overlay) return;

        // Add fade-out animation
        overlay.classList.add("fade-out");

        // Remove overlay after animation completes
        setTimeout(() => {
            overlay?.parentElement?.removeChild(overlay);
        }, 500);
    }
    findVideoData(videoId) {
        for (const playlist of Object.values(this.videoData)) {
            const video = playlist.find((v) => v.id === videoId);
            if (video) return video;
        }
        return null;
    }
    findVideoById(videoId) {
        // This method is an alias for findVideoData for compatibility
        return this.findVideoData(videoId);
    }
    trackVideoProgress(videoId) {
        // Track progress for the video (placeholder implementation)
        // This could be expanded to track completion, watch time, etc.
    }
    /**
     * Dispatch video change event for bookmark system and other integrations
     * @param {Object} videoData - The video data object
     */
    dispatchVideoChangeEvent(videoData) {
        const event = new CustomEvent("video-changed", {
            detail: {
                ...videoData,
                playlist: this.currentPlaylist,
                timestamp: Date.now(),
            },
        });
        window.dispatchEvent(event);
    }

    /**
     * Load a video by ID and optionally switch playlist
     * @param {string} videoId - The video ID to load
     * @param {string} playlist - Optional playlist to switch to
     */
    loadVideo(videoId, playlist = null) {
        // Switch playlist if specified
        if (playlist && this.videoData[playlist]) {
            this.switchPlaylist(playlist);
        }

        // Find the video data
        const videoData = this.findVideoById(videoId);
        if (videoData) {
            this.playVideo(videoId, videoData.src);
        } else {
            console.error("Video not found:", videoId);
        }
    }

    onVideoEnded() {
        if (this.currentVideo) {
            // Mark as completed if not already
            // if (!this.currentVideo.completed) {
            //     this.markVideoAsCompleted(this.currentVideo.id);
            // }

            // Auto-advance to next video after a short delay
            setTimeout(() => {
                this.nextVideo();
            }, 1000);
        }
    }

    previousVideo() {
        const currentPlaylistVideos = this.videoData[this.currentPlaylist];
        if (!currentPlaylistVideos || !this.currentVideo) {
            return;
        }

        const currentIndex = currentPlaylistVideos.findIndex((video) => video.id === this.currentVideo.id);

        if (currentIndex > 0) {
            const previousVideo = currentPlaylistVideos[currentIndex - 1];
            this.playVideo(previousVideo.id, previousVideo.src);
        } else {
            console.warn("Already at the first video in playlist");
            // Optionally show a message or loop to last video
            this.advanceToNextPlaylist();
        }
    }

    nextVideo() {
        console.log("📍 nextVideo() called");
        console.log("📊 Current state:", {
            currentVideo: this.currentVideo?.id,
            currentPlaylist: this.currentPlaylist,
            isChangingVideo: this.isChangingVideo,
        });

        // Prevent multiple calls during video change
        if (this.isChangingVideo) {
            console.log("🚫 Cannot advance: video change in progress");
            return;
        }

        const currentPlaylistVideos = this.videoData[this.currentPlaylist];
        if (!currentPlaylistVideos || !this.currentVideo) {
            console.log("❌ No current video or playlist");
            return;
        }

        // Check if current video is completed for next video access
        if (!this.currentVideo.completed) {
            const videoElement = document.getElementById("main-video");
            if (videoElement && videoElement.duration) {
                const currentProgress = (videoElement.currentTime / videoElement.duration) * 100;
                console.log(`⏳ Video not completed: ${currentProgress.toFixed(1)}%`);
                this.showMessage(
                    `Bạn cần xem hết 75% video hiện tại để chuyển sang video tiếp theo (hiện tại: ${currentProgress.toFixed(
                        1
                    )}%)`
                );
            } else {
                this.showMessage("Bạn cần xem hết 75% video hiện tại để chuyển sang video tiếp theo");
            }
            return;
        }

        const currentIndex = currentPlaylistVideos.findIndex((video) => video.id === this.currentVideo.id);
        console.log(`📍 Current index: ${currentIndex} of ${currentPlaylistVideos.length - 1}`);

        if (currentIndex < currentPlaylistVideos.length - 1) {
            const nextVideo = currentPlaylistVideos[currentIndex + 1];
            console.log(`➡️ Moving to next video: ${nextVideo.title} (${nextVideo.id})`);
            this.playVideo(nextVideo.id, nextVideo.src);
            this.showMessage(`▶️ Chuyển sang: ${nextVideo.title}`);
        } else {
            console.log("🔚 At the last video of current playlist");
            this.promptNextPlaylist();
        }
    }

    advanceToNextPlaylist() {
        const playlistOrder = ["cpu", "boNhoTrong", "boNhoNgoai"];
        const currentPlaylistIndex = playlistOrder.indexOf(this.currentPlaylist);

        if (currentPlaylistIndex < playlistOrder.length - 1) {
            const nextPlaylist = playlistOrder[currentPlaylistIndex + 1];

            this.switchPlaylist(nextPlaylist);
            // Load first video of the new playlist
            const firstVideo = this.videoData[nextPlaylist][0];
            if (firstVideo) {
                this.playVideo(firstVideo.id);
            }
        } else {
            this.showMessage("Chúc mừng! Bạn đã hoàn thành tất cả các video");
        }
    }
    togglePlayPause() {
        const video = document.getElementById("main-video");
        if (!video) return;

        // Show visual feedback first
        this.showPlayPauseFeedback();

        if (video.paused) {
            video.play().catch((error) => console.error("Error playing video:", error));
        } else {
            video.pause();
        }
    }
    showPlayPauseFeedback() {
        const video = document.getElementById("main-video");
        if (!video) return;

        // Remove any existing feedback elements
        const existingFeedback = video.parentElement.querySelector(".video-action-feedback");
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Create simple feedback element
        const feedback = document.createElement("div");
        feedback.className = "video-action-feedback";

        // Determine if video will be playing or paused after toggle
        const willPlay = video.paused;

        // Create simple icons like YouTube
        if (willPlay) {
            feedback.innerHTML = '<span class="feedback-icon play">▶</span>';
        } else {
            feedback.innerHTML = '<span class="feedback-icon pause">⏸</span>';
        }

        // Add to video player container
        video.parentElement.appendChild(feedback);

        // Simple show/hide animation
        requestAnimationFrame(() => {
            feedback.classList.add("show");
        });

        // Remove after a short time
        setTimeout(() => {
            if (feedback.parentElement) {
                feedback.remove();
            }
        }, 600);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
    updatePlayingStatus(id, videoItems) {
        // Update the playing status for all videos
        document.querySelectorAll(".video-item").forEach((item) => {
            if (item.dataset.video === id) {
                if (!item.classList.contains("playing")) {
                    // Add playing class with animation
                    item.classList.add("playing", "active");
                    this.addPlayingAnimation(item);

                    // Make sure the accordion section is expanded
                    const accordionItem = item.closest(".accordion-item");
                    if (accordionItem && !accordionItem.classList.contains("active")) {
                        // Close all accordion items
                        document.querySelectorAll(".accordion-item").forEach((accItem) => {
                            accItem.classList.remove("active");
                        });

                        // Open this accordion item
                        accordionItem.classList.add("active");
                    }
                }
            } else {
                item.classList.remove("playing", "active");
            }
        });

        // Ensure the playing video is visible in the playlist by scrolling to it
        this.scrollToPlayingVideo();
    }

    /**
     * Add playing animation to the video item
     * @param {HTMLElement} item - The video item element
     */
    addPlayingAnimation(item) {
        // Add a highlight animation
        item.style.animation = "highlightItem 1s ease";

        // Remove the animation after it completes
        setTimeout(() => {
            item.style.animation = "";
        }, 1000);

        // Add animation styles if they don't exist
        if (!document.getElementById("playlist-animation-styles")) {
            const style = document.createElement("style");
            style.id = "playlist-animation-styles";
            style.textContent = `
                @keyframes highlightItem {
                    0% {
                        background: rgba(76, 175, 80, 0.4);
                        transform: translateY(-3px);
                    }
                    100% {
                        background: rgba(76, 175, 80, 0.1);
                        transform: translateY(-3px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Scroll to make sure the currently playing video is visible in the playlist
     */
    scrollToPlayingVideo() {
        const playingItem = document.querySelector(".video-item.playing");

        if (playingItem) {
            // Make sure the accordion item is expanded
            const accordionItem = playingItem.closest(".accordion-item");
            if (accordionItem) {
                accordionItem.classList.add("active");
            }

            // Scroll the item into view with a small delay to allow the accordion to expand
            setTimeout(() => {
                playingItem.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 300);
        }
    }

    /**
     * Seek the video by a specific amount of seconds
     * @param {number} seconds - Seconds to seek (negative for rewind, positive for forward)
     */
    seekVideo(seconds) {
        const videoElement = document.getElementById("main-video");
        if (!videoElement) return;

        // Calculate new time and ensure it's within valid range
        const newTime = Math.min(Math.max(0, videoElement.currentTime + seconds), videoElement.duration);

        // Set the new time
        videoElement.currentTime = newTime;

        // Show a small feedback indication
        this.showSeekFeedback(seconds);

        // Update custom controls if available
        if (this.customControls) {
            this.customControls.updateProgress();
        }
    }

    /**
     * Adjust video volume
     * @param {number} delta - Volume change (-1 to 1)
     */
    adjustVolume(delta) {
        const videoElement = document.getElementById("main-video");
        if (!videoElement) return;

        // Calculate new volume and ensure it's within valid range (0-1)
        const newVolume = Math.min(Math.max(0, videoElement.volume + delta), 1);

        // Set the new volume
        videoElement.volume = newVolume;

        // Update custom controls if available
        if (this.customControls) {
            this.customControls.updateVolumeUI();
        }

        // Show volume change feedback
        this.showVolumeFeedback(newVolume);
    }

    /**
     * Toggle mute/unmute
     */
    toggleMute() {
        const videoElement = document.getElementById("main-video");
        if (!videoElement) return;

        // Toggle mute state
        videoElement.muted = !videoElement.muted;

        // Update custom controls if available
        if (this.customControls) {
            this.customControls.updateVolumeUI();
        }

        // Show feedback
        this.showMuteFeedback(videoElement.muted);
    }

    /**
     * Play the next video in the playlist
     */
    playNextVideo() {
        const currentId = this.currentVideo?.id;
        if (!currentId) return;

        const videos = this.videoData[this.currentPlaylist];
        const currentIndex = videos.findIndex((video) => video.id === currentId);

        if (currentIndex !== -1 && currentIndex < videos.length - 1) {
            const nextVideo = videos[currentIndex + 1];
            this.playVideo(nextVideo.id, nextVideo.src);
        }
    }

    /**
     * Play the previous video in the playlist
     */
    playPreviousVideo() {
        const currentId = this.currentVideo?.id;
        if (!currentId) return;

        const videos = this.videoData[this.currentPlaylist];
        const currentIndex = videos.findIndex((video) => video.id === currentId);

        if (currentIndex > 0) {
            const prevVideo = videos[currentIndex - 1];
            this.playVideo(prevVideo.id, prevVideo.src);
        }
    }

    /**
     * Show visual feedback for seek operations
     * @param {number} seconds - Seconds (negative for rewind, positive for forward)
     */
    showSeekFeedback(seconds) {
        // Create feedback element if it doesn't exist
        let feedback = document.querySelector(".video-seek-feedback");
        if (!feedback) {
            feedback = document.createElement("div");
            feedback.className = "video-seek-feedback";

            // Add to video container
            const videoContainer = document.querySelector(".video-player");
            if (videoContainer) {
                videoContainer.appendChild(feedback);
            } else {
                return; // Exit if container doesn't exist
            }

            // Add CSS if not already added
            if (!document.getElementById("seek-feedback-styles")) {
                const style = document.createElement("style");
                style.id = "seek-feedback-styles";
                style.textContent = `
                    .video-seek-feedback {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        background: rgba(0, 0, 0, 0.7);
                        color: white;
                        padding: 15px;
                        border-radius: 50%;
                        width: 80px;
                        height: 80px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.8rem;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                        backdrop-filter: blur(4px);
                        z-index: 15;
                    }
                    
                    .video-seek-feedback.forward {
                        right: 20%;
                        border: 2px solid rgba(76, 175, 80, 0.5);
                    }
                    
                    .video-seek-feedback.rewind {
                        left: 20%;
                        border: 2px solid rgba(33, 150, 243, 0.5);
                    }
                    
                    .video-seek-feedback.show {
                        opacity: 1;
                        animation: feedbackPulse 0.5s ease;
                    }
                    
                    @keyframes feedbackPulse {
                        0% { transform: translateY(-50%) scale(0.8); }
                        50% { transform: translateY(-50%) scale(1.1); }
                        100% { transform: translateY(-50%) scale(1); }
                    }
                `;
                document.head.appendChild(style);
            }
        } // Set content and styles based on direction
        const isForward = seconds > 0;
        feedback.innerHTML = `${Math.abs(seconds)}s`;

        // Update classes
        feedback.className = "video-seek-feedback";
        feedback.classList.add(isForward ? "forward" : "rewind");

        // Trigger animation
        setTimeout(() => {
            feedback.classList.add("show");
        }, 10);

        // Remove after delay
        setTimeout(() => {
            feedback.classList.remove("show");
        }, 800);
    }

    /**
     * Show visual feedback for volume changes
     * @param {number} volume - Current volume (0-1)
     */
    showVolumeFeedback(volume) {
        // Create volume feedback element if it doesn't exist
        let feedback = document.querySelector(".video-volume-feedback");
        if (!feedback) {
            feedback = document.createElement("div");
            feedback.className = "video-volume-feedback";

            // Add to video container
            const videoContainer = document.querySelector(".video-player");
            if (videoContainer) {
                videoContainer.appendChild(feedback);
            } else {
                return; // Exit if container doesn't exist
            }

            // Add CSS if not already added
            if (!document.getElementById("volume-feedback-styles")) {
                const style = document.createElement("style");
                style.id = "volume-feedback-styles";
                style.textContent = `
                    .video-volume-feedback {
                        position: absolute;
                        top: 20%;
                        right: 10%;
                        background: rgba(0, 0, 0, 0.7);
                        color: white;
                        padding: 12px;
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                        backdrop-filter: blur(4px);
                        z-index: 15;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }
                    
                    .video-volume-feedback.show {
                        opacity: 1;
                    }
                    
                    .volume-icon {
                        margin-right: 10px;
                        font-size: 1.2rem;
                    }
                    
                    .volume-bar {
                        width: 100px;
                        height: 6px;
                        background: rgba(255, 255, 255, 0.3);
                        border-radius: 3px;
                        overflow: hidden;
                        position: relative;
                    }
                    
                    .volume-level {
                        position: absolute;
                        left: 0;
                        top: 0;
                        height: 100%;
                        background: linear-gradient(90deg, #4caf50, #8bc34a);
                        border-radius: 3px;
                        transition: width 0.2s ease;
                    }
                `;
                document.head.appendChild(style);
            }
        } // Set content based on volume
        const volumePercent = Math.round(volume * 100);

        // Determine volume icon based on level
        let icon;
        if (volume === 0) {
            icon = "🔇"; // Muted
        } else if (volume < 0.5) {
            icon = "🔉"; // Low volume
        } else {
            icon = "🔊"; // High volume
        }

        feedback.innerHTML = `
            <span class="volume-icon">${icon}</span>
            <div class="volume-bar">
                <div class="volume-level" style="width: ${volumePercent}%"></div>
            </div>
        `;

        // Show the feedback
        feedback.classList.add("show");

        // Hide after delay
        clearTimeout(this.volumeFeedbackTimer);
        this.volumeFeedbackTimer = setTimeout(() => {
            feedback.classList.remove("show");
        }, 1500);
    }

    /**
     * Show mute/unmute feedback
     * @param {boolean} isMuted - Whether the video is muted
     */
    showMuteFeedback(isMuted) {
        // Create the volume feedback and then update it
        this.showVolumeFeedback(isMuted ? 0 : document.getElementById("main-video")?.volume || 0.5);
    }

    /**
     * Lấy danh mục/thể loại từ ID video
     * @param {string} videoId - ID của video cần kiểm tra
     * @returns {string} - Danh mục của video (cpu, ram, rom, etc.)
     */
    getCategoryFromVideoId(videoId) {
        if (!videoId) return null;

        // Kiểm tra ID để xác định danh mục
        if (videoId.startsWith("cpu-")) return "cpu";
        if (videoId.startsWith("ram-")) return "boNhoTrong"; // RAM thuộc Bộ nhớ trong
        if (videoId.startsWith("rom-")) return "boNhoTrong"; // ROM thuộc Bộ nhớ trong
        // Thêm prefix cho Bộ nhớ ngoài nếu có, ví dụ:
        // if (videoId.startsWith("hdd-")) return "boNhoNgoai";
        // if (videoId.startsWith("ssd-")) return "boNhoNgoai";

        // Nếu ID không có tiền tố rõ ràng, tìm kiếm trong dữ liệu
        for (const category in this.videoData) {
            if (this.videoData[category].some((video) => video.id === videoId)) {
                return category;
            }
        }

        // Không tìm thấy danh mục
        console.warn(`Category not found for video ID: ${videoId}`);
        return null;
    }
}

// Initialize video player when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const videoPlayer = new VideoPlayerController();

    // Expose to global scope for debugging
    window.videoPlayer = videoPlayer;
});

// Export for global use
window.VideoPlayerController = VideoPlayerController;
