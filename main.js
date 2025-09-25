// Main JavaScript for VIT Bhopal Campus Tour

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoader();
    initNavigation();
    initParticles();
    initAnimations();
    initCounters();
    initContactForm();
    initTourCards();
    initSmoothScrolling();
});

// Loading Screen
function initLoader() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    });
}

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Active link highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Particle Background
function initParticles() {
    const particlesContainer = document.getElementById('particlesContainer');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random color variation
        const hue = Math.random() * 60 + 220; // Blue to purple range
        particle.style.background = `hsl(${hue}, 70%, 60%)`;
        
        particlesContainer.appendChild(particle);
        
        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
                createParticle();
            }
        }, 6000);
    }
}

// Scroll Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.feature-card, .tour-card, .contact-item, .stat-card');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// Contact Form with Email.js
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Initialize Email.js with your public key
    (function() {
        emailjs.init("QC0tm7J1LheIuk7J3"); // Replace with your public key
    })();
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');
        
        // Validate form
        if (!name || !email || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Sending...';
        submitBtn.disabled = true;
        
        // Prepare email parameters
        const templateParams = {
            name: name,
            email: email,
            phone: phone || 'Not provided',
            message: message,
            to_email: 'info@vitbhopal.ac.in'
        };
        
        // Send email using Email.js
        emailjs.send('service_m23icog', 'template_gbyvwwz', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                submitBtn.innerHTML = '<span class="btn-icon">✅</span> Sent!';
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = '<span class="btn-icon">📤</span> Send Message';
                    submitBtn.disabled = false;
                }, 2000);
            })
            .catch(function(error) {
                console.log('FAILED...', error);
                submitBtn.innerHTML = '<span class="btn-icon">❌</span> Failed';
                showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = '<span class="btn-icon">📤</span> Send Message';
                    submitBtn.disabled = false;
                }, 2000);
            });
    });
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Tour Cards
function initTourCards() {
    const tourCards = document.querySelectorAll('.tour-card');
    const startTourBtn = document.getElementById('startTourBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');

    // Add click event listeners to each tour location card
    tourCards.forEach(card => {
        card.addEventListener('click', function() {
            // Get the location from the card's data-attribute
            const location = card.getAttribute('data-location');
            
            // Ensure a location is defined before proceeding
            if (!location) {
                showNotification('Error: No location defined for this tour card!', 'error');
                return;
            }

            // Show an initial notification to the user
            showNotification(`Opening ${location} virtual tour...`, 'info');
            
            // Add a visual click animation to the card
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = ''; // Reset animation
            }, 150);
            
            // Simulate a loading delay and then redirect
            setTimeout(() => {
                // Use encodeURIComponent to handle special characters in location names
                window.location.href = `tour%20project/campus%20tour.html?scene=${encodeURIComponent(location)}`;
            }, 1500); // 1.5-second delay before redirection
        });
    });
    
    // Add click event listener for the main "Start Virtual Tour" button
    if (startTourBtn) {
        startTourBtn.addEventListener('click', function() {
            showNotification('Starting virtual campus tour...', 'info');
            
            // Add a small delay for the notification to show, then navigate
            setTimeout(() => {
                window.location.href = 'tour%20project/campus%20tour.html';
            }, 1000); // 1-second delay
        });
    }
    
    // Add click event listener for the "Learn More" button to scroll
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--glass);
        backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        padding: 1rem 1.5rem;
        color: var(--text-primary);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        box-shadow: var(--shadow-lg);
    `;
    
    // Add type-specific styling
    switch(type) {
        case 'success':
            notification.style.borderColor = '#10b981';
            break;
        case 'error':
            notification.style.borderColor = '#ef4444';
            break;
        case 'warning':
            notification.style.borderColor = '#f59e0b';
            break;
        default:
            notification.style.borderColor = '#6366f1';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        default: return 'ℹ️';
    }
}

// Parallax Effect
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-background');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add some interactive hover effects
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.feature-card, .stat-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        } else {
            card.style.transform = '';
        }
    });
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Performance optimization - lazy load heavy content
const lazyLoadObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            
            // Add any heavy animations or content here
            if (element.classList.contains('hero')) {
                // Initialize hero animations
                element.classList.add('loaded');
            }
            
            lazyLoadObserver.unobserve(element);
        }
    });
});

// Observe sections for lazy loading
const sectionsToLazyLoad = document.querySelectorAll('section');
sectionsToLazyLoad.forEach(section => {
    lazyLoadObserver.observe(section);
});

console.log('🎓 VIT Bhopal Campus Tour initialized successfully!');