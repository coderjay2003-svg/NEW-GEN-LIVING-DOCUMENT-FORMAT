# ◈ LDOC Studio — Android Mobile & Tablet Distribution

Official Android distribution suite for **LDOC Studio (.ldocx)** by **J AI ENTERPRISES**.

---

## 📦 What's Inside This Directory

| File | Size | Description |
|---|---|---|
| `LDOC-Studio.apk` | ~2.25 MB | Native Android APK with Hardware Acceleration & WebGL support |
| `setup-android.sh` | Shell script | 1-Click ADB sideload script for connected devices |

---

## 🚀 Installation Instructions

### Option 1: Direct APK Sideload (Easiest)
1. Download `LDOC-Studio.apk` directly onto your Android device (phone, tablet, Chromebook).
2. Open your **Files** or **Downloads** app and tap `LDOC-Studio.apk`.
3. If Android prompts *"For your security, your phone is not allowed to install unknown apps from this source"*, tap **Settings** and toggle **Allow from this source**.
4. Tap **Install** and open **LDOC Studio**.

### Option 2: 1-Click USB Installation via ADB
If you have a computer with `adb` installed:
1. Connect your Android phone/tablet to your computer via USB.
2. Enable **Developer Options** and **USB Debugging** on your device.
3. Run the installer script:
   ```bash
   chmod +x setup-android.sh
   ./setup-android.sh
   ```

### Option 3: Progressive Web App (PWA) Mode
If you prefer not to install an APK:
1. Open Chrome on Android and visit:
   [https://jayaraman2212066.github.io/LDOCX-FORMAT-PROJECT-MARK1/](https://jayaraman2212066.github.io/LDOCX-FORMAT-PROJECT-MARK1/)
2. Tap the Chrome three-dots menu **(⋮)**.
3. Tap **Add to Home screen** or **Install app**.
4. LDOC Studio will now run fullscreen with an offline app icon on your home screen.

---

## 🌟 Android Hardware & Features
- **GPU Acceleration:** OpenGL ES 3.0 / WebGL 2.0 discrete rendering enabled.
- **Offline Autonomy:** Complete document viewing and editing without internet connectivity.
- **S-Pen & Stylus:** Full capacitive touch, palm rejection, and drag-and-drop support.
- **File Association:** Open `.ldocx` packages directly from Google Drive, WhatsApp, or local storage.

---

© 2026 J AI ENTERPRISES. Distributed under the Apache-2.0 License.
