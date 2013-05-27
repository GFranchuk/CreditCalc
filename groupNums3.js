groupNums = (
	function() {
		var r = /(\d{3})/g;
		return function(text) {
			text = String(text);
			return text.split("").reverse().join("").replace(r, "$1 ").split("").reverse().join("");
		}
	}
)()
