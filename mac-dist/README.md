# LDOC Living Document Suite for macOS (MacBook / iMac / Mac mini)

Official native macOS packages and installer disk images for the Living Document Format (`.ldocx`), maintained by **J AI ENTERPRISES**.

---

## 📦 Packages & Downloads

| File | Type | Description |
| :--- | :--- | :--- |
| **`LDOC-Free-Suite.dmg`** | Apple Disk Image | Standard 1-click macOS drag-to-Applications installer disk image. |
| **`ldoc-viewer-macos.zip`** | Portable App Bundle | Standalone `LDOC Free Viewer.app` with hardware-accelerated WebGL 3D rendering. |
| **`ldoc-editor-macos.zip`** | Portable App Bundle | Standalone `LDOC Free Editor.app` with 2-tier dock, offline media uploaders, and horizontal element navigation. |
| **`ldoc-dev-sdk-macos.tar.gz`** / **`.zip`** | Developer CLI | CLI parser, schema validator, and SDK tools for macOS terminal. |
| **`setup-mac.sh`** | Terminal Installer | 1-command installation script for automated deployment. |

---

## 🚀 Installation Instructions

### Method 1: Using the `.dmg` Disk Image (Recommended)
1. Double-click **`LDOC-Free-Suite.dmg`** to mount the disk image.
2. In the Finder window that opens:
   - Drag **`LDOC Free Viewer.app`** into the **Applications** shortcut.
   - Drag **`LDOC Free Editor.app`** into the **Applications** shortcut.
3. Eject the disk image.
4. Launch the apps directly from **Launchpad** or **Spotlight** (`Cmd + Space`).

### Method 2: 1-Click Terminal Script
Open Terminal and run:
```bash
sh setup-mac.sh
```

---

## 🔒 Security & Gatekeeper Note
If macOS displays a notice indicating the app was downloaded from the internet:
1. Right-click (or `Control + click`) on the app in `/Applications`.
2. Select **Open**.
3. Click **Open** in the dialog to grant approval.
*(Alternatively, run `xattr -cr "/Applications/LDOC Free Viewer.app"` in Terminal).*

---

*© 2026 J AI ENTERPRISES. All Rights Reserved.*
