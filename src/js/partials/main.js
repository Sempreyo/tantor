document.addEventListener("DOMContentLoaded", () => {
	gsap.registerPlugin(ScrollTrigger);

	// Плавный скролл
	/*const lenis = new Lenis({
		autoRaf: true
	});*/

	const fadeIn = (element, duration = 0.7, delay = 0) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
				start: "top 100%",
				end: "bottom 10%"
			},
			opacity: 1,
			duration,
			delay,
			ease: "power2.out"
		});
	}

	const fadeUp = (element, duration = 0.7, delay = 0) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
				start: "top 100%",
				end: "bottom 10%"
			},
			opacity: 1,
			y: 0,
			duration,
			delay,
			ease: "power2.out"
		});
	}

	const fadeX = (element, duration = 0.7, delay = 0) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
				start: "top 100%",
				end: "bottom 10%"
			},
			opacity: 1,
			x: 0,
			duration,
			delay,
			ease: "power2.out"
		});
	}

	const fadeY = (element, duration = 0.7, delay = 0) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
				start: "top 100%",
				end: "bottom 10%"
			},
			opacity: 1,
			y: 0,
			duration,
			delay,
			ease: "power2.out"
		});
	}

	const flickerAnimation = (elem) => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const tl = gsap.timeline();
					tl.set(elem, { opacity: 0.1 })
						.to(elem, { opacity: 0.9, duration: 0.3 })
						.to(elem, { opacity: 0.3, duration: 0.2 })
						.to(elem, { opacity: 1, duration: 0.2 })
						.to(elem, { opacity: 0.7, duration: 0.2 })
						.to(elem, { opacity: 1, duration: 0.1 })
						.to(elem, { opacity: 0.8, duration: 0.06 })
						.to(elem, { opacity: 1, duration: 0.04 })
						.to(elem, { opacity: 0.8, duration: 0.1 })
						.to(elem, { opacity: 1, duration: 0.1 })
						.to(elem, { opacity: 0.9, duration: 0.1 })
						.to(elem, { opacity: 1, duration: 0.6 });

					observer.unobserve(elem);
				}
			});
		}, { threshold: 0.1 });

		observer.observe(elem);
	};

	// Ховер табличек на первом экране
	const boards = document.querySelectorAll(".board");

	if (boards && boards.length > 0) {
		boards.forEach((board, index, arr) => {
			board.addEventListener("mouseover", (e) => {
				if (e.currentTarget) {
					arr.forEach(el => el.classList.add("inactive"));
					e.currentTarget.classList.remove("inactive");
				}
			});

			board.addEventListener("mouseout", () => {
				arr.forEach(el => el.classList.remove("inactive"));
			});

			// Анимация табло
			flickerAnimation(board);
		});
	}

	// Скрытие тени при скролле галереи
	const updateScrollShadow = (scrollableElem, styledElem) => {
		const hasHorizontalScroll = scrollableElem.scrollWidth > scrollableElem.clientWidth;

		if (!hasHorizontalScroll) {
			styledElem.classList.remove("scrolled");
			return;
		}

		if (scrollableElem.scrollLeft > 5) {
			styledElem.classList.remove("scrolled");
		} else {
			styledElem.classList.add("scrolled");
		}
	}

	const cards = document.querySelector(".scenario__cards");

	if (cards) {
		const cardsObserver = new ResizeObserver(() => {
			updateScrollShadow(cards, cards.parentElement);
		});
		cardsObserver.observe(cards);

		cards.addEventListener("scroll", () => updateScrollShadow(cards, cards.parentElement));

		updateScrollShadow(cards, cards.parentElement);
	}

	// Анимация печати логотипов
	const header = document.querySelector(".header");

	if (header) {
		const headerObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const icons = header.querySelectorAll(".js-logo-animate");

					icons.forEach(icon => {
						const chars = icon.querySelectorAll("path");

						chars.forEach((char, index) => {
							setTimeout(() => {
								char.style.display = "block";
							}, 200 * index);
						});
					});
				}
			});
		});

		headerObserver.observe(header);
	}

	// Анимация появления постеров
	const postersSection = document.querySelector(".scenario__cards");

	if (postersSection) {
		const postersObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const posters = postersSection.querySelectorAll(".scenario-card");

					posters.forEach((poster, index) => {
						setTimeout(() => {
							fadeUp(poster, 0.7);
						}, index * 200);
					});

					postersObserver.unobserve(postersSection);
				}
			});
		});

		postersObserver.observe(postersSection);
	}

	// Анимация появления заголовка в сценариях
	const scenarioTitle = document.querySelector(".scenario__title");

	if (scenarioTitle) {
		const scenarioTitleObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					fadeUp(scenarioTitle, 0.7);

					scenarioTitleObserver.unobserve(scenarioTitle);
				}
			});
		});

		scenarioTitleObserver.observe(scenarioTitle);
	}

	// Анимация заголовков
	const title = document.querySelector(".news__title");

	if (title) {
		// Разделить строку на символы
		const splitText = new SplitType(".news__title", {
			types: "chars"
		});

		title.style.opacity = 1;

		const titleObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const chars = document.querySelectorAll(".news__title .char");

					chars.forEach((el, index) => {
						setTimeout(() => {
							el.style.opacity = 1;
						}, 100 * index);
					});

					titleObserver.unobserve(title);
				}
			});
		});

		titleObserver.observe(title);
	}
});
