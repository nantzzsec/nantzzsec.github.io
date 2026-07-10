/**
 * Cursor Particle Trail Effect
 * Portfolio — Cyber Security Theme
 *
 * - Pure vanilla JS, no external libraries
 * - CSS-based animations (GPU accelerated)
 * - Automatically disabled on touch/mobile devices
 * - Detects section data-cursor-theme for adaptive colors
 * - Max particle cap to keep performance smooth
 * - Safe: no user input, no external requests, pointer-events:none
 */

(function () {
  'use strict';

  // ── Guard: touch/mobile devices ──────────────────────────────
  if (window.matchMedia('(pointer: coarse)').matches) return;

  // ── Guard: reduced motion preference ─────────────────────────
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ── Config ────────────────────────────────────────────────────
  const CFG = {
    MAX_PARTICLES:  40,      // Hard cap on DOM particle elements
    SPAWN_DELAY_MS: 28,      // Minimum ms between spawn bursts
    SPAWN_COUNT_MIN: 1,      // Min particles per burst
    SPAWN_COUNT_MAX: 3,      // Max particles per burst
    LIFETIME_MIN:   500,     // ms
    LIFETIME_MAX:   750,     // ms
    SIZE_CLASSES:   ['p-sm', 'p-md', 'p-md', 'p-lg'], // weighted: more medium
    DRIFT_MIN:      8,       // px drift away from spawn point
    DRIFT_MAX:      22,      // px
    COLOR_COUNT:    4,       // number of color variants (c-0 … c-3)
  };

  // ── State ─────────────────────────────────────────────────────
  let mouseX       = -200;
  let mouseY       = -200;
  let lastSpawnAt  = 0;
  let activeCount  = 0;
  let currentTheme = 'dark';
  let isMoving     = false;
  let moveTimer    = null;

  // ── Create container ─────────────────────────────────────────
  const container = document.createElement('div');
  container.id = 'cursor-particle-container';
  container.setAttribute('aria-hidden', 'true');
  container.setAttribute('role', 'presentation');
  document.body.appendChild(container);

  // ── Theme detection ───────────────────────────────────────────
  /**
   * Walk up the element stack at (x, y) to find the nearest
   * ancestor (or self) with a data-cursor-theme attribute.
   * Falls back to 'dark'.
   */
  function detectTheme(x, y) {
    // elementsFromPoint returns elements ordered front-to-back
    try {
      const els = document.elementsFromPoint(x, y);
      for (let i = 0; i < els.length; i++) {
        const theme = els[i].dataset && els[i].dataset.cursorTheme;
        if (theme) return theme;
      }
    } catch (_) { /* ignore */ }
    return 'dark';
  }

  // ── Spawn one particle ────────────────────────────────────────
  function spawnParticle(x, y, theme) {
    if (activeCount >= CFG.MAX_PARTICLES) return;

    // Randomize properties
    const sizeClass = CFG.SIZE_CLASSES[Math.floor(Math.random() * CFG.SIZE_CLASSES.length)];
    const colorIdx  = Math.floor(Math.random() * CFG.COLOR_COUNT);
    const lifetime  = CFG.LIFETIME_MIN + Math.random() * (CFG.LIFETIME_MAX - CFG.LIFETIME_MIN);
    const drift     = CFG.DRIFT_MIN + Math.random() * (CFG.DRIFT_MAX - CFG.DRIFT_MIN);
    const angle     = Math.random() * Math.PI * 2; // full 360°
    const dx        = Math.cos(angle) * drift;
    const dy        = Math.sin(angle) * drift;
    const opacity   = 0.65 + Math.random() * 0.25; // 0.65–0.90

    // Build element
    const p = document.createElement('div');
    p.className = `cursor-particle ${sizeClass} theme-${theme} c-${colorIdx}`;
    p.style.cssText = [
      `left:${x}px`,
      `top:${y}px`,
      `--dx:${dx.toFixed(1)}px`,
      `--dy:${dy.toFixed(1)}px`,
      `--particle-duration:${lifetime.toFixed(0)}ms`,
      `--particle-opacity:${opacity.toFixed(2)}`,
    ].join(';');

    container.appendChild(p);
    activeCount++;

    // Remove after animation completes + small buffer
    const removeAt = lifetime + 60;
    setTimeout(function () {
      if (p.parentNode === container) {
        container.removeChild(p);
      }
      activeCount = Math.max(0, activeCount - 1);
    }, removeAt);
  }

  // ── Spawn burst ───────────────────────────────────────────────
  function spawnBurst(x, y, theme) {
    const count = CFG.SPAWN_COUNT_MIN +
      Math.floor(Math.random() * (CFG.SPAWN_COUNT_MAX - CFG.SPAWN_COUNT_MIN + 1));

    for (let i = 0; i < count; i++) {
      // Tiny offset so multiple particles don't stack exactly
      const ox = (Math.random() - 0.5) * 4;
      const oy = (Math.random() - 0.5) * 4;
      spawnParticle(x + ox, y + oy, theme);
    }
  }

  // ── Mouse move listener ───────────────────────────────────────
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const now = performance.now();
    if (now - lastSpawnAt < CFG.SPAWN_DELAY_MS) return;
    lastSpawnAt = now;

    // Re-detect theme (throttled by SPAWN_DELAY)
    currentTheme = detectTheme(mouseX, mouseY);

    spawnBurst(mouseX, mouseY, currentTheme);

    // Mark as moving (used to stop spawning when idle)
    isMoving = true;
    clearTimeout(moveTimer);
    moveTimer = setTimeout(function () { isMoving = false; }, 150);

  }, { passive: true });

  // ── Pause / resume on tab visibility ─────────────────────────
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      // Clear all particles when tab is hidden to save memory
      container.innerHTML = '';
      activeCount = 0;
    }
  });

  // ── Mouse leaves window: stop spawning ───────────────────────
  document.addEventListener('mouseleave', function () {
    isMoving = false;
  }, { passive: true });

  // ── Cursor custom style (optional ring) ──────────────────────
  // We intentionally do NOT override cursor: to keep default
  // pointer/crosshair behavior on links/buttons intact.

})();
