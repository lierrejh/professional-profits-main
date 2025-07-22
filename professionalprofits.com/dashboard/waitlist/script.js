/** @format */

// Make sure Firebase is initialized before using `auth`
document.addEventListener("DOMContentLoaded", function () {
	const hamBurger = document.querySelector(".toggle-btn");

	hamBurger.addEventListener("click", function () {
		document.querySelector("#sidebar").classList.toggle("expand");
	});


});
