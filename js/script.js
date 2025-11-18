/* js/script.js - Unified JS for site:
   - hamburger menu
   - searches (services, gallery, employees)
   - gallery lightbox
   - flip-on-click employee cards
   - live form validation with inline error messages
   - enquiry calculator
   - contact live clock
   - get-involved redirect
*/

/* DOM helpers */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* HAMBURGER */
(function hamburger() {
    const toggle = $('#menu-toggle');
    // no-op if not present, CSS handles showing/hiding
    if (!toggle) return;
    // close menu when clicking outside (mobile)
    document.addEventListener('click', (e) => {
        const nav = document.querySelector('nav');
        const label = document.querySelector('label.menu-icon');
        if (!nav || !label) return;
        if (!nav.contains(e.target) && !label.contains(e.target) && window.getComputedStyle(label).display !== 'none') {
            toggle.checked = false;
        }
    });
})();

/* SEARCH FILTER - generic */
function liveFilter(inputSel, itemSel) {
    const input = document.querySelector(inputSel);
    if (!input) return;
    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        document.querySelectorAll(itemSel).forEach(it => {
            const text = it.textContent.trim().toLowerCase();
            it.style.display = text.includes(q) ? '' : 'none';
        });
    });
}
liveFilter('#serviceSearch', '.service-card');
liveFilter('#gallerySearch', '.gallery-card');
liveFilter('#employeeSearch', '.flip-card');

/* FLIP CARDS - click to toggle */
(function flips() {
    $$('.flip-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // ignore clicks on links/buttons inside
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
            card.classList.toggle('flipped');
        });
        // keyboard support
        card.tabIndex = 0;
        card.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); card.classList.toggle('flipped'); } });
    });
})();

/* LIGHTBOX */
(function lightbox() {
    const lb = document.getElementById('lightbox') || (() => {
        const d = document.createElement('div'); d.id = 'lightbox'; document.body.appendChild(d); return d;
    })();
    // open images inside .gallery-card img
    $$('.gallery-card img, .card img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
            lb.innerHTML = '';
            const big = document.createElement('img');
            big.src = img.src;
            big.alt = img.alt || '';
            lb.appendChild(big);
            lb.classList.add('active');
        });
    });
    lb.addEventListener('click', () => lb.classList.remove('active'));
})();

/* FORM VALIDATION - live */
function attachFormValidation(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;
    const requiredFields = Array.from(form.querySelectorAll('[required]'));
    // create inline error container per field
    requiredFields.forEach(field => {
        const err = document.createElement('div');
        err.className = 'error';
        err.style.display = 'none';
        field.insertAdjacentElement('afterend', err);
        // live input
        field.addEventListener('input', () => validateField(field, err));
        field.addEventListener('blur', () => validateField(field, err));
    });

    form.addEventListener('submit', (e) => {
        let ok = true;
        requiredFields.forEach(field => {
            const err = field.nextElementSibling && field.nextElementSibling.classList && field.nextElementSibling.classList.contains('error') ? field.nextElementSibling : null;
            if (!validateField(field, err)) ok = false;
        });
        if (!ok) {
            e.preventDefault();
            const firstInvalid = requiredFields.find(f => f.classList.contains('input-invalid'));
            if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // if form has data-redirect attribute, follow it, else allow natural submit
            const redirect = form.dataset.redirect;
            if (redirect) {
                e.preventDefault();
                // show a quick message then redirect
                alert('Thank you! Redirecting you to the Contact page...');
                window.location.href = redirect;
            }
        }
    });

    function validateField(field, err) {
        const value = (field.value || '').trim();
        let valid = true;
        if (field.hasAttribute('required') && !value) valid = false;
        if (valid && field.type === 'email') {
            valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        if (!valid) {
            field.classList.add('input-invalid');
            if (err) { err.textContent = field.getAttribute('data-error') || 'This field is required'; err.style.display = 'block'; }
            return false;
        } else {
            field.classList.remove('input-invalid');
            if (err) { err.textContent = ''; err.style.display = 'none'; }
            return true;
        }
    }
}

/* Attach validation to common forms */
attachFormValidation('#contactForm');
attachFormValidation('#enquiryForm');
attachFormValidation('#involvedForm');

/* ENQUIRY CALCULATOR (price * qty) */
(function calc() {
    const serviceSelect = $('#serviceType');
    const qtyInput = $('#quantity');
    const totalInput = $('#total');
    if (serviceSelect && qtyInput && totalInput) {
        function update() {
            const price = parseFloat(serviceSelect.value) || 0;
            const qty = parseInt(qtyInput.value, 10) || 0;
            totalInput.value = (price * qty).toFixed(2);
        }
        serviceSelect.addEventListener('change', update);
        qtyInput.addEventListener('input', update);
        update();
    }
})();

/* CONTACT live clock */
(function liveClock() {
    const clock = document.getElementById('currentTime') || document.getElementById('liveClock');
    if (!clock) return;
    function tick() {
        const now = new Date();
        clock.textContent = now.toLocaleString();
    }
    tick();
    setInterval(tick, 1000);
})();

/* GET INVOLVED redirect handled by validation attach (use data-redirect attribute) */

/* Small accessibility improvement: enable closing lightbox with ESC */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const lb = document.getElementById('lightbox');
        if (lb && lb.classList.contains('active')) lb.classList.remove('active');
    }
});
// FORM VALIDATION + FEEDBACK
document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let valid = true;
        let inputs = form.querySelectorAll("input[required], textarea[required]");
        let messageBox = form.querySelector(".form-message");

        inputs.forEach(input => {
            if (input.value.trim() === "") {
                valid = false;
                input.style.border = "2px solid red";
            } else {
                input.style.border = "2px solid green";
            }
        });

        if (!valid) {
            messageBox.style.display = "block";
            messageBox.className = "form-message error";
            messageBox.innerText = "Please fill in all required fields.";
            return;
        }

        messageBox.style.display = "block";
        messageBox.className = "form-message success";
        messageBox.innerText = "Thank you! Your form has been submitted successfully.";

        form.reset();
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const menu = document.querySelector("#mobileMenu ul");

    hamburger.addEventListener("click", () => {
        menu.classList.toggle("show");
    });
});
