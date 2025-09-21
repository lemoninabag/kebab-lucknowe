// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const menuCategories = document.querySelectorAll('.menu-category');
const galleryItems = document.querySelectorAll('.gallery-item');
const contactForm = document.querySelector('.contact-form form');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(254, 238, 211, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(254, 238, 211, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Menu category switching
menuCategories.forEach(category => {
    category.addEventListener('click', () => {
        // Remove active class from all categories
        menuCategories.forEach(cat => cat.classList.remove('active'));
        // Add active class to clicked category
        category.classList.add('active');
        
        // Get the selected category
        const selectedCategory = category.getAttribute('data-category');
        
        // Filter menu items based on category
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (itemCategory === selectedCategory) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.5s ease-out';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Gallery lightbox effect
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('.gallery-image');
        if (img) {
            createLightbox(img.src, img.alt);
        }
    });
});

// Create lightbox modal
function createLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${src}" alt="${alt}" class="lightbox-image">
        </div>
    `;
    
    // Add lightbox styles
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    lightboxContent.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    lightboxImage.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 8px;
    `;
    
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 30px;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.5);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;
    `;
    
    document.body.appendChild(lightbox);
    
    // Animate in
    setTimeout(() => {
        lightbox.style.opacity = '1';
        lightboxContent.style.transform = 'scale(1)';
    }, 10);
    
    // Close functionality
    const closeLightbox = () => {
        lightbox.style.opacity = '0';
        lightboxContent.style.transform = 'scale(0.8)';
        setTimeout(() => {
            document.body.removeChild(lightbox);
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Contact form handling
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const phone = contactForm.querySelector('input[type="tel"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animatedElements = document.querySelectorAll('.feature, .menu-item, .gallery-item, .contact-item');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1s ease-out';
    }
});

// Add loading class to body initially
document.body.classList.add('loading');

// Smooth reveal animation for sections
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
        }
    });
}, {
    threshold: 0.1
});

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Add CSS for section animations
const style = document.createElement('style');
style.textContent = `
    .loading {
        overflow: hidden;
    }
    
    .loaded {
        overflow: auto;
    }
    
    section {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    section.section-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .hero {
        opacity: 1;
        transform: none !important;
    }
    
    .lightbox-close:hover {
        background: rgba(0, 0, 0, 0.8) !important;
    }
`;
document.head.appendChild(style);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Add keyboard navigation styles
const keyboardStyle = document.createElement('style');
keyboardStyle.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid #d4af37 !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(keyboardStyle);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Navbar background change
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(254, 238, 211, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(254, 238, 211, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    }
    
    // Parallax effect
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Live Clock and Restaurant Status
function updateClockAndStatus() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    const currentTime = currentHour * 60 + currentMinute;
    
    // Restaurant hours: 12:00 PM (720 minutes) to 12:00 AM (1440 minutes)
    const openTime = 12 * 60; // 12:00 PM
    const closeTime = 24 * 60; // 12:00 AM (midnight)
    
    // Update clock hands
    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');
    const currentTimeDisplay = document.getElementById('current-time');
    const closingIndicator = document.getElementById('closing-indicator');
    
    // Calculate angles (12 o'clock = 0 degrees, 3 o'clock = 90 degrees, 6 o'clock = 180 degrees, 9 o'clock = 270 degrees)
    const secondAngle = currentSecond * 6; // 6 degrees per second
    const minuteAngle = currentMinute * 6; // 6 degrees per minute
    const hourAngle = ((currentHour % 12) * 30) + (currentMinute * 0.5); // 30 degrees per hour + minute adjustment
    
    // Closing time is 12:00 AM (midnight) = pointing straight up = 0 degrees
    const closingAngle = 0; // 12:00 AM is at the top
    
    // Apply rotations
    secondHand.style.transform = `translateX(-50%) rotate(${secondAngle}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
    hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
    closingIndicator.style.transform = `translate(-50%, -100%) rotate(${closingAngle}deg)`;
    
    // Update digital time display
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    currentTimeDisplay.textContent = timeString;
    
    // Update status
    const statusTitle = document.getElementById('status-title');
    const statusMessage = document.getElementById('status-message');
    const statusLight = document.getElementById('status-light');
    const directionsButton = document.getElementById('directions-button');
    const whatsappButton = document.getElementById('whatsapp-button');
    const statusSection = document.querySelector('.status');
    
    if (currentTime >= openTime && currentTime < closeTime) {
        // Restaurant is open
        statusTitle.textContent = "We're Open!";
        statusMessage.textContent = "We would love for you to dine-in or takeaway";
        statusLight.classList.remove('closed');
        statusSection.classList.remove('closed');
        directionsButton.style.display = 'flex';
        whatsappButton.style.display = 'none';
    } else {
        // Restaurant is closed
        statusTitle.textContent = "We're Closed";
        statusMessage.textContent = "We open at 12:00 PM tomorrow";
        statusLight.classList.add('closed');
        statusSection.classList.add('closed');
        directionsButton.style.display = 'none';
        whatsappButton.style.display = 'flex';
    }
}

// Update clock and status on page load
updateClockAndStatus();

// Update clock every second and status every minute
setInterval(updateClockAndStatus, 1000);

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment the following lines if you want to add PWA functionality
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}
