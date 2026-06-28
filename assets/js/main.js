document.addEventListener('DOMContentLoaded', () => {

  /* ── Auto-fill copyright year ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ────────────────────────────────────────────
     NAVIGATION
  ──────────────────────────────────────────── */
  const header        = document.getElementById('site-header') || document.querySelector('header');
  const mobileToggle  = document.querySelector('.mobile-toggle');
  const navMenu       = document.querySelector('.nav-menu');
  const menuDropdown  = document.querySelector('.menu-dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');

  // Mobile hamburger → X toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
      // Force span color to black when menu is open (white bg)
      mobileToggle.querySelectorAll('span').forEach(s => {
        s.style.background = isOpen ? '#111' : '';
      });
    });
  }

  // Mobile: main Menu dropdown
  if (dropdownToggle && menuDropdown) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const isOpen = menuDropdown.classList.toggle('active');
        dropdownToggle.setAttribute('aria-expanded', String(isOpen));
      } else {
        e.preventDefault();
      }
    });
  }

  // Mobile: sub-category menus
  document.querySelectorAll('.category-link').forEach(link => {
    const subMenu = link.nextElementSibling;
    if (!subMenu || !subMenu.classList.contains('subcategory-menu')) return;
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.parentElement.classList.toggle('active');
      }
    });
  });

  // Close mobile menu on nav link click
  document.querySelectorAll('.nav-menu a:not(.dropdown-toggle):not(.category-link)').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        mobileToggle && mobileToggle.classList.remove('active');
        mobileToggle && mobileToggle.querySelectorAll('span').forEach(s => s.style.background = '');
        navMenu && navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close desktop dropdown on outside click
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 768 && menuDropdown) {
      if (!menuDropdown.contains(e.target)) menuDropdown.classList.remove('active');
    }
  });

  /* ────────────────────────────────────────────
     SCROLL: header glass + hide/show
  ──────────────────────────────────────────── */
  let lastScroll = 0;

  function handleScroll() {
    if (!header) return;
    const y = window.pageYOffset;
    if (y > 60) header.classList.add('scrolled');
    else         header.classList.remove('scrolled');

    if (!navMenu || !navMenu.classList.contains('active')) {
      header.style.transform = (y > lastScroll && y > 120) ? 'translateY(-100%)' : 'translateY(0)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScroll = y;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ────────────────────────────────────────────
     TESTIMONIAL CAROUSEL — resize-safe
     Bug fix: use requestAnimationFrame so card
     width is computed AFTER paint, not before.
  ──────────────────────────────────────────── */
  const wrapper = document.getElementById('carouselWrapper') || document.querySelector('.carousel-wrapper');
  const cards   = document.querySelectorAll('.testimonial-card');
  const dots    = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevBtn') || document.querySelector('.carousel-btn.prev');
  const nextBtn = document.getElementById('nextBtn') || document.querySelector('.carousel-btn.next');

  let currentSlide = 0;
  let autoTimer;

  function showSlide(n) {
    if (!wrapper || cards.length === 0) return;
    if (n >= cards.length) n = 0;
    if (n < 0) n = cards.length - 1;
    currentSlide = n;

    const cardWidth = wrapper.offsetWidth; // wrapper width = 1 card width
    wrapper.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    wrapper.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1)';

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
      dot.setAttribute('aria-selected', String(i === currentSlide));
    });
  }

  // Resize: recalculate without animation
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!wrapper || cards.length === 0) return;
      wrapper.style.transition = 'none';
      const cardWidth = wrapper.offsetWidth;
      wrapper.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    }, 150);
  });

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => showSlide(currentSlide + 1), 5000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { showSlide(currentSlide - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { showSlide(currentSlide + 1); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { showSlide(i); startAuto(); });
    dot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showSlide(i); startAuto(); }
    });
  });

  // Touch/swipe
  if (wrapper) {
    let touchStartX = 0;
    wrapper.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    wrapper.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) { showSlide(delta < 0 ? currentSlide + 1 : currentSlide - 1); startAuto(); }
    });
  }

  // Init: wait for paint so offsetWidth is correct
  if (cards.length > 0) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        showSlide(0);
        startAuto();
      });
    });
  }

  /* ────────────────────────────────────────────
     FADE-IN OBSERVER
  ──────────────────────────────────────────── */
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* ────────────────────────────────────────────
     FAQ ACCORDION
  ──────────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ────────────────────────────────────────────
     LIGHTBOX (Gallery)
  ──────────────────────────────────────────── */
  const galleryImages = document.querySelectorAll('.vibes-big img, .vibes-small img, .gallery-grid img');
  if (galleryImages.length > 0) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.innerHTML = '<button class="lightbox-close" aria-label="Tutup">&times;</button><img class="lightbox-img" src="" alt="">';
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const closeBtn    = lightbox.querySelector('.lightbox-close');

    galleryImages.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.setAttribute('tabindex', '0');
      const open = () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
      };
      img.addEventListener('click', open);
      img.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
    });

    const close = () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; };
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('active')) close(); });
  }

});
