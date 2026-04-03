const state = {
  filter: "all",
  query: "",
  cartCount: 0,
  cartTotal: 0,
  toastTimer: null,
};

const menuCards = [...document.querySelectorAll(".menu-card")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const searchInput = document.querySelector("#menu-search");
const resultsCount = document.querySelector("[data-results-count]");
const cartCount = document.querySelector("[data-cart-count]");
const cartTotal = document.querySelector("[data-cart-total]");
const emptyState = document.querySelector(".empty-state");
const priceButtons = [...document.querySelectorAll(".price-row")];
const toast = document.querySelector(".toast");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const mobileLinks = [...document.querySelectorAll(".mobile-menu a")];
const revealItems = [...document.querySelectorAll(".reveal")];
const menuSection = document.querySelector("#menu");

function formatCurrency(value) {
  return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} тг`;
}

function syncActiveFilter() {
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === state.filter);
  });
}

function applyFilters() {
  let visibleCount = 0;
  const normalizedQuery = state.query.trim().toLowerCase();

  menuCards.forEach((card) => {
    const categoryMatch = state.filter === "all" || card.dataset.category === state.filter;
    const searchText = `${card.dataset.name} ${card.dataset.search}`.toLowerCase();
    const queryMatch = normalizedQuery === "" || searchText.includes(normalizedQuery);
    const visible = categoryMatch && queryMatch;

    card.hidden = !visible;

    if (visible) {
      visibleCount += 1;
    }
  });

  resultsCount.textContent = String(visibleCount);
  emptyState.hidden = visibleCount > 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;

  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

function updateCart(price, label, button) {
  state.cartCount += 1;
  state.cartTotal += price;

  cartCount.textContent = String(state.cartCount);
  cartTotal.textContent = formatCurrency(state.cartTotal);

  button.classList.add("is-added");
  window.setTimeout(() => button.classList.remove("is-added"), 700);
  showToast(`Добавлено: ${label}`);
}

function toggleMobileMenu(forceOpen) {
  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : mobileMenu.hidden;
  mobileMenu.hidden = !shouldOpen;
  menuToggle.setAttribute("aria-expanded", String(shouldOpen));
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    syncActiveFilter();
    applyFilters();

    if (button.classList.contains("category-card")) {
      menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  applyFilters();
});

priceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const price = Number(button.dataset.price);
    const label = button.dataset.item || "Позиция";
    updateCart(price, label, button);
  });
});

menuToggle.addEventListener("click", () => {
  toggleMobileMenu();
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    toggleMobileMenu(false);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealItems.forEach((item) => observer.observe(item));

syncActiveFilter();
applyFilters();
