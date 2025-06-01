/**
 * Notes Manager - Quản lý ghi chú video
 * Cho phép người dùng tạo, xem, sửa, xóa ghi chú tại các thời điểm cụ thể trong video
 */

class NotesManager {
    constructor() {
        this.notes = [];
        this.currentVideoId = null;
        this.isModalOpen = false;
        this.isPanelOpen = false;
        this.editingNoteId = null;

        // Storage key
        this.storageKey = "video-notes";

        // Elements
        this.elements = {};

        // Initialize
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.loadNotes();
        this.updateUI();
    }

    bindElements() {
        // Modal elements
        this.elements.modal = document.getElementById("notes-modal");
        this.elements.modalClose = document.getElementById("notes-modal-close");
        this.elements.noteTitle = document.getElementById("note-title");
        this.elements.noteContent = document.getElementById("note-content");
        this.elements.noteTimestamp = document.getElementById("note-timestamp");
        this.elements.noteTimestampDisplay = document.getElementById("note-timestamp-display");
        this.elements.saveNote = document.getElementById("save-note");
        this.elements.cancelNote = document.getElementById("cancel-note");

        // Panel elements
        this.elements.panel = document.getElementById("notes-panel");
        this.elements.panelClose = document.getElementById("notes-panel-close");
        this.elements.notesList = document.getElementById("notes-list");
        this.elements.notesCount = document.getElementById("notes-count");
        this.elements.notesSearch = document.getElementById("notes-search");
        this.elements.exportNotes = document.getElementById("export-notes");
        this.elements.importNotes = document.getElementById("import-notes");
        this.elements.noNotes = document.getElementById("no-notes");

        // Control elements
        this.elements.notesBtn = document.getElementById("notes-btn");
        this.elements.notesIndicator = document.getElementById("notes-indicator");
        this.elements.progressBar = document.querySelector(".progress-bar-container");
        this.elements.video = document.getElementById("main-video");
    }

    bindEvents() {
        // Notes button click - open modal to create new note
        this.elements.notesBtn?.addEventListener("click", () => {
            this.openNoteModal();
        });

        // Modal events
        this.elements.modalClose?.addEventListener("click", () => {
            this.closeNoteModal();
        });

        this.elements.cancelNote?.addEventListener("click", () => {
            this.closeNoteModal();
        });

        this.elements.saveNote?.addEventListener("click", () => {
            this.saveNote();
        });

        // Panel events
        this.elements.panelClose?.addEventListener("click", () => {
            this.closeNotesPanel();
        });

        this.elements.notesSearch?.addEventListener("input", (e) => {
            this.filterNotes(e.target.value);
        });

        this.elements.exportNotes?.addEventListener("click", () => {
            this.exportNotes();
        });

        this.elements.importNotes?.addEventListener("click", () => {
            this.importNotes();
        });

        // Global events
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                if (this.isModalOpen) this.closeNoteModal();
                if (this.isPanelOpen) this.closeNotesPanel();
            }
        });

        // Click outside modal to close
        this.elements.modal?.addEventListener("click", (e) => {
            if (e.target === this.elements.modal) {
                this.closeNoteModal();
            }
        });

        // Video events
        this.elements.video?.addEventListener("loadedmetadata", () => {
            this.updateTimelineMarkers();
        });

        // Double-click on progress bar to add note (if implemented in video player)
        this.elements.progressBar?.addEventListener("dblclick", (e) => {
            const rect = this.elements.progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const percentage = clickX / width;
            const duration = this.elements.video?.duration || 0;
            const time = percentage * duration;

            if (!isNaN(time) && time >= 0) {
                this.openNoteModal(time);
            }
        });
    }

    // Main methods
    openNoteModal(timestamp = null) {
        const currentTime = timestamp !== null ? timestamp : this.elements.video?.currentTime || 0;

        this.elements.noteTimestamp.textContent = this.formatTime(currentTime);
        this.elements.noteTimestampDisplay.textContent = this.formatTime(currentTime);

        // Clear form for new note
        if (this.editingNoteId === null) {
            this.elements.noteTitle.value = "";
            this.elements.noteContent.value = "";
        }

        this.elements.modal.classList.add("show");
        this.isModalOpen = true;

        // Focus on title input
        setTimeout(() => {
            this.elements.noteTitle?.focus();
        }, 100);
    }

    closeNoteModal() {
        this.elements.modal?.classList.remove("show");
        this.isModalOpen = false;
        this.editingNoteId = null;

        // Clear form
        this.elements.noteTitle.value = "";
        this.elements.noteContent.value = "";
    }

    openNotesPanel() {
        this.elements.panel?.classList.add("show");
        this.isPanelOpen = true;
        this.renderNotesList();
    }

    closeNotesPanel() {
        this.elements.panel?.classList.remove("show");
        this.isPanelOpen = false;
    }

    toggleNotesPanel() {
        if (this.isPanelOpen) {
            this.closeNotesPanel();
        } else {
            this.openNotesPanel();
        }
    }

    saveNote() {
        const title = this.elements.noteTitle.value.trim();
        const content = this.elements.noteContent.value.trim();
        const timestampText = this.elements.noteTimestamp.textContent;
        const timestamp = this.parseTime(timestampText);

        if (!title && !content) {
            this.showMessage("Vui lòng nhập tiêu đề hoặc nội dung ghi chú", "error");
            return;
        }

        const note = {
            id: this.editingNoteId || this.generateId(),
            videoId: this.currentVideoId || "default",
            title: title || "Ghi chú không có tiêu đề",
            content: content,
            timestamp: timestamp,
            timestampText: timestampText,
            createdAt: this.editingNoteId
                ? this.findNoteById(this.editingNoteId)?.createdAt || new Date().toISOString()
                : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (this.editingNoteId) {
            // Update existing note
            const index = this.notes.findIndex((n) => n.id === this.editingNoteId);
            if (index !== -1) {
                this.notes[index] = note;
                this.showMessage("Ghi chú đã được cập nhật", "success");
            }
        } else {
            // Add new note
            this.notes.push(note);
            this.showMessage("Ghi chú đã được lưu", "success");
        }

        this.saveNotes();
        this.updateUI();
        this.closeNoteModal();
    }

    deleteNote(noteId) {
        if (confirm("Bạn có chắc chắn muốn xóa ghi chú này?")) {
            this.notes = this.notes.filter((note) => note.id !== noteId);
            this.saveNotes();
            this.updateUI();
            this.showMessage("Ghi chú đã được xóa", "success");
        }
    }

    editNote(noteId) {
        const note = this.findNoteById(noteId);
        if (!note) return;

        this.editingNoteId = noteId;
        this.elements.noteTitle.value = note.title;
        this.elements.noteContent.value = note.content;
        this.elements.noteTimestamp.textContent = note.timestampText;
        this.elements.noteTimestampDisplay.textContent = note.timestampText;

        this.openNoteModal();
    }

    jumpToNote(noteId) {
        const note = this.findNoteById(noteId);
        if (!note || !this.elements.video) return;

        this.elements.video.currentTime = note.timestamp;
        if (this.elements.video.paused) {
            this.elements.video.play();
        }

        // Highlight note briefly
        const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
        if (noteElement) {
            noteElement.classList.add("active");
            setTimeout(() => {
                noteElement.classList.remove("active");
            }, 2000);
        }

        this.showMessage(`Đã chuyển đến thời điểm: ${note.timestampText}`, "info");
    }

    // UI methods
    updateUI() {
        this.updateNotesCount();
        this.updateNotesIndicator();
        this.updateTimelineMarkers();
        this.renderNotesList();
    }

    updateNotesCount() {
        const count = this.getNotesForCurrentVideo().length;
        if (this.elements.notesCount) {
            this.elements.notesCount.textContent = `(${count})`;
        }
    }

    updateNotesIndicator() {
        const hasNotes = this.getNotesForCurrentVideo().length > 0;
        if (this.elements.notesIndicator) {
            this.elements.notesIndicator.style.display = hasNotes ? "inline" : "none";
        }

        // Add active class to notes button if there are notes
        if (hasNotes) {
            this.elements.notesBtn?.classList.add("notes-active");
        } else {
            this.elements.notesBtn?.classList.remove("notes-active");
        }
    }

    updateTimelineMarkers() {
        // Remove existing markers
        const existingMarkers = document.querySelectorAll(".notes-timeline-marker");
        existingMarkers.forEach((marker) => marker.remove());

        const notes = this.getNotesForCurrentVideo();
        const videoDuration = this.elements.video?.duration;

        if (!videoDuration || notes.length === 0) return;

        notes.forEach((note) => {
            const marker = this.createTimelineMarker(note, videoDuration);
            this.elements.progressBar?.appendChild(marker);
        });
    }

    createTimelineMarker(note, duration) {
        const marker = document.createElement("div");
        marker.className = "notes-timeline-marker";
        marker.dataset.noteId = note.id;
        marker.title = `${note.title} - ${note.timestampText}`;

        const percentage = (note.timestamp / duration) * 100;
        marker.style.left = `${percentage}%`;

        marker.addEventListener("click", (e) => {
            e.stopPropagation();
            this.jumpToNote(note.id);
        });

        return marker;
    }

    renderNotesList() {
        if (!this.elements.notesList) return;

        const notes = this.getNotesForCurrentVideo();

        if (notes.length === 0) {
            this.elements.noNotes.style.display = "block";
            this.elements.notesList.innerHTML = "";
            this.elements.notesList.appendChild(this.elements.noNotes);
            return;
        }

        this.elements.noNotes.style.display = "none";

        // Sort notes by timestamp
        notes.sort((a, b) => a.timestamp - b.timestamp);

        this.elements.notesList.innerHTML = notes.map((note) => this.createNoteItemHTML(note)).join("");

        // Bind events to note items
        this.bindNoteItemEvents();
    }

    createNoteItemHTML(note) {
        return `
            <div class="note-item" data-note-id="${note.id}">
                <div class="note-header">
                    <div class="note-title">${this.escapeHtml(note.title)}</div>
                    <div class="note-timestamp" data-timestamp="${note.timestamp}">
                        ${note.timestampText}
                    </div>
                </div>
                <div class="note-content">${this.escapeHtml(note.content)}</div>
                <div class="note-actions">
                    <button class="note-action-btn edit" data-note-id="${note.id}" title="Sửa">
                        ✏️
                    </button>
                    <button class="note-action-btn delete" data-note-id="${note.id}" title="Xóa">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }

    bindNoteItemEvents() {
        // Click on note to jump to timestamp
        document.querySelectorAll(".note-item").forEach((item) => {
            item.addEventListener("click", (e) => {
                if (e.target.classList.contains("note-action-btn")) return;
                const noteId = item.dataset.noteId;
                this.jumpToNote(noteId);
            });
        });

        // Click on timestamp to jump
        document.querySelectorAll(".note-timestamp").forEach((timestamp) => {
            timestamp.addEventListener("click", (e) => {
                e.stopPropagation();
                const time = parseFloat(timestamp.dataset.timestamp);
                if (this.elements.video && !isNaN(time)) {
                    this.elements.video.currentTime = time;
                }
            });
        });

        // Edit buttons
        document.querySelectorAll(".note-action-btn.edit").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const noteId = btn.dataset.noteId;
                this.editNote(noteId);
            });
        });

        // Delete buttons
        document.querySelectorAll(".note-action-btn.delete").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const noteId = btn.dataset.noteId;
                this.deleteNote(noteId);
            });
        });
    }

    filterNotes(searchTerm) {
        const notes = this.getNotesForCurrentVideo();
        const filteredNotes = notes.filter(
            (note) =>
                note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Re-render with filtered notes
        if (searchTerm.trim() === "") {
            this.renderNotesList();
        } else {
            this.renderFilteredNotes(filteredNotes);
        }
    }

    renderFilteredNotes(notes) {
        if (notes.length === 0) {
            this.elements.notesList.innerHTML = `
                <div class="no-notes">
                    <div class="no-notes-icon">🔍</div>
                    <div class="no-notes-text">Không tìm thấy ghi chú</div>
                    <div class="no-notes-hint">Thử từ khóa khác</div>
                </div>
            `;
            return;
        }

        notes.sort((a, b) => a.timestamp - b.timestamp);
        this.elements.notesList.innerHTML = notes.map((note) => this.createNoteItemHTML(note)).join("");
        this.bindNoteItemEvents();
    }

    // Export/Import methods
    exportNotes() {
        const notes = this.getNotesForCurrentVideo();
        if (notes.length === 0) {
            this.showMessage("Không có ghi chú để xuất", "warning");
            return;
        }

        const exportData = {
            videoId: this.currentVideoId,
            exportDate: new Date().toISOString(),
            notes: notes,
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `notes-${this.currentVideoId || "video"}-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage("Ghi chú đã được xuất", "success");
    }

    importNotes() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";

        input.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    if (importData.notes && Array.isArray(importData.notes)) {
                        // Remove existing notes for this video
                        this.notes = this.notes.filter((note) => note.videoId !== this.currentVideoId);

                        // Add imported notes
                        importData.notes.forEach((note) => {
                            note.videoId = this.currentVideoId; // Update to current video
                            note.id = this.generateId(); // Generate new IDs to avoid conflicts
                        });

                        this.notes.push(...importData.notes);
                        this.saveNotes();
                        this.updateUI();
                        this.showMessage(`Đã nhập ${importData.notes.length} ghi chú`, "success");
                    } else {
                        this.showMessage("File không đúng định dạng", "error");
                    }
                } catch (error) {
                    console.error("Error reading file:", error);
                    this.showMessage("Lỗi đọc file", "error");
                }
            };
            reader.readAsText(file);
        });

        input.click();
    }

    // Storage methods
    loadNotes() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            this.notes = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Error loading notes:", error);
            this.notes = [];
        }
    }

    saveNotes() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
        } catch (error) {
            console.error("Error saving notes:", error);
            this.showMessage("Lỗi lưu ghi chú", "error");
        }
    }

    // Utility methods
    getNotesForCurrentVideo() {
        return this.notes.filter((note) => note.videoId === (this.currentVideoId || "default"));
    }

    findNoteById(id) {
        return this.notes.find((note) => note.id === id);
    }

    generateId() {
        return "note_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }

    parseTime(timeStr) {
        const parts = timeStr.split(":");
        if (parts.length === 2) {
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else if (parts.length === 3) {
            return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        }
        return 0;
    }

    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    showMessage(message, type = "info") {
        // Create or get message container
        let messageContainer = document.getElementById("notes-message-container");
        if (!messageContainer) {
            messageContainer = document.createElement("div");
            messageContainer.id = "notes-message-container";
            messageContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
                pointer-events: none;
            `;
            document.body.appendChild(messageContainer);
        }
        const messageEl = document.createElement("div");

        // Get background color based on type
        let backgroundColor;
        switch (type) {
            case "error":
                backgroundColor = "#f44336";
                break;
            case "warning":
                backgroundColor = "#ff9800";
                break;
            case "success":
                backgroundColor = "#4caf50";
                break;
            default:
                backgroundColor = "#2196f3";
                break;
        }

        messageEl.style.cssText = `
            background: ${backgroundColor};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            pointer-events: auto;
            font-size: 14px;
            max-width: 300px;
        `;
        messageEl.textContent = message;

        messageContainer.appendChild(messageEl);

        // Animate in
        setTimeout(() => {
            messageEl.style.transform = "translateX(0)";
        }, 10);

        // Remove after delay
        setTimeout(() => {
            messageEl.style.transform = "translateX(100%)";
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    // Public API methods
    setCurrentVideo(videoId) {
        this.currentVideoId = videoId;
        this.updateUI();
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener("keydown", (e) => {
            // Ctrl/Cmd + N: New note
            if ((e.ctrlKey || e.metaKey) && e.key === "n" && !e.shiftKey) {
                e.preventDefault();
                this.openNoteModal();
            }

            // Ctrl/Cmd + Shift + N: Toggle notes panel
            if ((e.ctrlKey || e.metaKey) && e.key === "N" && e.shiftKey) {
                e.preventDefault();
                this.toggleNotesPanel();
            }
        });
    }
}

// Export for use in other modules
export default NotesManager;

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    if (typeof window.notesManager === "undefined") {
        window.notesManager = new NotesManager();
        window.notesManager.setupKeyboardShortcuts();
    }
});
