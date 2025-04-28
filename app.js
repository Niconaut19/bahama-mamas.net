// Funktionen nach DOM-Load
document.addEventListener('DOMContentLoaded', function() {
    setupStatusVideo();
    setupCalendar();
    setupSidebarScroll();
    setupLightbox();
});

// --- Status-GIF (Open/Closed) automatisch wechseln ---
function setupStatusVideo() {
    function updateStatus() {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        const statusSource = document.getElementById('statusSource');
        const statusVideo = document.getElementById('statusVideo');

        if (statusSource && statusVideo) {
            if ((day === 5 || day === 6) && (hour >= 22 || hour < 1)) {
                statusSource.src = "assets/Bahama_Mamas_Open.mp4";
            } else {
                statusSource.src = "assets/Bahama_Mamas_Closed.mp4";
            }
            statusVideo.load();
            statusVideo.play();
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

    // Klick-Events anpassen
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll-Highlight-Funktion
    scrollContainer.addEventListener('scroll', () => {
        let current = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollContainer.scrollTop >= sectionTop - 80) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
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


