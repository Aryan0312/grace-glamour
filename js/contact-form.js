/* ============================================
   GRACE & GLAMOUR — Contact Form Handler
   Submits to Google Sheets via Google Apps Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', handleSubmit);
});

async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Basic validation
    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const service = form.querySelector('[name="service"]').value;
    const branch = form.querySelector('[name="branch"]').value;
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !phone) {
        showToast('Please fill in your name and phone number.', 'error');
        return;
    }

    if (phone.length < 10) {
        showToast('Please enter a valid phone number.', 'error');
        return;
    }

    if (!service) {
        showToast('Please select a service.', 'error');
        return;
    }

    if (!branch) {
        showToast('Please select a branch.', 'error');
        return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Prepare data
    const data = {
        name,
        phone,
        email,
        service,
        branch,
        message,
        timestamp: new Date().toISOString()
    };

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzjJoRSH9uBM8klew6BPl3dd3gDu6adf5a2KKlsAHmt8n9NptZH19GA9yNnxeMKApyqEA/exec';

    try {
        // Submit as URL-encoded form data (CORS-safe "simple request")
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(data).toString()
        });

        showToast('Thank you! We will contact you soon.', 'success');

        form.reset();
    } catch (error) {
        showToast('Something went wrong. Please try again or WhatsApp us directly.', 'error');
        console.error('Form submission error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function showToast(message, type) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto-hide
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
