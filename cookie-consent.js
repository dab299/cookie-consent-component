document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded');

    const cookieName = 'cookieConsentStatus';
    const cookieCategories = ['necessary', 'analytics', 'marketing'];

    const consent = getCookie(cookieName);
    if (!consent) {
        console.log('No consent found, showing cookie banner');
        showCookieBanner();
    } else {
        console.log('Consent already given:', consent);
        applyConsent(consent);
    }

    function showCookieBanner() {
        console.log('Displaying cookie banner');

        const banner = document.querySelector('[data-cookie-banner="true"]');
        const acceptButton = document.querySelector('[data-cookie-accept="true"]');
        const customizeButton = document.querySelector('[data-cookie-customize="true"]');

        // Show the banner
        banner.style.display = 'block';

        // Handle Accept All button
        acceptButton.addEventListener('click', function () {
            console.log('Accept all clicked');
            setCookie(cookieName, JSON.stringify({ necessary: true, analytics: true, marketing: true }), 365);
            applyConsent({ necessary: true, analytics: true, marketing: true });
            banner.style.display = 'none'; // Hide banner after accepting
        });

        // Handle Customize button
        customizeButton.addEventListener('click', function () {
            console.log('Customize clicked');
            showCustomizeModal();
        });
    }

    function showCustomizeModal() {
        const modal = document.querySelector('[data-cookie-modal="true"]');
        const form = document.querySelector('[data-cookie-form="true"]');

        // Show the modal
        modal.style.display = 'block';

        // Handle form submission
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(form);
            const consent = {};
            cookieCategories.forEach(category => {
                consent[category] = formData.get(category) === 'on';
            });
            setCookie(cookieName, JSON.stringify(consent), 365);
            applyConsent(consent);
            modal.style.display = 'none'; // Hide modal after saving preferences
            document.querySelector('[data-cookie-banner="true"]').style.display = 'none'; // Hide banner too
        });
    }

    function applyConsent(consent) {
        if (consent.analytics) {
            console.log('Analytics enabled');
        }
        if (consent.marketing) {
            console.log('Marketing enabled');
        }
    }

    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    }

    function getCookie(name) {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const
