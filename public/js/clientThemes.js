var clientThemes = [
	'autumn',
	'mountain',
	'last'
];


var body = document.body;
var theme = clientThemes[Math.floor(Math.random() * clientThemes.length)];
body.id = theme + '_theme';