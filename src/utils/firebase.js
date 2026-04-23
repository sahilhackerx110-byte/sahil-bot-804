// ============================================================
//  SAHIL 804 BOT — Realtime Database Utilities
//  FIXED v4.3.0 — No duplicate Firebase init + Getter destructuring bug fixed!
//
//  IMPORTANT: Firebase Admin SDK is initialized ONLY in
//  src/firebase/config.js (single source of truth).
//  This file re-uses the shared admin instance from there.
//  DO NOT call admin.initializeApp() here.
// ============================================================

'use strict';

// ── Import shared admin instance (already initialized) ──
// Node.js require() is cached — same instance, no double-init
// ✅ FIX: Do NOT destructure getters — use live reference instead
const _fb = require('../firebase/config');
const admin = _fb.admin;

// ── Guard: if Firebase failed to init, all Realtime DB calls will throw cleanly ──
function requireInit() {
  if (!_fb.initOk || !_fb.rtdb) {
    throw new Error(
      '🔴 Realtime Database is not available — Firebase failed to initialize. ' +
      'Check FIREBASE_* environment variables.'
    );
  }
}

// ─── User management ─────────────────────────────────────

async function createUser(userId, userData = {}) {
  requireInit();
  const userRef = _fb.rtdb.ref(`users/${userId}`);
  await userRef.set({
    email:        userData.email        || '',
    phone:        userData.phone        || userData.whatsapp || '',
    passwordHash: userData.passwordHash || userData.password || '',
    approved:     false,
    createdAt:    Date.now(),
    subscription: { plan: 'none', expiresAt: 0, botsUsed: 0 },
  });
  return true;
}

async function getUser(userId) {
  requireInit();
  const snapshot = await _fb.rtdb.ref(`users/${userId}`).once('value');
  return snapshot.val();
}

async function approveUser(userId) {
  requireInit();
  await _fb.rtdb.ref(`users/${userId}/approved`).set(true);
}

async function getAllUsers() {
  requireInit();
  const snapshot = await _fb.rtdb.ref('users').once('value');
  return snapshot.val() || {};
}

async function setSubscription(userId, plan, expiresAt) {
  requireInit();
  await _fb.rtdb.ref(`users/${userId}/subscription`).set({
    plan,
    expiresAt,
    botsUsed: 0,
  });
}

async function incrementBotCount(userId) {
  requireInit();
  const ref      = _fb.rtdb.ref(`users/${userId}/subscription/botsUsed`);
  const snapshot = await ref.once('value');
  const current  = snapshot.val() || 0;
  await ref.set(current + 1);
}

// ─── Islamic content ──────────────────────────────────────

async function getIslamicContent(type, id) {
  requireInit();
  const snapshot = await _fb.rtdb.ref(`islamic/${type}/${id}`).once('value');
  return snapshot.val();
}

async function getAllQuran() {
  requireInit();
  const snapshot = await _fb.rtdb.ref('islamic/quran').once('value');
  return snapshot.val() || {};
}

async function getDuas() {
  requireInit();
  const snapshot = await _fb.rtdb.ref('islamic/duas').once('value');
  return snapshot.val() || {};
}

// ─── User websites ────────────────────────────────────────

async function createWebsite(userId, data) {
  requireInit();
  const websiteId = Date.now().toString();
  await _fb.rtdb.ref(`websites/${websiteId}`).set({
    userId,
    ...data,
    createdAt: Date.now(),
  });
  return websiteId;
}

async function getUserWebsites(userId) {
  requireInit();
  const snapshot = await _fb.rtdb.ref('websites')
    .orderByChild('userId')
    .equalTo(userId)
    .once('value');
  return snapshot.val() || {};
}

// ─── Admin settings ───────────────────────────────────────

async function getAdminSettings() {
  requireInit();
  const snapshot = await _fb.rtdb.ref('admin/settings').once('value');
  return snapshot.val() || {};
}

async function updateOwnerImage(imageUrl) {
  requireInit();
  await _fb.rtdb.ref('admin/settings/ownerImage').set(imageUrl);
}

module.exports = {
  createUser,
  getUser,
  approveUser,
  getAllUsers,
  setSubscription,
  incrementBotCount,
  getIslamicContent,
  getAllQuran,
  getDuas,
  createWebsite,
  getUserWebsites,
  getAdminSettings,
  updateOwnerImage,
};
