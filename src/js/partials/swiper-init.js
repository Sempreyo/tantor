document.addEventListener("DOMContentLoaded", () => {
	const slideshowCarousel = document.querySelectorAll(".carousel__slider");

	if (slideshowCarousel.length > 0) {
		slideshowCarousel.forEach(el => {
			const slideshowCarouselNext = el.nextElementSibling.querySelector(".swiper-btn-next");
			const slideshowCarouselPrev = el.nextElementSibling.querySelector(".swiper-btn-prev");
			const slideshowPagination = el.querySelector(".carousel__pagination");

			const slider = new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 10,
				autoplay: {
					delay: 6000
				},
				loop: true,
				autoHeight: true,
				navigation: {
					nextEl: slideshowCarouselNext,
					prevEl: slideshowCarouselPrev,
				},
				pagination: {
					el: slideshowPagination,
					clickable: true
				},
				breakpoint: {
					992: {
						autoHeight: false
					}
				}
			});
		});
	}
});
