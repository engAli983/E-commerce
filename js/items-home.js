var swiperItemsSale = document.querySelector("#swiper-items-sale");
var swiperItemsElectronics = document.querySelector("#swiper-electronic");
var swiperItemsAppliances = document.querySelector("#swiper-appliances");
var swiperItemsMobiles = document.querySelector("#swiper-mobile");

function requestProductSwipersInit(triesLeft) {
  if (triesLeft === undefined) triesLeft = 20;
  var init = typeof window !== "undefined" ? window.initializeProductSwipers : null;
  if (typeof init === "function") {
    init();
    return;
  }
  if (triesLeft > 0) {
    setTimeout(function () { requestProductSwipersInit(triesLeft - 1); }, 50);
  }
}

function generateProductHTML(product) {
  var hasDiscount = product.old_price ? true : false;
  var percent = hasDiscount
    ? Math.trunc(((product.old_price - product.price) / product.old_price) * 100)
    : 0;
  var oldPriceHtml = hasDiscount
    ? '<p class="old-price">$' + product.old_price + "</p>"
    : "";
  var badgeHtml = hasDiscount
    ? '<span class="sale-present">%' + percent + "</span>"
    : "";

  return (
    '<div class="swiper-slide product">' +
    badgeHtml +
    '<div class="img-product">' +
    '<a href="#"><img src="' + product.img + '" alt="' + product.name + '" /></a>' +
    "</div>" +
    '<div class="stars">' +
    '<i class="fa-solid fa-star"></i>' +
    '<i class="fa-solid fa-star"></i>' +
    '<i class="fa-solid fa-star"></i>' +
    '<i class="fa-solid fa-star"></i>' +
    '<i class="fa-solid fa-star"></i>' +
    "</div>" +
    '<p class="name-product"><a href="#">' + product.name + "</a></p>" +
    '<div class="price">' +
    "<p><span>$" + product.price + "</span></p>" +
    oldPriceHtml +
    "</div>" +
    '<div class="icons">' +
    '<button class="btn-add-cart" data-id="' + product.id + '">' +
    '<i class="fa-solid fa-cart-shopping"></i> add to cart' +
    "</button>" +
    '<span class="btn-product" data-id="' + product.id + '">' +
    '<i class="fa-regular fa-heart"></i>' +
    "</span>" +
    "</div>" +
    "</div>"
  );
}

fetch("products.json")
  .then(function (response) { return response.json(); })
  .then(function (data) {
    var saleProducts = data.filter(function (p) { return p.old_price; });
    if (swiperItemsSale) {
      swiperItemsSale.innerHTML = saleProducts.map(generateProductHTML).join("");
    }

    var electronicProducts = data.filter(function (p) { return p.category === "electronics"; });
    if (swiperItemsElectronics) {
      swiperItemsElectronics.innerHTML = electronicProducts.map(generateProductHTML).join("");
    }

    var applianceProducts = data.filter(function (p) { return p.category === "appliances"; });
    if (swiperItemsAppliances) {
      swiperItemsAppliances.innerHTML = applianceProducts.map(generateProductHTML).join("");
    }

    var mobileProducts = data.filter(function (p) { return p.category === "mobiles"; });
    if (swiperItemsMobiles) {
      swiperItemsMobiles.innerHTML = mobileProducts.map(generateProductHTML).join("");
    }

    requestProductSwipersInit();
  })
  .catch(function (err) { console.error("Error loading products:", err); });
