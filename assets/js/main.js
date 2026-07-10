/**
 * Cyber Security Portfolio — Main JavaScript
 * Handles: navbar, typing animation, scroll reveal, skill bars, mobile menu
 */

(function () {
  'use strict';

  // ============================================================
  // Navbar: sticky + scroll class
  // ============================================================
  const navbar = document.querySelector('.navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ============================================================
  // Active nav link based on scroll position
  // ============================================================
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // ============================================================
  // Mobile Navigation Toggle
  // ============================================================
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinksContainer.classList.toggle('open');
      document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
    });

    // Close nav when a link is clicked
    navLinksContainer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinksContainer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================================
  // Typing Animation (Hero section)
  // ============================================================
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const phrases = typingEl.dataset.phrases
      ? JSON.parse(typingEl.dataset.phrases)
      : [
          'Cyber Security Analyst',
          'Penetration Tester',
          'Red Team Operator',
          'SOC Analyst',
          'Ethical Hacker',
        ];

    let phraseIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;
    let isPaused    = false;

    function typeLoop() {
      if (isPaused) return;

      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        typingEl.textContent = currentPhrase.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentPhrase.length) {
          isPaused = true;
          setTimeout(() => { isPaused = false; isDeleting = true; typeLoop(); }, 1800);
          return;
        }
      } else {
        typingEl.textContent = currentPhrase.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }

      const speed = isDeleting ? 50 : 90;
      setTimeout(typeLoop, speed);
    }

    typeLoop();
  }

  // ============================================================
  // Scroll Reveal Animation
  // ============================================================
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  // ============================================================
  // Skill Bar Animation
  // ============================================================
  const skillBars = document.querySelectorAll('.skill-fill[data-level]');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const level = entry.target.dataset.level;
          entry.target.style.width = level + '%';
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach((bar) => skillObserver.observe(bar));

  // ============================================================
  // Smooth scroll for anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================================
  // Auto-dismiss alerts after 5 seconds
  // ============================================================
  document.querySelectorAll('.alert').forEach((alert) => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s ease';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 500);
    }, 5000);
  });

  // ============================================================
  // Counter animation for hero stats
  // ============================================================
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = Math.ceil(duration / target);
    const timer = setInterval(() => {
      start++;
      el.textContent = start + (el.dataset.suffix || '+');
      if (start >= target) {
        el.textContent = target + (el.dataset.suffix || '+');
        clearInterval(timer);
      }
    }, step);
  }

  const counters = document.querySelectorAll('.counter-number[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count, 10);
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  }

  // ============================================================
  // Contact form: client-side validation
  // ============================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      let valid = true;
      const errors = contactForm.querySelectorAll('.form-error');
      errors.forEach((err) => (err.textContent = ''));

      const name    = document.getElementById('c-name');
      const email   = document.getElementById('c-email');
      const subject = document.getElementById('c-subject');
      const message = document.getElementById('c-message');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || name.value.trim().length < 2) {
        showError(name, 'Name must be at least 2 characters.');
        valid = false;
      }
      if (!email || !emailRegex.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        valid = false;
      }
      if (!subject || subject.value.trim().length < 3) {
        showError(subject, 'Subject must be at least 3 characters.');
        valid = false;
      }
      if (!message || message.value.trim().length < 10) {
        showError(message, 'Message must be at least 10 characters.');
        valid = false;
      }

      if (!valid) e.preventDefault();
    });

    function showError(input, msg) {
      if (!input) return;
      const errEl = input.parentElement.querySelector('.form-error');
      if (errEl) errEl.textContent = msg;
      input.classList.add('input-error');
      input.addEventListener('input', () => {
        input.classList.remove('input-error');
        if (errEl) errEl.textContent = '';
      }, { once: true });
    }
  }

  // ============================================================
  // Particle background (lightweight canvas)
  // ============================================================
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resizeCanvas() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createParticle() {
      return {
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        vx:      (Math.random() - 0.5) * 0.4,
        vy:      (Math.random() - 0.5) * 0.4,
        radius:  Math.random() * 1.5 + 0.5,
        alpha:   Math.random() * 0.5 + 0.1,
        color:   Math.random() > 0.5 ? '0, 212, 255' : '123, 47, 255',
      };
    }

    function initParticles(count = 60) {
      particles = Array.from({ length: count }, createParticle);
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      animFrame = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    initParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    // Pause when tab not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrame);
      } else {
        drawParticles();
      }
    });
  }

  // ============================================================
  // Back to top button
  // ============================================================
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.style.opacity = window.scrollY > 400 ? '1' : '0';
      backToTop.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // Certificate Image Lightbox
  // ============================================================
  let lightbox    = null;
  let lightboxImg = null;
  let lightboxCap = null;
  let lightboxDl  = null;

  function buildLightbox() {
    if (lightbox) return;

    lightbox = document.createElement('div');
    lightbox.className = 'cert-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Certificate preview');

    lightbox.innerHTML = `
      <button class="cert-lightbox-close" id="lightbox-close" aria-label="Close preview">
        <i class="fas fa-times"></i>
      </button>
      <div class="cert-lightbox-inner">
        <img class="cert-lightbox-img" id="lightbox-img" src="" alt="">
        <div class="cert-lightbox-caption" id="lightbox-caption"></div>
        <div class="cert-lightbox-actions">
          <a class="cert-lightbox-btn" id="lightbox-download" href="#" download target="_blank" rel="noopener noreferrer">
            <i class="fas fa-download"></i> Download
          </a>
          <button class="cert-lightbox-btn" id="lightbox-close-btn">
            <i class="fas fa-times"></i> Close
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(lightbox);

    lightboxImg = lightbox.querySelector('#lightbox-img');
    lightboxCap = lightbox.querySelector('#lightbox-caption');
    lightboxDl  = lightbox.querySelector('#lightbox-download');

    // Click backdrop to close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Close buttons
    lightbox.querySelector('#lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('#lightbox-close-btn').addEventListener('click', closeLightbox);
  }

  function openLightbox(src, title) {
    buildLightbox();

    // Reset image while loading
    lightboxImg.style.opacity = '0';
    lightboxImg.src = src;
    lightboxImg.alt = title || 'Certificate';
    lightboxCap.textContent = title || '';
    lightboxDl.href = src;

    // Fade image in after load
    lightboxImg.onload = () => {
      lightboxImg.style.transition = 'opacity 0.3s ease';
      lightboxImg.style.opacity = '1';
    };
    // If already cached
    if (lightboxImg.complete) {
      lightboxImg.style.opacity = '1';
    }

    document.body.style.overflow = 'hidden';
    lightbox.classList.add('active');
    lightbox.querySelector('#lightbox-close').focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Event delegation — handles both .cert-image-wrap divs AND button[data-lightbox-src]
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-lightbox-src]');
    if (trigger) {
      e.preventDefault();
      const src   = trigger.dataset.lightboxSrc;
      const title = trigger.dataset.lightboxTitle || '';
      if (src) openLightbox(src, title);
    }
  });

})();
