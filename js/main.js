const categoryBtn = document.querySelector(".category-btn");
const categoryNavList = document.querySelector(".category-nav-list");
const angleIcon = document.querySelector(".angle-icon");
const cartElement = document.querySelector(".cart");
const openCartBtn = document.querySelector(".open-cart");
const closeCartBtn = document.querySelector(".close-cart");
const overlayElement = document.querySelector(".overlay");
const shopMoreBtn = document.querySelector(".shop-more");
const scrollTopBtn = document.querySelector(".scroll-top");
const menuToggle = document.querySelector(".menu-toggle");
const bottomHeader = document.querySelector(".bottom-header");
const favouriteElement = document.querySelector(".favourite");
const openFavBtn = document.querySelector(".open-favourite");
const closeFavBtn = document.querySelector(".close-favourite");
const favShopBtn = document.querySelector(".btn-fav-shop");

if (categoryBtn) {
  categoryBtn.addEventListener("click", function () {
    categoryNavList.classList.toggle("active");
    angleIcon.classList.toggle("rotate");
  });
}

if (openCartBtn) {
  openCartBtn.addEventListener("click", openCart);
}
if (closeCartBtn) {
  closeCartBtn.addEventListener("click", closeCart);
}
if (overlayElement) {
  overlayElement.addEventListener("click", function () {
    closeCart();
    closeFavourite();
  });
}
if (shopMoreBtn) {
  shopMoreBtn.addEventListener("click", closeCart);
}
if (openFavBtn) {
  openFavBtn.addEventListener("click", function () {
    openFavourite();
  });
}
if (closeFavBtn) {
  closeFavBtn.addEventListener("click", closeFavourite);
}
if (favShopBtn) {
  favShopBtn.addEventListener("click", closeFavourite);
}

function openCart() {
  closeFavourite();
  cartElement.classList.add("active");
  if (overlayElement) overlayElement.classList.add("active");
}

function closeCart() {
  cartElement.classList.remove("active");
  if (overlayElement) overlayElement.classList.remove("active");
}

function openFavourite() {
  closeCart();
  renderFavourites();
  favouriteElement.classList.add("active");
  if (overlayElement) overlayElement.classList.add("active");
}

function closeFavourite() {
  favouriteElement.classList.remove("active");
  if (!cartElement.classList.contains("active")) {
    if (overlayElement) overlayElement.classList.remove("active");
  }
}

if (menuToggle) {
  menuToggle.addEventListener("click", function () {
    bottomHeader.classList.toggle("active");
    if (overlayElement) overlayElement.classList.toggle("active");
  });
}

if (scrollTopBtn) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add("active");
    } else {
      scrollTopBtn.classList.remove("active");
    }
  });
  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

let allProducts = [];

fetch("products.json")
  .then(function (response) { return response.json(); })
  .then(function (data) {
    allProducts = data;
    updateCartIconCount();
    syncCartButtonStates();
  })
  .catch(function (err) { console.error("Failed to load products:", err); });

document.addEventListener("click", function (event) {
  var addBtn = event.target.closest(".btn-add-cart");
  if (addBtn) {
    var productId = addBtn.getAttribute("data-id");
    var product = allProducts.find(function (p) { return p.id == productId; });
    if (product) {
      addToCart(product);
      var allMatchingButtons = document.querySelectorAll(
        '.btn-add-cart[data-id="' + productId + '"]'
      );
      allMatchingButtons.forEach(function (btn) {
        btn.classList.add("active");
        btn.innerHTML = ' <i class="fa-solid fa-cart-shopping"></i> Item in cart';
      });
    }
    return;
  }

  var deleteBtn = event.target.closest(".delete-item");
  if (deleteBtn) {
    var productId = deleteBtn.getAttribute("data-id");
    removeFromCart(productId);
  }

  var increaseBtn = event.target.closest(".increase-quantry");
  if (increaseBtn) {
    var productId = increaseBtn.getAttribute("data-id");
    updateQuantity(productId, 1);
  }

  var decreaseBtn = event.target.closest(".decrease-quantry");
  if (decreaseBtn) {
    var productId = decreaseBtn.getAttribute("data-id");
    updateQuantity(productId, -1);
  }

  var favBtn = event.target.closest(".btn-product");
  if (favBtn) {
    var productId = favBtn.getAttribute("data-id");
    if (productId) {
      toggleFavourite(productId, favBtn);
    }
  }

  var removeFavBtn = event.target.closest(".remove-fav");
  if (removeFavBtn) {
    var productId = removeFavBtn.getAttribute("data-id");
    removeFavourite(productId);
  }

  var addCartFavBtn = event.target.closest(".add-to-cart-fav");
  if (addCartFavBtn) {
    var productId = addCartFavBtn.getAttribute("data-id");
    var product = allProducts.find(function (p) { return p.id == productId; });
    if (product) {
      addToCart(product);
      var allMatchingButtons = document.querySelectorAll(
        '.btn-add-cart[data-id="' + productId + '"]'
      );
      allMatchingButtons.forEach(function (btn) {
        btn.classList.add("active");
        btn.innerHTML = ' <i class="fa-solid fa-cart-shopping"></i> Item in cart';
      });
    }
  }
});

function addToCart(product) {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var existingItemIndex = cart.findIndex(function (item) { return item.id === product.id; });

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push(Object.assign({}, product, { quantity: 1 }));
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  openCart();
}

function removeFromCart(productId) {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(function (item) { return item.id != productId; });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();

  var allMatchingButtons = document.querySelectorAll(
    '.btn-add-cart[data-id="' + productId + '"]'
  );
  allMatchingButtons.forEach(function (btn) {
    btn.classList.remove("active");
    btn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> add to cart';
  });
}

function updateQuantity(productId, change) {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var itemIndex = cart.findIndex(function (item) { return item.id == productId; });

  if (itemIndex > -1) {
    cart[itemIndex].quantity += change;

    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);

      var allMatchingButtons = document.querySelectorAll(
        '.btn-add-cart[data-id="' + productId + '"]'
      );
      allMatchingButtons.forEach(function (btn) {
        btn.classList.remove("active");
        btn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> add to cart';
      });
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  var cartItemsContainer = document.getElementById("cart-items");
  var priceCartTotal = document.querySelector(".price-cart-total");
  var countItemCart = document.querySelector(".count-item-cart");
  var countItemHeader = document.querySelector(".count_item_header");

  var cart = JSON.parse(localStorage.getItem("cart")) || [];

  var totalPrice = 0;
  var totalItems = 0;

  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<div class="empty-cart">' +
        '<i class="fa-solid fa-cart-shopping"></i>' +
        "<p>Your cart is empty</p>" +
        "</div>";
    } else {
      cartItemsContainer.innerHTML = "";

      cart.forEach(function (item) {
        totalPrice += item.price * item.quantity;
        totalItems += item.quantity;

        cartItemsContainer.innerHTML +=
          '<div class="item-cart">' +
          '<img src="' + item.img + '" alt="' + item.name + '" />' +
          '<div class="content">' +
          "<h4>" + item.name + "</h4>" +
          '<p class="price-cart">$' + item.price + "</p>" +
          '<div class="quantity-control">' +
          '<button class="decrease-quantry" data-id="' + item.id + '">-</button>' +
          '<span class="quantity">' + item.quantity + "</span>" +
          '<button class="increase-quantry" data-id="' + item.id + '">+</button>' +
          "</div>" +
          "</div>" +
          '<button class="delete-item" data-id="' + item.id + '">' +
          '<i class="fa-solid fa-trash-can"></i>' +
          "</button>" +
          "</div>";
      });
    }
  }

  if (priceCartTotal) priceCartTotal.textContent = "$" + totalPrice;
  if (countItemCart) countItemCart.textContent = totalItems;
  if (countItemHeader) countItemHeader.textContent = totalItems;
}

updateCart();

function updateCartIconCount() {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var totalItems = cart.reduce(function (acc, item) { return acc + item.quantity; }, 0);
  var countItemCart = document.querySelector(".count-item-cart");
  var countItemHeader = document.querySelector(".count_item_header");

  if (countItemCart) countItemCart.textContent = totalItems;
  if (countItemHeader) countItemHeader.textContent = totalItems;
}

function syncCartButtonStates() {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.forEach(function (item) {
    var btns = document.querySelectorAll('.btn-add-cart[data-id="' + item.id + '"]');
    btns.forEach(function (btn) {
      btn.classList.add("active");
      btn.innerHTML = ' <i class="fa-solid fa-cart-shopping"></i> Item in cart';
    });
  });
}

function toggleFavourite(productId, btn) {
  var favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  var index = favourites.indexOf(productId);

  if (index > -1) {
    favourites.splice(index, 1);
    btn.classList.remove("active");
    btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
  } else {
    favourites.push(productId);
    btn.classList.add("active");
    btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
  }

  localStorage.setItem("favourites", JSON.stringify(favourites));
  updateFavouriteCount();
  renderFavourites();
}

function removeFavourite(productId) {
  var favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  favourites = favourites.filter(function (id) { return id != productId; });
  localStorage.setItem("favourites", JSON.stringify(favourites));

  var allMatchingButtons = document.querySelectorAll(
    '.btn-product[data-id="' + productId + '"]'
  );
  allMatchingButtons.forEach(function (btn) {
    btn.classList.remove("active");
    btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
  });

  updateFavouriteCount();
  renderFavourites();
}

function updateFavouriteCount() {
  var favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  var countEl = document.querySelector(".count_favourite");
  var countFavEl = document.querySelector(".count-item-fav");
  if (countEl) countEl.textContent = favourites.length;
  if (countFavEl) countFavEl.textContent = favourites.length;
}

function renderFavourites() {
  var favContainer = document.getElementById("fav-items");
  if (!favContainer) return;

  var favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  if (favourites.length === 0) {
    favContainer.innerHTML =
      '<div class="empty-fav">' +
      '<i class="fa-regular fa-heart"></i>' +
      '<p>Your wishlist is empty</p>' +
      '<span>Tap the heart on any product to save it here</span>' +
      '</div>';
    return;
  }

  favContainer.innerHTML = '';

  favourites.forEach(function (favId) {
    var product = allProducts.find(function (p) { return p.id == favId; });
    if (!product) return;

    var oldPriceHtml = product.old_price
      ? '<span class="fav-old-price">$' + product.old_price + '</span>'
      : '';

    favContainer.innerHTML +=
      '<div class="fav-item">' +
      '<div class="fav-img">' +
      '<img src="' + product.img + '" alt="' + product.name + '" />' +
      '</div>' +
      '<div class="fav-content">' +
      '<h4>' + product.name + '</h4>' +
      '<div><span class="fav-price">$' + product.price + '</span>' + oldPriceHtml + '</div>' +
      '</div>' +
      '<div class="fav-actions">' +
      '<button class="add-to-cart-fav" data-id="' + product.id + '" title="Add to Cart">' +
      '<i class="fa-solid fa-cart-shopping"></i>' +
      '</button>' +
      '<button class="remove-fav" data-id="' + product.id + '" title="Remove">' +
      '<i class="fa-solid fa-trash-can"></i>' +
      '</button>' +
      '</div>' +
      '</div>';
  });
}

function syncFavouriteStates() {
  var favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  favourites.forEach(function (id) {
    var btns = document.querySelectorAll('.btn-product[data-id="' + id + '"]');
    btns.forEach(function (btn) {
      btn.classList.add("active");
      btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    });
  });
  updateFavouriteCount();
  renderFavourites();
}

setTimeout(syncFavouriteStates, 500);
