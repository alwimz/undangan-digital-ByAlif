/**
 * Modern Jakarta Editorial — Digital Wedding Invitation
 * Nur Akbar & Magfira
 * js/jakarta.js
 */

document.addEventListener('DOMContentLoaded', () => {
  initGuestName();
  initOpeningCover();
  initBackgroundMusic();
  initSlideshow('#desktopSlides', '.showcase-slide', '#desktopIndicators .indicator', 6500);
  initSlideshow('#heroSlides', '.hero-slide', null, 6500);
  initCountdown();
  initScrollReveal();
  initCopyButtons();
  initGalleryLightbox();
  initRSVP();
  initBottomNavSpy();
});

/* ==========================================================================
   1. GUEST NAME FROM URL (?to= / ?tamu= / ?u=)
   ========================================================================== */
function initGuestName() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('to') || params.get('tamu') || params.get('u');
  if (!raw) return;

  const clean = decodeURIComponent(raw).replace(/\+/g, ' ').trim();
  if (!clean) return;

  document.querySelectorAll('.dynamic-guest-name').forEach(el => {
    el.textContent = clean;
  });

  const nameInput = document.getElementById('rsvpName');
  if (nameInput && !nameInput.value) {
    nameInput.value = clean;
  }
}

/* ==========================================================================
   2. OPENING COVER SCREEN
   ========================================================================== */
function initOpeningCover() {
  const cover = document.getElementById('openingCover');
  const openBtn = document.getElementById('btnOpenInvitation');
  if (!cover || !openBtn) return;

  openBtn.addEventListener('click', () => {
    cover.classList.add('opened');
    document.body.classList.remove('lock-scroll');
    playAudio();

    setTimeout(() => {
      document.querySelectorAll('#hero .reveal-up, #hero .reveal-zoom').forEach(el => {
        el.classList.add('is-visible');
      });
    }, 280);
  });
}

/* ==========================================================================
   3. BACKGROUND MUSIC CONTROLLER
   ========================================================================== */
let weddingAudio = null;
let isMusicPlaying = false;

function initBackgroundMusic() {
  const btn = document.getElementById('musicToggleBtn');
  if (!btn) return;

  const domAudio = document.getElementById('weddingAudio');
  weddingAudio = domAudio || new Audio('assets/give-me-your-forever.mp3');
  weddingAudio.loop = true;
  weddingAudio.preload = 'auto';

  btn.addEventListener('click', () => {
    if (isMusicPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });
}

function playAudio() {
  if (!weddingAudio) return;
  const btn = document.getElementById('musicToggleBtn');

  weddingAudio.play().then(() => {
    isMusicPlaying = true;
    if (btn) btn.classList.add('playing');
  }).catch(() => {
    isMusicPlaying = false;
  });
}

function pauseAudio() {
  if (!weddingAudio) return;
  const btn = document.getElementById('musicToggleBtn');

  weddingAudio.pause();
  isMusicPlaying = false;
  if (btn) btn.classList.remove('playing');
}

/* ==========================================================================
   4. KEN BURNS ZOOM-OUTWARD COUPLE SLIDESHOW
   ========================================================================== */
function initSlideshow(containerSelector, slideSelector, indicatorSelector, intervalMs) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const slides = Array.from(container.querySelectorAll(slideSelector));
  if (slides.length <= 1) return;

  const indicators = indicatorSelector ? Array.from(document.querySelectorAll(indicatorSelector)) : [];
  let currentIndex = 0;

  setInterval(() => {
    slides[currentIndex].classList.remove('active');
    if (indicators[currentIndex]) indicators[currentIndex].classList.remove('active');

    currentIndex = (currentIndex + 1) % slides.length;
    const nextSlide = slides[currentIndex];
    const nextImg = nextSlide.querySelector('img');

    // Restart zoom-from-inside-outward cleanly on the newly active slide
    if (nextImg) {
      nextImg.style.animation = 'none';
      void nextImg.offsetWidth;
      nextImg.style.animation = '';
    }

    nextSlide.classList.add('active');
    if (indicators[currentIndex]) indicators[currentIndex].classList.add('active');
  }, intervalMs);
}

/* ==========================================================================
   5. LIVE COUNTDOWN TIMER (12 DESEMBER 2026, 08:00 WIB)
   ========================================================================== */
function initCountdown() {
  const targetMs = new Date('2026-12-12T08:00:00+07:00').getTime();
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function tick() {
    const diff = targetMs - Date.now();
    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

/* ==========================================================================
   6. SCROLL REVEAL & PHOTO ZOOM BLOOM
   ========================================================================== */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-zoom');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -36px 0px'
  });

  targets.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. COPY ACCOUNT / ADDRESS + TOAST FEEDBACK
   ========================================================================== */
let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Teks';
      if (!text) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`${label} berhasil disalin`);
        }).catch(() => {
          fallbackCopy(text, label);
        });
      } else {
        fallbackCopy(text, label);
      }
    });
  });
}

function fallbackCopy(text, label) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast(`${label} berhasil disalin`);
  } catch {
    alert(`${label}: ${text}`);
  }
  document.body.removeChild(ta);
}

/* ==========================================================================
   8. FULLSCREEN GALLERY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const modal = document.getElementById('photoLightbox');
  const imgEl = document.getElementById('lightboxImg');
  const captionEl = document.getElementById('lightboxCaption');
  const counterEl = document.getElementById('lightboxCounter');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const cards = Array.from(document.querySelectorAll('.gallery-card'));

  if (!modal || !imgEl || !cards.length) return;

  const photos = cards.map(card => {
    const img = card.querySelector('img');
    const cap = card.querySelector('.gallery-cap');
    return {
      src: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') : '',
      caption: cap ? cap.textContent.trim() : ''
    };
  });

  let activeIdx = 0;

  function renderLightbox(index) {
    activeIdx = (index + photos.length) % photos.length;
    const item = photos[activeIdx];
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    captionEl.textContent = item.caption;
    counterEl.textContent = `${activeIdx + 1} / ${photos.length}`;
  }

  function openLightbox(index) {
    renderLightbox(index);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  cards.forEach((card, idx) => {
    card.addEventListener('click', () => openLightbox(idx));
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => renderLightbox(activeIdx - 1));
  nextBtn.addEventListener('click', () => renderLightbox(activeIdx + 1));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') renderLightbox(activeIdx - 1);
    if (e.key === 'ArrowRight') renderLightbox(activeIdx + 1);
  });
}

/* ==========================================================================
   9. RSVP & GUESTBOOK WISHES (LOCALSTORAGE)
   ========================================================================== */
const JAKARTA_WISHES_KEY = 'jakarta_wedding_wishes_v1';

const DEFAULT_WISHES = [
  {
    name: 'dr. Nadya Kusuma & Pasangan',
    status: 'Hadir',
    guests: '2 Orang',
    message: 'Selamat menempuh hidup baru Akbar & Magfira! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah dan selalu diberkahi kebahagiaan.',
    time: '1 jam yang lalu'
  },
  {
    name: 'Raka Pratama',
    status: 'Hadir',
    guests: '2 Orang',
    message: 'Happy wedding bro Akbar & Magfira! Lancar terus sampai hari H, see you di Kemang!',
    time: '3 jam yang lalu'
  },
  {
    name: 'Siti Rahmawati',
    status: 'Hadir',
    guests: '1 Orang',
    message: 'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khoir. Semoga cinta kalian langgeng hingga jannah.',
    time: '5 jam yang lalu'
  }
];

function initRSVP() {
  const form = document.getElementById('rsvpForm');
  const listEl = document.getElementById('wishesList');
  const statHadir = document.getElementById('statHadir');
  const statRagu = document.getElementById('statRagu');
  const statTidak = document.getElementById('statTidak');

  if (!listEl) return;

  function getWishes() {
    try {
      const saved = localStorage.getItem(JAKARTA_WISHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return [...DEFAULT_WISHES];
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem(JAKARTA_WISHES_KEY, JSON.stringify(wishes));
    } catch {
      // ignore storage errors
    }
  }

  function renderWishes() {
    const wishes = getWishes();
    let countHadir = 0;
    let countRagu = 0;
    let countTidak = 0;

    listEl.innerHTML = '';

    wishes.forEach(item => {
      if (item.status === 'Hadir') countHadir++;
      else if (item.status === 'Belum Pasti') countRagu++;
      else countTidak++;

      const badgeClass =
        item.status === 'Hadir' ? 'hadir' :
        item.status === 'Belum Pasti' ? 'ragu' : 'tidak';

      const initials = getInitials(item.name);

      const card = document.createElement('div');
      card.className = 'wish-card';
      card.innerHTML = `
        <div class="wish-top">
          <div class="wish-author-wrap">
            <span class="wish-avatar">${escapeHtml(initials)}</span>
            <span class="wish-author">${escapeHtml(item.name)}</span>
          </div>
          <span class="wish-badge ${badgeClass}">${escapeHtml(item.status)}</span>
        </div>
        <p class="wish-body">${escapeHtml(item.message)}</p>
        <div class="wish-meta">${escapeHtml(item.guests || '1 Orang')} &bull; ${escapeHtml(item.time || 'Baru saja')}</div>
      `;
      listEl.appendChild(card);
    });

    if (statHadir) statHadir.textContent = String(countHadir);
    if (statRagu) statRagu.textContent = String(countRagu);
    if (statTidak) statTidak.textContent = String(countTidak);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvpName').value.trim();
      const status = document.getElementById('rsvpStatus').value;
      const guests = document.getElementById('rsvpGuests').value;
      const message = document.getElementById('rsvpMessage').value.trim();

      if (!name || !message) return;

      const wishes = getWishes();
      wishes.unshift({
        name,
        status,
        guests,
        message,
        time: 'Baru saja'
      });

      saveWishes(wishes);
      renderWishes();

      document.getElementById('rsvpMessage').value = '';
      showToast('Terima kasih! Konfirmasi & ucapan Anda terkirim');
    });
  }

  renderWishes();
}

function getInitials(name) {
  const parts = String(name || 'T').trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ==========================================================================
   10. BOTTOM NAVIGATION SCROLL-SPY
   ========================================================================== */
function initBottomNavSpy() {
  const links = Array.from(document.querySelectorAll('.bottom-nav .nav-item'));
  if (!links.length) return;

  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function updateActive() {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let currentId = sections[0] ? sections[0].id : 'hero';

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) {
        currentId = sec.id;
      }
    });

    links.forEach(link => {
      const isMatch = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isMatch);
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}
