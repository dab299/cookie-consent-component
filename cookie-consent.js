document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded');

  const cookieName = 'cookieConsentStatus';
  const cookieCategories = ['necessary', 'analytics', 'marketing'];

  // Get elements based on custom attributes
  const banner = document.querySelector('[data-cookie-banner="true"]');
  const acceptAllButton = document.querySelector('[data-cookie-accept="true"]');
  const customizeButton = document.querySelector('[data-cookie-customize="true"]');
  const modal = document.querySelector('[data-cookie-modal="true"]');
  const form = document.querySelector('[data-cookie-form="true"]');

  // Preserve the original display style of the banner
  let originalBannerDisplay = getComputedStyle(banner).display;

  const consent = getCookie(cookieName);
  if (!consent) {
    console.log('No consent found, showing cookie banner');
    showCookieBanner();
  } else {
    console.log('Consent already given:', consent);
    applyConsent(consent);
  }

  // Show cookie banner, restore the original display value
  function showCookieBanner() {
    if (banner) {
      banner.style.display = originalBannerDisplay;  // Restore original display style (e.g., 'flex')
      console.log('Banner displayed with original display: ' + originalBannerDisplay);
    }
  }

  // Hide cookie banner, keep the style as 'none'
  function hideCookieBanner() {
    if (banner) {
      banner.style.display = 'none';  // Hide banner
      console.log('Banner hidden');
    }
  }

  // Show the modal for customizing preferences
  function showCookieModal() {
    if (modal) {
      modal.style.display = 'block';  // Display modal
      console.log('Modal displayed');
    }
  }

  // Hide the modal
  function hideCookieModal() {
    if (modal) {
      modal.style.display = 'none';  // Hide modal
      console.log('Modal hidden');
    }
  }

  // Event listener for the "Accept All" button
  if (acceptAllButton) {
    acceptAllButton.addEventListener('click', function() {
      console.log('Accept all clicked');
      setCookie(cookieName, JSON.stringify({ necessary: true, analytics: true, marketing: true }), 365);
      applyConsent({ necessary: true, analytics: true, marketing: true });
      hideCookieBanner();
    });
  }

  // Event listener for the "Customize" button
  if (customizeButton) {
    customizeButton.addEventListener('click', function() {
      console.log('Customize clicked');
      showCookieModal();  // Show the modal for customization
    });
  }

  // Event listener for the form submission in the modal
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(form);
      const consent = {};
      
      // Map checkboxes to consent categories
      cookieCategories.forEach(category => {
        consent[category] = formData.get(category) === 'on';
      });
      
      setCookie(cookieName, JSON.stringify(consent), 365);
      applyConsent(consent);
      hideCookieModal();
      hideCookieBanner();
    });
  }

  // Apply the cookie consent (e.g., load scripts for analytics/marketing if consented)
  function applyConsent(consent) {
    if (consent.analytics) {
      console.log('Analytics enabled');
      // Initialize analytics scripts here
    }
    if (consent.marketing) {
      console.log('Marketing enabled');
      // Initialize marketing scripts here
    }
  }

  // Utility to set a cookie
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  }

  // Utility to get a cookie by name
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
});
