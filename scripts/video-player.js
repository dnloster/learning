// Video Player Controller
class VideoPlayerController {
    constructor() {
        this.currentVideo = null;
        this.currentPlaylist = "cpu"; // Mặc định vẫn là CPU
        this.videoData = {
            cpu: [
                {
                    id: "cpu-1",
                    title: "1. Giới thiệu về CPU",
                    src: "videos/cpu-intro.mp4",
                    duration: "15:30",
                    chapters: [
                        { time: 0, title: "Giới thiệu" },
                        { time: 80, title: "Định nghĩa CPU" },
                        { time: 180, title: "Lịch sử phát triển" },
                        { time: 300, title: "Kiến trúc cơ bản" },
                        { time: 500, title: "Vai trò trong hệ thống" },
                        { time: 750, title: "Tổng kết" },
                    ],
                },
                {
                    id: "cpu-2",
                    title: "2. Kiến trúc CPU",
                    src: "videos/cpu-architecture.mp4",
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
                },
                {
                    id: "cpu-3",
                    title: "3. Bộ lệnh CPU",
                    src: "videos/cpu-instructions.mp4",
                    duration: "18:20",
                    chapters: [
                        { time: 0, title: "Tổng quan về bộ lệnh" },
                        { time: 100, title: "Các loại lệnh cơ bản" },
                        { time: 280, title: "Chu kỳ lệnh" },
                        { time: 500, title: "Pipeline" },
                        { time: 780, title: "Tối ưu hóa thực thi" },
                    ],
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
                },
            ],
            boNhoTrong: [
                // Danh mục mới: Bộ nhớ trong (RAM + ROM)
                {
                    // Videos từ RAM
                    id: "ram-1",
                    title: "1. Giới thiệu về RAM",
                    src: "videos/ram-intro.mp4",
                    duration: "12:30",
                    chapters: [
                        { time: 0, title: "Khái niệm RAM" },
                        { time: 90, title: "Vai trò của RAM" },
                        { time: 220, title: "So sánh các loại bộ nhớ" },
                        { time: 400, title: "Cách thức hoạt động" },
                        { time: 600, title: "Tổng kết" },
                    ],
                },
                {
                    id: "ram-2",
                    title: "2. Các loại RAM",
                    src: "videos/ram-types.mp4",
                    duration: "18:45",
                    chapters: [
                        { time: 0, title: "SRAM và DRAM" },
                        { time: 150, title: "DDR, DDR2, DDR3, DDR4, DDR5" },
                        { time: 300, title: "SDRAM vs RDRAM" },
                        { time: 600, title: "ECC Memory" },
                        { time: 800, title: "Tương lai của RAM" },
                    ],
                },
                {
                    id: "ram-3",
                    title: "3. Hiệu năng RAM",
                    src: "videos/ram-performance.mp4",
                    duration: "20:15",
                    chapters: [
                        { time: 0, title: "Các thông số hiệu năng" },
                        { time: 180, title: "Latency và timing" },
                        { time: 400, title: "Băng thông và tốc độ" },
                        { time: 700, title: "Dual-channel, Quad-channel" },
                        { time: 950, title: "Tối ưu hóa RAM" },
                    ],
                },
                {
                    id: "ram-4",
                    title: "4. Lắp đặt RAM",
                    src: "videos/ram-installation.mp4",
                    duration: "15:30",
                    chapters: [
                        { time: 0, title: "Chuẩn bị lắp đặt" },
                        { time: 120, title: "Quy trình lắp đặt" },
                        { time: 300, title: "Cấu hình BIOS/UEFI" },
                        { time: 500, title: "Kiểm tra sau lắp đặt" },
                        { time: 800, title: "Xử lý sự cố thường gặp" },
                    ],
                },
                {
                    // Videos từ ROM
                    id: "rom-1",
                    title: "5. Giới thiệu về ROM", // Đánh số lại title cho phù hợp
                    src: "videos/rom-intro.mp4",
                    duration: "10:20",
                    chapters: [
                        { time: 0, title: "Khái niệm ROM" },
                        { time: 90, title: "Đặc điểm và vai trò" },
                        { time: 200, title: "So sánh với RAM" },
                        { time: 350, title: "Ứng dụng của ROM" },
                        { time: 500, title: "Kết luận" },
                    ],
                },
                {
                    id: "rom-2",
                    title: "6. BIOS và UEFI", // Đánh số lại title
                    src: "videos/rom-bios.mp4",
                    duration: "16:40",
                    chapters: [
                        { time: 0, title: "Giới thiệu BIOS" },
                        { time: 150, title: "Chức năng của BIOS" },
                        { time: 300, title: "UEFI và sự khác biệt" },
                        { time: 500, title: "Cập nhật firmware" },
                        { time: 700, title: "Cấu hình và tùy chỉnh" },
                        { time: 900, title: "Tổng kết" },
                    ],
                },
                {
                    id: "rom-3",
                    title: "7. Các loại ROM", // Đánh số lại title
                    src: "videos/rom-types.mp4",
                    duration: "14:15",
                    chapters: [
                        { time: 0, title: "ROM truyền thống" },
                        { time: 120, title: "PROM và EPROM" },
                        { time: 250, title: "EEPROM và Flash ROM" },
                        { time: 400, title: "Mask ROM" },
                        { time: 600, title: "Xu hướng phát triển" },
                        { time: 780, title: "Kết luận" },
                    ],
                },
            ],
            boNhoNgoai: [
                // Danh mục: Bộ nhớ ngoài (Ổ cứng, SSD, USB,...)
                {
                    id: "hdd-1",
                    title: "1. Giới thiệu về ổ cứng HDD",
                    src: "videos/hdd-intro.mp4",
                    duration: "14:30",
                    chapters: [
                        { time: 0, title: "Khái niệm ổ cứng HDD" },
                        { time: 120, title: "Cấu tạo cơ bản" },
                        { time: 280, title: "Nguyên lý hoạt động" },
                        { time: 450, title: "Các thông số chính" },
                        { time: 650, title: "Ưu và nhược điểm" },
                        { time: 780, title: "Tổng kết" },
                    ],
                },
                {
                    id: "hdd-2",
                    title: "2. Cấu trúc và hoạt động của HDD",
                    src: "videos/hdd-structure.mp4",
                    duration: "18:15",
                    chapters: [
                        { time: 0, title: "Chi tiết cấu trúc vật lý" },
                        { time: 180, title: "Đĩa từ và đầu đọc" },
                        { time: 390, title: "Bộ điều khiển" },
                        { time: 600, title: "Quy trình đọc/ghi dữ liệu" },
                        { time: 850, title: "Công nghệ ghi từ hiện đại" },
                        { time: 1000, title: "Kết luận" },
                    ],
                },
                {
                    id: "ssd-1",
                    title: "3. Giới thiệu về ổ cứng SSD",
                    src: "videos/ssd-intro.mp4",
                    duration: "16:20",
                    chapters: [
                        { time: 0, title: "Khái niệm ổ SSD" },
                        { time: 150, title: "Lịch sử phát triển" },
                        { time: 300, title: "Cấu tạo cơ bản" },
                        { time: 480, title: "Nguyên lý hoạt động" },
                        { time: 720, title: "So sánh với HDD" },
                        { time: 900, title: "Kết luận" },
                    ],
                },
                {
                    id: "ssd-2",
                    title: "4. Công nghệ và hiệu năng SSD",
                    src: "videos/ssd-technology.mp4",
                    duration: "21:40",
                    chapters: [
                        { time: 0, title: "Các loại chip nhớ" },
                        { time: 200, title: "Giao tiếp SATA và NVMe" },
                        { time: 450, title: "Hiệu năng và benchmark" },
                        { time: 720, title: "Độ bền và tuổi thọ" },
                        { time: 950, title: "Công nghệ tối ưu" },
                        { time: 1150, title: "Xu hướng phát triển" },
                    ],
                },
                {
                    id: "usb-1",
                    title: "5. Thiết bị lưu trữ di động",
                    src: "videos/usb-storage.mp4",
                    duration: "15:10",
                    chapters: [
                        { time: 0, title: "Tổng quan về lưu trữ di động" },
                        { time: 120, title: "USB Flash Drive" },
                        { time: 300, title: "Thẻ nhớ (SD, microSD)" },
                        { time: 500, title: "Ổ cứng di động" },
                        { time: 700, title: "Tiêu chí lựa chọn" },
                        { time: 850, title: "Kết luận" },
                    ],
                },
                {
                    id: "cloud-1",
                    title: "6. Lưu trữ đám mây",
                    src: "videos/cloud-storage.mp4",
                    duration: "19:25",
                    chapters: [
                        { time: 0, title: "Khái niệm lưu trữ đám mây" },
                        { time: 180, title: "Các dịch vụ phổ biến" },
                        { time: 400, title: "Cơ chế đồng bộ hóa" },
                        { time: 650, title: "Bảo mật và riêng tư" },
                        { time: 900, title: "Ưu điểm và hạn chế" },
                        { time: 1050, title: "Tổng kết" },
                    ],
                },
                {
                    id: "raid-1",
                    title: "7. Công nghệ RAID",
                    src: "videos/raid-tech.mp4",
                    duration: "22:30",
                    chapters: [
                        { time: 0, title: "Khái niệm RAID" },
                        { time: 180, title: "Các cấp độ RAID phổ biến" },
                        { time: 450, title: "RAID 0, 1, 5, 10" },
                        { time: 780, title: "Hardware vs Software RAID" },
                        { time: 1100, title: "Thiết lập và quản lý" },
                        { time: 1250, title: "Kết luận" },
                    ],
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

        // Initialize bookmark count
        const bookmarkCountElement = document.getElementById("bookmark-count");
        if (bookmarkCountElement && this.bookmarks.length > 0) {
            bookmarkCountElement.textContent = this.bookmarks.length;
            bookmarkCountElement.classList.add("active");
        }
    }

    getChapterForVideo() {
        // Nếu không có video hiện tại, không làm gì cả
        if (!this.currentVideo || !this.currentVideo.id) {
            console.log("No current video to get chapters for");
            return [];
        }

        const videoId = this.currentVideo.id;
        console.log("Getting chapters for video:", videoId);

        // Tìm video trong các danh mục
        for (const category in this.videoData) {
            const video = this.videoData[category].find((v) => v.id === videoId);
            if (video && video.chapters) {
                console.log(`Found ${video.chapters.length} chapters for video ${videoId}`);

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

        console.log("No chapters found for video:", videoId);
        return [];
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
                console.log("Auto-loading first video:", firstVideo.title);
                this.playVideo(firstVideo.id, firstVideo.src);
            }
        }, 1000); // Delay to ensure all elements are loaded
    }

    waitForCustomControls() {
        const checkControls = () => {
            if (window.customVideoControls) {
                this.customControls = window.customVideoControls;
                console.log("Video player connected to custom controls"); // Video click handling is managed by custom-video-controls.js
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

        console.log("Custom controls integration setup complete");
    }

    setupEventListeners() {
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
        // (This will be handled in setupCustomControlsIntegration)

        // Video events
        const videoElement = document.getElementById("main-video");
        if (videoElement) {
            videoElement.addEventListener("ended", () => this.onVideoEnded());
        }
    }

    updateVideoLevels() {
        // Add appropriate classes to video level spans
        document.querySelectorAll(".video-level").forEach((span) => {
            const text = span.textContent.trim();
            span.classList.remove("level-basic", "level-intermediate", "level-advanced", "level-practical");

            switch (text) {
                case "Cơ bản":
                    span.classList.add("level-basic");
                    break;
                case "Trung bình":
                    span.classList.add("level-intermediate");
                    break;
                case "Nâng cao":
                    span.classList.add("level-advanced");
                    break;
                case "Thực hành":
                    span.classList.add("level-practical");
                    break;
            }
        });
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
            playlistProgressElement.textContent = `${progressData.completed}/${progressData.total} hoàn thành`;
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
        // Check if we actually have a new video to play
        if (this.currentVideo && this.currentVideo.id === videoId) {
            console.log("This video is already playing");
            return;
        }

        console.log("Playing video:", videoId, videoSrc);

        // Get the video element and find the video item in the current playlist
        const videoElement = document.getElementById("main-video");
        const videoItems = document.querySelectorAll(".video-item");
        const videoData = this.findVideoById(videoId);

        if (!videoElement || !videoData) return;

        // Add fade-out transition effect
        this.addVideoTransitionEffect(videoElement);

        // Pause the current video
        videoElement.pause();

        // Update the currentVideo reference
        this.currentVideo = videoData;

        // Update video source and play after a slight delay for transition effect
        setTimeout(() => {
            videoElement.src = videoSrc; // When metadata is loaded, play the video
            videoElement.onloadedmetadata = () => {
                // If custom controls are available, reset them
                if (this.customControls) {
                    console.log("VideoPlayer: Calling resetControls");
                    this.customControls.resetControls();

                    // Also explicitly call updateDuration
                    console.log("VideoPlayer: Calling updateDuration");
                    this.customControls.updateDuration();
                }

                // // Play the video
                // videoElement
                //     .play()
                //     .then(() => {
                //         console.log("Video playback started");
                //     })
                //     .catch((error) => {
                //         console.error("Error playing video:", error);
                //     });

                // Remove transition overlay after video starts playing
                this.removeVideoTransitionEffect(videoElement);
            };

            // Update play buttons and UI
            this.updatePlayingStatus(videoId, videoItems);

            // Track video progress
            this.trackVideoProgress(videoId); // Update the video levels display
            this.updateVideoLevels();

            // Show feedback that video is starting
            this.showPlayPauseFeedback();

            // Dispatch video change event for bookmark system
            this.dispatchVideoChangeEvent(videoData);

            // Cập nhật trạng thái bookmark
            if (window.bookmarkManager) {
                const isBookmarked = window.bookmarkManager.isVideoBookmarked(videoId);
                window.bookmarkManager.updateBookmarkUI(videoId, isBookmarked);
            }

            const chapters = this.getChapterForVideo();

            // Thông báo cho các thành phần khác về sự thay đổi video
            const videoChangedEvent = new CustomEvent("video-changed", {
                detail: {
                    id: videoId,
                    src: videoSrc,
                    title: this.findVideoById(videoId)?.title || "Unknown video",
                    topic: this.getCategoryFromVideoId(videoId),
                    duration: this.findVideoById(videoId)?.duration || 0,
                    chapters: chapters,
                },
            });
            window.dispatchEvent(videoChangedEvent);
        }, 400); // Short delay for transition effect
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
        console.log(`Tracking progress for video: ${videoId}`);
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
        console.log("Video change event dispatched:", videoData.title);
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
        console.log("Video ended, attempting to play next video");
        this.playNextVideo();
    }

    previousVideo() {
        const currentPlaylist = this.videoData[this.currentPlaylist];
        const currentIndex = currentPlaylist.findIndex((v) => v.id === this.currentVideo);

        if (currentIndex > 0) {
            const prevVideo = currentPlaylist[currentIndex - 1];
            this.playVideo(prevVideo.id, prevVideo.src);
        }
    }

    nextVideo() {
        const currentPlaylist = this.videoData[this.currentPlaylist];
        const currentIndex = currentPlaylist.findIndex((v) => v.id === this.currentVideo);

        if (currentIndex < currentPlaylist.length - 1) {
            const nextVideo = currentPlaylist[currentIndex + 1];
            this.playVideo(nextVideo.id, nextVideo.src);
        }
    }
    togglePlayPause() {
        const video = document.getElementById("main-video");
        if (!video) return;

        // Show visual feedback first
        this.showPlayPauseFeedback();

        if (video.paused) {
            video
                .play()
                .then(() => console.log("Video play initiated"))
                .catch((error) => console.error("Error playing video:", error));
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
            console.log("▶ Play feedback");
        } else {
            feedback.innerHTML = '<span class="feedback-icon pause">⏸</span>';
            console.log("⏸ Pause feedback");
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

    onVideoEnded() {
        // Mark video as completed
        const videoItem = document.querySelector(`[data-video="${this.currentVideo}"]`);
        if (videoItem) {
            const statusSpan = videoItem.querySelector(".video-status");
            statusSpan.textContent = "đã xem";
            statusSpan.classList.add("completed");
        }

        // Update progress
        this.updatePlaylistProgress(); // Auto play next video
        this.nextVideo();
    }

    updatePlaylistProgress() {
        const completedVideos = document.querySelectorAll(
            `#${this.currentPlaylist}-playlist .video-status.completed`
        ).length;
        this.progress[this.currentPlaylist].completed = completedVideos;

        const progress = this.progress[this.currentPlaylist];
        document.getElementById("playlist-progress").textContent = `${progress.completed}/${progress.total} hoàn thành`;
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
    console.log("Video player initialized successfully");
});

// Export for global use
window.VideoPlayerController = VideoPlayerController;
