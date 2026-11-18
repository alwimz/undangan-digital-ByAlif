/**
 * Script Interaktivitas Web Undangan Pernikahan Bugis-Makassar
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Parsing Nama Tamu dari Parameter URL (?to=... atau ?u=...)
  initGuestName();

  // 2. Inisialisasi Cover & Musik Pembuka
  initOpeningCover();

  // 3. Hitung Mundur (Countdown Timer) Menuju Hari H
  initCountdown();

  // 4. Kanvas Partikel Serpihan Emas & Bunga Melati Melayang
  // initParticleCanvas(); // Efek partikel salju/bunga dinonaktifkan sesuai permintaan

  // 5. Animasi Muncul saat Scroll (Intersection Observer)
  initScrollAnimations();

  // 6. Buku Tamu & RSVP (LocalStorage Persistence)
  initGuestbook();

  // 7. Salin Nomor Rekening (Copy to Clipboard)
  initCopyAccount();

  // 8. Lightbox Modal Galeri Foto
  initGalleryLightbox();

  // 9. Bottom Navigation Highlight
  initBottomNav();
});

/* ==========================================================================
   1. PARSING NAMA TAMU
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

    // Otomatis isi kolom nama di form RSVP jika ada
    const rsvpNameInput = document.getElementById('rsvpName');
    if (rsvpNameInput) {
      rsvpNameInput.value = formattedName;
    }
  }
}

/* ==========================================================================
   2. COVER PEMBUKA & KONTROL MUSIK
   ========================================================================== */
function initOpeningCover() {
  const cover = document.getElementById('openingCover');
  const btnOpen = document.getElementById('btnOpenInvitation');
  const musicToggle = document.getElementById('musicToggleBtn');

  // Kunci scroll saat cover masih tampil
  document.body.classList.add('lock-scroll');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      // Buka cover
      cover.classList.add('opened');
      document.body.classList.remove('lock-scroll');

      // Munculkan elemen hero
      const heroReveals = document.querySelectorAll('#hero .reveal-on-scroll');
      heroReveals.forEach(el => el.classList.add('visible'));

      // Putar musik instrumen Bugis
      if (window.bugisMusic) {
        window.bugisMusic.play();
      }

      // Scroll halus ke hero
      const hero = document.getElementById('hero');
      if (hero) {
        hero.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Toggle Play / Pause Musik
  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (window.bugisMusic) {
        window.bugisMusic.toggle();
      }
    });
  }
}

/* ==========================================================================
   3. COUNTDOWN TIMER HARI H PERNIKAHAN
   ========================================================================== */
function initCountdown() {
  // Target Tanggal: 12 Desember 2026 (atau sesuaikan kebutuhan)
  const targetDate = new Date('2026-12-12T09:00:00+08:00').getTime();

  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   4. KANVAS PARTIKEL SERPIHAN EMAS & KEMBANG GOYANG
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = 45;
  const particles = [];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 4 + 2;
      this.speedY = Math.random() * 0.9 + 0.4;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 1.5;
      this.opacity = Math.random() * 0.7 + 0.3;
      // Jenis: 0 = serpihan emas (gold flake), 1 = kelopak bunga melati (jasmine petal)
      this.type = Math.random() > 0.6 ? 1 : 0;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.015) * 0.5 + this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      if (this.type === 0) {
        // Serpihan Emas Khas Baju Bodo
        ctx.fillStyle = '#FCF6BA';
        ctx.shadowColor = '#D4AF37';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size * 0.7, 0);
        ctx.lineTo(0, this.size);
        ctx.lineTo(-this.size * 0.7, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        // Kelopak Bunga Melati Pengantin Bugis
        ctx.fillStyle = '#FFFBEB';
        ctx.shadowColor = '#FFEAA7';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.8, this.size * 1.3, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(loop);
  }

  loop();
}

/* ==========================================================================
   5. INTERSECTION OBSERVER (FADE-IN ANIMATIONS)
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. BUKU TAMU & RSVP (LOCALSTORAGE PERSISTENCE)
   ========================================================================== */
function initGuestbook() {
  const form = document.getElementById('rsvpForm');
  const wishesContainer = document.getElementById('wishesList');

  // Ucapan Awal Bawaan Bertema Bugis-Makassar yang Autentik
  const defaultWishes = [
    {
      name: 'Puang H. Bau Tenri & Keluarga',
      attendance: 'hadir',
      text: "Salama' ki tapada salama'. Barakallahu laka wa baraka 'alaika wa jama'a bainakuma fii khoir. Selamat mengarungi bahtera rumah tangga anakda berdua. Sipakatau, sipakalebbi, sipakainge selalu.",
      time: 'Baru saja'
    },
    {
      name: 'Daeng Mangngawing & Istri',
      attendance: 'hadir',
      text: "Kurru sumange'! Bahagia sekali melihat ananda berdua bersanding dalam balutan busana adat Bugis yang megah. InsyaAllah langgeng hingga kakek nenek, sakinah mawaddah warahmah.",
      time: '1 jam yang lalu'
    },
    {
      name: 'Andi Batari Toja',
      attendance: 'hadir',
      text: "Masya Allah Tabarakallah cantiknya Baju Bodo dan Saloko Wira Kartika, gagahnya Daeng Aswandi. Selamat berbahagia sahabatku, dilimpahkan berkah dan rezeki yang melimpah!",
      time: '3 jam yang lalu'
    }
  ];

  // Muat data dari localStorage atau gunakan default
  function loadWishes() {
    const stored = localStorage.getItem('wedding_bugis_wishes');
    let list = defaultWishes;
    if (stored) {
      try {
        list = JSON.parse(stored);
      } catch (e) {
        list = defaultWishes;
      }
    }
    renderWishes(list);
  }

  function renderWishes(list) {
    if (!wishesContainer) return;
    wishesContainer.innerHTML = '';

    list.forEach(item => {
      const wishEl = document.createElement('div');
      wishEl.className = 'wish-item';
      
      const attendanceClass = item.attendance === 'hadir' ? 'hadir' : (item.attendance === 'tidak' ? 'tidak-hadir' : 'ragu');
      const attendanceLabel = item.attendance === 'hadir' ? '✓ Akan Hadir' : (item.attendance === 'tidak' ? '✗ Berhalangan' : '? Ragu-ragu');

      wishEl.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHtml(item.name)}</span>
          <span class="wish-attendance ${attendanceClass}">${attendanceLabel}</span>
        </div>
        <p class="wish-text">${escapeHtml(item.text)}</p>
        <span class="wish-time">${escapeHtml(item.time || 'Baru saja')}</span>
      `;

      wishesContainer.appendChild(wishEl);
    });
  }

  function saveWish(newWish) {
    const stored = localStorage.getItem('wedding_bugis_wishes');
    let list = defaultWishes;
    if (stored) {
      try { list = JSON.parse(stored); } catch (e) {}
    }
    list.unshift(newWish);
    localStorage.setItem('wedding_bugis_wishes', JSON.stringify(list));
    renderWishes(list);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvpName').value.trim();
      const attendance = document.getElementById('rsvpAttendance').value;
      const text = document.getElementById('rsvpMessage').value.trim();

      if (!name || !text) {
        showToast('Mohon lengkapi nama dan doa restu Anda.');
        return;
      }

      const newWish = {
        name: name,
        attendance: attendance,
        text: text,
        time: 'Baru saja'
      };

      saveWish(newWish);
      form.reset();
      showToast('Kurru Sumange! Doa dan konfirmasi kehadiran Anda berhasil dikirim.');
    });
  }

  loadWishes();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

/* ==========================================================================
   7. SALIN REKENING (COPY TO CLIPBOARD)
   ========================================================================== */
function initCopyAccount() {
  const copyButtons = document.querySelectorAll('.btn-copy');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetNumber = btn.getAttribute('data-account');
      if (targetNumber) {
        navigator.clipboard.writeText(targetNumber).then(() => {
          showToast(`Nomor rekening ${targetNumber} berhasil disalin!`);
        }).catch(() => {
          // Fallback manual jika clipboard api diblokir
          const temp = document.createElement('textarea');
          temp.value = targetNumber;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
          showToast(`Nomor rekening ${targetNumber} berhasil disalin!`);
        });
      }
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
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
   8. LIGHTBOX MODAL GALERI FOTO
   ========================================================================== */
function initGalleryLightbox() {
  const modal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('closeLightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!modal || !modalImg) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        modalImg.src = img.src;
        modal.classList.add('active');
        document.body.classList.add('lock-scroll');
      }
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('lock-scroll');
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   9. BOTTOM NAVIGATION ACTIVE HIGHLIGHT
   ========================================================================== */
function initBottomNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  // Smooth scroll saat tombol nav diklik
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
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
