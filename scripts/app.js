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
        const statusSource = document.getElementById('statusSource');
        const statusVideo = document.getElementById('statusVideo');

        if (statusSource && statusVideo) {
            const shouldBeOpen = (day === 5 || day === 6) && (hour >= 22 || hour < 1);
            const newStatus = shouldBeOpen ? "open" : "closed";

            if (newStatus !== currentStatus) {
                currentStatus = newStatus;
                statusSource.src = shouldBeOpen 
                    ? "assets/Bahama_Mamas_Open.mp4"
                    : "assets/Bahama_Mamas_Closed.mp4";
                statusVideo.load();
                statusVideo.play();
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
            aspectRatio: 1.8, // etwas schmaler, damit Kalender nicht so hoch wirkt
            fixedWeekCount: false,
            height: 'auto',
            events: [
                { title: 'Old School HipHop', start: '2025-05-02', color: '#ff00ff' },
                { title: 'Bahama Mamas Saturday Night', start: '2025-05-10', color: '#00e6e6' },
                { title: 'Beach Vibes', start: '2025-05-16', color: '#ff00ff' }
            ],
            headerToolbar: {
    start: '',         // Keine Buttons links
    center: 'title',   // Titel bleibt in der Mitte
    end: 'today prev,next'  // Alle Buttons nach rechts
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

    // Funktion zum aktiven Link aktualisieren
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

    // Klickverhalten mit sofortigem Pink + Scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Ziel-ID holen
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // Alle Links zurücksetzen und diesen sofort aktiv markieren
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');

            // Scrollen zum Ziel
            if (targetSection) {
                if (targetId === "home") {
                    scrollContainer.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }

            // Nach 500ms scrollPosition nochmal prüfen und ggf. korrigieren
            setTimeout(() => {
                updateActiveLink();
            }, 500);
        });
    });

    // Beim Scrollen automatisch nachziehen
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

// --- Lightbox für Cocktailkarten ---
function setupLightbox() {
    const cocktailkarten = document.querySelectorAll('.cocktailkarte');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    cocktailkarten.forEach(card => {
        card.addEventListener('click', function() {
            lightboxImg.src = this.src;
            lightbox.style.display = 'flex';
        });
    });

    lightbox.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });
}


