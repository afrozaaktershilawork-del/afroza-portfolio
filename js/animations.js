/* ============================================================
   ANIMATIONS JS — Scroll Reveal, Counter, Skill Bars
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ======== INTERSECTION OBSERVER — SCROLL REVEAL ========
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ======== COUNTER ANIMATION ========
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const step     = target / (duration / 16);
    let current    = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);
  }


  // ======== SKILL BAR ANIMATION ========
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.getAttribute('data-width');
        setTimeout(() => {
          fill.style.width = width + '%';
          fill.classList.add('animated');
        }, 200);
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(fill => skillObserver.observe(fill));


  // ======== PARALLAX EFFECT ON HERO ========
  const hero = document.querySelector('.hero');
  const orbs = document.querySelectorAll('.orb');

  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.3;
      orbs.forEach((orb, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        orb.style.transform = `translateY(${rate * direction * 0.15}px)`;
      });
    });
  }


  // ======== HERO MOUSE PARALLAX ========
  const heroContent = document.querySelector('.hero-content');
  const heroVisual  = document.querySelector('.hero-visual');

  if (hero && heroContent && heroVisual) {
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPercent = (clientX / innerWidth  - 0.5) * 20;
      const yPercent = (clientY / innerHeight - 0.5) * 10;

      heroContent.style.transform = `translate(${xPercent * 0.3}px, ${yPercent * 0.3}px)`;
      heroVisual.style.transform  = `translate(${xPercent * -0.2}px, ${yPercent * -0.2}px)`;
    });

    hero.addEventListener('mouseleave', () => {
      heroContent.style.transform = '';
      heroVisual.style.transform  = '';
    });
  }


  // ======== TEXT CHAR SPLIT ANIMATION (Section Titles) ========
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('chars-animated')) {
        entry.target.classList.add('chars-animated');
        animateChars(entry.target);
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  // Only apply to stat numbers for subtle pop
  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });

  function animateChars(el) {
    // subtle fade-up effect
    el.style.animation = 'fadeInUp 0.6s ease forwards';
  }


  // ======== FLOATING CARD MOUSE FOLLOW ========
  const floatCards = document.querySelectorAll('.float-card');
  const heroSection = document.querySelector('.hero');

  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      floatCards.forEach((card, i) => {
        const factor = (i + 1) * 0.05;
        const x = (clientX / innerWidth  - 0.5) * 30 * factor;
        const y = (clientY / innerHeight - 0.5) * 20 * factor;
        card.style.marginLeft = x + 'px';
        card.style.marginTop  = y + 'px';
      });
    });
  }


  // ======== ABOUT IMAGE HOVER GLOW ========
  const aboutImgWrap = document.querySelector('.about-img-wrapper');
  if (aboutImgWrap) {
    aboutImgWrap.addEventListener('mousemove', (e) => {
      const rect = aboutImgWrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      aboutImgWrap.style.setProperty('--mouse-x', x + '%');
      aboutImgWrap.style.setProperty('--mouse-y', y + '%');
    });
  }


  // ======== SERVICE CARD ICON ANIMATION ========
  document.querySelectorAll('.service-card').forEach(card => {
    const icon = card.querySelector('.service-icon');
    card.addEventListener('mouseenter', () => {
      if (icon) {
        icon.style.transform = 'scale(1.2) rotate(10deg)';
        icon.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }
    });
    card.addEventListener('mouseleave', () => {
      if (icon) {
        icon.style.transform = '';
      }
    });
  });


  // ======== PORTFOLIO FILTER TRANSITION ========
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach((item, i) => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
            item.style.transition = 'all 0.4s cubic-bezier(0.4,0,0.2,1)';
          }, i * 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.85)';
          item.style.transition = 'all 0.4s ease';
          setTimeout(() => {
            item.style.display = 'none';
          }, 400);
        }
      });
    });
  });


  // ======== SOCIAL ICON WAVE ON HOVER ========
  const socialIcons = document.querySelectorAll('.hero-socials .social-icon-link');
  socialIcons.forEach((icon, i) => {
    icon.style.transitionDelay = (i * 0.05) + 's';
  });


  // ======== STAT CARD SEQUENTIAL REVEAL ========
  const statCards = document.querySelectorAll('.stat-card');
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      statCards.forEach((card, i) => {
        setTimeout(() => {
          card.classList.add('revealed');
        }, i * 100);
      });
      statsObserver.disconnect();
    }
  }, { threshold: 0.2 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) statsObserver.observe(statsSection);

});
