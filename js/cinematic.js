/**
 * Cinematic Editorial Drama — Digital Wedding Invitation
 * Nur Akbar & Magfira
 * js/cinematic.js
 */

document.addEventListener('DOMContentLoaded', () => {
  initGuestName();
  initOpeningCover();
  initMusic();
  initSlideAndZoomObserver();
  initHeroSlider();
  initCountdown();
  initLightbox();
  initCopyButtons();
  initRSVP();
  initBottomDock();
});

/* ==========================================================================
   1. GUEST NAME FROM URL
   ========================================================================== */
function initGuestName() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('to') || params.get('tamu') || params.get('u');
  if (!raw) return;

  const clean = decodeURIComponent(raw).replace(/\+/g, ' ').trim();
  if (!clean) return;

  document.querySelectorAll('.guest-name').forEach(el => {
    el.textContent = clean;
  });

  const nameInput = document.getElementById('rsvpName');
  if (nameInput && !nameInput.value) {
    nameInput.value = clean;
  }
}

/* ==========================================================================
   2. OPENING COVER CONTROLLER
   ========================================================================== */
function initOpeningCover() {
  const cover = document.getElementById('openingCover');
  const btn = document.getElementById('btnOpenCover');
  if (!cover || !btn) return;

  btn.addEventListener('click', () => {
    cover.classList.add('opened');
    document.body.classList.remove('lock-scroll');
    playMusic();

    // Trigger immediate animation for first hero elements
    setTimeout(() => {
      document.querySelectorAll('#hero [data-motion]').forEach(el => {
        el.classList.add('is-revealed');
      });
    }, 300);
  });
}

/* ==========================================================================
   3. BACKGROUND MUSIC CONTROLLER
   ========================================================================== */
let audio = null;
let isPlaying = false;

function initMusic() {
  const toggleBtn = document.getElementById('musicToggle');
  const domAudio = document.getElementById('weddingAudio');
  audio = domAudio || new Audio('assets/give-me-your-forever.mp3');
  audio.loop = true;
  audio.preload = 'auto';

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  });
}

function playMusic() {
  if (!audio) return;
  const toggleBtn = document.getElementById('musicToggle');
  audio.play().then(() => {
    isPlaying = true;
    if (toggleBtn) toggleBtn.classList.add('playing');
  }).catch(() => {
    isPlaying = false;
  });
}

function pauseMusic() {
  if (!audio) return;
  const toggleBtn = document.getElementById('musicToggle');
  audio.pause();
  isPlaying = false;
  if (toggleBtn) toggleBtn.classList.remove('playing');
}

/* ==========================================================================
   4. DRAMATIC SLIDE & ZOOM SCROLL OBSERVER
   ========================================================================== */
function initSlideAndZoomObserver() {
  const elements = document.querySelectorAll('[data-motion]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        // Once revealed, keep it or allow re-animation on deep scroll
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. HERO SLIDESHOW
   ========================================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length <= 1) return;

  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 6000);
}

/* ==========================================================================
   6. WEDDING COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  const targetDate = new Date('2026-12-12T08:00:00+07:00').getTime();

  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl = document.getElementById('cdMins');
  const secsEl = document.getElementById('cdSecs');

  if (!daysEl) return;

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = d < 10 ? '0' + d : d;
    hoursEl.textContent = h < 10 ? '0' + h : h;
    minsEl.textContent = m < 10 ? '0' + m : m;
    secsEl.textContent = s < 10 ? '0' + s : s;
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   7. FULLSCREEN LIGHTBOX
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const tiles = document.querySelectorAll('.gallery-tile');

  if (!modal || !img) return;

  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const tileImg = tile.querySelector('img');
      if (!tileImg) return;
      img.src = tileImg.src;
      modal.classList.add('active');
    });
  });

  const close = () => modal.classList.remove('active');
  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
}

/* ==========================================================================
   8. COPY TO CLIPBOARD & TOAST
   ========================================================================== */
function initCopyButtons() {
  const toast = document.getElementById('toast');
  const buttons = document.querySelectorAll('[data-copy]');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        showToast('Nomor rekening berhasil disalin!');
      }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Berhasil disalin!');
      });
    });
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

/* ==========================================================================
   9. RSVP & LOCALSTORAGE GUESTBOOK
   ========================================================================== */
function initRSVP() {
  const form = document.getElementById('rsvpForm');
  const list = document.getElementById('wishesList');
  if (!form || !list) return;

  const storageKey = 'wedding_wishes_cinematic';
  const defaultWishes = [
    { name: 'Andi Pratama & Keluarga', status: 'Hadir', text: 'Barakallahu lakum wa baraka alaikum. Selamat menempuh hidup baru untuk Akbar & Magfira! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.' },
    { name: 'Rina Salsabila', status: 'Hadir', text: 'Happy wedding! Semoga cinta kalian berdua abadi hingga akhir hayat. Cantik dan gagah sekali!' },
    { name: 'Dimas Setiawan', status: 'Hadir', text: 'Selamat menempuh babak baru yang penuh berkah brother Akbar! Semoga langgeng dan bahagia selalu.' }
  ];

  function getWishes() {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : defaultWishes;
    } catch (e) {
      return defaultWishes;
    }
  }

  function saveWishes(data) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {}
  }

  function render() {
    const data = getWishes();
    list.innerHTML = '';
    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'wish-item';
      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHTML(item.name)}</span>
          <span class="wish-status">${escapeHTML(item.status)}</span>
        </div>
        <p class="wish-text">${escapeHTML(item.text)}</p>
      `;
      list.appendChild(card);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rsvpName').value.trim();
    const status = document.getElementById('rsvpStatus').value;
    const text = document.getElementById('rsvpMessage').value.trim();

    if (!name || !text) return;

    const data = getWishes();
    data.unshift({ name, status, text });
    saveWishes(data);
    render();

    form.reset();
    showToast('Terima kasih atas doa restunya!');
  });

  render();
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ==========================================================================
   10. BOTTOM DOCK SCROLL SPY
   ========================================================================== */
function initBottomDock() {
  const items = document.querySelectorAll('.dock-item');
  const sections = document.querySelectorAll('section[id], footer[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) {
        currentId = sec.getAttribute('id');
      }
    });

    items.forEach(item => {
      const href = item.getAttribute('href');
      if (href === '#' + currentId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }, { passive: true });
}
