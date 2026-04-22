'use strict';
// ============================================================
//  launcher.js — v12.0 — FULLY FIXED
//  Baileys v6.7+ ESM support maintained.
//
//  v11 FIXES (inherited):
//    ✅ FIX 1: messages.delete event listener ADDED
//
//  v12 FIXES (NEW):
//    ✅ FIX 2: Duplicate processing bug — "Bot offline" false message fix
//               protocolMessage + messages.delete dono fire hone pe SIRF EK handle hoga
//               global.__antiDeleteProcessed Set se cross-file coordination
//    ✅ FIX 3: Timestamp collision fix — unique fakeMsg ID
//    ✅ FIX 4: 400ms delay — protocolMessage path ko pehle complete hone do
//    ✅ FIX 5: Misleading comment hata — code comment reality match karta hai
// ============================================================

const path = require('path');
const fs   = require('fs');

const config  = require('../config/config');
const { logger, registerBot, removeBot, generateSessionId } = require('../utils/helpers');
const { handleMessage }                                      = require('../handlers/messageHandler');
const { createSession, getSession, updateSession }           = require('../firebase/config');
const { useFirebaseAuthState, clearSession: clearFirebaseSession } = require('../utils/firebaseAuthState');

// ─── SAFE GLOBAL ERROR HANDLERS ──────────────────────────────────────────────
process.on('uncaughtException',  (err) => console.error('UNCAUGHT EXCEPTION:',  err));
process.on('unhandledRejection', (err) => console.error('UNHANDLED REJECTION:', err));

// ─── SESSIONS DIRECTORY ───────────────────────────────────────────────────────
const SESSIONS_DIR = path.join(__dirname, '..', 'auth_info_baileys');

// ─── SILENT LOGGER ────────────────────────────────────────────────────────────
const silentLogger = {
  level: 'silent',
  trace: () => {}, debug: () => {}, info: () => {},
  warn:  () => {}, error: () => {}, fatal: () => {},
  child: () => silentLogger,
};

// ─── RECONNECT CONTROL ────────────────────────────────────────────────────────
const reconnectAttempts = new Map();
const reconnectTimers   = new Map();
const MAX_RECONNECT_ATTEMPTS = 10;

// ─── ACTIVE SOCKETS REGISTRY ─────────────────────────────────────────────────
const activeSockets = new Map();

// ─── BAILEYS ESM LOADER (cached after first load) ────────────────────────────
let _baileys = null;
async function getBaileys() {
  if (_baileys) return _baileys;
  _baileys = await import('@whiskeysockets/baileys');
  global.__baileys = _baileys;
  return _baileys;
}

// ─── MAIN BOT FUNCTION ────────────────────────────────────────────────────────
async function startBot(
  sessionId,
  userId,
  onQR,
  onPairCode,
  onConnected,
  onDisconnected,
  phoneNumber = null
) {
  try {
    const {
      default: makeWASocket,
      DisconnectReason,
      useMultiFileAuthState,
      fetchLatestBaileysVersion,
      makeCacheableSignalKeyStore,
      Browsers,
    } = await getBaileys();

    if (!sessionId) sessionId = generateSessionId();

    if (activeSockets.has(sessionId)) {
      try {
        const s = activeSockets.get(sessionId);
        if (typeof s.ws?.close === 'function') s.ws.close();
        else if (typeof s.end === 'function') s.end(undefined);
      } catch (_) {}
      activeSockets.delete(sessionId);
      await new Promise((r) => setTimeout(r, 2000));
    }

    if (reconnectTimers.has(sessionId)) {
      clearTimeout(reconnectTimers.get(sessionId));
      reconnectTimers.delete(sessionId);
    }

    const authDir = path.join(SESSIONS_DIR, sessionId);
    fs.mkdirSync(authDir, { recursive: true });

    let state, saveCreds;
    try {
      const fbAuth  = await useFirebaseAuthState(sessionId);
      state         = fbAuth.state;
      saveCreds     = fbAuth.saveCreds;
      logger.info(`Using Firebase auth state for session: ${sessionId}`);
    } catch (fbErr) {
      logger.warn(`Firebase auth state failed (${fbErr.message}) — using local filesystem`);
      const localAuth = await useMultiFileAuthState(authDir);
      state           = localAuth.state;
      saveCreds       = localAuth.saveCreds;
    }

    let version;
    try {
      const result = await fetchLatestBaileysVersion();
      version = result.version;
      logger.info(`Baileys version: ${version}`);
    } catch (_) {
      version = [2, 3000, 1015526];
      logger.warn(`fetchLatestBaileysVersion failed — using fallback: ${version}`);
    }

    let pairCodeRequested = false;

    const sock = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys:  makeCacheableSignalKeyStore(state.keys, silentLogger),
      },
      printQRInTerminal:              false,
      logger:                         silentLogger,
      browser:                        Browsers.ubuntu('Chrome'),
      connectTimeoutMs:               30_000,
      defaultQueryTimeoutMs:          30_000,
      keepAliveIntervalMs:            25_000,
      markOnlineOnConnect:            true,
      generateHighQualityLinkPreview: false,
      syncFullHistory:                false,
      fireInitQueries:                false,
    });

    activeSockets.set(sessionId, sock);
    sock.ev.on('creds.update', saveCreds);

    // ── Connection handler ─────────────────────────────────────────────────────
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr && onQR) onQR(qr);

      if (
        connection === 'connecting' &&
        phoneNumber &&
        !state.creds.registered &&
        !pairCodeRequested
      ) {
        pairCodeRequested = true;
        setTimeout(async () => {
          if (!activeSockets.has(sessionId)) return;
          try {
            const cleanNum = phoneNumber.replace(/[^0-9]/g, '').replace(/^0+/, '');
            logger.info(`Requesting pair code for: ${cleanNum} (session: ${sessionId})`);
            const code = await sock.requestPairingCode(cleanNum);
            logger.info(`Pair code for ${sessionId}: ${code}`);
            if (onPairCode) onPairCode(code);
          } catch (err) {
            logger.error(`Pair code error: ${err.message}`);
            if (onPairCode) onPairCode(null, err.message);
          }
        }, 3000);
      }

      if (connection === 'close') {
        const statusCode      = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        logger.warn(`Bot ${sessionId} disconnected. Code: ${statusCode}`);
        activeSockets.delete(sessionId);
        removeBot(sessionId);
        await updateSession(sessionId, { status: 'inactive' }).catch(() => {});

        if (shouldReconnect) {
          const attempts = (reconnectAttempts.get(sessionId) || 0) + 1;
          reconnectAttempts.set(sessionId, attempts);

          if (attempts > MAX_RECONNECT_ATTEMPTS) {
            logger.error(`Max reconnect attempts reached for ${sessionId}`);
            reconnectAttempts.delete(sessionId);
            reconnectTimers.delete(sessionId);
            if (onDisconnected) onDisconnected(sessionId);
            return;
          }

          const delay = Math.min(5000 * attempts, 60_000);
          logger.info(`Reconnecting ${sessionId} in ${delay}ms (attempt ${attempts})`);

          const timer = setTimeout(() => {
            reconnectTimers.delete(sessionId);
            startBot(sessionId, userId, onQR, onPairCode, onConnected, onDisconnected, phoneNumber);
          }, delay);

          reconnectTimers.set(sessionId, timer);

        } else {
          reconnectAttempts.delete(sessionId);
          reconnectTimers.delete(sessionId);

          try {
            fs.rmSync(authDir, { recursive: true, force: true });
          } catch (e) {
            logger.error(`Failed to delete auth dir: ${e.message}`);
          }

          clearFirebaseSession(sessionId).catch(() => {});
          if (onDisconnected) onDisconnected(sessionId);
        }
      }

      if (connection === 'open') {
        reconnectAttempts.delete(sessionId);

        const rawId     = sock.user?.id || '';
        const botNumber = rawId.replace(/:[0-9]+@/, '@').replace('@s.whatsapp.net', '');

        logger.info(`Bot ${sessionId} connected as +${botNumber}`);
        registerBot(sessionId, sock, 'public');

        const existingSession = await getSession(sessionId);
        if (!existingSession) {
          await createSession(sessionId, userId, botNumber);
        } else {
          await updateSession(sessionId, { status: 'active', whatsappNumber: botNumber });
        }

        const welcomeMsg =
  `╭━━━〔 🚀 𝑺𝑨𝑯𝑰𝑳 𝟖𝟎𝟒 𝑩𝑶𝑻 〕━━━╮\n` +
  `┃\n` +
  `┃ 🌐 𝑶𝒇𝒇𝒊𝒄𝒊𝒂𝒍 𝑪𝒉𝒂𝒏𝒏𝒆𝒍\n` +
  `┃ 🔗 https://whatsapp.com/channel/0029Vb7ufE7It5rzLqedDc3l\n` +
  `┃\n` +
  `┃ 👤 𝑶𝒘𝒏𝒆𝒓 𝑪𝒐𝒏𝒕𝒂𝒄𝒕\n` +
  `┃ 📞 +923711158307\n` +
  `┃\n` +
  `┃ ⚠️ 𝑰𝒎𝒑𝒐𝒓𝒕𝒂𝒏𝒕 𝑵𝒐𝒕𝒊𝒄𝒆\n` +
  `┃ 𝑩𝒐𝒕 𝒌𝒐 𝒔𝒊𝒓𝒇 𝒆𝒌 𝒅𝒂𝒇𝒂 𝒍𝒊𝒏𝒌 𝒌𝒂𝒓𝒏𝒂 𝒉𝒐𝒕𝒂 𝒉𝒂𝒊.\n` +
  `┃ 𝑨𝒈𝒂𝒓 𝒌𝒐𝒊 𝒅𝒐𝒃𝒂𝒓𝒂 𝒄𝒐𝒅𝒆 𝒅𝒆 𝒚𝒂 𝒃𝒐𝒍𝒆 𝒌𝒆 𝒖𝒔𝒂𝒚 𝒍𝒊𝒏𝒌 𝒌𝒂𝒓𝒐,\n` +
  `┃ 𝒕𝒐 𝒌𝒂𝒃𝒉𝒊 𝒃𝒉𝒊 𝒅𝒐𝒃𝒂𝒓𝒂 𝒄𝒐𝒅𝒆 𝒆𝒏𝒕𝒆𝒓 𝒏𝒂 𝒌𝒂𝒓𝒆𝒊𝒏.\n` +
  `┃\n` +
  `┃ 🚫 𝒀𝒆𝒉 𝒂𝒂𝒑𝒌𝒂 𝑾𝒉𝒂𝒕𝒔𝑨𝒑𝒑 𝒉𝒂𝒄𝒌 𝒌𝒂𝒓𝒏𝒆 𝒌𝒊 𝒌𝒐𝒔𝒉𝒊𝒔𝒉 𝒉𝒐 𝒔𝒂𝒌𝒕𝒊 𝒉𝒂𝒊.\n` +
  `┃\n` +
  `┃ 🔐 𝑨𝒑𝒏𝒊 𝒔𝒆𝒄𝒖𝒓𝒊𝒕𝒚 𝒌𝒂 𝒉𝒂𝒎𝒆𝒔𝒉𝒂 𝒌𝒉𝒂𝒚𝒂𝒍 𝒓𝒂𝒌𝒉𝒆𝒊𝒏.\n` +
  `┃\n` +
  `┃ ⚙️ 𝑺𝒚𝒔𝒕𝒆𝒎 𝑰𝒏𝒇𝒐\n` +
  `┃ 𝑩𝒐𝒕 𝒄𝒐𝒅𝒆 𝒍𝒂𝒈𝒂𝒕𝒆 𝒉𝒊 𝒊𝒏𝒔𝒕𝒂𝒏𝒕𝒍𝒚 𝒂𝒄𝒕𝒊𝒗𝒆 𝒉𝒐 𝒋𝒂𝒕𝒂 𝒉𝒂𝒊.\n` +
  `┃ 𝑰𝒔𝒂𝒚 𝒎𝒂𝒏𝒖𝒂𝒍𝒍𝒚 𝒅𝒆𝒑𝒍𝒐𝒚 𝒌𝒂𝒓𝒏𝒆 𝒌𝒊 𝒛𝒂𝒓𝒖𝒓𝒂𝒕 𝒏𝒂𝒉𝒊 𝒉𝒐𝒕𝒊.\n` +
  `┃ 𝑺𝒚𝒔𝒕𝒆𝒎 𝒐𝒑𝒕𝒊𝒎𝒊𝒛𝒆𝒅 𝒉𝒂𝒊 𝒂𝒖𝒓 𝒏𝒐𝒓𝒎𝒂𝒍 𝒖𝒔𝒂𝒈𝒆 𝒌𝒆 𝒍𝒊𝒚𝒆 𝒔𝒂𝒇𝒆 𝒅𝒆𝒔𝒊𝒈𝒏 𝒌𝒊𝒚𝒂 𝒈𝒂𝒚𝒂 𝒉𝒂𝒊.\n` +
  `┃\n` +
  `╰━━━━━━━━━━━━━━━━━━━━━━━╯`;

        const jid = rawId.replace(/:[0-9]+@/, '@') || `${botNumber}@s.whatsapp.net`;
        await sock.sendMessage(jid, { text: welcomeMsg }).catch(() => {});

        if (onConnected) onConnected(sessionId, botNumber);
      }
    });

    // ── Message handler ────────────────────────────────────────────────────────
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;
      await Promise.allSettled(
        messages
          .filter(msg => msg.message)
          .map(msg => handleMessage(sock, msg, sessionId).catch(err => logger.error(err.message)))
      );
    });

    // ════════════════════════════════════════════════════════════════════════
    // ✅ messages.delete EVENT — v12 FIXED
    //
    // Jab koi message delete karta hai, Baileys 2 events fire kar sakta hai:
    //   1. messages.upsert → protocolMessage (type=0) → messageHandler handle karta hai
    //   2. messages.delete → YEH EVENT → safety net hai
    //
    // ❌ PEHLE KA BUG (launcher_FINAL):
    //    Comment mein "duplicate check ke saath" likha tha — lekin check tha hi nahi!
    //    Dono events fire hote → same deletion TWICE process hoti:
    //      1st: protocolMessage → recovery alert ✅ → store se delete
    //      2nd: messages.delete → store empty → "Bot offline tha" ❌ (GALAT!)
    //
    // ✅ AB KYA HOTA HAI:
    //    messageHandler protocolMessage process kare → global.__antiDeleteProcessed mein mark kare
    //    messages.delete fire ho (400ms delay ke baad) → already processed? → SKIP ✅
    //    Bot offline tha → store mein tha hi nahi → messages.delete process kare ✅
    // ════════════════════════════════════════════════════════════════════════
    sock.ev.on('messages.delete', async (item) => {
      try {
        const keys = item?.keys || [];
        if (!keys.length) return;

        const getSettings = global.__getSettings;
        if (!getSettings) return;
        const S = getSettings(sessionId);
        if (!S?.antiDelete) return;

        // ✅ FIX: 400ms wait karo — protocolMessage path ko pehle run karne do
        // protocolMessage aata hai messages.upsert se jo is se pehle fire hota hai
        await new Promise(r => setTimeout(r, 400));

        logger.info(`[AntiDelete] messages.delete — ${keys.length} key(s) — session: ${sessionId}`);

        for (const key of keys) {
          try {
            const keyId = key.id;

            // ✅ FIX: Duplicate check — protocolMessage path ne already handle kiya?
            const alreadyProcessed = global.__antiDeleteProcessed?.has(keyId);
            if (alreadyProcessed) {
              logger.info(`[AntiDelete] Key ${keyId} already handled by protocolMessage — skip`);
              global.__antiDeleteProcessed.delete(keyId);
              continue;
            }

            // ✅ Check: store mein hai ya nahi
            // (store mein nahi = bot offline tha ya TTL expire — ab bhi notify karo)
            const fakeMsg = {
              key: {
                remoteJid:   key.remoteJid,
                fromMe:      false,
                id:          `del_${keyId}_${sessionId}`, // ✅ FIX: unique ID (timestamp collision hata)
                participant: key.participant || undefined,
              },
              message: {
                protocolMessage: {
                  type: 0,
                  key:  key,
                },
              },
              pushName:         '',
              messageTimestamp: Math.floor(Date.now() / 1000),
            };

            await handleMessage(sock, fakeMsg, sessionId).catch(err => {
              logger.error(`[AntiDelete] messages.delete handleMessage error: ${err.message}`);
            });

          } catch (keyErr) {
            logger.error(`[AntiDelete] Key processing error: ${keyErr.message}`);
          }
        }
      } catch (err) {
        logger.error('[messages.delete] Handler error:', err.message);
      }
    });

    return sock;

  } catch (err) {
    console.error('BOT START ERROR:', err);
    throw err;
  }
}

// ─── STOP BOT ─────────────────────────────────────────────────────────────────
async function stopBot(sessionId) {
  try {
    if (reconnectTimers.has(sessionId)) {
      clearTimeout(reconnectTimers.get(sessionId));
      reconnectTimers.delete(sessionId);
    }

    reconnectAttempts.delete(sessionId);

    if (activeSockets.has(sessionId)) {
      try { activeSockets.get(sessionId).end(undefined); } catch (_) {}
      activeSockets.delete(sessionId);
    }

    removeBot(sessionId);
    await updateSession(sessionId, { status: 'inactive' }).catch(() => {});
    logger.info(`Bot ${sessionId} stopped`);
  } catch (e) {
    console.error(e);
  }
}

module.exports = { startBot, stopBot };
              
