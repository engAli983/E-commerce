var swiper = new Swiper(".slide-swap", {
  pagination: {
    el: ".swiper-pagination",
    dynamicBullets: true,
    clickable: true,
  },
  autoplay: {
    delay: 2500,
  },
  loop: true,
});

function initializeProductSwipers() {
  var productSwipers = document.querySelectorAll(".slide-product");

  productSwipers.forEach(function (swiperEl) {
    if (swiperEl.swiper) {
      return;
    }

    var container = swiperEl.closest(".slider-products");
    var nextBtn = container ? container.querySelector(".btn-swip-next") : null;
    var prevBtn = container ? container.querySelector(".btn-swip-prev") : null;

    new Swiper(swiperEl, {
      slidesPerView: 2,
      spaceBetween: 15,
      autoplay: {
        delay: 2500,
      },
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },
      loop: true,
      breakpoints: {
        576: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
        992: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
      },
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(initializeProductSwipers, 100);
});

if (typeof window !== "undefined") {
  window.initializeProductSwipers = initializeProductSwipers;
}
