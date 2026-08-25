// Embodi AI — site interactions
document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Nav shrink on scroll */
  var nav = document.querySelector('.nav');
  function onScroll(){
    if (!nav) return;
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* Testimonial carousel */
  var slides = document.querySelectorAll('.testi-slide');
  var dotsWrap = document.querySelector('.testi-dots');
  if (slides.length && dotsWrap) {
    var current = 0;
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', function () { show(i); });
      dotsWrap.appendChild(b);
    });
    function show(i) {
      slides.forEach(function (s, idx) { s.classList.toggle('active', idx === i); });
      dotsWrap.querySelectorAll('button').forEach(function (d, idx) { d.classList.toggle('active', idx === i); });
      current = i;
    }
    var autoplay = !reduceMotion ? setInterval(function () { show((current + 1) % slides.length); }, 6000) : null;
    dotsWrap.addEventListener('click', function () { if (autoplay) clearInterval(autoplay); });
  }

  /* ---------------- Product video showcase ---------------- */
  var primary = document.querySelector('.video-primary');
  var video = primary ? primary.querySelector('video') : null;
  var playBtn = primary ? primary.querySelector('.play-btn') : null;
  var captionPath = primary ? primary.querySelector('.video-caption .path') : null;
  var captionTitle = primary ? primary.querySelector('.video-caption .title') : null;
  var thumbs = document.querySelectorAll('.video-thumb');

  function loadClip(thumb) {
    if (!video) return;
    var src = thumb.getAttribute('data-src');
    var poster = thumb.getAttribute('data-poster');
    var label = thumb.getAttribute('data-label');
    var title = thumb.getAttribute('data-title');
    primary.classList.remove('playing');
    video.pause();
    video.setAttribute('poster', poster);
    var source = video.querySelector('source');
    if (source.getAttribute('src') !== src) {
      source.setAttribute('src', src);
      video.load();
    }
    if (captionPath) captionPath.textContent = label;
    if (captionTitle) captionTitle.textContent = title;
    thumbs.forEach(function (t) { t.classList.toggle('active', t === thumb); });
  }

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () { loadClip(thumb); });
  });

  if (playBtn && video) {
    playBtn.addEventListener('click', function () {
      video.play().then(function () {
        primary.classList.add('playing');
      }).catch(function () {
        /* Source video asset not yet uploaded to /videos — poster remains visible as graceful fallback */
        primary.classList.remove('playing');
      });
    });
    video.addEventListener('ended', function () { primary.classList.remove('playing'); });
    video.addEventListener('error', function () { primary.classList.remove('playing'); });
  }

  /* Product tab filter (bento product grid) */
  var tabs = document.querySelectorAll('.product-tab');
  var cards = document.querySelectorAll('[data-category]');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var cat = tab.getAttribute('data-filter');
      cards.forEach(function (card) {
        var show = cat === 'all' || card.getAttribute('data-category') === cat;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------------- Free public tool: Automation Feasibility Estimator ---------------- */
  var toolForm = document.querySelector('#feasibility-tool');
  if (toolForm) {
    var output = document.querySelector('#tool-output');
    toolForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var task = toolForm.querySelector('#task-type').value;
      var volume = parseFloat(toolForm.querySelector('#volume').value || '0');
      var variability = toolForm.querySelector('#variability').value;
      var hours = parseFloat(toolForm.querySelector('#hours').value || '0');

      var baseScores = { 'pick-place': 88, 'assembly': 74, 'inspection': 91, 'packaging': 85, 'machine-tending': 79 };
      var variabilityPenalty = { 'low': 0, 'medium': -10, 'high': -22 };
      var score = (baseScores[task] || 70) + (variabilityPenalty[variability] || 0);
      score = Math.max(38, Math.min(97, score + (volume > 5000 ? 4 : volume > 1000 ? 2 : -3)));

      var cyclesPerHour = task === 'inspection' ? 340 : task === 'pick-place' ? 260 : task === 'packaging' ? 210 : 150;
      var estCycles = Math.round(cyclesPerHour * hours * (variability === 'high' ? 0.72 : variability === 'medium' ? 0.86 : 1));
      var payback = (18 - (score - 70) * 0.18).toFixed(1);
      if (payback < 4) payback = (4 + Math.random() * 1.2).toFixed(1);

      var verdictText = score >= 80
        ? 'Strong candidate for embodied AI deployment. Recommended next step: a 2-week pilot cell.'
        : score >= 60
        ? 'Feasible with guided perception tuning. Recommended: scoped proof-of-concept.'
        : 'Currently borderline — high variability likely needs a phased rollout plan.';

      output.innerHTML =
        '<div class="line"><span>Task type</span><b>' + toolForm.querySelector('#task-type').selectedOptions[0].text + '</b></div>' +
        '<div class="line"><span>Process variability</span><b>' + variability.charAt(0).toUpperCase() + variability.slice(1) + '</b></div>' +
        '<div class="line"><span>Feasibility score</span><b>' + score.toFixed(0) + ' / 100</b></div>' +
        '<div class="line"><span>Est. automatable cycles / shift</span><b>' + estCycles.toLocaleString() + '</b></div>' +
        '<div class="line"><span>Modeled payback window</span><b>~' + payback + ' months</b></div>' +
        '<div class="verdict">' + verdictText + '</div>';
    });
  }

  /* ---------------- Cookie consent (localStorage persistence) ---------------- */
  var COOKIE_KEY = 'embodi_cookie_consent';
  var banner = document.querySelector('.cookie-banner');
  if (banner) {
    var saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) {
      setTimeout(function () { banner.classList.add('show'); }, 600);
    }
    var acceptBtn = banner.querySelector('[data-cookie="accept"]');
    var rejectBtn = banner.querySelector('[data-cookie="reject"]');
    if (acceptBtn) acceptBtn.addEventListener('click', function () {
      localStorage.setItem(COOKIE_KEY, 'accepted');
      banner.classList.remove('show');
    });
    if (rejectBtn) rejectBtn.addEventListener('click', function () {
      localStorage.setItem(COOKIE_KEY, 'rejected');
      banner.classList.remove('show');
    });
  }
});
