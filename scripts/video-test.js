// Test script for video player functionality
console.log("Testing video player...");

// Test functions
window.testVideoPlayer = {
    // Test topic switching
    switchTopic: (topic) => {
        console.log(`Switching to topic: ${topic}`);
        const topicBtn = document.querySelector(`[data-topic="${topic}"]`);
        if (topicBtn) {
            topicBtn.click();
            console.log(`✓ Topic switched to ${topic}`);
        } else {
            console.error(`✗ Topic button not found: ${topic}`);
        }
    },

    // Test video selection
    selectVideo: (videoId) => {
        console.log(`Selecting video: ${videoId}`);
        const videoItem = document.querySelector(`[data-video="${videoId}"]`);
        if (videoItem) {
            videoItem.click();
            console.log(`✓ Video selected: ${videoId}`);
        } else {
            console.error(`✗ Video not found: ${videoId}`);
        }
    },

    // Test video controls
    testControls: () => {
        console.log("Testing video controls...");
        const controls = ["prev-video", "play-pause", "next-video"];
        controls.forEach((id) => {
            const btn = document.getElementById(id);
            if (btn) {
                console.log(`✓ Control found: ${id}`);
            } else {
                console.error(`✗ Control not found: ${id}`);
            }
        });
    },

    // Test complete workflow
    fullTest: () => {
        console.log("Running full test...");
        setTimeout(() => testVideoPlayer.switchTopic("cpu"), 500);
        setTimeout(() => testVideoPlayer.selectVideo("cpu-1"), 1000);
        setTimeout(() => testVideoPlayer.testControls(), 1500);
        setTimeout(() => testVideoPlayer.switchTopic("ram"), 2000);
        setTimeout(() => testVideoPlayer.selectVideo("ram-1"), 2500);
        setTimeout(() => console.log("✓ Full test completed!"), 3000);
    },
};

// Auto-run basic tests after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        console.log("Auto-testing video player initialization...");
        testVideoPlayer.testControls();
    }, 2000);
});
