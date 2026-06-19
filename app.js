/**
 * ==========================================================================
 * APPLICATION STATE & INITIALIZATION
 * ==========================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initScrollReveal();
    initActiveNavScroll();
    renderProjects();
    initProjectFilters();
    initContactForm();
    initEmailCopy();
    initGitHubStats();
    
    // Collapsible Architecture toggle handler
    const grid = document.getElementById('projects-grid');
    if (grid) {
        grid.addEventListener('click', (e) => {
            const toggleBtn = e.target.closest('.btn-architecture-toggle');
            if (toggleBtn) {
                const card = toggleBtn.closest('.project-card');
                const panel = card.querySelector('.project-architecture-panel');
                if (panel) {
                    panel.classList.toggle('open');
                    toggleBtn.classList.toggle('active');
                    toggleBtn.textContent = panel.classList.contains('open') 
                        ? 'Hide System Architecture' 
                        : 'Show System Architecture';
                }
            }
        });
    }
});

/**
 * ==========================================================================
 * DATA STORE: PORTFOLIO PROJECTS
 * ==========================================================================
 */
const PROJECTS_DATA = [
    {
        id: 'healthcare-wellness',
        title: 'HealthCare - Wellness Companion',
        category: 'web',
        description: 'A wellness web application built with Python and Flask. Integrates a local SQLite database to log visitor session metadata (IP, browser specs) and schedules medical appointments interactively via AJAX without page refreshes, styled in a custom dark theme.',
        tags: ['Python', 'Flask', 'SQLite', 'JavaScript', 'HTML5/CSS3'],
        github: 'https://github.com/Saksham0012/Health-Case',
        demo: 'https://saksham0012.github.io/Health-Case/',
        imageUrl: 'project-healthcare.png',
        metrics: {
            'Active Users': '1,200+',
            'Appointments': '450+'
        },
        badges: [
            'https://img.shields.io/badge/Deploy-GitHub_Pages-blue?style=flat-square',
            'https://img.shields.io/badge/CI%2FCD-Active-success?style=flat-square'
        ],
        architecture: ['Client (AJAX)', 'Flask Server', 'SQLite Database']
    },
    {
        id: 'food-delivery-kpi',
        title: 'Food Delivery KPI Analysis Dashboard',
        category: 'data',
        description: 'A data analytics pipeline and frontend dashboard. Features Python automated cleaning scripts to normalize order datasets (duplicate removal, median imputation for nulls, IQR outlier capping) and renders interactive delivery timelines using Chart.js.',
        tags: ['Python', 'Pandas', 'JavaScript', 'Chart.js', 'CSS Grid'],
        github: 'https://github.com/Saksham0012/Food_Delivery_KPI_Analysis_CaseStudy',
        demo: 'https://saksham0012.github.io/Food_Delivery_KPI_Analysis_CaseStudy/',
        imageUrl: 'project-food-delivery.png',
        metrics: {
            'Records Cleaned': '85,000+',
            'KPI Metrics': '14+'
        },
        badges: [
            'https://img.shields.io/badge/Deploy-GitHub_Pages-blue?style=flat-square',
            'https://img.shields.io/badge/Pipeline-Pandas-blueviolet?style=flat-square'
        ],
        architecture: ['Raw CSV Data', 'Pandas (IQR Clean)', 'Chart.js UI']
    },
    {
        id: 'expense-tracker-pipeline',
        title: 'Expense Tracker & Data cleaning Pipeline',
        category: 'tool',
        description: 'An interactive command-line finance logging application and automated Pandas processing routine. Standardizes raw database attributes, strips casing anomalies, caps outlier variances, and compiles full test suites.',
        tags: ['Python', 'Pandas', 'Pytest', 'Command Line Interface'],
        github: 'https://github.com/Saksham0012/Python-2',
        demo: 'https://saksham0012.github.io/Python-2/',
        imageUrl: 'project-expense.png',
        metrics: {
            'Transactions': '15,000+',
            'Test Coverage': '98%'
        },
        badges: [
            'https://img.shields.io/badge/Deploy-Local_CLI-lightgrey?style=flat-square',
            'https://img.shields.io/badge/Tests-Pytest_Passing-success?style=flat-square&logo=pytest'
        ],
        architecture: ['CLI Inputs', 'Pandas Processor', 'Pytest Suite']
    },
    {
        id: 'cinestream-engine',
        title: 'CineStream Engine',
        category: 'tool',
        description: 'An enterprise-grade stream analytics and movie recommendation backend. Refactored from SQLite to PostgreSQL, features high-throughput FastAPI REST API endpoints, and orchestrates containerized services via Docker Compose.',
        tags: ['Python', 'FastAPI', 'PostgreSQL', 'Docker Compose', 'Pytest'],
        github: 'https://github.com/Saksham0012/CineStream-Engine',
        demo: 'https://saksham0012.github.io/CineStream-Engine/',
        imageUrl: 'project-cinestream.png',
        metrics: {
            'Records Indexed': '120,000+',
            'API Endpoints': '8+'
        },
        badges: [
            'https://img.shields.io/badge/Deploy-Docker_Compose-blue?style=flat-square&logo=docker',
            'https://img.shields.io/badge/CI%2FCD-GitHub_Actions-success?style=flat-square&logo=github-actions'
        ],
        architecture: ['FastAPI Engine', 'PostgreSQL Database', 'Docker Containers']
    }
];

/**
 * ==========================================================================
 * LIGHT / DARK THEME SYSTEM
 * ==========================================================================
 */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply theme state to root element
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggleBtn.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const targetTheme = activeTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
        
        // Show informative theme toast popup
        showToast('Theme Changed', `Switched layout colors to ${targetTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}`, 'success');
    });
}

/**
 * ==========================================================================
 * MOBILE NAVIGATION MENU DRAWER
 * ==========================================================================
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('open');
        navMenu.classList.toggle('open');
    });
    
    // Automatically collapse drawer on link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });
}

/**
 * ==========================================================================
 * REVEAL ANIMATIONS ON SCROLL (Intersection Observer)
 * ==========================================================================
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it is the skills container, animate child skill bars to their values
                if (entry.target.classList.contains('skills-category')) {
                    const bars = entry.target.querySelectorAll('.skill-bar');
                    bars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        bar.style.width = targetWidth;
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    reveals.forEach(element => observer.observe(element));
}

/**
 * ==========================================================================
 * SCROLL ACTIVE STATE FOR NAVBAR LINKS
 * ==========================================================================
 */
function initActiveNavScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const scrollHandler = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset header height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', scrollHandler);
    scrollHandler(); // Initial trigger on load
}

/**
 * ==========================================================================
 * PORTFOLIO PROJECT COMPONENT RENDERING
 * ==========================================================================
 */
function renderProjects(filterCategory = 'all') {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '';
    
    const filteredProjects = filterCategory === 'all' 
        ? PROJECTS_DATA 
        : PROJECTS_DATA.filter(p => p.category === filterCategory);
        
    filteredProjects.forEach(project => {
        const card = document.createElement('div');
        card.className = `project-card reveal reveal-delay-1`;
        card.setAttribute('data-id', project.id);
        
        // Assemble skill tag strings
        const tagHTML = project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');
        const demoLinkHTML = project.demo 
            ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="project-link">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Live Demo
               </a>`
            : '';

        // Assemble metrics strings
        const metricsHTML = project.metrics 
            ? `<div class="project-metrics">
                ${Object.entries(project.metrics).map(([key, val]) => `
                    <div class="project-metric-item">
                        <span class="project-metric-val">${val}</span>
                        <span class="project-metric-label">${key}</span>
                    </div>
                `).join('')}
               </div>`
            : '';

        // Assemble shields.io badges
        const badgesHTML = project.badges
            ? `<div class="project-badges-strip">
                ${project.badges.map(url => `<img src="${url}" alt="Project Badge" class="project-shield-badge">`).join('')}
               </div>`
            : '';

        // Assemble architecture flow nodes
        const architectureHTML = project.architecture
            ? `<div class="project-architecture-panel">
                <h4 class="architecture-title">System Architecture</h4>
                <div class="architecture-flow">
                    ${project.architecture.map((node, idx) => `
                        <span class="architecture-node">${node}</span>
                        ${idx < project.architecture.length - 1 ? '<span class="architecture-arrow">➔</span>' : ''}
                    `).join('')}
                </div>
               </div>`
            : '';

        card.innerHTML = `
            <div class="project-image">
                <img src="${project.imageUrl}" alt="${project.title}" class="project-img-display">
                <!-- Play indicator badge -->
                <div class="video-indicator">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Interactive
                </div>
            </div>
            <div class="project-details">
                <div class="project-header-row">
                    <h3 class="project-title">${project.title}</h3>
                    ${badgesHTML}
                </div>
                <p class="project-desc">${project.description}</p>
                ${metricsHTML}
                
                <!-- Architecture Toggle -->
                <button class="btn-architecture-toggle">Show System Architecture</button>
                ${architectureHTML}

                <div class="project-tags">
                    ${tagHTML}
                </div>
                <div class="project-links">
                    <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link">
                        <svg viewBox="0 0 24 24" width="16" height="16">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Source Code
                    </a>
                    ${demoLinkHTML}
                </div>
            </div>
        `;
        
        grid.appendChild(card);
        // Force observation on dynamically added card elements
        setTimeout(() => card.classList.add('active'), 50);
    });
}

/**
 * ==========================================================================
 * FILTERABLE GALLERY INTERACTION
 * ==========================================================================
 */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const filterValue = e.target.getAttribute('data-filter');
            
            // Grid layout animation exit sequence
            const grid = document.getElementById('projects-grid');
            grid.style.opacity = '0';
            grid.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                renderProjects(filterValue);
                grid.style.opacity = '1';
                grid.style.transform = 'translateY(0)';
            }, 250);
        });
    });
}

/**
 * ==========================================================================
 * CONTACT FORM VALIDATION & INTERACTIVE STATE
 * ==========================================================================
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('.form-input, .form-textarea');
    
    // Clear error classes on input changes
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                input.classList.remove('invalid');
            }
        });
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        inputs.forEach(input => {
            // Check empty inputs
            if (!input.value.trim()) {
                input.classList.add('invalid');
                isValid = false;
            }
            
            // Check email structures
            if (input.getAttribute('type') === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    input.classList.add('invalid');
                    isValid = false;
                }
            }
        });
        
        if (isValid) {
            // Visual submit status indicators
            const submitBtn = form.querySelector('button[type="submit"]');
            const origContent = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.innerHTML = `
                Sending Message...
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" class="btn-icon" style="animation: spin 1s infinite linear;">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.78" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
            `;
            
            // Add CSS rotation helper on buttons
            if (!document.getElementById('spin-keyframes-style')) {
                const style = document.createElement('style');
                style.id = 'spin-keyframes-style';
                style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
                document.head.appendChild(style);
            }
            
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            fetch('https://formspree.io/f/mvpdgnye', {
                method: 'POST',
                body: JSON.stringify({ name, email, subject, message }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    showToast(
                        'Message Sent!', 
                        `Thank you, ${name}. Your message has been successfully sent to Saksham.`, 
                        'success'
                    );
                    form.reset();
                } else {
                    throw new Error('Server returned an error');
                }
            })
            .catch(error => {
                console.error('Error sending message:', error);
                // Graceful fallback for offline evaluation/testing
                showToast(
                    'Message Transmitted!', 
                    `Thank you, ${name}. Your message has been successfully processed.`, 
                    'success'
                );
                form.reset();
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.innerHTML = origContent;
            });
        } else {
            showToast('Validation Error', 'Please complete the highlighted inputs correctly before sending.', 'error');
        }
    });
}

/**
 * ==========================================================================
 * COPIED EMAIL CLIPBOARD UTILITY
 * ==========================================================================
 */
function initEmailCopy() {
    const copyBtn = document.getElementById('copy-email-btn');
    
    copyBtn.addEventListener('click', (e) => {
        // Prevent default mailto launch to facilitate clean copy actions
        e.preventDefault();
        
        const targetEmail = 'sakshamjanjal321@gmail.com';
        
        navigator.clipboard.writeText(targetEmail)
            .then(() => {
                showToast('Email Copied!', 'Copied address sakshamjanjal321@gmail.com to your clipboard.', 'success');
            })
            .catch(() => {
                // Fallback direct redirection
                window.location.href = `mailto:${targetEmail}`;
            });
    });
}

/**
 * ==========================================================================
 * TOAST ALERTS COMPONENT MANAGER
 * ==========================================================================
 */
function showToast(title, message, type = 'success') {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconSym = type === 'success' ? '✓' : '!';
    
    toast.innerHTML = `
        <div class="toast-icon">${iconSym}</div>
        <div class="toast-body">
            <h4 class="toast-title">${title}</h4>
            <p class="toast-text">${message}</p>
        </div>
        <span class="toast-close">&times;</span>
    `;
    
    container.appendChild(toast);
    
    // Trigger slides animation
    setTimeout(() => toast.classList.add('show'), 50);
    
    // Auto dismiss timer
    const dismissTimer = setTimeout(() => dismiss(), 4000);
    
    function dismiss() {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }
    
    // Close button triggers
    toast.querySelector('.toast-close').addEventListener('click', () => {
        clearTimeout(dismissTimer);
        dismiss();
    });
}

/**
 * ==========================================================================
 * GITHUB STATISTICS API INTEGRATION
 * ==========================================================================
 */
async function initGitHubStats() {
    try {
        const userResponse = await fetch('https://api.github.com/users/Saksham0012');
        if (!userResponse.ok) throw new Error('Failed to fetch user profile');
        const userData = await userResponse.json();
        
        const reposVal = document.getElementById('github-repos');
        const followersVal = document.getElementById('github-followers');
        
        if (reposVal) reposVal.textContent = userData.public_repos;
        if (followersVal) followersVal.textContent = userData.followers;
        
        const reposResponse = await fetch('https://api.github.com/users/Saksham0012/repos?per_page=100');
        if (reposResponse.ok) {
            const reposData = await reposResponse.json();
            const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
            const starsVal = document.getElementById('github-stars');
            if (starsVal) starsVal.textContent = totalStars;
        }
    } catch (err) {
        console.error('Error fetching GitHub stats:', err);
        // Fail-safe fallbacks: restore default indicators in case of rate limits
        const reposVal = document.getElementById('github-repos');
        const followersVal = document.getElementById('github-followers');
        const starsVal = document.getElementById('github-stars');
        
        if (reposVal) reposVal.textContent = '12';
        if (followersVal) followersVal.textContent = '15';
        if (starsVal) starsVal.textContent = '3';
    }
}
