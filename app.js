/**
 * SAHIL KUMAR SINGH — OFFICIAL PORTFOLIO JAVASCRIPT
 * Apple macOS Liquid Glass Physics, Modal Lightbox, Theme Manager
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypingAnimation();
  initNavigation();
  initCopyActions();
  initContactForm();
  initCertificateModal();
});

/* ==========================================================================
   1. THEME CONTROLLER (macOS Dark Titanium & Studio Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('sahil_theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to macOS ${newTheme === 'dark' ? 'Dark Titanium' : 'Studio Light'} Mode`);
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('sahil_theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
  }
}

/* ==========================================================================
   2. TYPING HEADLINE ANIMATION
   ========================================================================== */
function initTypingAnimation() {
  const textElement = document.getElementById('typing-text');
  if (!textElement) return;

  const phrases = [
    'Live Web Apps with AI & Vibe Coding',
    'Class 10th & 12th Pass (CBSE Certified)',
    'redrmyaio.vercel.app & All-In-One Tools',
    'Working Software without Traditional Syntax',
    'High-Velocity AI Prompting & Workflows',
    'Fast Production Deploys on Vercel'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      textElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      textElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before typing new word
    }

    setTimeout(typeLoop, typingSpeed);
  }

  typeLoop();
}

/* ==========================================================================
   3. NAVIGATION DOCK & ACTIVE INDICATOR
   ========================================================================== */
function initNavigation() {
  const dockItems = document.querySelectorAll('.dock-item');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const dockLinks = document.querySelector('.dock-links');

  // Mobile menu toggle
  if (mobileToggle && dockLinks) {
    mobileToggle.addEventListener('click', () => {
      dockLinks.classList.toggle('open');
    });

    // Close on navigation click
    dockItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          dockLinks.classList.remove('open');
        }
      });
    });
  }

  // ScrollSpy for Dock items
  window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        dockItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   4. COPY TO CLIPBOARD & TOAST SYSTEM
   ========================================================================== */
function initCopyActions() {
  const copyLinkBtns = document.querySelectorAll('.copy-link-btn');
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');

  copyLinkBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      if (url) {
        navigator.clipboard.writeText(url).then(() => {
          showToast(`URL Copied: ${url}`);
        }).catch(() => {
          showToast('Failed to copy to clipboard');
        });
      }
    });
  });

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email');
      if (email) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Email Copied: ${email}`);
        }).catch(() => {
          showToast('Failed to copy email');
        });
      }
    });
  });


}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   5. CONTACT FORM INTERACTION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('sender-name').value.trim();
    const email = document.getElementById('sender-email').value.trim();
    const subject = document.getElementById('message-subject').value.trim();
    const message = document.getElementById('message-body').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    const mailtoUri = `mailto:sahilrajpta.n69@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent("Sender Name: " + name + "\nSender Email: " + email + "\n\n" + message)}`;

    showToast('Opening default email client to send message...');
    window.location.href = mailtoUri;

    form.reset();
  });
}

/* ==========================================================================
   6. CERTIFICATE LIGHTBOX MODAL
   ========================================================================== */
function initCertificateModal() {
  const modal = document.getElementById('cert-modal');
  if (!modal) return;

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeCertModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeCertModal();
    }
  });
}

window.openCertModal = function(imageSrc, title, subtitle) {
  const modal = document.getElementById('cert-modal');
  const modalImg = document.getElementById('cert-modal-img');
  const modalTitle = document.getElementById('cert-modal-title');
  const modalSubtitle = document.getElementById('cert-modal-subtitle');
  const downloadLink = document.getElementById('cert-download-link');

  if (!modal || !modalImg) return;

  modalImg.src = imageSrc;
  if (modalTitle) modalTitle.textContent = title || 'Certificate Inspection';
  if (modalSubtitle) modalSubtitle.textContent = subtitle || '';
  if (downloadLink) {
    downloadLink.href = imageSrc;
    downloadLink.setAttribute('download', imageSrc);
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

window.closeCertModal = function() {
  const modal = document.getElementById('cert-modal');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};
