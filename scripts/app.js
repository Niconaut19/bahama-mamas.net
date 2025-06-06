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
        const currentDate = now.toISOString().split("T")[0];
        const currentHour = now.getHours();
        const statusImage = document.getElementById('statusImage');

        let savedEvents = JSON.parse(localStorage.getItem('bahamaEvents') || "[]");

        // Kalender-Events plus Standard-Events kombinieren
        const allEvents = [
            { title: 'Old School HipHop', start: '2025-05-02' },
            { title: 'Bahama Mamas Saturday Night', start: '2025-05-10' },
            { title: 'Ampelparty', start: '2025-05-16' },
            { title: 'Bahama Mamas Saturday Night', start: '2025-05-24' },
            { title: 'BadTaste Party', start: '2025-05-30' },
            { title: 'Bahama No 4', start: '2025-06-04' },
            { title: 'Bahama Mamas Saturday Night', start: '2025-06-07' },
            { title: 'Bahama No 4', start: '2025-06-11' },
            { title: 'Horror Night', start: '2025-06-13' },
            { title: 'Bahama No 4', start: '2025-06-18' },
            { title: 'Bahama Mamas Saturday Night', start: '2025-06-21' },
            { title: 'Bahama No 4', start: '2025-06-25' },
            { title: 'Ampel Party 2.0', start: '2025-06-27' },
            { title: 'Bahama No 4', start: '2025-07-02' },
            { title: 'Bahama Mamas Saturday Night', start: '2025-07-05' },
            ...savedEvents
        ];

        const hasEventToday = allEvents.some(event => event.start === currentDate);
        const shouldBeOpen = hasEventToday && (currentHour >= 22 || currentHour < 1);
        const newStatus = shouldBeOpen ? "open" : "closed";

        if (statusImage && newStatus !== currentStatus) {
            currentStatus = newStatus;
            statusImage.src = shouldBeOpen
                ? "assets/BahamaOpen.gif"
                : "assets/BahamaClosedgif.gif";
        }
    }

    setInterval(updateStatus, 30000);
    updateStatus();
}


// --- FullCalendar Setup ---
function setupCalendar() {
    const calendarEl = document.getElementById('calendar');
    const adminPanel = document.getElementById('calendar-admin-modal');
    let calendar;

    const defaultEvents = [
        { title: 'Old School HipHop', start: '2025-05-02', color: '#8a2be2' },
        { title: 'Bahama Mamas Saturday Night', start: '2025-05-10', color: '#ff69b4' },
        { title: 'Ampelparty', start: '2025-05-16', color: '#8a2be2' },
        { title: 'Bahama Mamas Saturday Night', start: '2025-05-24', color: '#ff69b4' },
        { title: 'BadTaste Party', start: '2025-05-30', color: '#8a2be2' },
        { title: 'Bahama No 4', start: '2025-06-04', color: '#40e0d0' },
        { title: 'Bahama Mamas Saturday Night', start: '2025-06-07', color: '#ff69b4' },
        { title: 'Bahama No 4', start: '2025-06-11', color: '#40e0d0' },
        { title: 'Horror Night', start: '2025-06-13', color: '#8a2be2' },
        { title: 'Bahama No 4', start: '2025-06-18', color: '#40e0d0' },
        { title: 'Bahama Mamas Saturday Night', start: '2025-06-21', color: '#ff69b4' },
        { title: 'Bahama No 4', start: '2025-06-25', color: '#40e0d0' },
        { title: 'Ampel Party 2.0', start: '2025-06-27', color: '#8a2be2' },
        { title: 'Bahama No 4', start: '2025-07-02', color: '#40e0d0' },
        { title: 'Bahama Mamas Saturday Night', start: '2025-07-05', color: '#ff69b4' },
    ];

    let savedEvents = JSON.parse(localStorage.getItem('bahamaEvents') || "[]");
    const combinedEvents = [...defaultEvents, ...savedEvents];

    function getColorForTitle(title) {
        title = title.toLowerCase();
        if (title.includes("no 4")) return "#40e0d0";
        if (title.includes("saturday")) return "#ff69b4";
        if (title.includes("ampel")) return "#8a2be2";
        if (title.includes("horror")) return "#8a2be2";
        if (title.includes("badtaste")) return "#8a2be2";
        return "#00e6e6";
    }

    if (calendarEl) {
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            aspectRatio: 1.8,
            fixedWeekCount: false,
            height: 'auto',
            events: combinedEvents,
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

    const addBtn = document.getElementById('add-event-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const title = document.getElementById('event-title').value;
            const date = document.getElementById('event-date').value;
            if (!title || !date) return;

            const color = getColorForTitle(title);
            const newEvent = { title, start: date, color };
            calendar.addEvent(newEvent);

            savedEvents.push(newEvent);
            localStorage.setItem('bahamaEvents', JSON.stringify(savedEvents));

            document.getElementById('event-title').value = "";
            document.getElementById('event-date').value = "";
        });
    }

    const deleteBtn = document.getElementById('delete-event-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const delDate = document.getElementById('delete-date').value;
            if (!delDate) return;

            savedEvents = savedEvents.filter(ev => ev.start !== delDate);
            localStorage.setItem('bahamaEvents', JSON.stringify(savedEvents));
            location.reload();
        });
    }

    window.activateAdminMode = function () {
        if (adminPanel) {
            adminPanel.classList.remove('hidden');
        }
    };
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

    // Bild-Lightbox (Cocktailkarten)
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

    // Video-Lightbox (Lounges)
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

    // Video-Lightbox (Karriere)
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

    // Lightbox für Partner-Logos
    const partnerLogos = document.querySelectorAll('.partner-logo');
partnerLogos.forEach(logo => {
    if (!logo.closest('a.partner-link')) { // Nur wenn KEIN Link außenrum
        logo.addEventListener('click', function () {
            lightboxImg.src = this.src;
            lightboxImg.style.display = 'block';
            if (lightbox.querySelector('video')) {
                lightbox.querySelector('video').remove();
            }
            lightbox.style.display = 'flex';
        });
    }
});

    // Klick zum Schließen
    lightbox.addEventListener('click', function() {
        lightbox.style.display = 'none';
        if (lightbox.querySelector('video')) {
            lightbox.querySelector('video').pause();
        }
    });
}

// Admin Login Verhalten
document.addEventListener('DOMContentLoaded', function () {
  const adminButton = document.getElementById('admin-button');
  const adminOverlay = document.getElementById('admin-overlay');
  const loginBtn = document.getElementById('admin-login-btn');
  const passwordField = document.getElementById('admin-password');
  const loginError = document.getElementById('admin-login-error');
  const closeBtn = document.getElementById('admin-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      adminOverlay.classList.add('hidden');
      passwordField.value = "";
      loginError.classList.add('hidden');
    });
  }
  const adminPassword = "bahama123"; // Passwort kannst du hier ändern

  const eventsSection = document.getElementById('events');

  // Zeige Zahnrad nur, wenn Events-Sektion im Viewport sichtbar ist
  window.addEventListener('scroll', () => {
    const rect = eventsSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 100;
    if (inView) {
      adminButton.classList.remove('hidden');
    } else {
      adminButton.classList.add('hidden');
    }
  });

  // Klick auf Zahnrad → öffnet Admin-Login
  if (adminButton && loginBtn && passwordField) {
    adminButton.addEventListener('click', () => {
      adminOverlay.classList.remove('hidden');
    });

    loginBtn.addEventListener('click', () => {
      if (passwordField.value === adminPassword) {
        adminOverlay.classList.add('hidden');
        passwordField.value = "";
        loginError.classList.add('hidden');
        const modal = document.getElementById("calendar-admin-modal");
if (modal) {
  modal.classList.remove("hidden");
}
      } else {
        loginError.classList.remove('hidden');
      }
    });

    // ESC-Taste schließt Overlay
    document.addEventListener('keydown', (e) => {
      if (e.key === "Escape") {
        adminOverlay.classList.add('hidden');
        passwordField.value = "";
        loginError.classList.add('hidden');
      }
    });
  }
});

const closeAdminModal = document.getElementById("close-admin-modal");
if (closeAdminModal) {
  closeAdminModal.addEventListener("click", () => {
    document.getElementById("calendar-admin-modal").classList.add("hidden");
  });
}


