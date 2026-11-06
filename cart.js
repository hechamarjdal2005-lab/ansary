/* ==========================================================================
   ANSARY PARFUM — PANIER (localStorage) & COMMANDE WHATSAPP
   --------------------------------------------------------------------------
   IMPORTANT : remplacez le numéro ci-dessous par le vrai WhatsApp de la
   boutique, au format international sans "+" ni espaces.
   Exemple : 212612345678
   ========================================================================== */

(function () {
  "use strict";

  var WHATSAPP_NUMBER = "212600000000"; // À REMPLACER
  var STORAGE_KEY = "ansary_cart_v1";
  var PACK_SIZE = 4;
  var PACK_PRICE = 200;
  var CURRENCY = "DH";
  var MAX_QTY = 99;

  var cart = loadCart();
  var lastFocused = null;
  var toastTimer = null;

  var icons = {
    bag:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
    whatsapp:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 15L2 22l5.15-1.5A9.9 9.9 0 1 0 12.04 2Zm5.78 14.2c-.24.68-1.4 1.3-1.94 1.35-.54.05-1.05.24-3.54-.78-2.99-1.23-4.9-4.28-5.05-4.48-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.59-.37.79-.37h.56c.18 0 .42-.03.65.5.24.56.81 1.97.88 2.11.07.14.12.3.02.5-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.35 1.46.3.15.47.12.64-.07.17-.2.73-.85.93-1.14.2-.3.4-.24.66-.15.27.1 1.68.79 1.97.94.3.15.5.22.57.34.07.13.07.75-.17 1.42Z"/></svg>'
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getProduct(id) {
    return window.PRODUCTS.filter(function (product) {
      return product.id === id;
    })[0];
  }

  function loadCart() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map(function (entry) {
          var qty = parseInt(entry.qty, 10);
          if (!entry.id || isNaN(qty) || qty < 1) return null;
          return { id: entry.id, qty: Math.min(qty, MAX_QTY) };
        })
        .filter(function (entry) {
          return entry && getProduct(entry.id);
        });
    } catch (error) {
      return [];
    }
  }

  function saveCart() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      /* stockage indisponible : le panier reste fonctionnel sur la page */
    }
  }

  function formatPrice(value) {
    return value + " " + CURRENCY;
  }

  function cartCount() {
    return cart.reduce(function (total, entry) {
      return total + entry.qty;
    }, 0);
  }

  function eligiblePrices() {
    var prices = [];
    cart.forEach(function (entry) {
      var product = getProduct(entry.id);
      if (!product || product.category === "packs") return;
      for (var i = 0; i < entry.qty; i += 1) {
        prices.push(product.price);
      }
    });
    return prices.sort(function (a, b) {
      return b - a;
    });
  }

  function computeTotals() {
    var subtotal = cart.reduce(function (total, entry) {
      var product = getProduct(entry.id);
      return product ? total + product.price * entry.qty : total;
    }, 0);

    var prices = eligiblePrices();
    var packs = Math.floor(prices.length / PACK_SIZE);
    var packValue = 0;

    for (var i = 0; i < packs * PACK_SIZE; i += 1) {
      packValue += prices[i];
    }

    var discount = Math.max(0, packValue - packs * PACK_PRICE);

    return {
      subtotal: subtotal,
      discount: discount,
      total: subtotal - discount,
      packs: packs,
      eligible: prices.length,
      remainder: prices.length % PACK_SIZE
    };
  }

  function buildWhatsAppMessage(totals) {
    var lines = [
      "Bonjour Ansary Parfum,",
      "",
      "Je souhaite passer commande :",
      ""
    ];

    cart.forEach(function (entry) {
      var product = getProduct(entry.id);
      if (!product) return;
      lines.push(
        "- " + entry.qty + " x " + product.name + " : " + formatPrice(product.price * entry.qty)
      );
    });

    lines.push("");
    lines.push("Sous-total : " + formatPrice(totals.subtotal));

    if (totals.discount > 0) {
      lines.push("Remise Pack 4 Parfums : -" + formatPrice(totals.discount));
    }

    lines.push("Total : " + formatPrice(totals.total));
    lines.push("");
    lines.push("Merci de me confirmer la disponibilité et les modalités de livraison.");

    return lines.join("\n");
  }

  /* ------------------------------------------------------------------------
     INJECTION DU PANNEAU PANIER SUR TOUTES LES PAGES
     ------------------------------------------------------------------------ */
  function injectDrawer() {
    if (document.getElementById("cartDrawer")) return;

    var wrapper = document.createElement("div");
    wrapper.innerHTML =
      '<div class="cart-overlay" id="cartOverlay"></div>' +
      '<aside class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle" aria-hidden="true">' +
      '  <div class="cart-head">' +
      '    <div>' +
      '      <p class="eyebrow">Votre sélection</p>' +
      '      <h2 id="cartTitle">Panier <span data-cart-title-count></span></h2>' +
      "    </div>" +
      '    <button class="cart-close" type="button" data-cart-close aria-label="Fermer le panier">&times;</button>' +
      "  </div>" +
      '  <div class="cart-progress" id="cartProgress">' +
      '    <p class="cart-progress-text" id="cartProgressText"></p>' +
      '    <div class="progress-track"><div class="progress-fill" id="cartProgressFill"></div></div>' +
      "  </div>" +
      '  <div class="cart-items" id="cartItems"></div>' +
      '  <div class="cart-empty" id="cartEmpty">' +
      "    " + icons.bag +
      "    <h3>Votre panier est vide</h3>" +
      "    <p>Découvrez nos parfums et composez votre coffret. Le Pack 4 est à 200 DH.</p>" +
      '    <a class="btn btn-gold btn-sm" href="shop.html" data-cart-close-link>Découvrir la collection</a>' +
      "  </div>" +
      '  <div class="cart-foot" id="cartFoot" hidden>' +
      '    <div class="cart-totals" id="cartTotals"></div>' +
      '    <a class="btn btn-gold cart-whatsapp" id="cartWhatsapp" href="#" target="_blank" rel="noopener">Commander via WhatsApp ' + icons.whatsapp + "</a>" +
      '    <button class="cart-continue" type="button" data-cart-close>Continuer mes achats</button>' +
      '    <p class="cart-foot-note">Paiement à la livraison · Livraison Maroc &amp; Dubaï</p>' +
      "  </div>" +
      "</aside>" +
      '<div class="toast" id="cartToast" role="status" aria-live="polite"></div>';

    while (wrapper.firstChild) {
      document.body.appendChild(wrapper.firstChild);
    }
  }

  function updateBadges(pulse) {
    var count = cartCount();
    var badges = document.querySelectorAll("[data-cart-count]");

    Array.prototype.forEach.call(badges, function (badge) {
      badge.textContent = count > 99 ? "99+" : String(count);
      badge.classList.toggle("is-empty", count === 0);
      if (pulse && count > 0) {
        badge.classList.remove("pulse");
        void badge.offsetWidth;
        badge.classList.add("pulse");
      }
    });
  }

  function renderCart() {
    injectDrawer();

    var itemsEl = document.getElementById("cartItems");
    var emptyEl = document.getElementById("cartEmpty");
    var footEl = document.getElementById("cartFoot");
    var progressEl = document.getElementById("cartProgress");
    var progressText = document.getElementById("cartProgressText");
    var progressFill = document.getElementById("cartProgressFill");
    var totalsEl = document.getElementById("cartTotals");
    var titleCount = document.querySelector("[data-cart-title-count]");
    var whatsappEl = document.getElementById("cartWhatsapp");
    var totals = computeTotals();
    var count = cartCount();

    if (titleCount) {
      titleCount.textContent = count > 0 ? "(" + count + ")" : "";
    }

    if (cart.length === 0) {
      itemsEl.innerHTML = "";
      emptyEl.classList.add("is-visible");
      footEl.hidden = true;
      progressEl.hidden = true;
      updateBadges(false);
      return;
    }

    emptyEl.classList.remove("is-visible");
    footEl.hidden = false;
    progressEl.hidden = false;

    itemsEl.innerHTML = cart
      .map(function (entry) {
        var product = getProduct(entry.id);
        if (!product) return "";
        return (
          '<article class="cart-item" data-cart-item="' + escapeHtml(product.id) + '">' +
          '  <img class="cart-item-image" src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.name) + '" loading="lazy" />' +
          '  <div class="cart-item-info">' +
          '    <h3>' + escapeHtml(product.name) + "</h3>" +
          '    <p class="cart-item-notes">' + escapeHtml(product.notes || "") + "</p>" +
          '    <p class="cart-item-price">' + formatPrice(product.price) + "</p>" +
          '    <div class="cart-qty" aria-label="Quantité pour ' + escapeHtml(product.name) + '">' +
          '      <button type="button" data-cart-action="decrease" data-id="' + escapeHtml(product.id) + '" aria-label="Réduire la quantité de ' + escapeHtml(product.name) + '">&minus;</button>' +
          "      <span>" + entry.qty + "</span>" +
          '      <button type="button" data-cart-action="increase" data-id="' + escapeHtml(product.id) + '" aria-label="Augmenter la quantité de ' + escapeHtml(product.name) + '">+</button>' +
          "    </div>" +
          '    <button type="button" class="cart-remove" data-cart-action="remove" data-id="' + escapeHtml(product.id) + '">Supprimer</button>' +
          "  </div>" +
          '  <div class="cart-line-total">' + formatPrice(product.price * entry.qty) + "</div>" +
          "</article>"
        );
      })
      .join("");

    var hasPackProduct = cart.some(function (entry) {
      var product = getProduct(entry.id);
      return product && product.category === "packs";
    });

    var progressMessage = "";
    if (totals.eligible === 0) {
      progressMessage = hasPackProduct
        ? "Votre coffret est sélectionné. Ajoutez <strong>4 parfums à l'unité</strong> pour un <strong>Pack 4 supplémentaire à 200 DH</strong>."
        : "Ajoutez <strong>4 parfums</strong> pour profiter du Pack 4 à <strong>200 DH</strong>.";
      progressFill.style.width = "0%";
    } else if (totals.remainder === 0) {
      progressMessage =
        "<strong>" + totals.packs + " × Pack 4</strong> appliqué" + (totals.packs > 1 ? "s" : "") +
        " — vous économisez <strong>" + formatPrice(totals.discount) + "</strong>.";
      progressFill.style.width = "100%";
    } else {
      var missing = PACK_SIZE - totals.remainder;
      progressMessage =
        (totals.packs > 0
          ? "<strong>" + totals.packs + " pack" + (totals.packs > 1 ? "s" : "") + " appliqué" + (totals.packs > 1 ? "s" : "") + ".</strong> "
          : "") +
        "Encore <strong>" + missing + " parfum" + (missing > 1 ? "s" : "") + "</strong> pour " +
        (totals.packs > 0 ? "un pack supplémentaire" : "le Pack 4 à 200 DH") + ".";
      progressFill.style.width = Math.round((totals.remainder / PACK_SIZE) * 100) + "%";
    }
    progressText.innerHTML = progressMessage;

    var totalsMarkup =
      '<div class="cart-totals-row"><span>Sous-total</span> <strong>' +
      formatPrice(totals.subtotal) +
      "</strong></div>";

    if (totals.discount > 0) {
      totalsMarkup +=
        '<div class="cart-totals-row cart-totals-row--discount"><span>Remise Pack 4' +
        (totals.packs > 1 ? " ×" + totals.packs : "") +
        "</span> <strong>-" +
        formatPrice(totals.discount) +
        "</strong></div>";
    }

    totalsMarkup +=
      '<div class="cart-totals-row cart-totals-row--total"><span>Total</span> <strong>' +
      formatPrice(totals.total) +
      "</strong></div>";

    totalsEl.innerHTML = totalsMarkup;

    whatsappEl.href =
      "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(buildWhatsAppMessage(totals));

    updateBadges(false);
  }

  function showToast(message) {
    var toast = document.getElementById("cartToast");
    if (!toast) return;

    toast.innerHTML = icons.check + "<span></span>";
    toast.querySelector("span").textContent = message;
    toast.classList.add("is-visible");

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2800);
  }

  function addToCart(id) {
    var product = getProduct(id);
    if (!product) return;

    var existing = cart.filter(function (entry) {
      return entry.id === id;
    })[0];

    if (existing) {
      existing.qty = Math.min(existing.qty + 1, MAX_QTY);
    } else {
      cart.push({ id: id, qty: 1 });
    }

    saveCart();
    renderCart();
    updateBadges(true);
    showToast(product.name + " ajouté au panier");
  }

  function changeQty(id, delta) {
    var entry = cart.filter(function (item) {
      return item.id === id;
    })[0];
    if (!entry) return;

    entry.qty += delta;

    if (entry.qty < 1) {
      cart = cart.filter(function (item) {
        return item.id !== id;
      });
    } else if (entry.qty > MAX_QTY) {
      entry.qty = MAX_QTY;
    }

    saveCart();
    renderCart();
  }

  function removeItem(id) {
    cart = cart.filter(function (entry) {
      return entry.id !== id;
    });
    saveCart();
    renderCart();
  }

  /* ------------------------------------------------------------------------
     OUVERTURE / FERMETURE
     ------------------------------------------------------------------------ */
  function openCart() {
    injectDrawer();
    var drawer = document.getElementById("cartDrawer");
    var overlay = document.getElementById("cartOverlay");
    var navToggle = document.querySelector("[data-nav-toggle]");
    lastFocused = document.activeElement;

    if (document.body.classList.contains("nav-open")) {
      document.body.classList.remove("nav-open");
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Ouvrir le menu");
      }
    }

    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-open");

    var closeButton = drawer.querySelector("[data-cart-close]");
    if (closeButton) {
      window.setTimeout(function () {
        closeButton.focus();
      }, 120);
    }
  }

  function closeCart() {
    var drawer = document.getElementById("cartDrawer");
    var overlay = document.getElementById("cartOverlay");
    if (!drawer || !drawer.classList.contains("is-open")) return;

    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function trapFocus(event) {
    var drawer = document.getElementById("cartDrawer");
    if (!drawer || !drawer.classList.contains("is-open") || event.key !== "Tab") return;

    var focusable = drawer.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    var visible = Array.prototype.filter.call(focusable, function (element) {
      return element.offsetParent !== null;
    });
    if (visible.length === 0) return;

    var first = visible[0];
    var last = visible[visible.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ------------------------------------------------------------------------
     ÉVÉNEMENTS GLOBAUX
     ------------------------------------------------------------------------ */
  document.addEventListener("click", function (event) {
    var addButton = event.target.closest("[data-add-to-cart]");
    if (addButton) {
      addToCart(addButton.getAttribute("data-add-to-cart"));
      return;
    }

    var openButton = event.target.closest("[data-cart-open]");
    if (openButton) {
      event.preventDefault();
      openCart();
      return;
    }

    var closeTrigger = event.target.closest("[data-cart-close], [data-cart-close-link]");
    if (closeTrigger) {
      closeCart();
      return;
    }

    var actionButton = event.target.closest("[data-cart-action]");
    if (actionButton) {
      var id = actionButton.getAttribute("data-id");
      var action = actionButton.getAttribute("data-cart-action");
      if (action === "increase") changeQty(id, 1);
      if (action === "decrease") changeQty(id, -1);
      if (action === "remove") removeItem(id);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeCart();
    }
    trapFocus(event);
  });

  document.addEventListener("DOMContentLoaded", function () {
    injectDrawer();
    renderCart();

    var overlay = document.getElementById("cartOverlay");
    if (overlay) {
      overlay.addEventListener("click", closeCart);
    }

    var whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
    Array.prototype.forEach.call(whatsappLinks, function (link) {
      link.href = "https://wa.me/" + WHATSAPP_NUMBER;
      link.target = "_blank";
      link.rel = "noopener";
    });
  });

  window.addEventListener("storage", function (event) {
    if (event.key === STORAGE_KEY) {
      cart = loadCart();
      renderCart();
    }
  });

  window.AnsaryCart = {
    add: addToCart,
    open: openCart,
    close: closeCart,
    count: cartCount
  };
})();
