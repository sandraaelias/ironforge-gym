/* ===========================
   IRONFORGE GYM — script.js
=========================== */

// ===========================
// 1. NAVBAR — scroll + hamburger
// ===========================
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Navbar background on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  }
});

// ===========================
// 2. SCROLL REVEAL ANIMATION
// ===========================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger delay based on position among siblings
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const siblingIndex = siblings.indexOf(entry.target);
      const delay = siblingIndex * 100;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===========================
// 3. TESTIMONIAL SLIDER
// ===========================
const testiCards = document.querySelectorAll('.testi-card');
const testiDots  = document.querySelectorAll('.dot');
const testiPrev  = document.getElementById('testiPrev');
const testiNext  = document.getElementById('testiNext');

let currentSlide = 0;
let autoPlayTimer = null;

function goToSlide(index) {
  // Remove active from all
  testiCards.forEach(card => card.classList.remove('active'));
  testiDots.forEach(dot  => dot.classList.remove('active'));

  // Set new active
  currentSlide = (index + testiCards.length) % testiCards.length;
  testiCards[currentSlide].classList.add('active');
  testiDots[currentSlide].classList.add('active');
}

// Arrow buttons
testiNext.addEventListener('click', () => {
  goToSlide(currentSlide + 1);
  resetAutoPlay();
});

testiPrev.addEventListener('click', () => {
  goToSlide(currentSlide - 1);
  resetAutoPlay();
});

// Dot navigation
testiDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    goToSlide(index);
    resetAutoPlay();
  });
});

// Auto play every 5 seconds
function startAutoPlay() {
  autoPlayTimer = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 5000);
}

function resetAutoPlay() {
  clearInterval(autoPlayTimer);
  startAutoPlay();
}

startAutoPlay();

// Keyboard navigation for slider
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
  if (e.key === 'ArrowLeft')  goToSlide(currentSlide - 1);
});

// Touch / swipe support
let touchStartX = 0;
let touchEndX   = 0;

const slider = document.querySelector('.testi-slider');

slider.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

slider.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) < 50) return; // ignore small movements
  if (diff > 0) {
    goToSlide(currentSlide + 1); // swipe left → next
  } else {
    goToSlide(currentSlide - 1); // swipe right → prev
  }
  resetAutoPlay();
}

// ===========================
// 4. CONTACT FORM
// ===========================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('.btn-primary');
  const originalText = btn.textContent;

  // Loading state
  btn.textContent = 'Sending...';
  btn.style.opacity = '0.7';
  btn.style.pointerEvents = 'none';

  // Simulate submission delay
  setTimeout(() => {
    btn.textContent = '✓ Message Sent!';
    btn.style.opacity = '1';
    btn.style.background = '#22c55e';

    // Reset form
    contactForm.reset();

    // Reset button after 3 seconds
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.pointerEvents = '';
    }, 3000);
  }, 1500);
});

// ===========================
// 5. SMOOTH ACTIVE NAV LINK
// ===========================
const sections = document.querySelectorAll('section[id], footer');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active-link');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));

// ===========================
// 6. PRICING CARD TILT EFFECT
// ===========================
const priceCards = document.querySelectorAll('.price-card');

priceCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const centerX = rect.width  / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) *  5;

    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    if (card.classList.contains('featured')) {
      card.style.transform = 'translateY(-12px)';
    }
  });
});

// ===========================
// 7. STATS COUNTER ANIMATION
// ===========================
const statNums = document.querySelectorAll('.stat-num');

function animateCounter(el) {
  const target = el.textContent;
  const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
  const suffix = target.replace(/[0-9]/g, '').trim();
  const duration = 1800;
  const steps    = 60;
  const increment = numericValue / steps;
  let current = 0;
  let step    = 0;

  const timer = setInterval(() => {
    step++;
    current = Math.min(Math.round(increment * step), numericValue);

    // Format with comma if needed
    el.textContent = current.toLocaleString() + suffix;

    if (step >= steps) clearInterval(timer);
  }, duration / steps);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));
