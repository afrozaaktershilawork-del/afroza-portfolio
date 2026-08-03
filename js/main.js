/* ============================================================
   MAIN JS — Cursor, Loader, Navbar, Scroll, Particles, Typewriter
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ======== PAGE LOADER ========
  const loader = document.getElementById('pageLoader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero animation after loader
    document.querySelectorAll('.hero-content, .hero-visual').forEach(el => {
      el.classList.add('hero-animate');
    });
    // Start typewriter after loader
    startTypewriter();
  }, 2000);


  // ======== SCROLL PROGRESS BAR ========
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
  });


  // ======== CUSTOM CURSOR ========
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand ring on interactive elements
  const interactives = document.querySelectorAll('a, button, .service-card, .portfolio-item, .filter-btn, input, textarea, select, .testimonial-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('expanded'));
    el.addEventListener('mouseleave', () => ring.classList.remove('expanded'));
  });


  // ======== NAVBAR SCROLL EFFECT ========
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  // ======== ACTIVE NAV LINK ON SCROLL ========
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));


  // ======== HAMBURGER / MOBILE MENU ========
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  // ======== TYPEWRITER EFFECT ========
  function startTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const words = [
      'Social Media Marketer',
      'Digital Marketing Expert',
      'Brand Strategist',
      'Content Creator',
      'Paid Ads Specialist'
    ];

    let wordIdx  = 0;
    let charIdx  = 0;
    let deleting = false;
    let pauseEnd = false;

    function type() {
      const currentWord = words[wordIdx];

      if (!deleting && charIdx <= currentWord.length) {
        el.textContent = currentWord.substring(0, charIdx);
        charIdx++;
        setTimeout(type, charIdx === currentWord.length + 1 ? 1800 : 80);
      } else if (deleting && charIdx >= 0) {
        el.textContent = currentWord.substring(0, charIdx);
        charIdx--;
        setTimeout(type, 40);
      } else if (!deleting && charIdx > currentWord.length) {
        deleting = true;
        setTimeout(type, 100);
      } else {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
        charIdx  = 0;
        setTimeout(type, 300);
      }
    }
    type();
  }


  // ======== BACK TO TOP ========
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ======== SMOOTH SCROLL FOR ANCHOR LINKS ========
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ======== MAGNETIC BUTTON EFFECT ========
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  // ======== PARTICLE CANVAS ========
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const PARTICLE_COUNT = 60;

    const colors = ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(236,72,153,'];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x:    Math.random() * canvas.width,
        y:    Math.random() * canvas.height,
        vx:   (Math.random() - 0.5) * 0.4,
        vy:   (Math.random() - 0.5) * 0.4,
        r:    Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(124,58,237,' + (1 - dist / 120) * 0.1 + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }


  // ======== TILT EFFECT ON CARDS ========
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-10px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // ======== FORM SUBMIT HANDLER ========
  window.handleFormSubmit = function(e) {
    e.preventDefault();
    const btn  = document.getElementById('submitBtn');
    const text = document.getElementById('submitText');
    const icon = document.getElementById('submitIcon');
    const success = document.getElementById('formSuccess');

    btn.disabled = true;
    text.textContent = 'Sending...';
    icon.className = 'fa-solid fa-spinner fa-spin';

    setTimeout(() => {
      btn.disabled = false;
      text.textContent = 'Send Message';
      icon.className = 'fa-solid fa-paper-plane';
      success.style.display = 'flex';
      e.target.reset();

      // Open WhatsApp as fallback
      const name    = document.getElementById('contactName').value    || '';
      const service = document.getElementById('contactService').value || 'General';
      const msg     = encodeURIComponent(`Hi Afroza! I'm interested in your ${service} service.`);
      // Optionally open WhatsApp
      // window.open(`https://wa.me/8801732522501?text=${msg}`, '_blank');

      setTimeout(() => { success.style.display = 'none'; }, 6000);
    }, 1500);
  };


  // ======== UPLOAD GUIDE MODAL ========
  window.showUploadGuide = function() {
    document.getElementById('uploadGuideModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeUploadGuide = function() {
    document.getElementById('uploadGuideModal').classList.remove('open');
    document.body.style.overflow = '';
  };


  // ======== FILE UPLOAD HANDLER (Preview) ========
  window.handleWorkUpload = function(event) {
    const files = Array.from(event.target.files);
    const grid  = document.getElementById('portfolioGrid');

    files.forEach(file => {
      const item = document.createElement('div');
      item.className = 'portfolio-item';
      item.setAttribute('data-category', 'social');

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          item.innerHTML = `
            <div class="portfolio-thumb">
              <img src="${e.target.result}" alt="Your Work" style="width:100%;height:100%;object-fit:cover"/>
              <div class="portfolio-overlay">
                <div class="portfolio-info">
                  <span class="portfolio-tag">My Work</span>
                  <h3>${file.name.replace(/\.[^.]+$/, '')}</h3>
                  <p class="portfolio-metric"><i class="fa-solid fa-star"></i> Your Project</p>
                </div>
              </div>
            </div>`;
          grid.appendChild(item);
          item.classList.add('revealed');
        };
        reader.readAsDataURL(file);

      } else if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        item.setAttribute('data-category', 'video');
        item.innerHTML = `
          <div class="portfolio-thumb" style="aspect-ratio:4/3;overflow:hidden;border-radius:20px;">
            <video src="${url}" style="width:100%;height:100%;object-fit:cover" muted loop playsinline
              onmouseenter="this.play()" onmouseleave="this.pause()"></video>
            <div class="portfolio-overlay">
              <div class="portfolio-info">
                <span class="portfolio-tag">Video</span>
                <h3>${file.name.replace(/\.[^.]+$/, '')}</h3>
                <p class="portfolio-metric"><i class="fa-solid fa-film"></i> Your Video</p>
              </div>
            </div>
          </div>`;
        grid.appendChild(item);
        item.classList.add('revealed');
      }
    });
  };

});
