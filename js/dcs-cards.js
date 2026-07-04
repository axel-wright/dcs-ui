'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('cards', {
    init: function(el) {
      el.addEventListener('click', function(e) {
        var card = e.target.closest('.card-interactive');
        if (!card) return;

        var allCards = el.querySelectorAll('.card-interactive');
        for (var i = 0; i < allCards.length; i++) {
          allCards[i].classList.remove('card-active');
        }
        card.classList.add('card-active');
      });
    }
  });
}
