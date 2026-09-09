# LDOC Freemium Suite for Linux
**Developed by J-AI-ENTERPRISES**

Portable, offline packages for Linux desktop distributions (Ubuntu, Debian, Fedora, Arch, openSUSE).

---

## 📦 Available Packages

| Package | Format | Description |
|---|---|---|
| **`ldoc-viewer-linux.tar.gz`** | tar.gz / zip | Free Living Document reader with shell launcher & desktop entry |
| **`ldoc-editor-linux.tar.gz`** | tar.gz / zip | Free document editor & converter (.md, .txt, .csv) |
| **`ldoc-dev-sdk-linux.tar.gz`** | tar.gz / zip | Node.js SDK & POSIX `ldocx` command-line utility |
| **`setup-linux.sh`** | Bash Script | One-command installer into `~/.local/share` & `~/.local/bin` |

---

## 🚀 Quick Start

### Option A: Portable Execution (No Install)
```bash
tar -xzf ldoc-viewer-linux.tar.gz
cd ldoc-viewer-linux
./ldoc-viewer.sh [optional_document.ldocx]
```

### Option B: System Menu Installation
```bash
./install.sh
```
This adds LDOC Viewer and Editor to your system application launcher and registers `.ldocx` file associations.

### Option C: Unified Terminal Installer
```bash
bash setup-linux.sh
```
