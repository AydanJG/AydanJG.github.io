// Select the toggle button and navbar
const toggle = document.querySelector('.nav-toggle');
const navbar = document.querySelector('.navbar');

// Toggle the active class when the button is clicked
if (toggle && navbar) {
  toggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('active');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Close the menu when a nav link is clicked (for better UX on mobile)
const navLinks = document.querySelectorAll('.nav-center-mobile a');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navbar && navbar.classList.contains('active')) {
      navbar.classList.remove('active');
    }
  });
});


const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');

    if (!contactForm.checkValidity()) {
      formStatus.textContent = 'Please fill in your name, email, and message before sending.';
      formStatus.classList.add('form-status-error');
      return;
    }

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();

    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

    const gmailLink = `https://mail.google.com/mail/?view=cm&to=ajg359@cornell.edu&su=${subject}&body=${body}`;

    formStatus.classList.remove('form-status-error');
    formStatus.textContent = 'Opening Gmail in a new tab…';
    window.open(gmailLink, '_blank');
  });
}

const copyrightYear = document.getElementById('copyrightYear');
if (copyrightYear) {
  copyrightYear.textContent = new Date().getFullYear();
}
