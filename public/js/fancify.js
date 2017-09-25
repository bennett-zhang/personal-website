$(() => {
	const $window = $(window)
	const $html_body = $("html, body")
	const $layers = $(".parallax-layer:not([data-speed=1])")
	const $animate = $("[class^=col]")

	$window.scroll(evt => {
		const scrollTop = $window.scrollTop()

		for (let i = 0; i < $layers.length; i++) {
			const $layer = $layers.eq(i)
			const speed = $layer.attr("data-speed")
			const y = -scrollTop * speed
			$layer.css("transform", `translate(0, ${y}px)`)
		}
	})

	$animate.attr({
		"data-animate": "fadeInDown",
		"data-duration": ".6s"
	}).scrolla({
		mobile: true,
		once: true
	})

	$("a").click(evt => {
		const hash = evt.target.hash

		if (hash) {
			evt.preventDefault()

			$html_body.animate({
				scrollTop: $(hash).offset().top
			}, 1000)
		}
	})

	new Typed("#identity", {
		strings: [
			"My name is Bennett.^2000",
			"I'm an innovator.",
			"I'm a tech entrepreneur.",
			"I'm a lifelong learner."
		],
		typeSpeed: 80,
		backSpeed: 80,
		loop: true
	})

	$(".typed-cursor").addClass("animated flash infinite")
})
