// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Page transition effect
function initPageTransitions() {
    const links = document.querySelectorAll('a:not([href^="#"])');
    const pageTransition = document.createElement('div');
    pageTransition.className = 'page-transition';
    document.body.appendChild(pageTransition);

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.target !== '_blank' && !link.hasAttribute('download')) {
                e.preventDefault();
                const href = link.href;
                pageTransition.classList.remove('exit');
                
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            }
        });
    });

    // Handle back button
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            pageTransition.classList.add('exit');
        }
    });
}

// Temporary bypass for development
document.addEventListener('DOMContentLoaded', () => {
    // Skip authentication check
    console.log('Site loaded - authentication bypassed for development');
    
    // Initialize any other necessary functionality
    initializeSite();
});

function initializeSite() {
    // Your site initialization code here
    console.log('Site initialized');
    
    // Initialize page transitions
    initPageTransitions();
    
    // Add fade-in animation to elements as they become visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // CV Animation on hover
    const cvAnimation = document.getElementById('cvAnimation');
    if (cvAnimation) {
        cvAnimation.addEventListener('mouseenter', () => {
            cvAnimation.style.animation = 'burn 1.5s ease-out forwards';
        });

        cvAnimation.addEventListener('mouseleave', () => {
            cvAnimation.style.animation = 'none';
            void cvAnimation.offsetWidth; // Trigger reflow
        });
    }
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.main-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.transform = 'translateY(0)';
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 50) {
        // Scrolling down & past the navbar
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Add loading animation to buttons when clicked
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        if (!this.querySelector('.loading')) {
            const loader = document.createElement('div');
            loader.className = 'loading';
            this.appendChild(loader);
            
            // Remove loader after transition (if not navigating away)
            setTimeout(() => {
                loader.remove();
            }, 2000);
        }
    });
}); 