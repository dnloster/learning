# Bài Giảng Điện Tử - Bộ Vi Xử Lý

## 📋 Mô tả dự án

Đây là một ứng dụng bài giảng điện tử tương tác về **Bộ Vi Xử Lý** (CPU, RAM, ROM) được phát triển cho Trường Cao Đẳng Kỹ Thuật Thông Tin.

## ✨ Tính năng chính

### 🏠 Trang chủ

-   **Giao diện loading** với animation và progress ring
-   **Banner chính** với hiệu ứng animated background
-   **Nút "XEM NỘI DUNG"** được thiết kế nổi bật với animation

### 🎥 Giao diện Video Learning

-   **Navigation theo chủ đề**: CPU (5 videos), RAM (4 videos), ROM (3 videos)
-   **Video player** với custom controls
-   **Playlist** chi tiết với thumbnail, thời lượng, mức độ khó
-   **Progress tracking** và trạng thái video (chưa xem/đã xem)
-   **Auto-play** video tiếp theo

### 🎮 Mô hình 3D tương tác

-   **Three.js integration** cho CPU, RAM, ROM models
-   **Tab navigation** giữa các mô hình
-   **Interactive controls**: Xoay, Phóng to, Reset
-   **Model information** chi tiết cho từng thành phần

## 🗂️ Cấu trúc dự án

```
├── index.html                 # File HTML chính
├── scripts/
│   ├── script.js             # JavaScript chính
│   ├── threejs-models.js     # Xử lý mô hình 3D
│   ├── video-player.js       # Điều khiển video player
│   ├── custom-video-controls.js   # YouTube-style controls
│   └── video-test.js         # Test scripts cho video
├── styles/
│   └── style.css             # CSS styling chính
├── videos/
│   ├── README.md             # Hướng dẫn video files
│   └── [video files]         # Các file video MP4
├── images/
│   ├── TCDKTTT.png          # Logo trường
│   └── video-placeholder.jpg # Placeholder cho thumbnails
├── model/
│   ├── cpu.glb              # Mô hình 3D CPU
│   ├── RAM.glb              # Mô hình 3D RAM
│   └── ROM.glb              # Mô hình 3D ROM
└── three.js-master/         # Thư viện Three.js
```

## 🚀 Cách sử dụng

### 1. Khởi chạy ứng dụng

-   Mở file `index.html` trong trình duyệt web
-   Chờ loading screen hoàn thành
-   Click nút "XEM NỘI DUNG" để vào giao diện học tập

### 2. Sử dụng Video Player

-   **Chọn chủ đề**: Click vào CPU, RAM, hoặc ROM
-   **Chọn video**: Click vào bất kỳ video nào trong playlist
-   **Điều khiển**: Sử dụng các nút Trước/Phát/Sau
-   **Theo dõi tiến độ**: Xem progress ở header playlist

### 3. Tương tác với mô hình 3D

-   **Chuyển đổi tab**: Click CPU, RAM, ROM
-   **Điều khiển mô hình**: Xoay, Phóng to, Reset
-   **Xem thông tin**: Đọc mô tả chi tiết bên cạnh mô hình

## 🔧 Cài đặt và Phát triển

### Yêu cầu hệ thống

-   Trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari)
-   Hỗ trợ ES6 modules
-   WebGL cho rendering 3D

### Testing

Mở Developer Console và sử dụng:

```javascript
// Test chuyển đổi chủ đề
testVideoPlayer.switchTopic("cpu");

// Test chọn video
testVideoPlayer.selectVideo("cpu-1");

// Test toàn bộ workflow
testVideoPlayer.fullTest();
```

### Debug 3D Models

```javascript
// Debug màu sắc mô hình
fixModelColors.debug();

// Phân tích mô hình
fixModelColors.analyze("cpu");

// Sửa màu đen
fixModelColors.fixBlack("cpu");
```

## 📹 Video Content

### CPU Videos (5 videos)

1. **Giới thiệu về CPU** (15:30) - Cơ bản
2. **Kiến trúc CPU** (22:45) - Trung bình
3. **Bộ lệnh CPU** (18:20) - Nâng cao
4. **Hiệu năng CPU** (25:10) - Nâng cao
5. **Thực hành với CPU** (30:15) - Thực hành

### RAM Videos (4 videos)

1. **Giới thiệu về RAM** (12:30) - Cơ bản
2. **Các loại RAM** (18:45) - Trung bình
3. **Hiệu năng RAM** (20:15) - Nâng cao
4. **Lắp đặt RAM** (15:30) - Thực hành

### ROM Videos (3 videos)

1. **Giới thiệu về ROM** (10:20) - Cơ bản
2. **BIOS và UEFI** (16:40) - Trung bình
3. **Các loại ROM** (14:15) - Nâng cao

## 🎨 Design Features

### Responsive Design

-   **Mobile-first approach**
-   **Flexible layouts** cho tablet và desktop
-   **Touch-friendly controls**

### Animation & Effects

-   **Gradient backgrounds** với shimmer effects
-   **Pulse animations** cho buttons
-   **Smooth transitions** giữa sections
-   **Loading animations** với progress indicators

### Color Scheme

-   **Primary**: Gradient blues và greens
-   **Accent**: Bright greens cho success states
-   **Background**: Dark blues cho modern look
-   **Text**: High contrast cho accessibility

## 🎯 MỚI CẬP NHẬT - Integration Status

### ✅ HOÀN THÀNH TẤT CẢ CÁC YÊU CẦU

#### 1. Sửa lỗi Three.js Implementation ✅

-   **Đã sửa**: Lỗi JavaScript syntax trong threejs-models.js
-   **Cải thiện**: Xử lý materials và màu sắc cho mô hình 3D
-   **Kết quả**: Mô hình 3D hiển thị chính xác không bị đen

#### 2. Loại bỏ phân loại mức độ video ✅

-   **Đã xóa**: Tất cả thẻ span với class "video-level"
-   **Phương pháp**: Sử dụng sed command để xóa khỏi HTML
-   **Lợi ích**: Giao diện sạch sẽ, tập trung vào nội dung video

#### 3. Custom Video Controls kiểu YouTube ✅

-   **Tính năng mới**: Giao diện điều khiển video tùy chỉnh hoàn toàn
-   **Thành phần**:
    -   Progress bar có thể kéo thả và hover effects
    -   Nút play/pause, tua lùi/tiến 10s
    -   Điều khiển âm lượng với slider dọc khi hover
    -   Nút previous/next video
    -   Nút fullscreen
    -   Hiển thị thời gian (hiện tại/tổng)
    -   Tự động ẩn controls sau 3 giây không hoạt động

#### 4. Layout 2 cột với Playlist bên phải ✅

-   **Thiết kế**: Đổi từ layout dọc sang grid 2 cột
-   **Video Player**: Bên trái (66.67% chiều rộng)
-   **Playlist**: Bên phải (33.33% chiều rộng) để quan sát dễ dàng
-   **Responsive**: Chuyển về 1 cột trên mobile (<768px)
-   **Sticky Playlist**: Cố định khi cuộn trang

#### 5. Ẩn video controls mặc định ✅

-   **CSS**: Ẩn hoàn toàn default browser controls
-   **JavaScript**: CustomVideoControls class thay thế
-   **Tương thích**: Hỗ trợ tất cả trình duyệt hiện đại

### 🎮 Tính năng điều khiển mới

#### Video Controls

-   **Play/Pause**: Click nút hoặc nhấn Space
-   **Skip**: ±10 giây bằng phím mũi tên hoặc nút
-   **Volume**: Hover vào nút âm lượng để hiện slider
-   **Seeking**: Click hoặc kéo trên progress bar
-   **Navigation**: Nút Previous/Next video
-   **Fullscreen**: Nút hoặc phím F

#### Keyboard Shortcuts

-   **Space**: Play/Pause
-   **Arrow Left/Right**: Tua lùi/tiến 10s
-   **Arrow Up/Down**: Tăng/giảm âm lượng
-   **M**: Mute/Unmute
-   **F**: Fullscreen

### 🏗️ Kiến trúc tích hợp

#### Tách biệt trách nhiệm

-   **CustomVideoControls**: Xử lý UI điều khiển video
-   **VideoPlayerController**: Quản lý playlist và chuyển đổi video
-   **Event-driven**: Giao tiếp qua custom events

#### File cấu trúc mới

```
├── scripts/
│   ├── custom-video-controls.js   # NEW: YouTube-style controls
│   ├── video-player.js           # Cập nhật: Tích hợp với custom controls
│   ├── threejs-models.js         # Sửa: Syntax errors và màu sắc
│   └── ...
├── test-integration.html         # NEW: Trang test tích hợp
└── ...
```

## 🔗 Dependencies

-   **Three.js**: 3D graphics rendering
-   **Google Fonts**: Roboto font family
-   **CSS3**: Modern styling with flexbox/grid
-   **ES6 Modules**: Modern JavaScript

## 📝 Notes

### Video Files

-   Đặt các file video MP4 vào thư mục `videos/`
-   Sử dụng naming convention: `{topic}-{number}.mp4`
-   Ví dụ: `cpu-intro.mp4`, `ram-types.mp4`

### 3D Models

-   Models ở định dạng GLB
-   Tối ưu cho web với texture compression
-   Support PBR materials

### Browser Compatibility

-   Chrome/Edge: Full support
-   Firefox: Full support
-   Safari: Full support (iOS 12+)
-   IE: Not supported

## 🆘 Troubleshooting

### Video không phát được

-   Kiểm tra file video tồn tại trong thư mục `videos/`
-   Đảm bảo định dạng MP4 được hỗ trợ
-   Kiểm tra browser console cho lỗi

### Mô hình 3D không hiển thị

-   Kiểm tra file GLB trong thư mục `model/`
-   Mở browser console để xem debug info
-   Sử dụng `fixModelColors.debug()` để troubleshoot

### Performance issues

-   Giảm chất lượng 3D models
-   Tối ưu video file size
-   Kiểm tra browser hardware acceleration

---

**Phát triển bởi**: KTMT - K6  
**Năm**: 2025  
**Trường**: Cao Đẳng Kỹ Thuật Thông Tin
