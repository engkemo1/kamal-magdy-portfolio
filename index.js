/* ════════════════════════════════════════════════════
   KAMAL MAGDY — PORTFOLIO — INTERACTIVITY ENGINE
   ════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // ── CURSOR ORB (desktop only, GPU transform) ──
    const cursorOrb = document.getElementById('cursor-orb');
    if (cursorOrb && finePointer && !reduceMotion) {
        let ox = 0, oy = 0, queued = false;
        document.addEventListener('mousemove', (e) => {
            ox = e.clientX; oy = e.clientY;
            if (!queued) {
                queued = true;
                requestAnimationFrame(() => {
                    cursorOrb.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
                    queued = false;
                });
            }
        }, { passive: true });
    }

    // ── SCROLL-DRIVEN UI (single rAF-throttled handler) ──
    const progressFill = document.querySelector('.progress-fill');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = [...document.querySelectorAll('.section[id]')];
    const timelineFill = document.querySelector('.timeline-line-fill');
    const timeline = document.querySelector('.timeline');

    function onScroll() {
        const y = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressFill.style.width = (docHeight > 0 ? (y / docHeight) * 100 : 0) + '%';

        nav.classList.toggle('scrolled', y > 50);

        // Active link: last section whose top is above the trigger line.
        // Sections without a nav link (e.g. "crucible") keep the previous link lit.
        let current = 'hero';
        for (const section of sections) {
            if (y >= section.offsetTop - 200) {
                const id = section.id;
                if (document.querySelector(`.nav-link[data-section="${id}"]`)) current = id;
            }
        }
        navLinks.forEach(link => link.classList.toggle('active', link.dataset.section === current));

        if (timeline && timelineFill) {
            const rect = timeline.getBoundingClientRect();
            const vh = window.innerHeight;
            if (rect.top < vh && rect.bottom > 0) {
                const visible = Math.min(vh - rect.top, rect.height);
                timelineFill.style.height = Math.max(Math.min((visible / rect.height) * 100, 100), 0) + '%';
            }
        }
    }

    let scrollQueued = false;
    window.addEventListener('scroll', () => {
        if (!scrollQueued) {
            scrollQueued = true;
            requestAnimationFrame(() => { onScroll(); scrollQueued = false; });
        }
    }, { passive: true });
    onScroll();

    // ── MOBILE MENU ──
    const toggle = document.getElementById('nav-toggle');
    const linksList = document.getElementById('nav-links');
    function setMenu(open) {
        linksList.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    toggle.addEventListener('click', () => setMenu(!linksList.classList.contains('open')));
    document.addEventListener('click', (e) => {
        if (linksList.classList.contains('open') && !nav.contains(e.target)) setMenu(false);
    });

    // ── REVEAL ON SCROLL ──
    const revealEls = document.querySelectorAll('.reveal-up');
    if ('IntersectionObserver' in window && !reduceMotion) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }

    // ── COUNTER ANIMATION ──
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const runCounter = (el) => {
        const target = parseInt(el.dataset.count, 10);
        if (reduceMotion) { el.textContent = target; return; }
        const start = performance.now();
        const duration = 1400;
        const step = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased);
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(el => counterObserver.observe(el));
    } else {
        counters.forEach(el => { el.textContent = el.dataset.count; });
    }

    // ── 3D PORTRAIT TILT ──
    const portraitFrame = document.getElementById('portrait-frame');
    if (portraitFrame && finePointer && !reduceMotion) {
        portraitFrame.addEventListener('mousemove', (e) => {
            const rect = portraitFrame.getBoundingClientRect();
            const rotateX = (e.clientY - rect.top - rect.height / 2) / 20;
            const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 20;
            portraitFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        portraitFrame.addEventListener('mouseleave', () => {
            portraitFrame.style.transition = 'transform 0.5s ease-out';
            portraitFrame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
        portraitFrame.addEventListener('mouseenter', () => {
            portraitFrame.style.transition = 'none';
        });
    }

    // ── MAGNETIC BUTTONS ──
    if (finePointer && !reduceMotion) {
        document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                btn.style.transform = 'translate(0, 0)';
            });
            btn.addEventListener('mouseenter', () => {
                btn.style.transition = 'none';
            });
        });
    }

    // ── MATRIX RAIN (paused when hidden, off for reduced motion) ──
    const canvas = document.getElementById('matrix-canvas');
    if (canvas && !reduceMotion) {
        const ctx = canvas.getContext('2d');
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const fontSize = 14;
        let drops = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const columns = Math.floor(canvas.width / fontSize);
            drops = Array.from({ length: columns }, (_, i) => drops[i] ?? 1);
        };
        resizeCanvas();

        let last = 0;
        const frame = (now) => {
            if (now - last >= 45) {
                last = now;
                ctx.fillStyle = 'rgba(10, 15, 26, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'rgba(0, 229, 255, 0.08)';
                ctx.font = fontSize + 'px monospace';
                for (let i = 0; i < drops.length; i++) {
                    ctx.fillText(chars.charAt(Math.floor(Math.random() * chars.length)), i * fontSize, drops[i] * fontSize);
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) drops[i] = 0;
                    drops[i]++;
                }
            }
            requestAnimationFrame(frame); // rAF pauses automatically in background tabs
        };
        requestAnimationFrame(frame);

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resizeCanvas, 150);
        });
    }

    // ── IMAGE MODAL ──
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    let lastFocus = null;

    function openModal(src, alt) {
        lastFocus = document.activeElement;
        modalImg.src = src;
        modalImg.alt = alt || '';
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        modal.querySelector('.close').focus();
    }
    function closeModal() {
        modal.hidden = true;
        document.body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
    }
    document.querySelectorAll('[data-zoom]').forEach(el => {
        el.addEventListener('click', () => {
            const img = el.querySelector('img');
            openModal(el.dataset.zoom, img ? img.alt : '');
        });
    });
    modal.addEventListener('click', (e) => { if (e.target !== modalImg) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!modal.hidden) closeModal();
            if (linksList.classList.contains('open')) setMenu(false);
        }
    });

    // ── FOOTER YEAR ──
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ── SMOOTH SCROLL FOR IN-PAGE LINKS ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (id.length < 2) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            setMenu(false);
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            history.replaceState(null, '', id);
        });
    });
});
