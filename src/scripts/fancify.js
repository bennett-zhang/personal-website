"use strict"

window.jQuery = window.$ = require("jquery")
window.Popper = require("popper")
require("bootstrap")
const Trianglify = require("trianglify.min")
require("jquery.inview")
const Typed = require("typed")

const $window = $(window)
const $body = $("body")
const $identitySpan = $("<span>").appendTo("#identity")
const $col = $(".col, [class^=col-]")
let $cover

// Enable tooltips
$("[data-toggle=tooltip]").tooltip()

// Scale triangle pattern according to window dimensions
function resize() {
	if ($cover)
		$cover.remove()

	// Triangle pattern
	const pattern = Trianglify({
		width: $window.width() || 1,
		height: $window.height() || 1,
		seed: "bennett",
		x_colors: "RdBu",
		y_colors: "YlGnBu"
	})

	$cover = $(pattern.svg()).attr("id", "cover")
	$body.prepend($cover)
}
resize()
$window.resize(resize)

// Trigger reveal animation when element is within viewport
$col.addClass("invisible")
$col.on("inview", (evt, visible) => {
	if (visible) {
		const $target = $(evt.target)

		$target.removeClass("invisible")
		$target.addClass("animated reveal")

		$target.off("inview")
	}
})

// Start typing if the text is within viewport
$identitySpan.on("inview", (evt, visible) => {
	if (visible) {
		// Typing animation
		new Typed($identitySpan[0], {
			stringsElement: "#identity-strings",
			typeSpeed: 45,
			backSpeed: 45
		})

		$identitySpan.off("inview")
	}
})
