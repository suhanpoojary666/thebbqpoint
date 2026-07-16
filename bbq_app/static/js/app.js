/* ==========================================================================
   THE BBQ POINT - SCRIPTS & INTERACTIVE LOGIC (2026 PREMIUM STANDARDS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initMobileMenu();
    initStickyHeader();
    initEmbersCanvas();
    initGrillSlider();
    initMenuFilter();
    initReviewsWall();
    initReviewForm();
});

/* ==========================================================================
   SCROLL REVEAL & INTERSECTING OBSERVER
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

/* ==========================================================================
   STICKY HEADER SCROLL DETECTION
   ========================================================================== */
function initStickyHeader() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   INTERACTIVE CANVAS EMBERS ENGINE (BACKGROUND)
   ========================================================================== */
let emberSettings = {
    maxParticles: 50,
    speedMultiplier: 1.0,
    glowBrightness: 0.4
};

function initEmbersCanvas() {
    const canvas = document.getElementById('embers-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class Ember {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height; // Distribute on start
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            this.size = Math.random() * 3 + 1;
            this.speedY = (Math.random() * 1.5 + 0.5) * emberSettings.speedMultiplier;
            this.speedX = (Math.random() * 1 - 0.5) * emberSettings.speedMultiplier;
            this.opacity = Math.random() * 0.7 + 0.2;
            this.color = this.getRandomColor();
            this.wiggle = Math.random() * 0.02;
            this.wiggleSpeed = Math.random() * 0.05;
        }
        
        getRandomColor() {
            const colors = [
                'rgba(255, 193, 7, ', // Yellow
                'rgba(255, 87, 34, ',  // Orange
                'rgba(230, 74, 25, ',  // Red
                'rgba(255, 235, 59, '  // Gold
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.y -= this.speedY;
            this.x += this.speedX + Math.sin(this.y * this.wiggle) * 0.5;
            this.opacity -= 0.003;
            
            if (this.y < -10 || this.opacity <= 0 || this.x < 0 || this.x > canvas.width) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            
            // Draw glow effect for larger particles
            if (this.size > 2) {
                ctx.shadowBlur = 10 * emberSettings.glowBrightness;
                ctx.shadowColor = 'rgba(255, 87, 34, 0.8)';
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < emberSettings.maxParticles; i++) {
        particles.push(new Ember());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Adjust array size if settings changed
        if (particles.length < emberSettings.maxParticles) {
            particles.push(new Ember());
        } else if (particles.length > emberSettings.maxParticles) {
            particles.pop();
        }
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* ==========================================================================
   INTERACTIVE CAR GRILL SLIDER
   ========================================================================== */
function initGrillSlider() {
    const slider = document.getElementById('grill-slider');
    const displayVal = document.getElementById('grill-temp-val');
    const grillHotspot = document.querySelector('.car-hotspot-grill');
    
    if (slider && displayVal) {
        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            displayVal.textContent = `${val}°C`;
            
            // Map values to particles settings
            const percentage = (val - 100) / 300; // 0 to 1
            emberSettings.maxParticles = Math.floor(30 + percentage * 120);
            emberSettings.speedMultiplier = 0.6 + percentage * 2.2;
            emberSettings.glowBrightness = 0.2 + percentage * 1.8;
            
            // Update car grill glow if it exists on the page
            if (grillHotspot) {
                grillHotspot.style.boxShadow = `0 0 ${10 + percentage * 30}px rgb(255, ${61 + percentage * 100}, 0)`;
                grillHotspot.style.background = `rgb(255, ${61 + percentage * 100}, 0)`;
            }
        });
    }
}

/* ==========================================================================
   MENU CARD FILTER
   ========================================================================== */
function initMenuFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            menuCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCat === filterValue) {
                    card.classList.remove('hidden');
                    // Trigger entrance animation
                    card.style.animation = 'none';
                    card.offsetHeight; // Trigger reflow
                    card.style.animation = 'slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

function initReviewsWall() {
    fetchReviews();
}

function fetchReviews() {
    const wall = document.getElementById('reviews-wall');
    if (!wall) return;
    
    fetch('/api/reviews/')
        .then(res => {
            if (!res.ok) throw new Error("Could not load reviews");
            return res.json();
        })
        .then(data => {
            wall.innerHTML = '';
            if (data.length === 0) {
                wall.innerHTML = `
                    <div style="text-align: center; padding: 40px 0; color: var(--color-text-muted);">
                        <i class="fa-solid fa-fire" style="font-size: 1.5rem; margin-bottom: 10px; color: rgba(255,193,7,0.3);"></i>
                        <p>No reviews yet. Be the first to share your experience!</p>
                    </div>
                `;
            } else {
                data.forEach(r => appendReviewToWall(r));
            }
        })
        .catch(err => {
            console.warn("Error loading reviews:", err);
            wall.innerHTML = `
                <div style="text-align: center; padding: 40px 0; color: var(--color-text-muted);">
                    <p>Could not load reviews. Please refresh the page!</p>
                </div>
            `;
        });
}

function appendReviewToWall(review, prepend = false) {
    const wall = document.getElementById('reviews-wall');
    if (!wall) return;
    
    const starsHtml = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const dateStr = review.created_at ? new Date(review.created_at).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
    }) : 'Just now';
    
    const card = document.createElement('div');
    card.className = 'wall-card';
    card.innerHTML = `
        <div class="wall-header">
            <span class="wall-user">${escapeHtml(review.name)}</span>
            <span class="wall-stars">${starsHtml}</span>
        </div>
        <p class="wall-comment">"${escapeHtml(review.comment)}"</p>
        <span class="wall-date">${dateStr}</span>
    `;
    
    if (prepend) {
        wall.insertBefore(card, wall.firstChild);
    } else {
        wall.appendChild(card);
    }
}

/* ==========================================================================
   REVIEW SUBMISSION (WRITE - DRF API)
   ========================================================================== */
function initReviewForm() {
    const form = document.getElementById('review-form');
    const overlay = document.getElementById('success-overlay');
    const overlayClose = document.getElementById('overlay-close');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span style="display:inline-block;animation:float 1s infinite;"><i class="fa-solid fa-fire"></i> Grillin\'...</span>';
            
            const name = document.getElementById('rev-name').value;
            const email = document.getElementById('rev-email').value;
            const comment = document.getElementById('rev-comment').value;
            
            // Get selected rating
            let rating = 5;
            const ratingInput = form.querySelector('input[name="rating"]:checked');
            if (ratingInput) {
                rating = parseInt(ratingInput.value);
            }
            
            const payload = { name, email, rating, comment };
            
            fetch('/api/reviews/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(payload)
            })
            .then(res => {
                if (!res.ok) throw new Error("Server rejected submission");
                return res.json();
            })
            .then(data => {
                // Restore button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // Reset form
                form.reset();
                
                // Prepend to live wall
                appendReviewToWall(data, true);
                
                // Show Success Overlay with Sparkle effect
                showSuccessOverlay();
            })
            .catch(err => {
                console.error("API error:", err);
                alert("Oops! Fire's a bit wild. We couldn't save your review. Please try again!");
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        });
    }
    
    if (overlayClose && overlay) {
        overlayClose.addEventListener('click', () => {
            overlay.classList.remove('active');
            const container = document.getElementById('success-sparkles-container');
            if (container) container.innerHTML = '';
        });
    }
}

function showSuccessOverlay() {
    const overlay = document.getElementById('success-overlay');
    if (!overlay) return;
    
    overlay.classList.add('active');
    spawnSparkles();
}

function spawnSparkles() {
    const container = document.getElementById('success-sparkles-container');
    if (!container) return;
    
    const count = 30;
    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // Random spread
        const x = Math.random() * 320 - 160;
        const y = Math.random() * 320 - 160;
        
        sparkle.style.left = `calc(50% + ${x}px)`;
        sparkle.style.top = `calc(50% + ${y}px)`;
        sparkle.style.backgroundColor = Math.random() > 0.5 ? '#FFC107' : '#FF5722';
        sparkle.style.transform = `scale(${Math.random() * 1.5 + 0.5})`;
        sparkle.style.opacity = Math.random();
        
        container.appendChild(sparkle);
        
        // Animation
        sparkle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${x * 1.5}px, ${y * 1.5}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 800,
            easing: 'cubic-bezier(0.1, 0.8, 0.25, 1)',
            fill: 'forwards'
        });
    }
}

/* ==========================================================================
   UTILITY HELPERS
   ========================================================================== */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
