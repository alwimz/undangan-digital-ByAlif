/**
 * Interaktivitas Web Undangan Pernikahan Tema Studio Wedding Adat Bugis
 * Tema Kelima: Luxury Studio Wedding, Editorial Photography & Bugis Heritage
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
  initThemeSwitcher();
});

/* ==========================================================================
   1. PARSING NAMA TAMU DARI PARAMETER URL
   ========================================================================== */
function initGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('u') || urlParams.get('nama') || urlParams.get('guest');
  
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
    weddingAudio.play().catch(e => console.log('Audio autoplay policy:', e));
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

      // Tampilkan animasi hero
      const heroReveals = document.querySelectorAll('#hero .reveal-on-scroll');
      heroReveals.forEach(el => el.classList.add('visible'));

      // Putar audio otomatis setelah interaksi pengguna
      if (weddingAudio) {
        weddingAudio.play().catch(e => console.log('Autoplay audio allowed after user click:', e));
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
   3. COUNTDOWN TIMER HARI H
   ========================================================================== */
function initCountdown() {
  // Tanggal Pernikahan: 12 Desember 2026, 08:30:00 WITA (UTC+8)
  const targetDate = new Date('2026-12-12T08:30:00+08:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('cdDays').textContent = '00';
      document.getElementById('cdHours').textContent = '00';
      document.getElementById('cdMinutes').textContent = '00';
      document.getElementById('cdSeconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    const elDays = document.getElementById('cdDays');
    const elHours = document.getElementById('cdHours');
    const elMinutes = document.getElementById('cdMinutes');
    const elSeconds = document.getElementById('cdSeconds');

    if (elDays) elDays.textContent = pad(days);
    if (elHours) elHours.textContent = pad(hours);
    if (elMinutes) elMinutes.textContent = pad(minutes);
    if (elSeconds) elSeconds.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }
}

/* ==========================================================================
   5. BUKU TAMU & RSVP INTERAKTIF (LOCAL STORAGE)
   ========================================================================== */
function initGuestbook() {
  const form = document.getElementById('rsvpForm');
  const wishesList = document.getElementById('wishesList');

  // Load awal ucapan dari localStorage
  loadWishes();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('rsvpName').value.trim();
      const attendance = document.getElementById('rsvpAttendance').value;
      const message = document.getElementById('rsvpMessage').value.trim();

      if (!name || !message) {
        showToast('Mohon lengkapi nama dan doa Anda');
        return;
      }

      const newWish = {
        id: Date.now(),
        name: name,
        status: attendance,
        message: message,
        time: 'Baru saja'
      };

      saveWish(newWish);
      prependWishToDOM(newWish);
      form.reset();
      showToast('Terima kasih atas doa & ucapan Anda!');
    });
  }
}

function loadWishes() {
  const wishesList = document.getElementById('wishesList');
  if (!wishesList) return;

  const saved = localStorage.getItem('bugis_studio_wishes');
  let wishes = [];

  if (saved) {
    try {
      wishes = JSON.parse(saved);
    } catch (e) {
      wishes = [];
    }
  }

  // Jika belum ada, isi dengan ucapan default keluarga & sahabat
  if (wishes.length === 0) {
    wishes = [
      {
        name: 'Andi Bau Massepe & Keluarga',
        status: 'hadir',
        message: 'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khoir. Selamat menempuh hidup baru Aswandi & Wira, semoga menjadi keluarga sakinah mawaddah warahmah.',
        time: '2 jam yang lalu'
      },
      {
        name: 'Drs. H. M. Arifin & Ibu',
        status: 'hadir',
        message: 'Salama\' ki tapada salama\'. Selamat berbahagia kedua mempelai dan kedua keluarga besar di Bone & Bulukumba.',
        time: '4 jam yang lalu'
      },
      {
        name: 'Rahmat Hidayat, S.T. & Rekan Studio',
        status: 'hadir',
        message: 'Keren sekali konsep photoshoot studio adat Bugis-nya bang! Doa terbaik untuk pernikahan Aswandi dan Wira langgeng sampai maut memisahkan.',
        time: '6 jam yang lalu'
      }
    ];
    localStorage.setItem('bugis_studio_wishes', JSON.stringify(wishes));
  }

  wishesList.innerHTML = '';
  wishes.forEach(wish => {
    appendWishToDOM(wish);
  });
}

function saveWish(newWish) {
  const saved = localStorage.getItem('bugis_studio_wishes');
  let wishes = [];
  if (saved) {
    try {
      wishes = JSON.parse(saved);
    } catch (e) {
      wishes = [];
    }
  }
  wishes.unshift(newWish);
  localStorage.setItem('bugis_studio_wishes', JSON.stringify(wishes));
}

function createWishHTML(wish) {
  let statusBadge = '';
  if (wish.status === 'hadir') {
    statusBadge = '<span class="wish-status status-hadir">Hadir</span>';
  } else if (wish.status === 'tidak') {
    statusBadge = '<span class="wish-status status-tidak">Berhalangan</span>';
  } else {
    statusBadge = '<span class="wish-status status-ragu">Ragu-ragu</span>';
  }

  return `
    <div class="wish-header">
      <span class="wish-name">${escapeHTML(wish.name)}</span>
      ${statusBadge}
    </div>
    <p class="wish-text">${escapeHTML(wish.message)}</p>
    <div class="wish-time">${wish.time}</div>
  `;
}

function appendWishToDOM(wish) {
  const wishesList = document.getElementById('wishesList');
  if (!wishesList) return;
  const div = document.createElement('div');
  div.className = 'wish-item';
  div.innerHTML = createWishHTML(wish);
  wishesList.appendChild(div);
}

function prependWishToDOM(wish) {
  const wishesList = document.getElementById('wishesList');
  if (!wishesList) return;
  const div = document.createElement('div');
  div.className = 'wish-item';
  div.innerHTML = createWishHTML(wish);
  wishesList.insertBefore(div, wishesList.firstChild);
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

/* ==========================================================================
   6. SALIN NOMOR REKENING (COPY TO CLIPBOARD)
   ========================================================================== */
function initCopyAccount() {
  const copyButtons = document.querySelectorAll('.btn-copy');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const accountNum = btn.getAttribute('data-account');
      if (!accountNum) return;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(accountNum).then(() => {
          showToast(`Nomor Rekening ${accountNum} berhasil disalin!`);
        }).catch(() => {
          fallbackCopyText(accountNum);
        });
      } else {
        fallbackCopyText(accountNum);
      }
    });
  });
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    showToast(`Nomor Rekening ${text} berhasil disalin!`);
  } catch (err) {
    showToast('Gagal menyalin nomor rekening');
  }

  document.body.removeChild(textArea);
}

function showToast(message) {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================================
   7. LIGHTBOX GALERI FOTO PREWEDDING
   ========================================================================== */
function initGalleryLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const btnClose = document.getElementById('lightboxClose');
  const galleryCards = document.querySelectorAll('.gallery-card');

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.querySelector('.gallery-caption');

      if (img && modal && modalImg) {
        modalImg.src = img.src;
        if (modalCaption && caption) {
          modalCaption.textContent = caption.textContent;
        }
        modal.classList.add('show');
        document.body.classList.add('lock-scroll');
      }
    });
  });

  if (btnClose) {
    btnClose.addEventListener('click', closeLightbox);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    if (modal) modal.classList.remove('show');
    document.body.classList.remove('lock-scroll');
  }
}

/* ==========================================================================
   8. BOTTOM NAVIGATION SCROLL SPY
   ========================================================================== */
function initBottomNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.bottom-nav a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
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

/* ==========================================================================
   9. PENGALIH TEMA (THEME SWITCHER)
   ========================================================================== */
function initThemeSwitcher() {
  const btn = document.getElementById('btnThemeSwitcher');
  const dropdown = document.getElementById('themeDropdown');

  if (btn && dropdown) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      dropdown.classList.remove('show');
    });

    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    if (window.location.search) {
      const options = dropdown.querySelectorAll('.theme-option');
      options.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.includes('?')) {
          link.setAttribute('href', href + window.location.search);
        }
      });
    }
  }
}
