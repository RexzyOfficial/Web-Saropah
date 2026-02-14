document.addEventListener('DOMContentLoaded', () => {
    // Dropdown Menu Handler
    const menuDropdown = document.querySelector('.menu-dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const hiddenDropdownMenu = document.querySelector('.dropdown-menu'); // The container

    // Toggle main "Menu" dropdown on mobile
    if (dropdownToggle && menuDropdown) {
        dropdownToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                menuDropdown.classList.toggle('active');

                // Optional: Rotate arrow if you had one on the main menu toggle
            } else {
                // Desktop behavior (optional, CSS hover usually handles this but click can toggle too)
                e.preventDefault();
                // Desktop toggle logic if needed, otherwise CSS handles hover
            }
        });
    }

    // Handle Submenus (like Coffee) on Mobile
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        const subMenu = link.nextElementSibling;
        if (subMenu && subMenu.classList.contains('subcategory-menu')) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    // Toggle the parent column to trigger CSS max-height
                    link.parentElement.classList.toggle('active');

                    // Rotate arrow
                    const arrow = link.querySelector('.arrow');
                    if (arrow) {
                        arrow.style.transform = link.parentElement.classList.contains('active')
                            ? 'rotate(90deg)'
                            : 'rotate(0deg)';
                    }
                }
            });
        }
    });

    // Close mobile menu when clicking a final link
    const allLinks = document.querySelectorAll('.nav-menu a:not(.dropdown-toggle):not(.category-link)');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Close Dropdown when clicking outside (Desktop)
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 768) {
            if (menuDropdown && !menuDropdown.contains(e.target) && !dropdownToggle.contains(e.target)) {
                menuDropdown.classList.remove('active');
            }
        }
    });

    // Testimonial Carousel
    let currentSlide = 0;
    const wrapper = document.querySelector('.carousel-wrapper');
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');

    function showSlide(n) {
        if (cards.length === 0) return;

        if (n >= cards.length) currentSlide = 0;
        if (n < 0) currentSlide = cards.length - 1;

        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        wrapper.style.transition = 'transform 0.5s ease';

        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    window.slideTestimonial = (n) => {
        currentSlide += n;
        showSlide(currentSlide);
    };

    window.currentTestimonial = (n) => {
        currentSlide = n;
        showSlide(currentSlide);
    };

    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Navbar Scroll Effect
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Only hide/show header if mobile menu is NOT active
        if (!navMenu.classList.contains('active')) {
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // Mobile Menu Toggle (Reusing variables declared above)
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Page Loader
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);

    // Page Loader Safety Check
    const removeLoader = () => {
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        }
    };

    window.addEventListener('load', () => {
        setTimeout(removeLoader, 500);
    });

    // Fallback: Force remove loader after 3 seconds
    setTimeout(removeLoader, 3000);

    // Lightbox Logic
    const galleryImages = document.querySelectorAll('.gallery-grid img');
    if (galleryImages.length > 0) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-img" src="" alt="Gallery Preview">
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        galleryImages.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.classList.add('no-scroll');
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
        });
    }
});
