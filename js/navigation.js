(function () {
  var header = document.getElementById("site-header");
  var mainContent = document.getElementById("main-content");
  var burger = document.getElementById("burger");
  var mobileMenu = document.getElementById("mobile-menu");
  var menuIcon = document.getElementById("burger-menu");
  var closeIcon = document.getElementById("burger-close");
  var menuLinks = Array.prototype.slice.call(mobileMenu.querySelectorAll("a"));

  function onScroll() {
    header.classList.toggle("header--scrolled", window.scrollY > 8);
  }

  function isMenuOpen() {
    return mobileMenu.classList.contains("mobile-menu--open");
  }

  function updateMenuIcons(isOpen) {
    menuIcon.hidden = isOpen;
    closeIcon.hidden = !isOpen;
  }

  function openMenu() {
    mobileMenu.classList.add("mobile-menu--open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Sluit menu");
    document.body.classList.add("menu-open");
    mainContent.inert = true;
    mainContent.setAttribute("aria-hidden", "true");
    updateMenuIcons(true);
    header.classList.add("header--scrolled");
    menuLinks[0].focus();
  }

  function closeMenu(restoreFocus) {
    mobileMenu.classList.remove("mobile-menu--open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("menu-open");
    mainContent.inert = false;
    mainContent.removeAttribute("aria-hidden");
    updateMenuIcons(false);
    onScroll();

    if (restoreFocus !== false) {
      burger.focus();
    }
  }

  function trapFocus(event) {
    if (!isMenuOpen() || event.key !== "Tab" || menuLinks.length < 2) {
      return;
    }

    var firstLink = menuLinks[0];
    var lastLink = menuLinks[menuLinks.length - 1];

    if (event.shiftKey && document.activeElement === firstLink) {
      event.preventDefault();
      lastLink.focus();
    } else if (!event.shiftKey && document.activeElement === lastLink) {
      event.preventDefault();
      firstLink.focus();
    }
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  burger.addEventListener("click", function () {
    if (isMenuOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (!isMenuOpen()) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }

    trapFocus(event);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768 && isMenuOpen()) {
      closeMenu(false);
    }
  });
})();
