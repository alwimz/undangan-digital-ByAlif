/**
 * THE WEDDING OF NUR AKBAR & MAGFIRA — MODERN RED & WHITE THEME
 * js/merahputih.js
 * Handles Cover Opening, Audio Playback, Zoom-Out Scroll Reveals,
 * Countdown, Gallery Lightbox, Copy Actions, and RSVP Guestbook
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Guest Name URL Parameter Handling (?to=...)
  const urlParams = new URLSearchParams(window.location.search);
  const rawGuestName = urlParams.get('to') || urlParams.get('guest') || urlParams.get('u');
  const guestDisplay = document.getElementById('coverGuestName');
  const rsvpNameInput = document.getElementById('rsvpName');

  if (rawGuestName) {
    const cleanGuestName = decodeURIComponent(rawGuestName.replace(/\+/g, ' ')).trim();
    if (guestDisplay) {
      guestDisplay.textContent = cleanGuestName;
    }
    if (rsvpNameInput) {
      rsvpNameInput.value = cleanGuestName;
    }
  }

  // 2. Audio & Cover Unlock Interaction
  const coverScreen = document.getElementById('coverScreen');
  const btnOpenInvitation = document.getElementById('btnOpenInvitation');
  const audio = document.getElementById('weddingAudio');
  const musicFab = document.getElementById('musicFab');
  let isPlaying = false;

  function playAudio() {
    if (!audio) return;
    audio.play().then(() => {
      isPlaying = true;
      if (musicFab) musicFab.classList.add('playing');
    }).catch(err => {
      console.warn('Audio auto-play prevented:', err);
    });
  }

  function pauseAudio() {
    if (!audio) return;
    audio.pause();
    isPlaying = false;
    if (musicFab) musicFab.classList.remove('playing');
  }

  if (btnOpenInvitation && coverScreen) {
    btnOpenInvitation.addEventListener('click', () => {
      // Unlock Scroll
      document.body.classList.remove('lock-scroll');
      coverScreen.classList.add('opened');

      // Add dynamic zoom-out reveal animations to container & hero
      const appContainer = document.querySelector('.app-container');
      const heroCard = document.querySelector('.hero-inner-card');

      if (appContainer) {
        appContainer.classList.add('opening-zoom-out');
        setTimeout(() => appContainer.classList.remove('opening-zoom-out'), 1500);
      }
      if (heroCard) {
        heroCard.classList.add('hero-zoom-reveal');
        setTimeout(() => heroCard.classList.remove('hero-zoom-reveal'), 1600);
      }

      // Play Background Audio
      playAudio();

      // Trigger Hero in-view reveal after cover opens
      setTimeout(() => {
        const heroReveals = document.querySelectorAll('#hero .reveal-zoom-out, #hero .reveal-up');
        heroReveals.forEach(el => el.classList.add('is-visible'));
      }, 350);
    });
  }

  if (musicFab) {
    musicFab.addEventListener('click', () => {
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  // 3. Scroll Reveal Engine (Zoom-Out & Fade-Up)
  const revealElements = document.querySelectorAll('.reveal-zoom-out, .reveal-up, .photo-zoom-wrap');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // 4. Wedding Countdown Timer (12 Desember 2026, 08:00 WIB)
  const targetDate = new Date('2026-12-12T08:00:00+07:00').getTime();
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (cdDays) cdDays.textContent = '00';
      if (cdHours) cdHours.textContent = '00';
      if (cdMinutes) cdMinutes.textContent = '00';
      if (cdSeconds) cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
    if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 5. Gallery Neat Grid Lightbox Engine
  const galleryItems = [
    { src: 'assets/recca/gallery-1.jpeg', title: 'Kilau Senja Romansa — Golden Hour' },
    { src: 'assets/recca/gallery-3.jpeg', title: 'Langkah Bersama Menggapai Impian' },
    { src: 'assets/recca/gallery-5.jpeg', title: 'Tatap Kasih Dua Hati Bahagia' },
    { src: 'assets/recca/gallery-4.jpeg', title: 'Kehangatan Malam Suci Jakarta' },
    { src: 'assets/recca/gallery-6.jpeg', title: 'Senyum & Dansa Menuju Masa Depan' },
    { src: 'assets/recca/gallery-2.jpeg', title: 'Bersanding Suci Abadi Selamanya' }
  ];

  const lightbox = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentPhotoIndex = 0;

  function openLightbox(index) {
    currentPhotoIndex = index;
    updateLightboxContent();
    if (lightbox) {
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
    }
  }

  function updateLightboxContent() {
    const photo = galleryItems[currentPhotoIndex];
    if (lightboxImg) lightboxImg.src = photo.src;
    if (lightboxCaption) lightboxCaption.textContent = photo.title;
    if (lightboxCounter) lightboxCounter.textContent = `${String(currentPhotoIndex + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')}`;
  }

  function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % galleryItems.length;
    updateLightboxContent();
  }

  function showPrevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxContent();
  }

  // Bind clicks to gallery cards
  const galleryCards = document.querySelectorAll('.gallery-neat-item');
  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-index') || '0', 10);
      openLightbox(idx);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNextPhoto(); });
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrevPhoto(); });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextPhoto();
    if (e.key === 'ArrowLeft') showPrevPhoto();
  });

  // 6. Copy to Clipboard with Toast Notification
  const toast = document.getElementById('toastNotification');

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  const copyButtons = document.querySelectorAll('.btn-copy-action');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const copyVal = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Teks';
      if (!copyVal) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(copyVal).then(() => {
          showToast(`${label} berhasil disalin!`);
        }).catch(() => {
          fallbackCopyText(copyVal, label);
        });
      } else {
        fallbackCopyText(copyVal, label);
      }
    });
  });

  function fallbackCopyText(text, label) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`${label} berhasil disalin!`);
    } catch (e) {
      showToast('Gagal menyalin teks');
    }
    document.body.removeChild(tempInput);
  }

  // 7. RSVP & Guestbook LocalStorage Storage Engine
  const STORAGE_KEY = 'merahputih_rsvp_wishes_v1';
  const defaultWishes = [
    {
      name: 'Puang Bau Tenri & Keluarga',
      status: 'Hadir',
      guests: '2 Orang',
      message: 'Selamat berbahagia ananda Nur Akbar & Magfira. Semoga ikatan suci ini senantiasa diberkahi sakinah, mawaddah, warahmah hingga akhir hayat.',
      time: 'Baru saja'
    },
    {
      name: 'Andi M. Yusuf & Istri',
      status: 'Hadir',
      guests: '2 Orang',
      message: 'Barakallahu laka wa baraka alaika wa jama\'a bainakuma fii khoir. Doa terbaik kami panjatkan untuk kedua mempelai.',
      time: '2 jam lalu'
    },
    {
      name: 'Rahmat Hidayat, S.T.',
      status: 'Hadir',
      guests: '1 Orang',
      message: 'Selamat bro Akbar & Magfira! Semoga dilancarkan sampai hari H dan senantiasa rukun bahagia sekeluarga.',
      time: '5 jam lalu'
    }
  ];

  function getStoredWishes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWishes));
        return defaultWishes;
      }
      return JSON.parse(raw);
    } catch (e) {
      return defaultWishes;
    }
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch (e) {
      console.warn('Unable to save wishes to localStorage', e);
    }
  }

  const wishesListContainer = document.getElementById('wishesList');
  const statHadir = document.getElementById('statHadir');
  const statRagu = document.getElementById('statRagu');
  const statTidak = document.getElementById('statTidak');

  function renderWishes() {
    const wishes = getStoredWishes();
    if (!wishesListContainer) return;

    wishesListContainer.innerHTML = '';
    let countHadir = 0;
    let countRagu = 0;
    let countTidak = 0;

    wishes.forEach(item => {
      if (item.status === 'Hadir') countHadir++;
      else if (item.status === 'Belum Pasti') countRagu++;
      else countTidak++;

      const card = document.createElement('div');
      card.className = 'guest-comment-card';

      let badgeClass = 'badge-hadir';
      if (item.status === 'Belum Pasti') badgeClass = 'badge-ragu';
      else if (item.status === 'Tidak Hadir') badgeClass = 'badge-tidak';

      card.innerHTML = `
        <div class="guest-comment-top">
          <span class="guest-name">${escapeHTML(item.name)}</span>
          <span class="guest-status-badge ${badgeClass}">${escapeHTML(item.status)}</span>
        </div>
        <p class="guest-text">${escapeHTML(item.message)}</p>
        <span class="guest-time">${escapeHTML(item.time || 'Baru saja')} • ${escapeHTML(item.guests || '1 Orang')}</span>
      `;
      wishesListContainer.appendChild(card);
    });

    if (statHadir) statHadir.textContent = countHadir;
    if (statRagu) statRagu.textContent = countRagu;
    if (statTidak) statTidak.textContent = countTidak;
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

  const rsvpForm = document.getElementById('rsvpForm');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('rsvpName').value || '').trim();
      const status = document.getElementById('rsvpStatus').value;
      const guests = document.getElementById('rsvpGuests').value;
      const message = (document.getElementById('rsvpMessage').value || '').trim();

      if (!name || !message) return;

      const newWish = {
        name,
        status,
        guests,
        message,
        time: 'Baru saja'
      };

      const wishes = getStoredWishes();
      wishes.unshift(newWish);
      saveWishes(wishes);
      renderWishes();

      document.getElementById('rsvpMessage').value = '';
      showToast('Terima kasih, konfirmasi & doa Anda telah terkirim!');
    });
  }

  renderWishes();

  // 8. Active Bottom Navigation Dock Highlighter
  const sections = document.querySelectorAll('main section, header.hero-section');
  const navItems = document.querySelectorAll('.bottom-dock .dock-item');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentId}`) {
          item.classList.add('active');
        }
      });
    }
  });
});
