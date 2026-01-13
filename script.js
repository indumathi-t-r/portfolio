/* ===== Active nav link on scroll ===== */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navlink');

  function highlightNav() {
    let scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const link = document.querySelector(`.navlink[href="#${sectionId}"]`);
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav);
  highlightNav();
})();

/* ===== Theme Toggle ===== */
(function () {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const icon = themeToggle?.querySelector('.toggle-icon');
  const text = themeToggle?.querySelector('.toggle-text');

  // Check saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
    if (icon) icon.textContent = '☀️';
   // if (text) text.textContent = 'Light';
  }

  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
   // if (text) text.textContent = isDark ? 'Light' : 'Dark';
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
})();

/* ===== Typewriter Role Switcher ===== */
(function () {
  const roles = [
    'AI/ML Engineer',
    'Data Engineer',
    'Software Developer'
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const roleElement = document.getElementById('role-text');
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseDuration = 2000;

  function typeRole() {
    if (!roleElement) return;

    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      roleElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      roleElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      speed = pauseDuration;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 500;
    }

    setTimeout(typeRole, speed);
  }

  typeRole();
})();

/* ===== Skills Tabs Filter ===== */
(function () {
  const tabs = document.querySelectorAll('.tab');
  const skillItems = document.querySelectorAll('.skill-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;
      
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      skillItems.forEach(item => {
        const category = item.dataset.category;
        if (filter === 'all' || category === filter) {
          item.style.display = 'grid';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
})();

/* ===== Projects Filter ===== */
(function () {
  const filters = document.querySelectorAll('.pf');
  const projectCards = document.querySelectorAll('.project-card');

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      const category = filter.dataset.filter;
      
      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      projectCards.forEach(card => {
        const cardCategory = card.dataset.category || '';
        if (category === 'all' || cardCategory.includes(category)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

/* ===== Mobile Navigation Toggle ===== */
(function () {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('open');
    const isOpen = navMenu?.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
})();

/* ===== Certificate Modal ===== */
(function () {
  const certModal = document.getElementById('certModal');
  const certImage = document.getElementById('certImage');
  const certDownload = document.getElementById('certDownload');
  const certClose = document.querySelector('.cert-close');

  const certPaths = {
    award1: './assets/certificates/award_feb2024.pdf',
    award2: './assets/certificates/award_july2023.pdf',
    award3: './assets/certificates/award_march2023.pdf',
    promotion: './assets/certificates/promotion.pdf'
  };

  document.querySelectorAll('.cert-inline-link').forEach(link => {
    link.addEventListener('click', () => {
      const certKey = link.dataset.cert;
      const certPath = certPaths[certKey];
      
      if (certPath) {
        certDownload.href = certPath;
        
        // Create iframe for PDF viewing
        const iframe = document.createElement('iframe');
        iframe.src = certPath;
        iframe.className = 'pdf-viewer';
        iframe.style.width = '100%';
        iframe.style.height = 'calc(100% - 60px)';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        
        const modalContent = document.querySelector('.cert-modal-content');
        const existingIframe = modalContent.querySelector('.pdf-viewer');
        if (existingIframe) existingIframe.remove();
        
        modalContent.insertBefore(iframe, certDownload);
        certModal.classList.add('active');
      }
    });
  });

  certClose?.addEventListener('click', () => {
    certModal.classList.remove('active');
  });

  certModal?.addEventListener('click', (e) => {
    if (e.target === certModal) {
      certModal.classList.remove('active');
    }
  });
})();

/* ===== Contact Form Submission ===== */
(function () {
  const form = document.getElementById('contactForm');
  const statusDiv = document.getElementById('formStatus');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!statusDiv) return;
    
    statusDiv.textContent = 'Sending...';
    statusDiv.className = 'form-status loading';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        statusDiv.textContent = '✓ Message sent successfully!';
        statusDiv.className = 'form-status success';
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      statusDiv.textContent = '✗ Something went wrong. Please try again.';
      statusDiv.className = 'form-status error';
    }
  });
})();