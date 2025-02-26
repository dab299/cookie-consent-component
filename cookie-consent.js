  document.addEventListener('DOMContentLoaded', function () {
    const WORKER_URL = "https://cookieconsents.square-thunder-f447.workers.dev/";
    const categoryCookies = {
      functional: ["APISID", "HSID", "NID", "SAPISID", "SEARCH_SAMESITE", "SID", "SIDCC", "SSID", "UULE", "_Secure-1PAPISID","_Secure-1PSID", "_Secure-1PSIDCC", "_Secure-3PAPISID", "_Secure-3PSID", "_Secure-3PSIDCC", "_Secure-ENID"],
      analytics: ["_ga", "_ga_GGNN4J92D5", "_ga_TQ58W31LB3", "ar_debug", "analyticsTestCookie"],
      marketing: ["marketingTestCookie"]
    };

    function savePreferences(preferences) {
      document.cookie = `cookiePreferences=${JSON.stringify(preferences)}; path=/; max-age=31536000`;
      fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: getUserId(),
          preferences
        })
      }).then(() => {
        console.log("Preferences saved to KV successfully.");
      }).catch(err => console.error("Error saving preferences to KV:", err));
    }

    function getPreferences() {
      const name = "cookiePreferences=";
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(name) === 0) {
          return JSON.parse(cookie.substring(name.length));
        }
      }
      return null;
    }

    function getUserId() {
      let userId = document.cookie.split(';').find(c => c.trim().startsWith("userId="));
      if (!userId) {
        userId = crypto.randomUUID();
        document.cookie = `userId=${userId}; path=/; max-age=31536000`;
        console.log("Generated new user ID:", userId);
      } else {
        userId = userId.split('=')[1];
      }
      return userId;
    }

    function resetCategoryScripts(category) {
      const scripts = document.querySelectorAll(`script[data-cookiecategory="${category}"]`);
      scripts.forEach(script => {
        script.type = "text/plain";
        script.removeAttribute("data-processed");

        const injectedScripts = document.querySelectorAll('script[data-injected-script]');
        injectedScripts.forEach(injected => {
          injected.remove();
          console.log(`Removed dynamically injected script: ${injected.src || "Inline script"}`);
        });
      });
    }

    function clearCategoryCookies(preferences) {
      const removeCookie = (cookieName) => {
        const domainParts = location.hostname.split('.');
        for (let i = 0; i < domainParts.length; i++) {
          const domain = domainParts.slice(i).join('.');
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
        console.log(`Forcefully removed cookie: ${cookieName}`);
      };

      Object.keys(categoryCookies).forEach(category => {
        if (!preferences[category]) {
          categoryCookies[category].forEach(cookieName => removeCookie(cookieName));
          resetCategoryScripts(category); // Reset scripts for this category
        }
      });
    }

    function applyPreferences(preferences) {
      clearCategoryCookies(preferences);

      Object.keys(categoryCookies).forEach(category => {
        if (preferences[category]) {
          const scripts = document.querySelectorAll(`script[type="text/plain"][data-cookiecategory="${category}"]`);
          scripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.type = "text/javascript";
            if (script.src) {
              newScript.src = script.src;
              if (script.async) newScript.async = true;
              if (script.defer) newScript.defer = true;
            } else {
              newScript.textContent = script.textContent;
            }
            newScript.setAttribute('data-injected-script', 'true');
            script.parentNode.insertBefore(newScript, script.nextSibling);
            script.setAttribute('data-processed', 'true');
            console.log(`Injected script for category ${category}: ${newScript.src || "Inline script"}`);
          });
        }
      });
    }

    function showConsentBanner() {
      const banner = document.getElementById('cookie-consent-banner');
      if (banner) banner.style.display = 'block';
    }

    function attachBannerListeners() {
      document.getElementById('accept-all-btn').addEventListener('click', () => {
        const preferences = { functional: true, analytics: true, marketing: true, essential: true };
        savePreferences(preferences);
        applyPreferences(preferences);
        document.getElementById('cookie-consent-banner').style.display = 'none';
      });

      document.getElementById('reject-all-btn').addEventListener('click', () => {
        const preferences = { functional: false, analytics: false, marketing: false, essential: true };
        savePreferences(preferences);
        applyPreferences(preferences);
        document.getElementById('cookie-consent-banner').style.display = 'none';
      });

      document.getElementById('customize-preferences-btn').addEventListener('click', () => {
        populateModalCheckboxes();
        document.getElementById('preferences-modal').style.display = 'flex';
      });
    }

    function attachModalListeners() {
      document.getElementById('modal-accept-all-btn').addEventListener('click', () => {
        const preferences = { functional: true, analytics: true, marketing: true, essential: true };
        savePreferences(preferences);
        applyPreferences(preferences);
        document.getElementById('preferences-modal').style.display = 'none';
      });

      document.getElementById('modal-reject-all-btn').addEventListener('click', () => {
        const preferences = { functional: false, analytics: false, marketing: false, essential: true };
        savePreferences(preferences);
        applyPreferences(preferences);
        document.getElementById('preferences-modal').style.display = 'none';
      });

      document.getElementById('save-preferences-btn').addEventListener('click', (event) => {
        event.preventDefault();
        const preferences = {
          functional: document.getElementById('functional-checkbox').checked,
          analytics: document.getElementById('analytics-checkbox').checked,
          marketing: document.getElementById('marketing-checkbox').checked,
          essential: true
        };
        savePreferences(preferences);
        applyPreferences(preferences);
        document.getElementById('preferences-modal').style.display = 'none';
      });
    }

    function populateModalCheckboxes() {
      const preferences = getPreferences();
      if (preferences) {
        document.getElementById('functional-checkbox').checked = preferences.functional;
        document.getElementById('analytics-checkbox').checked = preferences.analytics;
        document.getElementById('marketing-checkbox').checked = preferences.marketing;
      }
    }

    function initializePreferences() {
      const preferences = getPreferences();
      if (!preferences) {
        showConsentBanner();
      } else {
        applyPreferences(preferences);
      }
      attachBannerListeners();
      attachModalListeners();
      const cookieSettingsLink = document.getElementById('cookie-settings-link');
      if (cookieSettingsLink) {
        cookieSettingsLink.addEventListener('click', (event) => {
          event.preventDefault();
          populateModalCheckboxes();
          document.getElementById('preferences-modal').style.display = 'flex';
        });
      }
    }

    initializePreferences();
  });
