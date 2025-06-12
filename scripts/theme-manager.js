// Khởi tạo theme manager khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    window.themeManager = new ThemeManager();
});

class ThemeManager {
    constructor() {
        // Kiểm tra theme đã lưu hoặc thiết lập hệ thống
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        this.currentTheme = savedTheme || "dark"; // Default to dark theme
        this.init();

        // Lắng nghe thay đổi theme hệ thống
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
            if (!localStorage.getItem("theme")) {
                this.applyTheme(e.matches ? "dark" : "light");
            }
        });
    }

    init() {
        this.setupThemeToggle();
        this.applyTheme(this.currentTheme);
    }
    setupThemeToggle() {
        // Tạo nút toggle nếu chưa tồn tại
        let toggleBtn = document.getElementById("theme-toggle");
        if (!toggleBtn) {
            toggleBtn = document.createElement("button");
            toggleBtn.id = "theme-toggle";
            toggleBtn.className = "theme-toggle-btn";
            toggleBtn.innerHTML = `
                <div class="toggle-icons">                    <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="5"/>
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                    </svg>
                    <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                </div>
            `;
            toggleBtn.setAttribute("aria-label", "Chuyển đổi theme sáng/tối");
            toggleBtn.title = "Chuyển đổi theme sáng/tối (Ctrl + Shift + D)";
            document.body.appendChild(toggleBtn);
        }
        toggleBtn.addEventListener("click", () => {
            this.toggleTheme();
        });

        // Thêm phím tắt (Ctrl/Cmd + Shift + D)
        document.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "d") {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
    toggleTheme() {
        const newTheme = this.currentTheme === "dark" ? "light" : "dark";
        this.applyTheme(newTheme);
        this.currentTheme = newTheme;
        localStorage.setItem("theme", newTheme);

        this.showThemeChangeMessage(newTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        this.updateThemeIcon(theme);
    }
    updateThemeIcon(theme) {
        const toggleBtn = document.getElementById("theme-toggle");
        if (toggleBtn) {
            toggleBtn.title = `Chuyển sang giao diện ${theme === "dark" ? "sáng" : "tối"} (Ctrl + Shift + D)`;
        }
    }

    showThemeChangeMessage(theme) {
        const message = `Đã chuyển sang giao diện ${theme === "dark" ? "tối" : "sáng"}`;
        const messageDiv = document.createElement("div");
        messageDiv.className = "theme-message";
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.classList.add("show");
        }, 100);

        setTimeout(() => {
            messageDiv.classList.remove("show");
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 2000);
    }
}
