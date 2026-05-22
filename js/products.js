/**
 * ═══════════════════════════════════════════════════════════════════
 * Jay Goga Enterprises — Products Page Controller
 * ═══════════════════════════════════════════════════════════════════
 * Modular product management system handling rendering, filtering,
 * detail modal, scroll reveal, and responsive interactions.
 *
 * @version  2.0.0
 * ═══════════════════════════════════════════════════════════════════
 */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     CONFIGURATION
     ═══════════════════════════════════════════ */

  var CONFIG = {
    selectors: {
      grid:        '#productsGrid',
      filter:      '.product-filter',
      reveal:      '.section-reveal',
      nav:         '#mainNav',
      scrollBtn:   '#scrollTopBtn',
      year:        '#year',
      navCollapse: '#navbarNav'
    },
    thresholds: {
      scroll:    400,
      navScroll: 40
    },
    observer: {
      rootMargin: '0px 0px -8% 0px',
      threshold:  0.08
    }
  };

  /* Fallback SVG shown when a product image fails to load */
  var FALLBACK_IMAGE = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 500" fill="none">' +
    '<rect width="700" height="500" fill="#0f1419"/>' +
    '<circle cx="350" cy="220" r="48" stroke="#C5A059" stroke-width="2" fill="none" opacity=".35"/>' +
    '<path d="M335 220h30M350 205v30" stroke="#C5A059" stroke-width="1.5" opacity=".25"/>' +
    '<text x="350" y="310" text-anchor="middle" fill="#C5A059" opacity=".45" font-size="16" ' +
    'font-family="Poppins,sans-serif">Image Unavailable</text></svg>'
  );


  /* ═══════════════════════════════════════════
     CATEGORY DEFINITIONS
     ═══════════════════════════════════════════ */

  var CATEGORIES = {
    cnc: {
      label:        'CNC Machined Components',
      intro:        'High-precision CNC machined components engineered for industrial applications.',
      process:      'CNC turning, precision machining, threading, and inspection',
      material:     'Stainless steel, mild steel, alloy steel, brass, and application-specific metals',
      applications: 'Shafts, sleeves, bushes, collars, inserts, guide pins, fixtures, and OEM assemblies'
    },
    vmc: {
      label:        'VMC Machined Parts',
      intro:        'High-accuracy VMC machined parts built for fixtures, mounting, and industrial assemblies.',
      process:      'VMC milling, drilling, tapping, pocketing, and multi-face machining',
      material:     'Aluminum, mild steel, tool steel, stainless steel, and customer-specified alloys',
      applications: 'Fixture bodies, mounting blocks, machine interfaces, tooling, and automation systems'
    },
    laser: {
      label:        'Laser Cut Components',
      intro:        'Precision laser-cut and fabricated components prepared for industrial fitment and assembly.',
      process:      'Laser cutting, profile preparation, fabrication support, deburring, and machining support',
      material:     'Mild steel, stainless steel, aluminum, sheet metal, and plate materials',
      applications: 'Brackets, mounting plates, fabricated profiles, machine guards, and structural interfaces'
    },
    nozzles: {
      label:        'Nozzles & Flow Components',
      intro:        'Precision nozzles and flow-control components for industrial dispensing and process systems.',
      process:      'CNC turning, precision drilling, fine finishing, and flow-path machining',
      material:     'Stainless steel, brass, aluminum, engineered plastics, and flow-grade materials',
      applications: 'Spray systems, liquid handling, dispensing equipment, coolant flow, and process machinery'
    },
    custom: {
      label:        'Custom Engineering Components',
      intro:        'Custom precision components developed around drawing requirements, fit, function, and production needs.',
      process:      'Drawing review, CNC/VMC machining, fabrication support, finishing, and inspection',
      material:     'As per customer drawing, functional requirement, and operating environment',
      applications: 'OEM parts, special purpose machinery, replacements, prototypes, and production programs'
    }
  };

  var CATEGORY_ORDER = ['cnc', 'vmc', 'laser', 'nozzles', 'custom'];


  /* ═══════════════════════════════════════════
     PRODUCT DATA
     ═══════════════════════════════════════════ */

  var PRODUCTS = [
    // ── CNC Machined Components (21) ──────────────────────────
    { category: 'cnc', name: 'CNC Alignment Pin',          desc: 'High-precision machined industrial component.',   image: 'product/cnc-part-01.jpg' },
    { category: 'cnc', name: 'Threaded Insert',             desc: 'CNC machined for engineering applications.',      image: 'product/cnc-part-02.jpg' },
    { category: 'cnc', name: 'Industrial Collar',           desc: 'Durable precision turned component.',             image: 'product/cnc-part-03.jpg' },
    { category: 'cnc', name: 'Precision Mechanical Shaft',  desc: 'Industrial-grade machining solution.',            image: 'product/cnc-part-04.jpg' },
    { category: 'cnc', name: 'Industrial Guide Pin',        desc: 'Custom engineered CNC component.',                image: 'product/cnc-part-05.jpg' },
    { category: 'cnc', name: 'CNC Spacer Sleeve',           desc: 'CNC machined for engineering applications.',      image: 'product/cnc-part-06.jpg' },
    { category: 'cnc', name: 'CNC Alignment Pin',           desc: 'High-precision machined industrial component.',   image: 'product/cnc-part-07.jpg' },
    { category: 'cnc', name: 'Precision Turned Bush',       desc: 'Durable precision turned component.',             image: 'product/cnc-part-08.jpg' },
    { category: 'cnc', name: 'CNC Spacer Sleeve',           desc: 'CNC machined for engineering applications.',      image: 'product/cnc-part-09.jpg' },
    { category: 'cnc', name: 'Threaded Insert',             desc: 'Custom engineered CNC component.',                image: 'product/cnc-part-10.jpg' },
    { category: 'cnc', name: 'Precision Mechanical Shaft',  desc: 'Industrial-grade machining solution.',            image: 'product/cnc-part-11.jpg' },
    { category: 'cnc', name: 'CNC Spacer Sleeve',           desc: 'Durable precision turned component.',             image: 'product/cnc-part-12.jpg' },
    { category: 'cnc', name: 'Precision CNC Shaft',         desc: 'High-precision machined industrial component.',   image: 'product/cnc-part-13.jpg' },
    { category: 'cnc', name: 'Threaded Insert',             desc: 'Custom engineered CNC component.',                image: 'product/cnc-part-14.jpg' },
    { category: 'cnc', name: 'Precision Turned Bush',       desc: 'Durable precision turned component.',             image: 'product/cnc-part-15.jpg' },
    { category: 'cnc', name: 'Industrial Guide Pin',        desc: 'Industrial-grade machining solution.',            image: 'product/cnc-part-16.jpg' },
    { category: 'cnc', name: 'CNC Spacer Sleeve',           desc: 'CNC machined for engineering applications.',      image: 'product/cnc-part-17.jpg' },
    { category: 'cnc', name: 'Precision CNC Shaft',         desc: 'High-precision machined industrial component.',   image: 'product/cnc-part-18.jpg' },
    { category: 'cnc', name: 'CNC Alignment Pin',           desc: 'High-precision machined industrial component.',   image: 'product/cnc-part-19.jpg' },
    { category: 'cnc', name: 'Threaded Insert',             desc: 'Custom engineered CNC component.',                image: 'product/cnc-part-20.jpg' },
    { category: 'cnc', name: 'Industrial Guide Pin',        desc: 'Industrial-grade machining solution.',            image: 'product/cnc-part-21.jpg' },

    // ── VMC Machined Parts (5) ────────────────────────────────
    { category: 'vmc', name: 'Precision Fixture Part',            desc: 'High-accuracy industrial machining part.',  image: 'product/vmc-part-01.jpg' },
    { category: 'vmc', name: 'VMC Machined Block',                desc: 'Precision VMC machined component.',         image: 'product/vmc-part-02.jpg' },
    { category: 'vmc', name: 'Precision Fixture Part',            desc: 'Engineered for industrial applications.',   image: 'product/vmc-part-03.jpg' },
    { category: 'vmc', name: 'Multi-Surface Machined Component',  desc: 'Custom VMC machining solution.',            image: 'product/vmc-part-04.jpg' },
    { category: 'vmc', name: 'Industrial Mounting Block',         desc: 'Precision VMC machined component.',         image: 'product/vmc-part-05.jpg' },

    // ── Laser Cut Components (4) ──────────────────────────────
    { category: 'laser', name: 'Laser Cut Bracket',         desc: 'High-accuracy fabricated part.',        image: 'product/laser-part-01.jpg' },
    { category: 'laser', name: 'Laser Cut Mounting Plate',  desc: 'Industrial laser cutting solution.',    image: 'product/laser-part-02.jpg' },
    { category: 'laser', name: 'Precision Sheet Metal Part', desc: 'Custom sheet metal component.',        image: 'product/laser-part-03.jpg' },
    { category: 'laser', name: 'CNC Fabricated Part',       desc: 'Custom sheet metal component.',         image: 'product/laser-part-04.jpg' },

    // ── Nozzles & Flow Components (25) ────────────────────────
    { category: 'nozzles', name: 'Industrial Dispensing Nozzle',  desc: 'Industrial dispensing solution.',       image: 'product/nozzle-01.jpg' },
    { category: 'nozzles', name: 'CNC Machined Flow Nozzle',     desc: 'CNC machined nozzle component.',        image: 'product/nozzle-02.jpg' },
    { category: 'nozzles', name: 'Precision Spray Nozzle',       desc: 'Precision flow control component.',     image: 'product/nozzle-03.jpg' },
    { category: 'nozzles', name: 'Stainless Steel Nozzle Tip',   desc: 'High-accuracy nozzle part.',            image: 'product/nozzle-04.jpg' },
    { category: 'nozzles', name: 'CNC Machined Flow Nozzle',     desc: 'CNC machined nozzle component.',        image: 'product/nozzle-05.jpg' },
    { category: 'nozzles', name: 'Precision Spray Nozzle',       desc: 'Precision flow control component.',     image: 'product/nozzle-06.jpg' },
    { category: 'nozzles', name: 'Stainless Steel Nozzle Tip',   desc: 'High-accuracy nozzle part.',            image: 'product/nozzle-07.jpg' },
    { category: 'nozzles', name: 'Precision Spray Nozzle',       desc: 'Precision flow control component.',     image: 'product/nozzle-08.jpg' },
    { category: 'nozzles', name: 'Industrial Dispensing Nozzle',  desc: 'Industrial dispensing solution.',       image: 'product/nozzle-09.jpg' },
    { category: 'nozzles', name: 'Stainless Steel Nozzle Tip',   desc: 'High-accuracy nozzle part.',            image: 'product/nozzle-10.jpg' },
    { category: 'nozzles', name: 'Industrial Dispensing Nozzle',  desc: 'Industrial dispensing solution.',       image: 'product/nozzle-11.jpg' },
    { category: 'nozzles', name: 'Precision Spray Nozzle',       desc: 'Precision flow control component.',     image: 'product/nozzle-12.jpg' },
    { category: 'nozzles', name: 'CNC Machined Flow Nozzle',     desc: 'CNC machined nozzle component.',        image: 'product/nozzle-13.jpg' },
    { category: 'nozzles', name: 'Precision Spray Nozzle',       desc: 'Precision flow control component.',     image: 'product/nozzle-14.jpg' },
    { category: 'nozzles', name: 'Industrial Dispensing Nozzle',  desc: 'Industrial dispensing solution.',       image: 'product/nozzle-15.jpg' },
    { category: 'nozzles', name: 'CNC Machined Flow Nozzle',     desc: 'CNC machined nozzle component.',        image: 'product/nozzle-16.jpg' },
    { category: 'nozzles', name: 'Stainless Steel Nozzle Tip',   desc: 'High-accuracy nozzle part.',            image: 'product/nozzle-17.jpg' },
    { category: 'nozzles', name: 'Industrial Dispensing Nozzle',  desc: 'Industrial dispensing solution.',       image: 'product/nozzle-18.jpg' },
    { category: 'nozzles', name: 'Industrial Dispensing Nozzle',  desc: 'Industrial dispensing solution.',       image: 'product/nozzle-19.jpg' },
    { category: 'nozzles', name: 'CNC Machined Flow Nozzle',     desc: 'CNC machined nozzle component.',        image: 'product/nozzle-20.jpg' },
    { category: 'nozzles', name: 'Precision Spray Nozzle',       desc: 'Precision flow control component.',     image: 'product/nozzle-21.jpg' },
    { category: 'nozzles', name: 'Stainless Steel Nozzle Tip',   desc: 'High-accuracy nozzle part.',            image: 'product/nozzle-22.jpg' },
    { category: 'nozzles', name: 'CNC Machined Flow Nozzle',     desc: 'CNC machined nozzle component.',        image: 'product/nozzle-23.jpg' },
    { category: 'nozzles', name: 'Precision Spray Nozzle',       desc: 'Precision flow control component.',     image: 'product/nozzle-24.jpg' },
    { category: 'nozzles', name: 'Industrial Dispensing Nozzle',  desc: 'Industrial dispensing solution.',       image: 'product/nozzle-25.jpg' },

    // ── Custom Engineering Components (4) ─────────────────────
    { category: 'custom', name: 'Industrial Custom Part',              desc: 'Custom industrial engineering component.',   image: 'product/custom-part-01.jpg' },
    { category: 'custom', name: 'Special Purpose Component',           desc: 'Special-purpose engineered component.',     image: 'product/custom-part-02.jpg' },
    { category: 'custom', name: 'Precision Engineering Solution Part', desc: 'Precision manufactured industrial part.',   image: 'product/custom-part-03.jpg' },
    { category: 'custom', name: 'OEM Precision Component',             desc: 'OEM machining solution.',                   image: 'product/custom-part-04.jpg' }
  ];


  /* ═══════════════════════════════════════════
     UTILITIES
     ═══════════════════════════════════════════ */

  /**
   * Escape HTML entities to prevent XSS in dynamic content.
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(str).replace(/[&<>"']/g, function (c) { return map[c]; });
  }

  /**
   * Throttle a function to fire at most once per `delay` ms.
   * @param {Function} fn
   * @param {number} delay
   * @returns {Function}
   */
  function throttle(fn, delay) {
    var last = 0;
    return function () {
      var now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn.apply(this, arguments);
      }
    };
  }


  /* ═══════════════════════════════════════════
     PAGE UTILITIES
     ═══════════════════════════════════════════ */

  /** Display current year in the footer copyright */
  function initYearDisplay() {
    var el = document.querySelector(CONFIG.selectors.year);
    if (el) el.textContent = new Date().getFullYear();
  }

  /** Toggle nav shadow on scroll */
  function initNavScroll() {
    var nav = document.querySelector(CONFIG.selectors.nav);
    if (!nav) return;

    function update() {
      nav.classList.toggle('nav-scrolled', window.scrollY > CONFIG.thresholds.navScroll);
    }

    window.addEventListener('scroll', throttle(update, 100), { passive: true });
    update();
  }

  /** Show / hide scroll-to-top button */
  function initScrollToTop() {
    var btn = document.querySelector(CONFIG.selectors.scrollBtn);
    if (!btn) return;

    window.addEventListener('scroll', throttle(function () {
      btn.classList.toggle('visible', window.scrollY > CONFIG.thresholds.scroll);
    }, 150), { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /** Close mobile nav when a link is tapped */
  function initMobileNavClose() {
    var links = document.querySelectorAll('.navbar .nav-link, .navbar .btn-accent');
    links.forEach(function (el) {
      el.addEventListener('click', function () {
        var collapse = document.querySelector(CONFIG.selectors.navCollapse);
        if (collapse && collapse.classList.contains('show')) {
          bootstrap.Collapse.getOrCreateInstance(collapse).hide();
        }
      });
    });
  }


  /* ═══════════════════════════════════════════
     PRODUCT CARD RENDERER
     ═══════════════════════════════════════════ */

  /**
   * Build HTML string for a single product card.
   * @param {Object} product
   * @returns {string}
   */
  function createProductCard(product) {
    var cat = CATEGORIES[product.category];
    if (!cat) return '';

    var name  = escapeHtml(product.name);
    var desc  = escapeHtml(product.desc);
    var label = escapeHtml(cat.label);
    var image = escapeHtml(product.image);

    return (
      '<div class="col-12 col-md-6 col-lg-4 product-item section-reveal d-flex" data-category="' + product.category + '">' +
        '<article class="product-showcase-card h-100 w-100"' +
          ' data-product="' + name + '"' +
          ' data-category-label="' + label + '"' +
          ' data-image="' + image + '"' +
          ' data-process="' + escapeHtml(cat.process) + '"' +
          ' data-material="' + escapeHtml(cat.material) + '"' +
          ' data-applications="' + escapeHtml(cat.applications) + '"' +
          ' data-description="' + desc + '">' +
          '<div class="product-card-media">' +
            '<img src="' + image + '"' +
              ' alt="' + name + '"' +
              ' width="700" height="500"' +
              ' loading="lazy" decoding="async"' +
              ' sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw">' +
          '</div>' +
          '<div class="product-card-body">' +
            '<span>' + label + '</span>' +
            '<h3>' + name + '</h3>' +
            '<p>' + desc + '</p>' +
            '<div class="product-actions">' +
              '<button class="btn btn-sm btn-outline-light hero-btn-outline product-detail-btn" type="button">View Details</button>' +
              '<a class="btn btn-sm btn-accent" href="#product-inquiry">Request Quote</a>' +
            '</div>' +
          '</div>' +
        '</article>' +
      '</div>'
    );
  }


  /* ═══════════════════════════════════════════
     SECTION RENDERER
     ═══════════════════════════════════════════ */

  /**
   * Render all product category sections into the grid container.
   * Products are grouped by category in the defined order.
   */
  function renderProductSections() {
    var grid = document.querySelector(CONFIG.selectors.grid);
    if (!grid) return;

    var fragment = document.createDocumentFragment();
    var temp = document.createElement('div');

    var html = CATEGORY_ORDER.map(function (key) {
      var cat = CATEGORIES[key];
      if (!cat) return '';

      var items = PRODUCTS.filter(function (p) { return p.category === key; });
      if (items.length === 0) return '';

      var cards = items.map(createProductCard).join('');

      return (
        '<section class="product-category-section section-reveal"' +
          ' data-category-section="' + key + '"' +
          ' aria-labelledby="' + key + '-products-heading">' +
          '<div class="product-category-head">' +
            '<p class="text-accent fw-semibold text-uppercase small mb-2 letter-spacing">' +
              items.length + ' Components</p>' +
            '<h3 id="' + key + '-products-heading">' + escapeHtml(cat.label) + '</h3>' +
            '<p>' + escapeHtml(cat.intro) + '</p>' +
          '</div>' +
          '<div class="row g-4 align-items-stretch products-grid">' + cards + '</div>' +
        '</section>'
      );
    }).join('');

    temp.innerHTML = html;
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }

    grid.innerHTML = '';
    grid.appendChild(fragment);
  }


  /* ═══════════════════════════════════════════
     FILTER SYSTEM
     ═══════════════════════════════════════════ */

  /**
   * Attach click handlers to filter buttons.
   * Toggles category sections and individual product items.
   */
  function initFilters() {
    var buttons  = document.querySelectorAll(CONFIG.selectors.filter);
    var sections = document.querySelectorAll('[data-category-section]');
    var items    = document.querySelectorAll('.product-item');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        // Update active state on all filter buttons
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        // Show / hide category sections
        sections.forEach(function (section) {
          var show = filter === 'all' || section.getAttribute('data-category-section') === filter;
          section.classList.toggle('is-hidden', !show);
        });

        // Show / hide individual product items
        items.forEach(function (item) {
          var show = filter === 'all' || item.getAttribute('data-category') === filter;
          item.classList.toggle('is-hidden', !show);
        });
      });
    });
  }


  /* ═══════════════════════════════════════════
     SCROLL REVEAL (IntersectionObserver)
     ═══════════════════════════════════════════ */

  /**
   * Animate elements into view as user scrolls.
   * Respects prefers-reduced-motion.
   */
  function initScrollReveal() {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealElements = document.querySelectorAll(CONFIG.selectors.reveal);

    if (reduceMotion) {
      revealElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
    } else {

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: CONFIG.observer.rootMargin,
        threshold:  CONFIG.observer.threshold
      });

      revealElements.forEach(function (el) {
        observer.observe(el);
      });
    }
  }


  /* ═══════════════════════════════════════════
     IMAGE ERROR HANDLING
     ═══════════════════════════════════════════ */

  /**
   * Attach error handlers to all product images.
   * Replaces broken images with an SVG fallback.
   */
  function initImageFallbacks() {
    document.querySelectorAll('.product-card-media img').forEach(function (img) {
      img.addEventListener('error', function () {
        this.src = FALLBACK_IMAGE;
        this.alt = 'Image unavailable';
        this.style.objectFit = 'contain';
        this.style.padding = '2rem';
      }, { once: true });
    });

    /* Also handle the intro section image */
    var introImg = document.querySelector('.products-intro-media img');
    if (introImg) {
      introImg.addEventListener('error', function () {
        this.src = FALLBACK_IMAGE;
        this.alt = 'Image unavailable';
        this.style.objectFit = 'contain';
        this.style.padding = '2rem';
      }, { once: true });
    }
  }


  /* ═══════════════════════════════════════════
     PRODUCT DETAIL MODAL
     ═══════════════════════════════════════════ */

  var modalOverlay = null;

  /** Inject modal CSS (runs once, keeps styles self-contained) */
  function injectModalStyles() {
    if (document.getElementById('product-modal-styles')) return;

    var style = document.createElement('style');
    style.id = 'product-modal-styles';
    style.textContent = [
      '.product-modal-overlay{',
        'position:fixed;inset:0;z-index:9999;',
        'display:flex;align-items:center;justify-content:center;',
        'background:rgba(0,0,0,.72);',
        'backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);',
        'opacity:0;visibility:hidden;',
        'transition:opacity .3s ease,visibility .3s ease;',
        'padding:1rem;',
      '}',
      '.product-modal-overlay.is-open{opacity:1;visibility:visible}',
      '.product-modal{',
        'position:relative;',
        'width:100%;max-width:780px;max-height:90vh;',
        'overflow-y:auto;overflow-x:hidden;',
        'border-radius:16px;',
        'background:linear-gradient(160deg,#101923 0%,#102A44 52%,#0c2036 100%);',
        'border:1px solid rgba(255,255,255,.1);',
        'box-shadow:0 32px 80px rgba(0,0,0,.55);',
        'transform:translateY(24px) scale(.96);',
        'transition:transform .35s ease;',
      '}',
      '.product-modal-overlay.is-open .product-modal{',
        'transform:translateY(0) scale(1)',
      '}',
      '.product-modal-close{',
        'position:absolute;top:.75rem;right:.75rem;z-index:2;',
        'width:40px;height:40px;',
        'border:1px solid rgba(255,255,255,.15);border-radius:50%;',
        'background:rgba(0,0,0,.4);',
        'color:#fff;font-size:1.4rem;line-height:1;',
        'cursor:pointer;',
        'display:flex;align-items:center;justify-content:center;',
        'transition:background .2s ease,border-color .2s ease;',
      '}',
      '.product-modal-close:hover{',
        'background:rgba(230,126,34,.9);border-color:transparent',
      '}',
      '.product-modal-img{',
        'width:100%;aspect-ratio:16/10;',
        'object-fit:cover;object-position:center;',
        'display:block;border-radius:16px 16px 0 0;',
      '}',
      '.product-modal-content{padding:1.5rem 1.75rem 1.75rem}',
      '.product-modal-label{',
        'display:inline-block;',
        'padding:.3rem .7rem;margin-bottom:.75rem;',
        'border-radius:999px;',
        'background:rgba(197,160,89,.16);',
        'color:#C5A059;',
        'font-size:.72rem;font-weight:700;',
        'text-transform:uppercase;letter-spacing:.08em;',
      '}',
      '.product-modal-content h3{',
        'color:#fff;font-size:1.35rem;font-weight:700;',
        'margin-bottom:.5rem;font-family:Poppins,sans-serif;',
      '}',
      '.product-modal-content .modal-desc{',
        'color:rgba(255,255,255,.65);font-size:.95rem;margin-bottom:1.25rem',
      '}',
      '.product-modal-specs{',
        'display:grid;gap:.7rem;margin-bottom:1.5rem;',
      '}',
      '.product-modal-spec{',
        'padding:.85rem 1rem;',
        'border-radius:10px;',
        'background:rgba(255,255,255,.04);',
        'border:1px solid rgba(255,255,255,.07);',
      '}',
      '.product-modal-spec strong{',
        'display:block;color:#C5A059;font-size:.72rem;',
        'text-transform:uppercase;letter-spacing:.06em;margin-bottom:.3rem;',
        'font-family:Poppins,sans-serif;',
      '}',
      '.product-modal-spec span{color:rgba(255,255,255,.72);font-size:.88rem}',
      '.product-modal-actions{display:flex;flex-wrap:wrap;gap:.65rem}',
      '.product-modal-actions .btn{min-height:42px}',
      '@media(max-width:575.98px){',
        '.product-modal-content{padding:1.15rem 1rem 1.25rem}',
        '.product-modal-actions .btn{width:100%}',
        '.product-modal-img{aspect-ratio:4/3}',
      '}'
    ].join('');

    document.head.appendChild(style);
  }

  /** Create the modal DOM structure (once) */
  function createModalDOM() {
    if (modalOverlay) return;

    modalOverlay = document.createElement('div');
    modalOverlay.className = 'product-modal-overlay';
    modalOverlay.setAttribute('role', 'dialog');
    modalOverlay.setAttribute('aria-modal', 'true');
    modalOverlay.setAttribute('aria-label', 'Product details');
    modalOverlay.innerHTML =
      '<div class="product-modal">' +
        '<button class="product-modal-close" aria-label="Close details" type="button">&times;</button>' +
        '<img class="product-modal-img" src="" alt="" loading="lazy" decoding="async">' +
        '<div class="product-modal-content">' +
          '<span class="product-modal-label"></span>' +
          '<h3></h3>' +
          '<p class="modal-desc"></p>' +
          '<div class="product-modal-specs"></div>' +
          '<div class="product-modal-actions">' +
            '<a class="btn btn-accent px-4" href="#product-inquiry">Request Quote</a>' +
            '<a class="btn btn-outline-light hero-btn-outline px-4" href="contact.html">Contact Us</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modalOverlay);

    /* Close handlers */
    var closeBtn = modalOverlay.querySelector('.product-modal-close');
    closeBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  /** Open modal with data from a product card */
  function openModal(card) {
    if (!modalOverlay) return;

    var img       = modalOverlay.querySelector('.product-modal-img');
    var label     = modalOverlay.querySelector('.product-modal-label');
    var title     = modalOverlay.querySelector('.product-modal-content h3');
    var desc      = modalOverlay.querySelector('.modal-desc');
    var specsWrap = modalOverlay.querySelector('.product-modal-specs');

    img.src    = card.getAttribute('data-image') || '';
    img.alt    = card.getAttribute('data-product') || '';
    label.textContent = card.getAttribute('data-category-label') || '';
    title.textContent = card.getAttribute('data-product') || '';
    desc.textContent  = card.getAttribute('data-description') || '';

    /* Build specs */
    var specs = [
      { label: 'Process',      value: card.getAttribute('data-process') },
      { label: 'Material',     value: card.getAttribute('data-material') },
      { label: 'Applications', value: card.getAttribute('data-applications') }
    ];

    specsWrap.innerHTML = specs.map(function (s) {
      return (
        '<div class="product-modal-spec">' +
          '<strong>' + escapeHtml(s.label) + '</strong>' +
          '<span>' + escapeHtml(s.value || '—') + '</span>' +
        '</div>'
      );
    }).join('');

    /* Image fallback */
    img.onerror = function () {
      this.src = FALLBACK_IMAGE;
      this.style.objectFit = 'contain';
      this.style.padding = '2rem';
    };

    /* Prevent body scroll */
    document.body.style.overflow = 'hidden';
    modalOverlay.classList.add('is-open');
    modalOverlay.querySelector('.product-modal-close').focus();
  }

  /** Close the modal */
  function closeModal() {
    if (!modalOverlay) return;
    document.body.style.overflow = '';
    modalOverlay.classList.remove('is-open');
  }

  /** Initialize the detail modal system using event delegation */
  function initProductDetailModal() {
    injectModalStyles();
    createModalDOM();

    var grid = document.querySelector(CONFIG.selectors.grid);
    if (!grid) return;

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.product-detail-btn');
      if (!btn) return;

      var card = btn.closest('.product-showcase-card');
      if (card) openModal(card);
    });
  }


  /* ═══════════════════════════════════════════
     INITIALIZATION
     ═══════════════════════════════════════════ */

  function init() {
    /* Page utilities */
    initYearDisplay();
    initNavScroll();
    initScrollToTop();
    initMobileNavClose();

    /* Product system */
    renderProductSections();
    initFilters();
    initScrollReveal();
    initImageFallbacks();
    initProductDetailModal();
  }

  /* Boot — works whether script is loaded sync or deferred */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
