/// <reference path="../dcs-components.d.ts" />

// Test window.DCS methods
window.DCS._init();
window.DCS._init(document.body);

const registered = window.DCS._registeredComponents();
console.log('Registered components:', registered);

if (window.DCS.toast) {
  const toastInstance = window.DCS.toast('Test toast', {
    type: 'success',
    duration: 3000,
    position: 'top-right',
    action: {
      label: 'Undo',
      callback: () => {
        console.log('Undo clicked');
      },
    },
  });
  toastInstance.dismiss();
}

window.DCS._showToast('Quick alert', 'warning');

const focusables = window.DCS._focusable(document.body);
console.log('Focusables count:', focusables.length);

const releaseFocus = window.DCS._trapFocus(document.body);
releaseFocus();

window.DCS.register('custom-comp', {
  init: (el: HTMLElement) => {
    console.log('Custom comp initialized', el);
  },
});

// Test component option types
const carouselOpts: DCSCarouselOptions = {
  autoplay: true,
  cardsVisible: 3,
};

const toastOpts: DCSToastOptions = {
  type: 'info',
  duration: 5000,
};

const modalOpts: DCSModalOptions = {
  size: 'lg',
  static: false,
};

const progressOpts: DCSProgressOptions = {
  value: 50,
  max: 100,
  color: 'var(--color-primary)',
};

console.log('Sample options:', carouselOpts, toastOpts, modalOpts, progressOpts);

// Test Custom Events
document.addEventListener('dcs-tree-activate', (e: CustomEvent<DCSTreeActivateDetail>) => {
  console.log('Tree activate item:', e.detail.item.id, 'label:', e.detail.label);
});

document.addEventListener('dcs-empty-retry', () => {
  console.log('Empty retry requested');
});

document.addEventListener('dcs-radio-change', (e: CustomEvent<DCSRadioChangeDetail>) => {
  console.log('Radio change value:', e.detail.value, 'label:', e.detail.label, 'input:', e.detail.input.name);
});
