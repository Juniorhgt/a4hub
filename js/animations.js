// CV Burning Animation Effect
class CVBurningEffect {
    constructor(element) {
        this.element = element;
        this.particles = [];
        this.explosionParticles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setup();
        this.isExploding = false;
        this.cvImage = new Image();
        this.cvImage.src = 'images/cv-template.png';
        this.cvImage.onload = () => {
            this.resize();
            this.animate();
            // Start explosion after a short delay
            setTimeout(() => this.startExplosion(), 2000);
        };
    }

    setup() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.element.appendChild(this.canvas);
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.width = this.canvas.width = this.element.offsetWidth;
        this.height = this.canvas.height = this.element.offsetHeight;
    }

    createParticle(x, y, isExplosion = false) {
        const angle = Math.random() * Math.PI * 2;
        const speed = isExplosion ? Math.random() * 12 + 6 : Math.random() * 2 + 1;
        const size = isExplosion ? Math.random() * 8 + 4 : Math.random() * 3 + 1;
        
        // Create dramatic explosion particles with red and black colors
        const isRed = Math.random() > 0.5;
        return {
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size,
            alpha: 1,
            color: isExplosion ? 
                (isRed ? `rgba(255, 0, 0, 1)` : `rgba(0, 0, 0, 1)`) : // Red and black explosion
                `rgba(255, ${Math.random() * 100 + 100}, 0, 1)`,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.5,
            gravity: isExplosion ? 0.3 : 0.1
        };
    }

    createExplosion(x, y) {
        // Create more particles for a dramatic effect
        for (let i = 0; i < 150; i++) { // Increased number of particles
            this.explosionParticles.push(this.createParticle(x, y, true));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw CV template before explosion
        if (!this.isExploding && this.cvImage.complete) {
            const scale = Math.min(this.width / this.cvImage.width, this.height / this.cvImage.height);
            const x = (this.width - this.cvImage.width * scale) / 2;
            const y = (this.height - this.cvImage.height * scale) / 2;
            this.ctx.drawImage(this.cvImage, x, y, this.cvImage.width * scale, this.cvImage.height * scale);
        }

        // Update and draw explosion particles
        for (let i = this.explosionParticles.length - 1; i >= 0; i--) {
            const p = this.explosionParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.alpha *= 0.97; // Slower fade
            p.rotation += p.rotationSpeed;

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.fillStyle = p.color.replace('1)', `${p.alpha})`);
            this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
            this.ctx.restore();

            if (p.alpha < 0.01) {
                this.explosionParticles.splice(i, 1);
            }
        }

        if (this.explosionParticles.length > 0 || !this.isExploding) {
            requestAnimationFrame(() => this.animate());
        }
    }

    startExplosion() {
        if (!this.isExploding) {
            this.isExploding = true;
            const centerX = this.width / 2;
            const centerY = this.height / 2;
            this.createExplosion(centerX, centerY);
            
            // Add more intense shake effect
            this.element.style.animation = 'shake 1s';
            setTimeout(() => {
                this.element.style.animation = '';
            }, 1000);

            this.animate();
        }
    }
}

// Initialize burning effect on CV animation container
document.addEventListener('DOMContentLoaded', () => {
    const cvContainer = document.getElementById('cvAnimation');
    if (cvContainer) {
        new CVBurningEffect(cvContainer);
    }
});

// Arrow bounce animation
function initArrowAnimations() {
    document.querySelectorAll('.arrow').forEach(arrow => {
        arrow.addEventListener('mouseenter', () => {
            arrow.style.animation = 'bounce 0.5s infinite';
        });

        arrow.addEventListener('mouseleave', () => {
            arrow.style.animation = '';
        });
    });
}

// Page transition animations
function initPageTransitions() {
    const transition = document.createElement('div');
    transition.className = 'page-transition exit';
    document.body.appendChild(transition);

    window.addEventListener('load', () => {
        setTimeout(() => {
            transition.classList.add('exit');
        }, 500);
    });
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    initArrowAnimations();
    initPageTransitions();
}); 