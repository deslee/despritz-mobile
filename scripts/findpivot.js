define(function() {
	var pivot = function(word) {
		var bestLetter = 1;
		var wordLength = word.length;

		switch (wordLength) {
		case 1:
			bestLetter = 0; // first
			break;
		case 2:
		case 3:
		case 4:
		case 5:
			bestLetter = 1; // second
			break;
		case 6:
		case 7:
		case 8:
		case 9:
			bestLetter = 2; // third
			break;
		case 10:
		case 11:
		case 12:
		case 13:
			bestLetter = 3; // fourth
			break;
		default:
			bestLetter = 4; // fifth
		};

		// maybe: make correction in case of space
		if (word.charAt(bestLetter) == ' ') {
			bestLetter--;
		}

		return bestLetter;
	};
	return pivot;
})