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
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
