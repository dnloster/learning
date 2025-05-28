// Custom Video Controls Controller
class CustomVideoControls {
    constructor() {
        this.video = document.getElementById('main-video');
        this.controls = document.getElementById('video-controls');
        this.progressBar = document.getElementById('progress-bar');
        this.progressFilled = document.getElementById('progress-filled');
        this.progressBuffer = document.getElementById('progress-buffer');
        this.progressHandle = document.getElementById('progress-handle');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.backwardBtn = document.getElementById('backward-btn');
        this.forwardBtn = document.getElementById('forward-btn');
        this.volumeBtn = document.getElementById('volume-btn');
        this.volumeRange = document.getElementById('volume-range');
        this.currentTimeSpan = document.getElementById('current-time');
        this.durationSpan = document.getElementById('duration');
        this.prevVideoBtn = document.getElementById('prev-video-btn');
        this.nextVideoBtn = document.getElementById('next-video-btn');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        
        this.isDragging = false;
        this.hideControlsTimer = null;
        
        this.init();
    }
    
    init() {
        if (!this.video) return;
        
        this.setupEventListeners();
        this.updateVolumeIcon();
        this.showControls();
        
        // Hide controls after 3 seconds of inactivity
        this.startHideTimer();
    }
    
    setupEventListeners() {
        // Video events
        this.video.addEventListener('loadedmetadata', () => this.updateDuration());
        this.video.addEventListener('timeupdate', () => this.updateProgress());
        this.video.addEventListener('progress', () => this.updateBuffered());
        this.video.addEventListener('play', () => this.updatePlayButton(false));
        this.video.addEventListener('pause', () => this.updatePlayButton(true));
        this.video.addEventListener('ended', () => this.onVideoEnded());
        this.video.addEventListener('volumechange', () => this.updateVolumeIcon());
        
        // Control button events
        this.playPauseBtn?.addEventListener('click', () => this.togglePlayPause());
        this.backwardBtn?.addEventListener('click', () => this.skipBackward());
        this.forwardBtn?.addEventListener('click', () => this.skipForward());
        this.volumeBtn?.addEventListener('click', () => this.toggleMute());
        this.volumeRange?.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.prevVideoBtn?.addEventListener('click', () => this.previousVideo());
        this.nextVideoBtn?.addEventListener('click', () => this.nextVideo());
        this.fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());
        
        // Progress bar events
        this.progressBar?.addEventListener('click', (e) => this.seekTo(e));
        this.progressHandle?.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());
        
        // Touch events for mobile
        this.progressHandle?.addEventListener('touchstart', (e) => this.startDrag(e));
        document.addEventListener('touchmove', (e) => this.drag(e));
        document.addEventListener('touchend', () => this.endDrag());
        
        // Show/hide controls
        this.video.addEventListener('mousemove', () => this.showControls());
        this.controls?.addEventListener('mousemove', () => this.showControls());
        this.video.addEventListener('mouseleave', () => this.startHideTimer());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    togglePlayPause() {
        if (this.video.paused) {
            this.video.play().catch(console.error);
        } else {
            this.video.pause();
        }
    }
    
    updatePlayButton(isPaused) {
        const icon = this.playPauseBtn?.querySelector('.icon');
        if (icon) {
            icon.textContent = isPaused ? '▶️' : '⏸️';
        }
    }
    
    skipBackward() {
        this.video.currentTime = Math.max(0, this.video.currentTime - 10);
        this.showControls();
    }
    
    skipForward() {
        this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 10);
        this.showControls();
    }
    
    toggleMute() {
        this.video.muted = !this.video.muted;
        this.volumeRange.value = this.video.muted ? 0 : this.video.volume * 100;
    }
    
    updateVolumeIcon() {
        const icon = this.volumeBtn?.querySelector('.icon');
        if (!icon) return;
        
        if (this.video.muted || this.video.volume === 0) {
            icon.textContent = '🔇';
        } else if (this.video.volume < 0.5) {
            icon.textContent = '🔉';
        } else {
            icon.textContent = '🔊';
        }
    }
    
    setVolume(value) {
        this.video.volume = value / 100;
        this.video.muted = false;
    }
    
    updateDuration() {
        if (this.durationSpan) {
            this.durationSpan.textContent = this.formatTime(this.video.duration);
        }
    }
    
    updateProgress() {
        if (!this.video.duration) return;
        
        const progress = (this.video.currentTime / this.video.duration) * 100;
        
        if (this.progressFilled) {
            this.progressFilled.style.width = `${progress}%`;
        }
        
        if (this.progressHandle) {
            this.progressHandle.style.left = `${progress}%`;
        }
        
        if (this.currentTimeSpan) {
            this.currentTimeSpan.textContent = this.formatTime(this.video.currentTime);
        }
    }
    
    updateBuffered() {
        if (!this.video.duration || !this.progressBuffer) return;
        
        const buffered = this.video.buffered;
        if (buffered.length > 0) {
            const bufferedEnd = buffered.end(buffered.length - 1);
            const bufferedPercent = (bufferedEnd / this.video.duration) * 100;
            this.progressBuffer.style.width = `${bufferedPercent}%`;
        }
    }
    
    seekTo(e) {
        if (!this.video.duration) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.video.currentTime = pos * this.video.duration;
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.showControls();
        e.preventDefault();
    }
    
    drag(e) {
        if (!this.isDragging || !this.video.duration) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        
        this.video.currentTime = pos * this.video.duration;
        e.preventDefault();
    }
    
    endDrag() {
        this.isDragging = false;
    }
    
    previousVideo() {
        // Dispatch custom event for video player controller
        window.dispatchEvent(new CustomEvent('previous-video'));
    }
    
    nextVideo() {
        // Dispatch custom event for video player controller
        window.dispatchEvent(new CustomEvent('next-video'));
    }
    
    onVideoEnded() {
        // Auto play next video
        this.nextVideo();
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.video.requestFullscreen().catch(console.error);
        } else {
            document.exitFullscreen().catch(console.error);
        }
    }
    
    showControls() {
        this.controls?.classList.add('visible');
        this.clearHideTimer();
        this.startHideTimer();
    }
    
    hideControls() {
        this.controls?.classList.remove('visible');
    }
    
    startHideTimer() {
        this.hideControlsTimer = setTimeout(() => {
            if (!this.video.paused) {
                this.hideControls();
            }
        }, 3000);
    }
    
    clearHideTimer() {
        if (this.hideControlsTimer) {
            clearTimeout(this.hideControlsTimer);
            this.hideControlsTimer = null;
        }
    }
    
    handleKeyboard(e) {
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.skipBackward();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.skipForward();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.video.volume = Math.min(1, this.video.volume + 0.1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.video.volume = Math.max(0, this.video.volume - 0.1);
                break;
            case 'KeyM':
                e.preventDefault();
                this.toggleMute();
                break;
            case 'KeyF':
                e.preventDefault();
                this.toggleFullscreen();
                break;
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Public methods for external control
    play() {
        return this.video.play();
    }
    
    pause() {
        this.video.pause();
    }
    
    setSource(src) {
        this.video.src = src;
    }
    
    getCurrentTime() {
        return this.video.currentTime;
    }
    
    getDuration() {
        return this.video.duration;
    }
    
    setCurrentTime(time) {
        this.video.currentTime = time;
    }
}

// Initialize custom video controls when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.customVideoControls = new CustomVideoControls();
    console.log('Custom video controls initialized');
});

export default CustomVideoControls;
