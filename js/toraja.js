/**
 * Interaktivitas Web Undangan Pernikahan Adat Suku Toraja
 * (Tema Kedua: Nuansa Rumah Adat Tongkonan & Makna Sosial Budaya)
 */

document.addEventListener('DOMContentLoaded', () => {
  initGuestName();
  initOpeningCover();
  initCountdown();
  // initParticleCanvas(); // Efek salju dinonaktifkan sesuai permintaan
  initScrollAnimations();
  initGuestbook();
  initCopyAccount();
  initGalleryLightbox();
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

    const rsvpNameInput = document.getElementById('rsvpName');
    if (rsvpNameInput) {
      rsvpNameInput.value = formattedName;
    }
  }
}

/* ==========================================================================
   2. COVER PEMBUKA & MUSIK SULING LEMBANG TORAJA
   ========================================================================== */
function initOpeningCover() {
  const cover = document.getElementById('openingCover');
  const btnOpen = document.getElementById('btnOpenInvitation');
  const musicToggle = document.getElementById('musicToggleBtn');

  document.body.classList.add('lock-scroll');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      cover.classList.add('opened');
      document.body.classList.remove('lock-scroll');

      const heroReveals = document.querySelectorAll('#hero .reveal-on-scroll');
      heroReveals.forEach(el => el.classList.add('visible'));

      if (window.torajaMusic) {
        window.torajaMusic.play();
      }

      const hero = document.getElementById('hero');
      if (hero) {
        hero.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (window.torajaMusic) {
        window.torajaMusic.toggle();
      }
    });
  }
}

/* ==========================================================================
   3. COUNTDOWN TIMER HARI H
   ========================================================================== */
function initCountdown() {
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
   4. KANVAS PARTIKEL BARA EMAS & KELOPAK MELATI TORAJA
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
      this.speedY = Math.random() * 0.9 + 0.35;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 1.5;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.type = Math.random() > 0.55 ? 1 : 0;
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
        // Serpihan Emas Pa'barre Allo Toraja
        ctx.fillStyle = '#FDE68A';
        ctx.shadowColor = '#E5A93B';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size * 0.7, 0);
        ctx.lineTo(0, this.size);
        ctx.lineTo(-this.size * 0.7, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        // Kelopak Bunga Melati Pengantin Putih Gading
        ctx.fillStyle = '#FDFBF7';
        ctx.shadowColor = '#FEF3C7';
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
   5. INTERSECTION OBSERVER
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
   6. BUKU TAMU & RSVP TORAJA (PERSISTENCE)
   ========================================================================== */
function initGuestbook() {
  const form = document.getElementById('rsvpForm');
  const wishesContainer = document.getElementById('wishesList');

  const defaultWishes = [
    {
      name: 'Puang Pongtambing & Keluarga Besar',
      attendance: 'hadir',
      text: "Kurre sumanga' kaboro'. Misa' kada dipotuo, pantan kada dipomate. Selamat mengikat janji suci pernikahan Rampanan Kapa'. Kiranya sang Pencipta senantiasa melimpahkan berkah, kedamaian, dan keturunan yang memuliakan marga pa'rapuan.",
      time: 'Baru saja'
    },
    {
      name: 'Ne\' Sambo & Istri (Keluarga Kete Kesu)',
      attendance: 'hadir',
      text: "Salama' sitammu rara buku. Sungguh berbahagia melihat ananda berdua bersanding di hadapan Tongkonan leluhur. Kiranya rumah tangga ananda kokoh laksana tiang Tulak Somba Tongkonan.",
      time: '1 jam yang lalu'
    },
    {
      name: 'dr. Martha Tandilangi\'',
      attendance: 'hadir',
      text: "Puji Syukur kepada Tuhan Yang Maha Pengasih. Selamat berbahagia untuk Aswandi & Wira! Sangkutu' banne dipotuo, rukun dan damai selalu hingga kakek nenek.",
      time: '2 jam yang lalu'
    }
  ];

  function loadWishes() {
    const stored = localStorage.getItem('wedding_toraja_wishes');
    let list = defaultWishes;
    if (stored) {
      try { list = JSON.parse(stored); } catch (e) { list = defaultWishes; }
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
    const stored = localStorage.getItem('wedding_toraja_wishes');
    let list = defaultWishes;
    if (stored) {
      try { list = JSON.parse(stored); } catch (e) {}
    }
    list.unshift(newWish);
    localStorage.setItem('wedding_toraja_wishes', JSON.stringify(list));
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
      showToast('Kurre Sumanga! Doa restu dan konfirmasi kehadiran Anda berhasil dikirim.');
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
   7. SALIN REKENING
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

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   9. BOTTOM NAVIGATION
   ========================================================================== */
function initBottomNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

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
