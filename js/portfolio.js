/* ============================================================
   PORTFOLIO JS — Testimonials Slider, Case Study Modal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ======== TESTIMONIALS SLIDER ========
  const track    = document.getElementById('testimonialsTrack');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('sliderDots');

  if (!track) return;

  const cards     = track.querySelectorAll('.testimonial-card');
  const cardCount = cards.length;

  // Cards per view
  function getCardsPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640)  return 2;
    return 1;
  }

  let perView  = getCardsPerView();
  let current  = 0;
  let autoTimer;

  // Create dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = Math.ceil(cardCount / perView);
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }
  buildDots();

  function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function totalPages() { return Math.ceil(cardCount / perView); }

  function getCardWidth() {
    const gap = 24;
    const total = parseFloat(getComputedStyle(track).width);
    return (total - (gap * (perView - 1))) / perView;
  }

  function goTo(idx) {
    const pages = totalPages();
    current = ((idx % pages) + pages) % pages;
    const cardW = getCardWidth();
    const gap   = 24;
    const offset = current * (cardW + gap) * perView;
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
  prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

  // Autoplay
  function startAutoplay() {
    autoTimer = setInterval(next, 4000);
  }
  function resetAutoplay() {
    clearInterval(autoTimer);
    startAutoplay();
  }
  startAutoplay();

  // Touch/Swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      resetAutoplay();
    }
  });

  // Resize
  window.addEventListener('resize', () => {
    perView = getCardsPerView();
    buildDots();
    goTo(0);
  });


  // ======== CASE STUDY MODAL DATA ========
  const caseStudies = {
    case1: {
      title: 'Brand Awareness Campaign',
      client: 'Fashion Brand',
      category: 'Social Media',
      challenge: 'The client had minimal social media presence and low brand recognition among their target demographic.',
      strategy: 'Developed a comprehensive content strategy with consistent visual identity, targeted hashtag research, and an influencer collaboration plan.',
      execution: 'Created 90 days of content calendar, designed 3 posts per week, managed daily stories and engagement, collaborated with 5 micro-influencers.',
      results: [
        { label: 'Follower Growth', value: '+280%', icon: 'fa-users' },
        { label: 'Engagement Rate', value: '8.4%', icon: 'fa-heart' },
        { label: 'Reach Increase', value: '+450%', icon: 'fa-eye' },
        { label: 'Website Traffic', value: '+120%', icon: 'fa-globe' }
      ],
      duration: '3 Months',
      platform: 'Instagram & Facebook'
    },
    case2: {
      title: 'E-Commerce Lead Generation',
      client: 'Online Store',
      category: 'Paid Advertising',
      challenge: 'High ad spend with very low return on ad spend (ROAS). Client was losing money on Facebook and Instagram ads.',
      strategy: 'Complete campaign audit, audience rebuilding with lookalike audiences, A/B testing creatives, and funnel optimization.',
      execution: 'Restructured campaign architecture, created 20+ ad variations, implemented retargeting sequences, optimized bidding strategy.',
      results: [
        { label: 'ROAS',           value: '350%', icon: 'fa-chart-line' },
        { label: 'Cost Per Lead',  value: '-65%', icon: 'fa-tag' },
        { label: 'Conversions',    value: '+280%', icon: 'fa-shopping-cart' },
        { label: 'Ad Budget Saved', value: '40%', icon: 'fa-piggy-bank' }
      ],
      duration: '6 Months',
      platform: 'Meta Ads (Facebook + Instagram)'
    },
    case3: {
      title: 'Event Promotion Flyer',
      client: 'Event Company',
      category: 'Graphic Design',
      challenge: 'Client needed eye-catching promotional materials for a major product launch event with tight deadline.',
      strategy: 'Developed a cohesive visual identity using the brand\'s colors, designed for both digital and print formats.',
      execution: 'Created multiple flyer variations, optimized for Instagram story, Facebook event cover, and A4 print format.',
      results: [
        { label: 'Event Attendance', value: '+200%', icon: 'fa-users' },
        { label: 'Social Shares', value: '1,200+', icon: 'fa-share' },
        { label: 'Ticket Sales', value: '+85%', icon: 'fa-ticket' },
        { label: 'Brand Recall', value: '92%', icon: 'fa-brain' }
      ],
      duration: '2 Weeks',
      platform: 'Print & Digital'
    },
    case4: {
      title: 'Product Showcase Reel',
      client: 'Beauty Brand',
      category: 'Video Content',
      challenge: 'New product launch needed viral content that would generate organic reach and drive sales.',
      strategy: 'Created a series of short-form videos showcasing the product with trending audio and hooks.',
      execution: 'Scripted and planned 5 different video concepts, directed shoots, edited with trending transitions and effects.',
      results: [
        { label: 'Total Views',    value: '1M+',  icon: 'fa-eye' },
        { label: 'Shares',        value: '15K+',  icon: 'fa-share' },
        { label: 'Sales from Video', value: '+180%', icon: 'fa-shopping-bag' },
        { label: 'New Followers', value: '+8K',   icon: 'fa-user-plus' }
      ],
      duration: '1 Month',
      platform: 'Instagram Reels & TikTok'
    },
    case5: {
      title: 'Complete Brand Redesign',
      client: 'Tech Startup',
      category: 'Branding',
      challenge: 'The client had an outdated brand that didn\'t reflect their innovative products and was struggling to attract premium clients.',
      strategy: 'Comprehensive brand audit, competitor analysis, and creation of a modern brand identity system.',
      execution: 'Developed new color palette, typography, visual language, social media templates, and brand guidelines document.',
      results: [
        { label: 'Lead Quality',    value: '+250%', icon: 'fa-star' },
        { label: 'Brand Mentions',  value: '+300%', icon: 'fa-hashtag' },
        { label: 'Client Value',    value: '+180%', icon: 'fa-dollar-sign' },
        { label: 'Brand Consistency', value: '100%', icon: 'fa-check-circle' }
      ],
      duration: '2 Months',
      platform: 'All Digital Channels'
    },
    case6: {
      title: 'TikTok Viral Strategy',
      client: 'Lifestyle Brand',
      category: 'Social Media Growth',
      challenge: 'Brand had zero TikTok presence and needed to grow from scratch in a highly competitive niche.',
      strategy: 'Trend analysis, niche content positioning, and a posting schedule built around TikTok\'s algorithm patterns.',
      execution: 'Created content series, implemented trending sounds, collaborated with TikTok creators, engaged with comments daily.',
      results: [
        { label: 'Followers',     value: '50K',  icon: 'fa-users' },
        { label: 'Time to 10K',   value: '21 Days', icon: 'fa-clock' },
        { label: 'Average Views', value: '80K+', icon: 'fa-eye' },
        { label: 'Sales Driven',  value: '+120%', icon: 'fa-chart-line' }
      ],
      duration: '4 Months',
      platform: 'TikTok'
    }
  };

  // Open Modal
  window.openModal = function(id) {
    const data    = caseStudies[id];
    if (!data) return;

    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');

    content.innerHTML = `
      <div class="modal-header" style="margin-bottom:1.5rem;">
        <span style="display:inline-block;padding:0.25rem 0.9rem;border-radius:50px;background:var(--grad-primary);color:#fff;font-size:0.75rem;font-weight:600;margin-bottom:0.75rem;">${data.category}</span>
        <h2 class="modal-title" style="margin-bottom:0.25rem;">${data.title}</h2>
        <p style="font-size:0.85rem;color:var(--text-muted);">
          <i class="fa-solid fa-building" style="margin-right:0.4rem;"></i>${data.client} &nbsp;·&nbsp;
          <i class="fa-regular fa-clock" style="margin-right:0.4rem;"></i>${data.duration} &nbsp;·&nbsp;
          <i class="fa-brands fa-instagram" style="margin-right:0.4rem;"></i>${data.platform}
        </p>
      </div>

      <div class="case-section" style="margin-bottom:1.5rem;">
        <h4 style="font-family:var(--font-heading);font-size:0.9rem;font-weight:700;color:var(--violet-light);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:0.75rem;">🎯 The Challenge</h4>
        <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.7;">${data.challenge}</p>
      </div>

      <div class="case-section" style="margin-bottom:1.5rem;">
        <h4 style="font-family:var(--font-heading);font-size:0.9rem;font-weight:700;color:var(--cyan-light);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:0.75rem;">💡 The Strategy</h4>
        <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.7;">${data.strategy}</p>
      </div>

      <div class="case-section" style="margin-bottom:2rem;">
        <h4 style="font-family:var(--font-heading);font-size:0.9rem;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:0.75rem;">⚡ The Execution</h4>
        <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.7;">${data.execution}</p>
      </div>

      <div class="case-results">
        <h4 style="font-family:var(--font-heading);font-size:0.9rem;font-weight:700;color:var(--text-primary);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:1.25rem;">📊 Results</h4>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;">
          ${data.results.map(r => `
            <div style="background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.15);border-radius:16px;padding:1.25rem;text-align:center;">
              <i class="fa-solid ${r.icon}" style="font-size:1.3rem;background:var(--grad-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:0.5rem;display:block;"></i>
              <div style="font-family:var(--font-heading);font-size:1.6rem;font-weight:800;background:var(--grad-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:-1px;">${r.value}</div>
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">${r.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--border);display:flex;gap:1rem;flex-wrap:wrap;">
        <a href="https://wa.me/8801732522501?text=${encodeURIComponent('Hi Afroza! I saw your case study and would love to discuss a similar project.')}" 
           target="_blank" 
           style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.7rem 1.5rem;background:var(--grad-primary);color:#fff;border-radius:50px;font-size:0.875rem;font-weight:600;text-decoration:none;transition:all 0.3s ease;">
          <i class="fa-brands fa-whatsapp"></i> Start a Similar Project
        </a>
      </div>
    `;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function() {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  };

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeModal();
      window.closeUploadGuide();
    }
  });


  // ======== SOCIAL LINK COPY / OPEN ========
  document.querySelectorAll('.contact-detail-value').forEach(el => {
    if (el.textContent.includes('@')) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        navigator.clipboard.writeText(el.textContent).then(() => {
          const orig = el.textContent;
          el.textContent = 'Copied!';
          setTimeout(() => el.textContent = orig, 2000);
        });
      });
    }
  });


  // ======== SMOOTH NUMBER FORMATTING ========
  function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000)    return (n / 1000).toFixed(0) + 'K';
    return n;
  }

});
