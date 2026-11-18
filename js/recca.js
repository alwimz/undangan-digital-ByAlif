/**
 * Tema 10: Adat Bugis Makassar — Songko' Recca' (Hitam Keemasan)
 * Pernikahan Nur Akbar & Magfira
 * js/recca.js
 */

document.addEventListener('DOMContentLoaded', () => {
  initGuestName();
  initOpeningCover();
  initBackgroundMusic();
  initCountdown();
  initScrollReveal();
  initCopyAccount();
  initRSVP();
  initGalleryLightbox();
  initBottomNav();
});

/* ==========================================================================
   1. PARSE URL PARAMETER UNTUK NAMA TAMU
   ========================================================================== */
function initGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('tamu') || urlParams.get('u');
  
  if (guestName) {
    const cleanName = decodeURIComponent(guestName).replace(/\+/g, ' ');
    const guestElements = document.querySelectorAll('.dynamic-guest-name');
    guestElements.forEach(el => {
      el.textContent = cleanName;
    });
  }
}

/* ==========================================================================
   2. COVER PEMBUKA (OPENING COVER)
   ========================================================================== */
function initOpeningCover() {
  const cover = document.getElementById('openingCover');
  const openBtn = document.getElementById('btnOpenInvitation');
  const body = document.body;

  if (!cover || !openBtn) return;

  openBtn.addEventListener('click', () => {
    cover.classList.add('opened');
    body.classList.remove('lock-scroll');

    // Putar musik otomatis saat cover dibuka
    playAudio();

    // Trigger reveal pada section pertama
    setTimeout(() => {
      const hero = document.getElementById('hero');
      if (hero) {
        const reveals = hero.querySelectorAll('.reveal-on-scroll');
        reveals.forEach(r => r.classList.add('visible'));
      }
    }, 400);
  });
}

/* ==========================================================================
   3. BACKGROUND AUDIO CONTROLLER
   ========================================================================== */
let audioObj = null;
let isAudioPlaying = false;

function initBackgroundMusic() {
  const musicBtn = document.getElementById('musicToggleBtn');
  if (!musicBtn) return;

  audioObj = new Audio('assets/lagu.aac');
  audioObj.loop = true;
  audioObj.preload = 'auto';

  musicBtn.addEventListener('click', () => {
    if (isAudioPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });
}

function playAudio() {
  if (!audioObj) return;
  audioObj.play().then(() => {
    isAudioPlaying = true;
    const musicBtn = document.getElementById('musicToggleBtn');
    if (musicBtn) musicBtn.classList.add('playing');
  }).catch(() => {
    // Autoplay kebijakan browser dicegah jika belum ada interaksi
    isAudioPlaying = false;
  });
}

function pauseAudio() {
  if (!audioObj) return;
  audioObj.pause();
  isAudioPlaying = false;
  const musicBtn = document.getElementById('musicToggleBtn');
  if (musicBtn) musicBtn.classList.remove('playing');
}

/* ==========================================================================
   4. COUNTDOWN TIMER (28 JUNI 2026, 09:00 WITA)
   ========================================================================== */
function initCountdown() {
  // Target: 28 Juni 2026, 09:00:00 WITA (GMT+8)
  const targetDate = new Date('2026-06-28T09:00:00+08:00').getTime();

  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minutesEl = document.getElementById('countMinutes');
  const secondsEl = document.getElementById('countSeconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   5. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. SALIN NOMOR REKENING (CLIPBOARD)
   ========================================================================== */
function initCopyAccount() {
  const copyButtons = document.querySelectorAll('.btn-copy');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetNumber = btn.getAttribute('data-account');
      if (!targetNumber) return;

      navigator.clipboard.writeText(targetNumber).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Tersalin!`;
        btn.style.background = '#F5D061';
        btn.style.color = '#07080A';

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 2500);
      }).catch(() => {
        alert('Nomor rekening: ' + targetNumber);
      });
    });
  });
}

/* ==========================================================================
   7. RSVP & BUKU TAMU DENGAN LOCALSTORAGE
   ========================================================================== */
const STORAGE_KEY = 'recca_wedding_wishes';

const DEFAULT_WISHES = [
  {
    name: 'Puang Bau Tenri & Keluarga',
    status: 'Hadir',
    message: 'Salama\' ki tapada salama\'. Semoga ikrar suci ananda Nur Akbar & Magfira senantiasa dinaungi rahmat dan keberkahan Allah SWT, sakinah mawaddah warahmah.',
    time: 'Baru saja'
  },
  {
    name: 'Andi Mallombassang, S.H.',
    status: 'Hadir',
    message: 'Selamat berbahagia Akbar dan Magfira! Kemuliaan adat Bugis Songko\' Recca\' menjadi saksi keteguhan cinta kalian berdua. Aamiin ya Rabbal \'Alamin.',
    time: '2 jam yang lalu'
  },
  {
    name: 'Hj. Sitti Nurhalizah',
    status: 'Hadir',
    message: 'Barakallahu lakuma wa baraka \'alaikuma wa jama\'a bainakuma fii khoir. Turut berbangga atas pernikahan ananda berdua.',
    time: '5 jam yang lalu'
  }
];

function initRSVP() {
  const form = document.getElementById('rsvpForm');
  const wishesList = document.getElementById('wishesList');

  if (!wishesList) return;

  function loadWishes() {
    let wishes = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      wishes = stored ? JSON.parse(stored) : DEFAULT_WISHES;
    } catch {
      wishes = DEFAULT_WISHES;
    }

    wishesList.innerHTML = '';
    wishes.forEach(item => {
      const wishItem = document.createElement('div');
      wishItem.className = 'wish-item';
      wishItem.innerHTML = `
        <div class="wish-header">
          <span class="wish-name">${escapeHtml(item.name)}</span>
          <span class="wish-status">${escapeHtml(item.status)}</span>
        </div>
        <p class="wish-message">"${escapeHtml(item.message)}"</p>
        <div class="wish-time">${escapeHtml(item.time || 'Terkirim')}</div>
      `;
      wishesList.appendChild(wishItem);
    });
  }

  loadWishes();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvpName').value.trim();
      const status = document.getElementById('rsvpStatus').value;
      const message = document.getElementById('rsvpMessage').value.trim();

      if (!name || !message) return;

      let wishes = [];
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        wishes = stored ? JSON.parse(stored) : [...DEFAULT_WISHES];
      } catch {
        wishes = [...DEFAULT_WISHES];
      }

      const newWish = {
        name,
        status,
        message,
        time: 'Baru saja'
      };

      wishes.unshift(newWish);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));

      form.reset();
      loadWishes();

      alert('Terima kasih atas doa dan konfirmasi kehadiran Anda!');
    });
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

/* ==========================================================================
   8. LIGHTBOX PREVIEW GALERI
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  const modal = document.createElement('div');
  modal.id = 'galleryModal';
  modal.style.position = 'fixed';
  modal.style.inset = '0';
  modal.style.background = 'rgba(7, 8, 10, 0.96)';
  modal.style.display = 'none';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '10001';
  modal.style.cursor = 'zoom-out';
  modal.style.padding = '1.5rem';

  const modalImg = document.createElement('img');
  modalImg.style.maxWidth = '92vw';
  modalImg.style.maxHeight = '88vh';
  modalImg.style.borderRadius = '14px';
  modalImg.style.boxShadow = '0 16px 45px rgba(0,0,0,0.85), 0 0 25px rgba(245,208,97,0.45)';
  modalImg.style.border = '1px solid rgba(245,208,97,0.6)';
  modalImg.style.objectFit = 'contain';

  modal.appendChild(modalImg);
  document.body.appendChild(modal);

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      if (img) {
        modalImg.src = img.src;
        modal.style.display = 'flex';
      }
    });
  });

  modal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

/* ==========================================================================
   9. BOTTOM NAVIGATION ACTIVE STATE ON SCROLL
   ========================================================================== */
function initBottomNav() {
  const navLinks = document.querySelectorAll('.bottom-nav .nav-link');
  if (!navLinks.length) return;

  const targetIds = Array.from(navLinks).map(link => link.getAttribute('href').replace('#', ''));
  const sections = Array.from(document.querySelectorAll('section[id], header[id]'))
    .filter(s => targetIds.includes(s.getAttribute('id')));

  if (!sections.length) return;

  window.addEventListener('scroll', () => {
    let current = targetIds[0];
    const scrollPos = window.pageYOffset + 240;

    sections.forEach(section => {
      const top = section.offsetTop;
      if (scrollPos >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
