/**
 * HealthO Pro — Futuristic JavaScript Engine
 * Particles, animations, interactions, filtering
 */

document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // PRELOADER
    // ============================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => preloader.classList.add('hidden'), 500);
        });
        setTimeout(() => preloader.classList.add('hidden'), 2500);
    }

    // ============================
    // PARTICLE CANVAS
    // ============================
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId;

        const resize = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.fadeDir = Math.random() > 0.5 ? 1 : -1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.fadeDir * 0.003;
                if (this.opacity > 0.5) this.fadeDir = -1;
                if (this.opacity < 0.05) this.fadeDir = 1;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 180, 216, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles
        const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        // Draw connecting lines between nearby particles
        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        const opacity = (1 - dist / 150) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 180, 216, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawLines();
            animId = requestAnimationFrame(animate);
        }
        animate();

        // Performance: pause when out of view
        const heroObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    if (!animId) animate();
                } else {
                    cancelAnimationFrame(animId);
                    animId = null;
                }
            });
        });
        heroObs.observe(canvas.parentElement);
    }

    // ============================
    // NAVBAR
    // ============================
    const navbar = document.getElementById('navbar');
    const hasHero = !!document.querySelector('.hero');

    if (navbar && !hasHero) {
        navbar.dataset.alwaysScrolled = 'true';
    }

    const handleNavScroll = () => {
        if (!navbar || navbar.dataset.alwaysScrolled) return;
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ============================
    // MOBILE NAV
    // ============================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            navToggle.classList.toggle('active');
            const ma = navMenu.querySelector('.mobile-actions');
            if (ma) ma.style.display = navMenu.classList.contains('open') ? 'flex' : 'none';
        });

        navMenu.querySelectorAll('.nav-link').forEach(l => {
            l.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                const ma = navMenu.querySelector('.mobile-actions');
                if (ma) ma.style.display = 'none';
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
            }
        });
    }

    // ============================
    // ACTIVE NAV HIGHLIGHTING
    // ============================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hasHero) {
        const highlightNav = () => {
            const scrollY = window.scrollY + 200;
            sections.forEach(sec => {
                const top = sec.offsetTop;
                const id = sec.getAttribute('id');
                if (scrollY >= top && scrollY < top + sec.offsetHeight) {
                    navLinks.forEach(l => {
                        l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
                    });
                }
            });
        };
        window.addEventListener('scroll', highlightNav, { passive: true });
    }

    // ============================
    // SCROLL REVEAL
    // ============================
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');

    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObs.observe(el));

    // ============================
    // COUNTER ANIMATION
    // ============================
    const counters = document.querySelectorAll('[data-count]');
    let countersRan = false;

    const runCounters = () => {
        if (countersRan) return;
        countersRan = true;
        counters.forEach(c => {
            const target = parseInt(c.dataset.count);
            const dur = 2000;
            const step = target / (dur / 16);
            let val = 0;
            const tick = () => {
                val += step;
                if (val < target) {
                    c.textContent = Math.floor(val);
                    requestAnimationFrame(tick);
                } else {
                    c.textContent = target;
                }
            };
            tick();
        });
    };

    const counterTarget = document.querySelector('.stats-bar') || document.querySelector('.hero-stats');
    if (counterTarget) {
        const cObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) { runCounters(); cObs.unobserve(e.target); }
            });
        }, { threshold: 0.3 });
        cObs.observe(counterTarget);
    }

    // ============================
    // JOB FILTER
    // ============================
    document.querySelectorAll('.jobs-filter').forEach(filterGroup => {
        filterGroup.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                const cards = document.querySelectorAll('.job-card, .hc-job-card');
                let count = 0;

                cards.forEach(card => {
                    const show = filter === 'all' || card.dataset.category === filter;
                    card.style.display = show ? '' : 'none';
                    if (show) {
                        card.style.animation = 'none';
                        card.offsetHeight; // reflow
                        card.style.animation = 'fadeInUp 0.5s var(--ease-out-expo) forwards';
                        count++;
                    }
                });

                const jobCount = document.getElementById('jobCount');
                if (jobCount) jobCount.textContent = count;
            });
        });
    });

    // ============================
    // SEARCH (Healthcare Jobs)
    // ============================
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const kw = (document.getElementById('searchKeyword')?.value || '').toLowerCase().trim();
            const loc = (document.getElementById('searchLocation')?.value || '').toLowerCase().trim();
            const cat = (document.getElementById('searchCategory')?.value || '').toLowerCase().trim();

            let count = 0;
            document.querySelectorAll('.hc-job-card').forEach(card => {
                const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
                const location = card.querySelector('.hc-job-detail')?.textContent.toLowerCase() || '';
                const category = card.dataset.category || '';

                const match = (!kw || title.includes(kw)) &&
                              (!loc || location.includes(loc)) &&
                              (!cat || category === cat);

                card.style.display = match ? '' : 'none';
                if (match) count++;
            });

            const jobCount = document.getElementById('jobCount');
            if (jobCount) jobCount.textContent = count;

            // Reset filter buttons
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');
        });

        // Search on enter
        ['searchKeyword', 'searchLocation'].forEach(id => {
            const input = document.getElementById(id);
            if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') searchBtn.click(); });
        });
    }

    // ============================
    // BACK TO TOP
    // ============================
    const btt = document.getElementById('backToTop');
    if (btt) {
        window.addEventListener('scroll', () => {
            btt.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });
        btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ============================
    // CONTACT FORM
    // ============================
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.innerHTML = 'Sending...';
            btn.disabled = true;

            const formData = new FormData(form);

            try {
                const response = await fetch('contact.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (response.ok && result.status === 'success') {
                    btn.innerHTML = '✓ Message Sent Successfully!';
                    btn.style.background = 'linear-gradient(135deg, #2ECC71, #27AE60)';
                    setTimeout(() => {
                        btn.innerHTML = orig;
                        btn.style.background = '';
                        btn.disabled = false;
                        form.reset();
                    }, 3000);
                } else {
                    btn.innerHTML = '❌ ' + (result.message || 'Error sending message');
                    btn.style.background = 'linear-gradient(135deg, #E74C3C, #C0392B)';
                    setTimeout(() => {
                        btn.innerHTML = orig;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 4000);
                }
            } catch (error) {
                btn.innerHTML = '❌ Network Error';
                btn.style.background = 'linear-gradient(135deg, #E74C3C, #C0392B)';
                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 4000);
            }
        });
    }

    // ============================
    // SMOOTH SCROLL
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const el = document.querySelector(id);
            if (el) {
                e.preventDefault();
                const offset = navbar ? navbar.offsetHeight + 10 : 90;
                window.scrollTo({
                    top: el.getBoundingClientRect().top + window.pageYOffset - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================
    // HERO PARALLAX
    // ============================
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroBgImg = heroSection.querySelector('.hero-bg img');
        window.addEventListener('scroll', () => {
            if (heroBgImg && window.scrollY < window.innerHeight) {
                heroBgImg.style.transform = `translateY(${window.scrollY * 0.25}px) scale(1.05)`;
            }
        }, { passive: true });
    }

    // ============================
    // TYPING EFFECT
    // ============================
    const hlEl = document.querySelector('.hero h1 .highlight');
    if (hlEl) {
        const words = ['Healthcare', 'Hospital', 'Clinical', 'Laboratory'];
        let wi = 0, ci = 0, del = false;
        const type = () => {
            const w = words[wi];
            ci += del ? -1 : 1;
            hlEl.textContent = w.substring(0, ci);
            let speed = del ? 40 : 80;
            if (!del && ci === w.length) { speed = 2500; del = true; }
            else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; speed = 300; }
            setTimeout(type, speed);
        };
        setTimeout(type, 3000);
    }

    // ============================
    // BUTTON RIPPLE EFFECT
    // ============================
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('btn-ripple');
            const rect = this.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ============================
    // MARQUEE PAUSE ON HOVER
    // ============================
    const marquee = document.getElementById('clientsMarquee');
    if (marquee) {
        marquee.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
        marquee.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');
    }

    // ============================
    // TILT EFFECT ON CARDS (subtle)
    // ============================
    document.querySelectorAll('.service-card, .why-card, .perk-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-10px) perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

});
