// DCS Test Harness — minimal assertion framework
// No external dependencies. Works in any browser.

var DCS_TEST = (function() {
  'use strict';

  var results = [];
  var currentSuite = '';

  function log(type, msg) {
    results.push({ suite: currentSuite, type: type, msg: msg, time: new Date() });
    var color = type === 'PASS' ? '#22c55e' : type === 'FAIL' ? '#ef4444' : '#f59e0b';
    console.log('%c[' + type + '] %c' + currentSuite + ' %c' + msg,
      'color:' + color + ';font-weight:bold', 'color:#94a3b8', 'color:#e2e8f0');
  }

  return {
    suite: function(name, fn) {
      currentSuite = name;
      fn();
      currentSuite = '';
    },

    assertEqual: function(actual, expected, msg) {
      if (actual === expected) {
        log('PASS', msg);
      } else {
        log('FAIL', msg + ' — expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
      }
    },

    assertOk: function(value, msg) {
      if (value) {
        log('PASS', msg);
      } else {
        log('FAIL', msg + ' — expected truthy, got ' + JSON.stringify(value));
      }
    },

    assertNotOk: function(value, msg) {
      if (!value) {
        log('PASS', msg);
      } else {
        log('FAIL', msg + ' — expected falsy, got ' + JSON.stringify(value));
      }
    },

    assertHasClass: function(el, className, msg) {
      if (el && el.classList.contains(className)) {
        log('PASS', msg);
      } else {
        log('FAIL', msg + ' — element does not have class "' + className + '"');
      }
    },

    assertNotHasClass: function(el, className, msg) {
      if (el && !el.classList.contains(className)) {
        log('PASS', msg);
      } else {
        log('FAIL', msg + ' — element has class "' + className + '"');
      }
    },

    assertAttr: function(el, attr, expected, msg) {
      var actual = el ? el.getAttribute(attr) : null;
      if (actual === expected) {
        log('PASS', msg);
      } else {
        log('FAIL', msg + ' — expected ' + attr + '="' + expected + '", got "' + actual + '"');
      }
    },

    // Create a DOM fixture inside #test-fixtures, return the container
    fixture: function(html) {
      var container = document.getElementById('test-fixtures');
      if (!container) {
        container = document.createElement('div');
        container.id = 'test-fixtures';
        document.body.appendChild(container);
      }
      var wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      container.appendChild(wrapper);
      return wrapper;
    },

    // Clean up all fixtures
    cleanup: function() {
      var container = document.getElementById('test-fixtures');
      if (container) {
        container.innerHTML = '';
      }
    },

    // Simulate a keydown event
    keydown: function(el, key, shiftKey) {
      var event = new KeyboardEvent('keydown', {
        key: key,
        shiftKey: !!shiftKey,
        bubbles: true,
        cancelable: true
      });
      el.dispatchEvent(event);
    },

    // Simulate a click event
    click: function(el) {
      var event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      el.dispatchEvent(event);
    },

    // Wait for animations (DCS often uses requestAnimationFrame)
    wait: function(ms) {
      return new Promise(function(resolve) {
        setTimeout(resolve, ms || 50);
      });
    },

    getResults: function() {
      return results;
    },

    summary: function() {
      var pass = 0, fail = 0;
      for (var i = 0; i < results.length; i++) {
        if (results[i].type === 'PASS') pass++;
        else if (results[i].type === 'FAIL') fail++;
      }
      return { pass: pass, fail: fail, total: pass + fail };
    }
  };
})();
