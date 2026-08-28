// Embodi AI — site interactions
document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Auto-swap: drop a logo file into /images/ to replace the text mark everywhere ----------------
     Every ".brand" link on every page ships with a hidden <img class="logo-img"> next to the
     text/dot mark. On load, the site probes a small list of common logo filenames in /images/;
     the first one that actually exists is used, the text mark is hidden, and the image is shown.
     If none of these files are present, the text/dot logo keeps showing — no code changes needed,
     just upload a file with one of the names below. */
  var LOGO_CANDIDATES = ['images/logo.svg', 'images/logo.png', 'images/logo.webp', 'images/logo.jpg'];
  (function autoSwapLogo() {
    var brands = document.querySelectorAll('.brand');
    if (!brands.length) return;
    var i = 0;
    function tryNext() {
      if (i >= LOGO_CANDIDATES.length) return;
      var url = LOGO_CANDIDATES[i++];
      var probe = new Image();
      probe.onload = function () {
        brands.forEach(function (brand) {
          var img = brand.querySelector('.logo-img');
          if (img) img.src = url;
          brand.classList.add('logo-active');
        });
      };
      probe.onerror = tryNext;
      probe.src = url;
    }
    tryNext();
  })();

  /* Drop profile-1/2/3.webp, .png or .jpg into /images to replace demo testimonial portraits. */
  (function autoSwapTestimonialProfiles() {
    document.querySelectorAll('.testi-avatar[data-profile]').forEach(function (avatar) {
      var img = avatar.querySelector('img');
      var base = avatar.dataset.profile;
      var candidates = ['images/' + base + '.webp', 'images/' + base + '.png', 'images/' + base + '.jpg', 'images/' + base + '.jpeg'];
      var i = 0;
      function tryNext() {
        if (i >= candidates.length) return;
        var url = candidates[i++];
        var probe = new Image();
        probe.onload = function () { if (img) img.src = url; };
        probe.onerror = tryNext;
        probe.src = url;
      }
      tryNext();
    });
  })();

  /* Nav shrink on scroll */
  var nav = document.querySelector('.nav');
  function onScroll() {
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
    toggle.addEventListener('click', function () { links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------- GIF / WebM auto-replace ----------------
     Drop a same-named .gif or .webm next to any referenced .mp4 (e.g. hero-bg.mp4 ->
     hero-bg.gif or hero-bg.webm) and it will be used automatically — gif takes
     precedence as the lightest option, then webm, then the original mp4. */
  function gifUrlFor(mp4Url) { return mp4Url.replace(/\.mp4(\?.*)?$/i, '.gif$1'); }
  function webmUrlFor(mp4Url) { return mp4Url.replace(/\.mp4(\?.*)?$/i, '.webm$1'); }

  function trySwapVideoToGif(videoEl, mp4Url, onNoGif) {
    var gifUrl = gifUrlFor(mp4Url);
    var probe = new Image();
    probe.onload = function () {
      var img = document.createElement('img');
      img.src = gifUrl;
      img.className = 'gif-media';
      img.alt = '';
      videoEl.replaceWith(img);
    };
    probe.onerror = function () { if (onNoGif) onNoGif(); };
    probe.src = gifUrl;
  }

  function loadVideoSources(videoEl, mp4Url) {
    videoEl.querySelectorAll('source').forEach(function (s) { s.remove(); });
    var webmSource = document.createElement('source');
    webmSource.type = 'video/webm';
    webmSource.src = webmUrlFor(mp4Url);
    var mp4Source = document.createElement('source');
    mp4Source.type = 'video/mp4';
    mp4Source.src = mp4Url;
    videoEl.appendChild(webmSource);
    videoEl.appendChild(mp4Source);
    videoEl.load();
    videoEl.play().catch(function () {});
  }

  /* Hero background video: try gif, else webm+mp4 with graceful poster fallback */
  var heroVideo = document.querySelector('#hero-video');
  var heroFallbackImg = document.querySelector('#hero-video-fallback');
  if (heroVideo) {
    var heroMp4 = 'videos/hero-bg.mp4';
    trySwapVideoToGif(heroVideo, heroMp4, function () {
      loadVideoSources(heroVideo, heroMp4);
      heroVideo.addEventListener('error', function () { heroVideo.style.display = 'none'; }, true);
      heroVideo.addEventListener('loadeddata', function () { if (heroFallbackImg) heroFallbackImg.style.display = 'none'; });
    });
  }

  /* Showcase tabs */
  var tabs = document.querySelectorAll('.showcase-tab');
  var showcaseMediaWrap = document.querySelector('.showcase-media');
  var captionTitle = document.querySelector('.showcase-caption h3');
  var captionBody = document.querySelector('.showcase-caption p');

  function setShowcaseMedia(mp4Url, posterUrl) {
    if (!showcaseMediaWrap) return;
    showcaseMediaWrap.innerHTML = '';
    var probe = new Image();
    var gifUrl = gifUrlFor(mp4Url);
    probe.onload = function () {
      var img = document.createElement('img');
      img.src = gifUrl;
      img.className = 'gif-media';
      img.alt = '';
      showcaseMediaWrap.appendChild(img);
    };
    probe.onerror = function () {
      var video = document.createElement('video');
      video.autoplay = true; video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'auto';
      if (posterUrl) video.poster = posterUrl;
      showcaseMediaWrap.appendChild(video);
      loadVideoSources(video, mp4Url);
    };
    probe.src = gifUrl;
  }

  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        if (captionTitle) captionTitle.textContent = tab.dataset.title || '';
        if (captionBody) captionBody.textContent = tab.dataset.desc || '';
        if (tab.dataset.src) setShowcaseMedia(tab.dataset.src, tab.dataset.poster);
      });
    });
    /* initialize first tab through the same gif/webm-aware path */
    var activeTab = document.querySelector('.showcase-tab.active') || tabs[0];
    if (activeTab && activeTab.dataset.src) setShowcaseMedia(activeTab.dataset.src, activeTab.dataset.poster);
  }

  /* Testimonials carousel */
  var slides = document.querySelectorAll('.testi-slide');
  var dotsWrap = document.querySelector('.testi-dots');
  var testiPrev = document.querySelector('.testi-prev');
  var testiNext = document.querySelector('.testi-next');
  var current = 0;
  var autoplayTimer;
  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach(function (s, idx) { s.classList.toggle('active', idx === current); });
    if (dotsWrap) {
      dotsWrap.querySelectorAll('span').forEach(function (d, idx) { d.classList.toggle('active', idx === current); });
    }
  }
  function stopAutoplay() { clearInterval(autoplayTimer); }
  if (slides.length) {
    if (dotsWrap) {
      slides.forEach(function (_, idx) {
        var dot = document.createElement('span');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', function () { show(idx); stopAutoplay(); });
        dotsWrap.appendChild(dot);
      });
    }
    if (testiPrev) testiPrev.addEventListener('click', function () { show(current - 1); stopAutoplay(); });
    if (testiNext) testiNext.addEventListener('click', function () { show(current + 1); stopAutoplay(); });
    if (!reduceMotion) autoplayTimer = setInterval(function () { show(current + 1); }, 6000);
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* Cookie consent */
  var COOKIE_KEY = 'embodi_cookie_consent';
  var banner = document.querySelector('#cookie-banner');
  if (banner) {
    if (!localStorage.getItem(COOKIE_KEY)) {
      setTimeout(function () { banner.classList.add('show'); }, 700);
    }
    var acceptBtn = banner.querySelector('#cookie-accept');
    var declineBtn = banner.querySelector('#cookie-decline');
    if (acceptBtn) acceptBtn.addEventListener('click', function () {
      localStorage.setItem(COOKIE_KEY, 'accepted');
      banner.classList.remove('show');
    });
    if (declineBtn) declineBtn.addEventListener('click', function () {
      localStorage.setItem(COOKIE_KEY, 'declined');
      banner.classList.remove('show');
    });
  }

  /* ---------------- Account creation (client-side demo, no backend) ---------------- */
  var ACCOUNT_KEY = 'embodi_account';
  var registerForm = document.querySelector('#register-form');
  if (registerForm) {
    var registerMsg = document.querySelector('#register-msg');
    var registerSubmitBtn = registerForm.querySelector('button[type="submit"]');

    var registerFields = [
      { id: 'name', errorId: 'name-error', empty: 'Enter your full name.' },
      { id: 'email2', errorId: 'email2-error', empty: 'Enter your work email.' },
      { id: 'company', errorId: 'company-error', empty: 'Enter your company name.' },
      { id: 'password2', errorId: 'password2-error', empty: 'Create a password.' }
    ];

    function setFieldError(field, message) {
      var error = document.querySelector('#' + field.errorId);
      field.input.classList.toggle('input-error', Boolean(message));
      field.input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (error) error.textContent = message;
    }

    registerFields.forEach(function (field) {
      field.input = document.querySelector('#' + field.id);
      field.input.addEventListener('input', function () { setFieldError(field, ''); });
      field.input.addEventListener('blur', function () {
        if (!field.input.value.trim()) setFieldError(field, field.empty);
      });
    });

    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;
      registerFields.forEach(function (field) {
        var value = field.input.value.trim();
        var message = '';
        if (!value) message = field.empty;
        else if (field.id === 'email2' && !field.input.validity.valid) message = 'Enter a valid work email.';
        else if (field.id === 'password2' && field.input.value.length < 8) message = 'Password must be at least 8 characters.';
        setFieldError(field, message);
        if (message && !firstInvalid) firstInvalid = field.input;
      });

      if (firstInvalid) {
        registerMsg.textContent = 'Please complete the highlighted fields.';
        registerMsg.classList.remove('success');
        registerMsg.classList.add('show', 'error');
        firstInvalid.focus();
        return;
      }

      var account = {
        name: registerForm.querySelector('#name').value.trim(),
        email: registerForm.querySelector('#email2').value.trim(),
        password: registerForm.querySelector('#password2').value,
        company: registerForm.querySelector('#company').value.trim(),
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
      registerSubmitBtn.disabled = true;
      registerMsg.textContent = 'Account created — redirecting to log in…';
      registerMsg.classList.remove('error');
      registerMsg.classList.add('show', 'success');
      setTimeout(function () { window.location.href = 'login.html'; }, 900);
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
      var valid = account && account.email && account.email.toLowerCase() === enteredEmail && account.password === enteredPassword;
      if (!valid) {
        loginMsg.textContent = account
          ? 'Incorrect email or password.'
          : 'No account found. Please create an account first.';
        loginMsg.classList.remove('success');
        loginMsg.classList.add('show', 'error');
        return;
      }
      loginMsg.textContent = 'Welcome back — redirecting…';
      loginMsg.classList.remove('error');
      loginMsg.classList.add('show', 'success');
      setTimeout(function () { window.location.href = 'index.html'; }, 900);
    });
  }
});
