# LDOC Freemium Suite — iOS Installation & Usage Guide
**Developed by J-AI-ENTERPRISES**

Run the **LDOC Free Viewer** and **LDOC Free Editor** on **iPhone and iPad**.

---

## ⚡ Method 1: Instant Offline PWA (Recommended - Zero Installation)

1. Open **Safari** on your iPhone or iPad.
2. Browse to the offline viewer package or host it locally.
3. Tap the **Share Button** (box with upward arrow).
4. Tap **"Add to Home Screen"** (`[+]`).
5. Name it **LDOC Viewer** and tap **Add**.

### 📱 Features:
- **100% Offline Support**: Powered by Service Worker (`sw.js`).
- **Fullscreen App Mode**: Standalone UI without Safari navigation bars.
- **Interactive 3D Touch**: Native touch orbit and pinch-to-zoom for 3D atomic structures and widgets.

---

## 🛠️ Method 2: Native Swift Xcode Project (For Developers & Sideloading)

1. Extract `ldoc-ios-xcode-project.zip`.
2. Open `LDOCViewer` in **Xcode** on macOS.
3. Select your target (iPhone, iPad, or Simulator) and press **Run** (`⌘R`).
4. **iOS Files App Integration**:
   - The native app includes `UIDocumentPickerViewController`.
   - Tap **"📂 Open .ldocx"** to open documents directly from **iCloud Drive** or the **Files app**!
