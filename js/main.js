/* Stone Rabbit Technologies — interactions & animations */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Header shadow on scroll ---- */
  var header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Animated stat counters ---- */
  var counters = document.querySelectorAll('.stat-num[data-count]');
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var isFloat = target % 1 !== 0;
    var duration = 1400;
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      var val = target * eased;
      el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
    }
    requestAnimationFrame(frame);
  }
  if (prefersReduced || !('IntersectionObserver' in window)) {
    counters.forEach(function (el) {
      var t = parseFloat(el.getAttribute('data-count'));
      el.textContent = (t % 1 !== 0 ? t.toFixed(1) : t) + (el.getAttribute('data-suffix') || '');
    });
  } else {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- Scroll-generated code rail ----
     Scrolling emits characters; a slow idle drip keeps it alive when the
     page is still. Each new glyph scrambles before settling into place. */
  var stream = document.getElementById('codeStream');
  if (stream && !prefersReduced) {
    var SOURCE = [
      '// build secure',
      'function build() {',
      '  let idea = true;',
      '  let plan = code(idea);',
      '  let result = automate(plan);',
      '  return scale(result);',
      '}',
      '',
      '// automate everything',
      'function automate(plan) {',
      '  // scripts. workflows. systems.',
      '  return efficiency.max();',
      '}',
      '',
      '// scale the impact',
      'function scale(result) {',
      '  // do more with less',
      '  return growth.infinite();',
      '}',
      '',
      '// engineered, not generated',
      'async function review(draft) {',
      '  // ai drafts. engineers decide.',
      '  await test(draft);',
      '  return quality.verified();',
      '}',
      '',
      '// stonerabbit mindset',
      '// solve real problems',
      '// ship fast',
      '// repeat',
      ''
    ];

    var GLYPHS = '01<>{}[]/\\|=+*&%$#@!?abcdefxyz'; // matrix scramble set
    var TOKEN = /(\/\/.*$)|('[^']*')|(\b(?:function|async|await|let|const|return|new|if|else|for|while|true|false|null)\b)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*(?=\s*\())|([{}();=.,:+\-<>[\]])/g;

    function esc(s) {
      return s.replace(/[&<>]/g, function (c) {
        return c === '&' ? '&amp;' : c === '<' ? '&lt;' : '&gt;';
      });
    }

    function highlight(src) {
      var out = '', last = 0, m;
      TOKEN.lastIndex = 0;
      while ((m = TOKEN.exec(src)) !== null) {
        out += esc(src.slice(last, m.index));
        var cls = m[1] ? 'c-com' : m[2] ? 'c-str' : m[3] ? 'c-kw'
                : m[4] ? 'c-num' : m[5] ? 'c-fn' : 'c-pun';
        out += '<span class="' + cls + '">' + esc(m[0]) + '</span>';
        last = m.index + m[0].length;
      }
      return out + esc(src.slice(last));
    }

    var srcIndex = 0;    // which SOURCE line we're typing
    var charIndex = 0;   // how far into it
    var headTicks = 0;   // frames the newest glyph keeps scrambling
    var budget = 0;      // characters owed, fed by scrolling
    var lastY = window.scrollY;
    var lastFrame = 0;
    var line = null;
    var maxLines = 0;

    function measure() {
      var rail = document.querySelector('.code-rail');
      if (!rail) return;
      var lh = parseFloat(getComputedStyle(stream).lineHeight) || 24;
      maxLines = Math.max(4, Math.floor(rail.clientHeight / lh));
    }
    measure();
    window.addEventListener('resize', measure);

    function retire(el) {
      el.style.height = el.offsetHeight + 'px';
      el.classList.add('out');
      requestAnimationFrame(function () { el.style.height = '0px'; });
      setTimeout(function () { el.remove(); }, 520);
    }

    function trim() {
      // count only live lines — retiring ones are already collapsing
      var live = stream.querySelectorAll('.code-line:not(.out)');
      for (var i = 0; i + maxLines < live.length; i++) retire(live[i]);
    }

    function newLine() {
      line = document.createElement('div');
      line.className = 'code-line';
      if (SOURCE[srcIndex] === '') {
        line.classList.add('spacer');
        line.innerHTML = '&nbsp;';
      }
      stream.appendChild(line);
      trim();
    }

    function render() {
      if (!line || line.classList.contains('spacer')) return;
      var text = SOURCE[srcIndex];
      var sub = text.slice(0, charIndex);
      var html;
      if (headTicks > 0 && sub.length) {
        var glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        html = highlight(sub.slice(0, -1)) + '<span class="c-head">' + esc(glyph) + '</span>';
      } else {
        html = highlight(sub);
      }
      if (charIndex < text.length) html += '<span class="caret"></span>';
      line.innerHTML = html;
    }

    function advance() {
      var text = SOURCE[srcIndex];
      if (line === null) newLine();

      if (text === '' || charIndex >= text.length) {
        // Settle the last glyph before leaving, or the finished line keeps
        // its scramble character forever.
        headTicks = 0;
        render();
        srcIndex = (srcIndex + 1) % SOURCE.length;
        charIndex = 0;
        line = null;
        newLine();
        render();
        return;
      }
      charIndex++;
      headTicks = 3;
      render();
    }

    window.addEventListener('scroll', function () {
      var delta = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      budget = Math.min(budget + delta * 0.32, 180); // cap so a fling can't dump the whole file
    }, { passive: true });

    function frame(ts) {
      var dt = lastFrame ? Math.min((ts - lastFrame) / 1000, 0.1) : 0;
      lastFrame = ts;

      budget += dt * 9; // idle drip

      var emitted = 0;
      while (budget >= 1 && emitted < 6) { // clamp per-frame work
        budget -= 1;
        advance();
        emitted++;
      }

      if (!emitted && headTicks > 0) {
        headTicks--;      // flickers through glyphs, then settles into the real character
        render();
      }

      requestAnimationFrame(frame);
    }

    /* Start with a screenful already "written" — otherwise a visitor who
       doesn't scroll stares at an empty column while it drips out. */
    function seed(count) {
      for (var i = 0; i < count; i++) {
        var text = SOURCE[srcIndex];
        var el = document.createElement('div');
        el.className = 'code-line';
        el.style.animation = 'none'; // these were never "typed", so don't fade them in
        if (text === '') {
          el.classList.add('spacer');
          el.innerHTML = '&nbsp;';
        } else {
          el.innerHTML = highlight(text);
        }
        stream.appendChild(el);
        srcIndex = (srcIndex + 1) % SOURCE.length;
      }
      charIndex = 0;
      line = null;
    }

    seed(Math.floor(maxLines * 0.6));
    newLine();
    render();
    requestAnimationFrame(frame);
  }

  /* ---- Current year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
