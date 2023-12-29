document.addEventListener('DOMContentLoaded', function () {
    const burgerIcon = document.getElementById('burgerIcon');
    const navLinks = document.getElementById('navLinks');
  
    burgerIcon.addEventListener('click', function () {
      navLinks.classList.toggle('show');
    });
  });