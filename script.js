document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. MOBILE NAVIGATION TOGGLE
    // ==========================================================================
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar a');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuIcon.classList.remove('bx-x');
                navbar.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !menuIcon.contains(e.target) && navbar.classList.contains('active')) {
                menuIcon.classList.remove('bx-x');
                navbar.classList.remove('active');
            }
        });
    }

    // ==========================================================================
    // 2. STICKY HEADER & SCROLL PROGRESS
    // ==========================================================================
    const header = document.querySelector('.header');
    const scrollTopBtn = document.querySelector('#scrollTopBtn');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Sticky Header Glassmorphism
        if (header) {
            header.classList.toggle('sticky', scrollY > 50);
        }

        // Floating Scroll-To-Top Button
        if (scrollTopBtn) {
            if (scrollY > 350) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }

        // Active Nav Link Update on Scroll
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // Scroll to Top Smooth Action
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // ==========================================================================
    // 4. INTERSECTION OBSERVER FOR SCROLL REVEALS
    // ==========================================================================
    const revealItems = document.querySelectorAll('.reveal-item');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // ==========================================================================
    // 5. ANIMATED SKILL PROGRESS BARS
    // ==========================================================================
    const skillBars = document.querySelectorAll('.skills-content .bar span');
    const skillsSection = document.querySelector('.skills');

    if (skillsSection && skillBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillBars.forEach(bar => {
                        const progress = bar.getAttribute('data-progress');
                        if (progress) {
                            bar.style.width = progress;
                        }
                    });
                    observer.unobserve(entry.target); // Animate once
                }
            });
        }, {
            threshold: 0.25
        });

        skillsObserver.observe(skillsSection);
    }

    // ==========================================================================
    // 6. CONTACT FORM AJAX SUBMISSION WITH FORMSPREE
    // ==========================================================================
    const contactForm = document.querySelector('#contact-form');
    const formStatus = document.querySelector('#form-status');
    const submitBtn = document.querySelector('#submit-btn');

    if (contactForm && formStatus && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSpan = submitBtn.querySelector('span');
            const originalText = btnSpan ? btnSpan.textContent : 'Send Message';
            
            if (btnSpan) btnSpan.textContent = 'Sending...';
            submitBtn.disabled = true;
            formStatus.className = 'form-status';
            formStatus.style.display = 'none';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                    formStatus.className = 'form-status success';
                    formStatus.style.display = 'block';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data && data.errors) {
                        formStatus.textContent = data.errors.map(error => error.message).join(', ');
                    } else {
                        formStatus.textContent = 'Oops! There was a problem submitting your form. Please try again.';
                    }
                    formStatus.className = 'form-status error';
                    formStatus.style.display = 'block';
                }
            } catch (error) {
                formStatus.textContent = 'Oops! Network error. Please check your connection and try again.';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
            } finally {
                if (btnSpan) btnSpan.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});