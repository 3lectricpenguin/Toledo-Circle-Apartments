/**
 * Toledo Circle Apartments - Landing Page Interactive Behaviors
 * File: app.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. MOBILE NAVIGATION MENU
    // ----------------------------------------------------
    const initMobileNav = () => {
        const menuToggle = document.querySelector('[data-menu-toggle]');
        const navMenuWrapper = document.querySelector('[data-nav-menu-wrapper]');

        if (!menuToggle || !navMenuWrapper) return;

        menuToggle.addEventListener('click', (e) => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenuWrapper.classList.toggle('mobile-active');
            
            // Toggle hamburger icon visual states
            menuToggle.classList.toggle('open');
        });

        // Close mobile nav when clicking a link or CTA
        const navLinks = navMenuWrapper.querySelectorAll('.nav-link, .nav-cta .btn');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenuWrapper.classList.remove('mobile-active');
                menuToggle.classList.remove('open');
            });
        });
    };

    // ----------------------------------------------------
    // 2. FLOOR PLAN TOGGLE (1 Bed vs 2 Bed)
    // ----------------------------------------------------
    const initFloorPlanToggle = () => {
        const toggleButtons = document.querySelectorAll('[data-floorplan-toggle]');
        const planContainers = document.querySelectorAll('[data-floorplan-pane]');

        if (!toggleButtons.length || !planContainers.length) return;

        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPlan = button.getAttribute('data-floorplan-toggle');

                // Update active state on buttons
                toggleButtons.forEach(btn => {
                    if (btn.getAttribute('data-floorplan-toggle') === targetPlan) {
                        btn.classList.add('active');
                        btn.setAttribute('aria-selected', 'true');
                    } else {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-selected', 'false');
                    }
                });

                // Show/hide corresponding panes
                planContainers.forEach(pane => {
                    if (pane.getAttribute('data-floorplan-pane') === targetPlan) {
                        pane.classList.remove('hidden');
                        pane.classList.add('active');
                    } else {
                        pane.classList.add('hidden');
                        pane.classList.remove('active');
                    }
                });
            });

            // Keyboard navigation for tablist
            button.addEventListener('keydown', (e) => {
                const targetTab = e.currentTarget;
                let newTab;

                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    if (targetTab.nextElementSibling) {
                        newTab = targetTab.nextElementSibling;
                    } else if (targetTab.previousElementSibling) {
                        newTab = targetTab.previousElementSibling;
                    }

                    if (newTab) {
                        newTab.focus();
                        newTab.click();
                    }
                }
            });
        });
    };

    // ----------------------------------------------------
    // 3. CONTACT FORM INPUT VALIDATION & FEEDBACK
    // ----------------------------------------------------
    const initContactForm = () => {
        const form = document.querySelector('[data-contact-form]');
        if (!form) return;

        const successMessage = document.querySelector('[data-form-success]');
        const errorMessage = document.querySelector('[data-form-error]');

        const fields = {
            firstname: {
                el: form.querySelector('#firstname'),
                validate: (val) => val.trim().length >= 1,
                msg: 'Please enter your first name.'
            },
            lastname: {
                el: form.querySelector('#lastname'),
                validate: (val) => val.trim().length >= 1,
                msg: 'Please enter your last name.'
            },
            email: {
                el: form.querySelector('#email'),
                validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
                msg: 'Please enter a valid email address.'
            },
            phone: {
                el: form.querySelector('#phone'),
                validate: (val) => {
                    if (!val.trim()) return true; // Phone is optional
                    return /^\+?[\d\s\-()]{7,15}$/.test(val.trim());
                },
                msg: 'Please enter a valid phone number or leave empty.'
            },
            message: {
                el: form.querySelector('#message'),
                validate: (val) => val.trim().length >= 10,
                msg: 'Please enter a message (at least 10 characters).'
            }
        };

        const showError = (fieldKey, show) => {
            const field = fields[fieldKey];
            if (!field || !field.el) return;

            let errorEl = field.el.parentElement.querySelector('.error-msg');
            
            if (show) {
                field.el.classList.add('input-error');
                field.el.setAttribute('aria-invalid', 'true');
                if (!errorEl) {
                    errorEl = document.createElement('div');
                    errorEl.classList.add('error-msg');
                    field.el.parentElement.appendChild(errorEl);
                }
                errorEl.textContent = field.msg;
            } else {
                field.el.classList.remove('input-error');
                field.el.removeAttribute('aria-invalid');
                if (errorEl) {
                    errorEl.remove();
                }
            }
        };

        // Real-time validation on input
        Object.keys(fields).forEach(key => {
            const field = fields[key];
            if (field.el) {
                field.el.addEventListener('input', () => {
                    const isValid = field.validate(field.el.value);
                    showError(key, !isValid);
                });
            }
        });

        // Form Submit Handler
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            let hasErrors = false;

            // Validate all fields on submit
            Object.keys(fields).forEach(key => {
                const field = fields[key];
                if (field.el) {
                    const isValid = field.validate(field.el.value);
                    showError(key, !isValid);
                    if (!isValid) {
                        hasErrors = true;
                    }
                }
            });

            if (hasErrors) {
                if (errorMessage) {
                    errorMessage.textContent = 'Please correct the errors in the form before submitting.';
                    errorMessage.classList.remove('hidden');
                }
                return;
            }

            if (errorMessage) {
                errorMessage.classList.add('hidden');
            }

            // Show loading state
            const submitBtn = form.querySelector('[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending Inquiry...';
            }

            // Collect user inputs into structured payload
            const moveInInput = form.querySelector('#movein');
            const aptSelect = form.querySelector('#apartmentType');
            const applicantTypeSelect = form.querySelector('#applicantType');
            const tourPreferenceSelect = form.querySelector('#tourPreference');
            const recipientEmail = form.dataset.recipientEmail || 'tracie@ppr-ohio.com';

            const payload = {
                "First Name": fields.firstname.el.value.trim(),
                "Last Name": fields.lastname.el.value.trim(),
                "Visitor Email": fields.email.el.value.trim(),
                "Phone Number": (fields.phone.el && fields.phone.el.value.trim()) || 'Not provided',
                "Inquiring As": applicantTypeSelect ? applicantTypeSelect.value : 'Not specified',
                "Tour Preference": tourPreferenceSelect ? tourPreferenceSelect.value : 'In-Person Tour',
                "Desired Move-in": (moveInInput && moveInInput.value) || 'Flexible',
                "Residence Choice": aptSelect ? aptSelect.options[aptSelect.selectedIndex].text : '1 Bedroom',
                "Message": fields.message.el.value.trim(),
                "_subject": `New Leasing Inquiry from ${fields.firstname.el.value.trim()} ${fields.lastname.el.value.trim()}`,
                "_template": "table"
            };

            try {
                // Dispatch collected input data to specified email endpoint
                const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (data.success === 'true' || data.success === true) {
                    if (successMessage) {
                        successMessage.textContent = 'Thank you for your inquiry! Your information has been sent to our leasing team.';
                        successMessage.classList.remove('hidden');
                        form.reset();
                        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        
                        setTimeout(() => {
                            successMessage.classList.add('hidden');
                        }, 7000);
                    } else {
                        alert('Thank you! Your leasing inquiry has been successfully sent.');
                        form.reset();
                    }
                } else if (data.message && data.message.includes('Activation')) {
                    if (errorMessage) {
                        errorMessage.innerHTML = '<strong>Form Activation Required:</strong> FormSubmit has sent a 1-click activation email to <strong>' + recipientEmail + '</strong>. Please open that email and click <em>"Activate Form"</em> to enable delivery.';
                        errorMessage.classList.remove('hidden');
                        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                } else {
                    if (errorMessage) {
                        errorMessage.textContent = data.message || 'Form submission encountered an issue. Please call our leasing office directly at (937) 561-2590.';
                        errorMessage.classList.remove('hidden');
                        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            } catch (error) {
                if (errorMessage) {
                    errorMessage.textContent = 'Unable to send form online. Please call our leasing office directly at (937) 561-2590.';
                    errorMessage.classList.remove('hidden');
                    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        });
    };

    // ----------------------------------------------------
    // 4. INTERACTIVE MAP CONTAINER (Lazy Google Maps iframe)
    // ----------------------------------------------------
    const initMap = () => {
        const mapContainer = document.querySelector('[data-map-container]');
        if (!mapContainer) return;

        const address = '3414 Dorr St, Toledo, OH 43607';
        const encodedAddress = encodeURIComponent(address);
        const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

        const loadMap = () => {
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', mapUrl);
            iframe.setAttribute('width', '100%');
            iframe.setAttribute('height', '100%');
            iframe.setAttribute('frameborder', '0');
            iframe.classList.add('map-iframe');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('loading', 'lazy');
            iframe.setAttribute('title', 'Google Maps - Toledo Circle Apartments location');

            mapContainer.innerHTML = '';
            mapContainer.appendChild(iframe);
        };

        // Lazy load the iframe when the map section enters the viewport
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, observerInstance) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadMap();
                        observerInstance.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px 200px 0px' });

            observer.observe(mapContainer);
        } else {
            loadMap();
        }
    };

    // ----------------------------------------------------
    // 5. SMOOTH SCROLL FOR ANCHOR LINKS
    // ----------------------------------------------------
    const initSmoothScroll = () => {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Manage keyboard focus for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus({ preventScroll: true });
                }
            });
        });
    };

    // ----------------------------------------------------
    // 6. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
    // ----------------------------------------------------
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('[data-scroll-animate]');
        if (!animatedElements.length) return;

        // Check if user has requested reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            animatedElements.forEach(el => {
                el.classList.add('animated');
            });
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animationType = entry.target.getAttribute('data-scroll-animate') || 'fade-in';
                    entry.target.classList.add('animated', animationType);
                    observerInstance.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    };

    // ----------------------------------------------------
    // 7. IMAGE LIGHTBOX MODAL (Enlarge photos on click)
    // ----------------------------------------------------
    const initImageLightbox = () => {
        const lightbox = document.getElementById('image-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');

        if (!lightbox || !lightboxImg) return;

        const openLightbox = (imgSrc, altText, captionText) => {
            lightboxImg.src = imgSrc;
            lightboxImg.alt = altText || 'Enlarged photo';
            
            if (captionText && captionText.trim().length > 0) {
                lightboxCaption.textContent = captionText.trim();
                lightboxCaption.style.display = 'inline-block';
            } else {
                lightboxCaption.textContent = '';
                lightboxCaption.style.display = 'none';
            }

            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            setTimeout(() => {
                if (!lightbox.classList.contains('active')) {
                    lightboxImg.src = '';
                }
            }, 350);
        };

        // Capturing click listener to catch clicks on logo and photo cards before default anchor navigation
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-lightbox-src]');
            if (trigger) {
                e.preventDefault();
                e.stopPropagation();
                const imgSrc = trigger.getAttribute('data-lightbox-src');
                const captionText = trigger.getAttribute('data-lightbox-title') || '';
                openLightbox(imgSrc, 'Enlarged view', captionText);
            }
        }, true);

        // Accessibility keyboard listeners
        document.querySelectorAll('[data-lightbox-src]').forEach(el => {
            el.setAttribute('role', 'button');
            el.setAttribute('tabindex', '0');
            el.setAttribute('aria-label', 'Click to enlarge photo');

            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    const imgSrc = el.getAttribute('data-lightbox-src');
                    const captionText = el.getAttribute('data-lightbox-title') || '';
                    openLightbox(imgSrc, 'Enlarged view', captionText);
                }
            });
        });

        // Close on clicking backdrop or top-right 'x' button
        lightbox.querySelectorAll('[data-lightbox-close]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                closeLightbox();
            });
        });

        // Close on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    };

    // Initialize all modules
    initMobileNav();
    initFloorPlanToggle();
    initContactForm();
    initMap();
    initSmoothScroll();
    initScrollAnimations();
    initImageLightbox();
    initPhotoGalleryCarousel();
});

// ----------------------------------------------------
// 8. FULL PHOTO GALLERY CAROUSEL MODAL
// ----------------------------------------------------
const initPhotoGalleryCarousel = () => {
    const modal = document.getElementById('gallery-modal');
    const triggerBtn = document.getElementById('open-gallery-btn');
    const mainImg = document.getElementById('gallery-main-img');
    const caption = document.getElementById('gallery-slide-caption');
    const counter = document.getElementById('gallery-counter');
    const prevBtn = document.getElementById('gallery-prev-btn');
    const nextBtn = document.getElementById('gallery-next-btn');
    const thumbTrack = document.getElementById('gallery-thumbnails-track');

    if (!modal || !triggerBtn || !mainImg || !thumbTrack) return;

    const galleryPhotos = [
        { src: 'images/Toledo_Circle_Exterior.png', title: 'Exterior Grounds & Community View', alt: 'Toledo Circle Apartments Exterior Grounds' },
        { src: 'images/Toledo_Circle_Courtyard.WEBP', title: 'Courtyard & Picnic Pavilion', alt: 'Courtyard Lawn & Pavilion' },
        { src: 'images/IMG_0125.WEBP', title: 'Landscaped Walkways & Private Balconies', alt: 'Apartment Building Walkways' },
        { src: 'images/IMG_0126.WEBP', title: 'Spacious Bedroom & Closet', alt: 'Clean Neutral Bedroom' },
        { src: 'images/IMG_0127.WEBP', title: 'Modern Kitchen & Full Appliances', alt: 'Kitchen with Refrigerator' },
        { src: 'images/IMG_0128.WEBP', title: 'Bright Living Room & Hardwood-Style Flooring', alt: 'Living Room Space' },
        { src: 'images/IMG_0129.WEBP', title: 'Open-Concept Dining & Living Area', alt: 'Open Concept Interior' },
        { src: 'images/IMG_0130.WEBP', title: 'Kitchen Cabinetry & Countertops', alt: 'Kitchen Cabinets' },
        { src: 'images/IMG_0131.WEBP', title: 'Master Bedroom with Natural Lighting', alt: 'Bright Master Bedroom' },
        { src: 'images/IMG_0132.WEBP', title: 'Clean & Modern Bathroom Vanity', alt: 'Bathroom Vanity Mirror' },
        { src: 'images/IMG_0133.WEBP', title: 'Full Bathroom & Shower Tub', alt: 'Bathroom Tub and Shower' },
        { src: 'images/IMG_0134.WEBP', title: 'Second Bedroom Layout', alt: 'Second Bedroom' },
        { src: 'images/IMG_0135.WEBP', title: 'Spacious Closets & Storage Space', alt: 'Closet Storage' },
        { src: 'images/IMG_0136.WEBP', title: 'Entryway & Main Living Room View', alt: 'Living Room Entryway' },
        { src: 'images/IMG_0137.WEBP', title: 'Fully Equipped Kitchen Prep Area', alt: 'Kitchen Counter Prep Space' },
        { src: 'images/IMG_0138.WEBP', title: 'Dining Area & Hallway Access', alt: 'Dining Area' },
        { src: 'images/IMG_0139.WEBP', title: 'Cozy Bedroom Layout Option', alt: 'Bedroom Layout' },
        { src: 'images/IMG_0140.WEBP', title: 'Modern Flooring & Interior Finishes', alt: 'Hardwood Style Flooring' },
        { src: 'images/IMG_0141.WEBP', title: 'Bathroom Linen Closet & Storage', alt: 'Linen Storage Closet' },
        { src: 'images/IMG_0142.WEBP', title: 'Living Room Window & Natural Sunlight', alt: 'Living Room Window' },
        { src: 'images/IMG_0143.WEBP', title: 'Kitchen & Dining Room Overview', alt: 'Kitchen and Dining Overview' },
        { src: 'images/IMG_0144.WEBP', title: 'Closet & Dressing Area', alt: 'Dressing Closet' },
        { src: 'images/IMG_0145.WEBP', title: 'Community Grounds & Reserved Parking', alt: 'Community Parking' }
    ];

    let currentIndex = 0;
    let isRendered = false;

    const buildThumbnails = () => {
        if (isRendered) return;
        thumbTrack.innerHTML = '';

        galleryPhotos.forEach((photo, idx) => {
            const thumbBtn = document.createElement('button');
            thumbBtn.className = 'gallery-thumb-item';
            thumbBtn.setAttribute('aria-label', `View photo ${idx + 1}: ${photo.title}`);
            thumbBtn.innerHTML = `<img src="${photo.src}" alt="${photo.alt}">`;
            
            thumbBtn.addEventListener('click', () => {
                goToSlide(idx);
            });

            thumbTrack.appendChild(thumbBtn);
        });

        isRendered = true;
    };

    const updateSlide = () => {
        const currentPhoto = galleryPhotos[currentIndex];
        mainImg.style.opacity = '0.3';
        
        setTimeout(() => {
            mainImg.src = currentPhoto.src;
            mainImg.alt = currentPhoto.alt;
            caption.textContent = currentPhoto.title;
            counter.textContent = `${currentIndex + 1} of ${galleryPhotos.length}`;
            mainImg.style.opacity = '1';
        }, 100);

        // Update active thumbnail state
        const thumbItems = thumbTrack.querySelectorAll('.gallery-thumb-item');
        thumbItems.forEach((item, idx) => {
            if (idx === currentIndex) {
                item.classList.add('active');
                item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
    };

    const goToSlide = (idx) => {
        currentIndex = (idx + galleryPhotos.length) % galleryPhotos.length;
        updateSlide();
    };

    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    const openGallery = (startIndex = 0) => {
        buildThumbnails();
        currentIndex = startIndex;
        updateSlide();
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeGallery = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    // Event Listeners
    triggerBtn.addEventListener('click', () => openGallery(0));

    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });

    modal.querySelectorAll('[data-gallery-close]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            closeGallery();
        });
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;

        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'Escape') {
            closeGallery();
        }
    });
};
