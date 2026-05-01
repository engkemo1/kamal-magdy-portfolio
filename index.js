/* ════════════════════════════════════════════════════
   KAMAL MAGDY — PORTFOLIO — INTERACTIVITY ENGINE
   ════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── CURSOR ORB ──
    const cursorOrb = document.getElementById('cursor-orb');
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorOrb.style.left = mouseX + 'px';
        cursorOrb.style.top = mouseY + 'px';
    });

    // ── SCROLL PROGRESS ──
    const progressFill = document.querySelector('.progress-fill');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressFill.style.width = progress + '%';
    });

    // ── NAV SCROLL EFFECT ──
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // ── ACTIVE NAV LINK ──
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === current) {
                link.classList.add('active');
            }
        });
    });

    // ── REVEAL ON SCROLL ──
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal-up').forEach(el => {
        revealObserver.observe(el);
    });

    // ── COUNTER ANIMATION ──
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                let count = 0;
                const duration = 2000;
                const increment = target / (duration / 16);

                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        el.textContent = target;
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(count);
                    }
                }, 16);

                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => {
        counterObserver.observe(el);
    });

    // ── 3D PORTRAIT TILT ──
    const portraitFrame = document.getElementById('portrait-frame');
    if (portraitFrame) {
        portraitFrame.addEventListener('mousemove', (e) => {
            const rect = portraitFrame.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            portraitFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        portraitFrame.addEventListener('mouseleave', () => {
            portraitFrame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            portraitFrame.style.transition = 'transform 0.5s ease-out';
        });

        portraitFrame.addEventListener('mouseenter', () => {
            portraitFrame.style.transition = 'none';
        });
    }

    // ── MAGNETIC BUTTONS ──
    document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'none';
        });
    });

    // ── TIMELINE LINE FILL ──
    const timelineFill = document.querySelector('.timeline-line-fill');
    const timeline = document.querySelector('.timeline');

    if (timeline && timelineFill) {
        window.addEventListener('scroll', () => {
            const rect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const timelineTop = rect.top;
            const timelineHeight = rect.height;

            if (timelineTop < windowHeight && rect.bottom > 0) {
                const visible = Math.min(windowHeight - timelineTop, timelineHeight);
                const percentage = Math.min((visible / timelineHeight) * 100, 100);
                timelineFill.style.height = Math.max(percentage, 0) + '%';
            }
        });
    }

    // ── MATRIX RAIN ──
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 15, 26, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(0, 229, 255, 0.08)';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 45);

    window.addEventListener('resize', () => {
        resizeCanvas();
        columns = Math.floor(canvas.width / fontSize);
        drops.length = columns;
        for (let i = 0; i < columns; i++) {
            if (drops[i] === undefined) drops[i] = 1;
        }
    });

    // ── IMAGE MODAL ──
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    
    window.zoomImage = function(src) {
        modal.style.display = "block";
        modalImg.src = src;
    }

    window.closeModal = function() {
        modal.style.display = "none";
    }

    // ── FOOTER YEAR ──
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ── SMOOTH SCROLL FOR NAV LINKS ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
