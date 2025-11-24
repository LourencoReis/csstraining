// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Dog photo gallery auto-scroll
    const galleries = document.querySelectorAll('.dog-gallery');
    
    galleries.forEach((Gallery, galleryIndex) => {
        const slides = Gallery.querySelectorAll('.dog-slide');
        let currentSlide = 0;
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            gallery.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        
        // Auto-scroll every 3 seconds
        setInterval(nextSlide, 3000);
    });
});
