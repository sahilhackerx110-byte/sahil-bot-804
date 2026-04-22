// ============================================================
//  SAHIL 804 BOT — Master Config (UPDATED v4.3.0)
//  New APIs Added:
//   1. YouTube MP4 Downloader
//   2. Facebook Downloader
//   3. Instagram Downloader
//   4. Weather (RapidAPI Weatherbit)
//   5. TikTok2 Backup
//   6. Hadith (No Key — Free)
//   7. OMDB Movie (Key Required)
// ============================================================

'use strict';

require('dotenv').config();

// ─── STARTUP VALIDATION ──────────────────────────────────
const REQUIRED_ENV = [
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_PROJECT_ID',
  'SESSION_SECRET',
  'ADMIN_PASSWORD',
];

const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error('');
  console.error('╔══════════════════════════════════════════════════════╗');
  console.error('║        ❌  STARTUP FAILED — MISSING ENV VARS         ║');
  console.error('╚══════════════════════════════════════════════════════╝');
  console.error('');
  console.error('Missing variables:');
  missing.forEach(k => console.error(`  ✗ ${k}`));
  console.error('');
  console.error('Fix: Copy .env.example → .env and fill in ALL values.');
  console.error('     On Railway: set these in the Variables tab.');
  console.error('');
  process.exit(1);
}

if (process.env.ADMIN_PASSWORD === 'admin123' || process.env.ADMIN_PASSWORD === 'ChangeThisToAStrongPassword123!') {
  console.warn('[CONFIG WARN] ⚠️  You are using a default/example admin password. Change ADMIN_PASSWORD NOW!');
}

// ─── OPTIONAL API KEY WARNINGS ───────────────────────────
const OPTIONAL_KEYS = [
  { key: 'RAPIDAPI_KEY',    commands: '.ytmp3 .ytmp4 .fb .ig .tiktok2 .weather2' },
  { key: 'OMDB_API_KEY',    commands: '.movie' },
  { key: 'OPENWEATHER_KEY', commands: '.weather3' },
];
OPTIONAL_KEYS.forEach(({ key, commands }) => {
  if (!process.env[key]) {
    console.warn(`[CONFIG WARN] ⚠️  ${key} is not set — ${commands} command will not work.`);
  }
});

const config = {
  env:  process.env.NODE_ENV || 'production',
  port: parseInt(process.env.PORT, 10) || 3000,

  sessionSecret: process.env.SESSION_SECRET,

  owner: {
    number:  process.env.OWNER_NUMBER  || '923496049312',
    backup:  process.env.OWNER_BACKUP  || '923711158307',
    name:    process.env.OWNER_NAME    || '𝑳𝒆𝒈𝒆𝒏𝒅 𝑺𝒂𝒉𝒊𝒍 𝑯𝒂𝒄𝒌𝒆𝒓 𝟖𝟎𝟒',
    email:   process.env.ADMIN_EMAIL   || 'sahilhacker808@gmail.com',
    channel: 'https://whatsapp.com/channel/0029Vb7ufE7It5rzLqedDc3l',
    image:   'https://i.ibb.co/Vc2LHyqv/IMG-20260408-WA0014.jpg',
  },

  bot: {
    name:              process.env.BOT_NAME   || 'SAHIL 804 BOT',
    prefix:            process.env.BOT_PREFIX || '.',
    version:           '4.3.0',
    sessionIdRegex:    /^SAHIL-[A-Z0-9]{8}$/,
    maxBotsPerUser:    { monthly: 10, yearly: 999, free: 0 },
    reconnectDelay:    5000,
    keepAliveInterval: 25000,
    connectTimeout:    60000,
  },

  firebase: {
    projectId:    process.env.FIREBASE_PROJECT_ID  || 'legendsahilbot',
    clientEmail:  process.env.FIREBASE_CLIENT_EMAIL,
    privateKey:   (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID || '',
    clientId:     process.env.FIREBASE_CLIENT_ID      || '',
    databaseURL:  process.env.FIREBASE_DATABASE_URL
      || `https://${process.env.FIREBASE_PROJECT_ID || 'legendsahilbot'}-default-rtdb.asia-southeast1.firebasedatabase.app`,
    apiKey:            process.env.FIREBASE_API_KEY || '',
    authDomain:        `${process.env.FIREBASE_PROJECT_ID || 'legendsahilbot'}.firebaseapp.com`,
    storageBucket:     `${process.env.FIREBASE_PROJECT_ID || 'legendsahilbot'}.firebasestorage.app`,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '541455603653',
    appId:             process.env.FIREBASE_APP_ID || '1:541455603653:web:23732bf8b41945a2739dac',
  },

  apis: {
    // ─── RapidAPI Master Key ─────────────────────────────
    rapidApiKey:  process.env.RAPIDAPI_KEY,

    // ─── YouTube MP3 ─────────────────────────────────────
    youtubeMP3Host: 'youtube-mp3-audio-video-downloader.p.rapidapi.com',

    // ─── YouTube MP4 (NEW) ───────────────────────────────
    youtubeMP4Host: 'youtube-video-fast-downloader-24-7.p.rapidapi.com',

    // ─── Facebook (NEW) ──────────────────────────────────
    facebookHost: 'facebook-media-downloader1.p.rapidapi.com',

    // ─── Instagram (NEW) ─────────────────────────────────
    instagramHost: 'instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com',

    // ─── TikTok Primary (no key) ─────────────────────────
    tiktokPrimary: 'https://www.tikwm.com/api/',

    // ─── TikTok2 Backup RapidAPI (NEW) ───────────────────
    tiktok2Host: 'tiktok-api23.p.rapidapi.com',

    // ─── Weather Primary (no key — wttr.in) ──────────────
    weather: 'https://wttr.in',

    // ─── Weather2 RapidAPI Weatherbit (NEW) ──────────────
    weatherRapidHost: 'weatherbit-v1-mashape.p.rapidapi.com',

    // ─── Weather3 OpenWeather (needs OPENWEATHER_KEY) ────
    openWeatherKey: process.env.OPENWEATHER_KEY,

    // ─── OMDB Movie (NEW) ────────────────────────────────
    omdbApiKey: process.env.OMDB_API_KEY,

    // ─── Hadith (No Key — Free API) ──────────────────────
    hadith: 'https://api.hadith.gading.dev',

    // ─── Islamic APIs (No Key) ───────────────────────────
    quran:  'https://api.alquran.cloud/v1',
    prayer: 'https://api.aladhan.com/v1/timingsByCity',
    dua:    'https://raw.githubusercontent.com/nawajalqari/duaa-api/main/duaa.json',

    // ─── General APIs (No Key) ───────────────────────────
    news:       'https://rss2json.com/api.json?rss_url=https://feeds.bbci.co.uk/news/rss.xml',
    translate:  'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=',
    urlShorten: 'https://tinyurl.com/api-create.php?url=',
    crypto:     'https://api.coingecko.com/api/v3/simple/price',
    currency:   'https://api.exchangerate-api.com/v4/latest/',
    wikipedia:  'https://en.wikipedia.org/api/rest_v1/page/summary/',
    dictionary: 'https://api.dictionaryapi.dev/api/v2/entries/en/',
    simDb:      'https://ammar-sim-database-api-786.vercel.app/api/database?number=',
    tts:        'https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=',

    timeout: 15000,
  },

  reactEmojis: ['❤️','🔥','😍','👏','🎉','💯','⚡','🌟','💪','👌','😂','🥰','🤩','🙌','✨','💥','🎊','🏆','💎','🚀','😎','🤣','💀','👀','🫶','🥳','😘','🫡','🤙','💫'],

  reactKeywords: {
    sad:   { words: ['sad','cry','broken','crying'],                              emoji: '😢' },
    happy: { words: ['happy','congrats','birthday','celebrate','congratulation'], emoji: '🎉' },
    love:  { words: ['love','heart','lovely'],                                    emoji: '❤️' },
    funny: { words: ['lol','haha','funny','joke','laugh'],                        emoji: '😂' },
    angry: { words: ['angry','mad','furious'],                                    emoji: '😡' },
    wow:   { words: ['wow','amazing','incredible','unbelievable'],                emoji: '🤩' },
    food:  { words: ['food','pizza','hungry','eat','burger'],                     emoji: '😋' },
    fire:  { words: ['fire','lit','beast','hot'],                                 emoji: '🔥' },
    win:   { words: ['win','champ','legend','victory'],                           emoji: '🏆' },
  },

  admin: {
    email:    process.env.ADMIN_EMAIL    || 'sahilhackerx110@gmail.com',
    password: process.env.ADMIN_PASSWORD,
  },

  rateLimit: {
    general: { windowMs: 60 * 1000,      max: 30, message: { error: 'Too many requests. Please slow down.' } },
    pairing: { windowMs: 10 * 60 * 1000, max: 5,  message: { error: 'Too many pairing attempts. Try again in 10 minutes.' } },
    auth:    { windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Too many auth attempts. Try again later.' } },
  },

  session: {
    cookie: {
      secure:   process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge:   24 * 60 * 60 * 1000,
      sameSite: 'lax',
    },
    resave:            false,
    saveUninitialized: false,
  },
};

module.exports = config;

// ─── EXTENDED CONFIG ─────────────────────────────────────

config.botMode = 'public';

config.features = {
  autoReact:   process.env.AUTO_REACT    !== 'false',
  autoReply:   process.env.AUTO_REPLY    !== 'false',
  autoRead:    process.env.AUTO_READ     !== 'false',
  antiDelete:  process.env.ANTI_DELETE   !== 'false',
  welcomeMsg:  process.env.WELCOME_MSG   !== 'false',
  goodbyeMsg:  process.env.GOODBYE_MSG   !== 'false',
  antiSpam:    process.env.ANTI_SPAM     !== 'false',
  antiLink:    process.env.ANTI_LINK     === 'true',
  antiBot:     process.env.ANTI_BOT      !== 'false',
  antiBadWord: process.env.ANTI_BAD_WORD === 'true',
  autoStatus:  false,
  chatbot:     process.env.CHATBOT       === 'true',
  tts:         process.env.TTS           !== 'false',
  viewOnce:    process.env.VIEW_ONCE     !== 'false',
  antiDelete2: process.env.ANTI_DELETE2  !== 'false',
};

// Per-session chatbot state (in-memory)
config.chatbotSessions = new Map();

config.chatbot = {
  enabled: false,
  smartReplies: {
    greetings:  { words: ['hi','hello','hey','salam','assalam','aoa'],          reply: '👋 𝑯𝒆𝒍𝒍𝒐! 𝑯𝒐𝒘 𝒄𝒂𝒏 𝑰 𝒉𝒆𝒍𝒑 𝒚𝒐𝒖 𝒕𝒐𝒅𝒂𝒚? 😊' },
    howAreYou:  { words: ['how are you','kya haal','kaisa','kaise ho'],         reply: '😊 𝑰 𝒂𝒎 𝒅𝒐𝒊𝒏𝒈 𝒈𝒓𝒆𝒂𝒕! 𝑻𝒉𝒂𝒏𝒌𝒔 𝒇𝒐𝒓 𝒂𝒔𝒌𝒊𝒏𝒈 🌟' },
    thanks:     { words: ['thanks','thank you','shukriya','jazakallah'],        reply: '🙏 𝑾𝒆𝒍𝒄𝒐𝒎𝒆! 𝑨𝒍𝒘𝒂𝒚𝒔 𝒉𝒆𝒓𝒆 𝒇𝒐𝒓 𝒚𝒐𝒖 ❤️' },
    bye:        { words: ['bye','goodbye','khuda hafiz','allah hafiz'],         reply: '👋 𝑮𝒐𝒐𝒅𝒃𝒚𝒆! 𝑻𝒂𝒌𝒆 𝒄𝒂𝒓𝒆 😊' },
    love:       { words: ['i love you','love you','pyar'],                      reply: '😊 𝑻𝒉𝒂𝒏𝒌𝒔! 𝑺𝒑𝒓𝒆𝒂𝒅 𝒍𝒐𝒗𝒆 ❤️' },
    bored:      { words: ['bored','bore','kuch nahi'],                          reply: '🎮 𝑻𝒓𝒚 .𝒋𝒐𝒌𝒆 .𝒓𝒊𝒅𝒅𝒍𝒆 .𝒕𝒓𝒊𝒗𝒊𝒂 𝒕𝒐 𝒉𝒂𝒗𝒆 𝒇𝒖𝒏! 😄' },
    help:       { words: ['help','madad','kya kar'],                            reply: '📋 𝑻𝒚𝒑𝒆 .𝒎𝒆𝒏𝒖 𝒕𝒐 𝒔𝒆𝒆 𝒂𝒍𝒍 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔! ⚡' },
    name:       { words: ['your name','tera naam','aap ka naam','who are you'], reply: '🤖 𝑰 𝒂𝒎 𝑺𝑨𝑯𝑰𝑳 𝟖𝟎𝟒 𝑩𝑶𝑻! 👑' },
    age:        { words: ['your age','teri umar','kitne saal'],                 reply: '😄 𝑰 𝒂𝒎 𝒂𝒍𝒘𝒂𝒚𝒔 𝒚𝒐𝒖𝒏𝒈! 𝑩𝒐𝒕𝒔 𝒅𝒐𝒏𝒕 𝒂𝒈𝒆 😂' },
    good:       { words: ['good','great','nice','mast','zabardast'],            reply: '🔥 𝑨𝒘𝒆𝒔𝒐𝒎𝒆! 𝑲𝒆𝒆𝒑 𝒊𝒕 𝒖𝒑! 💪' },
  },
};

config.spam = {
  maxMessages: 10,
  timeWindow:  10000,
  warnBefore:  7,
};

config.subscription = {
  monthly: { price: 500,  botsLimit: 10       },
  yearly:  { price: 1500, botsLimit: Infinity  },
};
