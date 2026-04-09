/* ═══════════════════════════════════════════════
   TERRA & FOGO — JavaScript Principal
═══════════════════════════════════════════════ */

// ─── Navbar Scroll ───────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ─── Mobile Menu ─────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

// ─── Fire Particles ──────────────────────────────
function createFireParticles() {
  const container = document.getElementById('fireParticles');
  if (!container) return;

  const colors = [
    'rgba(194, 113, 79, 0.7)',
    'rgba(216, 140, 80, 0.6)',
    'rgba(240, 180, 80, 0.5)',
    'rgba(200, 80, 40, 0.6)',
    'rgba(240, 100, 50, 0.4)',
  ];

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 14 + 4;
    const x = Math.random() * 100;
    const delay = Math.random() * 4;
    const duration = Math.random() * 3 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      width: ${size}px;
      height: ${size * 1.3}px;
      left: ${x}%;
      bottom: ${Math.random() * 20}%;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      filter: blur(${Math.random() * 2}px);
    `;

    container.appendChild(p);
  }
}

createFireParticles();

// ─── Smooth Active Nav Links ──────────────────────
const sections = document.querySelectorAll('section, footer');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => observer.observe(s));

// ─── Menu Filters ────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    menuCards.forEach(card => {
      const cat = card.dataset.cat;
      const isVegan = card.dataset.vegan === 'true';

      let show = false;

      if (filter === 'all') show = true;
      else if (filter === 'vegan') show = isVegan;
      else show = cat === filter;

      card.classList.toggle('hidden-card', !show);

      // Animate cards
      if (show) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        });
      }
    });
  });
});

// ─── Reserva Form: Pessoas Selector ──────────────
let pessoasCount = 2;
const pessoasNum = document.getElementById('pessoasNum');
const pessoasInput = document.getElementById('pessoas');

document.getElementById('pessoasMinus').addEventListener('click', () => {
  if (pessoasCount > 1) {
    pessoasCount--;
    pessoasNum.textContent = pessoasCount;
    pessoasInput.value = pessoasCount;
    pessoasNum.style.transform = 'scale(0.8)';
    setTimeout(() => pessoasNum.style.transform = 'scale(1)', 150);
  }
});

document.getElementById('pessoasPlus').addEventListener('click', () => {
  if (pessoasCount < 20) {
    pessoasCount++;
    pessoasNum.textContent = pessoasCount;
    pessoasInput.value = pessoasCount;
    pessoasNum.style.transform = 'scale(1.2)';
    setTimeout(() => pessoasNum.style.transform = 'scale(1)', 150);
  }
});

// Set min date to today
const dateInput = document.getElementById('data');
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
dateInput.min = `${yyyy}-${mm}-${dd}`;

// ─── Real-time Form Validation ────────────────────
const validators = {
  nome: {
    el: document.getElementById('nome'),
    err: document.getElementById('nomeError'),
    validate: (v) => {
      if (!v.trim()) return 'Por favor, informe seu nome.';
      if (v.trim().length < 3) return 'Nome muito curto.';
      return null;
    }
  },
  email: {
    el: document.getElementById('email'),
    err: document.getElementById('emailError'),
    validate: (v) => {
      if (!v.trim()) return 'Por favor, informe seu e-mail.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'E-mail inválido.';
      return null;
    }
  },
  data: {
    el: document.getElementById('data'),
    err: document.getElementById('dataError'),
    validate: (v) => {
      if (!v) return 'Selecione uma data.';
      const sel = new Date(v + 'T00:00:00');
      const now = new Date(); now.setHours(0,0,0,0);
      if (sel < now) return 'A data deve ser futura.';
      const day = sel.getDay();
      if (day === 1) return 'Fechado às segundas-feiras.';
      return null;
    }
  },
  hora: {
    el: document.getElementById('hora'),
    err: document.getElementById('horaError'),
    validate: (v) => {
      if (!v) return 'Selecione um horário.';
      return null;
    }
  }
};

// Attach live validation
Object.values(validators).forEach(({ el, err, validate }) => {
  el.addEventListener('input', () => {
    const msg = validate(el.value);
    err.textContent = msg || '';
    el.classList.toggle('error', !!msg);
    el.classList.toggle('valid', !msg && el.value.trim() !== '');
  });

  el.addEventListener('blur', () => {
    const msg = validate(el.value);
    err.textContent = msg || '';
    el.classList.toggle('error', !!msg);
  });
});

// Form submit
const form = document.getElementById('reservaForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  let hasErrors = false;

  Object.values(validators).forEach(({ el, err, validate }) => {
    const msg = validate(el.value);
    err.textContent = msg || '';
    el.classList.toggle('error', !!msg);
    if (msg) hasErrors = true;
  });

  if (hasErrors) {
    // Shake form on error
    form.style.animation = 'none';
    form.offsetHeight;
    form.style.animation = 'shake 0.4s ease';
    return;
  }

  // Simulate submission
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnLoader = document.getElementById('btnLoader');

  submitBtn.disabled = true;
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');

  await new Promise(r => setTimeout(r, 1500));

  submitBtn.classList.add('hidden');
  document.getElementById('formSuccess').classList.remove('hidden');

  // Reset after 5s
  setTimeout(() => {
    form.reset();
    pessoasCount = 2;
    pessoasNum.textContent = 2;
    pessoasInput.value = 2;
    submitBtn.disabled = false;
    submitBtn.classList.remove('hidden');
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
    document.getElementById('formSuccess').classList.add('hidden');
    Object.values(validators).forEach(({ el }) => {
      el.classList.remove('valid', 'error');
    });
  }, 5000);
});

// Shake keyframe (injected)
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-8px); }
    40%       { transform: translateX(8px); }
    60%       { transform: translateX(-5px); }
    80%       { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

// ─── Gallery Lightbox ────────────────────────────
const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=90', caption: 'Ambiente do Terra & Fogo' },
  { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=90', caption: 'Prato principal — Salmão da Serra' },
  { src: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1200&q=90', caption: 'Bar — Drinks autorais' },
  { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=90', caption: 'Cozinha aberta — O fogo em ação' },
  { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=90', caption: 'Detalhes que fazem a diferença' },
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=90', caption: 'Salão — Atmosfera rústica e acolhedora' },
];

let currentLightbox = 0;
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

function openLightbox(index) {
  currentLightbox = index;
  lightboxImg.src = galleryImages[index].src;
  lightboxCaption.textContent = galleryImages[index].caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target !== lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function prevLightbox(e) {
  e.stopPropagation();
  currentLightbox = (currentLightbox - 1 + galleryImages.length) % galleryImages.length;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = galleryImages[currentLightbox].src;
    lightboxCaption.textContent = galleryImages[currentLightbox].caption;
    lightboxImg.style.opacity = '1';
  }, 200);
}

function nextLightbox(e) {
  e.stopPropagation();
  currentLightbox = (currentLightbox + 1) % galleryImages.length;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = galleryImages[currentLightbox].src;
    lightboxCaption.textContent = galleryImages[currentLightbox].caption;
    lightboxImg.style.opacity = '1';
  }, 200);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
  if (e.key === 'ArrowLeft') prevLightbox(e);
  if (e.key === 'ArrowRight') nextLightbox(e);
});

lightboxImg.style.transition = 'opacity 0.2s ease';

// ─── Scroll Reveal (Intersection Observer) ────────
const revealElements = document.querySelectorAll('.menu-card, .gallery-item, .info-item, .award-badge');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '0';
      entry.target.style.transform = 'translateY(30px)';
      setTimeout(() => {
        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// ─── Footer: current year ─────────────────────────
document.querySelectorAll('.footer-bottom p').forEach(p => {
  p.innerHTML = p.innerHTML.replace('2025', new Date().getFullYear());
});