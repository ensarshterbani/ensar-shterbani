// Portfolio Website JavaScript
// Smooth animations and interactive functionality

class PortfolioApp {
    constructor() {
        this.currentImageIndex = 0;
        this.currentImages = [];
        this.currentProjectName = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupSmoothScrolling();
        this.setupNavbarScroll();
        this.setupImageModal();
        this.setupScreenshotScrolling();
    }

    setupEventListeners() {
        // Project card expand/collapse functionality
        const projectHeaders = document.querySelectorAll('.project-header');
        projectHeaders.forEach(header => {
            header.addEventListener('click', this.toggleProject.bind(this));
        });

        // Keyboard navigation for accessibility
        projectHeaders.forEach(header => {
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleProject(e);
                }
            });
            
            // Make headers focusable
            header.setAttribute('tabindex', '0');
        });

        // Close expanded projects when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.project-card')) {
                this.closeAllProjects();
            }
        });

        // Handle escape key to close expanded projects
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllProjects();
            }
        });
    }

    toggleProject(event) {
        const header = event.currentTarget;
        const projectCard = header.closest('.project-card');
        const isExpanded = projectCard.classList.contains('expanded');
        
        // Close all other expanded projects first
        this.closeAllProjects();
        
        if (!isExpanded) {
            this.expandProject(projectCard);
        }
    }

    expandProject(projectCard) {
        projectCard.classList.add('expanded');
        
        // Update ARIA attributes for accessibility
        const header = projectCard.querySelector('.project-header');
        const details = projectCard.querySelector('.project-details');
        header.setAttribute('aria-expanded', 'true');
        details.setAttribute('aria-hidden', 'false');
        
        // Smooth scroll to show the expanded content
        setTimeout(() => {
            const rect = projectCard.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetPosition = rect.top + scrollTop - 100; // 100px offset for navbar
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }, 300); // Wait for expansion animation

        // Animate screenshots with staggered delays
        this.animateScreenshots(projectCard);
    }

    closeAllProjects() {
        const expandedCards = document.querySelectorAll('.project-card.expanded');
        expandedCards.forEach(card => {
            card.classList.remove('expanded');
            
            // Update ARIA attributes
            const header = card.querySelector('.project-header');
            const details = card.querySelector('.project-details');
            header.setAttribute('aria-expanded', 'false');
            details.setAttribute('aria-hidden', 'true');
        });
    }

    animateScreenshots(projectCard) {
        const screenshots = projectCard.querySelectorAll('.screenshot');
        screenshots.forEach((screenshot, index) => {
            screenshot.style.opacity = '0';
            screenshot.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                screenshot.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                screenshot.style.opacity = '1';
                screenshot.style.transform = 'translateY(0)';
            }, 200 + (index * 100)); // Staggered animation
        });
    }

    setupIntersectionObserver() {
        // Animate elements as they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe project cards and category headers
        const elementsToObserve = document.querySelectorAll('.project-card, .category-header, .section-title');
        elementsToObserve.forEach(el => {
            observer.observe(el);
        });
    }

    setupSmoothScrolling() {
        // Handle smooth scrolling for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupNavbarScroll() {
        let lastScrollTop = 0;
        const navbar = document.querySelector('.navigation');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove background blur based on scroll position
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll (optional enhancement)
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
        lastScrollTop = scrollTop;
    });
}

setupImageModal() {
    // Get modal elements
    this.modal = document.getElementById('imageModal');
    this.modalImage = document.getElementById('modalImage');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalDescription = document.getElementById('modalDescription');
    this.modalCounter = document.getElementById('modalCounter');
    this.modalClose = document.querySelector('.modal-close');
    this.modalPrev = document.querySelector('.modal-prev');
    this.modalNext = document.querySelector('.modal-next');
    
    // Check if all modal elements are found
    if (!this.modal || !this.modalImage || !this.modalTitle || !this.modalDescription || !this.modalCounter || !this.modalClose || !this.modalPrev || !this.modalNext) {
        console.error('Some modal elements not found:', {
            modal: !!this.modal,
            modalImage: !!this.modalImage,
            modalTitle: !!this.modalTitle,
            modalDescription: !!this.modalDescription,
            modalCounter: !!this.modalCounter,
            modalClose: !!this.modalClose,
            modalPrev: !!this.modalPrev,
            modalNext: !!this.modalNext
        });
        return;
    }

    // Add click listeners to all screenshots
    const screenshots = document.querySelectorAll('.screenshot img');
    console.log('Found screenshots:', screenshots.length);
    screenshots.forEach((img) => {
        img.addEventListener('click', (e) => {
            console.log('Image clicked:', e.target.src);
            this.openModal(e.target);
        });
        
        // Add keyboard support
        img.setAttribute('tabindex', '0');
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openModal(e.target);
            }
        });
    });

    // Modal close events
    this.modalClose.addEventListener('click', () => this.closeModal());
    this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
            this.closeModal();
        }
    });

    // Navigation events
    this.modalPrev.addEventListener('click', () => this.previousImage());
    this.modalNext.addEventListener('click', () => this.nextImage());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!this.modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                this.closeModal();
                break;
            case 'ArrowLeft':
                this.previousImage();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
        }
    });

    // Touch/swipe support for mobile
    this.setupTouchNavigation();
}

openModal(clickedImage) {
    console.log('Opening modal for image:', clickedImage.src);
    
    // Find the project card containing this image
    const projectCard = clickedImage.closest('.project-card');
    if (!projectCard) {
        console.error('Could not find project card for image');
        return;
    }
    
    const projectName = projectCard.querySelector('.project-name').textContent;
    console.log('Project name:', projectName);
    
    // Get all images from this project
    const projectImages = Array.from(projectCard.querySelectorAll('.screenshot img'));
    console.log('Found project images:', projectImages.length);
    
    // Find the index of the clicked image
    const clickedIndex = projectImages.findIndex(img => img === clickedImage);
    console.log('Clicked image index:', clickedIndex);
    
    if (clickedIndex === -1) {
        console.error('Could not find clicked image in project images');
        return;
    }
    
    // Set up modal data
    this.currentImages = projectImages;
    this.currentProjectName = projectName;
    this.currentImageIndex = clickedIndex;
    
    console.log('Modal setup complete, updating content...');
    
    // Update modal content
    this.updateModalContent();
    
    console.log('Showing modal...');
    
    // Show modal with animation
    this.modal.style.display = 'flex';
    setTimeout(() => {
        this.modal.classList.add('active');
        console.log('Modal should now be visible');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

closeModal() {
    this.modal.classList.remove('active');
    setTimeout(() => {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

updateModalContent() {
    if (!this.currentImages || this.currentImages.length === 0) {
        console.error('No images available');
        return;
    }
    
    if (this.currentImageIndex < 0 || this.currentImageIndex >= this.currentImages.length) {
        console.error('Invalid image index:', this.currentImageIndex);
        return;
    }
    
    const currentImage = this.currentImages[this.currentImageIndex];
    if (!currentImage) {
        console.error('Current image is undefined at index:', this.currentImageIndex);
        return;
    }
    
    this.modalImage.src = currentImage.src;
    this.modalImage.alt = currentImage.alt;
    this.modalTitle.textContent = this.currentProjectName;
    this.modalDescription.textContent = currentImage.alt;
    this.modalCounter.textContent = `${this.currentImageIndex + 1} / ${this.currentImages.length}`;
    
    // Show/hide navigation buttons
    this.modalPrev.style.display = this.currentImages.length > 1 ? 'flex' : 'none';
    this.modalNext.style.display = this.currentImages.length > 1 ? 'flex' : 'none';
}

previousImage() {
    if (this.currentImages.length <= 1) return;
    
    this.currentImageIndex = (this.currentImageIndex - 1 + this.currentImages.length) % this.currentImages.length;
    this.updateModalContent();
    this.animateImageChange('prev');
}

nextImage() {
    if (this.currentImages.length <= 1) return;
    
    this.currentImageIndex = (this.currentImageIndex + 1) % this.currentImages.length;
    this.updateModalContent();
    this.animateImageChange('next');
}

animateImageChange(direction) {
    // Add a subtle animation when changing images
    this.modalImage.style.transform = direction === 'next' ? 'translateX(20px)' : 'translateX(-20px)';
    this.modalImage.style.opacity = '0.7';
    
    setTimeout(() => {
        this.modalImage.style.transform = 'translateX(0)';
        this.modalImage.style.opacity = '1';
    }, 150);
}

setupTouchNavigation() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    this.modalImage.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    this.modalImage.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Only process horizontal swipes (ignore vertical scrolling)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                this.previousImage();
            } else {
                this.nextImage();
            }
        }
    });
}

setupScreenshotScrolling() {
    // Set up horizontal scrolling for screenshot galleries
    const galleries = document.querySelectorAll('.screenshot-gallery');
    
    galleries.forEach(gallery => {
        const scrollContainer = gallery.querySelector('.project-screenshots');
        const leftBtn = gallery.querySelector('.scroll-left');
        const rightBtn = gallery.querySelector('.scroll-right');
        
        if (!scrollContainer || !leftBtn || !rightBtn) return;
        
        // Scroll amount (width of one screenshot plus gap)
        const scrollAmount = 300;
        
        // Left scroll button
        leftBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Right scroll button
        rightBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Update button visibility based on scroll position
        const updateScrollButtons = () => {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
            
            // Hide left button if at the start
            if (scrollLeft <= 0) {
                leftBtn.classList.add('hidden');
            } else {
                leftBtn.classList.remove('hidden');
            }
            
            // Hide right button if at the end
            if (scrollLeft + clientWidth >= scrollWidth - 1) {
                rightBtn.classList.add('hidden');
            } else {
                rightBtn.classList.remove('hidden');
            }
        };
        
        // Initial button state
        updateScrollButtons();
        
        // Update button state on scroll
        scrollContainer.addEventListener('scroll', PerformanceUtils.throttle(updateScrollButtons, 100));
        
        // Update button state on window resize
        window.addEventListener('resize', PerformanceUtils.debounce(updateScrollButtons, 250));
        
        // Touch/swipe support for mobile
        this.setupTouchScrolling(scrollContainer);
    });
}

setupTouchScrolling(scrollContainer) {
    let isScrolling = false;
    let startX = 0;
    let scrollLeft = 0;

    scrollContainer.addEventListener('touchstart', (e) => {
        isScrolling = true;
        startX = e.touches[0].pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('touchmove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        
        const x = e.touches[0].pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        scrollContainer.scrollLeft = scrollLeft - walk;
    });

    scrollContainer.addEventListener('touchend', () => {
        isScrolling = false;
    });

    // Mouse drag support for desktop
    let isDown = false;
    let startXMouse = 0;
    let scrollLeftMouse = 0;

    scrollContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollContainer.style.cursor = 'grabbing';
        startXMouse = e.pageX - scrollContainer.offsetLeft;
        scrollLeftMouse = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
    });

    scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
    });

    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startXMouse) * 2;
        scrollContainer.scrollLeft = scrollLeftMouse - walk;
    });

    // Set initial cursor
    scrollContainer.style.cursor = 'grab';
}
}

// Utility functions for enhanced interactions
class AnimationUtils {
    static addHoverEffect(element, intensity = 1) {
        element.addEventListener('mouseenter', () => {
            element.style.transform = `translateY(-${2 * intensity}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    }

    static addParallaxEffect(element, speed = 0.5) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * speed;
            element.style.transform = `translateY(${parallax}px)`;
        });
    }

    static addTypewriterEffect(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        function typeWriter() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        typeWriter();
    }
}

// Enhanced scroll animations
class ScrollAnimations {
    constructor() {
        this.setupScrollTriggers();
    }

    setupScrollTriggers() {
        const scrollElements = document.querySelectorAll('.project-card, .category-header');
        
        scrollElements.forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
        });

        const elementInView = (el, dividend = 1) => {
            const elementTop = el.getBoundingClientRect().top;
            return (
                elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
            );
        };

        const displayScrollElement = (element) => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        };

        const hideScrollElement = (element) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
        };

        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                if (elementInView(el, 1.25)) {
                    displayScrollElement(el);
                }
            });
        };

        window.addEventListener('scroll', handleScrollAnimation);
        handleScrollAnimation(); // Run once on load
    }
}

// Performance optimization utilities
class PerformanceUtils {
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }

    static preloadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Theme utilities (for future dark/light mode toggle)
class ThemeUtils {
    static getPreferredTheme() {
        return localStorage.getItem('theme') || 
               (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    }

    static setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    static toggleTheme() {
        const currentTheme = this.getPreferredTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main portfolio functionality
    new PortfolioApp();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Preload images for better performance
    PerformanceUtils.preloadImages();
    
    // Add subtle hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        AnimationUtils.addHoverEffect(card, 0.5);
    });
    
    // Add loading animation completion
    document.body.classList.add('loaded');
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.classList.add('paused');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('paused');
    }
});

// Error handling for robustness
window.addEventListener('error', (e) => {
    console.warn('Portfolio App Error:', e.error);
    // Graceful degradation - basic functionality should still work
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, AnimationUtils, ScrollAnimations, PerformanceUtils, ThemeUtils };
}
