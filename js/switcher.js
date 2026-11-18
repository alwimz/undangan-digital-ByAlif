// Universal Theme Switcher Controller
document.addEventListener('DOMContentLoaded', () => {
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

    // Pertahankan parameter nama tamu (?to=...) saat berpindah tema
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
});
