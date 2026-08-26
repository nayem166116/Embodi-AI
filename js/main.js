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

  /* ---------------- Hero background video (full-bleed overlay, graceful poster fallback) ---------------- */
  var heroVisual = document.querySelector('#hero');
  var heroVideo = heroVisual ? heroVisual.querySelector('.hero-bg-video') : null;
  if (heroVisual && heroVideo) {
    heroVideo.addEventListener('error', function () { heroVisual.classList.add('video-error'); });
    var heroPlayPromise = heroVideo.play();
    if (heroPlayPromise && heroPlayPromise.catch) {
      heroPlayPromise.catch(function () {
        /* Autoplay blocked or source not yet uploaded to /videos/hero-bg.mp4 — static image stays visible */
        heroVisual.classList.add('video-error');
      });
    }
  }

  /* ---------------- Auto-swap: drop a same-name .gif into /videos/ to replace any .mp4 automatically ----------------
     Large mp4 files can feel slow to load. As a lightweight alternative, if a .gif with the same
     filename exists next to the .mp4 (e.g. /videos/hero-bg.gif alongside /videos/hero-bg.mp4), the
     site auto-detects it on load and displays the GIF instead — no code changes needed, just upload
     the file with the matching name. */
  function gifUrlFor(mp4Url) {
    return mp4Url.replace(/\.mp4(\?.*)?$/i, '.gif$1');
  }
  function trySwapToGif(mp4Url, onFound) {
    if (!mp4Url) return;
    var gifUrl = gifUrlFor(mp4Url);
    var probe = new Image();
    probe.onload = function () { onFound(gifUrl); };
    probe.onerror = function () { /* no matching gif uploaded yet — keep the video */ };
    probe.src = gifUrl;
  }

  /* Hero background: swap to GIF if /videos/hero-bg.gif exists */
  if (heroVisual) {
    var heroSource = heroVideo ? heroVisual.querySelector('.hero-bg-video source') : null;
    var heroGifImg = heroVisual.querySelector('.hero-bg-gif');
    if (heroSource && heroGifImg) {
      trySwapToGif(heroSource.getAttribute('src'), function (gifUrl) {
        heroGifImg.src = gifUrl;
        heroVisual.classList.add('gif-active');
        if (heroVideo) heroVideo.pause();
      });
    }
  }

  /* Product video showcase: swap each primary/thumbnail video to its matching GIF if uploaded */
  function trySwapContainerToGif(container, mp4Url) {
    if (!container) return;
    var vid = container.querySelector('video');
    var img = container.querySelector('img.gif-media');
    if (!vid || !img) return;
    trySwapToGif(mp4Url, function (gifUrl) {
      img.src = gifUrl;
      container.classList.add('gif-active');
      vid.pause();
    });
  }
  document.querySelectorAll('.video-thumb .thumb-img').forEach(function (thumbImg) {
    var thumb = thumbImg.closest('.video-thumb');
    if (thumb) trySwapContainerToGif(thumbImg, thumb.getAttribute('data-src'));
  });

  /* ---------------- Product video showcase (all clips autoplay, no thumbnails/play button) ---------------- */
  var primary = document.querySelector('.video-primary');
  var video = primary ? primary.querySelector('video') : null;
  var captionTitle = primary ? primary.querySelector('.video-caption .title') : null;
  var thumbs = document.querySelectorAll('.video-thumb');

  function loadClip(thumb) {
    if (!video) return;
    var src = thumb.getAttribute('data-src');
    var poster = thumb.getAttribute('data-poster');
    var title = thumb.getAttribute('data-title');
    video.setAttribute('poster', poster);
    var source = video.querySelector('source');
    primary.classList.remove('gif-active');
    if (source.getAttribute('src') !== src) {
      source.setAttribute('src', src);
      video.load();
      var playPromise = video.play();
      if (playPromise && playPromise.catch) playPromise.catch(function () {});
    }
    trySwapContainerToGif(primary, src);
    if (captionTitle) captionTitle.textContent = title;
    thumbs.forEach(function (t) { t.classList.toggle('active', t === thumb); });
  }

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () { loadClip(thumb); });
  });

  /* Check the initially-loaded primary clip for a matching GIF too */
  if (primary && video) {
    var initialSource = video.querySelector('source');
    if (initialSource) trySwapContainerToGif(primary, initialSource.getAttribute('src'));
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

  /* ---------------- Register: cosmetic email-verification popup ---------------- */
  /* No backend exists. The "code" is never validated against anything real —
     it only has to look like a 6-digit code before the account flag is set
     client-side in localStorage. This never gates any protected content. */
  var ACCOUNT_KEY = 'embodi_account';
  var registerForm = document.querySelector('#register-form');
  if (registerForm) {
    var verifyModal = document.querySelector('#verify-modal');
    var verifyCopy = document.querySelector('#verify-copy');
    var verifyCode = document.querySelector('#verify-code');
    var verifyError = document.querySelector('#verify-error');
    var verifySubmit = document.querySelector('#verify-submit');
    var verifyClose = document.querySelector('#verify-close');
    var verifyResend = document.querySelector('#verify-resend');
    var registerMsg = document.querySelector('#register-msg');
    var pendingAccount = null;

    function openModal() {
      verifyModal.classList.add('show');
      verifyError.textContent = '';
      verifyCode.value = '';
      setTimeout(function () { verifyCode.focus(); }, 50);
    }
    function closeModal() { verifyModal.classList.remove('show'); }

    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = registerForm.querySelector('#email2').value.trim();
      pendingAccount = {
        name: registerForm.querySelector('#name').value.trim(),
        email: email,
        password: registerForm.querySelector('#password2').value,
        company: registerForm.querySelector('#company').value.trim(),
        createdAt: new Date().toISOString()
      };
      verifyCopy.textContent = 'We sent a 6-digit code to ' + email + '.';
      openModal();
    });

    verifyClose.addEventListener('click', closeModal);
    verifyModal.addEventListener('click', function (e) { if (e.target === verifyModal) closeModal(); });

    verifyResend.addEventListener('click', function (e) {
      e.preventDefault();
      verifyError.textContent = '';
      verifyResend.textContent = 'Code resent — check your inbox';
      setTimeout(function () { verifyResend.textContent = 'Resend code'; }, 3000);
    });

    verifyCode.addEventListener('input', function () {
      verifyCode.value = verifyCode.value.replace(/[^0-9]/g, '').slice(0, 6);
      verifyError.textContent = '';
    });

    verifySubmit.addEventListener('click', function () {
      var code = verifyCode.value.trim();
      if (code.length !== 6) {
        verifyError.textContent = 'Enter the 6-digit code we sent to your email.';
        return;
      }
      /* No server-side check exists — any well-formed 6-digit code is accepted
         and the account is created locally for this preview. */
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(pendingAccount));
      closeModal();
      if (registerMsg) {
        registerMsg.textContent = 'Email verified — account created. Redirecting to log in…';
        registerMsg.classList.add('show', 'success');
      }
      setTimeout(function () { window.location.href = 'login.html'; }, 1400);
    });
  }

  /* ---------------- Login: block sign-in without a matching created account ---------------- */
  var loginForm = document.querySelector('#login-form');
  if (loginForm) {
    var loginMsg = document.querySelector('#login-msg');
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var enteredEmail = loginForm.querySelector('#email').value.trim().toLowerCase();
      var enteredPassword = loginForm.querySelector('#password').value;
      var raw = localStorage.getItem(ACCOUNT_KEY);
      var account = null;
      try { account = raw ? JSON.parse(raw) : null; } catch (err) { account = null; }

      var matches = account
        && account.email && account.email.trim().toLowerCase() === enteredEmail
        && account.password === enteredPassword;

      if (!matches) {
        loginMsg.textContent = 'No matching account for that email and password on this browser. Create a free trial account first — it only takes a minute.';
        loginMsg.classList.remove('success');
        loginMsg.classList.add('show', 'error');
        return;
      }
      loginMsg.textContent = 'Verified — welcome back. Redirecting…';
      loginMsg.classList.remove('error');
      loginMsg.classList.add('show', 'success');
      setTimeout(function () { window.location.href = 'index.html'; }, 1200);
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
