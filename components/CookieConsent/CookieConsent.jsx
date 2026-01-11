import { useState, useEffect } from 'react';
import styles from './CookieConsent.module.css';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);

    // Disable analytics if declined
    if (window.gtag) {
      window['ga-disable-' + process.env.NEXT_PUBLIC_GA_ID] = true;
    }
  };

  if (!showBanner) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.text}>
          <p className={styles.title}>🍪 We use cookies</p>
          <p className={styles.description}>
            We use cookies to improve your experience and analyze site traffic.
            By clicking "Accept", you consent to our use of cookies.{' '}
            <a href="/privacy" className={styles.link}>
              Learn more about our privacy policy
            </a>
          </p>
        </div>
        <div className={styles.buttons}>
          <button
            onClick={declineCookies}
            className={styles.declineBtn}
            aria-label="Decline cookies"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className={styles.acceptBtn}
            aria-label="Accept cookies"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}


