/**
 * Notes Manager - Quản lý ghi chú video
 * Cho phép người dùng tạo, xem, sửa, xóa ghi chú tại các thời điểm cụ thể trong video
 */

class NotesManager {
    constructor() {
        console.log("NotesManager: Constructor called");
        this.notes = [];
        this.currentVideoId = null;
        this.currentVideoTime = 0;
        this.isEditing = false;
        this.isNotesPanelOpen = false;
        this.editingIndex = -1;

        // Load notes from localStorage
        this.loadNotes();

        // Bind elements and events after DOM is loaded
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => {
                console.log("NotesManager: DOM loaded, binding elements");
                this.bindElements();
                this.bindEvents();
                this.startTimeUpdate();
            });
        } else {
            console.log("NotesManager: DOM already loaded, binding elements");
            this.bindElements();
            this.bindEvents();
            this.startTimeUpdate();
        }
    }

    bindElements() {
        console.log("NotesManager: Binding elements");

        // Note add button và modal elements
        this.noteAddBtn = document.getElementById("note-add-btn");
        this.notePanelToggle = document.getElementById("note-panel-toggle");
        this.notesModal = document.getElementById("notes-modal");
        this.notesModalClose = document.getElementById("notes-modal-close");
        this.cancelNote = document.getElementById("cancel-note");
        this.saveNoteBtn = document.getElementById("save-note"); // Đổi tên để tránh xung đột

        // Form elements
        this.noteTitle = document.getElementById("note-title");
        this.noteContentEditor = document.getElementById("note-content-editor");
        this.noteTimestamp = document.getElementById("note-timestamp");
        this.noteTimestampDisplay = document.getElementById("note-timestamp-display");
        this.currentNoteTime = document.getElementById("current-note-time");

        // Panel elements
        this.notesPanel = document.getElementById("notes-panel");
        this.notesPanelClose = document.getElementById("notes-panel-close");
        this.notesList = document.getElementById("notes-list");
        this.notesSearch = document.getElementById("notes-search");
        this.notesCount = document.getElementById("notes-count");
        this.noNotes = document.getElementById("no-notes");

        // Video element
        this.videoElement = document.getElementById("main-video");

        // Toolbar elements
        this.formatSelector = document.getElementById("format-selector");
        this.boldBtn = document.getElementById("bold-btn");
        this.italicBtn = document.getElementById("italic-btn");
        this.underlineBtn = document.getElementById("underline-btn");
        this.bulletListBtn = document.getElementById("bullet-list-btn");
        this.numberListBtn = document.getElementById("number-list-btn");

        // Export/Import buttons
        this.exportNotes = document.getElementById("export-notes");
        this.importNotes = document.getElementById("import-notes");

        console.log("NotesManager: Elements bound", {
            noteAddBtn: !!this.noteAddBtn,
            notesModal: !!this.notesModal,
            videoElement: !!this.videoElement,
            saveNoteBtn: !!this.saveNoteBtn, // Cập nhật log
        });
    }

    bindEvents() {
        console.log("NotesManager: Binding events");

        // Note add button - QUAN TRỌNG
        if (this.noteAddBtn) {
            console.log("NotesManager: Binding click event to note add button");
            this.noteAddBtn.addEventListener("click", (e) => {
                console.log("NotesManager: Note add button clicked!");
                e.preventDefault();
                this.openNoteModal();
            });
        } else {
            console.error("NotesManager: Note add button not found!");
        }

        // Modal close events
        if (this.notesModalClose) {
            this.notesModalClose.addEventListener("click", () => this.closeNoteModal());
        }

        if (this.cancelNote) {
            this.cancelNote.addEventListener("click", () => this.closeNoteModal());
        }

        // Save button - SỬA TÊN ELEMENT
        if (this.saveNoteBtn) {
            this.saveNoteBtn.addEventListener("click", () => this.handleSaveNote());
        }

        // Panel toggle
        if (this.notePanelToggle) {
            this.notePanelToggle.addEventListener("click", () => this.toggleNotesPanel());
        }

        // Panel close
        if (this.notesPanelClose) {
            this.notesPanelClose.addEventListener("click", () => this.closeNotesPanel());
        }

        // Search functionality
        if (this.notesSearch) {
            this.notesSearch.addEventListener("input", (e) => this.filterNotes(e.target.value));
        }

        // Rich text editor events
        this.bindRichTextEvents();

        // Export/Import events
        if (this.exportNotes) {
            this.exportNotes.addEventListener("click", () => this.exportNotesToFile());
        }

        if (this.importNotes) {
            this.importNotes.addEventListener("click", () => this.importNotesFromFile());
        }

        // Video events
        if (this.videoElement) {
            this.videoElement.addEventListener("timeupdate", () => {
                this.currentVideoTime = this.videoElement.currentTime;
            });
        }

        // Keyboard shortcuts
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.key === "n") {
                e.preventDefault();
                this.openNoteModal();
            }

            if (e.ctrlKey && e.shiftKey && e.key === "N") {
                e.preventDefault();
                this.toggleNotesPanel();
            }
        });

        // Click outside to close modal
        if (this.notesModal) {
            this.notesModal.addEventListener("click", (e) => {
                if (e.target === this.notesModal) {
                    this.closeNoteModal();
                }
            });
        }

        console.log("NotesManager: Events bound successfully");
    }

    openNoteModal() {
        console.log("NotesManager: Opening note modal");

        if (!this.notesModal) {
            console.error("NotesManager: Notes modal element not found!");
            return;
        }

        // Pause video nếu đang phát
        if (this.videoElement && !this.videoElement.paused) {
            console.log("NotesManager: Pausing video");
            this.videoElement.pause();
        }

        // Reset form
        this.resetForm();

        // Update timestamp
        this.updateTimestamp();

        // Show modal với animation
        this.notesModal.style.display = "flex";
        this.notesModal.style.opacity = "0";

        // Force reflow
        this.notesModal.offsetHeight;

        // Animate in
        this.notesModal.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        this.notesModal.style.opacity = "1";

        // Focus title input
        setTimeout(() => {
            if (this.noteTitle) {
                this.noteTitle.focus();
            }
        }, 100);

        console.log("NotesManager: Modal opened successfully");
    }

    closeNoteModal() {
        console.log("NotesManager: Closing note modal");

        if (!this.notesModal) return;

        // Animate out
        this.notesModal.style.opacity = "0";

        setTimeout(() => {
            this.notesModal.style.display = "none";
            this.resetForm();
        }, 300);

        console.log("NotesManager: Modal closed");
    }

    resetForm() {
        console.log("NotesManager: Resetting form");

        if (this.noteTitle) this.noteTitle.value = "";
        if (this.noteContentEditor) this.noteContentEditor.innerHTML = "";
        if (this.formatSelector) this.formatSelector.value = "normal";

        this.isEditing = false;
        this.editingIndex = -1;

        // Update save button text - SỬA TÊN ELEMENT
        if (this.saveNoteBtn) {
            this.saveNoteBtn.textContent = "Tạo ghi chú";
        }
    }

    updateTimestamp() {
        const currentTime = this.getCurrentTime();
        const formattedTime = this.formatTime(currentTime);

        console.log("NotesManager: Updating timestamp to", formattedTime);

        if (this.noteTimestamp) {
            this.noteTimestamp.textContent = formattedTime;
        }

        if (this.noteTimestampDisplay) {
            this.noteTimestampDisplay.textContent = formattedTime;
        }
    }

    getCurrentTime() {
        if (this.videoElement && !isNaN(this.videoElement.currentTime)) {
            return this.videoElement.currentTime;
        }
        return 0;
    }

    formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return "00:00";
        }

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    startTimeUpdate() {
        console.log("NotesManager: Starting time update");

        setInterval(() => {
            if (this.currentNoteTime && this.videoElement) {
                const formattedTime = this.formatTime(this.videoElement.currentTime || 0);
                this.currentNoteTime.textContent = formattedTime;
            }
        }, 1000);
    }

    // Thêm các phương thức khác...
    bindRichTextEvents() {
        // Rich text editor implementation
        console.log("NotesManager: Binding rich text events");
        // Implementation sẽ được thêm sau
    }

    /**
     * Tìm kiếm ghi chú
     */
    filterNotes(query) {
        console.log("NotesManager: Filtering notes with query:", query);

        if (!this.notesList) return;

        const filteredNotes =
            query.trim() === ""
                ? this.notes
                : this.notes.filter((note) => {
                      const searchText = `${note.title} ${this.stripHtmlTags(note.content)}`.toLowerCase();
                      return searchText.includes(query.toLowerCase());
                  });

        this.renderFilteredNotesList(filteredNotes);
    }

    /**
     * Render danh sách ghi chú đã lọc
     */
    renderFilteredNotesList(notes) {
        if (!this.notesList) return;

        if (notes.length === 0) {
            this.notesList.innerHTML = '<div class="no-notes">Không tìm thấy ghi chú nào</div>';
            return;
        }

        const notesHTML = notes
            .map((note, index) => {
                const originalIndex = this.notes.findIndex((n) => n.id === note.id);
                return `
                <div class="note-item" data-index="${originalIndex}">
                    <div class="note-header">
                        <div class="note-title">${note.title}</div>
                        <div class="note-time">${this.formatTime(note.timestamp)}</div>
                    </div>
                    <div class="note-content">${this.stripHtmlTags(note.content).substring(0, 100)}...</div>
                    <div class="note-actions">
                        <button class="note-action-btn edit-note" data-index="${originalIndex}">Sửa</button>
                        <button class="note-action-btn delete-note" data-index="${originalIndex}">Xóa</button>
                        <button class="note-action-btn goto-note" data-index="${originalIndex}">Đến thời điểm</button>
                    </div>
                </div>
            `;
            })
            .join("");

        this.notesList.innerHTML = notesHTML;

        // Bind events cho note actions
        this.bindNoteActionEvents();
    }

    /**
     * Toggle notes panel
     */

    handleClickOutsideNotesPanel(event) {
        if (!this.notesPanel || !this.notePanelToggle) return;

        const isClickInsidePanel = this.notesPanel.contains(event.target);
        const isClickOnToggleButton = this.notePanelToggle.contains(event.target);

        if (this.isNotesPanelOpen && !isClickInsidePanel && !isClickOnToggleButton) {
            this.toggleNotesPanel(false); // Truyền false để đóng panel
        }
    }

    toggleNotesPanel(forceState) {
        if (!this.notesPanel || !this.notePanelToggle) {
            console.error("Notes panel or toggle button not found for toggling.");
            return;
        }

        const shouldOpen =
            typeof forceState === "boolean"
                ? forceState
                : this.notesPanel.style.display === "none" || this.notesPanel.style.transform === "translateX(100%)";

        if (shouldOpen) {
            this.notesPanel.style.display = "flex"; // Đảm bảo display là flex trước khi transform
            requestAnimationFrame(() => {
                // Cho phép trình duyệt render display:flex trước khi transform
                this.notesPanel.style.transform = "translateX(0)";
            });
            this.notePanelToggle.classList.add("active");
            this.isNotesPanelOpen = true;
            // Thêm event listener khi panel mở
            // Sử dụng capture phase để bắt sự kiện sớm hơn, nhưng ở đây dùng bubbling phase là đủ
            document.addEventListener("click", this.handleClickOutsideNotesPanel.bind(this), {
                capture: true,
                once: false,
            });
            this.loadNotesIntoPanel(); // Tải lại ghi chú mỗi khi mở panel
        } else {
            this.notesPanel.style.transform = "translateX(100%)";
            this.notePanelToggle.classList.remove("active");
            this.isNotesPanelOpen = false;
            // Gỡ bỏ event listener khi panel đóng
            document.removeEventListener("click", this.handleClickOutsideNotesPanel.bind(this), { capture: true });
            // Cân nhắc việc không clear panel ở đây nếu muốn giữ trạng thái tìm kiếm/scroll
            // this.notesPanelBody.innerHTML = '<div class="no-notes" id="no-notes">...</div>'; // Hoặc cách khác để reset
        }
    }

    /**
     * Mở notes panel với animation
     */
    openNotesPanel() {
        console.log("NotesManager: Opening notes panel");

        if (!this.notesPanel) {
            console.error("NotesManager: Notes panel not found");
            return;
        }

        // Hiển thị panel
        this.notesPanel.style.display = "block";

        // Thêm class active cho toggle button
        if (this.notePanelToggle) {
            this.notePanelToggle.classList.add("active");
        }

        // Force reflow để animation hoạt động
        this.notesPanel.offsetHeight;

        // Cập nhật danh sách notes
        this.updateNotesDisplay();
        this.renderNotesList();

        // Focus vào search box
        setTimeout(() => {
            if (this.notesSearch) {
                this.notesSearch.focus();
            }
        }, 300);
    }

    /**
     * Đóng notes panel với animation
     */
    closeNotesPanel() {
        console.log("NotesManager: Closing notes panel");

        if (!this.notesPanel) return;

        // Thêm class để animate
        this.notesPanel.style.transform = "translateX(100%)";

        // Remove active class từ toggle button
        if (this.notePanelToggle) {
            this.notePanelToggle.classList.remove("active");
        }

        // Đợi animation hoàn thành
        setTimeout(() => {
            this.notesPanel.style.display = "none";
            this.notesPanel.style.transform = "";
        }, 300);
    }

    handleSaveNote() {
        console.log("NotesManager: Handling save note");

        // Lấy dữ liệu từ form
        const title = this.noteTitle ? this.noteTitle.value.trim() : "";
        const content = this.noteContentEditor ? this.noteContentEditor.innerHTML.trim() : "";
        const currentTime = this.getCurrentTime();
        const videoId = this.getCurrentVideoId();

        // Validate dữ liệu
        if (!content) {
            alert("Vui lòng nhập nội dung ghi chú");
            return;
        }

        // Tạo object note
        const note = {
            id: this.isEditing ? this.notes[this.editingIndex].id : Date.now(),
            videoId: videoId,
            title: title || `Ghi chú tại ${this.formatTime(currentTime)}`,
            content: content,
            timestamp: currentTime,
            createdAt: this.isEditing ? this.notes[this.editingIndex].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Thêm hoặc cập nhật note
        if (this.isEditing) {
            this.notes[this.editingIndex] = note;
            console.log("NotesManager: Note updated", note);
        } else {
            this.notes.push(note);
            console.log("NotesManager: Note created", note);
        }

        // Lưu vào localStorage
        this.saveNotesToStorage();

        // Cập nhật UI
        this.updateNotesDisplay();

        // Đóng modal
        this.closeNoteModal();

        // Hiển thị thông báo thành công
        this.showNotification(this.isEditing ? "Ghi chú đã được cập nhật" : "Ghi chú đã được tạo");
    }

    /**
     * Tải ghi chú từ localStorage
     */
    loadNotes() {
        console.log("NotesManager: Loading notes from localStorage");

        try {
            const savedNotes = localStorage.getItem("video-notes");

            if (savedNotes) {
                this.notes = JSON.parse(savedNotes);
                console.log(`NotesManager: Loaded ${this.notes.length} notes from storage`);

                // Validate và làm sạch dữ liệu nếu cần
                this.notes = this.notes.filter((note) => {
                    return (
                        note && note.id && note.content && typeof note.timestamp === "number" && !isNaN(note.timestamp)
                    );
                });

                // Sắp xếp notes theo timestamp
                this.notes.sort((a, b) => a.timestamp - b.timestamp);

                console.log(`NotesManager: ${this.notes.length} valid notes after cleanup`);
            } else {
                console.log("NotesManager: No saved notes found, starting with empty array");
                this.notes = [];
            }
        } catch (error) {
            console.error("NotesManager: Error loading notes from storage", error);
            this.notes = [];

            // Thông báo lỗi cho người dùng
            this.showNotification("Có lỗi khi tải ghi chú đã lưu", "error");
        }
    }

    /**
     * Lưu ghi chú vào localStorage
     */
    saveNotesToStorage() {
        console.log("NotesManager: Saving notes to localStorage");

        try {
            // Validate dữ liệu trước khi lưu
            const validNotes = this.notes.filter((note) => {
                return note && note.id && note.content && typeof note.timestamp === "number" && !isNaN(note.timestamp);
            });

            if (validNotes.length !== this.notes.length) {
                console.warn(`NotesManager: Filtered out ${this.notes.length - validNotes.length} invalid notes`);
                this.notes = validNotes;
            }

            // Sắp xếp theo timestamp trước khi lưu
            this.notes.sort((a, b) => a.timestamp - b.timestamp);

            localStorage.setItem("video-notes", JSON.stringify(this.notes));
            console.log(`NotesManager: Successfully saved ${this.notes.length} notes to storage`);
        } catch (error) {
            console.error("NotesManager: Error saving notes to storage", error);

            // Thông báo lỗi cho người dùng
            this.showNotification("Có lỗi khi lưu ghi chú", "error");
        }
    }

    /**
     * Thêm ghi chú mẫu để test
     */
    addSampleNotes() {
        console.log("NotesManager: Adding sample notes for testing");

        const sampleNotes = [
            {
                id: Date.now() - 3000,
                videoId: "default-video",
                title: "Giới thiệu khóa học",
                content: "Đây là phần giới thiệu về nội dung khóa học và mục tiêu học tập.",
                timestamp: 15,
                createdAt: new Date(Date.now() - 3000).toISOString(),
                updatedAt: new Date(Date.now() - 3000).toISOString(),
            },
            {
                id: Date.now() - 2000,
                videoId: "default-video",
                title: "Khái niệm cơ bản",
                content:
                    "<strong>Điểm quan trọng:</strong> Cần nắm vững những khái niệm cơ bản này để hiểu các phần sau.",
                timestamp: 120,
                createdAt: new Date(Date.now() - 2000).toISOString(),
                updatedAt: new Date(Date.now() - 2000).toISOString(),
            },
            {
                id: Date.now() - 1000,
                videoId: "default-video",
                title: "Ví dụ thực tế",
                content:
                    "Ví dụ này minh họa cách áp dụng lý thuyết vào thực tế.<br><ul><li>Bước 1: Phân tích</li><li>Bước 2: Thực hiện</li></ul>",
                timestamp: 300,
                createdAt: new Date(Date.now() - 1000).toISOString(),
                updatedAt: new Date(Date.now() - 1000).toISOString(),
            },
        ];

        // Thêm sample notes vào mảng hiện tại
        this.notes = [...this.notes, ...sampleNotes];

        // Lưu vào storage
        this.saveNotesToStorage();

        // Cập nhật UI
        this.updateNotesDisplay();

        this.showNotification(`Đã thêm ${sampleNotes.length} ghi chú mẫu`);

        return sampleNotes;
    }

    /**
     * Xóa tất cả ghi chú
     */
    clearAllNotes() {
        console.log("NotesManager: Clearing all notes");

        if (this.notes.length === 0) {
            this.showNotification("Không có ghi chú nào để xóa");
            return;
        }

        if (confirm(`Bạn có chắc chắn muốn xóa tất cả ${this.notes.length} ghi chú?`)) {
            this.notes = [];
            this.saveNotesToStorage();
            this.updateNotesDisplay();
            this.showNotification("Đã xóa tất cả ghi chú");
        }
    }

    /**
     * Lấy ghi chú theo video ID
     */
    getNotesByVideoId(videoId) {
        if (!videoId) {
            videoId = this.getCurrentVideoId();
        }

        return this.notes.filter((note) => note.videoId === videoId);
    }

    /**
     * Lấy ghi chú trong khoảng thời gian
     */
    getNotesInTimeRange(startTime, endTime, videoId = null) {
        const videoNotes = videoId ? this.getNotesByVideoId(videoId) : this.notes;

        return videoNotes.filter((note) => note.timestamp >= startTime && note.timestamp <= endTime);
    }

    /**
     * Tìm ghi chú gần nhất với thời điểm hiện tại
     */
    findNearestNote(currentTime = null, videoId = null) {
        if (currentTime === null) {
            currentTime = this.getCurrentTime();
        }

        const videoNotes = videoId ? this.getNotesByVideoId(videoId) : this.notes;

        if (videoNotes.length === 0) return null;

        // Tìm note gần nhất (có thể trước hoặc sau thời điểm hiện tại)
        let nearestNote = videoNotes[0];
        let minDistance = Math.abs(nearestNote.timestamp - currentTime);

        for (let note of videoNotes) {
            const distance = Math.abs(note.timestamp - currentTime);
            if (distance < minDistance) {
                minDistance = distance;
                nearestNote = note;
            }
        }

        return {
            note: nearestNote,
            distance: minDistance,
        };
    }

    /**
     * Export ghi chú ra file JSON
     */
    exportNotesToFile() {
        console.log("NotesManager: Exporting notes to file");

        if (this.notes.length === 0) {
            this.showNotification("Không có ghi chú nào để xuất");
            return;
        }

        try {
            const dataStr = JSON.stringify(this.notes, null, 2);
            const dataBlob = new Blob([dataStr], { type: "application/json" });

            const link = document.createElement("a");
            link.href = URL.createObjectURL(dataBlob);
            link.download = `video-notes-${new Date().toISOString().split("T")[0]}.json`;

            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Cleanup
            URL.revokeObjectURL(link.href);

            this.showNotification(`Đã xuất ${this.notes.length} ghi chú ra file`);
        } catch (error) {
            console.error("NotesManager: Error exporting notes", error);
            this.showNotification("Có lỗi khi xuất file", "error");
        }
    }

    /**
     * Import ghi chú từ file JSON
     */
    importNotesFromFile() {
        console.log("NotesManager: Importing notes from file");

        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";

        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const importedNotes = JSON.parse(e.target.result);

                    if (!Array.isArray(importedNotes)) {
                        throw new Error("File không đúng định dạng");
                    }

                    // Validate imported notes
                    const validNotes = importedNotes.filter((note) => {
                        return (
                            note &&
                            note.id &&
                            note.content &&
                            typeof note.timestamp === "number" &&
                            !isNaN(note.timestamp)
                        );
                    });

                    if (validNotes.length === 0) {
                        throw new Error("Không có ghi chú hợp lệ trong file");
                    }

                    // Hỏi người dùng có muốn thay thế hay thêm vào
                    const replace = confirm(
                        `Tìm thấy ${validNotes.length} ghi chú hợp lệ.\n` +
                            `Bấm OK để THAY THẾ tất cả ghi chú hiện tại.\n` +
                            `Bấm Cancel để THÊM VÀO ghi chú hiện tại.`
                    );

                    if (replace) {
                        this.notes = validNotes;
                    } else {
                        // Thêm vào và loại bỏ duplicate dựa trên ID
                        const existingIds = new Set(this.notes.map((note) => note.id));
                        const newNotes = validNotes.filter((note) => !existingIds.has(note.id));
                        this.notes = [...this.notes, ...newNotes];
                    }

                    // Sắp xếp theo timestamp
                    this.notes.sort((a, b) => a.timestamp - b.timestamp);

                    // Lưu và cập nhật UI
                    this.saveNotesToStorage();
                    this.updateNotesDisplay();

                    this.showNotification(
                        replace
                            ? `Đã thay thế bằng ${validNotes.length} ghi chú từ file`
                            : `Đã thêm ${validNotes.length - (importedNotes.length - validNotes.length)} ghi chú mới`
                    );
                } catch (error) {
                    console.error("NotesManager: Error importing notes", error);
                    this.showNotification(`Lỗi khi import file: ${error.message}`, "error");
                }
            };

            reader.readAsText(file);
        };

        input.click();
    }

    /**
     * Cập nhật thông báo với style khác nhau
     */
    showNotification(message, type = "success") {
        console.log(`NotesManager: Showing notification - ${type}: ${message}`);

        // Xóa notification cũ nếu có
        const existingNotification = document.querySelector(".note-notification");
        if (existingNotification) {
            existingNotification.remove();
        }

        // Tạo notification mới
        const notification = document.createElement("div");
        notification.className = "note-notification";
        notification.textContent = message;

        // Style theo type
        const styles = {
            success: {
                background: "#4caf50",
                color: "white",
            },
            error: {
                background: "#f44336",
                color: "white",
            },
            warning: {
                background: "#ff9800",
                color: "white",
            },
            info: {
                background: "#2196f3",
                color: "white",
            },
        };

        const style = styles[type] || styles.success;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${style.background};
            color: ${style.color};
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 10001;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: opacity 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    updateNotesDisplay() {
        // Cập nhật số lượng notes nếu có panel
        if (this.notesCount) {
            this.notesCount.textContent = `${this.notes.length} ghi chú`;
        }

        // Render lại danh sách notes nếu panel đang mở
        if (this.notesPanel && this.notesPanel.style.display !== "none") {
            this.renderNotesList();
        }
    }

    renderNotesList() {
        if (!this.notesList) return;

        if (this.notes.length === 0) {
            this.notesList.innerHTML = '<div class="no-notes">Chưa có ghi chú nào</div>';
            return;
        }

        const notesHTML = this.notes
            .map(
                (note, index) => `
            <div class="note-item" data-index="${index}">
                <div class="note-header">
                    <div class="note-title">${note.title}</div>
                    <div class="note-time">${this.formatTime(note.timestamp)}</div>
                </div>
                <div class="note-content">${this.stripHtmlTags(note.content).substring(0, 100)}...</div>
                <div class="note-actions">
                    <button class="note-action-btn edit-note" data-index="${index}">Sửa</button>
                    <button class="note-action-btn delete-note" data-index="${index}">Xóa</button>
                    <button class="note-action-btn goto-note" data-index="${index}">Đến thời điểm</button>
                </div>
            </div>
        `
            )
            .join("");

        this.notesList.innerHTML = notesHTML;

        // Bind events cho note actions
        this.bindNoteActionEvents();
    }

    stripHtmlTags(html) {
        const temp = document.createElement("div");
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || "";
    }

    bindNoteActionEvents() {
        const editBtns = document.querySelectorAll(".edit-note");
        const deleteBtns = document.querySelectorAll(".delete-note");
        const gotoBtns = document.querySelectorAll(".goto-note");

        editBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.target.dataset.index);
                this.editNote(index);
            });
        });

        deleteBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.target.dataset.index);
                this.deleteNote(index);
            });
        });

        gotoBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.target.dataset.index);
                this.gotoNoteTime(index);
            });
        });
    }

    editNote(index) {
        if (index < 0 || index >= this.notes.length) return;

        const note = this.notes[index];

        this.isEditing = true;
        this.editingIndex = index;

        // Mở modal và điền dữ liệu
        this.openNoteModal();

        setTimeout(() => {
            if (this.noteTitle) this.noteTitle.value = note.title;
            if (this.noteContentEditor) this.noteContentEditor.innerHTML = note.content;
            if (this.saveNoteBtn) this.saveNoteBtn.textContent = "Cập nhật ghi chú";
        }, 100);
    }

    deleteNote(index) {
        if (index < 0 || index >= this.notes.length) return;

        if (confirm("Bạn có chắc chắn muốn xóa ghi chú này?")) {
            this.notes.splice(index, 1);
            this.saveNotesToStorage();
            this.updateNotesDisplay();
            this.showNotification("Ghi chú đã được xóa");
        }
    }

    gotoNoteTime(index) {
        if (index < 0 || index >= this.notes.length) return;

        const note = this.notes[index];

        if (this.videoElement) {
            this.videoElement.currentTime = note.timestamp;
            if (this.videoElement.paused) {
                this.videoElement.play();
            }
        }

        this.closeNotesPanel();
    }

    /**
     * Lấy ID của video hiện tại
     */
    getCurrentVideoId() {
        console.log("NotesManager: Getting current video ID");

        // Phương pháp 1: Lấy từ video player controller nếu có
        if (window.videoPlayer && window.videoPlayer.currentVideo) {
            const videoId = window.videoPlayer.currentVideo.id || window.videoPlayer.currentVideo.videoId;
            if (videoId) {
                console.log("NotesManager: Video ID from videoPlayer:", videoId);
                return videoId;
            }
        }

        // Phương pháp 2: Lấy từ video element data attribute
        if (this.videoElement) {
            const videoId =
                this.videoElement.dataset.videoId ||
                this.videoElement.dataset.id ||
                this.videoElement.getAttribute("data-video-id");
            if (videoId) {
                console.log("NotesManager: Video ID from video element:", videoId);
                return videoId;
            }
        }

        // Phương pháp 3: Lấy từ URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const videoIdFromUrl = urlParams.get("video") || urlParams.get("videoId") || urlParams.get("v");
        if (videoIdFromUrl) {
            console.log("NotesManager: Video ID from URL:", videoIdFromUrl);
            return videoIdFromUrl;
        }

        // Phương pháp 4: Lấy từ video source URL
        if (this.videoElement && this.videoElement.src) {
            const src = this.videoElement.src;
            // Tách tên file từ URL để làm ID
            const filename = src.split("/").pop().split(".")[0];
            if (filename && filename !== "blob") {
                console.log("NotesManager: Video ID from source filename:", filename);
                return filename;
            }
        }

        // Phương pháp 5: Lấy từ title hoặc meta data
        const titleElement = document.querySelector("title");
        if (titleElement && titleElement.textContent) {
            const title = titleElement.textContent.trim();
            // Tạo ID từ title (loại bỏ ký tự đặc biệt)
            const titleId = title
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, "")
                .replace(/\s+/g, "-")
                .substring(0, 50);
            if (titleId) {
                console.log("NotesManager: Video ID from page title:", titleId);
                return titleId;
            }
        }

        // Phương pháp 6: Lấy từ playlist controller nếu có
        if (window.playlistController && window.playlistController.currentVideo) {
            const videoId = window.playlistController.currentVideo.id || window.playlistController.currentVideo.videoId;
            if (videoId) {
                console.log("NotesManager: Video ID from playlist controller:", videoId);
                return videoId;
            }
        }

        // Phương pháp 7: Tạo ID từ timestamp để đảm bảo unique
        const timestamp = Date.now().toString();
        const fallbackId = `video-${timestamp}`;

        console.log("NotesManager: Using fallback video ID:", fallbackId);

        // Lưu fallback ID vào sessionStorage để consistency trong session
        if (!sessionStorage.getItem("current-video-id")) {
            sessionStorage.setItem("current-video-id", fallbackId);
        }

        return sessionStorage.getItem("current-video-id") || fallbackId;
    }

    /**
     * Đặt ID cho video hiện tại (có thể gọi từ bên ngoài)
     */
    setCurrentVideoId(videoId) {
        console.log("NotesManager: Setting current video ID to:", videoId);

        if (!videoId || typeof videoId !== "string") {
            console.error("NotesManager: Invalid video ID provided");
            return false;
        }

        // Lưu vào sessionStorage
        sessionStorage.setItem("current-video-id", videoId);

        // Cập nhật video element nếu có
        if (this.videoElement) {
            this.videoElement.dataset.videoId = videoId;
        }

        // Cập nhật currentVideoId property
        this.currentVideoId = videoId;

        console.log("NotesManager: Video ID set successfully");
        return true;
    }

    /**
     * Lấy metadata của video hiện tại
     */
    getCurrentVideoMetadata() {
        const videoId = this.getCurrentVideoId();
        const metadata = {
            id: videoId,
            duration: this.videoElement ? this.videoElement.duration : 0,
            currentTime: this.getCurrentTime(),
            title: document.title || "Untitled Video",
            url: window.location.href,
            timestamp: new Date().toISOString(),
        };

        // Thêm thông tin từ video element nếu có
        if (this.videoElement) {
            metadata.src = this.videoElement.src;
            metadata.videoWidth = this.videoElement.videoWidth;
            metadata.videoHeight = this.videoElement.videoHeight;
        }

        // Thêm thông tin từ video player nếu có
        if (window.videoPlayer && window.videoPlayer.currentVideo) {
            const currentVideo = window.videoPlayer.currentVideo;
            metadata.videoTitle = currentVideo.title || currentVideo.name;
            metadata.videoDescription = currentVideo.description;
            metadata.videoDuration = currentVideo.duration;
        }

        console.log("NotesManager: Current video metadata:", metadata);
        return metadata;
    }

    /**
     * Kiểm tra xem video có thay đổi không
     */
    checkVideoChange() {
        const newVideoId = this.getCurrentVideoId();

        if (this.currentVideoId && this.currentVideoId !== newVideoId) {
            console.log("NotesManager: Video changed from", this.currentVideoId, "to", newVideoId);

            // Trigger video change event
            this.onVideoChange(this.currentVideoId, newVideoId);
        }

        this.currentVideoId = newVideoId;
        return newVideoId;
    }

    /**
     * Xử lý khi video thay đổi
     */
    onVideoChange(oldVideoId, newVideoId) {
        console.log("NotesManager: Handling video change", { oldVideoId, newVideoId });

        // Cập nhật UI nếu notes panel đang mở
        if (this.notesPanel && this.notesPanel.style.display !== "none") {
            this.updateNotesDisplay();
        }

        // Có thể thêm logic khác khi video thay đổi
        // Ví dụ: lưu bookmark, cập nhật progress, etc.
    }

    /**
     * Lấy tất cả video IDs từ notes đã lưu
     */
    getAllVideoIds() {
        const videoIds = [...new Set(this.notes.map((note) => note.videoId))];
        console.log("NotesManager: All video IDs in notes:", videoIds);
        return videoIds;
    }

    /**
     * Thống kê notes theo video
     */
    getNotesStatsByVideo() {
        const stats = {};

        this.notes.forEach((note) => {
            const videoId = note.videoId || "unknown";
            if (!stats[videoId]) {
                stats[videoId] = {
                    count: 0,
                    totalDuration: 0,
                    firstNote: null,
                    lastNote: null,
                    notes: [],
                };
            }

            stats[videoId].count++;
            stats[videoId].notes.push(note);

            if (!stats[videoId].firstNote || note.timestamp < stats[videoId].firstNote.timestamp) {
                stats[videoId].firstNote = note;
            }

            if (!stats[videoId].lastNote || note.timestamp > stats[videoId].lastNote.timestamp) {
                stats[videoId].lastNote = note;
            }
        });

        // Tính duration cho mỗi video
        Object.keys(stats).forEach((videoId) => {
            const videoStats = stats[videoId];
            if (videoStats.firstNote && videoStats.lastNote) {
                videoStats.totalDuration = videoStats.lastNote.timestamp - videoStats.firstNote.timestamp;
            }
        });

        console.log("NotesManager: Notes statistics by video:", stats);
        return stats;
    }
}

// Khởi tạo Notes Manager
console.log("NotesManager: Creating instance");
const notesManager = new NotesManager();

// Export cho window object
window.notesManager = notesManager;

export default notesManager;
