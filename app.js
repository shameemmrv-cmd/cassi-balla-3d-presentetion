document.addEventListener('DOMContentLoaded', () => {
    // --- Gallery Logic ---
    const galleryModal = document.getElementById('galleryModal');
    const galleryImg = document.getElementById('galleryImg');
    const galleryTitle = document.getElementById('galleryTitle');
    const galleryCounter = document.getElementById('galleryCounter');
    const closeGallery = document.getElementById('closeGallery');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    const planWrapper = document.querySelector('.plan-wrapper');
    let currentIdx = 1;
    const totalImages = 18;

    const updateGallery = (idx) => {
        currentIdx = idx;
        galleryImg.style.opacity = '0';
        
        setTimeout(() => {
            galleryImg.src = `image/pro/${currentIdx}.jpg`;
            galleryTitle.textContent = `RENDER ${currentIdx.toString().padStart(2, '0')}`;
            galleryCounter.textContent = `${currentIdx} / ${totalImages}`;
            galleryImg.style.opacity = '1';
        }, 300);
    };

    const openGallery = (startIdx = 1) => {
        updateGallery(startIdx);
        
        // --- Deep Dive Transition ---
        if (planWrapper) planWrapper.classList.add('diving');
        
        setTimeout(() => {
            galleryModal.style.display = 'flex';
            setTimeout(() => galleryModal.classList.add('active'), 10);
        }, 150); // Slight delay to feel the "dive" start
    };

    const closeGalleryHandler = () => {
        galleryModal.classList.remove('active');
        
        // --- End Deep Dive ---
        if (planWrapper) planWrapper.classList.remove('diving');
        
        setTimeout(() => galleryModal.style.display = 'none', 500);
    };

    // --- Event Listeners ---

    // Camera Hotspots
    document.querySelectorAll('.camera-marker').forEach(marker => {
        marker.addEventListener('click', () => {
            const camId = parseInt(marker.getAttribute('data-camera'));
            openGallery(camId);
        });
    });

    // Gallery Triggers (Hero & Landing Page)
    document.querySelectorAll('.btn-gallery-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            openGallery(1);
        });
    });

    // Navigation
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let nextIdx = currentIdx - 1;
        if (nextIdx < 1) nextIdx = totalImages;
        updateGallery(nextIdx);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let nextIdx = currentIdx + 1;
        if (nextIdx > totalImages) nextIdx = 1;
        updateGallery(nextIdx);
    });

    closeGallery.addEventListener('click', closeGalleryHandler);
    
    // Modal background click
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal || e.target.classList.contains('modal-content')) {
            closeGalleryHandler();
        }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!galleryModal.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'Escape') closeGalleryHandler();
    });

    // --- Smooth Scrolling for Arrows ---
    document.querySelectorAll('.scroll-arrow-down').forEach(arrow => {
        arrow.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Intro Section 3D Parallax & Dust ---
    const introSection = document.getElementById('intro');
    const dustOverlay = document.querySelector('.dust-overlay');

    if (introSection) {
        // Only run parallax on devices with a mouse
        const handleMouseMove = (e) => {
            const { width, height, left, top } = introSection.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            
            const centerX = width / 2;
            const centerY = height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -2; // Max 2 degrees
            const rotateY = ((x - centerX) / centerX) * 2; // Max 2 degrees
            
            introSection.style.setProperty('--rotate-x', `${rotateX}deg`);
            introSection.style.setProperty('--rotate-y', `${rotateY}deg`);
        };

        if (window.matchMedia('(hover: hover)').matches) {
            introSection.addEventListener('mousemove', handleMouseMove);
            introSection.addEventListener('mouseleave', () => {
                introSection.style.setProperty('--rotate-x', '0deg');
                introSection.style.setProperty('--rotate-y', '0deg');
            });
        }
    }


    // Procedural Dust Generator
    if (dustOverlay) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            
            const size = Math.random() * 4 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 30 + 30;
            const delay = Math.random() * -60;
            const opacity = Math.random() * 0.3 + 0.1;
            const blur = Math.random() * 5 + 1;

            Object.assign(particle.style, {
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                background: 'rgba(255, 255, 255, 0.4)',
                borderRadius: '50%',
                left: `${posX}%`,
                top: `${posY}%`,
                opacity: opacity,
                filter: `blur(${blur}px)`,
                animation: `dustFloat ${duration}s linear ${delay}s infinite alternate`,
                willChange: 'transform, opacity'
            });

            dustOverlay.appendChild(particle);
        }
    }
});

// Global CSS Keyframe for Dust
const dustStyle = document.createElement('style');
dustStyle.textContent = `
    @keyframes dustFloat {
        0% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(40px, -60px) scale(1.1); }
        66% { transform: translate(-50px, 40px) scale(0.9); }
        100% { transform: translate(30px, 50px) scale(1); }
    }
`;
document.head.appendChild(dustStyle);
