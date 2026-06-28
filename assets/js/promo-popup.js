/**
 * promo-popup.js — Kopi Saropah
 * Baca config dari localStorage, tampilkan popup promo otomatis.
 * Include di semua halaman website (sebelum </body>)
 */

(function () {
  const KEY = 'saropah_promo_config';
  const SEEN_SESSION = 'saropah_promo_seen_session';
  const SEEN_DAY     = 'saropah_promo_seen_day';

  function shouldShow(cfg) {
    if (!cfg || !cfg.active || !cfg.url) return false;
    if (cfg.freq === 'session') return !sessionStorage.getItem(SEEN_SESSION);
    if (cfg.freq === 'once') {
      const today = new Date().toDateString();
      return localStorage.getItem(SEEN_DAY) !== today;
    }
    return true; // 'always'
  }

  function markSeen(cfg) {
    if (cfg.freq === 'session') sessionStorage.setItem(SEEN_SESSION, '1');
    if (cfg.freq === 'once')    localStorage.setItem(SEEN_DAY, new Date().toDateString());
  }

  function inject() {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    let cfg;
    try { cfg = JSON.parse(raw); } catch(e) { return; }
    if (!shouldShow(cfg)) return;

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
      #sp-overlay {
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.82);
        z-index: 99999;
        display: flex; align-items: center; justify-content: center;
        padding: 1.25rem;
        animation: sp-fade-in 0.35s ease;
      }
      @keyframes sp-fade-in { from { opacity: 0; } to { opacity: 1; } }

      #sp-box {
        position: relative;
        width: 100%;
        animation: sp-scale-in 0.35s cubic-bezier(0.4,0,0.2,1);
      }
      @keyframes sp-scale-in { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }

      /* Portrait: narrower box */
      #sp-box.portrait  { max-width: min(360px, 88vw); }
      /* Landscape: wider box */
      #sp-box.landscape { max-width: min(600px, 92vw); }

      #sp-img {
        display: block;
        width: 100%; height: auto;
        border-radius: 10px;
        box-shadow: 0 12px 48px rgba(0,0,0,0.6);
      }

      #sp-close {
        position: absolute;
        top: -13px; right: -13px;
        width: 30px; height: 30px;
        background: #fff;
        border: none; border-radius: 50%;
        font-size: 1rem; line-height: 1;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        transition: background 0.2s, transform 0.15s;
        color: #111;
        z-index: 1;
      }
      #sp-close:hover { background: #eee; transform: scale(1.1); }

      #sp-cta {
        display: block;
        text-align: center;
        margin-top: 0.85rem;
        padding: 0.65rem 1.5rem;
        background: #fff;
        color: #111 !important;
        border-radius: 6px;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        text-decoration: none;
        transition: background 0.2s;
      }
      #sp-cta:hover { background: #e8e8e8; }

      @media (max-width: 400px) {
        #sp-box.portrait  { max-width: 92vw; }
        #sp-box.landscape { max-width: 96vw; }
        #sp-close { top: -10px; right: -10px; width: 26px; height: 26px; font-size: 0.85rem; }
      }
    `;
    document.head.appendChild(style);

    function buildPopup(isLandscape) {
      const overlay = document.createElement('div');
      overlay.id = 'sp-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Promo Kopi Saropah');

      const box = document.createElement('div');
      box.id = 'sp-box';
      box.className = isLandscape ? 'landscape' : 'portrait';

      const closeBtn = document.createElement('button');
      closeBtn.id = 'sp-close';
      closeBtn.innerHTML = '✕';
      closeBtn.setAttribute('aria-label', 'Tutup promo');

      const img = document.createElement('img');
      img.id  = 'sp-img';
      img.src = cfg.url;
      img.alt = 'Promo Kopi Saropah';

      box.appendChild(closeBtn);
      box.appendChild(img);

      if (cfg.link) {
        const cta = document.createElement('a');
        cta.id   = 'sp-cta';
        cta.href = cfg.link;
        cta.target = '_blank';
        cta.rel = 'noopener noreferrer';
        cta.textContent = 'Lihat Promo →';
        box.appendChild(cta);
      }

      overlay.appendChild(box);
      document.body.appendChild(overlay);

      function close() {
        overlay.style.animation = 'sp-fade-in 0.25s ease reverse';
        setTimeout(() => overlay.remove(), 220);
        markSeen(cfg);
      }

      closeBtn.addEventListener('click', close);
      overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
      document.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
      });
    }

    // Preload image to detect orientation BEFORE showing popup
    const probe = new Image();
    probe.onload = () => {
      const isLandscape = probe.naturalWidth >= probe.naturalHeight;
      buildPopup(isLandscape);
    };
    probe.onerror = () => buildPopup(true); // fallback landscape
    probe.src = cfg.url;
  }

  // Wait for delay then show
  const raw = localStorage.getItem(KEY);
  let delay = 3000;
  try { delay = JSON.parse(raw).delay ?? 3000; } catch(e) {}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(inject, delay));
  } else {
    setTimeout(inject, delay);
  }

})();
