ready(() => {
	// Display words counter for post submit form
	let textArea = document.querySelector("#id_text");
	textArea.addEventListener("keyup", () => {
		let counter = countWords(textArea.value);
		if (counter > 0 && counter == 1) {
			document.querySelector("#word-counter").innerHTML = `${counter} word`;
		} else if (counter > 1) {
			document.querySelector("#word-counter").innerHTML = `${counter} words`;
		}
	});
});
