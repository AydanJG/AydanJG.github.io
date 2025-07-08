// Select the toggle button and navbar
const toggle = document.querySelector('.nav-toggle');
const navbar = document.querySelector('.navbar');

// Toggle the active class when the button is clicked
toggle.addEventListener('click', () => {
  navbar.classList.toggle('active');
});

// Close the menu when a nav link is clicked (for better UX on mobile)
const navLinks = document.querySelectorAll('.nav-center-mobile a');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    // If the navbar is active, close it
    if (navbar.classList.contains('active')) {
      navbar.classList.remove('active');
    }
  });
});


document.getElementById('sendEmailButton').addEventListener('click', function() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
  
    // Build email subject and body
    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  
    // Gmail compose link
    const gmailLink = `https://mail.google.com/mail/?view=cm&to=ajg359@cornell.edu&su=${subject}&body=${body}`;
  
    // Open Gmail compose in a new tab
    window.open(gmailLink, '_blank');
  });
