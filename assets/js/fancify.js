const $window = $(window)
const $body = $("body")
const identity = $("#identity")[0]
const $animate = $("[class^=col]")
let $svg

// Scale triangle pattern according to window dimensions
function resize() {
	if ($svg)
		$svg.remove()

	// Triangle pattern
	const pattern = Trianglify({
		width: $window.width() || 1,
		height: $window.height() || 1,
		cell_size: 50,
		seed: "bennett",
		x_colors: "RdBu",
		y_colors: "YlGnBu"
	})

	$svg = $(pattern.svg()).attr("id", "cover")
	$body.prepend($svg)
}
resize()
$window.resize(resize)

// Reveal animation on scroll
$animate.attr({
	"data-animate": "fadeIn",
	"data-duration": ".6s"
}).scrolla({
	mobile: false,
	once: true
})

// Start typing if the text is within viewport
function startTyping() {
	const rect = identity.getBoundingClientRect()

	if (rect.top >= 0 && rect.bottom <= $window.height()) {
		// Typing animation
		new Typed(identity, {
			strings: [
				"I'm a programmer.",
				"I'm an innovator.",
				"I'm a tech entrepreneur.",
				"I'm a lifelong learner.",
				"My name is Bennett."
			],
			typeSpeed: 45,
			backSpeed: 45
		})

		$window.off("scroll", startTyping)
	}
}
$window.scroll(startTyping)
startTyping()
