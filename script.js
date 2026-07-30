// #region Theme toggle
// The initial theme is resolved by an inline script in <head> to avoid a flash.
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      // Storage unavailable (private mode) — theme still applies for this session.
    }
  });
}
// #endregion

// #region Mobile nav
const toggle = document.querySelector('.nav-toggle');
const navbar = document.querySelector('.navbar');

if (toggle && navbar) {
  toggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('active');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const mobileLinks = document.querySelectorAll('.nav-center-mobile a');

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navbar && navbar.classList.contains('active')) {
      navbar.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
});
// #endregion

// #region Scrollspy
// Keeps the nav "active" state in sync with the section currently in view.
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-center a[href^="#"], .nav-center-mobile a[href^="#"]');

if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
  const setActive = id => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActive(visible.target.id);
      }
    },
    {
      // Bias the detection band toward the upper-middle of the viewport so the
      // active link flips when a section actually reads as "current".
      rootMargin: '-25% 0px -55% 0px',
      threshold: [0, 0.15, 0.4]
    }
  );

  sections.forEach(section => observer.observe(section));
}
// #endregion

// #region Pointer spotlight
// Feeds cursor position to CSS custom properties for the radial hover glow.
const spotlightCards = document.querySelectorAll('.spotlight');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (spotlightCards.length && finePointer.matches && !reducedMotion.matches) {
  spotlightCards.forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
    });
  });
}
// #endregion

// #region Reveal fallback
// Browsers without scroll-driven animations get the same reveal via IntersectionObserver.
const supportsScrollTimeline = CSS.supports('animation-timeline: view()');

if (!supportsScrollTimeline && !reducedMotion.matches && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll('.reveal');

  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
  });

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
  );

  revealTargets.forEach(el => revealObserver.observe(el));
}
// #endregion

// #region Nitch phone screenshot rotator
const phone = document.getElementById('nitchPhone');
const phoneDotsWrap = document.getElementById('nitchDots');

if (phone && phoneDotsWrap) {
  const shots = Array.from(phone.querySelectorAll('.phone-shot'));
  const dots = Array.from(phoneDotsWrap.querySelectorAll('.phone-dot'));
  const INTERVAL = 3200;
  let index = 0;
  let timer = null;

  const show = next => {
    index = (next + shots.length) % shots.length;
    shots.forEach((shot, i) => shot.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('is-active', active);
      if (active) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
  };

  const start = () => {
    // Honour reduced motion by leaving the first screenshot up; the dots still
    // work, so the content stays reachable without anything auto-animating.
    if (reducedMotion.matches || timer) return;
    timer = setInterval(() => show(index + 1), INTERVAL);
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stop();
      show(i);
      start();
    });
  });

  // WCAG 2.2.2: auto-updating content needs a way to pause it.
  const region = phone.parentElement;
  region.addEventListener('pointerenter', stop);
  region.addEventListener('pointerleave', start);
  region.addEventListener('focusin', stop);
  region.addEventListener('focusout', start);

  // Don't burn cycles animating a card that isn't on screen.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      entries => entries.forEach(entry => (entry.isIntersecting ? start() : stop())),
      { threshold: 0.2 }
    ).observe(phone);
  } else {
    start();
  }
}
// #endregion

// #region Contact form
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      formStatus.textContent = 'Please fill in your name, a valid email, and a message before sending.';
      formStatus.classList.add('form-status-error');
      return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const gmailLink = `https://mail.google.com/mail/?view=cm&to=ajg359@cornell.edu&su=${subject}&body=${body}`;

    formStatus.classList.remove('form-status-error');
    formStatus.textContent = 'Opening Gmail in a new tab…';
    window.open(gmailLink, '_blank', 'noopener');
  });
}
// #endregion

// #region Footer year
const copyrightYear = document.getElementById('copyrightYear');

if (copyrightYear) {
  copyrightYear.textContent = new Date().getFullYear();
}
// #endregion
