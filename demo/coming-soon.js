/* DCS Coming Soon — Scripts */
(function() {
  'use strict';

  document.documentElement.classList.add('js-enabled');

  // IntersectionObserver scroll animation reveal
  document.addEventListener('DOMContentLoaded', function() {
    var observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function(entries, observerInstance) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          observerInstance.unobserve(entry.target);
        }
      });
    }, observerOptions);

    var scrollElements = document.querySelectorAll('.reveal-on-scroll');
    for (var i = 0; i < scrollElements.length; i++) {
      observer.observe(scrollElements[i]);
    }
  });

  // Subscribe Form Validation
  var subscribeForm = document.getElementById('dcs-subscribe-form');
  var subscribeEmail = document.getElementById('subscribe-email');
  var subscribeMessage = document.getElementById('subscribe-message');
  var timeoutId = null;

  if (subscribeForm && subscribeEmail && subscribeMessage) {
    subscribeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      var emailVal = subscribeEmail.value.trim();
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(emailVal)) {
        subscribeMessage.textContent = 'Please enter a valid email address.';
        subscribeMessage.className = 'subscribe-message error';
        subscribeEmail.focus();
      } else {
        subscribeMessage.textContent = 'Success! You have been subscribed.';
        subscribeMessage.className = 'subscribe-message success';
        subscribeForm.reset();

        timeoutId = setTimeout(function() {
          subscribeMessage.textContent = '';
          subscribeMessage.className = 'subscribe-message';
        }, 5000);
      }
    });

    subscribeEmail.addEventListener('input', function() {
      subscribeMessage.textContent = '';
      subscribeMessage.className = 'subscribe-message';
    });
  }
})();
