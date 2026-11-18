/**
 * Interaktivitas Web Undangan Pernikahan Tema Pantai Tanjung Bira Bulukumba
 * Tema Keempat: Modern Coastal Luxury, Pantai Pasir Putih, dan Keagungan Bahari
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
   1. PARSING NAMA TAMU DARI PARAMETER URL
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
   2. COVER PEMBUKA & PEMUTAR AUDIO
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
    weddingAudio.play().catch(e => console.log('Audio restriction:', e));
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

      const heroReveals = document.querySelectorAll('#hero .reveal-on-scroll');
      heroReveals.forEach(el => el.classList.add('visible'));

      if (weddingAudio) {
        weddingAudio.play().catch(e => console.log('Autoplay audio allowed after user click'));
      }

      const hero = document.getElementById('hero');
      if (hero) {
        hero.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ==========================================================================
   3. HITUNG MUNDUR (COUNTDOWN TIMER)
   ========================================================================== */
function initCountdown() {
  const targetDate = new Date('2026-06-28T09:00:00+08:00').getTime();

  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minutesEl) minutesEl.innerText = '00';
      if (secondsEl) secondsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   4. ANIMASI MUNCUL SAAT SCROLL
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
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add('visible'));
  }
}

/* ==========================================================================
   5. BUKU TAMU & RSVP (LOCALSTORAGE PERSISTENCE)
   ========================================================================== */
const DEFAULT_BIRA_WISHES = [
  {
    name: "Keluarga Besar Bulukumba & Bone",
    status: "hadir",
    message: "Selamat menempuh hidup baru untuk Aswandi & Wira. Semoga cinta kasih kalian abadi dan indah layaknya birunya laut Tanjung Bira.",
    time: "Baru saja"
  },
  {
    name: "Sahabat Bahari",
    status: "hadir",
    message: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khoir. Nuansa modern pantainya sangat memukau dan romantis!",
    time: "2 jam lalu"
  },
  {
    name: "Rekan Alumni",
    status: "hadir",
    message: "Selamat berbahagia! Semoga menjadi keluarga yang sakinah, mawaddah, dan penuh keberkahan.",
    time: "4 jam lalu"
  }
];

function initGuestbook() {
  const form = document.getElementById('rsvpForm');
  const wishesContainer = document.getElementById('wishesList');

  let savedWishes = [];
  try {
    savedWishes = JSON.parse(localStorage.getItem('bira_wedding_wishes')) || DEFAULT_BIRA_WISHES;
  } catch (e) {
    savedWishes = DEFAULT_BIRA_WISHES;
  }

  renderWishes(savedWishes);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('rsvpName').value.trim();
      const status = document.getElementById('rsvpStatus').value;
      const message = document.getElementById('rsvpMessage').value.trim();

      if (!name || !message) {
        alert('Mohon isi nama dan ucapan doa Anda.');
        return;
      }

      const newWish = {
        name: name,
        status: status,
        message: message,
        time: 'Baru saja'
      };

      savedWishes.unshift(newWish);

      try {
        localStorage.setItem('bira_wedding_wishes', JSON.stringify(savedWishes));
      } catch (err) {}

      renderWishes(savedWishes);
      form.reset();

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '✓ Ucapan Terkirim!';
        submitBtn.style.background = '#0284c7';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
        }, 2500);
      }
    });
  }

  function renderWishes(wishes) {
    if (!wishesContainer) return;
    wishesContainer.innerHTML = '';

    wishes.forEach(item => {
      const badgeText = item.status === 'hadir' ? 'Hadir' : item.status === 'ragu' ? 'Masih Ragu' : 'Tidak Hadir';
      const badgeClass = item.status || 'hadir';

      const div = document.createElement('div');
      div.className = 'wish-item';
      div.innerHTML = `
        <div class="wish-sender">
          <span>${escapeHTML(item.name)}</span>
          <span class="wish-badge ${badgeClass}">${badgeText}</span>
        </div>
        <p class="wish-text">${escapeHTML(item.message)}</p>
        <span class="wish-time">${item.time}</span>
      `;
      wishesContainer.appendChild(div);
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}

/* ==========================================================================
   6. SALIN NOMOR REKENING & ALAMAT
   ========================================================================== */
function initCopyAccount() {
  const copyButtons = document.querySelectorAll('.btn-copy');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetText = btn.getAttribute('data-copy');
      if (!targetText) return;

      navigator.clipboard.writeText(targetText).then(() => {
        const origHTML = btn.innerHTML;
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Tersalin!
        `;
        btn.classList.add('copied');

        setTimeout(() => {
          btn.innerHTML = origHTML;
          btn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        prompt('Salin nomor berikut:', targetText);
      });
    });
  });
}

/* ==========================================================================
   7. MODAL LIGHTBOX GALERI PREWEDDING
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!lightbox || !lightboxImg) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.classList.add('lock-scroll');
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('lock-scroll');
    lightboxImg.src = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   8. BOTTOM NAVIGATION SCROLLSPY
   ========================================================================== */
function initBottomNav() {
  const navLinks = document.querySelectorAll('.bottom-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}
