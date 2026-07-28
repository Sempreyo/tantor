import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

(function() {
	// Проверяем параметр URL
	const urlParams = new URLSearchParams(window.location.search);
	if (!urlParams.has("reset")) {
		// Добавляем параметр reset и перезагружаем
		window.location.search = "?reset=1";
		return;
	}

	// Если параметр reset есть - выполняем сброс
	if (typeof ScrollTrigger !== "undefined") {
		ScrollTrigger.getAll().forEach(trigger => trigger.kill());
	}
	gsap.globalTimeline.clear();
	gsap.killTweensOf("*");

	// Очищаем ForceGraph
	const graphContainer = document.getElementById("graph");
	if (graphContainer) {
		graphContainer.innerHTML = "";
	}

	// Сбрасываем стили
	document.querySelectorAll('[class*="hero__"], [class*="server__"], .advantages, .gallery, .product__container').forEach(el => {
		el.style.opacity = "";
		el.style.transform = "";
		el.style.translate = "";
	});

	// Прокрутка в начало
	window.scrollTo(0, 0);

	// Удаляем параметр из URL без перезагрузки
	if (window.history && window.history.replaceState) {
		window.history.replaceState({}, document.title, window.location.pathname);
	}
})();

document.addEventListener("DOMContentLoaded", () => {
	gsap.registerPlugin(ScrollTrigger);



	// Смарт хэдер
	const header = document.querySelector(".header");
	const media1280 = window.matchMedia("(min-width: 1280px)").matches;

	let isAnimating = false;
	function setActiveMenuItem(targetId) {
		document.querySelectorAll(".anchor").forEach(link => {
			if (link.getAttribute("href") === targetId) {
				link.classList.add("active");
			} else {
				link.classList.remove("active");
			}
		});
	}

	const headerHeight = header ? header.offsetHeight : 80;

	const observerOptions = {
		root: null,
		rootMargin: `-${headerHeight}px 0px -50% 0px`,
		threshold: 0
	};

	const observer = new IntersectionObserver((entries) => {
		if (isAnimating) return;

		const visibleEntries = entries.filter(entry => entry.isIntersecting);

		if (visibleEntries.length > 0) {
			const targetId = `#${visibleEntries[0].target.id}`;
			setActiveMenuItem(targetId);
		}
	}, observerOptions);

	document.querySelectorAll(".anchor").forEach(anchor => {
		const targetId = anchor.getAttribute("href");
		if (targetId.startsWith("#")) {
			const targetElement = document.querySelector(targetId);
			if (targetElement) {
				observer.observe(targetElement);
			}
		}
	});

	document.querySelectorAll(".anchor").forEach(anchor => {
		anchor.addEventListener("click", function(e) {
			e.preventDefault();
			const targetId = this.getAttribute("href");

			if (targetId.startsWith("#") && document.querySelector(targetId)) {
				const targetElement = document.querySelector(targetId);

				isAnimating = true; // Блокируем обсервер на время скролла к блоку
				setActiveMenuItem(targetId);

				gsap.to(window, {
					duration: 0.8,
					ease: "power2.out",
					scrollTo: {
						y: targetElement,
						offsetY: headerHeight,
						autoKill: false
					},
					overwrite: "auto",
					onComplete: () => {
						// Разблокируем обсервер чуть позже, когда страница полностью остановится
						setTimeout(() => {
							isAnimating = false;
						}, 100);
					}
				});
			}
			else {
				setActiveMenuItem(targetId);
			}

			if (!media1280 && anchor.closest(".header__menu") !== null) {
				openNav();
			}
		});
	});

	// Мобильное меню
	const openNav = () => {
		let bodyState = document.body.getAttribute("data-state");

		if (bodyState === "mobile-menu") {
			document.body.dataset.state = "";
		} else {
			document.body.dataset.state = "mobile-menu";
		}
	}
	const burger = document.querySelector(".header__burger");
	const closeButtonMenu = document.querySelector(".header__menu-close");

	burger.addEventListener("click", openNav);
	closeButtonMenu.addEventListener("click", openNav);

	// Бегущая строка
	const marqueeContainer = document.querySelector('.migration__marquee');
	const marqueeInner = document.querySelector('.migration__marquee-inner');

	// Дублируем блок 4 раза, чтобы точно забить экраны любой ширины
	for (let i = 0; i < 4; i++) {
		const clone = marqueeInner.cloneNode(true);

		clone.setAttribute("aria-hidden", "true");
		marqueeContainer.appendChild(clone);
	}

	gsap.to(".migration__marquee-inner", {
		xPercent: -100,
		ease: "none",
		duration: 20,
		repeat: -1
	});

	// Кнопка Наверх
	const buttonUp = document.querySelector(".button-up");

	const initButtonUp = () => {
		if (buttonUp) {
			window.addEventListener("scroll", buttonUpHandler);

			buttonUp.addEventListener("click", () => {
				document.querySelector("body").scrollIntoView({
					behavior: 'smooth'
				});
			});
		}
	}

	const buttonUpHandler = () => {
		scroll = window.pageYOffset;

		if (scroll > 300) {
			buttonUp.classList.add("button-up--visible");
		} else {
			buttonUp.classList.remove("button-up--visible");
		}
	}

	initButtonUp();





	const setIntersection = (target, fn, threshold = 0) => {
		if (target) {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						fn();
						observer.unobserve(entry.target);
					}
				});
			}, {threshold});

			observer.observe(target);
		}
	};
	const getMoveCoords = () => {
		const source = document.querySelector(".hero__machines");
		const target = document.querySelector(".hero__car");

		if (!source || !target) return { x: 0, y: 0, scale: 1 };

		const rectSource = source.getBoundingClientRect();
		const rectTarget = target.getBoundingClientRect();

		// Вычисляем разницу центров элементов
		const sourceCenterX = rectSource.left + rectSource.width / 2;
		const sourceCenterY = rectSource.top + rectSource.height / 2;
		const targetCenterX = rectTarget.left + rectTarget.width / 2;
		const targetCenterY = rectTarget.top + rectTarget.height / 2;

		// Вычисляем нужный коэффициент масштабирования
		const scale = rectTarget.width / rectSource.width;

		return {
			x: targetCenterX - sourceCenterX - 30,
			y: targetCenterY - sourceCenterY - 30,
			scale: scale
		};
	}
	let mm = gsap.matchMedia();

	// Блок с графами
	const combinedData = {
		nodes: [{ id: "center", opacity: 0 }],
		links: []
	};

	// Заданные этапы
	const stages = [
		{
			nodes: [
				{ id: "pg1", label: "PostgreSQL" },
				{ id: "gp1", label: "Greenplum" },
				{ id: "duck1", label: "DuckDB" }
			],
			links: [
				{ source: "pg1", target: "center" },
				{ source: "gp1", target: "center" },
				{ source: "duck1", target: "center" },
				{ source: "pg1", target: "gp1" },
				{ source: "pg1", target: "duck1" }
			],
			problemId: "#prob1"
		},
		{
			nodes: [{ id: "pg2", label: "PostgreSQL" }],
			links: [
				{ source: "pg2", target: "center" },
				{ source: "gp1", target: "pg2" }
			],
			problemId: "#prob2"
		},
		{
			nodes: [
				{ id: "ch1", label: "ClickHouse" },
				{ id: "duck2", label: "DuckDB" }
			],
			links: [
				{ source: "ch1", target: "center" },
				{ source: "duck2", target: "center" },
				{ source: "ch1", target: "duck2" },
				{ source: "pg2", target: "duck2" }
			],
			problemId: "#prob3"
		},
		{
			nodes: [
				{ id: "ch2", label: "ClickHouse" },
				{ id: "gp2", label: "Greenplum" }
			],
			links: [
				{ source: "ch2", target: "center" },
				{ source: "gp2", target: "center" },
				{ source: "ch2", target: "gp2" },
				{ source: "gp2", target: "duck1" },
				{ source: "ch2", target: "ch1" }
			],
			problemId: "#prob4"
		}
	];

	// Объединяем все этапы в единый массив данных для мгновенного вывода
	stages.forEach(stage => {
		combinedData.nodes.push(...stage.nodes);
		combinedData.links.push(...stage.links);

		// Опционально: если элементы #prob1, #prob2 и т.д. есть в HTML, делаем их видимыми
		const probEl = document.querySelector(stage.problemId);
		if (probEl) probEl.style.opacity = "1";
	});

	// Инициализация графа
	const graphContainer = document.getElementById("graph");
	const rect = graphContainer.getBoundingClientRect();

	const centerX = rect.width / 2;
	const centerY = rect.height / 2;
	const radiusX = rect.width * 0.45;
	const radiusY = Math.max(30, centerY - 40);

	// Функция для определения позиции узла на эллипсе
	function getNodePosition(nodeId, totalNodes, index) {
		if (nodeId === "center") {
			return { x: centerX, y: centerY };
		}

		// Распределяем углы равномерно по окружности
		const baseAngle = (index / totalNodes) * 2 * Math.PI - Math.PI / 2;

		// Добавляем небольшой хаос, чтобы узлы не стояли по идеальной линейке
		const randomOffset = (Math.random() - 0.5) * 0.15;
		const angle = baseAngle + randomOffset;

		// Небольшой разброс отдаления от центра
		const variation = 1 + (Math.random() - 0.5) * 0.08;

		// Формула эллипса: умножаем косинус на ширину, а синус на высоту
		const x = centerX + radiusX * variation * Math.cos(angle);
		const y = centerY + radiusY * variation * Math.sin(angle);

		return { x, y, homeX: x, homeY: y };
	}

	// Получаем все узлы (кроме центрального) и распределяем их по краям
	const nonCenterNodes = combinedData.nodes.filter(node => node.id !== "center");
	const totalNodes = nonCenterNodes.length;

	nonCenterNodes.forEach((node, index) => {
		const pos = getNodePosition(node.id, totalNodes, index);
		node.x = pos.x;
		node.y = pos.y;
		node.homeX = pos.homeX;
		node.homeY = pos.homeY;
	});

	// Устанавливаем позицию центрального узла
	const centerNode = combinedData.nodes.find(node => node.id === "center");
	if (centerNode) {
		centerNode.x = centerX;
		centerNode.y = centerY;
		centerNode.fx = centerX;
		centerNode.fy = centerY;
	}

	const Graph = ForceGraph()(graphContainer)
		.width(rect.width)
		.height(rect.height)
		.graphData(combinedData) // Передаем сразу объединенные данные
		.nodeRelSize(7)
		.linkColor(() => "#333333")
		.linkWidth(1.5)
		.cooldownTime(Infinity)
		.d3AlphaDecay(0)

		.enableNodeDrag(false) // Запрещаем перетаскивать плашки мышкой
		.enablePanInteraction(false) // Запрещаем двигать всю сцену мышкой
		.enableZoomInteraction(false) // Запрещает зумить сцену

		.nodeCanvasObject((node, ctx, globalScale) => {
			if (node.id === "center") return;

			const label = node.label || "";
			ctx.font = `${14 / globalScale}px monospace`;
			const textWidth = ctx.measureText(label).width;
			const bckgDimensions = [textWidth, 14].map(v => v + 8 / globalScale);

			// Рисуем белую подложку плашки (прямоугольник)
			ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
			ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

			// Рисуем черную рамку узла
			ctx.strokeStyle = "#222222";
			ctx.lineWidth = 1 / globalScale;
			ctx.strokeRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

			// Рендерим текст базы данных
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#000000";
			ctx.fillText(label, node.x, node.y);
		});

	// Настройка сил физики
	Graph.d3Force("center", null);
	Graph.d3Force("charge").strength(-100);
	Graph.d3Force("link").distance(150).strength(0.15);

	let start = Date.now();

	function wiggleLoop() {
		const elapsed = (Date.now() - start) * 0.0212; // Скорость анимации

		Graph.d3ReheatSimulation();

		combinedData.nodes.forEach((node, i) => {
			if (node.id === "center") return;

			// Рассчитываем волны покачивания (у каждого узла своя фаза движения)
			const speedX = elapsed + i * 0.4;
			const speedY = elapsed * 1.1 + i * 0.7;

			// Максимальный радиус шевеления плашки (в пикселях)
			const wiggleX = Math.sin(speedX) * 15;
			const wiggleY = Math.cos(speedY) * 10;

			// Куда плашка стремится в текущий кадр анимации
			const targetX = node.homeX + wiggleX;
			const targetY = node.homeY + wiggleY;

			// Мягко сдвигаем координаты узла к цели
			node.x += (targetX - node.x) * 0.05;
			node.y += (targetY - node.y) * 0.05;
		});

		requestAnimationFrame(wiggleLoop);
	}

	// Запускаем бесконечный рендер шевеления
	wiggleLoop();

	// Кадрирование сцены под размер экрана
	setTimeout(() => {
		Graph.zoomToFit(400, 10);
	}, 100);



	// Анимации на первом экране
	const hero = document.querySelector(".hero");
	const heroRight = document.querySelector(".hero__right");

	setIntersection(hero, () => {
		gsap.to(".hero__title", {
			opacity: 1,
			y: 0,
			duration: 0.4,
			ease: "none"
		});
	});

	setIntersection(heroRight, () => {
		gsap.to(".hero__text span", {
			opacity: 1,
			x: 0,
			duration: 0.4,
			delay: 0.3,
			stagger: 0.2,
			ease: "none"
		});
	});

	mm.add("(min-width: 1280px)", () => {
		const scene = new THREE.Scene();
		//scene.background = new THREE.Color(0x1a1a1a);

		const container = document.getElementById("model");
		const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		container.appendChild(renderer.domElement);

		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		camera.position.set(-0.02, 0.77, 4.36); // Позиция камеры в пространстве
		controls.target.set(0.00, 0.63, -0.20); // Координаты фиксации камеры
		controls.update();

		// Блокируем управление для пользователя
		controls.enableRotate = false;
		controls.enableZoom = false;
		controls.enablePan = false;

	/*controls.addEventListener('change', () => {
		// Координаты самой камеры
		const cx = camera.position.x.toFixed(2);
		const cy = camera.position.y.toFixed(2);
		const cz = camera.position.z.toFixed(2);

		// Координаты точки фокуса (куда камера смотрит)
		const tx = controls.target.x.toFixed(2);
		const ty = controls.target.y.toFixed(2);
		const tz = controls.target.z.toFixed(2);

		// Выводим в консоль готовый блок кода для вставки
		console.clear(); // Очищает консоль, чтобы видеть только последний актуальный ракурс
		console.log(
			`// Скопируйте этот блок в код:\n` +
			`camera.position.set(${cx}, ${cy}, ${cz});\n` +
			`controls.target.set(${tx}, ${ty}, ${tz});`
		);
	});*/

	// Общий мягкий свет
	const ambientLight = new THREE.AmbientLight(0xffffff, 4.0);
	scene.add(ambientLight);

		// Главный свет (светит спереди, сверху и справа)
		const mainLight = new THREE.DirectionalLight(0xffffff, 8.5);
		mainLight.position.set(2, 4, 15);
		scene.add(mainLight);

		// Заполняющий свет (светит сзади и слева, чтобы подсветить контуры)
		const fillLight = new THREE.DirectionalLight(0xffffff, 4.5);
		fillLight.position.set(-6, 2, 2);
		scene.add(fillLight);

		// Фоновое/объемное освещение из центра во все стороны
		const backgroundLight = new THREE.PointLight(0xffffff, 5, 15);
		backgroundLight.position.set(0, 0, -3); // Слегка за моделью для эффекта свечения
		scene.add(backgroundLight);

		// Свет внутри модели
		const innerLight = new THREE.PointLight(0x00aaff, 0, 5);
		innerLight.position.set(0, 0, -0.3);
		scene.add(innerLight);

		const loader = new GLTFLoader();
		let doorObject = null;
		let isDoorOpen = false;
		let model;
		// Координаты смещения по оси X и Y для адаптивных экранов
		function getLeftPositionX(targetZ = -2.4, paddingPercentage = 0.20) {
			// Считаем точное расстояние от камеры до модели с учетом смещения по Z
			const distance = camera.position.z - targetZ;

			// Переводим FOV в радианы
			const vFov = (camera.fov * Math.PI) / 180;

			// Считаем видимые границы на этой конкретной глубине
			const visibleHeight = 2 * Math.tan(vFov / 2) * distance;
			const visibleWidth = visibleHeight * (container.clientWidth / container.clientHeight);

			// Крайняя левая точка
			const leftEdge = -visibleWidth / 2;

			// Добавляем отступ вправо (20% от ширины видимой области)
			return leftEdge + (visibleWidth * paddingPercentage);
		}
		function getTopPositionY(targetZ = -2.4, shiftDownPercentage = 0.15) {
			const distance = camera.position.z - targetZ;
			const vFov = (camera.fov * Math.PI) / 180;
			const visibleHeight = 2 * Math.tan(vFov / 2) * distance;

			return -(visibleHeight * shiftDownPercentage);
		}

		loader.load(
			"./assets/xdata.glb",
			function (gltf) {
				// Показываем страницу когда модель загрузилась
				document.body.classList.remove("hidden");

				const modelPivot = new THREE.Group();
				scene.add(modelPivot);

				model = gltf.scene;

				// Расчет центра модели
				const box = new THREE.Box3().setFromObject(model);
				const center = box.getCenter(new THREE.Vector3());
				model.position.x = -center.x;
				model.position.y = -center.y;
				model.position.z = -center.z;
				modelPivot.position.y = center.y;
				//model.scale.set(0, 1, 0);

				modelPivot.add(model);
				doorObject = model.getObjectByName("0-Door");

				// Собираем все материалы внутри двери в один массив
				const doorMaterials = [];
				if (doorObject) {
					doorObject.traverse((child) => {
						if (child.isMesh && child.material) {
							// Если у меша массив материалов
							if (Array.isArray(child.material)) {
								child.material = child.material.map(mat => {
									const clonedMat = mat.clone(); // Клонируем каждый материал
									clonedMat.transparent = true;
									clonedMat.opacity = 1;
									doorMaterials.push(clonedMat);
									return clonedMat;
								});
							} else {
								// Если у меша один стандартный материал
								child.material = child.material.clone(); // Клонируем его
								child.material.transparent = true;
								child.material.opacity = 1;
								doorMaterials.push(child.material);
							}
						}
					});
				}

				const tl1 = gsap.timeline({
					scrollTrigger: {
						trigger: "#anchor-1",
						start: "top top",
						end: "bottom top",
						invalidateOnRefresh: true,
						paused: true,
						//toggleActions: "play none reset none",
						onUpdate: (self) => {
							const progress = self.progress; // значение от 0 (начало фиксации) до 1 (конец фиксации)

							if (progress > 0 && progress < 0.7) {
								tl1.play();
							} else {
								tl1.pause(0);
								self.kill();
							}
						}
					}
				});

				const coords = getMoveCoords();

				tl1
					// Сервера перемещаются в погрузчик
					.to(".hero__machine--1", {
						x: "62%",
						y: -111,
						scale: 0.2,
						rotate: 0,
						duration: 0.5,
						ease: "power2.out",
						overwrite: "auto"
					})
					.to(".hero__machine--2", {
						x: "-2%",
						scale: 0.2,
						rotate: "5deg",
						ease: "power2.out",
						overwrite: "auto"
					}, "<")
					.to(".hero__machine--3", {
						x: "-72%",
						scale: 0.2,
						rotate: 0,
						ease: "power2.out",
						overwrite: "auto"
					}, "<")
					// Подписи к серверам перемещаются в погрузчик
					.to(".hero__label--1", {
						animation: "none",
						x: 195,
						y: -210,
						scale: 0.8,
						rotate: "-3deg",
						duration: 0.5,
						ease: "power2.out",
						overwrite: "auto"
					})
					.to(".hero__label--2", {
						animation: "none",
						x: 2,
						y: -45,
						scale: 0.8,
						rotate: 0,
						ease: "power2.out",
						overwrite: "auto"
					}, "<")
					.to(".hero__label--3", {
						animation: "none",
						x: -163,
						y: -228,
						scale: 0.8,
						rotate: "5deg",
						ease: "power2.out",
						overwrite: "auto"
					}, "<")
					// Погрузчик с серверами уезжает влево за экран
					.to(".hero__machines", {
						x: coords.x,
						y: coords.y,
						duration: 0.6,
						ease: "power2.out",
						overwrite: "auto"
					}, "+=0.3")
					.to(".blob--1", {
						opacity: 0,
						scale: 0,
						ease: "power2.out",
						duration: 1
					}, "+=0.5")
					.to(".hero__left", {
						x: "-100vw",
						duration: 2,
						ease: "power2.out",
						overwrite: "auto"
					}, "<");

				const tl2part1 = gsap.timeline({ paused: true });
				const tl2part2 = gsap.timeline({ paused: true });
				const tl2 = gsap.timeline({
					scrollTrigger: {
						trigger: ".sections-wrapper",
						start: `top ${headerHeight}px`,
						end: "+=200%",
						pin: true,
						onUpdate: (self) => {
							const progress = self.progress; // значение от 0 (начало фиксации) до 1 (конец фиксации)

							// Запускаем первый цикл
							if (progress > 0.1 && progress < 0.5) {
								tl2part1.play();
							}

							// Скролл ниже 55%
							if (progress >= 0.55) {
								if (tl2part1.progress() === 1) {
									tl2part2.play();
								} else {
									tl2part1.progress(1);
									tl2part2.play();
								}
							}

							// Реверс
							if (progress < 0.5) {
								tl2part2.reverse();
							}

							if (progress === 0) {
								if (tl2part2.progress() === 0) {
									tl2part1.reverse();
								} else {
									tl2part2.progress(0);
									tl2part1.reverse();
								}
							}
						}
					}
				});

				tl2part1
					.to(".blob--2", {
						opacity: 1,
						scale: 1,
						ease: "none",
						duration: 1
					})
					// Вращение модели на 1 оборот
					.to(modelPivot.rotation, {
						y: Math.PI * 2,
						ease: "none",
						duration: 1.4
					});

				// Открытие двери
				if (doorObject) {
					tl2part1.to(doorObject.rotation, {
						y: Math.PI / 2,
						duration: 0.7,
						ease: "none"
					});

					if (doorMaterials.length > 0) {
						tl2part1.to(doorMaterials, {
							opacity: 0,
							duration: 0.7,
							ease: "none"
						});
					}
				}

				tl2part1
					.to(".server__captions", {
						y: 0,
						duration: 0.5,
						ease: "none"
					})
					.to(".server__caption--1", {
						scale: 0.5,
						x: "10vh",
						duration: 0.5,
						ease: "none"
					})
					.to(".server__caption--2", {
						scale: 0.5,
						x: "-18vh",
						y: 0,
						duration: 0.5,
						ease: "none"
					}, "<")
					.to(".blob--2", {
						scale: 0.5,
						y: "-100%",
						duration: 0.5,
						ease: "none"
					}, "<")
					.to(".server-slider", {
						opacity: 1,
						x: 0,
						duration: 0.7,
						ease: "power2.out",
						overwrite: "auto"
					})
					.to(".server__slider-content", {
						opacity: 1,
						ease: "power2.out",
						overwrite: "auto"
					}, "<");

				tl2part2
					.to(".blob--2", {
						opacity: 0,
						duration: 0.5,
						ease: "power2.out",
						overwrite: "auto"
					});

					// Смена ракурса со смещением на 3 блок
					/*.to(model.position, {
						x: () => getLeftPositionX(-2.4, window.matchMedia("(min-width: 1800px)").matches ? 0.11 : 0.14), // Сдвиг влево
						y: getTopPositionY(-2.4, 0.28), // Сдвиг вниз
						z: -2.4, // Масштаб
						duration: 0.5,
						ease: "none"
					}, "<")
					.to(model.rotation, {
						y: 0.88, // Отрицательное значение вращает модель влево
						duration: 0.5,
						ease: "none"
					}, "<")
					.to(".advantages__item", {
						opacity: 1,
						x: 0,
						stagger: 0.5,
						duration: 0.5,
						ease: "none"
					}, "<");

				// Закрытие двери
				if (doorObject) {
					tl2part3.to(doorObject.rotation, {
						y: 0,
						duration: 0.5,
						ease: "none"
					}, "<");

					if (doorMaterials.length > 0) {
						tl2part3.to(doorMaterials, {
							opacity: 1,
							duration: 0.5,
							ease: "none"
						}, "<");
					}
				}*/

				const advantages = document.querySelector(".advantages");
				const tl4Content = gsap.timeline({ paused: true });
				const tl4 = gsap.timeline({ paused: true });
				const tl4Leave = gsap.timeline({ paused: true });

				tl4Content
					.to(".advantages-anim", {
						opacity: 1,
						y: 0,
						stagger: 0.2,
						duration: 0.5,
						ease: "power2.out",
						overwrite: "auto"
					});

				tl4
					.to("#model", {
						top: "unset",
						opacity: 0,
						duration: 0,
						ease: "none"
					})
					.to(model.position, {
						x: () => getLeftPositionX(-2.4, window.matchMedia("(min-width: 1800px)").matches ? -0.11 : -0.14),
						y: 0,
						z: 0,
						duration: 0,
						ease: "none"
					})
					// Начальные позиции света (должны дублировать ваши исходные значения)
					.to(mainLight.position, { x: 2, y: 4, z: 15, duration: 0, ease: "none" }, "<")
					.to(fillLight.position, { x: -6, y: 2, z: 2, duration: 0, ease: "none" }, "<")
					.to(backgroundLight.position, { x: 0, y: 0, z: -3, duration: 0, ease: "none" }, "<")
					.to(innerLight.position, { x: 0, y: 0, z: -0.3, duration: 0, ease: "none" }, "<")
					.to("#model", {
						opacity: 1,
						duration: 0.3,
						ease: "none"
					})
					.to(model.position, {
						x: () => getLeftPositionX(
							-2.4,
							window.matchMedia("(min-width: 2200px)").matches ? 0.08 :
								window.matchMedia("(min-width: 1800px)").matches ? 0.11 :
								0.14
						),
						// Сдвиг влево
						y: getTopPositionY(-2.4, 0.45), // Сдвиг вниз
						z: -2.4, // Масштаб
						duration: 1.5,
						ease: "none"
					})
					// Анимируем ГЛАВНЫЙ СВЕТ вслед за моделью (сдвигаем влево и немного уводим вглубь по Z)
					.to(mainLight.position, {
						x: 16,
						y: 3,
						z: 6.5,
						duration: 1.5,
						ease: "none"
					}, "<")
					// Анимируем ЗАПОЛНЯЮЩИЙ СВЕТ (уводим еще дальше влево и назад для контуров)
					.to(fillLight.position, {
						x: -8,
						y: 1,
						z: -1.5,
						duration: 1.5,
						ease: "none"
					}, "<")
					// Анимируем ФОНОВЫЙ СВЕТ (он привязан к центру модели, поэтому должен идеально повторять её координаты)
					.to(backgroundLight.position, {
						x: () => model.position.x,
						y: getTopPositionY(-2.4, 0.45),
						z: -5.4,
						duration: 1.5,
						ease: "none"
					}, "<")
					// Анимируем ВНУТРЕННИЙ СВЕТ (всегда движется строго внутри геометрии модели)
					.to(innerLight.position, {
						x: () => model.position.x,
						y: getTopPositionY(-2.4, 0.45),
						z: -2.7,
						duration: 1.5,
						ease: "none"
					}, "<")
					.to(model.rotation, {
						y: 0.88, // Отрицательное значение вращает модель влево
						duration: 0.5,
						ease: "none"
					}, "<");

				// Закрытие двери
				if (doorObject) {
					tl4.to(doorObject.rotation, {
						y: 0,
						duration: 0.5,
						ease: "none"
					});

					if (doorMaterials.length > 0) {
						tl4.to(doorMaterials, {
							opacity: 1,
							duration: 0.5,
							ease: "none"
						}, "<");
					}
				}

				tl4
					.to(".advantages__item", {
						opacity: 1,
						x: 0,
						stagger: 0.3,
						duration: 0.5,
						ease: "none"
					});

				tl4Leave
					.to("#model", {
						top: 0,
						opacity: 1,
						duration: 0,
						ease: "none"
					})
					.to(model.position, {
						x: -center.x,
						y: -center.y,
						z: -center.z,
						duration: 0.5,
						ease: "none"
					})
					.to(model.rotation, {
						y: 0,
						duration: 0.5,
						ease: "none"
					}, "<");

				if (advantages) {
					const observer = new IntersectionObserver((entries) => {
						entries.forEach((entry) => {
							if (entry.isIntersecting) {
								tl4.play();
								tl4Content.play();
							} else {
								tl4.pause(0).invalidate();
								tl4Leave.play(0);
							}
						});
					}, { threshold: 0.5 });

					observer.observe(advantages);
				}

				const tl5 = gsap.timeline({
					scrollTrigger: {
						trigger: "#anchor-3",
						start: "-50% top",
						end: "top top",
						invalidateOnRefresh: true,
						toggleActions: "play none none reverse"
					}
				});

				tl5
					.to(".product__logo-image", {
						scale: 0.3,
						y: -60,
						duration: 0.2,
						ease: "none"
					})
					.to(".product__container", {
						opacity: 1,
						duration: 0.2,
						ease: "none"
					})
					.fromTo(".product-anim", {
						opacity: 0,
						y: 10
					}, {
						opacity: 1,
						y: 0,
						stagger: 0.2,
						duration: 0.2,
						ease: "none"
					});

				const tl6 = gsap.timeline({
					paused: true,
					repeat: -1,
					repeatDelay: 3.5,
					scrollTrigger: {
						trigger: "#anchor-4",
						start: `-50% ${headerHeight}px`,
						end: "bottom top",
						invalidateOnRefresh: true,
						onUpdate: (self) => {
							const progress = self.progress; // значение от 0 (начало фиксации) до 1 (конец фиксации)

							if (progress > 0 && progress < 0.85) {
								tl6.play();
							} else {
								tl6.pause(0);
							}
						}
					}
				});

				const about = document.querySelector(".about");
				const aboutTl = gsap.timeline();
				setIntersection(about, () => {
					aboutTl
						.to(".about__title", {
							opacity: 1,
							y: 0,
							duration: 0.5,
							ease: "none"
						})
						.to(".about__text", {
							opacity: 1,
							y: 0,
							duration: 0.5,
							ease: "none"
						})
						.to(".about__content", {
							opacity: 1,
							y: 0,
							duration: 0.5,
							ease: "none"
						});

					tl6
						.to(".chart--1", {
							opacity: 1,
							duration: 0.4,
							ease: "none"
						})
						.to(".chart-anim-1", {
							opacity: 1,
							y: 0,
							stagger: 0.1,
							duration: 0.4,
							ease: "none"
						}, "<")
						.to(".chart--2", {
							opacity: 1,
							duration: 0.4,
							ease: "none"
						}, "+=3.5")
						.to(".chart-anim-2", {
							opacity: 1,
							y: 0,
							duration: 0.4,
							ease: "none"
						}, "<")
						.fromTo(".chart__bar", {
							height: 0
						}, {
							height: (index, target) => getComputedStyle(target).getPropertyValue("--bar-height").trim(),
							stagger: 0.1,
							duration: 0.4,
							ease: "none"
						}, "<")
						.to(".chart--3", {
							opacity: 1,
							duration: 0.4,
							ease: "none"
						}, "+=3.5")
						.to(".chart-anim-3", {
							opacity: 1,
							y: 0,
							duration: 0.4,
							ease: "none"
						}, "<");
				}, 0.3);

				const tl7part1 = gsap.timeline({ paused: true });
				const tl7part2 = gsap.timeline({ paused: true });

				const tl7 = gsap.timeline({
					scrollTrigger: {
						trigger: "#anchor-5",
						start: `top ${headerHeight}px`,
						end: "+=200%",
						invalidateOnRefresh: true,
						toggleActions: "play none none reverse",
						pin: true,
						onUpdate: (self) => {
							const progress = self.progress; // значение от 0 (начало фиксации) до 1 (конец фиксации)

							// Запускаем первый цикл
							if (progress > 0.3 && progress < 0.6) {
								tl7part1.play();
							}

							// Скролл ниже 55%
							if (progress >= 0.65) {
								if (tl7part1.progress() === 1) {
									tl7part2.play();
								} else {
									tl7part1.progress(1);
									tl7part2.play();
								}
							}

							// Реверс
							if (progress < 0.6) {
								tl7part2.reverse();
							}

							if (progress === 0) {
								if (tl7part2.progress() === 0) {
									tl7part1.reverse();
								} else {
									tl7part2.progress(0);
									tl7part1.reverse();
								}
							}
						}
					}
				});

				const gallery = document.querySelector(".gallery");
				const galleryTl = gsap.timeline();
				setIntersection(gallery, () => {
					galleryTl
						.to(".gallery__image", {
							opacity: 1,
							stagger: 0.2,
							duration: 0.5,
							ease: "none"
						});
				}, 0.3);

				tl7part1
					.to(".gallery-anim-image", {
						opacity: 0,
						duration: 0.2,
						ease: "none"
					})
					.to(".gallery-anim-image-last", {
						opacity: 1,
						duration: 0.2,
						ease: "none"
					});

				tl7part2
					.to(".gallery__logo-icon", {
						y: -150,
						scale: 0.5,
						duration: 0.5,
						ease: "none"
					})
					.to(".gallery__text", {
						opacity: 1,
						y: 0,
						duration: 0.5,
						ease: "none"
					})
					.to(".gallery__link", {
						opacity: 1,
						y: 0,
						duration: 0.5,
						ease: "none"
					});
			}
		);

		// Функция плавного вращения в цикле анимации
		/*let targetRotation = 0;

		function toggleDoorCode() {
			if (!doorObject) return;

			if (!isDoorOpen) {
				targetRotation = Math.PI / 2; // Поворот на 90 градусов (в радианах)
				isDoorOpen = true;
			} else {
				targetRotation = 0; // Возврат в исходное положение
				isDoorOpen = false;
			}
		}*/

		//window.addEventListener('click', toggleDoorCode);

		window.addEventListener("resize", onWindowResize, false);

		function onWindowResize() {
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		}

		function animate() {
			requestAnimationFrame(animate);

			// Небольшое автоматическое вращение модели, если она загрузилась
			/*if (model) {
				model.rotation.y += 0.005;
			}*/

			/*if (doorObject) {
				doorObject.rotation.y = THREE.MathUtils.lerp(doorObject.rotation.y, targetRotation, 0.1);
			}*/

			//controls.update(); // Обновление контроллеров мыши
			renderer.render(scene, camera);
		}

		animate();
	});

	mm.add("(max-width: 1279px)", () => {
		const tl1 = gsap.timeline({
			scrollTrigger: {
				trigger: "#anchor-1",
				start: "top top",
				end: "bottom top",
				invalidateOnRefresh: true,
				paused: true,
				//toggleActions: "play none reset none",
				onUpdate: (self) => {
					const progress = self.progress; // значение от 0 (начало фиксации) до 1 (конец фиксации)

					if (progress > 0 && progress < 0.7) {
						tl1.play();
					} else {
						tl1.pause(0);
						self.kill();
					}
				}
			}
		});

		const coords = getMoveCoords();

		tl1
			.to(".hero__machine--1", {
				xPercent: 0,
				y: "-8vw",
				left: 0,
				scale: 0.2,
				rotate: 0,
				duration: 0.7,
				ease: "power2.out",
				overwrite: "auto"
			})
			.to(".hero__machine--2", {
				xPercent: -75,
				y: "1.6vw",
				scale: 0.2,
				rotate: "5deg",
				ease: "power2.out",
				overwrite: "auto"
			}, "<")
			.to(".hero__machine--3", {
				xPercent: -159,
				y: "0.6vw",
				right: 0,
				scale: 0.2,
				rotate: 0,
				ease: "power2.out",
				overwrite: "auto"
			}, "<");

		tl1
			.to(".hero__label--1", {
				animation: "none",
				xPercent: -36,
				y: -100,
				left: 0,
				scale: 0.8,
				rotate: "-3deg",
				duration: 0.7,
				ease: "power2.out",
				overwrite: "auto"
			}, "<")
			.to(".hero__label--2", {
				animation: "none",
				xPercent: 7,
				y: -39,
				left: 0,
				scale: 0.8,
				rotate: 0,
				ease: "power2.out",
				overwrite: "auto"
			}, "<")
			.to(".hero__label--3", {
				animation: "none",
				xPercent: -40,
				y: -132,
				left: 0,
				scale: 0.8,
				rotate: "5deg",
				ease: "power2.out",
				overwrite: "auto"
			}, "<");

		tl1
			.to(".hero__machines", {
				x: coords.x + 70,
				y: coords.y,
				duration: 0.7,
				ease: "power2.out",
				overwrite: "auto"
			}, "+=0.3")
			.to(".blob--1", {
				opacity: 0,
				scale: 0,
				ease: "power2.out",
				duration: 1
			}, "+=0.5")
			.to(".hero__left", {
				x: "-100vw",
				ease: "power2.out",
				overwrite: "auto"
			}, "<");

		const serverCaptions = document.querySelector(".server__caption");
		const serverConfig = document.querySelector(".server__config");
		const serverBoards = document.querySelector(".board");
		const serverWidgets = document.querySelector(".server__widget");
		const serverSlider = document.querySelector(".server-slider");
		const advantages = document.querySelector(".advantages");
		const advantagesItems = document.querySelector(".advantages__item");
		const aboutTitle = document.querySelector(".about__title");
		const aboutText = document.querySelector(".about__text");
		const aboutContent = document.querySelector(".about__content");
		const chart = document.querySelector(".chart");
		const chartAnim1 = document.querySelector(".chart-anim-1");
		const chartBars = document.querySelector(".chart__bar");
		const galleryLogo = document.querySelector(".gallery__logo-icon");
		const galleryText = document.querySelector(".gallery__text");
		const galleryLink = document.querySelector(".gallery__link");
		const galleryImages = document.querySelector(".gallery__image");

		setIntersection(serverCaptions, () => {
			gsap
				.to(".server__caption", {
					opacity: 1,
					duration: 0.7,
					stagger: 0.7,
					ease: "none"
				});
		});

		setIntersection(serverConfig, () => {
			gsap
				.to(".server__config", {
					opacity: 1,
					duration: 0.7,
					ease: "none"
				});
		});

		setIntersection(serverBoards, () => {
			gsap
				.to(".board", {
					opacity: 1,
					duration: 0.7,
					stagger: 0.3,
					ease: "none"
				});
		});

		setIntersection(serverWidgets, () => {
			const tlWidgets = gsap.timeline();
			const typingText = `SELECT
  SUM(amount) AS revenue,
  COUNT(*) AS tx_count,
  AVG(amount) AS avg_check
FROM transactions
WHERE status = 'ok'
  AND created_at >= NOW() - "7d"
GROUP BY day
ORDER BY day ASC`;
			const typingObj = { length: 0 };

			tlWidgets
				.to(".widget__link", {
					opacity: 1,
					x: 0,
					duration: 0.3,
					ease: "none",
					overwrite: "auto"
				})
				.to(".widget__title", {
					opacity: 1,
					duration: 0.3,
					ease: "none",
					overwrite: "auto"
				})
				.to(".widget__code, .widget__stats, .widget__bars, .widget__chart-icon", {
					opacity: 1,
					stagger: 0.1,
					duration: 0.5,
					ease: "none",
					overwrite: "auto"
				})
				.to(".widget__table tr", {
					opacity: 1,
					y: 0,
					borderColor: "rgba(22, 22, 22, 0.6)",
					stagger: 0.1,
					duration: 0.3,
					ease: "none",
					overwrite: "auto"
				}, "<")
				.to(typingObj, {
					length: typingText.length,
					duration: 3,
					ease: "none",
					overwrite: "auto",
					onUpdate: () => {
						document.querySelector(".widget__code").textContent = typingText.substring(0, Math.floor(typingObj.length));
					}
				}, "<")
				.fromTo(".widget__bar-progress span", {
					width: 0
				}, {
					width: (index, target) => getComputedStyle(target).getPropertyValue("--percent").trim(),
					stagger: 0.1,
					duration: 0.5,
					ease: "none"
				}, "<");
		});

		setIntersection(serverSlider, () => {
			gsap
				.to(".server-slider", {
					opacity: 1,
					duration: 0.7,
					ease: "none"
				});
		});

		setIntersection(advantages, () => {
			gsap
				.to(".advantages", {
					opacity: 1,
					duration: 0.7,
					ease: "none"
				});
		});

		setIntersection(advantagesItems, () => {
			gsap
				.to(".advantages__item", {
					opacity: 1,
					duration: 0.7,
					stagger: 0.3,
					ease: "none"
				});
		});

		setIntersection(aboutTitle, () => {
			gsap
				.to(".about__title", {
					opacity: 1,
					duration: 0.7,
					ease: "none"
				});
		});

		setIntersection(aboutText, () => {
			gsap
				.to(".about__text", {
					opacity: 1,
					duration: 0.7,
					ease: "none"
				});
		});

		setIntersection(aboutContent, () => {
			gsap
				.to(".about__content", {
					opacity: 1,
					duration: 0.7,
					ease: "none"
				});
		});

		setIntersection(chart, () => {
			gsap
				.to(".chart", {
					opacity: 1,
					duration: 0.7,
					stagger: 0.3,
					ease: "none"
				});
		});

		setIntersection(chartAnim1, () => {
			gsap
				.to(".chart-anim-1", {
					opacity: 1,
					y: 0,
					duration: 0.7,
					stagger: 0.3,
					ease: "none"
				});
		});

		setIntersection(chartBars, () => {
			gsap
				.to(".chart__bar", {
					height: (index, target) => getComputedStyle(target).getPropertyValue("--bar-height").trim(),
					duration: 0.7,
					stagger: 0.3,
					ease: "none"
				});
		});

		setIntersection(galleryLogo, () => {
			gsap
				.to(".gallery__logo-icon", {
					opacity: 1,
					duration: 0.7,
					ease: "none"
				});
		});

		setIntersection(galleryText, () => {
			gsap
				.to(".gallery__text", {
					opacity: 1,
					duration: 0.7,
					ease: "none"
				});
		});

		setIntersection(galleryLink, () => {
			gsap
				.to(".gallery__link", {
					opacity: 1,
					duration: 0.7,
					ease: "none"
				});
		});

		setIntersection(galleryImages, () => {
			gsap
				.to(".gallery__image", {
					opacity: 1,
					duration: 0.7,
					stagger: 0.3,
					ease: "none"
				});
		});
	});







	const serverCarousel = document.querySelectorAll(".server-slider");

	if (serverCarousel.length > 0) {
		serverCarousel.forEach(el => {
			const serverPagination = el.querySelector(".server-slider__pagination");
			const tlSlide1 = gsap.timeline({ paused: true });
			const tlSlide2 = gsap.timeline({ paused: true });

			tlSlide1
				.to(".server__config", {
					opacity: 1,
					x: 0,
					duration: 0.5,
					ease: "power2.out",
					overwrite: "auto"
				})
				.to(".board--1", {
					opacity: 1,
					x: 0,
					stagger: 0.1,
					duration: 0.3,
					ease: "power2.out",
					overwrite: "auto"
				})
				.to(".board--2", {
					opacity: 1,
					x: 0,
					stagger: 0.1,
					duration: 0.3,
					ease: "power2.out",
					overwrite: "auto"
				})
				.to(".board--3", {
					opacity: 1,
					x: 0,
					stagger: 0.1,
					duration: 0.3,
					ease: "power2.out",
					overwrite: "auto"
				})
				.to(".board--4", {
					opacity: 1,
					x: 0,
					stagger: 0.1,
					duration: 0.3,
					ease: "power2.out",
					overwrite: "auto"
				});

			const typingText = `SELECT
  SUM(amount) AS revenue,
  COUNT(*) AS tx_count,
  AVG(amount) AS avg_check
FROM transactions
WHERE status = 'ok'
  AND created_at >= NOW() - "7d"
GROUP BY day
ORDER BY day ASC`;
			const typingObj = { length: 0 };

			tlSlide2
				.to(".widget__link", {
					opacity: 1,
					x: 0,
					duration: 0.3,
					ease: "none",
					overwrite: "auto"
				})
				.to(".widget__title", {
					opacity: 1,
					duration: 0.3,
					ease: "none",
					overwrite: "auto"
				})
				.to(".widget__code, .widget__stats, .widget__bars, .widget__chart-icon", {
					opacity: 1,
					stagger: 0.1,
					duration: 0.5,
					ease: "none",
					overwrite: "auto"
				})
				.to(".widget__table tr", {
					opacity: 1,
					y: 0,
					borderColor: "rgba(22, 22, 22, 0.6)",
					stagger: 0.1,
					duration: 0.3,
					ease: "none",
					overwrite: "auto"
				}, "<")
				.to(typingObj, {
					length: typingText.length,
					duration: 3,
					ease: "none",
					overwrite: "auto",
					onUpdate: () => {
						document.querySelector(".widget__code").textContent = typingText.substring(0, Math.floor(typingObj.length));
					}
				}, "<")
				.fromTo(".widget__bar-progress span", {
					width: 0
				}, {
					width: (index, target) => getComputedStyle(target).getPropertyValue("--percent").trim(),
					stagger: 0.1,
					duration: 0.5,
					ease: "none"
				}, "<");

			const slider = new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 10,
				effect: "fade",
				fadeEffect: {
					crossFade: true
				},
				autoplay: {
					delay: 7000
				},
				pagination: {
					el: serverPagination,
					clickable: true
				},
				on: {
					init: () => {
						if (media1280) {
							tlSlide1.play();
						}
					},
					slideChange: (swiper) => {
						if (media1280) {
							if (swiper.realIndex === 0) {
								tlSlide1.restart();
								tlSlide2.pause(0);
								document.querySelector(".server").style.backgroundColor = "#ffffff";
							}

							if (swiper.realIndex === 1) {
								tlSlide2.restart();
								tlSlide1.pause(0);
								document.querySelector(".server").style.backgroundColor = "#f2f2f2";
							}
						}
					}
				}
			});
		});
	}

	const productCarousel = document.querySelectorAll(".product__slider");

	if (productCarousel.length > 0) {
		productCarousel.forEach(el => {
			const productPagination = el.querySelector(".product__pagination");

			const slider = new Swiper(el, {
				initialSlide: 1,
				slidesPerView: 1,
				centeredSlides: true,
				spaceBetween: 10,
				loop: true,
				loopedSlides: 3,
				effect: "creative",
				creativeEffect: {
					prev: {
						translate: ["-40%", 0, 0],
						scale: 0.7,
						opacity: 0.6
					},
					next: {
						translate: ["40%", 0, 0],
						scale: 0.7,
						opacity: 0.6
					}
				},
				pagination: {
					el: productPagination,
					clickable: true
				},
				keyboard: {
					enabled: true,
					onlyInViewport: true,
				},
				autoplay: {
					delay: 5000
				},
				on: {
					click: function (swiper, event) {
						const clickedSlide = event.target.closest('.swiper-slide');
						if (clickedSlide) {
							const realIndex = parseInt(clickedSlide.getAttribute('data-swiper-slide-index'), 10);
							swiper.slideToLoop(realIndex);
						}
					},
				},
				breakpoints: {
					0: {
						effect: "fade",
						slidesPerView: 1,
						spaceBetween: 10
					},
					576: {
						effect: "creative",
						slidesPerView: "auto"
					}
				}
			});
		});
	}
});
