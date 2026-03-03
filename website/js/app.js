/* ============================================
   MODI Coin — Interactive JavaScript
   Particles, Scroll Reveal, FAQ, Counters
   ============================================ */

(function () {
    'use strict';

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    function handleNavScroll() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // --- Mobile Menu Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('open');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('open');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var offset = navbar ? navbar.offsetHeight + 20 : 80;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // --- Particle System ---
    function createParticles() {
        var container = document.getElementById('heroParticles');
        if (!container) return;

        var count = window.innerWidth < 768 ? 20 : 40;

        for (var i = 0; i < count; i++) {
            var particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (6 + Math.random() * 6) + 's';

            var size = 1 + Math.random() * 3;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            var colors = ['#FFD700', '#FF9933', '#ffffff'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            container.appendChild(particle);
        }
    }

    createParticles();

    // --- Scroll Reveal ---
    function initScrollReveal() {
        var revealElements = [
            '.about-card',
            '.token-item',
            '.timeline-card',
            '.step-card',
            '.community-card',
            '.faq-item',
            '.section-header',
            '.tokenomics-chart',
            '.buy-contract'
        ];

        revealElements.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (el) {
                el.classList.add('reveal');
            });
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        document.querySelectorAll('.reveal').forEach(function (el) {
            observer.observe(el);
        });
    }

    initScrollReveal();

    // --- Number Counter Animation ---
    function animateCounter(element, target) {
        var duration = 2000;
        var start = 0;
        var startTime = null;

        function formatNumber(num) {
            if (num >= 1000000000) return (num / 1000000000).toFixed(0) + 'B';
            if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M';
            if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
            return num.toString();
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            element.textContent = formatNumber(current);
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    function initCounters() {
        var counters = document.querySelectorAll('[data-target]');
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var target = parseInt(entry.target.getAttribute('data-target'), 10);
                    animateCounter(entry.target, target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }

    initCounters();

    // --- Copy Contract Address ---
    function initCopyButtons() {
        var copyButtons = document.querySelectorAll('.copy-btn');
        copyButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var box = btn.closest('.contract-box');
                var addr = box ? box.querySelector('.contract-addr') : null;
                if (!addr) return;

                var text = addr.textContent.trim();
                if (text === 'Coming Soon — Token Launch Pending') return;

                navigator.clipboard.writeText(text).then(function () {
                    btn.classList.add('copied');
                    var originalHTML = btn.innerHTML;
                    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
                    setTimeout(function () {
                        btn.innerHTML = originalHTML;
                        btn.classList.remove('copied');
                    }, 2000);
                });
            });
        });
    }

    initCopyButtons();

    // --- FAQ Accordion ---
    function initFAQ() {
        var faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(function (item) {
            var question = item.querySelector('.faq-question');
            if (!question) return;

            question.addEventListener('click', function () {
                var isActive = item.classList.contains('active');

                // Close all
                faqItems.forEach(function (other) {
                    other.classList.remove('active');
                });

                // Open clicked if it was closed
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    initFAQ();

    // --- Active Nav Link on Scroll ---
    function initActiveNav() {
        var sections = document.querySelectorAll('section[id]');
        var navLinksAll = document.querySelectorAll('.nav-links a');

        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var id = entry.target.getAttribute('id');
                    navLinksAll.forEach(function (link) {
                        link.style.color = '';
                        if (link.getAttribute('href') === '#' + id) {
                            link.style.color = '#FFD700';
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        });

        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    initActiveNav();

    // --- Donut Chart Hover ---
    function initDonutHover() {
        var segments = document.querySelectorAll('.donut-segment');
        segments.forEach(function (seg) {
            seg.addEventListener('mouseenter', function () {
                segments.forEach(function (s) {
                    s.style.opacity = '0.3';
                });
                seg.style.opacity = '1';
            });
            seg.addEventListener('mouseleave', function () {
                segments.forEach(function (s) {
                    s.style.opacity = '1';
                });
            });
        });
    }

    initDonutHover();

})();
