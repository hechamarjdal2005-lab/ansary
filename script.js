/* ==========================================================================
   ANSARY PARFUM — INTERACTIONS GÉNÉRALES
   Navigation mobile, animations au scroll, compte à rebours, boutique
   (filtres + recherche + tri), rendu des produits et formulaire de contact.
   ========================================================================== */

(function () {
  "use strict";

  var CATEGORIES = window.ANSARY_CATEGORIES || {};
  var PRODUCTS = window.PRODUCTS || [];
  var revealObserver = null;
  var observedReveals = new WeakSet();

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalize(value) {
    return String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function formatPrice(value) {
    return value + " DH";
  }

  /* ------------------------------------------------------------------------
     NAVIGATION
     ------------------------------------------------------------------------ */
  function initNavigation() {
    var toggle = qs("[data-nav-toggle]");
    var nav = qs("#siteNav");
    if (!toggle || !nav) return;

    function setOpen(open) {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    }

    toggle.addEventListener("click", function () {
      setOpen(!document.body.classList.contains("nav-open"));
    });

    qsa(".nav-link", nav).forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 900 && document.body.classList.contains("nav-open")) {
        setOpen(false);
      }
    });

    var currentPage = window.location.pathname.split("/").pop() || "index.html";
    qsa(".nav-link").forEach(function (link) {
      var href = link.getAttribute("href") || "";
      link.removeAttribute("aria-current");
      if (href === currentPage || (currentPage === "" && href === "index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initHeader() {
    var header = qs(".site-header");
    if (!header) return;

    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------------
     RÉVÉLATIONS AU SCROLL
     ------------------------------------------------------------------------ */
  function initReveals() {
    var elements = qsa(".reveal:not(.is-visible)");

    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (element) {
        element.classList.add("is-visible");
      });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );
    }

    elements.forEach(function (element) {
      if (observedReveals.has(element)) return;
      observedReveals.add(element);
      if (element.getAttribute("data-delay")) {
        element.style.transitionDelay = element.getAttribute("data-delay") + "ms";
      }
      revealObserver.observe(element);
    });
  }

  /* ------------------------------------------------------------------------
     COMPTE À REBOURS — DIMANCHE À MINUIT
     ------------------------------------------------------------------------ */
  function initCountdown() {
    var containers = qsa("[data-countdown]");
    if (containers.length === 0) return;

    function getDeadline() {
      var now = new Date();
      var deadline = new Date(now);
      var daysUntilSunday = (7 - now.getDay()) % 7;
      deadline.setDate(now.getDate() + daysUntilSunday);
      deadline.setHours(23, 59, 59, 999);
      if (deadline.getTime() <= now.getTime()) {
        deadline.setDate(deadline.getDate() + 7);
      }
      return deadline;
    }

    function pad(value) {
      return String(value).padStart(2, "0");
    }

    function update() {
      var deadline = getDeadline();
      var diff = Math.max(0, deadline.getTime() - Date.now());
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var minutes = Math.floor((diff % 3600000) / 60000);
      var seconds = Math.floor((diff % 60000) / 1000);

      containers.forEach(function (container) {
        var values = {
          days: pad(days),
          hours: pad(hours),
          minutes: pad(minutes),
          seconds: pad(seconds)
        };
        Object.keys(values).forEach(function (unit) {
          var node = container.querySelector('[data-countdown-unit="' + unit + '"]');
          if (node) node.textContent = values[unit];
        });
      });
    }

    update();
    window.setInterval(update, 1000);
  }

  /* ------------------------------------------------------------------------
     PRODUITS
     ------------------------------------------------------------------------ */
  function productCard(product, index) {
    var category = CATEGORIES[product.category] || { short: "Parfum" };
    var badge = product.badge
      ? '<span class="badge" data-badge="' + escapeHtml(product.badge) + '">' + escapeHtml(product.badge) + "</span>"
      : "";
    var oldPrice = product.oldPrice
      ? '<span class="product-old">' + formatPrice(product.oldPrice) + "</span>"
      : "";
    var delay = (index % 3) * 70;

    return (
      '<article class="product-card reveal" data-delay="' + delay + '" data-product-id="' + escapeHtml(product.id) + '">' +
      '  <div class="product-media">' +
      "    " + badge +
      '    <img src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.name) + ' — Ansary Parfum" width="400" height="500" loading="lazy" />' +
      "  </div>" +
      '  <div class="product-body">' +
      '    <p class="product-cat">' + escapeHtml(category.short) + "</p>" +
      '    <h3 class="product-name">' + escapeHtml(product.name) + "</h3>" +
      '    <p class="product-notes" title="' + escapeHtml(product.inspired || "") + '">' + escapeHtml(product.notes || "") + "</p>" +
      '    <div class="product-price-row">' +
      '      <span class="product-price">' + formatPrice(product.price) + "</span>" +
      "      " + oldPrice +
      "    </div>" +
      '    <button type="button" class="btn-add" data-add-to-cart="' + escapeHtml(product.id) + '" aria-label="Ajouter ' + escapeHtml(product.name) + ' au panier">' +
      '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>' +
      "      <span>Ajouter au panier</span>" +
      "    </button>" +
      "  </div>" +
      "</article>"
    );
  }

  function renderHomeProducts() {
    var container = qs("[data-bestsellers]");
    if (!container) return;

    var bestsellers = PRODUCTS.filter(function (product) {
      return product.bestseller;
    }).slice(0, 6);

    container.innerHTML = bestsellers
      .map(function (product, index) {
        return productCard(product, index);
      })
      .join("");
  }

  function initShop() {
    var grid = qs("[data-shop-grid]");
    if (!grid) return;

    var searchInput = qs("[data-shop-search]");
    var sortSelect = qs("[data-shop-sort]");
    var countEl = qs("[data-shop-count]");
    var labelEl = qs("[data-shop-label]");
    var filterButtons = qsa("[data-filter]");
    var params = new URLSearchParams(window.location.search);
    var state = {
      category: params.get("category") || "all",
      search: "",
      sort: "featured"
    };

    if (!CATEGORIES[state.category]) state.category = "all";

    function syncFilterButtons() {
      filterButtons.forEach(function (button) {
        var isActive = button.getAttribute("data-filter") === state.category;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }

    function matchesSearch(haystack, search) {
      if (!search) return true;

      if (search.length <= 3 && search.indexOf(" ") === -1) {
        var escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp("(^|[^a-z0-9])" + escaped).test(haystack);
      }

      return haystack.indexOf(search) !== -1;
    }

    function filteredProducts() {
      var search = normalize(state.search.trim());
      var list = PRODUCTS.filter(function (product) {
        var matchesCategory =
          state.category === "all" || product.category === state.category;
        if (!matchesCategory) return false;
        if (!search) return true;

        var haystack = normalize(
          [
            product.name,
            product.notes,
            product.inspired,
            (CATEGORIES[product.category] || {}).label,
            (CATEGORIES[product.category] || {}).short
          ].join(" ")
        );
        return matchesSearch(haystack, search);
      });

      if (state.sort === "price-asc") {
        list = list.slice().sort(function (a, b) {
          return a.price - b.price;
        });
      } else if (state.sort === "price-desc") {
        list = list.slice().sort(function (a, b) {
          return b.price - a.price;
        });
      } else if (state.sort === "name-asc") {
        list = list.slice().sort(function (a, b) {
          return a.name.localeCompare(b.name, "fr");
        });
      }

      return list;
    }

    function updateUrl() {
      var nextUrl = window.location.pathname;
      if (state.category !== "all") {
        nextUrl += "?category=" + encodeURIComponent(state.category);
      }
      window.history.replaceState({}, "", nextUrl);
    }

    function render() {
      var list = filteredProducts();

      if (countEl) countEl.textContent = String(list.length);
      if (labelEl) {
        labelEl.textContent =
          state.category === "all"
            ? "Toute la collection"
            : (CATEGORIES[state.category] || {}).label;
      }

      if (list.length === 0) {
        grid.innerHTML =
          '<div class="empty-state" style="grid-column:1/-1">' +
          "  <h3>Aucun parfum trouvé</h3>" +
          "  <p>Essayez un autre mot-clé ou réinitialisez les filtres.</p>" +
          '  <button type="button" class="btn btn-outline btn-sm" data-reset-shop style="margin-top:16px">Réinitialiser la recherche</button>' +
          "</div>";
      } else {
        grid.innerHTML = list
          .map(function (product, index) {
            return productCard(product, index);
          })
          .join("");
      }

      initReveals();
    }

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        state.category = button.getAttribute("data-filter");
        syncFilterButtons();
        updateUrl();
        render();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.search = searchInput.value;
        render();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        state.sort = sortSelect.value;
        render();
      });
    }

    grid.addEventListener("click", function (event) {
      var reset = event.target.closest("[data-reset-shop]");
      if (!reset) return;
      state.category = "all";
      state.search = "";
      state.sort = "featured";
      if (searchInput) searchInput.value = "";
      if (sortSelect) sortSelect.value = "featured";
      syncFilterButtons();
      updateUrl();
      render();
    });

    updateUrl();
    syncFilterButtons();
    render();
  }

  /* ------------------------------------------------------------------------
     FORMULAIRE DE CONTACT (SANS BACKEND)
     ------------------------------------------------------------------------ */
  function initContactForm() {
    var form = qs("[data-contact-form]");
    if (!form) return;

    var success = qs("[data-form-success]", form);

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (success) {
        success.classList.remove("is-visible");
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (success) {
        success.classList.add("is-visible");
        success.setAttribute("role", "status");
        success.textContent =
          "Merci pour votre message. Votre demande a bien été enregistrée — notre équipe vous répondra très vite. Pour une réponse immédiate, contactez-nous sur WhatsApp.";
      }

      form.reset();
    });
  }

  /* ------------------------------------------------------------------------
     DIVERS
     ------------------------------------------------------------------------ */
  function initYear() {
    qsa("[data-year]").forEach(function (element) {
      element.textContent = String(new Date().getFullYear());
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.documentElement.classList.add("js");
    initHeader();
    initNavigation();
    renderHomeProducts();
    initShop();
    initReveals();
    initCountdown();
    initContactForm();
    initYear();
  });
})();
