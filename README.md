# ✨ Lumina MD - WhatsApp Bot

<div align="center">
  <img src="https://raw.githubusercontent.com/hiuraaaaa/media/main/banner.jpg" alt="Furina MD Banner" width="500"/>
  
  [![GitHub](https://img.shields.io/badge/GitHub-RIJALGANZZZ-blue?style=for-the-badge&logo=github)](https://github.com/RIJALGANZZZ)
  [![WhatsApp](https://img.shields.io/badge/WhatsApp-Owner-green?style=for-the-badge&logo=whatsapp)](https://wa.me/18254873441)
  [![Website](https://img.shields.io/badge/Website-rijalganzz.web.id-orange?style=for-the-badge&logo=google-chrome)](https://rijalganzz.web.id)
  
  **Multi-Device WhatsApp Bot dengan Fitur Lengkap**
  
  [Features](#-features) • [Installation](#-installation) • [Configuration](#%EF%B8%8F-configuration) • [Usage](#-usage) • [Commands](#-commands) • [Support](#-support)
</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Configuration](#%EF%B8%8F-configuration)
- [Usage](#-usage)
- [Commands](#-commands)
- [Plugin System](#-plugin-system)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## ✨ Features

### 🤖 **AI & Automation**
- ✅ Multi-AI Integration (OpenAI, Gemini, dll)
- ✅ Auto-reply & Custom Commands
- ✅ Smart Context Detection
- ✅ Voice Note Recognition

### 📥 **Downloader**
- ✅ YouTube (Video/Audio)
- ✅ TikTok (No Watermark)
- ✅ Instagram (Post/Reels/Story)
- ✅ Facebook Video
- ✅ Twitter/X Media
- ✅ Spotify & SoundCloud

### 🎮 **Games & Fun**
- ✅ RPG System with Inventory
- ✅ Tebak Kata, Gambar, Lagu
- ✅ Truth or Dare
- ✅ Trivia & Quiz
- ✅ Mini Games Collection

### 🎨 **Maker & Tools**
- ✅ Sticker Maker (Static/Animated)
- ✅ Logo & Text Maker
- ✅ Image Editor (Filter, Crop, dll)
- ✅ PDF Tools
- ✅ Audio Converter

### 👥 **Group Management**
- ✅ Auto Welcome/Goodbye
- ✅ Admin Tools (Kick, Promote, Demote)
- ✅ Anti-Link & Anti-Spam
- ✅ Group Settings Manager
- ✅ Tag All & Hidetag

### 🔒 **Security & Performance**
- ✅ IP Whitelist Protection
- ✅ Anti-Crash System
- ✅ Auto-Restart on Error
- ✅ Database Backup
- ✅ Rate Limiting

### 💎 **Premium Features**
- ✅ Unlimited Usage
- ✅ Priority Support
- ✅ Exclusive Commands
- ✅ Custom Plugins

---

## 📦 Requirements

Sebelum menginstall, pastikan sistem Anda memiliki:

- **Node.js** v18.x atau lebih tinggi
- **npm** v9.x atau lebih tinggi
- **Git**
- **FFmpeg** (untuk media processing)
- **ImageMagick** (untuk sticker & image editing)

### Optional Dependencies

```bash
# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install -y git nodejs npm ffmpeg imagemagick

# Termux (Android)
pkg update && pkg upgrade
pkg install -y git nodejs ffmpeg imagemagick
```

---

## 🚀 Installation

### Method 1: Clone Repository

```bash
# Clone repository
git clone https://github.com/RIJALGANZZZ/Furina-MD.git
cd Furina-MD

# Install dependencies
npm install

# Start bot
npm start
```

### Method 2: One-Line Install

```bash
bash <(curl -s https://raw.githubusercontent.com/RIJALGANZZZ/Furina-MD/main/install.sh)
```

### Method 3: Termux (Android)

```bash
# Install Termux dari F-Droid atau Google Play
# Buka Termux, jalankan:

termux-setup-storage
pkg update && pkg upgrade
pkg install git nodejs
git clone https://github.com/RIJALGANZZZ/Furina-MD.git
cd Furina-MD
npm install
npm start
```

---

## ⚙️ Configuration

### 1. **Edit Config File**

Buka `config.js` dan sesuaikan:

```javascript
// Owner Information
global.owner = [
  ['18254873441'], // Nomor owner tanpa '+'
  ['18254873441', 'Rijalganzz Owner', true]
]

// Bot Information
global.namebot = 'Furina-Md'
global.author = 'Rijalganzz Owner'
global.packname = '© Furina-Md'
global.botNumber = '6283844926001' // Nomor bot

// Social Media Links
global.myweb = 'rijalganzz.web.id'
global.sig = 'https://github.com/RIJALGANZZZ'
global.sgh = 'https://github.com/RIJALGANZZZ'
global.sgc = 'rijalganzz.web.id'

// API Keys (Optional - untuk fitur tertentu)
global.skizo = "AnisaDevYae"
global.lann = "AnisaOfc"
global.btc = "AnisaDevYae"

// Database (pilih salah satu)
global.db = 'database.json' // Local JSON
// atau
global.db = 'mongodb://localhost:27017/furina-md' // MongoDB
```

### 2. **Pairing Code Setup**

```javascript
// Di config.js, set pairing code custom (8 karakter)
global.pairing = 'FURINAMD' // Bisa diganti sesuai keinginan
```

### 3. **Panel/Hosting Configuration** (Optional)

```javascript
// Panel Configuration (jika ada)
global.domain = 'https://panel-anda.com'
global.apikey = 'YOUR_PTERODACTYL_API_KEY'
global.capikey = 'YOUR_CLIENT_API_KEY'
```

---

## 🎯 Usage

### **First Run - Pairing Code**

```bash
npm start
```

Bot akan meminta nomor WhatsApp Anda:

```
Input nomor dengan kode negara (cth: +62xxx atau 628xx):
> 6281234567890

⏳ Generating pairing code...
✅ Pairing Code Kamu: ABCD-EFGH
```

**Cara Pairing:**
1. Buka WhatsApp di HP
2. Tap **⋮** (titik tiga) > **Linked Devices**
3. Tap **Link a Device**
4. Pilih **Link with phone number instead**
5. Masukkan nomor bot
6. Masukkan pairing code: `ABCD-EFGH`

### **Testing Bot**

Setelah tersambung, kirim pesan ke bot:

```
.ping
.menu
.owner
```

---

## 📱 Commands

### **Main Menu**

| Command | Description |
|---------|-------------|
| `.menu` | Menampilkan menu utama |
| `.allmenu` | Menampilkan semua commands |
| `.listmenu` | List menu berdasarkan kategori |
| `.ping` | Cek kecepatan respon bot |
| `.owner` | Info kontak owner |
| `.script` | Info script bot |

### **AI Menu** (`.menuai`)

| Command | Description |
|---------|-------------|
| `.ai <text>` | Chat dengan AI |
| `.gemini <text>` | AI menggunakan Gemini |
| `.gpt <text>` | ChatGPT integration |
| `.imagine <prompt>` | Generate AI image |

### **Download Menu** (`.menudownloader`)

| Command | Description |
|---------|-------------|
| `.ytmp3 <url>` | Download YouTube audio |
| `.ytmp4 <url>` | Download YouTube video |
| `.tiktok <url>` | Download TikTok no watermark |
| `.ig <url>` | Download Instagram post/reel |
| `.fb <url>` | Download Facebook video |
| `.twitter <url>` | Download Twitter media |

### **Sticker Menu** (`.menustiker`)

| Command | Description |
|---------|-------------|
| `.s` atau `.sticker` | Buat sticker dari gambar/video |
| `.wm <text>` | Sticker dengan watermark |
| `.take <text>` | Ganti author sticker |
| `.smeme <text>` | Buat meme sticker |

### **Game Menu** (`.menugame`)

| Command | Description |
|---------|-------------|
| `.tebakgambar` | Tebak gambar |
| `.tebakkata` | Tebak kata |
| `.tebaklirik` | Tebak lirik lagu |
| `.family100` | Game family 100 |
| `.suit <batu/gunting/kertas>` | Suit dengan bot |

### **Group Menu** (`.menugc`)

| Command | Description |
|---------|-------------|
| `.kick @user` | Kick member (admin) |
| `.promote @user` | Promote to admin |
| `.demote @user` | Demote from admin |
| `.tagall <text>` | Tag semua member |
| `.hidetag <text>` | Hidden tag |
| `.group <open/close>` | Buka/tutup grup |
| `.antilink <on/off>` | Anti-link protection |

### **Owner Menu** (`.menuowner`)

| Command | Description |
|---------|-------------|
| `.broadcast <text>` | Broadcast ke semua chat |
| `.setpp` | Set profile picture bot |
| `.setbio <text>` | Set bio bot |
| `.join <link>` | Join grup via link |
| `.leave` | Keluar dari grup |
| `.restart` | Restart bot |
| `.getlid` | Cek LID user |

---

## 🔌 Plugin System

### **Plugin Structure**

```javascript
// plugins/contoh/example.js

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Your plugin code here
  m.reply('Hello World!')
}

handler.help = ['example']
handler.tags = ['main']
handler.command = /^(example|ex)$/i

export default handler
```

### **Plugin Categories**

Plugins diorganisir dalam folder:

```
plugins/
├── main/          # Main commands
├── downloader/    # Download tools
├── sticker/       # Sticker maker
├── game/          # Games
├── group/         # Group management
├── owner/         # Owner only
├── ai/            # AI features
├── tools/         # Utility tools
├── maker/         # Content maker
└── info/          # Information
```

### **Creating Custom Plugin**

1. Buat file di folder `plugins/`
2. Export handler function
3. Set `handler.help`, `handler.tags`, `handler.command`
4. Bot akan auto-reload plugin baru

### **Plugin Properties**

```javascript
handler.help = ['command1', 'command2'] // Command names
handler.tags = ['category']              // Plugin category
handler.command = /^(cmd1|cmd2)$/i      // Regex trigger
handler.owner = false                    // Owner only? (true/false)
handler.admin = false                    // Admin only?
handler.group = false                    // Group only?
handler.private = false                  // Private chat only?
handler.premium = false                  // Premium only?
handler.limit = false                    // Use limit?
handler.register = false                 // Need register?
handler.botAdmin = false                 // Bot need admin?
handler.fail = null                      // Error handler
```

---

## 🐛 Troubleshooting

### **Error: Cannot find module**

```bash
# Hapus node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Error: Cannot read properties of undefined (reading 'contextInfo')**

Ini typo umum, jalankan fix otomatis:

```bash
# Find dan replace semua 'contexInfo' jadi 'contextInfo'
find . -type f -name "*.js" -exec sed -i 's/contexInfo/contextInfo/g' {} +
```

### **Bot tidak merespon**

1. Cek koneksi internet
2. Cek apakah bot masih login (`sessions/creds.json` exists?)
3. Restart bot: `npm start`
4. Cek log error di console

### **Pesan "Waiting for message"**

Normal, bot menunggu pesan dari server WhatsApp. Jika lebih dari 5 menit, restart bot.

### **IP Whitelist Error**

Jika muncul error IP whitelist:

```javascript
// Di main.js, set bypass:
const bypassIpCheck = true; // Set true untuk skip IP check
```

### **Database Error**

```bash
# Backup database
cp database.json database.backup.json

# Reset database
rm database.json
npm start
```

---

## 🤝 Contributing

Kontribusi sangat diterima! Berikut cara contribute:

1. **Fork** repository ini
2. **Clone** fork Anda
3. **Create branch** baru: `git checkout -b feature/AmazingFeature`
4. **Commit** perubahan: `git commit -m 'Add some AmazingFeature'`
5. **Push** ke branch: `git push origin feature/AmazingFeature`
6. Buat **Pull Request**

### **Code Style Guidelines**

- Gunakan ES6+ syntax
- Tambahkan komentar untuk code kompleks
- Test plugin sebelum PR
- Update README jika perlu

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Hiura Mihate

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software")...
```

---

## 💖 Support

### **Support the Project**

Jika bot ini membantu Anda, pertimbangkan untuk:

- ⭐ **Star** repository ini
- 🍴 **Fork** dan kontribusi
- 💰 **Donate** via:
  - DANA/OVO: `083870750111`
  - GoPay: `083870750111`

### **Contact & Social Media**

<div align="center">

[![WhatsApp](https://img.shields.io/badge/WhatsApp-Owner-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/18254873441)
[![GitHub](https://img.shields.io/badge/GitHub-RIJALGANZZZ-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RIJALGANZZZ)
[![Website](https://img.shields.io/badge/Website-rijalganzz.web.id-FF7139?style=for-the-badge&logo=google-chrome&logoColor=white)](https://rijalganzz.web.id)

</div>

### **Join Community**

- **WhatsApp Group**: [Join Here](https://chat.whatsapp.com/YOUR_GROUP_LINK)
- **Telegram Channel**: Coming Soon
- **Discord Server**: Coming Soon

---

## 📊 Stats

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/RIJALGANZZZ/Furina-MD?style=for-the-badge)
![GitHub stars](https://img.shields.io/github/stars/RIJALGANZZZ/Furina-MD?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/RIJALGANZZZ/Furina-MD?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/RIJALGANZZZ/Furina-MD?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/RIJALGANZZZ/Furina-MD?style=for-the-badge)

</div>

---

## 🙏 Credits & Thanks

Special thanks to:

- **Baileys** - WhatsApp Web API
- **@adiwajshing** - Baileys library creator
- **All Contributors** - Yang sudah membantu develop bot ini
- **Community** - Untuk support dan feedback

---

## ⚠️ Disclaimer

- Bot ini **BUKAN official WhatsApp**
- Gunakan **dengan bijak** dan ikuti **Terms of Service WhatsApp**
- Owner **tidak bertanggung jawab** atas penyalahgunaan bot
- Bot ini dibuat untuk **edukasi** dan **automation** personal

---

<div align="center">

**Made with ❤️ by [Rijalganzz Owner](https://github.com/RIJALGANZZZ)**

**© 2024 Furina MD - All Rights Reserved**

</div>
