/**
 * Accordion and side navigation functionality
 */
document.addEventListener("DOMContentLoaded", function () {
    // Accordion functionality
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach((header) => {
        header.addEventListener("click", () => {
            // Toggle active state for current accordion
            header.classList.toggle("active");
            const content = header.nextElementSibling;
            content.classList.toggle("active");

            // Update toggle icon
            const toggleIcon = header.querySelector(".accordion-toggle");
            if (header.classList.contains("active")) {
                toggleIcon.textContent = "▼";
            } else {
                toggleIcon.textContent = "▶";
            }

            // Get the topic for this accordion
            const topic = header.getAttribute("data-topic");

            // Update playlist title
            const playlistTitle = document.getElementById("playlist-title");
            if (playlistTitle) {
                playlistTitle.textContent = `Danh sách bài học - ${topic.toUpperCase()}`;
            }

            // Hide other accordion contents if they are open
            accordionHeaders.forEach((otherHeader) => {
                if (otherHeader !== header && otherHeader.classList.contains("active")) {
                    otherHeader.classList.remove("active");
                    otherHeader.nextElementSibling.classList.remove("active");
                    const otherToggle = otherHeader.querySelector(".accordion-toggle");
                    otherToggle.textContent = "▶";
                }
            });
        });
    });
    // Side navigation functionality
    const sideNavItems = document.querySelectorAll(".side-nav-item");

    sideNavItems.forEach((item) => {
        item.addEventListener("click", function (e) {
            // Handle the video content link specially
            if (this.id === "video-content-link") {
                e.preventDefault();

                // Remove active class from all items
                sideNavItems.forEach((navItem) => {
                    navItem.classList.remove("active");
                });

                // Add active class to clicked item
                this.classList.add("active");
            }
            // For other links that don't have .html extensions (which shouldn't exist now)
            else if (!this.getAttribute("href").includes(".html")) {
                e.preventDefault();

                // Remove active class from all items
                sideNavItems.forEach((navItem) => {
                    navItem.classList.remove("active");
                });

                // Add active class to clicked item
                this.classList.add("active");
            }
            // For links to other HTML pages, we'll let the browser handle the navigation
        });
    });
});
