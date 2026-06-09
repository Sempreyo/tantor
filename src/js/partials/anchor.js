document.addEventListener("DOMContentLoaded", () => {
	const anchors = document.querySelectorAll('.anchor');

	if (anchors && anchors.length > 0) {
		anchors.forEach(anchor => {
			anchor.addEventListener('click', function (e) {
				if (window.location.hash) {
					document.querySelector(window.location.hash).scrollIntoView({
						behavior: 'smooth'
					});
				}
			});
		});
	}
});
