/* global script for site: hamburger, 3 searches, flip-cards, lightbox, forms, clock */

/* ---------- DOM helpers ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* ---------- HAMBURGER (only visible <768 via CSS) ---------- */
(function navToggle() {
    // checkbox + label handles toggle; nothing extra needed
    // keep accessible keyboard toggle
    const menuToggle = $('#menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('change', () => {
            // nothing special required; CSS shows/hides
        });
    }
})();

/* ---------- CLICK-TO-FLIP EMPLOYEE CARDS ---------- */
(function employeeFlip() {
    const employees = $$('.employee-card');
    employees.forEach(card => {
        card.addEventListener('click', (e) => {
            // toggle class on the clicked card only
            card.classList.toggle('flip-active');
        });
    });
})();

/* ---------- LIGHTBOX for gallery images ---------- */
(function lightboxInit() {
    const lightbox = $('#lightbox') || (function () { const d = document.createElement('div'); d.id = 'lightbox'; d.className = 'lightbox'; document.body.appendChild(d); return d; })();
    function openLight(src, alt) {
        lightbox.innerHTML = '';
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt || '';
        lightbox.appendChild(img);
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
    }
    function closeLight() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.innerHTML = '';
    }
    // attach events to gallery-card images
    $$('.gallery-card img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => openLight(img.src, img.alt));
    });
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLight();
    });
})();

/* ---------- SEARCH FILTERS (services, gallery, employees) ----------
   Each search input should exist in HTML with these IDs:
   - #serviceSearch (filters .service-card elements)
   - #gallerySearch (filters .gallery-card elements)
   - #employeeSearch (filters .employee-card elements)
*/
(function searches() {
    function setup(inputId, selectorList) {
        const input = document.getElementById(inputId);
        if (!input) return;
        input.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase();
            const items = document.querySelectorAll(selectorList);
            items.forEach(it => {
                const text = it.textContent.trim().toLowerCase();
                it.style.display = text.indexOf(q) > -1 ? '' : 'none';
            });
        });
    }
    setup('serviceSearch', '.service-card');
    setup('gallerySearch', '.gallery-card');
    setup('employeeSearch', '.employee-card');
})();

/* ---------- FORM VALIDATION + AJAX simulation ----------
   Forms with attribute data-ajax="true" will show a simulated async response.
   Example: <form id="myForm" data-ajax="true"> ... </form>
*/
(function forms() {
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    $$('form').forEach(form => {
        form.addEventListener('submit', e => {
            // required inputs: elements with required attribute
            const requireds = Array.from(form.querySelectorAll('[required]'));
            let ok = true;
            requireds.forEach(inp => {
                inp.classList.remove('err');
                if (!inp.value.trim()) {
                    inp.classList.add('err');
                    ok = false;
                } else if (inp.type === 'email' && !validateEmail(inp.value.trim())) {
                    inp.classList.add('err');
                    ok = false;
                }
            });

            if (!ok) {
                e.preventDefault();
                const fb = form.querySelector('.form-feedback');
                if (fb) fb.textContent = 'Please complete the required fields correctly.';
                return;
            }

            // If form has data-ajax attribute, simulate submission and show feedback
            if (form.dataset.ajax === "true") {
                e.preventDefault();
                const fb = form.querySelector('.form-feedback') || document.createElement('div');
                fb.className = 'form-feedback';
                fb.textContent = 'Sending...';
                form.appendChild(fb);
                // simulate server delay
                setTimeout(() => {
                    fb.textContent = 'Thank you — we received your enquiry. We will be in touch shortly.';
                    form.reset();
                }, 900);
            }
            // otherwise allow real submit
        });
    });
})();

/* ---------- LIVE CLOCK helper (for contact page) ----------
   Place an element with id="liveClock" where you want the time displayed.
*/
(function liveClock() {
    const el = document.getElementById('liveClock');
    if (!el) return;
    function tick() {
        const now = new Date();
        // local string; you can format differently if needed
        el.textContent = now.toLocaleString();
    }
    tick();
    setInterval(tick, 1000);
})();

/* ---------- small accessibility & keyboard support ----------
   Allow Enter on focused employee card to flip
*/
(function keyboardSupport() {
    $$('.employee-card').forEach(card => {
        card.tabIndex = 0;
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') card.classList.toggle('flip-active');
        });
    });
})();
// ======= Hamburger Menu Toggle =======
const hamburger = document.querySelector(".hamburger");
const navBar = document.querySelector(".nav-bar");
if (hamburger) {
    hamburger.addEventListener("click", () => {
        navBar.classList.toggle("active");
    });
}

// ======= Search Feature (Services, Gallery, Staff) =======
function searchItems(inputSelector, itemsSelector) {
    const input = document.querySelector(inputSelector);
    if (!input) return;
    input.addEventListener("keyup", () => {
        const filter = input.value.toLowerCase();
        document.querySelectorAll(itemsSelector).forEach((item) => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(filter) ? "" : "none";
        });
    });
}

searchItems(".search-services input", ".service-card");
searchItems("#gallerySearch", ".card");
searchItems("#staffSearch", ".flip-card");

// ======= FAQ Accordion =======
document.querySelectorAll(".faq-question").forEach((q) => {
    q.addEventListener("click", () => {
        const answer = q.nextElementSibling;
        answer.style.display = answer.style.display === "block" ? "none" : "block";
    });
});

// ======= Contact & Enquiry Form Validation =======
function validateForm(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;

        form.querySelectorAll("input, textarea").forEach((field) => {
            if (!field.value.trim()) {
                field.style.borderColor = "red";
                valid = false;
            } else {
                field.style.borderColor = "#ccc";
            }
        });

        if (valid) {
            alert("Thank you! Your message has been received.");
            form.reset();
        } else {
            alert("Please fill out all required fields.");
        }
    });
}

validateForm("#contactForm");
validateForm("#enquiryForm");

// ======= Lightbox for Gallery =======
const galleryImages = document.querySelectorAll(".card img");
galleryImages.forEach((img) => {
    img.addEventListener("click", () => {
        const lightbox = document.createElement("div");
        lightbox.classList.add("lightbox");
        lightbox.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
        document.body.appendChild(lightbox);
        lightbox.addEventListener("click", () => lightbox.remove());
    });
});

// ======= Dynamic Time Display (Contact Page) =======
const timeEl = document.querySelector("#currentTime");
if (timeEl) {
    setInterval(() => {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString();
    }, 1000);
}
// HAMBURGER MENU
const ham = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-bar ul");

if (hamburger) {
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("show");
    });
}

// REDIRECT on Get Involved form submit
const involvedForm = document.getElementById("involvedForm");
if (involvedForm) {
    involvedForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Thank you for your interest! Redirecting you to our Contact page...");
        window.location.href = "./Contact us.html";
    });
}


/* ---------- End of script ---------- */
