<div align="center">

<img src="https://i.ibb.co/Vc2LHyqv/IMG-20260408-WA0014.jpg" width="150" style="border-radius: 50%;" alt="Legend Sahil Hacker 804"/>

<br/>

# ⚡ SAHIL 804 BOT

### *A Production-Grade WhatsApp Bot Platform*

<p align="center">
  <img src="https://img.shields.io/badge/Version-4.3.0-blueviolet?style=for-the-badge&logo=github"/>
  <img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=for-the-badge&logo=nodedotjs"/>
  <img src="https://img.shields.io/badge/Firebase-Admin_SDK-orange?style=for-the-badge&logo=firebase"/>
  <img src="https://img.shields.io/badge/Deployed-Railway-0B0D0E?style=for-the-badge&logo=railway"/>
  <img src="https://img.shields.io/badge/Commands-118%2B-ff69b4?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Lines_of_Code-9000%2B-blue?style=for-the-badge"/>
</p>

<p align="center">
  <a href="https://whatsapp.com/channel/0029Vb7ufE7It5rzLqedDc3l">
    <img src="https://img.shields.io/badge/WhatsApp_Channel-Follow-25D366?style=for-the-badge&logo=whatsapp"/>
  </a>
  <a href="mailto:sahilhacker808@gmail.com">
    <img src="https://img.shields.io/badge/Contact-Email-EA4335?style=for-the-badge&logo=gmail"/>
  </a>
</p>

---

> *"Built with passion, deployed with precision — a full-stack WhatsApp automation platform designed and developed from scratch."*

</div>

---

## 👨‍💻 About The Developer

<table>
<tr>
<td width="60%">

**Legend Sahil Hacker 804** is a self-taught developer from Pakistan, passionate about building real-world automation tools. This project represents months of learning, debugging, and iterating — combining backend engineering, cloud infrastructure, and user-facing design into a single cohesive platform.

- 🎓 Student developer focused on **Node.js & Firebase**
- 🔥 Specializes in **WhatsApp automation** using Baileys
- 🚀 Deploys production apps on **Railway cloud**
- 📦 9,000+ lines of original JavaScript code
- 📬 sahilhacker808@gmail.com

</td>
<td width="40%" align="center">

```
📊 Project Stats
━━━━━━━━━━━━━━━━━━━━
  Files        :   36
  Source Lines :  9,000+
  Commands     :  118+
  API Modules  :  30+
  Web Pages    :  5
  Bot Version  :  v4.3.0
━━━━━━━━━━━━━━━━━━━━
```

</td>
</tr>
</table>

---

## 🤖 What Is SAHIL 804 BOT?

SAHIL 804 BOT is a **multi-session WhatsApp Bot Platform** — not just a simple bot, but a complete SaaS-style system where users can register, purchase a subscription, and deploy their own WhatsApp bot through a web dashboard — without writing a single line of code.

**Key idea:** One server, multiple bots, multiple users. Each user gets their own WhatsApp session with full control via a dashboard.

---

## 🏗️ Architecture

```
sahil-804-bot/
│
├── web/
│   ├── server.js              ← Express.js web server + REST API + WebSocket
│   └── public/
│       ├── index.html         ← Landing page
│       ├── login.html         ← User login
│       ├── register.html      ← User registration
│       ├── dashboard.html     ← User bot control panel
│       └── admin.html         ← Admin management panel
│
├── src/
│   ├── bot/
│   │   └── launcher.js        ← Baileys WhatsApp connection manager
│   ├── commands/
│   │   └── index.js           ← 118+ bot commands (2,939 lines)
│   ├── handlers/
│   │   └── messageHandler.js  ← Message router, anti-spam, cooldowns
│   ├── apis/
│   │   └── downloader.js      ← 30+ external API integrations
│   ├── firebase/
│   │   └── config.js          ← Firestore + RTDB (users, sessions, subs)
│   ├── middleware/
│   │   └── auth.js            ← Auth guards, bcrypt, input validation
│   ├── utils/
│   │   ├── helpers.js         ← Logger, session manager, utilities
│   │   ├── firebase.js        ← Firebase utility functions
│   │   └── firebaseAuthState.js ← Baileys auth state stored in Firebase
│   └── config/
│       └── config.js          ← Master config + env validation
│
├── speed boost.js             ← Performance optimization engine
├── diagnose.js                ← Deployment diagnostics tool
├── firestore.rules            ← Firebase security rules
├── railway.json               ← Railway cloud deployment config
└── .env.example               ← Environment variable template
```

---

## ✨ Feature Categories

| Category | Commands | Description |
|---|---|---|
| 🎮 **General** | 10 | ping, uptime, status, owner info |
| 😂 **Fun & Entertainment** | 25 | jokes, shayari, memes, roasts, pickup lines |
| 🎲 **Games** | 8 | RPS, trivia, math challenge, number guessing |
| 🛠️ **Tools** | 12 | calculator, BMI, age, password generator |
| 💸 **Crypto & Finance** | 6 | live prices, top cryptos, currency rates |
| 🕌 **Islamic** | 8 | Quran, Hadith, prayer times, duas |
| 🌍 **Information** | 10 | Wikipedia, weather, country info, news |
| 🔐 **Encode/Decode** | 6 | Base64, Binary, Morse code |
| 🎭 **Media** | 8 | stickers, wallpapers, image effects |
| 📥 **Downloaders** | 5 | YouTube MP3/MP4, TikTok, Instagram, Facebook |
| ⚙️ **Settings** | 10 | anti-spam, auto-react, view-once, chatbot mode |
| 👑 **Admin** | 10 | group management, broadcast, user stats |

---

## 🔧 Technology Stack

```
Backend Framework   →  Express.js v4.18
WhatsApp Library    →  @whiskeysockets/baileys v6.7 (ESM)
Database            →  Firebase Firestore + Realtime Database
Authentication      →  express-session + bcryptjs (rounds=12)
Security            →  helmet, express-rate-limit, sanitize-html
Real-time           →  WebSocket (ws library) — QR code streaming
Media Processing    →  sharp, fluent-ffmpeg, wa-sticker-formatter
PDF Generation      →  pdfkit
Caching             →  node-cache (TTL-based, 500 max keys)
Deployment          →  Railway (NIXPACKS build, healthcheck enabled)
Cloud Platform      →  Firebase Admin SDK v12
```

---

## 🛡️ Security Implementation

This project implements **production-grade security** practices:

- ✅ **bcrypt password hashing** — 12 salt rounds
- ✅ **Rate limiting** — separate limiters for auth, pairing, and general API
- ✅ **Helmet.js** — HTTP security headers
- ✅ **Input sanitization** — `sanitize-html` on all user inputs
- ✅ **Strong password enforcement** — min 8 chars, uppercase, special char required
- ✅ **Session security** — httpOnly cookies, SameSite=lax, custom cookie name
- ✅ **Firestore rules** — all collections locked to Admin SDK only
- ✅ **Anti-spam engine** — per-user message rate tracking with auto-warn
- ✅ **Cooldown system** — 5-second per-command cooldowns
- ✅ **Subscription guards** — paid feature access controlled server-side
- ✅ **safeEval()** — keyword blacklist before any expression evaluation

---

## ⚡ Performance Optimizations (`speed boost.js`)

```javascript
// UV Threadpool expanded for Railway's multi-vCPU environment
process.env.UV_THREADPOOL_SIZE = '16';   // 4x faster I/O

// Intl.DateTimeFormat cached — created ONCE, reused on every message
// (replaces expensive new Date().toLocaleString() on each call)
global.getKarachiTime = function() { return _pkFormatter.format(new Date()); };

// Baileys ESM pre-warmed at startup — zero cold start on first message
// Presence update batcher — groups rapid fire-and-forget calls
```

---

## 🚀 Deployment Guide

### Prerequisites
- Node.js ≥ 18.0.0
- Firebase project (Firestore + Realtime Database enabled)
- Railway account (free tier works)

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/Sahil-Legend-804-Bot.git
cd Sahil-Legend-804-Bot

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and fill in all required values

# 4. Start the server
npm start
# Server runs at http://localhost:3000
```

### Environment Variables

```env
# Required
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
SESSION_SECRET=your_random_32_char_string
ADMIN_PASSWORD=YourStrongPassword123!

# Optional API Keys (enable extra commands)
RAPIDAPI_KEY=          # .ytmp3 .ytmp4 .tiktok .weather
OMDB_API_KEY=          # .movie command
OPENWEATHER_KEY=       # .weather3 command
```

### Railway Deployment

```bash
# Railway auto-deploys from GitHub
# Just push to main branch — railway.json handles the rest

# Start command (pre-configured in railway.json):
node --max-old-space-size=512 --optimize-for-size web/server.js
```

---

## 📱 How It Works

```
User visits website → Registers account → Admin approves → User buys subscription
        ↓
User opens dashboard → Clicks "Start Bot" → Server calls startBot()
        ↓
Baileys connects → QR code streamed via WebSocket → User scans with WhatsApp
        ↓
Bot goes online → handleMessage() processes every incoming message
        ↓
Anti-spam check → Cooldown check → Command parsed → Response sent
```

---

## 🌐 Web Dashboard Pages

| Page | Path | Access |
|---|---|---|
| Landing Page | `/` | Public |
| User Login | `/login.html` | Public |
| User Register | `/register.html` | Public |
| Bot Dashboard | `/dashboard.html` | Authenticated + Paid |
| Admin Panel | `/admin.html` | Admin Only |

---

## 📡 API Integrations

The bot connects to **30+ external APIs**:

`YouTube` • `TikTok` • `Instagram` • `Facebook` • `Wikipedia` • `OpenWeather` • `RapidAPI Weatherbit` • `CoinGecko (Crypto)` • `Exchange Rate API` • `OMDB (Movies)` • `Dictionary API` • `GitHub API` • `NPM Registry` • `IP Info` • `Quran.com` • `Hadith API` • `Aladhan (Prayer Times)` • `News API` • `Horoscope API` • `Lyrics API` • `Advice Slip` • `Cat Facts` • `Dog Facts` • `Chuck Norris Jokes` • `Random Word` • `Numbers API` • `URL Shortener` • `SIM Database`

---

## 🔄 Bot Settings (Per Session)

Each deployed bot can be individually configured:

| Setting | Default | Description |
|---|---|---|
| `autoReact` | ✅ ON | React with emoji to every message |
| `statusSeen` | ✅ ON | Auto-view all WhatsApp statuses |
| `autoTyping` | ✅ ON | Show "typing..." indicator |
| `alwaysOnline` | ✅ ON | Keep presence as online |
| `antiDelete` | ✅ ON | Save deleted messages |
| `viewOnce` | ✅ ON | Capture view-once media |
| `autoRead` | ✅ ON | Auto-read all messages |
| `chatbot` | ❌ OFF | AI-style auto-reply |
| `antiLink` | ❌ OFF | Remove links in groups |

---

## 🤝 Credits & Acknowledgements

<table>
<tr>
<td align="center" width="50%">

**👨‍💻 Developer**

**Legend Sahil Hacker 804**
*Project Design, Architecture & Code*

📬 sahilhacker808@gmail.com
📢 [WhatsApp Channel](https://whatsapp.com/channel/0029Vb7ufE7It5rzLqedDc3l)

</td>
<td align="center" width="50%">

**🎓 Academic Guidance**

Honest project evaluation, code review, architecture feedback, and security guidance provided during the development and submission phase.

*"Real learning comes from honest feedback."*

</td>
</tr>
</table>

---

## 📜 License

This project is for **educational and personal portfolio purposes**. The code is original work by the developer. Please do not redistribute as your own.

---

<div align="center">

**Built with ❤️ by Legend Sahil Hacker 804 — Pakistan 🇵🇰**

*"Every bug fixed is a lesson learned. Every feature shipped is a skill earned."*

<br/>

⭐ **If you found this project useful, please give it a star!** ⭐

</div>

