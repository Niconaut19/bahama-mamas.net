
// Funktionen nach DOM-Load
document.addEventListener('DOMContentLoaded', function() {
    setupStatusVideo();
    setupCalendar();
    setupSidebarScroll();
    setupLightbox();
});

// --- Status-GIF (Open/Closed) automatisch wechseln ---
function setupStatusVideo() {
    let currentStatus = null;

    function updateStatus() {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        const statusImage = document.getElementById('statusImage'); // IMG statt VIDEO

        if (statusImage) {
            const shouldBeOpen = (day === 5 || day === 6) && (hour >= 22 || hour < 1);
            const newStatus = shouldBeOpen ? "open" : "closed";

            if (newStatus !== currentStatus) {
                currentStatus = newStatus;
                statusImage.src = shouldBeOpen
                    ? "assets/BahamaOpen.gif"
                    : "assets/BahamaClosedgif.gif";
            }
        }
    }

    setInterval(updateStatus, 30000);
    updateStatus();
}

// --- FullCalendar Setup ---
function setupCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            aspectRatio: 1.8,
            fixedWeekCount: false,
            height: 'auto',
            events: [
                { title: 'Old School HipHop', start: '2025-05-02', color: '#ff00ff' },
                { title: 'Bahama Mamas Saturday Night', start: '2025-05-10', color: '#00e6e6' },
                { title: 'Ampelparty', start: '2025-05-16', color: '#ff00ff' },
{ title: 'Bahama Mamas Saturday Night', start: '2025-05-24', color: '#00e6e6' },
{ title: 'BadTaste Party', start: '2025-05-30', color: '#ff00ff' }
            ],
            headerToolbar: {
                start: '',
                center: 'title',
                end: 'today prev,next'
            },
            eventDidMount: function(info) {
                info.el.setAttribute('title', info.event.title);
            }
        });
        calendar.render();
    }
}

// --- Aktiven Sidebar-Link markieren beim Scrollen und Smooth Scroll ---
function setupSidebarScroll() {
    const scrollContainer = document.querySelector('.scroll-container');
    const navLinks = document.querySelectorAll('.sidebar ul li a');
    const sections = document.querySelectorAll('.section');

    function updateActiveLink() {
        let current = "";
        if (scrollContainer.scrollTop <= 20) {
            current = "home";
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollContainer.scrollTop >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');

            if (targetSection) {
                if (targetId === "home") {
                    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }

            setTimeout(() => {
                updateActiveLink();
            }, 500);
        });
    });

// Cocktail-Videos in Lightbox
// Karriere-Videos in Lightbox
    const karriereVideos = document.querySelectorAll('.karriere-video');
    karriereVideos.forEach(video => {
        video.addEventListener('click', function () {
            const source = this.querySelector('source');
            if (source) {
                lightboxImg.style.display = 'none';
                if (lightbox.querySelector('video')) {
                    lightbox.querySelector('video').remove();
                }
                const lightboxVideo = document.createElement('video');
                lightboxVideo.controls = false;
                lightboxVideo.autoplay = true;
                lightboxVideo.loop = true;
                lightboxVideo.src = source.src;
                lightboxVideo.style.maxWidth = '90%';
                lightboxVideo.style.maxHeight = '90%';
                lightboxVideo.style.borderRadius = '15px';
                lightboxVideo.style.boxShadow = '0 0 40px #ff00ff';
                lightboxVideo.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                });
                lightbox.appendChild(lightboxVideo);
                lightbox.style.display = 'flex';
            }
        });
    });
    const cocktailVideos = document.querySelectorAll('.cocktail-video');
    cocktailVideos.forEach(video => {
        video.addEventListener('click', function () {
            const source = this.querySelector('source');
            if (source) {
                lightboxImg.style.display = 'none';
                if (lightbox.querySelector('video')) {
                    lightbox.querySelector('video').remove();
                }
                const lightboxVideo = document.createElement('video');
                lightboxVideo.controls = false;
                lightboxVideo.autoplay = true;
                lightboxVideo.loop = true;
                lightboxVideo.src = source.src;
                lightboxVideo.style.maxWidth = '90%';
                lightboxVideo.style.maxHeight = '90%';
                lightboxVideo.style.borderRadius = '15px';
                lightboxVideo.style.boxShadow = '0 0 40px #ff00ff';
                lightboxVideo.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                });
                lightbox.appendChild(lightboxVideo);
                lightbox.style.display = 'flex';
            }
        });
    });

    let ticking = false;
    scrollContainer.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// --- Lightbox für Cocktailkarten und Lounge-Videos ---
function setupLightbox() {
    const cocktailkarten = document.querySelectorAll('.cocktailkarte');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    // Bild-Lightbox
    cocktailkarten.forEach(card => {
        if (card.tagName.toLowerCase() === 'img') {
            card.addEventListener('click', function() {
                lightboxImg.src = this.src;
                lightboxImg.style.display = 'block';
                if (lightbox.querySelector('video')) {
                    lightbox.querySelector('video').remove();
                }
                lightbox.style.display = 'flex';
            });
        }
    });

    // Video-Lightbox
    const loungeVideos = document.querySelectorAll('.lounge-video');
    loungeVideos.forEach(video => {
        video.addEventListener('click', function () {
            const source = this.querySelector('source');
            if (source) {
                lightboxImg.style.display = 'none';
                if (lightbox.querySelector('video')) {
                    lightbox.querySelector('video').remove();
                }
                const lightboxVideo = document.createElement('video');
                lightboxVideo.controls = false;
                lightboxVideo.autoplay = true;
                lightboxVideo.loop = true;
                lightboxVideo.src = source.src;
                lightboxVideo.style.maxWidth = '90%';
                lightboxVideo.style.maxHeight = '90%';
                lightboxVideo.style.borderRadius = '15px';
                lightboxVideo.style.boxShadow = '0 0 40px #ff00ff';
                lightbox.appendChild(lightboxVideo);
                lightbox.style.display = 'flex';
            }
        });
    });

// Cocktail-Videos in Lightbox
// Karriere-Videos in Lightbox
    const karriereVideos = document.querySelectorAll('.karriere-video');
    karriereVideos.forEach(video => {
        video.addEventListener('click', function () {
            const source = this.querySelector('source');
            if (source) {
                lightboxImg.style.display = 'none';
                if (lightbox.querySelector('video')) {
                    lightbox.querySelector('video').remove();
                }
                const lightboxVideo = document.createElement('video');
                lightboxVideo.controls = false;
                lightboxVideo.autoplay = true;
                lightboxVideo.loop = true;
                lightboxVideo.src = source.src;
                lightboxVideo.style.maxWidth = '90%';
                lightboxVideo.style.maxHeight = '90%';
                lightboxVideo.style.borderRadius = '15px';
                lightboxVideo.style.boxShadow = '0 0 40px #ff00ff';
                lightboxVideo.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                });
                lightbox.appendChild(lightboxVideo);
                lightbox.style.display = 'flex';
            }
        });
    });
    const cocktailVideos = document.querySelectorAll('.cocktail-video');
    cocktailVideos.forEach(video => {
        video.addEventListener('click', function () {
            const source = this.querySelector('source');
            if (source) {
                lightboxImg.style.display = 'none';
                if (lightbox.querySelector('video')) {
                    lightbox.querySelector('video').remove();
                }
                const lightboxVideo = document.createElement('video');
                lightboxVideo.controls = false;
                lightboxVideo.autoplay = true;
                lightboxVideo.loop = true;
                lightboxVideo.src = source.src;
                lightboxVideo.style.maxWidth = '90%';
                lightboxVideo.style.maxHeight = '90%';
                lightboxVideo.style.borderRadius = '15px';
                lightboxVideo.style.boxShadow = '0 0 40px #ff00ff';
                lightboxVideo.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                });
                lightbox.appendChild(lightboxVideo);
                lightbox.style.display = 'flex';
            }
        });
    });

    lightbox.addEventListener('click', function() {
        lightbox.style.display = 'none';
        if (lightbox.querySelector('video')) {
            lightbox.querySelector('video').pause();
        }
    });
}
