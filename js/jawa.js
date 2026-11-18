/**
 * Interaktivitas Web Undangan Pernikahan Tema Adat Jawa Klasik & Modern
 * Pawiwahan Ageng Aswandi Syam, S.T. & Wira Kartika Putri, S.Pd.
 */

document.addEventListener('DOMContentLoaded', () => {
  initGuestName();
  initOpeningCover();
  initCountdown();
  initScrollAnimations();
  initGuestbook();
  initCopyAccount();
  initGalleryLightbox();
  initBottomNav();
  initAudioPlayer();
});

/* ==========================================================================
   1. PARSING NAMA TAMU DARI URL PARAMETER
   ========================================================================== */
function initGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('u') || urlParams.get('nama');

  if (guestName) {
    const formattedName = decodeURIComponent(guestName.replace(/\+/g, ' '));
    const guestDisplays = document.querySelectorAll('.dynamic-guest-name');
    guestDisplays.forEach(el => {
      el.textContent = formattedName;
    });

    const rsvpNameInput = document.getElementById('rsvpName');
    if (rsvpNameInput) {
      rsvpNameInput.value = formattedName;
    }
  }
}

/* ==========================================================================
   2. COVER PEMBUKA & AUDIO PLAYER
   ========================================================================== */
let audioPlaying = false;
let weddingAudio = null;

function initAudioPlayer() {
  weddingAudio = document.getElementById('weddingAudio');
  const musicToggle = document.getElementById('musicToggleBtn');

  if (weddingAudio) {
    weddingAudio.addEventListener('play', () => {
      audioPlaying = true;
      if (musicToggle) musicToggle.classList.add('playing');
    });
    weddingAudio.addEventListener('pause', () => {
      audioPlaying = false;
      if (musicToggle) musicToggle.classList.remove('playing');
    });
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      toggleMusic();
    });
  }
}

function toggleMusic() {
  if (!weddingAudio) return;
  if (audioPlaying) {
    weddingAudio.pause();
  } else {
    weddingAudio.play().catch(e => console.log('Audio playback prevented:', e));
  }
}

function initOpeningCover() {
  const cover = document.getElementById('openingCover');
  const btnOpen = document.getElementById('btnOpenInvitation');

  document.body.classList.add('lock-scroll');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      if (cover) {
        cover.classList.add('opened');
      }
      document.body.classList.remove('lock-scroll');

      // Aktifkan elemen animasi hero
      const heroReveals = document.querySelectorAll('#hero .reveal-on-scroll');
      heroReveals.forEach(el => el.classList.add('visible'));

      // Putar musik setelah interaksi klik
      if (weddingAudio) {
        weddingAudio.play().catch(e => console.log('Autoplay audio allowed after user click'));
      }

      // Scroll halus ke hero
      const hero = document.getElementById('hero');
      if (hero) {
        hero.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ==========================================================================
   3. COUNTDOWN TIMER MENUJU 28 JUNI 2026 09:00 WITA
   ========================================================================== */
function initCountdown() {
  // 28 Juni 2026, 09:00 WITA (UTC+8)
  const targetDate = new Date('2026-06-28T09:00:00+08:00').getTime();

  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minsEl = document.getElementById('countMins');
  const secsEl = document.getElementById('countSecs');

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   4. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback jika browser lawas
    elements.forEach(el => el.classList.add('visible'));
  }
}

/* ==========================================================================
   5. BUKU TAMU & RSVP REALTIME (LOCALSTORAGE)
   ========================================================================== */
const STORAGE_KEY = 'jawa_wedding_wishes';

const DEFAULT_WISHES = [
  {
    name: 'Raden Mas Haryo & Ibu',
    status: 'hadir',
    message: 'Ndherek mangayubagya awit dhaupipun Mas Aswandi kaliyan Mbak Wira. Mugi Gusti tansah paring berkah, dados kulawarga ingkang sakinah mawaddah warahmah, rukun hayu tentrem.',
    time: 'Baru saja'
  },
  {
    name: 'Kanjeng Raden Ayu Sekar',
    status: 'hadir',
    message: 'Wilujeng nampi kersaning Hyang Widhi. Selamat menempuh hidup baru Mas Aswandi & Mbak Wira, semoga langgeng salaminya.',
    time: '1 jam yang lalu'
  },
  {
    name: 'Dimas Wicaksono, S.T.',
    status: 'hadir',
    message: 'Selamat saudaraku Aswandi! Semoga lancar ijab qobul dan prosesi panggih adat Jawa. Berkah selalu untuk kedua mempelai.',
    time: '2 jam yang lalu'
  }
];

function initGuestbook() {
  const form = document.getElementById('rsvpForm');
  const wishesList = document.getElementById('wishesList');

  function getWishes() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_WISHES;
    } catch (e) {
      return DEFAULT_WISHES;
    }
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch (e) {
      console.log('Error saving wishes:', e);
    }
  }

  function renderWishes() {
    if (!wishesList) return;
    const wishes = getWishes();
    wishesList.innerHTML = '';

    wishes.forEach(item => {
      const wishItem = document.createElement('div');
      wishItem.className = 'wish-item';

      let statusBadge = '<span class="wish-badge hadir">Insya Allah Hadir</span>';
      if (item.status === 'tidak') {
        statusBadge = '<span class="wish-badge tidak">Berhalangan</span>';
      } else if (item.status === 'ragu') {
        statusBadge = '<span class="wish-badge">Masih Ragu</span>';
      }

      wishItem.innerHTML = `
        <div class="wish-sender">
          <span>${escapeHTML(item.name)}</span>
          ${statusBadge}
        </div>
        <p class="wish-text">${escapeHTML(item.message)}</p>
        <div class="wish-time">${escapeHTML(item.time || 'Baru saja')}</div>
      `;
      wishesList.appendChild(wishItem);
    });
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('rsvpName');
      const statusInput = document.getElementById('rsvpStatus');
      const msgInput = document.getElementById('rsvpMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const status = statusInput ? statusInput.value : 'hadir';
      const message = msgInput ? msgInput.value.trim() : '';

      if (!name || !message) return;

      const newWish = {
        name,
        status,
        message,
        time: 'Baru saja'
      };

      const currentWishes = getWishes();
      currentWishes.unshift(newWish);
      saveWishes(currentWishes);
      renderWishes();

      if (msgInput) msgInput.value = '';

      showToast('Matur nuwun! Ucapan & konfirmasi panjenengan sampun katampi.');
    });
  }

  renderWishes();
}

/* ==========================================================================
   6. SALIN NOMOR REKENING (COPY TO CLIPBOARD)
   ========================================================================== */
function initCopyAccount() {
  const copyBtns = document.querySelectorAll('.btn-copy-account');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const accountNum = btn.getAttribute('data-account');
      if (!accountNum) return;

      navigator.clipboard.writeText(accountNum).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Tersalin!
        `;
        btn.style.background = '#D4AF37';
        btn.style.color = '#1A0F08';

        showToast(`Nomor rekening ${accountNum} berhasil disalin!`);

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 2200);
      }).catch(err => {
        showToast('Gagal menyalin nomor rekening');
      });
    });
  });
}

/* ==========================================================================
   7. TOAST NOTIFIKASI
   ========================================================================== */
function showToast(msg) {
  let toast = document.getElementById('jawaToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'jawaToast';
    toast.style.position = 'fixed';
    toast.style.bottom = '85px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%) translateY(30px)';
    toast.style.background = 'rgba(26, 15, 8, 0.94)';
    toast.style.color = '#F6E6B4';
    toast.style.border = '1px solid #D4AF37';
    toast.style.padding = '0.75rem 1.4rem';
    toast.style.borderRadius = '50px';
    toast.style.fontSize = '0.85rem';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.6)';
    toast.style.zIndex = '10002';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)';
    toast.style.pointerEvents = 'none';
    toast.style.textAlign = 'center';
    toast.style.maxWidth = '90%';
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(30px)';
  }, 2600);
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
  modal.style.background = 'rgba(12, 6, 3, 0.94)';
  modal.style.display = 'none';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '10001';
  modal.style.cursor = 'zoom-out';
  modal.style.padding = '1.5rem';

  const modalImg = document.createElement('img');
  modalImg.style.maxWidth = '92vw';
  modalImg.style.maxHeight = '88vh';
  modalImg.style.borderRadius = '12px';
  modalImg.style.boxShadow = '0 12px 40px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.4)';
  modalImg.style.border = '1px solid rgba(212,175,55,0.5)';
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
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.bottom-nav .nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 240;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
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
