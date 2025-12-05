import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";   // Create this component
import Footer from "./Footer";   // Create this component

function Layout({ title, description, children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const wowScript = document.createElement("script");
    wowScript.src = "/lib/wow/wow.min.js";
    wowScript.async = true;
    wowScript.onload = () => new window.WOW().init();
    document.body.appendChild(wowScript);

    // Hide preloader after load
    const preloader = document.getElementById("preloader");
    if (preloader) {
      setTimeout(() => {
        preloader.style.display = "none";
      }, 1000);
    }

    // Ensure Google Translate is reinitialized on route change for all elements
    if (typeof window.google !== 'undefined' && window.google.translate) {
      const elements = [
        'google_translate_element',
        'google_translate_element_navbar',
        'google_translate_element_mobile',
        'google_translate_element_footer'
      ];
      
      elements.forEach(elementId => {
        const translateElement = document.getElementById(elementId);
        if (translateElement && !translateElement.querySelector('.goog-te-combo')) {
          // Reinitialize if needed
          setTimeout(() => {
            if (typeof window.googleTranslateElementInit === 'function') {
              window.googleTranslateElementInit();
            }
          }, 500);
        }
      });
    }
  }, [location]);

  return (
    <>
     
      {/* Preloader */}
      <div className="preloader" id="preloader">
        <div className="loader">
          <div className="loader-outter"></div>
          <div className="loader-inner"></div>
          <div className="indicator">
            <img src="/img/afaw-logo-africa.png" width="40px" alt="AfAW Logo" />
          </div>
        </div>
      </div>

      <Navbar />

      <main>{children}</main>

      <Footer />

      {/* Scroll to Top */}
      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
        <i className="bi bi-arrow-up"></i>
      </a>
    </>
  );
}

export default Layout;
