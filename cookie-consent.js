document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded');  // Log when the DOM is fully loaded

  const cookieName = 'cookieConsentStatus';
  const cookieCategories = ['necessary', 'analytics', 'marketing'];

  const consent = getCookie(cookieName);
  if (!consent) {
    console.log('No consent found, showing cookie banner');
    alert('Cookie banner should appear now');  // Show an alert for debugging
    showCookieBanner();
  } else {
    console.log('Consent already given:', consent);
    applyConsent(consent);
  }

  function showCookieBanner() {
    console.log('Displaying cookie banner');
    const banner = document.createElement('div');
    banner.setAttribute('id', 'cookie-banner');
    banner.innerHTML = `
      <div class="cookie-banner-container">
        <p>We use cookies to improve your experience. By continuing to browse, you agree to our use of cookies.</p>
        <div class="cookie-controls">
          <button id="accept-all-cookies">Accept All</button>
          <button id="customize-cookies">Customize</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
    console.log('Banner added to DOM');

    document.getElementById('accept-all-cookies').addEventListener('click', function() {
      console.log('Accept all clicked');
      setCookie(cookieName, JSON.stringify({ necessary: true, analytics: true, marketing: true }), 365);
      applyConsent({ necessary: true, analytics: true, marketing: true });
      removeBanner();
    });

    document.getElementById('customize-cookies').addEventListener('click', function() {
      console.log('Customize clicked');
      showCustomizeModal();
    });
  }

  function showCustomizeModal() {
    const modal = document.createElement('div');
    modal.setAttribute('id', 'cookie-modal');
    modal.innerHTML = `
      <div class="cookie-modal-content">
        <h2>Customize your cookie preferences</h2>
        <form id="cookie-form">
          <label><input type="checkbox" name="necessary" checked disabled> Necessary (required)</label>
          <label><input type="checkbox" name="analytics"> Analytics</label>
          <label><input type="checkbox" name="marketing"> Marketing</label>
          <button type="submit">Save preferences</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('cookie-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      const consent = {};
      cookieCategories.forEach(category => {
        consent[category] = formData.get(category) === 'on';
      });
      setCookie(cookieName, JSON.stringify(consent), 365);
      applyConsent(consent);
      removeModal();
      removeBanner();
    });
  }

  function applyConsent(consent) {
    if (consent.analytics) {
      console.log('Analytics enabled');
      // Add analytics scripts here
    }
    if (consent.marketing) {
      console.log('Marketing enabled');
      // Add marketing scripts here
    }
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  }

  function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return JSON.parse(decodeURIComponent(cookieValue));
      }
    }
    return null;
  }

  function removeBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.remove();
  }

  function removeModal() {
    const modal = document.getElementById('cookie-modal');
    if (modal) modal.remove();
  }
});
